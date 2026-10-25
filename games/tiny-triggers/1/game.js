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
    "Drag the cutter across the pizza twice. Make the slices very unequal.",
    "Cut from above the pizza to below it: once near the left, once near the middle.",
    "Somebody gets the tiny slice. Somebody remembers.",
  ],
  [
    "Milk comes first",
    "FOOD CRIMES",
    "Pour milk into the empty bowl. Only then add the cereal.",
    "Move the milk over the bowl, then move the cereal there.",
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
    "Drag milk over the glass, then return the teaspoon-filled carton to the fridge.",
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
    "Drag the loose piece into the outlined gap. It almost fits.",
    "It looked so promising.",
  ],
  [
    "A sensible volume",
    "ALMOST RIGHT",
    "Set the volume near 50. Not exactly 50.",
    "Drag the knob toward the center. Choose 49 or 51.",
    "A perfectly unreasonable volume.",
  ],
  [
    "Shut enough",
    "EVERYDAY ANNOYANCES",
    "Slide the drawer almost closed. Leave a little gap.",
    "Drag the drawer handle upward until just before it closes.",
    "That is going to bother someone all afternoon.",
  ],
  [
    "The last corner",
    "EVERYDAY ANNOYANCES",
    "Stretch the fitted sheet onto all four corners.",
    "Drag each pink sheet tab to its nearest bed corner. The opposite corner has other plans.",
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
    "Drag the brass handle left first, then right past the center.",
    "Excellent handle. Terrible instructions.",
  ],
  [
    "Helpful advice",
    "EVERYDAY ANNOYANCES",
    "Drag the loading curtain over the tip before it finishes.",
    "Pull the curtain tab from left to right across the half-revealed sentence.",
    "The important part was probably at the end.",
  ],
  [
    "So very close",
    "EVERYDAY ANNOYANCES",
    "Aim the bouncing logo at the top-right corner. Miss it by a pixel.",
    "Drag the logo to the tiny outlined target near the top-right.",
    "Almost. Forever.",
  ],
];
let completed = new Set(),
  index = 0;
try {
  const p = JSON.parse(localStorage.getItem("tinyTriggers.v1") || "{}");
  completed = new Set(
    (Array.isArray(p.done) ? p.done : []).filter(
      (n) => Number.isInteger(n) && n >= 0 && n < 20,
    ),
  );
  index = Number.isInteger(p.index) ? Math.max(0, Math.min(19, p.index)) : 0;
} catch {}
let objects = [],
  state = {},
  drag = null,
  finished = false,
  elapsed = 0,
  last = 0,
  active = true;
const C = {
  ink: "#484737",
  dark: "#655a47",
  wood: "#bb8b63",
  shadow: "#d0c5ab",
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
      "tinyTriggers.v1",
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
    completed.size === 20 ? "Admire the damage →" : "Next tiny crime →";
  $("#count").textContent = `${completed.size} / 20 wonderfully wrong`;
  chime(784, 0.35, 0.04);
}
function load(n) {
  index = n;
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
  $("#chapter").textContent = `${String(n + 1).padStart(2, "0")} / 20`;
  $("#next").hidden = true;
  $("#count").textContent = `${completed.size} / 20 wonderfully wrong`;
  say("Click, hold, and drag. There is no hurry.");
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
        obj("layer" + i, 155, 110 + i * 21, 110, 24, t, { order: i }),
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
      state.value = 25;
      obj("slider", 170, 150, 18, 38, "knob");
      break;
    case 14:
      obj("handle", 240, 202, 80, 30, "drawer");
      break;
    case 15:
      [
        [165, 110],
        [315, 110],
        [165, 190],
        [315, 190],
      ].forEach(([x, y], i) =>
        obj("tab" + i, x, y, 26, 26, "tab", { corner: i }),
      );
      break;
    case 16:
      obj("bubble", 140, 130, 130, 60, "bubble");
      break;
    case 17:
      obj("handle", 245, 150, 24, 50, "handle");
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
  box(364, 118, 8, 5, C.ink);
  box(395, 118, 8, 5, C.ink);
  ellipse(385, 149, 24, 14, C.ink);
  box(368, 137, 34, 5, C.cream);
  text("NOM", 385, 210, 10);
}
function milk(o) {
  box(o.x - 24, o.y - 32, 48, 66, C.cream);
  poly(
    [
      [o.x - 24, o.y - 32],
      [o.x - 12, o.y - 45],
      [o.x + 15, o.y - 45],
      [o.x + 24, o.y - 32],
    ],
    C.blue,
  );
  box(o.x - 24, o.y - 7, 48, 25, C.blue);
  text("MILK", o.x, o.y + 9, 12);
  if (index === 7 && state.steps > 0) text("1 tsp", o.x, o.y + 28, 8);
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
        ellipse(x + 35, y - 35, 25, 13, "#e8e0cd");
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
      text("FLAKES", x, y, 10);
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
      ellipse(x, y, 10, 9, "#e8e0cd");
      for (let i = 0; i < 7; i++)
        box(x - 22 + i * 7, y - 15 + (i % 3) * 12, 3, 2, C.cream);
      if (o.bitten) ellipse(x + 26, y - 15, 15, 14, "#e8e0cd");
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
      text(String(o.value), x, y + 9, 28);
      break;
    case "piece":
      box(x - 27, y - 27, 54, 54, C.green);
      ellipse(x, y - 27, 10, 8, C.green);
      ellipse(x + 27, y, 8, 10, C.green);
      box(x - 16, y - 10, 25, 7, "#c8d1ac");
      break;
    case "drawer":
      box(140, y - 35, 200, 50, C.wood);
      box(150, y - 28, 180, 34, "#ca9f79");
      box(x - 35, y - 5, 70, 10, C.dark);
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
      text("one last thing", x, y + 3, 12);
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
  box(0, 0, 480, 270, "#e8e0cd");
  box(0, 222, 480, 48, "#dbcfb4");
  line(0, 222, 480, 222, "#c6b89c", 1);
  for (let i = 0; i < 8; i++) box(30 + i * 61, 244, 30, 2, "#cbbb9e");
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
      ellipse(240, 184, 65, 28, C.blue);
      box(175, 168, 130, 18, C.blue);
      ellipse(240, 168, 65, 18, C.cream);
      if (state.steps) {
        ellipse(240, 168, 59, 13, "#fffdf4");
        if (state.steps > 1)
          for (let i = 0; i < 22; i++)
            box(190 + ((i * 23) % 98), 160 + ((i * 7) % 16), 6, 3, C.yellow);
      }
      break;
    case 7:
      box(302, 55, 119, 155, C.cream);
      box(308, 62, 107, 141, C.blue);
      line(308, 133, 415, 133, C.cream, 5);
      text("FRIDGE", 360, 85, 10);
      box(220, 160, 44, 55, C.blue);
      box(225, 165, 34, 45, state.steps ? C.cream : "#d1d5c5");
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
        index === 10
          ? "UPDATING YOUR SENSE OF ORDER"
          : "VOLUME · ANYTHING BUT FIFTY",
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
          if (r === 1 && c === 2) continue;
          box(95 + c * 55, 65 + r * 55, 53, 53, (r + c) % 2 ? C.blue : C.green);
        }
      box(205, 120, 54, 54, C.shadow);
      text("THE LAST PIECE", 186, 249, 10);
      break;
    case 14:
      box(132, 67, 216, 145, C.dark);
      box(140, 75, 200, 70, C.wood);
      box(140, 150, 200, 56, "#403e33");
      text("A LITTLE GAP GOES A LONG WAY", 240, 247, 9);
      break;
    case 15:
      box(130, 70, 220, 160, C.wood);
      box(138, 78, 204, 142, C.cream);
      box(155, 98, 170, 104, C.blue);
      box(165, 87, 66, 27, C.cream);
      box(248, 87, 66, 27, C.cream);
      [
        [140, 80],
        [340, 80],
        [140, 220],
        [340, 220],
      ].forEach(([x, y], i) => {
        box(
          x - 8,
          y - 8,
          16,
          16,
          state.corners.includes(i) ? C.green : C.shadow,
        );
      });
      text(`${state.steps} / 4 corners attempted`, 240, 252, 10);
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
      box(173, 37, 145, 199, C.dark);
      box(
        181 + (state.pulled ? 5 : 0),
        45,
        129 - (state.pulled ? 10 : 0),
        183,
        C.wood,
      );
      box(208, 77, 72, 32, C.cream);
      text("PUSH", 244, 99, 19);
      if (state.pulled) text("It does say PUSH.", 240, 255, 10);
      break;
    case 18:
      box(75, 95, 330, 100, C.cream);
      text("USEFUL TIP #08", 240, 117, 10, C.dark);
      text("The secret to a happy life is", 240, 146, 11);
      text(
        "to always remember that " +
          ".".repeat(Math.min(3, Math.floor(elapsed) % 4)),
        240,
        167,
        10,
      );
      box(75, 95, Math.max(0, objects[0].x - 75), 100, C.green);
      text("LOADING…", 240, 223, 11);
      break;
    case 19:
      box(55, 37, 370, 175, C.dark);
      box(60, 42, 360, 165, "#343d3e");
      ctx.strokeStyle = C.yellow;
      ctx.strokeRect(344, 43, 73, 41);
      text("THE CORNER IS RIGHT THERE.", 240, 244, 10);
      break;
  }
  objects.filter((o) => o !== drag?.o).forEach(drawObject);
  if (drag) drawObject(drag.o);
  if (drag && (index === 4 || index === 7) && near(drag.o, 240, 145, 65)) {
    const o = drag.o;
    if (o.type === "milk") {
      line(o.x + 20, o.y + 20, 240, 168, C.cream, 5);
      text("pour…", 300, 195, 10);
    } else if (o.type === "cereal" && state.steps === 1) {
      for (let i = 0; i < 6; i++)
        box(
          230 + ((i * 7) % 20),
          145 + ((elapsed * 60 + i * 8) % 25),
          5,
          3,
          C.yellow,
        );
    }
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
  if (finished || !active || drag) return;
  const p = point(e);
  const o = [...objects]
    .reverse()
    .find(
      (o) =>
        !o.hidden &&
        !o.done &&
        Math.abs(p.x - o.x) <= o.w / 2 + 5 &&
        Math.abs(p.y - o.y) <= o.h / 2 + 5,
    );
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
    if (index === 13 && state.value === 50) state.value = p.x >= 240 ? 51 : 49;
    o.x = 100 + state.value * 2.8;
  }
  if (index === 14) {
    o.x = 240;
    o.y = Math.max(155, Math.min(210, o.y));
  }
  if (index === 17) {
    o.y = 150;
  }
  if (index === 18) {
    o.y = 145;
    o.x = Math.max(75, Math.min(405, o.x));
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
      const a = d.start,
        b = p;
      if (
        a.y < 100 &&
        b.y > 195 &&
        a.x > 175 &&
        a.x < 320 &&
        b.x > 175 &&
        b.x < 320
      ) {
        const x = (a.x + b.x) / 2;
        if (
          !state.cuts.length ||
          Math.abs(x - (state.cuts[0][0] + state.cuts[0][2]) / 2) > 35
        ) {
          state.cuts.push([a.x, a.y, b.x, b.y]);
          accepted = true;
          if (state.cuts.length === 2) win();
          else say("One cut. Make another, off to the side.");
        }
      }
      if (accepted) back();
      if (!accepted && !finished)
        say("Position the cutter above the pizza, then drag down through it.");
      break;
    }
    case 4:
      if (near(o, 240, 155, 65)) {
        if (o.id === "milk" && state.steps === 0) {
          state.steps = 1;
          accepted = true;
          say("Milk first. Now add the cereal.");
        } else if (o.id === "cereal" && state.steps === 1) {
          state.steps = 2;
          win();
        } else say("The milk must go in first. That is the crime.");
      }
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
      if (state.steps === 0 && near(o, 240, 165, 60)) {
        state.steps = 1;
        accepted = true;
        say("A teaspoon left. Put it back in the fridge.");
        back();
      } else if (state.steps === 1 && near(o, 360, 150, 70)) {
        o.x = 360;
        o.y = 160;
        win();
      } else back();
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
      if (near(o, 232, 147, 40)) {
        o.x = 238;
        o.y = 151;
        win();
      } else back();
      break;
    case 13:
      if (state.value === 49 || state.value === 51) win();
      else say("Find the center. Almost.");
      break;
    case 14:
      if (o.y >= 155 && o.y <= 166) {
        o.y = 160;
        win();
      } else say("Nearly closed. Pull the handle up a little more.");
      break;
    case 15: {
      const targets = [
          [140, 80],
          [340, 80],
          [140, 220],
          [340, 220],
        ],
        t = targets[o.corner];
      if (near(o, ...t, 32)) {
        o.x = t[0];
        o.y = t[1];
        o.done = true;
        state.corners.push(o.corner);
        state.steps++;
        accepted = true;
        if (state.steps === 4) {
          const opposite = objects.find((a) => a.corner === 3 - o.corner);
          opposite.x = opposite.home.x;
          opposite.y = opposite.home.y;
          state.corners = state.corners.filter((c) => c !== opposite.corner);
          win();
        } else say("That corner is on. Stretch the next tab.");
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
      if (!state.pulled && dx < -35) {
        state.pulled = true;
        accepted = true;
        back();
        say("It will not pull. Try pushing the handle right.");
      } else if (state.pulled && dx > 35) {
        o.x = 290;
        win();
      } else {
        back();
        say("An inviting handle. Pull left, then push right.");
      }
      break;
    case 18:
      if (o.x > 390) win();
      else say("Keep drawing the curtain across the unfinished tip.");
      break;
    case 19:
      if (near(o, 380, 63, 32)) {
        o.x = 380;
        o.y = 64;
        state.logoTime = 0;
        win();
      } else {
        back();
        say("Aim for the top-right outline. So very close.");
      }
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
  const partials = metal ? [1, 1.47, 2.09, 2.56] : [1, 3, 7];
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
  if (audio.currentTime > noteAt) {
    const melody = [
      523.25, 659.25, 783.99, 659.25, 587.33, 0, 523.25, 0, 440, 523.25, 659.25,
      0, 587.33, 523.25, 0, 0,
    ];
    if (melody[note % 16]) chime(melody[note % 16], 1.2, 0.055);
    if (note % 8 === 0) chime(1760, 2, 0.012, true);
    note++;
    noteAt = audio.currentTime + 0.72;
  }
}
$("#sound").onclick = () => {
  muted = !muted;
  startAudio();
  if (gain) gain.gain.setTargetAtTime(muted ? 0 : 0.45, audio.currentTime, 0.1);
  $("#sound").textContent = muted ? "Sound off" : "Sound on";
  $("#sound").setAttribute("aria-pressed", String(!muted));
};
function collection() {
  active = false;
  $("#scene-list").replaceChildren();
  scenes.forEach((s, i) => {
    const b = document.createElement("button");
    b.textContent = `${completed.has(i) ? "✓" : "○"} ${String(i + 1).padStart(2, "0")}  ${s[0]}`;
    b.onclick = () => {
      $("#collection").close();
      active = true;
      load(i);
    };
    $("#scene-list").append(b);
  });
  $("#collection").showModal();
}
$("#album").onclick = collection;
$("#close").onclick = () => $("#collection").close();
$("#collection").addEventListener("close", () => (active = true));
$("#ending").addEventListener("close", () => (active = true));
$("#reset").onclick = () => load(index);
$("#hint").onclick = () => say(scenes[index][3]);
$("#next").onclick = () => {
  if (completed.size === 20) {
    active = false;
    $("#ending").showModal();
  } else load((index + 1) % 20);
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
    if (index === 19 && finished) {
      state.logoTime = (state.logoTime || 0) + dt;
      const o = objects[0],
        v = state.logoTime;
      const bounce = (n, max) => max - Math.abs((n % (max * 2)) - max);
      o.x = 96 + bounce(284 + v * 31, 284);
      o.y = 64 + bounce(123 + v * 19, 123);
    }
    draw();
    music();
  }
  requestAnimationFrame(frame);
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
