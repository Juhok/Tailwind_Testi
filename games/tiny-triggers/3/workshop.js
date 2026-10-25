// Shared tactile runtime. The scene catalog supplies physical props, ordered
// operations and visible consequences; gesture recognition lives here.
let workshop = null;
const HOLD_MODES = new Set([
  "soak",
  "pour",
  "squeeze",
  "press",
  "fuel",
  "wait",
]);
const PATH_MODES = new Set(["scrub", "sweep", "smooth", "walk"]);
function isWorkshop() {
  return !!workshop;
}
function openWorkshop(def) {
  workshop = def
    ? {
        def,
        props: def.pieces.map((p) => ({
          ...p,
          x: p.x,
          y: p.y,
          home: { x: p.x, y: p.y },
        })),
        fixtures: def.fixtures.map((f) => ({ ...f })),
        step: 0,
        gesture: null,
        time: 0,
        anim: [],
        result: [],
        fuel: 0,
      }
    : null;
}
function taskDown(e) {
  const w = workshop;
  if (!w || finished || transition || !active || w.gesture) return;
  const s = w.def.steps[w.step],
    o = w.props.find((o) => o.id === s.id),
    p = point(e);
  if (
    !o ||
    o.hidden ||
    Math.abs(p.x - o.x) > (o.w || 80) / 2 + 8 ||
    Math.abs(p.y - o.y) > (o.h || 76) / 2 + 8
  )
    return;
  startAudio();
  w.gesture = {
    o,
    start: p,
    origin: { x: o.x, y: o.y, angle: o.angle || 0 },
    offset: { x: p.x - o.x, y: p.y - o.y },
    path: [p],
    length: 0,
    held: 0,
    route: 0,
    pointer: e.pointerId,
  };
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
}
function taskMove(e) {
  const w = workshop,
    g = w?.gesture;
  if (!g || g.pointer !== e.pointerId) return;
  const p = point(e),
    last = g.path.at(-1),
    s = w.def.steps[w.step];
  g.length += Math.hypot(p.x - last.x, p.y - last.y);
  g.path.push(p);
  g.o.x = Math.max(24, Math.min(456, p.x - g.offset.x));
  g.o.y = Math.max(30, Math.min(230, p.y - g.offset.y));
  if (["twist", "bend", "fold"].includes(s.mode))
    g.o.angle =
      g.origin.angle + Math.atan2(p.y - g.start.y, p.x - g.start.x) * 0.35;
  if (s.mode === "route" && s.fx.route) {
    const target = s.fx.route[g.route];
    if (target && near(p, ...target, 38)) g.route++;
  }
}
function taskCancel() {
  const g = workshop?.gesture;
  if (!g) return;
  Object.assign(g.o, g.origin);
  workshop.gesture = null;
}
function taskUp(e) {
  const w = workshop,
    g = w?.gesture;
  if (!g || g.pointer !== e.pointerId) return;
  const s = w.def.steps[w.step];
  const distance = Math.hypot(g.o.x - g.origin.x, g.o.y - g.origin.y);
  let valid = near(g.o, ...s.to, s.radius || 32);
  if (HOLD_MODES.has(s.mode))
    valid &&=
      g.held >= (s.mode === "wait" ? 1.5 : s.mode === "soak" ? 1.3 : 0.7);
  else if (PATH_MODES.has(s.mode)) valid &&= g.length >= 65;
  else valid &&= distance >= 5;
  if (s.mode === "route") valid &&= g.route === s.fx.route.length;
  if (s.mode === "cut") valid &&= g.length >= 65;
  if (!valid) {
    Object.assign(g.o, g.origin);
    w.gesture = null;
    say(
      HOLD_MODES.has(s.mode)
        ? "Hold it there a little longer."
        : "Not quite. Follow the little arrow.",
    );
    return;
  }
  const o = g.o,
    fx = s.fx;
  o.x = s.to[0];
  o.y = s.to[1];
  if (fx.reset) {
    o.x = o.home.x;
    o.y = o.home.y;
  }
  for (const key of [
    "angle",
    "scale",
    "scaleX",
    "scaleY",
    "color",
    "mark",
    "art",
  ])
    if (fx[key] !== undefined) o[key] = fx[key];
  if (fx.hide) o.hidden = true;
  if (fx.reveal) w.props.find((p) => p.id === fx.reveal).hidden = false;
  if (fx.spawn) w.fixtures.push(...fx.spawn.map((f) => ({ ...f })));
  if (fx.clear) fx.clear.forEach((i) => (w.fixtures[i].hidden = true));
  if (fx.sink) w.anim.push({ kind: "sink", o, startY: o.y, t: 0 });
  if (fx.float) o.floating = true;
  w.result.push(s.id);
  w.step++;
  w.gesture = null;
  w.finishAt = w.time;
  chime(660, 0.15, 0.035);
  if (w.step === w.def.steps.length) {
    win();
    say(w.def.verdict);
  } else say("");
}
function updateWorkshop(dt) {
  const w = workshop;
  if (!w) return;
  w.time += dt;
  const g = w.gesture,
    s = w.def.steps[w.step];
  if (g && s) {
    const at = near(g.o, ...s.to, s.radius || 32);
    if (HOLD_MODES.has(s.mode)) {
      g.held = at ? g.held + dt : 0;
      if (at && ["pour", "fuel"].includes(s.mode)) g.o.angle = 0.8;
      if (s.mode === "fuel") w.fuel = Math.min(0.5, (g.held / 0.7) * 0.5);
    }
  }
  for (const a of w.anim) {
    a.t = Math.min(1, a.t + dt * 0.8);
    a.o.y = a.startY + a.t * 45;
    a.o.opacity = 1 - a.t * 0.8;
  }
}
function drawWorkshop() {
  const w = workshop;
  box(0, 0, 480, 270, "#202c3a");
  box(0, 225, 480, 45, "#18222e");
  line(0, 225, 480, 225, "#43526a", 1);
  for (let i = 0; i < 7; i++) box(35 + i * 65, 248, 25, 2, "#29384b");
  for (const f of w.fixtures) if (!f.hidden) drawProp(f);
  const g = w.gesture,
    s = w.def.steps[w.step];
  if (g && s) {
    ctx.save();
    ctx.strokeStyle = "#88b4ae88";
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(s.to[0] - 25, s.to[1] - 25, 50, 50);
    ctx.restore();
    if (["tear", "pull", "peel", "fold", "bend"].includes(s.mode))
      line(g.origin.x, g.origin.y, g.o.x, g.o.y, "#d7c79b", 3);
    if (s.mode === "route") {
      let prior = g.start;
      for (const p of g.path) {
        line(prior.x, prior.y, p.x, p.y, "#171c23", 4);
        prior = p;
      }
    }
  }
  if (w.def.id === "headphones" && w.step >= 1) {
    const phones = w.props.find(p => p.id === "phones");
    line(phones.x - 30, phones.y + 40, 140, 169, "#10161f", 4);
  }
  if (w.def.id === "laces") {
    for (const o of w.props) line(245, 145, o.x, o.y, "#f5e9cd", 2);
  }
  for (const o of w.props) if (o !== g?.o && !o.hidden) drawProp(o);
  if (g) drawProp(g.o);
  if (g && s && g.held > 0.04) {
    const ratio = Math.min(
      1,
      g.held / (s.mode === "wait" ? 1.5 : s.mode === "soak" ? 1.3 : 0.7),
    );
    if (["pour", "fuel"].includes(s.mode)) {
      line(
        g.o.x + 16,
        g.o.y + 15,
        s.to[0] + 12,
        s.to[1] + 55,
        s.mode === "fuel" ? "#d5b767" : "#b9d9df",
        4,
      );
      for (let i = 0; i < 6; i++)
        box(
          s.to[0] - 10 + i * 6,
          s.to[1] + 50 + Math.sin(w.time * 15 + i) * 3,
          3,
          2,
          "#b9d9df",
        );
    }
    box(g.o.x - 25, g.o.y - 45, 50, 4, "#131b25");
    box(g.o.x - 25, g.o.y - 45, 50 * ratio, 4, "#90c3ac");
    if (s.mode === "soak") {
      ellipse(s.to[0], s.to[1] + 5, 24, 6, "#97aab533");
    }
    if (s.mode === "squeeze") {
      line(g.o.x - 42, g.o.y, g.o.x - 25, g.o.y, "#dfc886", 2);
      line(g.o.x + 42, g.o.y, g.o.x + 25, g.o.y, "#dfc886", 2);
    }
  }
  if (s && !finished) {
    const o = w.props.find((o) => o.id === s.id);
    text(s.cue, 240, 251, 10);
    if (!g && o) {
      const y = o.y - (o.h || 65) / 2 - 13;
      line(o.x, y - 7, o.x, y, "#ddc686", 2);
      poly(
        [
          [o.x - 4, y - 3],
          [o.x + 4, y - 3],
          [o.x, y + 3],
        ],
        "#ddc686",
      );
    }
    for (let i = 0; i < w.def.steps.length; i++)
      box(212 + i * 9, 265, 5, 2, i < w.step ? "#8fbaa6" : "#47566a");
  }
  if (finished) {
    box(15, 14, 87, 18, "#6b9680");
    text("WELL. DONE.", 58, 27, 10, "#fff9ea");
  }
}
function drawProp(p) {
  if (p.hidden) return;
  ctx.save();
  ctx.translate(p.x, p.y + (p.floating ? Math.sin(workshop.time * 2) * 2 : 0));
  ctx.rotate(p.angle || 0);
  ctx.scale((p.scale || 1) * (p.scaleX || 1), (p.scale || 1) * (p.scaleY || 1));
  ctx.globalAlpha = p.opacity === undefined ? 1 : p.opacity;
  paint(p.art, p);
  ctx.restore();
}
// Hand-drawn low-resolution prop vocabulary. No fonts/emoji are used as props.
function paint(art, p = {}) {
  const cream = "#f5e9cd",
    gold = "#dfb75f",
    wood = "#ab7d56",
    ink = "#263444",
    blue = "#81acc0",
    red = "#bd6673",
    green = "#88a479",
    color = p.color || blue;
  const r = (x, y, w, h, c) => box(x, y, w, h, c),
    e = (x, y, xr, yr, c) => ellipse(x, y, xr, yr, c),
    l = (x, y, xx, yy, c = cream, w = 2) => line(x, y, xx, yy, c, w),
    t = (s, x, y, size = 10, c = ink) => text(s, x, y, size, c),
    P = (a, c) => poly(a, c);
  const paper = () => {
    r(-30, -40, 60, 80, cream);
    for (let i = 0; i < 5; i++) r(-21, -22 + i * 12, 41, 2, "#a2b1b9");
  };
  const cup = () => {
    e(40, -1, 15, 19, cream);
    e(40, -1, 9, 12, ink);
    r(-35, -26, 70, 54, cream);
    e(0, 28, 35, 9, cream);
    e(0, -26, 35, 9, "#6d4c35");
    l(-27, -18, -27, 15, "#fff8e8", 3);
  };
  switch (art) {
    case "plate":
      e(0, 0, 83, 16, "#658798");
      e(0, -2, 71, 10, "#aec8d0");
      break;
    case "butter":
      r(-48, -22, 96, 42, gold);
      P(
        [
          [-48, -22],
          [-32, -35],
          [60, -35],
          [48, -22],
        ],
        "#f6d978",
      );
      P(
        [
          [48, -22],
          [60, -35],
          [60, 10],
          [48, 20],
        ],
        "#b98b40",
      );
      break;
    case "crater":
      e(0, 0, 24, 12, "#68523b");
      e(0, -3, 18, 7, "#413829");
      break;
    case "knife":
    case "butterknife":
      r(-7, -33, 14, 34, wood);
      P(
        [
          [-7, 1],
          [7, 1],
          [7, 48],
          [-2, 54],
          [-7, 40],
        ],
        "#c2d2d9",
      );
      if (art === "butterknife") r(-7, 17, 16, 19, gold);
      if (p.color) r(-7, 12, 14, 20, p.color);
      break;
    case "shelf":
      r(-100, 30, 200, 12, wood);
      r(-108, -72, 9, 120, wood);
      r(99, -72, 9, 120, wood);
      break;
    case "book":
      r(-15, -36, 30, 72, color);
      r(-11, -31, 22, 3, gold);
      r(-11, 28, 22, 3, gold);
      t("ABC", 0, -8, 9, cream);
      t("↑", 0, 15, 15, cream);
      break;
    case "sock":
      P(
        [
          [-17, -35],
          [13, -35],
          [13, 12],
          [28, 18],
          [28, 33],
          [-12, 33],
          [-20, 20],
        ],
        color,
      );
      r(-17, -30, 30, 8, cream);
      r(-15, -4, 28, 5, cream);
      break;
    case "basket":
      r(-57, -15, 114, 55, wood);
      for (let i = 0; i < 7; i++) r(-50 + i * 16, -9, 8, 43, "#604d3b");
      r(-61, -20, 122, 9, gold);
      break;
    case "usbport":
      r(-36, -18, 72, 36, "#101820");
      r(-30, -13, 60, 26, "#7f909b");
      r(-23, -8, 46, 16, "#18232f");
      r(-20, 1, 40, 5, "#7892a1");
      break;
    case "usb":
      r(-37, -17, 46, 34, ink);
      r(9, -14, 35, 28, "#bccbd1");
      r(17, -7, 9, 7, "#243746");
      r(31, -7, 8, 7, "#243746");
      l(-36, 0, -65, 0, "#101923", 6);
      break;
    case "cross":
      l(-12, -12, 12, 12, red, 4);
      l(12, -12, -12, 12, red, 4);
      break;
    case "jar":
      r(-42, -45, 84, 95, blue);
      r(-39, -52, 78, 13, "#536e8f");
      r(-32, -35, 64, 70, "#b8c7a1");
      break;
    case "sticker":
      r(-37, -14, 74, 28, cream);
      t("2.99", 0, 4, 16);
      break;
    case "paper":
    case "letter":
      paper();
      break;
    case "residue":
      r(-5, -16, 10, 32, cream);
      r(-9, -8, 7, 10, cream);
      break;
    case "dust":
      for (let i = 0; i < 20; i++)
        r(-25 + ((i * 17) % 50), -10 + ((i * 13) % 25), 3 + (i % 3), 2, wood);
      break;
    case "crumb":
      r(-2, -2, 4, 4, gold);
      break;
    case "dustpan":
      P(
        [
          [-39, -17],
          [35, -17],
          [48, 28],
          [-48, 28],
        ],
        blue,
      );
      r(-7, -49, 14, 34, blue);
      break;
    case "broom":
    case "mop":
      r(-4, -54, 8, 70, wood);
      r(-29, 15, 58, 8, blue);
      for (let i = 0; i < 12; i++)
        r(-29 + i * 5, 23, 3, 24, art === "mop" ? "#b8cbd0" : gold);
      break;
    case "cake":
      e(0, 20, 75, 28, cream);
      r(-75, -21, 150, 42, red);
      e(0, -21, 75, 28, "#edd3b7");
      for (let i = 0; i < 8; i++)
        e(Math.cos(i * 0.78) * 54, Math.sin(i * 0.78) * 17 - 21, 5, 4, red);
      break;
    case "cakepiece":
      r(-19, -18, 38, 37, red);
      r(-19, -20, 38, 9, cream);
      break;
    case "carton":
    case "juice":
      r(-30, -43, 60, 91, art === "juice" ? "#d6a359" : "#eff0de");
      P(
        [
          [-30, -43],
          [-16, -60],
          [16, -60],
          [30, -43],
        ],
        blue,
      );
      r(-30, -20, 60, 30, art === "juice" ? "#aa6246" : "#42799f");
      t(art === "juice" ? "JUICE" : "MILK", 0, 0, 12, cream);
      if (art === "juice") e(8, -47, 4, 3, ink);
      break;
    case "flap":
      P(
        [
          [-14, -9],
          [15, -9],
          [15, 14],
          [-10, 8],
        ],
        cream,
      );
      break;
    case "ragged":
    case "fringe":
      for (let i = 0; i < 12; i++)
        r(-30 + i * 5, -4, 3, 8 + (i % 4) * 3, cream);
      break;
    case "bread":
    case "tornbread":
      P(
        [
          [-52, -28],
          [-59, -45],
          [-40, -58],
          [35, -58],
          [57, -43],
          [51, -26],
          [47, 48],
          [-47, 48],
        ],
        wood,
      );
      P(
        [
          [-43, -29],
          [-47, -41],
          [-34, -49],
          [32, -49],
          [45, -39],
          [41, -26],
          [39, 39],
          [-39, 39],
        ],
        cream,
      );
      if (art === "tornbread") {
        e(-18, -27, 21, 13, "#aa506c");
        e(20, 20, 17, 10, "#aa506c");
        r(-18, -5, 32, 15, wood);
        r(-15, -11, 25, 6, gold);
      }
      break;
    case "cheese":
      r(-27, -37, 54, 74, gold);
      e(-9, -10, 5, 5, "#c39947");
      e(13, 19, 7, 7, "#c39947");
      break;
    case "spaghetti":
    case "brokenpasta":
      for (let i = 0; i < 10; i++) {
        l(
          -21 + i * 4,
          -50,
          -21 + i * 4,
          art === "brokenpasta" ? -4 : 50,
          gold,
          2,
        );
        if (art === "brokenpasta") l(-17 + i * 4, 9, -6 + i * 4, 48, gold, 2);
      }
      break;
    case "pot":
      e(0, 30, 62, 15, "#526d7c");
      r(-62, -18, 124, 48, "#718b98");
      e(0, -18, 62, 16, "#344856");
      e(0, -18, 52, 10, "#90afbd");
      r(-80, -5, 18, 9, ink);
      r(62, -5, 18, 9, ink);
      break;
    case "cup":
      cup();
      break;
    case "cookie":
      e(0, 0, 29, 29, "#d4aa6c");
      for (let i = 0; i < 10; i++)
        r(-20 + ((i * 17) % 40), -20 + ((i * 13) % 40), 5, 5, "#77513c");
      break;
    case "ripples":
      ctx.strokeStyle = blue;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 7, 0, 0, 7);
      ctx.stroke();
      break;
    case "cone":
      P(
        [
          [-36, -43],
          [36, -43],
          [0, 52],
        ],
        "#bc8d58",
      );
      for (let i = 0; i < 5; i++)
        l(-25 + i * 6, -30 + i * 16, 26 - i * 6, -30 + i * 16, "#e0b47b");
      break;
    case "scoop":
      e(0, 0, 37, 34, p.color || "#dfb2b2");
      for (let i = 0; i < 5; i++) e(-27 + i * 14, 24, 10, 8, "#dfb2b2");
      break;
    case "yogurt":
      P(
        [
          [-44, -38],
          [44, -38],
          [31, 44],
          [-31, 44],
        ],
        "#bd859e",
      );
      e(0, -38, 44, 12, cream);
      t("YOGURT", 0, 10, 11, cream);
      break;
    case "foil":
      r(-11, -15, 22, 30, "#bbc9d1");
      l(-7, -9, 8, 11, cream);
      break;
    case "fries":
      P(
        [
          [-44, -8],
          [44, -8],
          [32, 43],
          [-32, 43],
        ],
        red,
      );
      for (let i = 0; i < 10; i++)
        r(-34 + i * 7, -37 + (i % 3) * 5, 6, 40, gold);
      break;
    case "ketchup":
      r(-23, -29, 46, 74, "#bd514e");
      r(-12, -44, 24, 16, cream);
      r(-17, -9, 34, 26, cream);
      t("K", 0, 9, 19, "#973f43");
      break;
    case "puddle":
      e(0, 0, 42, 10, p.color || "#789bad");
      e(25, 5, 17, 5, p.color || "#789bad");
      break;
    case "straw":
      r(-3, -56, 6, 112, "#db8c8d");
      for (let i = 0; i < 8; i++) r(-3, -50 + i * 14, 6, 4, cream);
      break;
    case "tray":
      r(-86, -24, 172, 48, blue);
      for (let i = 0; i < 5; i++) r(-78 + i * 33, -17, 28, 34, "#364f64");
      break;
    case "ice":
      r(-13, -15, 26, 30, color);
      l(-8, -10, 7, -10, "#dbf1f2", 3);
      l(-8, -9, -8, 5, "#dbf1f2", 2);
      break;
    case "bowl":
      e(0, 12, 59, 24, blue);
      r(-59, -12, 118, 24, blue);
      e(0, -12, 59, 17, "#1b2f43");
      break;
    case "cupboard":
      r(-83, -80, 166, 160, wood);
      r(-73, -70, 146, 140, "#45352d");
      l(-72, -3, 72, -3, wood, 5);
      break;
    case "door":
      r(-38, -69, 76, 138, wood);
      r(-30, -61, 60, 122, "#c29970");
      r(20, -3, 6, 20, gold);
      break;
    case "wall":
      r(0, -87, 13, 174, "#6a8291");
      for (let i = 0; i < 5; i++)
        l(0, -70 + i * 32, 55, -70 + i * 32, "#374b5d");
      break;
    case "bottle":
      r(-28, -33, 56, 76, "#8bb49e");
      r(-15, -49, 30, 16, cream);
      t("SOAP", 0, 7, 12, ink);
      break;
    case "nozzle":
      r(-12, -7, 55, 14, cream);
      r(-9, 7, 13, 17, cream);
      r(33, 7, 10, 8, cream);
      break;
    case "pinchedtube":
      P(
        [
          [-50, -20],
          [-8, -8],
          [25, -13],
          [40, -7],
          [40, 7],
          [25, 13],
          [-8, 8],
          [-50, 20],
        ],
        cream,
      );
      r(-22, -6, 25, 12, blue);
      break;
    case "tube":
      P(
        [
          [-50, -20],
          [25, -13],
          [40, -7],
          [40, 7],
          [25, 13],
          [-50, 20],
        ],
        cream,
      );
      r(-28, -15, 34, 30, blue);
      t("MINT", -10, 4, 10, ink);
      break;
    case "cap":
      r(-12, -13, 24, 26, blue);
      for (let i = 0; i < 5; i++) l(-9 + i * 5, -10, -9 + i * 5, 10, "#476c89");
      break;
    case "paste":
      l(-17, 0, 17, -2, "#eff8df", 8);
      break;
    case "brush":
      r(-54, -4, 110, 8, blue);
      r(28, -13, 30, 10, cream);
      break;
    case "paperroll":
      r(-39, -19, 78, 38, cream);
      e(39, 0, 12, 19, "#dadacb");
      e(39, 0, 4, 9, wood);
      break;
    case "perforation":
      for (let i = 0; i < 12; i++) r(-35 + i * 6, 0, 3, 2, "#879aa9");
      break;
    case "plant":
      P(
        [
          [-33, -8],
          [33, -8],
          [25, 44],
          [-25, 44],
        ],
        "#b67c62",
      );
      l(0, -8, 0, -65, green, 5);
      for (let i = 0; i < 4; i++) {
        e(i % 2 ? 17 : -17, -28 - i * 10, 19, 7, green);
      }
      break;
    case "watering":
      r(-32, -17, 60, 48, blue);
      P(
        [
          [25, 0],
          [70, -30],
          [75, -22],
          [27, 20],
        ],
        blue,
      );
      ctx.strokeStyle = blue;
      ctx.lineWidth = 8;
      ctx.strokeRect(-45, -14, 22, 28);
      break;
    case "shirtin":
      P(
        [
          [-26, -48],
          [-35, -23],
          [-30, -3],
          [-30, 49],
          [30, 49],
          [30, -3],
          [45, 5],
          [60, -27],
          [26, -48],
          [13, -39],
          [-13, -39],
        ],
        blue,
      );
      e(-27, -17, 8, 13, ink);
      break;
    case "shirt":
      P(
        [
          [-26, -48],
          [-60, -27],
          [-45, 5],
          [-30, -3],
          [-30, 49],
          [30, 49],
          [30, -3],
          [45, 5],
          [60, -27],
          [26, -48],
          [13, -39],
          [-13, -39],
        ],
        blue,
      );
      break;
    case "sleeve":
      P(
        [
          [-25, -15],
          [18, -15],
          [28, 15],
          [-25, 15],
        ],
        blue,
      );
      r(-23, -14, 7, 28, "#acd0da");
      break;
    case "fabric":
      r(-22, -17, 44, 34, blue);
      l(-18, -10, 17, 10, "#adc4d2");
      break;
    case "foldedshirt":
      r(-45, -28, 90, 56, blue);
      P(
        [
          [-45, -28],
          [-16, -15],
          [-32, 0],
          [-45, -6],
        ],
        "#a2becb",
      );
      l(0, -26, 0, 26, "#6a8caa");
      break;
    case "shoe":
      P(
        [
          [-56, -7],
          [-30, -30],
          [18, -30],
          [35, -4],
          [58, 8],
          [58, 26],
          [-56, 26],
        ],
        "#8590b4",
      );
      r(-56, 22, 114, 8, cream);
      for (let i = 0; i < 4; i++)
        l(-12, -22 + i * 9, 18, -20 + i * 9, cream, 3);
      break;
    case "loop":
      ctx.strokeStyle = cream;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(-8, -3, 19, 9, -0.3, 0, 7);
      ctx.stroke();
      l(8, 0, 24, 17, cream, 3);
      break;
    case "jacket":
      P(
        [
          [-29, -61],
          [-70, -40],
          [-49, 25],
          [-35, 10],
          [-35, 64],
          [35, 64],
          [35, 10],
          [49, 25],
          [70, -40],
          [29, -61],
        ],
        "#9c7185",
      );
      for (let i = 0; i < 20; i++) r(-3, -52 + i * 6, 6, 3, gold);
      break;
    case "zipper":
      r(-9, -12, 18, 24, "#becad2");
      r(-3, -5, 6, 11, ink);
      break;
    case "window":
      r(-92, -78, 184, 156, "#668397");
      r(-84, -70, 168, 140, "#a2becc");
      for (let i = 0; i < 7; i++) {
        r(-80, -64 + i * 20, 160, 16, "#748d9f");
        r(-80, -64 + i * 20, 160, 3, "#c3d4db");
      }
      break;
    case "slat":
      r(-80, -7, 160, 14, color);
      r(-80, 3, 160, 4, "#425d70");
      break;
    case "phone":
      r(-53, -85, 106, 170, "#111923");
      r(-46, -74, 92, 143, "#557f98");
      r(-16, -80, 32, 4, blue);
      e(0, 76, 5, 5, "#526d82");
      break;
    case "bubble":
      e(0, 0, 9, 9, "#c6d8e366");
      ctx.strokeStyle = "#d4e3ea";
      ctx.lineWidth = 1;
      ctx.strokeRect(-6, -6, 12, 12);
      break;
    case "remote":
      r(-43, -73, 86, 146, "#111923");
      r(-32, -40, 64, 94, "#46586a");
      t("+", -16, -43, 13, cream);
      t("+", 18, 60, 13, cream);
      break;
    case "battery":
      r(-13, -36, 26, 72, "#d3a86c");
      r(-7, -42, 14, 6, cream);
      r(-13, 13, 26, 23, ink);
      t("+", 0, -17, 15, ink);
      t("−", 0, 29, 14, cream);
      break;
    case "cover":
      r(-40, -63, 80, 126, "#566f85");
      for (let i = 0; i < 4; i++)
        l(-20, -12 + i * 7, 20, -12 + i * 7, "#344b60");
      break;
    case "chairleg":
      P(
        [
          [-19, -81],
          [15, -81],
          [23, 67],
          [-23, 67],
        ],
        wood,
      );
      r(-40, -87, 80, 15, wood);
      break;
    case "plug":
      r(-14, -9, 28, 18, ink);
      r(14, -4, 21, 8, "#c5ced0");
      break;
    case "headphones":
      ctx.strokeStyle = blue;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 33, Math.PI, Math.PI * 2);
      ctx.stroke();
      r(-42, -8, 21, 41, ink);
      r(21, -8, 21, 41, ink);
      l(-30, 33, -30, 62, "#101923", 4);
      break;
    case "cordloop":
      ctx.strokeStyle = "#0d151e";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 43, 26, 0, 0, 7);
      ctx.stroke();
      l(-35, 15, -105, 19, "#0d151e", 5);
      l(36, 15, 85, 19, "#0d151e", 5);
      break;
    case "mouse":
      e(0, 0, 24, 35, "#b3bec4");
      l(0, -32, 0, -5, ink);
      r(-3, -27, 6, 13, ink);
      break;
    case "monitor":
      r(-70, -51, 140, 93, "#111923");
      r(-63, -44, 126, 76, "#58899a");
      r(-6, 42, 12, 21, blue);
      r(-32, 62, 64, 7, blue);
      break;
    case "cableanchor":
      r(-9, -7, 18, 14, ink);
      break;
    case "tautcord":
      l(-100, 0, 105, 0, "#0b131c", 4);
      break;
    case "printer":
      r(-69, -28, 138, 83, "#8799a4");
      r(-55, -50, 110, 33, ink);
      r(-44, 17, 88, 8, ink);
      r(43, -10, 11, 7, green);
      break;
    case "papers":
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(i * 3, i * 3);
        paper();
        ctx.restore();
      }
      break;
    case "stapler":
      P(
        [
          [-47, -18],
          [31, -18],
          [46, 0],
          [-47, 0],
        ],
        red,
      );
      r(-45, 10, 91, 9, "#a8b9c1");
      r(-45, -2, 14, 15, ink);
      break;
    case "staple":
      l(-8, 4, -8, -4, "#c8d5d9");
      l(-8, -4, 8, -4, "#c8d5d9");
      l(8, -4, 8, 4, "#c8d5d9");
      break;
    case "gift":
      r(-61, -37, 122, 75, "#ad819d");
      r(-5, -37, 10, 75, gold);
      r(-61, -5, 122, 10, gold);
      break;
    case "wrapping":
      r(-104, -26, 208, 52, "#597f93");
      for (let i = 0; i < 12; i++)
        r(-96 + i * 18, -20 + (i % 2) * 22, 7, 7, gold);
      break;
    case "scissors":
      e(-12, -17, 10, 13, red);
      e(12, -17, 10, 13, red);
      l(-8, -6, 19, 39, "#d1dce1", 5);
      l(8, -6, -19, 39, "#d1dce1", 5);
      break;
    case "gap":
      r(-7, -37, 14, 75, wood);
      break;
    case "taperoll":
      e(0, 0, 42, 42, "#bba475");
      e(0, 0, 24, 24, "#ded8c0");
      e(0, 0, 18, 18, ink);
      break;
    case "tape":
      r(-21, -10, 42, 20, "#bca779");
      break;
    case "pen":
      r(-52, -5, 104, 10, blue);
      P(
        [
          [-52, -5],
          [-67, 0],
          [-52, 5],
        ],
        cream,
      );
      break;
    case "pencap":
      r(-28, -9, 56, 18, blue);
      r(-23, -13, 39, 4, "#b6ced4");
      break;
    case "dishwasher":
      r(-66, -70, 132, 140, "#879ca9");
      r(-57, -60, 114, 117, "#182632");
      for (let i = 0; i < 7; i++)
        l(-49 + i * 16, -45, -49 + i * 16, 50, "#6e8797");
      break;
    case "dishwasherdoor":
      r(-65, -63, 130, 126, "#9aadba");
      r(-47, -48, 94, 8, ink);
      break;
    case "dirtyplate":
      e(0, 0, 28, 28, "#bdcdd0");
      e(0, 0, 21, 21, "#e6e4d4");
      e(7, 3, 11, 6, "#93784e");
      break;
    case "car":
      r(-97, -13, 194, 46, blue);
      P(
        [
          [-61, -13],
          [-39, -45],
          [40, -45],
          [66, -13],
        ],
        blue,
      );
      P(
        [
          [-48, -17],
          [-32, -37],
          [31, -37],
          [49, -17],
        ],
        ink,
      );
      e(-61, 33, 20, 20, ink);
      e(62, 33, 20, 20, ink);
      r(75, -9, 11, 10, gold);
      break;
    case "gauge":
    case "halfgauge":
      r(-70, -11, 140, 22, ink);
      r(
        -64,
        -6,
        art === "halfgauge" ? 64 : (workshop?.fuel || 0) * 128,
        12,
        gold,
      );
      for (let i = 0; i < 5; i++)
        l(-64 + i * 32, -8, -64 + i * 32, 8, "#c7cfce", 1);
      t("E", -80, 4, 10, cream);
      t("F", 80, 4, 10, cream);
      break;
    case "fuelnozzle":
      P(
        [
          [-23, -20],
          [21, -20],
          [21, -9],
          [-7, -9],
          [-7, 25],
          [-23, 25],
        ],
        green,
      );
      l(21, -15, 49, -29, "#bacad0", 7);
      l(-19, 25, -33, 50, ink, 8);
      break;
    case "coffeepot":
      r(-28, -31, 56, 67, "#b9c7cb");
      P(
        [
          [28, -15],
          [55, -30],
          [55, -13],
          [28, 5],
        ],
        "#b9c7cb",
      );
      r(-39, -20, 10, 42, ink);
      r(-15, -40, 30, 9, ink);
      break;
    case "coffee":
      e(0, 0, 34, 8, "#805735");
      break;
    case "donut":
      e(0, 0, 38, 29, "#d5a96d");
      e(0, -6, 34, 19, "#dfb484");
      for (let i = 0; i < 10; i++)
        r(-25 + ((i * 15) % 50), -18 + ((i * 11) % 26), 2, 2, cream);
      break;
    case "jam":
      e(0, 0, 28, 13, "#aa506c");
      e(15, 8, 18, 8, "#bd6178");
      break;
    case "segment":
      e(0, 0, 20, 31, "#dfa35d");
      l(-3, -24, 2, 24, cream, 2);
      if (!p.mark) {
        l(-12, -18, -7, 20, cream);
        l(10, -17, 12, 14, cream);
      }
      break;
    case "cucumber":
      e(0, 0, 91, 22, "#71936b");
      for (let i = 0; i < 16; i++)
        r(-78 + i * 10, -8 + (i % 3) * 6, 3, 3, "#adc194");
      break;
    case "cucumberslice":
      r(-12, -25, 24, 50, "#688964");
      e(12, 0, 12, 25, "#bdd0a1");
      for (let i = 0; i < 4; i++) r(9, -15 + i * 10, 3, 3, cream);
      break;
    case "cheesepack":
      r(-53, -49, 106, 98, "#a9c2c755");
      r(-43, -34, 86, 73, gold);
      r(-53, -49, 106, 10, blue);
      break;
    case "seam":
      r(-37, -5, 74, 10, cream);
      l(-33, 0, 33, 0, blue, 2);
      break;
    case "crisps":
      P(
        [
          [-37, -55],
          [36, -55],
          [42, 55],
          [-42, 55],
        ],
        "#bd7e60",
      );
      r(-37, -55, 73, 7, gold);
      r(-42, 48, 84, 7, gold);
      t("CRISPS", 0, -12, 12, cream);
      e(0, 15, 21, 16, gold);
      break;
    case "teabag":
      r(-10, -14, 20, 28, "#bba98a");
      l(0, -14, -30, -47, cream, 1);
      break;
    case "tag":
      r(-14, -10, 28, 20, green);
      t("TEA", 0, 4, 9, cream);
      l(7, 10, 35, 43, cream, 1);
      break;
    case "shaker":
      r(-24, -28, 48, 61, cream);
      e(0, -28, 24, 9, "#7d919e");
      for (let i = 0; i < 5; i++) r(-13 + i * 7, -31 + (i % 2) * 4, 2, 2, ink);
      t(p.label || "S", 0, 12, 22, ink);
      break;
    case "salt":
    case "pepper":
      r(-23, -30, 46, 60, art === "salt" ? cream : "#796554");
      t(
        art === "salt" ? "SALT" : "PEPPER",
        0,
        4,
        9,
        art === "salt" ? ink : cream,
      );
      break;
    case "saltfill":
    case "pepperfill":
      for (let i = 0; i < 15; i++)
        r(
          -17 + ((i * 7) % 34),
          -14 + ((i * 11) % 28),
          2,
          2,
          art === "salt"
            ? "#d9d4b8"
            : art === "saltfill"
              ? "#c4bb9b"
              : "#56483c",
        );
      break;
    case "wrapper":
      r(-52, -35, 104, 70, cream);
      for (let i = 0; i < 8; i++) r(-45 + i * 13, -35, 4, 6, red);
      break;
    case "soap":
      r(-32, -18, 64, 36, "#b0c5a0");
      e(0, -17, 31, 8, "#cbd9b9");
      t("SOAP", 0, 5, 12, "#668566");
      break;
    case "stuckpaper":
      P(
        [
          [-35, 13],
          [-15, -3],
          [3, 13],
          [21, -5],
          [35, 13],
          [30, 23],
          [-30, 23],
        ],
        cream,
      );
      break;
    case "bathtub":
      r(-98, -22, 196, 63, cream);
      e(0, 40, 97, 16, "#b1c2c5");
      e(0, -22, 98, 20, "#cbd9d8");
      e(0, -22, 84, 13, "#567b8c");
      break;
    case "rail":
      l(-118, 0, 118, 0, "#9ab2be", 5);
      break;
    case "curtain":
      r(-48, -75, 96, 150, "#95b3ad");
      for (let i = 0; i < 7; i++)
        l(-42 + i * 14, -72, -42 + i * 14, 73, "#628e90", 3);
      break;
    case "sink":
      e(0, 0, 88, 35, "#97b0bc");
      e(0, 0, 76, 26, "#5f6859");
      for (let i = 0; i < 9; i++)
        r(-55 + ((i * 17) % 110), -15 + ((i * 13) % 30), 4, 3, wood);
      break;
    case "sponge":
      r(-30, -15, 60, 30, gold);
      r(-30, 7, 60, 8, green);
      for (let i = 0; i < 12; i++)
        r(-23 + ((i * 7) % 46), -10 + ((i * 11) % 20), 2, 2, "#bc9545");
      break;
    case "tiles":
    case "wetfloor":
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 5; col++) {
          r(
            -110 + col * 44,
            -52 + row * 36,
            42,
            34,
            art === "wetfloor" ? "#7096a6" : "#6b7984",
          );
          if (art === "wetfloor")
            l(
              -104 + col * 44,
              -40 + row * 36,
              -80 + col * 44,
              -44 + row * 36,
              "#a1c9d5",
            );
        }
      break;
    case "feet":
      e(-13, -4, 9, 18, wood);
      e(13, 5, 9, 18, wood);
      break;
    case "footprints":
      for (let i = 0; i < 7; i++)
        e(-85 + i * 28, (i % 2) * 13 - 9, 9, 16, "#465f69");
      break;
    case "bin":
      P(
        [
          [-43, -39],
          [43, -39],
          [33, 52],
          [-33, 52],
        ],
        "#789299",
      );
      e(0, -39, 43, 12, "#b4c3bf");
      e(0, -39, 31, 8, "#152631");
      break;
    case "crumpled":
      P(
        [
          [-18, -12],
          [1, -20],
          [19, -7],
          [13, 18],
          [-11, 13],
        ],
        cream,
      );
      l(-12, -7, 12, 12, "#a4b3b8");
      break;
    case "hanger":
      l(0, -20, -48, 19, wood, 5);
      l(-48, 19, 48, 19, wood, 5);
      l(48, 19, 0, -20, wood, 5);
      l(0, -20, 0, -39, wood, 4);
      ctx.strokeStyle = wood;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(6, -40, 6, Math.PI, 6);
      ctx.stroke();
      break;
    case "stretchedneck":
      e(0, 0, 28, 14, ink);
      ctx.strokeStyle = blue;
      ctx.lineWidth = 4;
      ctx.strokeRect(-27, -12, 54, 24);
      break;
    case "glove":
      r(-29, -23, 58, 66, green);
      for (let i = 0; i < 3; i++)
        r(-27 + i * 18, -65 + (i % 2) * 8, 13, 47, green);
      P(
        [
          [-29, -6],
          [-53, -24],
          [-58, -8],
          [-29, 22],
        ],
        green,
      );
      break;
    case "finger":
      r(-7, -24, 14, 48, green);
      break;
    case "sofa":
      r(-99, -36, 198, 85, "#8c7f9b");
      r(-113, -12, 24, 74, "#756486");
      r(89, -12, 24, 74, "#756486");
      r(-93, -57, 186, 47, "#a094ac");
      break;
    case "cushion":
      r(-43, -31, 86, 62, "#9cbcae");
      if (p.mark === "zip") {
        for (let i = 0; i < 13; i++) r(-35 + i * 6, 22, 3, 4, ink);
        r(32, 20, 7, 9, gold);
      }
      break;
    case "candle":
    case "candleout":
      r(-29, -44, 58, 88, cream);
      e(0, -44, 29, 9, "#c1b49b");
      if (art === "candleout") e(0, -44, 18, 7, "#504337");
      r(-2, -52, 4, 14, ink);
      if (art === "candle") {
        P(
          [
            [0, -85],
            [-10, -59],
            [0, -53],
            [9, -61],
          ],
          gold,
        );
        P(
          [
            [0, -71],
            [-4, -59],
            [4, -59],
          ],
          "#f9e8a1",
        );
      }
      break;
    case "snuffer":
      r(-4, -40, 8, 49, wood);
      P(
        [
          [-4, 6],
          [-20, 24],
          [20, 24],
          [4, 6],
        ],
        "#9b9e8c",
      );
      break;
    case "suitcase":
      r(-86, -45, 172, 90, "#ad7c61");
      r(-77, -35, 154, 70, "#433d3b");
      r(-21, 44, 42, 8, ink);
      break;
    case "suitcaselid":
      r(-85, -40, 170, 80, "#b98b6e");
      l(-65, -25, 65, -25, "#8c624c", 3);
      l(-65, 25, 65, 25, "#8c624c", 3);
      break;
    case "openbook":
      r(-77, -55, 154, 110, wood);
      r(-71, -49, 68, 98, cream);
      r(3, -49, 68, 98, cream);
      for (let i = 0; i < 6; i++) {
        r(-60, -32 + i * 13, 48, 2, "#9eaaac");
        r(13, -32 + i * 13, 48, 2, "#9eaaac");
      }
      break;
    case "bookmark":
      r(-9, -48, 18, 96, red);
      P(
        [
          [-9, 48],
          [0, 38],
          [9, 48],
        ],
        ink,
      );
      break;
    case "pagecorner":
      P(
        [
          [-15, -15],
          [15, -15],
          [15, 15],
        ],
        cream,
      );
      break;
    case "foldedcorner":
      P(
        [
          [-20, -20],
          [20, 20],
          [-20, 20],
        ],
        "#c4c5b5",
      );
      break;
    case "notebook":
      r(-47, -60, 94, 120, "#9c839c");
      r(-36, -54, 77, 108, cream);
      for (let i = 0; i < 10; i++) {
        r(-49, -48 + i * 11, 15, 3, ink);
      }
      break;
    case "pencil":
      r(-4, -51, 8, 91, gold);
      P(
        [
          [-4, 40],
          [4, 40],
          [0, 55],
        ],
        p.mark === "broken" ? wood : cream,
      );
      if (p.mark !== "broken") r(-1, 51, 2, 5, ink);
      break;
    case "sharpener":
      r(-24, -19, 48, 38, blue);
      r(-13, -12, 26, 23, "#bec9ce");
      e(0, 0, 7, 7, ink);
      break;
    case "lead":
      P(
        [
          [-3, -5],
          [5, 4],
          [-5, 4],
        ],
        ink,
      );
      break;
    case "plaster":
      r(-52, -14, 104, 28, "#d3ad90");
      r(-15, -12, 30, 24, cream);
      for (let i = 0; i < 6; i++) r(-43 + i * 6, -7, 2, 2, "#9c7c68");
      break;
    case "plasterhalf":
      r(-25, -14, 50, 28, "#d3ad90");
      break;
    case "envelope":
      r(-66, -38, 132, 76, cream);
      l(-64, 35, 0, -15, "#b1b4a4");
      l(64, 35, 0, -15, "#b1b4a4");
      break;
    case "envelopeflap":
      P(
        [
          [-66, -15],
          [66, -15],
          [0, 32],
        ],
        "#d7d8c4",
      );
      break;
    case "seal":
      e(0, 0, 12, 12, red);
      break;
    case "deck":
      for (let i = 0; i < 5; i++) {
        r(-29 + i * 3, -40 + i * 3, 58, 80, cream);
        r(-25 + i * 3, -36 + i * 3, 50, 72, "#637f9e");
      }
      break;
    case "playingcard":
      r(-27, -38, 54, 76, cream);
      if (p.mark === "face") {
        t("A", -17, -20, 12, red);
        P(
          [
            [0, -15],
            [13, 0],
            [0, 15],
            [-13, 0],
          ],
          red,
        );
      } else {
        r(-22, -33, 44, 66, "#637f9e");
      }
      break;
    case "chessboard":
      r(-84, -84, 168, 168, wood);
      for (let row = 0; row < 8; row++)
        for (let col = 0; col < 8; col++)
          r(
            -80 + col * 20,
            -80 + row * 20,
            20,
            20,
            (row + col) % 2 ? ink : cream,
          );
      break;
    case "gamebox":
      r(-80, -45, 160, 90, "#b2906b");
      r(-72, -36, 144, 73, "#4a5863");
      break;
    case "pawn":
      e(0, -13, 10, 10, red);
      P(
        [
          [-6, -4],
          [6, -4],
          [13, 22],
          [-13, 22],
        ],
        red,
      );
      break;
    case "boxlid":
      r(-81, -46, 162, 92, "#89a5a6");
      t("GAME NIGHT", 0, 5, 15, ink);
      break;
    case "cube":
      r(-44, -38, 88, 88, ink);
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 3; col++)
          r(
            -40 + col * 28,
            -34 + row * 28,
            24,
            24,
            p.mark === "mixed"
              ? [red, gold, green, blue, cream][(row * 3 + col) % 5]
              : green,
          );
      P(
        [
          [-44, -38],
          [-17, -59],
          [69, -59],
          [44, -38],
        ],
        gold,
      );
      P(
        [
          [44, -38],
          [69, -59],
          [69, 28],
          [44, 50],
        ],
        red,
      );
      break;
    case "cubeface":
      P(
        [
          [-44, 0],
          [-17, -21],
          [69, -21],
          [44, 0],
        ],
        gold,
      );
      for (let i = 0; i < 3; i++)
        l(-15 + i * 28, -20, -40 + i * 28, -1, ink, 2);
      if (p.mark === "mixed") r(-15, -12, 27, 8, blue);
      break;
    case "cubestripe":
      r(-40, -6, 80, 23, red);
      l(-13, -6, -13, 17, ink, 4);
      l(15, -6, 15, 17, ink, 4);
      break;
    case "dominorow":
      for (let i = 0; i < 5; i++) {
        r(-125 + i * 35, -29, 13, 56, cream);
        r(-121 + i * 35, -19, 4, 4, ink);
      }
      break;
    case "domino":
      r(-7, -29, 14, 58, cream);
      r(-3, -19, 5, 5, ink);
      r(-3, 12, 5, 5, ink);
      break;
    case "fallenrow":
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(-95 + i * 34, 0);
        ctx.rotate(
          (Math.min(
            1,
            Math.max(0, (workshop.time - workshop.finishAt - i * 0.12) * 5),
          ) *
            Math.PI) /
            2,
        );
        r(-6, -47, 12, 48, cream);
        r(-2, -36, 4, 4, ink);
        ctx.restore();
      }
      break;
    case "banana":
      P(
        [
          [-22, -73],
          [-41, -37],
          [-34, 23],
          [-8, 64],
          [16, 69],
          [1, 30],
          [-8, -12],
          [4, -48],
          [20, -76],
        ],
        gold,
      );
      break;
    case "peelflake":
      P(
        [
          [-12, -14],
          [10, -11],
          [13, 14],
          [-9, 12],
        ],
        "#eed27b",
      );
      break;
    case "bananaflesh":
      r(-10, -12, 20, 24, cream);
      break;
    case "chocolate":
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 4; col++) {
          r(-62 + col * 31, -47 + row * 31, 29, 29, "#543a31");
          r(-58 + col * 31, -43 + row * 31, 21, 21, "#8e6448");
        }
      break;
    case "chocolatechunk":
      P(
        [
          [-19, -17],
          [17, -12],
          [20, 18],
          [-10, 22],
          [-21, 5],
        ],
        "#8e6448",
      );
      break;
    case "chocolatebreak":
      P(
        [
          [-21, -15],
          [18, -10],
          [18, 20],
          [-8, 23],
          [-22, 3],
        ],
        "#202c3a",
      );
      break;
    case "burger":
      e(0, -46, 57, 22, "#d5a563");
      r(-57, -46, 114, 16, "#d5a563");
      for (let i = 0; i < 8; i++)
        r(-46 + i * 13, -24 + (i % 2) * 4, 14, 13, green);
      r(-53, -9, 106, 10, gold);
      r(-54, 4, 108, 24, "#644735");
      break;
    case "bun":
      e(0, 0, 56, 14, "#d3a05f");
      break;
    default:
      throw new Error("Missing illustrated prop: " + art);
  }
}
