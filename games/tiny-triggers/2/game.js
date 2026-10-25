"use strict";
const $ = (s) => document.querySelector(s),
  canvas = $("#stage"),
  ctx = canvas.getContext("2d");
const scenes = [
  [
    "The other end",
    "EVERYDAY RITUALS",
    "Drag each banana peel upward, starting at the bottom.",
    "Grab each of the three lower peel tabs and pull up.",
    "A perfectly good banana. A deeply debatable method.",
  ],
  [
    "Against the wall",
    "EVERYDAY RITUALS",
    "Flip the roll, then hang it with the loose end behind it.",
    "Drag the roll left to flip it. Then drag it onto the holder.",
    "Under. Not over. You have chosen a side.",
  ],
  [
    "No need to break",
    "FOOD CRIMES",
    "Drag the whole chocolate bar to your mouth. Keep the fingers together.",
    "The mouth is on the right. The entire bar goes in.",
    "Four fingers. One unforgivable bite.",
  ],
  [
    "A fair share",
    "FOOD CRIMES",
    "Draw two unfair cuts.",
    "Draw two lines across the pizza in any direction. Avoid the center so the portions are unequal.",
    "Somebody gets the tiny slice. Somebody remembers.",
  ],
  [
    "Milk comes first",
    "FOOD CRIMES",
    "Pour milk into the empty bowl. Only then add the cereal.",
    "Hold the milk carton above the bowl for two seconds. Watch it tilt and fill the bowl; then add cereal.",
    "Breakfast, in the incorrect order.",
  ],
  [
    "Deconstructed lunch",
    "FOOD CRIMES",
    "Eat the burger one layer at a time, from the top down.",
    "Drag the top remaining layer into the mouth on the right.",
    "Technically, you ate a burger.",
  ],
  [
    "Just a taste",
    "FOOD CRIMES",
    "Take one bite out of every doughnut. Leave the rest.",
    "Drag each doughnut to the mouth. It returns, slightly worse.",
    "A selection box nobody else wants.",
  ],
  [
    "Enough for someone",
    "FOOD CRIMES",
    "Pour almost all the milk, then put the nearly empty carton back.",
    "Hold the carton above the glass until its milk window is nearly empty, then drag it onto the fridge shelf.",
    "One teaspoon. Infinite disappointment.",
  ],
  [
    "Gallery standards",
    "ALMOST RIGHT",
    "Pull the right corner of the middle picture down.",
    "Grab the small brass corner and lower it a little.",
    "The other two frames are judging you.",
  ],
  [
    "One small renovation",
    "ALMOST RIGHT",
    "Turn just the center floor tile a quarter turn.",
    "Pull its top-right corner down to rotate the tile.",
    "Now you will always notice it.",
  ],
  [
    "Nearly there",
    "ALMOST RIGHT",
    "Drag the loading slider to 99%. Leave it there.",
    "Move the handle almost all the way right. It snaps to 99 near the end.",
    "Loading complete. Emotionally incomplete.",
  ],
  [
    "Wait for it",
    "ALMOST RIGHT",
    "Arrange the countdown: 3, 2, 2, 1.",
    "Drag the four number cards into their matching outlined slots.",
    "Three… two… two… one.",
  ],
  [
    "Close enough",
    "ALMOST RIGHT",
    "Try the last puzzle piece. Then leave it slightly misaligned.",
    "Drag the loose piece to the bottom-left gap. It almost fits.",
    "It looked so promising.",
  ],
  [
    "A sensible volume",
    "ALMOST RIGHT",
    "Pick an untidy volume.",
    "Move the slider anywhere above 1. Zero and all multiples of five are unavailable.",
    "A perfectly unreasonable volume.",
  ],
  [
    "Shut enough",
    "EVERYDAY ANNOYANCES",
    "Slide the drawer almost closed. Leave a little gap.",
    "Side view: push the drawer handle left toward the cabinet. It stops just short of flush.",
    "That is going to bother someone all afternoon.",
  ],
  [
    "The last corner",
    "EVERYDAY ANNOYANCES",
    "Stretch the fitted sheet onto all four corners.",
    "Pull the four pink fabric corners onto the gold mattress corners. The last one makes the opposite corner spring loose.",
    "Four corners tried. Only three willing to cooperate.",
  ],
  [
    "One last thing",
    "EVERYDAY ANNOYANCES",
    "Send “one last thing” three times before leaving.",
    "Drag each new speech bubble to the patient listener on the right.",
    "The meeting could have been an email. Three emails.",
  ],
  [
    "An inviting handle",
    "EVERYDAY ANNOYANCES",
    "Pull the inviting handle. Then push the PUSH door.",
    "Pull the handle toward you (drag down), then push into the doorway (drag up).",
    "Excellent handle. Terrible instructions.",
  ],
];
let completed = new Set(),
  index = 0;
try {
  const p = JSON.parse(localStorage.getItem("tinyTriggers.v2") || "{}");
  completed = new Set(
    (Array.isArray(p.done) ? p.done : []).filter(
      (n) => Number.isInteger(n) && n >= 0 && n < 18,
    ),
  );
  index = Number.isInteger(p.index) ? Math.max(0, Math.min(17, p.index)) : 0;
} catch {}
// First playthrough is strictly sequential; v1 saves remain untouched.
let frontier = 0;
while (completed.has(frontier) && frontier < 18) frontier++;
completed = new Set(Array.from({ length: frontier }, (_, i) => i));
index = frontier === 18 ? index : Math.min(index, frontier);
let transition = null,
  hintClicks = 0;
let objects = [],
  state = {},
  drag = null,
  finished = false,
  elapsed = 0,
  last = 0,
  active = true;
const C = {
  ink: "#e4e9ee",
  dark: "#655a47",
  wood: "#bb8b63",
  shadow: "#354254",
  cream: "#fff6de",
  green: "#899d78",
  pink: "#d39487",
  yellow: "#e9bf58",
  blue: "#95b9bb",
};
function box(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}
function line(x, y, x2, y2, c = C.ink, w = 2) {
  ctx.strokeStyle = c;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(Math.round(x), Math.round(y));
  ctx.lineTo(Math.round(x2), Math.round(y2));
  ctx.stroke();
}
function ellipse(x, y, rx, ry, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function text(t, x, y, size = 10, c = C.ink, align = "center") {
  ctx.fillStyle = c;
  ctx.font = `${size}px monospace`;
  ctx.textAlign = align;
  ctx.fillText(t, Math.round(x), Math.round(y));
}
function poly(points, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
}
function obj(id, x, y, w, h, type, extra = {}) {
  const o = { id, x, y, w, h, type, home: { x, y }, ...extra };
  objects.push(o);
  return o;
}
function near(p, x, y, r = 45) {
  return Math.hypot(p.x - x, p.y - y) < r;
}
function save() {
  try {
    localStorage.setItem(
      "tinyTriggers.v2",
      JSON.stringify({ done: [...completed], index }),
    );
  } catch {}
}
function say(t) {
  $("#feedback").textContent = t;
}
function win() {
  if (finished) return;
  finished = true;
  completed.add(index);
  save();
  say(scenes[index][4]);
  $("#next").hidden = false;
  $("#next").textContent =
    completed.size === 18 ? "Admire the damage →" : "Next tiny crime →";
  $("#count").textContent = `${completed.size} / 18 wonderfully wrong`;
  $("#album").disabled = completed.size < 18;
  $("#album").textContent =
    completed.size < 18 ? "Collection 🔒" : "Collection ↗";
  chime(784, 0.35, 0.04);
}
function load(n) {
  if (n < 0 || n >= 18 || (completed.size < 18 && n > completed.size)) return;
  index = n;
  hintClicks = 0;
  note = 0;
  noteAt = 0;
  finished = false;
  drag = null;
  elapsed = 0;
  objects = [];
  state = {
    steps: 0,
    angle: 0,
    value: 0,
    cuts: [],
    slots: [],
    corners: [],
    pulled: false,
  };
  $("#title").textContent = scenes[n][0];
  $("#category").textContent = scenes[n][1];
  $("#instruction").textContent = scenes[n][2];
  $("#chapter").textContent = `${String(n + 1).padStart(2, "0")} / 18`;
  $("#next").hidden = true;
  $("#count").textContent = `${completed.size} / 18 wonderfully wrong`;
  say("");
  $("#album").disabled = completed.size < 18;
  $("#album").textContent =
    completed.size < 18 ? "Collection 🔒" : "Collection ↗";
  switch (n) {
    case 0:
      for (let i = 0; i < 3; i++)
        obj("peel" + i, 210 + i * 22, 190, 22, 46, "peel", { part: i });
      break;
    case 1:
      obj("roll", 124, 150, 80, 64, "roll", { flipped: false });
      break;
    case 2:
      obj("bar", 135, 145, 110, 75, "chocolate");
      break;
    case 3:
      obj("cutter", 100, 65, 36, 50, "cutter");
      break;
    case 4:
      obj("milk", 100, 128, 48, 76, "milk");
      obj("cereal", 385, 128, 60, 84, "cereal");
      break;
    case 5:
      ["bun", "lettuce", "cheese", "patty", "bottom"].forEach((t, i) =>
        obj("layer" + i, 155, 90 + i * 28, 120, 30, t, { order: i }),
      );
      break;
    case 6:
      for (let i = 0; i < 4; i++)
        obj(
          "donut" + i,
          95 + (i % 2) * 100,
          105 + Math.floor(i / 2) * 90,
          65,
          65,
          "donut",
          { flavor: i },
        );
      break;
    case 7:
      obj("milk", 110, 135, 48, 76, "milk");
      break;
    case 8:
      obj("corner", 282, 105, 20, 20, "handle");
      break;
    case 9:
      obj("corner", 266, 113, 20, 20, "handle");
      break;
    case 10:
      obj("slider", 100, 145, 18, 38, "knob");
      break;
    case 11:
      [2, 1, 3, 2].forEach((v, i) =>
        obj("card" + i, 125 + i * 75, 205, 48, 48, "card", { value: v }),
      );
      break;
    case 12:
      obj("piece", 355, 190, 55, 55, "piece");
      break;
    case 13:
      state.value = 1;
      obj("slider", 102.8, 150, 18, 38, "knob");
      break;
    case 14:
      state.extension = 95;
      obj("handle", 375, 151, 34, 52, "drawer");
      break;
    case 15:
      [
        [166, 116],
        [284, 116],
        [145, 190],
        [306, 190],
      ].forEach(([x, y], i) =>
        obj("tab" + i, x, y, 32, 32, "tab", { corner: i }),
      );
      break;
    case 16:
      obj("bubble", 140, 130, 130, 60, "bubble");
      break;
    case 17:
      obj("handle", 283, 156, 32, 48, "doorHandle");
      break;
    case 18:
      obj("curtain", 75, 145, 24, 100, "curtain");
      break;
    case 19:
      obj("logo", 150, 155, 72, 40, "logo");
      break;
  }
  save();
}
function mouth() {
  ellipse(385, 130, 40, 48, "#c99d7c");
  box(364, 118, 8, 5, "#302b2d");
  box(395, 118, 8, 5, "#302b2d");
  ellipse(385, 149, 24, 14, "#302b2d");
  box(368, 137, 34, 5, C.cream);
  text("NOM", 385, 210, 10);
}
function milkSpout(o) {
  const a = o.tilt || 0;
  return {
    x: o.x + 22 * Math.cos(a) + 34 * Math.sin(a),
    y: o.y + 22 * Math.sin(a) - 34 * Math.cos(a),
  };
}
function milk(o) {
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.rotate(o.tilt || 0);
  box(-25, -34, 50, 72, "#f2f4ea");
  poly(
    [
      [-25, -34],
      [-13, -47],
      [16, -47],
      [25, -34],
    ],
    "#709fcb",
  );
  box(18, -39, 10, 8, "#fefdf4");
  box(-25, -12, 50, 25, "#346e9a");
  text("MILK", 0, 5, 12, "#fff");
  box(-18, 18, 36, 13, "#1a3047");
  box(-16, 20, 32 * Math.max(0.035, 1 - (state.fill || 0)), 9, "#fffdf7");
  ctx.restore();
}
function picture(x, angle = 0) {
  ctx.save();
  ctx.translate(x, 132);
  ctx.rotate(angle);
  box(-44, -42, 88, 84, C.dark);
  box(-39, -37, 78, 74, C.cream);
  box(-33, -31, 66, 62, C.blue);
  ellipse(14, -15, 10, 10, C.yellow);
  poly(
    [
      [-33, 31],
      [-4, -10],
      [33, 31],
    ],
    C.green,
  );
  ctx.restore();
}
function drawObject(o) {
  if (o.hidden) return;
  const { x, y, w, h } = o;
  if (drag?.o === o) {
    box(x - w / 2 + 4, y + h / 2 + 3, w, 5, "#655a4730");
  }
  switch (o.type) {
    case "peel": {
      const hx = o.home.x,
        amount = Math.max(0, Math.min(1, (190 - y) / 95));
      // Three curved skin strips unwrap from the base; pale fruit is exposed underneath.
      const strip = [
        [hx - 10, 207],
        [hx - 25, 167],
        [hx - 28, 130],
        [hx - 15, 96],
        [250 + (o.part - 1) * 4, 70],
        [254 + (o.part - 1) * 4, 67],
        [hx + 2, 104],
        [hx - 6, 137],
        [hx - 4, 168],
        [hx + 10, 207],
      ];
      poly(strip, C.cream);
      if (amount < 0.08) {
        poly(strip, [C.yellow, "#f2ce6b", "#dcb04c"][o.part]);
        line(hx - 14, 169, hx - 18, 135, "#f9dd86", 3);
        box(hx - 7, 203, 14, 5, C.dark);
      } else {
        const endX = hx + (o.part - 1) * 48,
          endY = 205 - amount * 130;
        poly(
          [
            [hx - 10, 90],
            [hx + 4, 88],
            [endX + 12, endY],
            [endX, endY + 16],
            [hx - 8, 120],
          ],
          C.yellow,
        );
        box(endX, endY + 8, 12, 5, C.dark);
      }
      break;
    }
    case "roll":
      box(x - 31, y - 20, 62, 50, C.cream);
      ellipse(x, y - 20, 31, 12, "#fff9eb");
      ellipse(x, y - 20, 11, 5, C.wood);
      box(o.flipped ? x + 23 : x - 31, y + 3, 16, 55, "#f7f0db");
      line(
        o.flipped ? x + 23 : x - 31,
        y + 45,
        o.flipped ? x + 39 : x - 15,
        y + 45,
        C.shadow,
        1,
      );
      break;
    case "chocolate":
      for (let i = 0; i < 4; i++) {
        box(x - 54 + i * 28, y - 38, 25, 76, "#69422f");
        box(x - 50 + i * 28, y - 34, 17, 68, "#8c5b3e");
        line(x - 49 + i * 28, y, x - 34 + i * 28, y, "#69422f");
      }
      if (o.bitten) {
        ellipse(x + 35, y - 35, 25, 13, "#202c3a");
      }
      break;
    case "cutter":
      line(x, y - 3, x + 16, y - 27, C.dark, 8);
      ellipse(x, y + 8, 16, 16, "#87928d");
      ellipse(x, y + 8, 10, 10, "#bdc6be");
      break;
    case "milk":
      milk(o);
      break;
    case "cereal":
      box(x - 30, y - 42, 60, 84, C.yellow);
      box(x - 25, y - 20, 50, 32, C.cream);
      text("FLAKES", x, y, 10, "#283544");
      ellipse(x, y + 25, 15, 7, C.wood);
      break;
    case "bun":
      ellipse(x, y, 55, 20, "#d8a45c");
      box(x - 55, y, 110, 12, "#d8a45c");
      for (let i = 0; i < 7; i++)
        box(x - 40 + i * 13, y - 5 - (i % 2) * 6, 4, 2, C.cream);
      break;
    case "lettuce":
      for (let i = 0; i < 8; i++)
        box(x - 55 + i * 14, y + (i % 2) * 4, 15, 12, C.green);
      break;
    case "cheese":
      poly(
        [
          [x - 55, y - 10],
          [x + 55, y - 10],
          [x + 44, y + 15],
          [x - 48, y + 10],
        ],
        C.yellow,
      );
      break;
    case "patty":
      box(x - 54, y - 9, 108, 20, "#6f4835");
      break;
    case "bottom":
      ellipse(x, y, 55, 12, "#c59350");
      break;
    case "donut":
      ellipse(x, y, 32, 29, C.wood);
      ellipse(x, y - 3, 29, 23, o.flavor % 2 ? C.pink : "#eee2b9");
      ellipse(x, y, 10, 9, "#202c3a");
      for (let i = 0; i < 7; i++)
        box(x - 22 + i * 7, y - 15 + (i % 3) * 12, 3, 2, C.cream);
      if (o.bitten) ellipse(x + 26, y - 15, 15, 14, "#202c3a");
      break;
    case "handle":
      box(x - w / 2, y - h / 2, w, h, C.yellow);
      box(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8, C.wood);
      break;
    case "knob":
      box(x - 9, y - 19, 18, 38, C.dark);
      box(x - 6, y - 16, 12, 31, C.cream);
      break;
    case "card":
      box(x - 24, y - 24, 48, 48, C.cream);
      box(x - 24, y + 21, 48, 4, C.shadow);
      text(String(o.value), x, y + 9, 28, "#283544");
      break;
    case "piece":
      box(x - 27, y - 27, 54, 54, C.green);
      ellipse(x, y - 27, 10, 8, C.green);
      ellipse(x + 27, y, 8, 10, C.green);
      box(x - 16, y - 10, 25, 7, "#c8d1ac");
      break;
    case "drawer":
      break;
    case "doorHandle":
      break;
    case "tab":
      box(x - 12, y - 12, 24, 24, C.pink);
      box(x - 8, y - 8, 16, 16, "#eab6a6");
      break;
    case "bubble":
      box(x - 65, y - 30, 130, 60, C.cream);
      poly(
        [
          [x + 35, y + 30],
          [x + 48, y + 42],
          [x + 48, y + 30],
        ],
        C.cream,
      );
      text("one last thing", x, y + 3, 12, "#283544");
      break;
    case "curtain":
      box(x - 9, 95, 18, 100, C.dark);
      text("→", x, 152, 15, C.cream);
      break;
    case "logo":
      box(x - 36, y - 20, 72, 40, C.green);
      text("ALMOST", x, y + 5, 13, C.cream);
      break;
  }
}
function draw() {
  box(0, 0, 480, 270, "#202c3a");
  box(0, 222, 480, 48, "#18222e");
  line(0, 222, 480, 222, "#405068", 1);
  for (let i = 0; i < 8; i++) box(30 + i * 61, 244, 30, 2, "#29384b");
  switch (index) {
    case 0:
      ellipse(240, 225, 80, 8, C.shadow);
      poly(
        [
          [213, 190],
          [204, 150],
          [215, 103],
          [242, 68],
          [261, 65],
          [239, 110],
          [237, 150],
          [260, 190],
        ],
        C.cream,
      );
      text("START HERE ↑", 240, 248, 10);
      break;
    case 1:
      box(294, 113, 92, 12, C.dark);
      box(294, 113, 10, 58, C.dark);
      box(376, 113, 10, 58, C.dark);
      line(300, 150, 380, 150, C.wood, 8);
      text("THE WALL", 340, 85, 10);
      text(state.steps ? "Now hang it." : "Flip ←", 125, 235, 10);
      break;
    case 2:
    case 5:
    case 6:
      mouth();
      break;
    case 3:
      ellipse(250, 145, 99, 82, C.cream);
      ellipse(250, 145, 89, 74, "#bd864a");
      ellipse(250, 145, 81, 66, C.yellow);
      for (let i = 0; i < 12; i++) {
        const a = i * 2.4;
        ellipse(
          250 + Math.cos(a) * (25 + i * 4),
          145 + Math.sin(a) * (20 + i * 3),
          8,
          7,
          "#bd6551",
        );
      }
      state.cuts.forEach((c) => line(c[0], c[1], c[2], c[3], C.dark, 3));
      text("Two cuts. No equal shares.", 250, 248, 10);
      break;
    case 4:
      drawBowl();
      break;
    case 7:
      drawFridgeAndGlass();
      break;
    case 8:
      picture(115);
      picture(240, state.angle);
      picture(365);
      break;
    case 9:
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 5; c++) {
          ctx.save();
          ctx.translate(120 + c * 60, 88 + r * 60);
          if (r === 1 && c === 2) ctx.rotate(state.angle);
          box(-28, -28, 56, 56, C.cream);
          poly(
            [
              [-22, -22],
              [22, 22],
              [-22, 22],
            ],
            C.blue,
          );
          ctx.restore();
        }
      break;
    case 10:
    case 13:
      box(100, 140, 280, 12, C.shadow);
      box(
        100,
        140,
        Math.round(((index === 10 ? state.value : state.value) / 100) * 280),
        12,
        C.green,
      );
      text(`${state.value}%`, 240, 110, 30);
      text(
        index === 10 ? "UPDATING YOUR SENSE OF ORDER" : "NO MULTIPLES OF FIVE",
        240,
        202,
        10,
      );
      break;
    case 11:
      [3, 2, 2, 1].forEach((v, i) => {
        box(96 + i * 75, 83, 58, 58, C.shadow);
        box(99 + i * 75, 86, 52, 52, "#e4dac6");
        text(String(v), 125 + i * 75, 119, 20, "#aaa089");
      });
      break;
    case 12:
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) {
          if (r === 2 && c === 0) continue;
          box(95 + c * 55, 65 + r * 55, 53, 53, (r + c) % 2 ? C.blue : C.green);
        }
      box(95, 175, 54, 54, C.shadow);
      ctx.strokeStyle = C.yellow;
      ctx.strokeRect(95, 175, 54, 54);
      break;
    case 14:
      drawCabinet();
      break;
    case 15:
      drawBed();
      break;
    case 16:
      ellipse(376, 130, 28, 35, "#c99d7c");
      box(345, 166, 62, 57, C.green);
      line(361, 126, 367, 126);
      line(383, 126, 389, 126);
      line(365, 146, 386, 146);
      text(`${state.steps} last things so far`, 140, 222, 10);
      break;
    case 17:
      drawDoor();
      break;
    case 18:
      break;
    case 19:
      break;
  }
  objects.filter((o) => o !== drag?.o).forEach(drawObject);
  if (drag) drawObject(drag.o);
  if ((index === 4 || index === 7) && state.pouring) {
    const m = objects.find((o) => o.type === "milk");
    const tip = milkSpout(m);
    line(
      tip.x,
      tip.y,
      240,
      index === 4 ? 177 : 194 - (state.fill || 0) * 43,
      "#fffdf7",
      5,
    );
    for (let i = 0; i < 5; i++)
      box(
        222 + ((i * 11) % 35),
        190 - (state.fill || 0) * 18 + Math.sin(elapsed * 16 + i) * 3,
        3,
        2,
        "#fffdf7",
      );
  }
  if (finished) {
    box(18, 15, 90, 19, C.green);
    text("WELL. DONE.", 63, 28, 10, C.cream);
  }
}
function point(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * 480) / r.width,
    y: ((e.clientY - r.top) * 270) / r.height,
  };
}
canvas.addEventListener("pointerdown", (e) => {
  if (finished || !active || drag || transition) return;
  const p = point(e);
  let o = [...objects]
    .reverse()
    .find(
      (o) =>
        !o.hidden &&
        !o.done &&
        (index !== 5 || o.order === state.steps) &&
        Math.abs(p.x - o.x) <= o.w / 2 + 5 &&
        Math.abs(p.y - o.y) <= o.h / 2 + 5,
    );
  if (index === 3) {
    o = objects[0];
    o.x = p.x;
    o.y = p.y;
  }
  if (!o) return;
  if (index === 5 && o.order !== state.steps) {
    say("Start with the top remaining layer. One at a time.");
    return;
  }
  startAudio();
  drag = {
    o,
    start: p,
    origin: { x: o.x, y: o.y },
    offset: { x: p.x - o.x, y: p.y - o.y },
    path: [p],
  };
  canvas.setPointerCapture(e.pointerId);
  e.preventDefault();
});
canvas.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = point(e),
    o = drag.o;
  drag.path.push(p);
  o.x = Math.max(o.w / 2, Math.min(480 - o.w / 2, p.x - drag.offset.x));
  o.y = Math.max(o.h / 2, Math.min(270 - o.h / 2, p.y - drag.offset.y));
  if (index === 0) {
    o.x = o.home.x;
    o.y = Math.min(o.home.y, o.y);
  }
  if (index === 8 || index === 9) {
    state.angle = Math.max(
      0,
      Math.min(
        index === 8 ? 0.24 : Math.PI / 2,
        (p.y - drag.start.y) / (index === 8 ? 150 : 48),
      ),
    );
  }
  if (index === 10 || index === 13) {
    o.y = index === 10 ? 145 : 150;
    o.x = Math.max(100, Math.min(380, o.x));
    state.value = Math.round(((o.x - 100) / 280) * 100);
    if (index === 10 && state.value >= 97) state.value = 99;
    if (index === 13)
      state.value = legalVolume(state.value, p.x - drag.start.x);
    o.x = 100 + state.value * 2.8;
  }
  if (index === 14) {
    state.extension = Math.max(7, Math.min(110, p.x - drag.offset.x - 280));
    o.x = 280 + state.extension;
    o.y = 151;
  }
  if (index === 17) {
    o.x = 283;
    o.y = 156;
    state.depth = Math.max(-1, Math.min(1, (p.y - drag.start.y) / 65));
  }
});
canvas.addEventListener("pointerup", (e) => {
  if (!drag) return;
  const d = drag,
    o = d.o,
    p = point(e),
    dx = p.x - d.start.x,
    dy = p.y - d.start.y;
  drag = null;
  let accepted = false;
  const back = () => {
    o.x = o.home.x;
    o.y = o.home.y;
  };
  switch (index) {
    case 0:
      if (dy < -65) {
        o.done = true;
        o.y = 95;
        state.steps++;
        accepted = true;
        if (state.steps === 3) win();
        else say("One strip peeled from the wrong end. Keep going.");
      } else back();
      break;
    case 1:
      if (!o.flipped && dx < -35) {
        o.flipped = true;
        state.steps = 1;
        back();
        accepted = true;
        say("Loose end behind. Now drag it onto the holder.");
      } else if (o.flipped && near(o, 340, 150, 50)) {
        o.x = 340;
        o.y = 145;
        win();
      } else {
        back();
        say("Flip it with a leftward drag before hanging it.");
      }
      break;
    case 2:
      if (near(o, 385, 145, 60)) {
        o.x = 325;
        o.y = 145;
        o.bitten = true;
        win();
      } else back();
      break;
    case 3: {
      const cut = clipPizza(d.start, p);
      if (cut) {
        const mid = { x: (cut[0] + cut[2]) / 2, y: (cut[1] + cut[3]) / 2 };
        if (Math.hypot(mid.x - 250, ((mid.y - 145) * 89) / 74) < 13) {
          say("Suspiciously fair. Cut away from the middle.");
        } else if (
          state.cuts.some(
            (c) =>
              Math.hypot(c[0] - cut[0], c[1] - cut[1]) +
                Math.hypot(c[2] - cut[2], c[3] - cut[3]) <
              22,
          )
        ) {
          say("That slice already exists. Try another angle.");
        } else if (state.cuts.length && !unequalPieces([...state.cuts, cut])) {
          say("Those portions are too fair. Try a different angle.");
        } else {
          state.cuts.push(cut);
          accepted = true;
          if (state.cuts.length >= 2) win();
          else say("Unequal. Lovely. One more cut.");
        }
      } else say("Drag a line across the pizza, in any direction.");
      break;
    }
    case 4:
      if (o.type === "cereal" && near(o, 240, 145, 72) && state.steps === 1) {
        state.steps = 2;
        win();
      } else if (o.type === "cereal" && state.steps === 0)
        say("Milk first. We are doing this wrong on purpose.");
      else if (o.type === "milk" && state.steps === 0)
        say("Hold the carton above the bowl to pour.");
      back();
      break;
    case 5:
      if (near(o, 385, 145, 65)) {
        o.hidden = true;
        state.steps++;
        accepted = true;
        if (state.steps === 5) win();
        else say("Just that layer. Deliciously inefficient.");
      } else back();
      break;
    case 6:
      if (near(o, 385, 145, 65)) {
        o.bitten = true;
        o.done = true;
        state.steps++;
        accepted = true;
        if (state.steps === 4) win();
        else say("One bite only. Next doughnut.");
      }
      back();
      break;
    case 7:
      if (state.steps === 1 && near(o, 365, 150, 65)) {
        o.x = 365;
        o.y = 151;
        win();
      } else {
        back();
        if (state.steps === 0)
          say("Hold the carton over the glass until almost empty.");
      }
      break;
    case 8:
      if (state.angle > 0.08) {
        o.hidden = true;
        win();
      } else {
        state.angle = 0;
        back();
      }
      break;
    case 9:
      if (state.angle > 1.2) {
        state.angle = Math.PI / 2;
        o.hidden = true;
        win();
      } else {
        state.angle = 0;
        back();
      }
      break;
    case 10:
      if (state.value === 99) win();
      else say("Almost finished. Get to 99%.");
      break;
    case 11: {
      const slot = Math.round((o.x - 125) / 75),
        goal = [3, 2, 2, 1];
      if (
        slot >= 0 &&
        slot < 4 &&
        Math.abs(o.y - 112) < 35 &&
        !state.slots.includes(slot) &&
        o.value === goal[slot]
      ) {
        o.x = 125 + slot * 75;
        o.y = 112;
        o.done = true;
        state.slots.push(slot);
        accepted = true;
        if (state.slots.length === 4) win();
      } else {
        back();
        say("The countdown goes 3, 2, 2, 1. Yes, two twos.");
      }
      break;
    }
    case 12:
      if (near(o, 122, 202, 40)) {
        o.x = 128;
        o.y = 206;
        win();
      } else back();
      break;
    case 13:
      if (state.value > 1 && state.value % 5 !== 0) win();
      else say("Any number but a tidy one. Move the slider.");
      break;
    case 14:
      if (state.extension <= 15) {
        state.extension = 9;
        o.x = 289;
        win();
      } else say("Push the drawer left, into the cabinet.");
      break;
    case 15: {
      const targets = bedCorners,
        t = targets[o.corner];
      if (near(o, ...t, 34)) {
        o.x = t[0];
        o.y = t[1];
        o.done = true;
        state.corners.push(o.corner);
        state.steps++;
        accepted = true;
        if (state.steps === 4) {
          const opposite = objects.find((a) => a.corner === 3 - o.corner);
          state.pop = {
            o: opposite,
            from: { x: opposite.x, y: opposite.y },
            time: 0,
          };
          state.corners = state.corners.filter((c) => c !== opposite.corner);
          win();
        } else say("");
      } else back();
      break;
    }
    case 16:
      if (near(o, 375, 135, 70)) {
        state.steps++;
        accepted = true;
        back();
        if (state.steps === 3) win();
        else say("Oh, and one last thing…");
      } else back();
      break;
    case 17:
      if (!state.pulled && dy > 30) {
        state.pulled = true;
        state.depth = 0.3;
        say("It says PUSH. Try away from you. ↑");
      } else if (state.pulled && dy < -35) {
        state.depth = -1;
        win();
      } else {
        state.depth = 0;
        say("Pull toward you ↓, then push away ↑.");
      }
      back();
      break;
    case 18:
      break;
    case 19:
      break;
  }
  if (accepted) chime(523, 0.16, 0.025);
});
canvas.addEventListener("pointercancel", () => {
  if (drag) {
    drag.o.x = drag.origin.x;
    drag.o.y = drag.origin.y;
    drag = null;
  }
});
let audio = null,
  gain = null,
  muted = false,
  noteAt = 0,
  note = 0;
function startAudio() {
  if (!audio) {
    try {
      audio = new (window.AudioContext || window.webkitAudioContext)();
      gain = audio.createGain();
      gain.gain.value = muted ? 0 : 0.45;
      gain.connect(audio.destination);
    } catch {
      return;
    }
  }
  if (audio.state === "suspended") audio.resume().catch(() => {});
}
function chime(freq, duration = 0.8, vol = 0.045, metal = false) {
  if (!audio || muted) return;
  const now = audio.currentTime;
  const partials = metal ? [1, 1.47, 2.09, 2.56] : [1, 4, 9.2];
  partials.forEach((ratio, i) => {
    const osc = audio.createOscillator(),
      g = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq * ratio;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(vol / (1 + i * 3), now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration / (1 + i * 0.3));
    osc.connect(g).connect(gain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  });
}
function music() {
  if (!audio || muted || !active || document.hidden) return;
  if (audio.currentTime < noteAt) return;
  const phrase = scenePhrase(index, note);
  if (phrase.freq) xylophone(phrase.freq, 0.22);
  if (note % 12 === 0) chime(2100 + (index % 4) * 170, 1.5, 0.008, true);
  note++;
  noteAt = audio.currentTime + phrase.gap;
}
$("#sound").onclick = () => {
  muted = !muted;
  startAudio();
  if (gain) gain.gain.setTargetAtTime(muted ? 0 : 0.45, audio.currentTime, 0.1);
  $("#sound").textContent = muted ? "Sound off" : "Sound on";
  $("#sound").setAttribute("aria-pressed", String(!muted));
};
function collection() {
  if (completed.size < 18) return;
  active = false;
  $("#scene-list").replaceChildren();
  scenes.forEach((s, i) => {
    const b = document.createElement("button");
    b.textContent = `${completed.has(i) ? "✓" : "○"} ${String(i + 1).padStart(2, "0")}  ${s[0]}`;
    b.onclick = () => {
      $("#collection").close();
      active = true;
      beginTransition(i);
    };
    $("#scene-list").append(b);
  });
  $("#collection").showModal();
}
$("#album").onclick = collection;
$("#close").onclick = () => $("#collection").close();
$("#collection").addEventListener("close", () => (active = true));
$("#ending").addEventListener("close", () => (active = true));
$("#reset").onclick = () => {
  if (!transition) load(index);
};
$("#hint").onclick = () => {
  if (transition) return;
  const teases = [
    "A hint? Already? Let the tiny annoyance sink in.",
    "Have you tried being a little more triggered?",
    "Take a breath. Make it worse. Next click: actual help.",
  ];
  say(hintClicks < 3 ? teases[hintClicks++] : scenes[index][3]);
};
$("#next").onclick = () => {
  if (!finished || transition) return;
  if (completed.size === 18) {
    active = false;
    $("#ending").showModal();
  } else beginTransition((index + 1) % 18);
};
$("#replay").onclick = () => {
  $("#ending").close();
  collection();
};
document.addEventListener("visibilitychange", () => {
  if (audio) {
    if (document.hidden) audio.suspend().catch(() => {});
    else audio.resume().catch(() => {});
  }
});
function frame(t) {
  const dt = Math.min((t - last) / 1000, 0.05);
  last = t;
  if (active && !document.hidden) {
    elapsed += dt;
    if (transition) {
      updateTransition(dt);
      requestAnimationFrame(frame);
      return;
    }
    updatePour(dt);
    updateBed(dt);
    draw();
    music();
  }
  requestAnimationFrame(frame);
}
const bedCorners = [
  [140, 92],
  [310, 92],
  [110, 220],
  [340, 220],
];
function legalVolume(value, direction = 1) {
  value = Math.max(1, Math.min(99, value));
  if (value % 5 === 0) value += direction < 0 ? -1 : 1;
  return value;
}
function unequalPieces(cuts) {
  const areas = new Map();
  for (let y = -29; y <= 29; y++)
    for (let x = -29; x <= 29; x++) {
      if (x * x + y * y > 29 * 29) continue;
      const px = 250 + (x * 89) / 29,
        py = 145 + (y * 74) / 29;
      let mask = 0;
      cuts.forEach((c, i) => {
        if ((c[2] - c[0]) * (py - c[1]) - (c[3] - c[1]) * (px - c[0]) > 0)
          mask |= 1 << i;
      });
      areas.set(mask, (areas.get(mask) || 0) + 1);
    }
  const values = [...areas.values()];
  return values.length >= 3 && Math.max(...values) / Math.min(...values) > 1.3;
}
function clipPizza(a, b) {
  const dx = (b.x - a.x) / 89,
    dy = (b.y - a.y) / 74,
    ax = (a.x - 250) / 89,
    ay = (a.y - 145) / 74;
  const A = dx * dx + dy * dy,
    B = 2 * (ax * dx + ay * dy),
    D = B * B - 4 * A * (ax * ax + ay * ay - 1);
  if (A < 0.4 || D <= 0) return null;
  const t0 = (-B - Math.sqrt(D)) / (2 * A),
    t1 = (-B + Math.sqrt(D)) / (2 * A);
  if (t1 < 0 || t0 > 1) return null;
  return [
    a.x + (b.x - a.x) * t0,
    a.y + (b.y - a.y) * t0,
    a.x + (b.x - a.x) * t1,
    a.y + (b.y - a.y) * t1,
  ];
}
function drawBowl() {
  ellipse(240, 210, 83, 10, "#111923");
  ellipse(240, 184, 76, 34, "#5486ab");
  box(164, 168, 152, 17, "#5486ab");
  ellipse(240, 168, 76, 23, "#111e2c");
  ellipse(
    240,
    176 - (state.fill || 0) * 8,
    68,
    (state.fill || 0) * 18,
    "#fffdf7",
  );
  ctx.strokeStyle = "#8dc4df";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(240, 168, 76, 23, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (state.steps > 1)
    for (let i = 0; i < 30; i++)
      box(184 + ((i * 23) % 110), 157 + ((i * 7) % 22), 6, 3, C.yellow);
  if (state.steps === 0) {
    text("HOLD ABOVE BOWL", 240, 242, 10);
    line(221, 122, 234, 145, "#84afc8", 2);
  } else if (state.steps === 1) text("NOW THE CEREAL", 240, 242, 10);
}
function drawFridgeAndGlass() {
  box(320, 37, 114, 191, "#74899a");
  box(328, 45, 98, 173, "#172d40");
  box(333, 53, 88, 7, "#f3edbf");
  box(329, 174, 96, 6, "#91a2ad");
  box(329, 117, 96, 6, "#91a2ad");
  box(337, 89, 22, 25, "#d58e60");
  box(370, 83, 28, 31, "#719760");
  poly(
    [
      [426, 45],
      [461, 57],
      [461, 226],
      [426, 218],
    ],
    "#98acb5",
  );
  box(447, 117, 5, 39, "#405569");
  text("FRIDGE", 377, 205, 9);
  box(210, 149, 60, 75, "#7eaac0");
  box(214, 153, 52, 65, "#132b3c");
  const f = state.fill || 0;
  box(216, 215 - f * 56, 48, f * 56, "#fffdf7");
  ellipse(240, 151, 30, 7, "#b0d4dc");
  ellipse(240, 151, 26, 4, "#183349");
  line(216, 157, 216, 214, "#c1dfe5", 2);
  if (state.steps === 0) text("HOLD ABOVE GLASS", 226, 247, 10);
  else text("JUST A TEASPOON LEFT →", 229, 247, 9);
}
function updatePour(dt) {
  if (index !== 4 && index !== 7) return;
  const o = objects.find((o) => o.type === "milk");
  state.pouring = !!(
    drag?.o === o &&
    state.steps === 0 &&
    near(o, 220, 111, 65)
  );
  const target = state.pouring ? 1.05 : 0;
  o.tilt = (o.tilt || 0) + (target - (o.tilt || 0)) * Math.min(1, dt * 8);
  if (state.pouring && (o.tilt || 0) > 0.8) {
    state.fill = Math.min(
      index === 7 ? 0.965 : 1,
      (state.fill || 0) + dt / 1.9,
    );
    if (state.fill >= (index === 7 ? 0.965 : 1)) {
      state.steps = 1;
      state.pouring = false;
      chime(660, 0.2, 0.03);
      say(
        index === 7
          ? "One teaspoon left. Back in the fridge."
          : "Milk first. Now add cereal.",
      );
    }
  }
}
function drawCabinet() {
  const e = state.extension || 9;
  ellipse(250, 238, 160, 10, "#111923");
  box(108, 55, 172, 171, "#71523f");
  poly(
    [
      [108, 55],
      [137, 37],
      [300, 37],
      [280, 55],
    ],
    "#b2835d",
  );
  box(119, 72, 148, 125, "#1a1718");
  box(119, 204, 148, 15, "#a77550");
  box(127, 219, 14, 20, "#71523f");
  box(257, 219, 14, 20, "#71523f");
  box(139 + e, 126, 140, 50, "#b98860");
  box(145 + e, 132, 127, 34, "#46362f");
  box(145 + e, 165, 127, 10, "#c89972");
  box(278 + e, 112, 12, 84, "#d0a279");
  box(288 + e, 140, 13, 25, "#8298a4");
  line(278, 64, 278, 204, "#2b2020", 3);
  text("SIDE VIEW", 169, 28, 9);
  if (!finished) {
    line(369, 88, 308, 88, C.blue, 2);
    poly(
      [
        [308, 88],
        [318, 82],
        [318, 94],
      ],
      C.blue,
    );
  } else text("STILL OPEN.", 340, 90, 10);
}
function drawBed() {
  const points = objects.filter((o) => o.type === "tab").map((o) => [o.x, o.y]);
  ellipse(228, 241, 146, 11, "#101923");
  box(124, 54, 201, 56, "#70513e");
  box(133, 60, 182, 36, "#9b7755");
  box(117, 218, 14, 26, "#70513e");
  box(322, 218, 14, 26, "#70513e");
  poly(
    [
      [140, 92],
      [310, 92],
      [340, 220],
      [110, 220],
    ],
    "#f1ead8",
  );
  poly(
    [
      [110, 220],
      [340, 220],
      [340, 233],
      [110, 233],
    ],
    "#a9a38f",
  );
  poly(
    [
      [310, 92],
      [340, 220],
      [340, 233],
      [310, 106],
    ],
    "#c4bca7",
  );
  if (points.length === 4) {
    poly([points[0], points[1], points[3], points[2]], "#7394b3");
    poly(
      [
        [points[2][0], points[2][1]],
        [points[3][0], points[3][1]],
        [points[3][0], points[3][1] + 9],
        [points[2][0], points[2][1] + 9],
      ],
      "#536d8b",
    );
    for (let i = 1; i < 5; i++)
      line(170 + i * 22, 125, 150 + i * 30, 194, "#89a7bf", 1);
  }
  poly(
    [
      [151, 98],
      [215, 98],
      [210, 119],
      [146, 119],
    ],
    "#fff9e9",
  );
  poly(
    [
      [234, 98],
      [298, 98],
      [303, 119],
      [235, 119],
    ],
    "#fff9e9",
  );
  bedCorners.forEach(([x, y], i) => {
    ctx.strokeStyle = state.corners.includes(i) ? "#87bc8e" : "#e9bf58";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 9, y - 9, 18, 18);
  });
}
function updateBed(dt) {
  if (index !== 15 || !state.pop) return;
  const p = state.pop;
  p.time = Math.min(1, p.time + dt * 1.8);
  const q = 1 - Math.pow(1 - p.time, 3);
  p.o.x = p.from.x + (p.o.home.x - p.from.x) * q;
  p.o.y =
    p.from.y + (p.o.home.y - p.from.y) * q - Math.sin(p.time * Math.PI) * 24;
}
function drawDoor() {
  box(153, 29, 173, 218, "#738190");
  box(164, 38, 150, 203, "#101722");
  poly(
    [
      [164, 241],
      [314, 241],
      [372, 270],
      [108, 270],
    ],
    "#34414f",
  );
  line(239, 241, 239, 270, "#4c5e70");
  const d = state.depth || 0;
  const right = 305 + d * 48,
    top = 45 - d * 15,
    bottom = 235 + d * 18;
  poly(
    [
      [169, 43],
      [right, top],
      [right, bottom],
      [169, 235],
    ],
    "#a67a54",
  );
  poly(
    [
      [169, 43],
      [right, top],
      [right + 5, top - 4],
      [174, 39],
    ],
    "#cca477",
  );
  line(177, 52, 177, 225, "#755136", 3);
  ctx.save();
  ctx.translate(224, 88);
  ctx.scale(Math.max(0.45, 1 + d * 0.3), 1);
  box(-32, -15, 64, 30, "#f0e5cd");
  text("PUSH", 0, 6, 17, "#302e2b");
  ctx.restore();
  const hx = right - 22;
  box(hx - 4, 137, 8, 39, "#eed180");
  box(hx - 1, 143, 8, 28, "#a37642");
  if (!finished)
    text(state.pulled ? "↑ PUSH AWAY" : "↓ PULL TOWARD YOU", 240, 261, 10);
}
// Short, real scene-change interstitials. The new scene is prepared behind the
// transition; the progress display deliberately never reaches 100.
const loadingTips = [
  "For a perfectly peaceful afternoon, always remember to check the little thing behind the thing you just moved.",
  "If a task seems impossible, the secret is to stop, take a breath, and then very carefully adjust the opposite corner.",
  "The best way to share a pizza fairly is to first establish which friend you secretly like the least.",
  "You can avoid nearly every household disagreement by agreeing in advance which side of the roll should face the wall.",
];
function beginTransition(target) {
  if (transition) return;
  drag = null;
  transition = {
    target,
    time: 0,
    progress: 0,
    ready: false,
    tip: loadingTips[target % 4],
    showLogo: target % 3 === 0,
  };
  $("#next").hidden = true;
  $("#reset").disabled = true;
  $("#hint").disabled = true;
  $("#album").disabled = true;
  $("#loading").hidden = false;
  $("#loading-tip").textContent = "";
  $("#load-progress").value = 0;
  $("#load-number").textContent = "0%";
  const task = transition;
  prepareScene(target)
    .then(() => {
      task.ready = true;
    })
    .catch(() => {
      task.ready = true;
    });
}
async function prepareScene(target) {
  if (!audio) return;
  for (let group = 0; group < 4; group++) {
    for (let n = group * 4; n < group * 4 + 4; n++) {
      const phrase = scenePhrase(target, n);
      if (phrase.freq) xyloBuffer(audio, phrase.freq);
    }
    await new Promise(requestAnimationFrame);
  }
}
function updateTransition(dt) {
  const t = transition;
  t.time += dt;
  t.progress = Math.min(99, Math.floor((t.time / 1.25) * 99));
  $("#load-progress").value = t.progress;
  $("#load-number").textContent = t.progress + "%";
  $("#loading-tip").textContent = t.tip.slice(0, Math.floor(t.time * 25)) + "…";
  box(0, 0, 480, 270, "#141d29");
  if (t.showLogo) {
    const bounce = (n, max) => max - Math.abs((n % (max * 2)) - max);
    const x = 44 + bounce(345 + t.time * 73, 345),
      y = 3 + bounce(236 + t.time * 47, 236);
    box(x, y, 88, 28, "#689c91");
    text("ALMOST", x + 44, y + 19, 13, "#12202c");
  }
  if (t.time >= 1.8 && t.ready) {
    const target = t.target;
    transition = null;
    load(target);
    $("#loading").hidden = true;
    $("#reset").disabled = false;
    $("#hint").disabled = false;
  }
}
function scenePhrase(scene, beat) {
  const scales = [
    [0, 2, 4, 7, 9],
    [0, 3, 5, 7, 10],
    [0, 2, 5, 7, 9],
  ];
  const scale = scales[scene % 3];
  const phrase = Math.floor(beat / 8) % 8,
    step = beat % 8;
  const pattern = [0, 2, 1, 4, 2, 3, 1, 0];
  const degree = (pattern[(step + scene) % 8] + phrase + (scene % 5)) % 5;
  const midi =
    60 +
    (scene % 6) * 2 +
    scale[degree] +
    (phrase % 3 === 2 && step % 3 === 0 ? 12 : 0);
  return {
    freq: step === 7 && phrase % 2 ? 0 : 440 * Math.pow(2, (midi - 69) / 12),
    gap: (0.42 + (scene % 5) * 0.065) * (step === 3 || step === 7 ? 1.6 : 1),
  };
}
const xyloCache = new Map();
function xyloBuffer(context, freq) {
  const key = Math.round(freq * 100);
  if (xyloCache.has(key)) return xyloCache.get(key);
  const rate = context.sampleRate,
    b = context.createBuffer(1, Math.floor(rate * 0.95), rate),
    out = b.getChannelData(0);
  let seed = key | 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / rate;
    seed = (seed * 1664525 + 1013904223) | 0;
    const noise = (seed / 2147483648) * Math.exp(-t * 260) * 0.22;
    out[i] =
      Math.min(1, t / 0.002) *
      (Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5.8) +
        0.34 * Math.sin(2 * Math.PI * freq * 3.99 * t) * Math.exp(-t * 15) +
        0.13 * Math.sin(2 * Math.PI * freq * 9.2 * t) * Math.exp(-t * 30) +
        noise) *
      0.62;
  }
  xyloCache.set(key, b);
  return b;
}
function xylophone(freq, volume) {
  if (!audio || muted) return;
  const source = audio.createBufferSource(),
    v = audio.createGain();
  source.buffer = xyloBuffer(audio, freq);
  v.gain.value = volume;
  source.connect(v).connect(gain);
  source.start();
  source.onended = () => {
    source.disconnect();
    v.disconnect();
  };
}

load(index);
requestAnimationFrame(frame);

// Some mobile browsers suppress a synthetic click immediately after a captured
// canvas gesture. Activate a stationary touch on release, and deduplicate its
// later native click. Mouse and keyboard activation retain native behavior.
let touchButton = null;
let recentTouchButton = null;
let recentTouchAt = -Infinity;
document.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "touch") return;
  const button = event.target.closest("button");
  touchButton = button ? { button, x: event.clientX, y: event.clientY } : null;
});
document.addEventListener("pointercancel", () => {
  touchButton = null;
});
document.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "touch" || !touchButton) return;
  const candidate = touchButton;
  touchButton = null;
  if (
    event.target.closest("button") !== candidate.button ||
    Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) > 12
  )
    return;
  event.preventDefault();
  recentTouchButton = candidate.button;
  recentTouchAt = performance.now();
  candidate.button.click();
});
document.addEventListener(
  "click",
  (event) => {
    if (
      event.isTrusted &&
      recentTouchButton &&
      (event.pointerType === "touch" ||
        event.sourceCapabilities?.firesTouchEvents) &&
      performance.now() - recentTouchAt < 500
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);
