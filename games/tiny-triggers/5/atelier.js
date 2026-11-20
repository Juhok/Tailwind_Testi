/* V4 illustration and interaction refinements, reviewed in three-scene batches.
   Coordinates are logical 480×270; the backing canvas is rendered at 2×. */
const SCENE_POLISH = new Map();
const DETAIL_ART = {};
function rounded(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
function curve(points, color, width = 2) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i += 3) {
    if (points[i + 2])
      ctx.bezierCurveTo(...points[i], ...points[i + 1], ...points[i + 2]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.lineCap = "butt";
}
function shade(x, y, w, h, a, b) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}
function stageShadow(x, y, rx = 50, ry = 6) {
  ellipse(x, y, rx, ry, "#070d183d");
}
function label(t, x, y, c = "#cfdbdf") {
  text(t, x, y, 9, c);
}
function detailArt(art, p) {
  if (!DETAIL_ART[art]) return false;
  DETAIL_ART[art](p);
  return true;
}
function sceneBackdrop() {
  const p = SCENE_POLISH.get(index);
  const room = p?.room || "studio";
  box(0, 0, 480, 270, shade(0, 0, 480, 230, "#344556", "#172332"));
  if (room === "bath") {
    for (let y = 12; y < 220; y += 45)
      for (let x = 10; x < 480; x += 66)
        rounded(x, y, 63, 42, 3, "#344a57", "#46606c");
  } else if (room === "kitchen") {
    box(25, 28, 430, 100, "#263947");
    for (let x = 40; x < 460; x += 60) line(x, 28, x, 128, "#3d5261", 1);
    line(25, 78, 455, 78, "#3d5261", 1);
  } else if (room === "desk") {
    rounded(25, 25, 430, 175, 12, "#283846", "#3d5060");
  } else if (room === "bedroom") {
    box(0, 155, 480, 70, "#3b3b4c");
    line(0, 154, 480, 154, "#777083", 3);
  }
  box(0, 222, 480, 48, "#17212c");
  line(0, 222, 480, 222, "#617078", 1);
  p?.back?.();
}
function sceneForeground() {
  SCENE_POLISH.get(index)?.front?.();
}
function taskProgress() {
  const w = workshop,
    g = w?.gesture,
    s = w?.def.steps[w.step];
  if (!g || !s) return 0;
  return Math.min(
    1,
    Math.hypot(g.o.x - g.origin.x, g.o.y - g.origin.y) /
      Math.max(1, Math.hypot(s.to[0] - g.origin.x, s.to[1] - g.origin.y)),
  );
}
function localProp(x, y, fn, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  fn();
  ctx.restore();
}
// Batch 01 — banana, toilet roll, chocolate.
REVISED_TASKS[0] = task(
  "banana",
  "Peel by peel",
  "Peel the banana upward from its blossom end, leaving the stem alone.",
  [],
  [prop("peel", "bananaGrip", 250, 204, { w: 52, h: 36 })],
  [
    step(
      "peel",
      330,
      71,
      "peel",
      "Pull the dark bottom tip up toward the stem",
      { hide: true },
    ),
  ],
  "One long peel. The other end.",
);
REVISED_TASKS[1] = task(
  "roll",
  "Against the wall",
  "Turn the roll so its loose end hangs behind it, then hang it.",
  [F("rollHolder", 340, 146)],
  [prop("roll", "paperRoll", 125, 148, { w: 110, h: 118 })],
  [
    step(
      "roll",
      65,
      148,
      "twist",
      "Turn the roll: paper behind, not in front",
      { reset: true, mark: "under", angle: 0 },
    ),
    step("roll", 340, 146, "drag", "Hang the roll with the paper at the wall"),
  ],
  "Under. Not over. You have chosen a side.",
);
REVISED_TASKS[2] = task(
  "chocolate",
  "Off the grid",
  "Snap across a chocolate square instead of along the grooves.",
  [F("chocolateSlab", 226, 142)],
  [prop("piece", "chocolateEdge", 280, 166, { w: 70, h: 58 })],
  [
    step(
      "piece",
      354,
      199,
      "bend",
      "Bend the lower-right square away from the grooves",
      { angle: 0.17 },
    ),
  ],
  "There were lines. You chose not to use them.",
);
function bananaShape(fill) {
  ctx.beginPath();
  ctx.moveTo(235, 56);
  ctx.bezierCurveTo(184, 94, 185, 172, 245, 210);
  ctx.bezierCurveTo(265, 220, 280, 209, 270, 195);
  ctx.bezierCurveTo(225, 166, 216, 112, 246, 65);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
SCENE_POLISH.set(0, {
  room: "kitchen",
  back() {
    rounded(105, 42, 270, 175, 14, "#a88258", "#d2aa76");
    for (let i = 0; i < 5; i++)
      curve(
        [
          [122, 67 + i * 29],
          [180, 61 + i * 29],
          [250, 75 + i * 29],
          [355, 64 + i * 29],
        ],
        "#99734c",
        1,
      );
    stageShadow(246, 213, 55, 6);
    const progress = finished ? 1 : taskProgress();
    bananaShape(shade(194, 60, 75, 150, "#ffe48a", "#cda02e"));
    curve(
      [
        [236, 64],
        [200, 115],
        [220, 169],
        [258, 202],
      ],
      "#ffed9b",
      5,
    );
    localProp(
      239,
      59,
      () => {
        rounded(-5, -17, 10, 23, 3, "#817340");
        line(-2, -15, 1, 3, "#b3a15c", 2);
      },
      0.25,
    );
    if (progress > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(180, 211 - progress * 150, 110, 160);
      ctx.clip();
      bananaShape("#fff0bd");
      curve(
        [
          [237, 76],
          [212, 121],
          [227, 169],
          [261, 203],
        ],
        "#ded1a2",
        2,
      );
      ctx.restore();
      const tip = workshop.gesture?.o || { x: 330, y: 71 };
      ctx.beginPath();
      ctx.moveTo(239, 66);
      ctx.bezierCurveTo(260, 109, tip.x - 25, tip.y + 47, tip.x, tip.y);
      ctx.lineTo(tip.x + 13, tip.y + 8);
      ctx.bezierCurveTo(tip.x + 2, tip.y + 65, 263, 129, 245, 65);
      ctx.closePath();
      ctx.fillStyle = shade(239, 66, 90, 110, "#e7b83d", "#fff0a4");
      ctx.fill();
      curve(
        [
          [242, 68],
          [271, 115],
          [tip.x - 6, tip.y + 40],
          [tip.x + 6, tip.y + 6],
        ],
        "#a77a29",
        1,
      );
    }
  },
  front() {
    if (!workshop.gesture && !finished) label("BLOSSOM END ↑", 266, 232);
  },
});
DETAIL_ART.bananaGrip = () => {
  if (!workshop.gesture && !finished) {
    rounded(-8, -3, 18, 8, 4, "#655139");
    line(-7, 4, 7, 4, "#a28a50", 2);
  }
};
DETAIL_ART.rollHolder = () => {
  rounded(-63, -47, 126, 103, 7, "#536976", "#79909c");
  rounded(-57, -42, 12, 81, 4, "#b4bfc1");
  rounded(45, -42, 12, 81, 4, "#8d9da4");
  rounded(-53, -5, 106, 9, 4, "#d1dbd9");
};
DETAIL_ART.paperRoll = (p) => {
  const under = p.mark === "under";
  const tail = () => {
    ctx.beginPath();
    ctx.moveTo(-37, under ? -18 : 2);
    ctx.lineTo(35, under ? -18 : 2);
    ctx.lineTo(35, 78);
    ctx.quadraticCurveTo(5, 70, -37, 80);
    ctx.closePath();
    ctx.fillStyle = under ? "#bbbeb5" : "#f3f0e3";
    ctx.fill();
    for (let y = 26; y < 77; y += 22) {
      ctx.setLineDash([3, 3]);
      line(-35, y, 33, y, "#a5aea9", 1);
      ctx.setLineDash([]);
    }
  };
  stageShadow(2, 88, 50, 5);
  if (under) tail();
  rounded(
    -43,
    -35,
    86,
    65,
    8,
    shade(-43, -35, 86, 65, "#fffdf1", "#c7ccc3"),
    "#899994",
  );
  ellipse(43, -2, 12, 32, "#d0d6cb");
  ellipse(44, -2, 7, 17, "#758278");
  ellipse(44, -2, 4, 11, "#334737");
  line(-36, -26, 32, -26, "#fffef4", 2);
  if (!under) tail();
};
SCENE_POLISH.set(1, {
  room: "bath",
  front() {
    if (finished) label("PAPER HANGS BEHIND THE ROLL", 240, 249);
  },
});
function chocolateGrid() {
  rounded(-89, -60, 178, 120, 4, "#452719", "#22140f");
  for (let y = 0; y < 3; y++)
    for (let x = 0; x < 4; x++) {
      rounded(
        -83 + x * 43,
        -54 + y * 38,
        38,
        33,
        3,
        shade(0, -60, 0, 120, "#ac7150", "#633c27"),
        "#372114",
      );
      line(
        -78 + x * 43,
        -49 + y * 38,
        -53 + x * 43,
        -49 + y * 38,
        "#c58c64",
        2,
      );
    }
}
DETAIL_ART.chocolateSlab = () => {
  ctx.save();
  if (workshop.step > 0 || workshop.gesture) {
    ctx.beginPath();
    ctx.moveTo(-100, -70);
    ctx.lineTo(100, -70);
    ctx.lineTo(100, 24);
    ctx.lineTo(58, 17);
    ctx.lineTo(38, 34);
    ctx.lineTo(30, 70);
    ctx.lineTo(-100, 70);
    ctx.closePath();
    ctx.clip();
  }
  chocolateGrid();
  ctx.restore();
};
DETAIL_ART.chocolateEdge = () => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-17, -15);
  ctx.lineTo(14, -7);
  ctx.lineTo(33, -2);
  ctx.lineTo(33, 36);
  ctx.lineTo(-24, 36);
  ctx.lineTo(-18, 13);
  ctx.closePath();
  ctx.clip();
  ctx.translate(-54, -24);
  chocolateGrid();
  ctx.restore();
};
SCENE_POLISH.set(2, {
  room: "kitchen",
  back() {
    rounded(112, 63, 232, 148, 5, "#765e7c");
    label("DARK CHOCOLATE", 225, 53, "#d4b4d1");
  },
  front() {
    if (workshop.gesture || finished) {
      curve(
        [
          [264, 159],
          [281, 170],
          [273, 166],
          [284, 180],
        ],
        "#e2b78a",
        1.5,
      );
      for (let i = 0; i < 5; i++)
        ellipse(288 + i * 7, 211 + (i % 2) * 3, 2, 1.3, "#78482d");
    }
    if (!finished) label("SNAP ACROSS A SQUARE", 240, 233);
  },
});
// Batch 02 — unequal pizza, animated cereal, direct bottom-bun placement.
SCENE_POLISH.set(3, {
  room: "kitchen",
  back() {
    rounded(128, 50, 245, 177, 28, "#ae8454", "#dab786");
  },
  front() {
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4;
      localProp(
        250 + Math.cos(a) * (35 + i * 4),
        145 + Math.sin(a) * (20 + i * 3),
        () => {
          ellipse(0, 0, 4, 2, "#5d8b51");
          line(-3, 0, 3, 0, "#b0cc81", 1);
        },
        a,
      );
    }
    if (drag?.o?.type === "cutter") {
      line(drag.start.x, drag.start.y, drag.o.x, drag.o.y, "#f6dda2", 2);
    }
    for (const cut of state.cuts) {
      line(...cut, "#583a23", 3);
      line(cut[0] + 1, cut[1] + 1, cut[2] + 1, cut[3] + 1, "#fbe2a3", 1);
    }
  },
});
SCENE_POLISH.set(4, {
  room: "kitchen",
  front() {
    const c = objects.find((o) => o.type === "cereal");
    if (state.cerealPour) {
      const t = c.tilt || 0,
        sp = { x: c.x + Math.sin(t) * 40, y: c.y - Math.cos(t) * 40 };
      for (let i = 0; i < 17; i++) {
        const f = (elapsed * 1.7 + i / 17) % 1;
        localProp(
          sp.x + (240 - sp.x) * f + Math.sin(i * 9) * f * 18,
          sp.y + (171 - sp.y) * f * f,
          () => {
            ellipse(0, 0, 3.5, 1.7, i % 2 ? "#e7b955" : "#c98a33");
            line(-2, 0, 2, 0, "#ffe29a", 1);
          },
          f * 7 + i,
        );
      }
    }
    if (state.cerealFill)
      for (let i = 0; i < Math.floor(state.cerealFill * 35); i++)
        localProp(
          188 + ((i * 23) % 104),
          162 + ((i * 7) % 18),
          () => ellipse(0, 0, 3, 1.5, "#dbac4e"),
          i,
        );
  },
});
function cerealBox(o) {
  localProp(
    o.x,
    o.y,
    () => {
      rounded(
        -29,
        -42,
        58,
        84,
        2,
        shade(-29, -42, 58, 84, "#f5c45c", "#c88732"),
        "#865320",
      );
      poly(
        [
          [-29, -42],
          [-20, -50],
          [29, -50],
          [29, -42],
        ],
        "#ffe3a3",
      );
      rounded(-24, -27, 48, 47, 4, "#fff0c5");
      text("CORN", 0, -12, 11, "#6c432a");
      text("FLAKES", 0, 0, 10, "#6c432a");
      ellipse(0, 12, 15, 6, "#90b4bf");
      for (let i = 0; i < 6; i++)
        ellipse(-10 + i * 4, 10 + (i % 2) * 3, 2, 1, "#d49635");
    },
    o.tilt || 0,
  );
}
REVISED_TASKS[5] = task(
  "burger",
  "Bottom goes on top",
  "Lift the bottom bun directly onto the top of the burger.",
  [F("deluxeBurger", 245, 147)],
  [prop("bun", "bottomBun", 245, 204, { w: 132, h: 34 })],
  [
    step(
      "bun",
      245,
      98,
      "drag",
      "Lift the bottom bun onto the top in one move",
    ),
  ],
  "All top. No bottom. Plenty of sauce.",
);
function bunArt(bottom = false) {
  ellipse(
    0,
    0,
    64,
    bottom ? 14 : 29,
    shade(-50, -25, 100, 50, "#eabe72", "#ae662c"),
  );
  rounded(-63, 0, 126, bottom ? 10 : 13, 5, "#c88a43");
  curve(
    [
      [-56, 1],
      [-25, 9],
      [28, 9],
      [57, 1],
    ],
    "#f0bd70",
    2,
  );
  if (!bottom)
    for (let i = 0; i < 14; i++)
      localProp(
        -47 + ((i * 19) % 95),
        -6 - ((i * 7) % 17),
        () => ellipse(0, 0, 2.5, 1, "#ffebbb"),
        i,
      );
}
DETAIL_ART.bottomBun = () => bunArt(true);
DETAIL_ART.deluxeBurger = () => {
  stageShadow(0, 70, 77, 6);
  rounded(-64, 36, 128, 22, 7, "#583725", "#b5764b");
  for (let i = 0; i < 18; i++)
    ellipse(-56 + ((i * 19) % 112), 41 + ((i * 7) % 11), 2, 1, "#aa7048");
  poly(
    [
      [-63, 32],
      [62, 32],
      [46, 51],
      [29, 37],
      [-10, 49],
      [-55, 38],
    ],
    "#f5bb43",
  );
  for (let i = 0; i < 9; i++)
    ellipse(-53 + i * 13, 27 + (i % 2) * 3, 12, 6, "#719c4b");
  curve(
    [
      [-60, 17],
      [-25, 9],
      [12, 33],
      [57, 17],
    ],
    "#c64c37",
    5,
  );
  for (let i = 0; i < 4; i++) {
    ellipse(-42 + i * 28, 13, 14, 5, "#b8c568");
    ellipse(-42 + i * 28, 13, 8, 3, "#7a9c4c");
  }
  localProp(0, -10, () => bunArt());
};
SCENE_POLISH.set(5, {
  room: "kitchen",
  back() {
    ellipse(245, 216, 91, 13, "#cadbda");
    ellipse(245, 215, 78, 8, "#7e9fa4");
  },
});
// Batch 03 — bitten doughnuts, near-empty carton, crooked gallery.
const DETAIL_OBJECT = {};
DETAIL_OBJECT.donut = (o) =>
  localProp(o.x, o.y, () => {
    ctx.save();
    if (o.bitten) {
      ctx.beginPath();
      ctx.moveTo(-40, -40);
      ctx.lineTo(14, -40);
      ctx.lineTo(14, -23);
      ctx.quadraticCurveTo(13, -11, 25, -11);
      ctx.quadraticCurveTo(25, 1, 40, 1);
      ctx.lineTo(40, 40);
      ctx.lineTo(-40, 40);
      ctx.closePath();
      ctx.clip();
    }
    ellipse(1, 5, 33, 28, shade(-30, -25, 60, 50, "#d99c58", "#8e4c27"));
    ellipse(0, -1, 31, 25, o.flavor % 2 ? "#cf7898" : "#ead6a0");
    for (let i = 0; i < 16; i++)
      localProp(
        -23 + ((i * 17) % 47),
        -18 + ((i * 13) % 35),
        () =>
          rounded(
            -2,
            -0.7,
            4,
            1.5,
            1,
            ["#fff0b7", "#77b9ba", "#9d575f"][i % 3],
          ),
        i,
      );
    ellipse(0, 0, 10, 8, "#96613b");
    ellipse(0, 1, 7, 6, "#243543");
    ctx.restore();
    if (o.bitten) {
      for (let i = 0; i < 4; i++)
        ellipse(32 + i * 5, 28 + (i % 2) * 4, 1.5, 1, "#d5a160");
    }
  });
SCENE_POLISH.set(6, {
  room: "kitchen",
  back() {
    rounded(45, 60, 212, 172, 15, "#8b6a50", "#c59c73");
    rounded(55, 70, 192, 151, 10, "#c4b8a1");
    label("THE SHARING BOX", 151, 48);
  },
  front() {
    for (const o of objects)
      if (o.bitten) label("ONE BITE", o.x, o.y + 43, "#dfa8b4");
  },
});
SCENE_POLISH.set(7, {
  room: "kitchen",
  front() {
    const m = objects.find((o) => o.type === "milk");
    if (!m) return;
    const remaining = Math.max(0.035, 1 - (state.fill || 0));
    localProp(m.x, m.y, () => {
      ctx.rotate(m.tilt || 0);
      rounded(-18, 17, 36, 15, 2, "#14293a", "#92b8c3");
      box(-15, 29 - remaining * 9, 30, remaining * 9, "#f8f7e9");
    });
  },
});
SCENE_POLISH.set(8, {
  room: "studio",
  back() {
    rounded(35, 30, 410, 188, 5, "#495161");
    line(30, 216, 450, 216, "#aca08a", 4);
    for (const x of [115, 240, 365]) {
      ellipse(x, 69, 2, 2, "#ccb083");
      line(x, 69, x - 18, 91, "#968774", 1);
      line(x, 69, x + 18, 91, "#968774", 1);
    }
  },
  front() {
    for (const [x, t] of [
      [115, "I"],
      [240, "II"],
      [365, "III"],
    ]) {
      rounded(x - 12, 188, 24, 12, 2, "#b9aa8e");
      label(t, x, 197, "#433c37");
    }
    if (finished) {
      ctx.setLineDash([3, 4]);
      line(192, 174, 286, 174, "#e4b1a3", 1);
      ctx.setLineDash([]);
    }
  },
});
// Batch 04 — patterned tile, stalled progress, repeated countdown.
SCENE_POLISH.set(9, {
  room: "bath",
  front() {
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 5; c++)
        localProp(120 + c * 60, 88 + r * 60, () => {
          if (r === 1 && c === 2) ctx.rotate(state.angle);
          line(-26, -26, 26, -26, "#fff6dd", 1);
          line(-26, -26, -26, 26, "#fff6dd", 1);
          line(-26, 26, 26, 26, "#8a9c9b", 2);
          ellipse(-12, 12, 4, 4, "#698e9e");
          ellipse(12, -12, 4, 4, "#dcbf7d");
        });
  },
});
SCENE_POLISH.set(10, {
  room: "desk",
  back() {
    rounded(61, 48, 358, 176, 12, "#111d2a", "#627f91");
    rounded(73, 60, 334, 32, 5, "#284156");
    label("INSTALLING: INNER PEACE", 240, 80);
  },
  front() {
    for (let i = 0; i <= 10; i++)
      line(100 + i * 28, 157, 100 + i * 28, i % 5 ? 161 : 165, "#9cafb5", 1);
    if (state.value === 99) {
      const a = 0.4 + 0.3 * Math.sin(elapsed * 3);
      ctx.globalAlpha = a;
      rounded(380, 130, 2, 28, 1, "#e3b987");
      ctx.globalAlpha = 1;
      label("ONE PERCENT REMAINS. FOREVER.", 240, 182, "#ddb584");
    }
  },
});
SCENE_POLISH.set(11, {
  room: "desk",
  back() {
    rounded(70, 52, 341, 187, 8, "#b7ada0", "#e2d3bb");
    label("THE OFFICIAL COUNTDOWN", 240, 72, "#3b444e");
  },
  front() {
    for (let i = 0; i < 4; i++) {
      rounded(97 + i * 75, 142, 56, 5, 2, "#807867");
      if (state.slots.includes(i)) ellipse(125 + i * 75, 158, 3, 3, "#6b947e");
    }
    if (finished) label("3 … 2 … 2 … 1", 240, 184, "#5f5547");
  },
});
// Batch 05 — picture puzzle, radio volume, side-view drawer gap.
DETAIL_OBJECT.piece = (o) =>
  localProp(o.x, o.y, () => {
    rounded(-27, -27, 54, 54, 2, "#aecbad", "#5f796e");
    ellipse(0, -27, 10, 8, "#aecbad");
    ellipse(27, 0, 8, 10, "#aecbad");
    poly(
      [
        [-25, 22],
        [5, -8],
        [25, 22],
      ],
      "#59876c",
    );
    line(-23, 20, 24, 20, "#dfe1bb", 4);
  });
SCENE_POLISH.set(12, {
  room: "desk",
  back() {
    rounded(80, 50, 195, 190, 8, "#bc9970", "#e1bd91");
  },
  front() {
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++) {
        if (r === 2 && c === 0) continue;
        localProp(121 + c * 55, 91 + r * 55, () => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(-25, -25, 50, 50);
          ctx.clip();
          ellipse(41 - c * 55, 10 - r * 55, 17, 17, "#efcf79");
          poly(
            [
              [-100, 130 - r * 55],
              [60 - c * 55, 5 - r * 55],
              [160, 130 - r * 55],
            ],
            "#527d69",
          );
          line(-24, -24, 24, -24, "#d2dfcd", 1);
          ctx.restore();
        });
      }
    if (finished) {
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = "#e9b380";
      ctx.strokeRect(95, 175, 54, 54);
      ctx.setLineDash([]);
    }
  },
});
SCENE_POLISH.set(13, {
  room: "desk",
  back() {
    rounded(61, 48, 358, 180, 16, "#725b46", "#b9986f");
    rounded(75, 60, 330, 155, 11, "#192733");
    for (let x = 80; x < 405; x += 6)
      for (let y = 175; y < 191; y += 5) ellipse(x, y, 0.7, 0.7, "#63727b");
    label("ANALOG FEEL. DIGITAL PROBLEMS.", 240, 78, "#d5c096");
  },
  front() {
    for (let i = 0; i <= 20; i++)
      line(
        100 + i * 14,
        158,
        100 + i * 14,
        i === 10 ? 168 : 162,
        i === 10 ? "#d0b873" : "#678490",
        1,
      );
    label("50", 240, 181, "#d0b873");
    if (finished) {
      curve(
        [
          [292, 96],
          [299, 101],
          [299, 108],
          [292, 113],
        ],
        "#a3c4bb",
        2,
      );
      curve(
        [
          [300, 89],
          [314, 101],
          [314, 111],
          [300, 120],
        ],
        "#6b928f",
        2,
      );
    }
  },
});
SCENE_POLISH.set(14, {
  room: "bedroom",
  front() {
    for (let k = 0; k < 5; k++)
      curve(
        [
          [113, 67 + k * 29],
          [155, 64 + k * 29],
          [177, 71 + k * 29],
          [210, 65 + k * 29],
        ],
        "#885d40",
        1,
      );
    const e = state.extension || 9;
    line(280 + e, 117, 280 + e, 190, "#fae0b1", 1);
    if (finished) {
      line(281, 95, 288, 95, "#efb97d", 2);
      line(281, 91, 281, 99, "#efb97d", 1);
      line(288, 91, 288, 99, "#efb97d", 1);
      label("1 cm", 312, 98, "#f0d3aa");
    }
  },
});
// Batch 06 — fitted linen, the endless meeting, misleading door handle.
SCENE_POLISH.set(15, {
  room: "bedroom",
  back() {
    rounded(81, 44, 281, 48, 9, "#705344", "#ad8360");
    for (let x = 100; x < 355; x += 28) rounded(x, 50, 15, 34, 3, "#865f47");
    rounded(370, 120, 70, 87, 5, "#715942");
    rounded(376, 124, 58, 30, 3, "#a17c57");
    ellipse(404, 139, 3, 3, "#dcc49b");
  },
  front() {
    const tabs = objects.filter((o) => o.type === "tab");
    for (let i = 0; i < tabs.length; i++) {
      const o = tabs[i],
        center = { x: 231, y: 158 };
      curve(
        [
          [o.x, o.y],
          [o.x + (center.x - o.x) * 0.25, o.y + 8],
          [center.x + (o.x - center.x) * 0.3, center.y],
          [center.x, center.y],
        ],
        "#cdb7ba55",
        1,
      );
    }
    if (state.popped) label("THERE GOES THE OTHER CORNER", 240, 250);
  },
});
SCENE_POLISH.set(16, {
  room: "desk",
  back() {
    rounded(35, 47, 260, 143, 9, "#e2dbca");
    label("TODAY’S MEETING", 165, 68, "#5e655e");
    line(65, 83, 261, 83, "#b3b9ac", 1);
    rounded(316, 83, 124, 151, 10, "#3b5361");
  },
  front() {
    for (let i = 0; i < state.steps; i++) {
      rounded(54 + i * 77, 172, 68, 33, 4, "#e1bc76");
      label("LAST " + (i + 1), 88 + i * 77, 192, "#725537");
    }
    if (finished) {
      line(360, 146, 385, 146, "#5c3d34", 2);
      label("STILL HERE.", 377, 247);
    }
  },
});
SCENE_POLISH.set(17, {
  room: "studio",
  back() {
    for (let y = 26; y < 222; y += 27)
      for (let x = 25 + (y % 2) * 30; x < 460; x += 70)
        rounded(x, y, 66, 24, 2, "#324958", "#435767");
    poly(
      [
        [145, 222],
        [339, 222],
        [410, 260],
        [70, 260],
      ],
      "#15212b",
    );
  },
  front() {
    for (let y of [100, 193]) {
      rounded(156, y, 7, 16, 2, "#bdc5b9");
      line(159, y + 2, 159, y + 14, "#778b88", 1);
    }
    if (!state.pulled) label("A HANDLE THAT INVITES A PULL", 240, 247);
    else if (finished) label("PUSH. OF COURSE.", 240, 247);
  },
});
// Batch 07 — gouged butter, disordered bookshelf, mismatched socks.
const tune = (id) => NEW_TASKS.find((t) => t.id === id);
SCENE_POLISH.set(18, {
  room: "kitchen",
  front() {
    const p = workshop.step ? 1 : taskProgress();
    if (p) {
      ellipse(260, 154, 25 * p, 10 * p, "#aa793b");
      ellipse(260, 156, 18 * p, 6 * p, "#79512c");
      for (let i = 0; i < 6; i++)
        curve(
          [
            [239 + i * 6, 149],
            [241 + i * 6, 151],
            [240 + i * 6, 154],
            [242 + i * 6, 156],
          ],
          "#f9dc81",
          1,
        );
      localProp(298, 176, () => {
        for (let i = 0; i < 4; i++)
          curve(
            [
              [-12 + i * 7, 0],
              [-7 + i * 7, -12],
              [-15 + i * 7, -9],
              [-9 + i * 7, 1],
            ],
            "#e8c36c",
            3,
          );
      });
    }
  },
});
DETAIL_ART.book = (p) => {
  const c = p.color || "#7fa8b6";
  rounded(
    -17,
    -39,
    34,
    78,
    3,
    shade(-17, -39, 34, 78, c, "#526575"),
    "#35434c",
  );
  box(-13, -34, 3, 68, "#ffffff22");
  for (const y of [-29, 28]) line(-10, y, 11, y, "#dac087", 2);
  text("TALES", 0, -12, 7, "#f8ead1");
  text("VOL. I", 0, 1, 6, "#e8dfc6");
  ellipse(0, 15, 4, 4, "#dbc083");
};
const bookTask = tune("books");
bookTask.steps[1].to = [310, 160];
bookTask.steps[1].fx = { scaleY: 1.18, angle: -0.06 };
SCENE_POLISH.set(19, {
  room: "bedroom",
  back() {
    rounded(135, 67, 226, 151, 4, "#624a3b", "#a8845d");
    box(145, 77, 205, 122, "#302e2c");
  },
  front() {
    for (let x = 147; x < 344; x += 13) line(x, 212, x + 8, 212, "#caac7e", 1);
    if (workshop.step > 1) {
      poly(
        [
          [326, 118],
          [337, 125],
          [337, 208],
          [326, 201],
        ],
        "#e2d5b8",
      );
      for (let y = 130; y < 200; y += 5)
        line(328, y, 336, y + 4, "#a79b85", 0.5);
    }
  },
});
DETAIL_ART.sock = (p) => {
  poly(
    [
      [-17, -35],
      [13, -35],
      [13, 12],
      [28, 18],
      [28, 33],
      [-12, 33],
      [-20, 20],
    ],
    p.color || "#cf8e91",
  );
  rounded(-17, -35, 30, 9, 2, "#eee4cb");
  line(-13, -25, -13, 16, "#ffffff44", 2);
  if (p.color === "#7aa5d1") {
    for (let y = -20; y < 20; y += 10) line(-16, y, 12, y, "#dbe6df", 3);
  } else
    for (let i = 0; i < 8; i++)
      ellipse(-9 + (i % 2) * 14, -18 + Math.floor(i / 2) * 11, 2, 2, "#f5d8b4");
  poly(
    [
      [10, 14],
      [23, 19],
      [23, 29],
      [11, 29],
    ],
    "#ffffff30",
  );
};
SCENE_POLISH.set(20, {
  room: "bedroom",
  back() {
    rounded(65, 57, 192, 170, 12, "#c7bda6");
    line(70, 64, 249, 64, "#eee2c8", 2);
  },
  front() {
    if (finished) {
      curve(
        [
          [325, 193],
          [334, 201],
          [357, 201],
          [367, 193],
        ],
        "#dfbe82",
        2,
      );
      label("A PERFECTLY WRONG PAIR", 330, 220);
    }
  },
});
// The butter sits in its dish; the cavity is on the top surface, not the side.
tune("butter").fixtures[0].y = 167;
tune("butter").fixtures[1].y = 209;
DETAIL_ART.butter = () => {
  rounded(-49, -34, 98, 71, 4, "#c69e4c");
  rounded(
    -49,
    -34,
    98,
    60,
    5,
    shade(-49, -34, 98, 60, "#f6de8e", "#e2b95f"),
    "#fbe5a2",
  );
  line(-43, 29, 42, 29, "#ad843e", 1);
};
// Batch 08 — USB roll-over, curling price-label halves, sweeping dust into a pan.
tune("usb").steps[1].fx = { scaleY: -1, angle: 0, reset: true };
DETAIL_ART.usb = (p) => {
  rounded(-38, -18, 48, 36, 6, shade(-38, -18, 48, 36, "#526372", "#18252d"));
  rounded(
    8,
    -14,
    36,
    28,
    2,
    shade(8, -14, 36, 28, "#e0e8e8", "#81929a"),
    "#b8c7c9",
  );
  rounded(17, -8, 8, 6, 1, "#273743");
  rounded(30, -8, 8, 6, 1, "#273743");
  line(13, 8, 40, 8, "#f2e9ca", 2);
  curve(
    [
      [-37, 0],
      [-55, 0],
      [-56, 10],
      [-76, 10],
    ],
    "#16212b",
    7,
  );
};
SCENE_POLISH.set(21, {
  room: "desk",
  back() {
    rounded(275, 80, 133, 124, 12, "#7b8790", "#afbcc3");
    rounded(286, 90, 110, 102, 6, "#536572");
    for (let x = 300; x < 388; x += 12) line(x, 174, x, 181, "#93a0a5", 2);
  },
  front() {
    if (workshop.step === 1 || workshop.step === 3) {
      label("STILL THE WRONG WAY", 330, 220, "#dba38e");
    }
  },
});
const st = tune("sticker");
st.pieces.forEach((p, i) => {
  p.art = "labelHalf";
  p.scale = 1;
  p.w = 44;
  p.h = 54;
  p.side = i;
});
DETAIL_ART.labelHalf = (p) => {
  rounded(-19, -25, 38, 50, 1, "#eee8cf");
  for (let i = 0; i < 9; i++)
    box(-14 + i * 3, -3, i % 3 ? 1 : 2, 17, "#37434b");
  text(p.side ? "99" : "€ 4.", 0, -11, 9, "#4c4e45");
  poly(
    [
      [9, -25],
      [19, -25],
      [19, -15],
    ],
    "#b8ae96",
  );
};
SCENE_POLISH.set(22, {
  room: "kitchen",
  front() {
    if (workshop.gesture) {
      const o = workshop.gesture.o;
      curve(
        [
          [o.x + 17, o.y - 21],
          [o.x + 27, o.y - 8],
          [o.x + 6, o.y + 8],
          [o.x + 18, o.y + 23],
        ],
        "#c9bea2",
        3,
      );
    }
    if (finished) {
      for (let y = 130; y < 163; y += 5) line(239, y, 247, y + 3, "#e6ddc4", 1);
      label("PAPER + STUBBORN GLUE", 245, 224, "#d7c8a4");
    }
  },
});
SCENE_POLISH.set(23, {
  room: "studio",
  back() {
    box(35, 65, 410, 151, "#72685b");
    for (let x = 40; x < 445; x += 68) line(x, 65, x, 216, "#4d4a44", 1);
    const w = workshop;
    if (w.gesture && w.step < 2) {
      const f = w.fixtures[w.step],
        start = w.step ? 275 : 210;
      f.x = start + (358 - start) * taskProgress();
      f.y = 165 + taskProgress() * 19;
    } else if (w.step < 2) {
      w.fixtures[w.step].x = w.step ? 275 : 210;
    }
  },
  front() {
    for (let i = 0; i < workshop.step * 6; i++)
      ellipse(352 + ((i * 7) % 31), 190 + ((i * 3) % 12), 1.5, 1, "#b9a47b");
    if (finished) {
      ctx.strokeStyle = "#d5b77e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(245, 153, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
});
st.fixtures[1].hidden = true; // The two peelable halves are the label itself.
// Batch 09 — a middle cake slice, the sealed carton spout, bare sandwich center.
DETAIL_ART.cake = () => {
  ellipse(0, 43, 86, 14, "#bed1d2");
  rounded(-75, -15, 150, 58, 8, "#bc8655");
  box(-74, 4, 148, 10, "#f0dfbb");
  box(-74, 24, 148, 6, "#a14f64");
  ellipse(0, -15, 75, 32, "#f6dfcd");
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ellipse(Math.cos(a) * 64, -15 + Math.sin(a) * 25, 5, 4, "#fdf0df");
  }
  for (const x of [-46, 45]) {
    ellipse(x, -15, 8, 7, "#c75c64");
    poly(
      [
        [x - 6, -20],
        [x, -26],
        [x + 6, -20],
      ],
      "#729766",
    );
  }
};
DETAIL_ART.cakepiece = () => {
  rounded(-20, -15, 40, 43, 3, "#c69364");
  box(-20, 1, 40, 6, "#fff0d1");
  box(-20, 17, 40, 5, "#a6536a");
  poly(
    [
      [-20, -15],
      [-11, -24],
      [28, -24],
      [20, -15],
    ],
    "#fff0dd",
  );
};
SCENE_POLISH.set(24, {
  room: "kitchen",
  front() {
    if (workshop.step) {
      rounded(228, 131, 44, 39, 1, "#664535", "#e8c89d");
      if (workshop.step === 1)
        localProp(250, 156, () => DETAIL_ART.cakepiece());
    } else if (workshop.gesture) {
      ctx.setLineDash([3, 2]);
      ctx.strokeStyle = "#815c4e";
      ctx.strokeRect(228, 131, 44, 39);
      ctx.setLineDash([]);
    }
  },
});
DETAIL_ART.carton = () => {
  rounded(-37, -39, 74, 98, 3, "#e8eee7", "#9ab6bf");
  poly(
    [
      [-37, -39],
      [-19, -65],
      [25, -65],
      [37, -39],
    ],
    "#8baebf",
  );
  poly(
    [
      [-37, -39],
      [-19, -65],
      [-1, -40],
    ],
    "#b9cfd5",
  );
  box(-37, -6, 74, 35, "#3e7793");
  text("MILK", 0, 15, 17, "#f6f0d8");
  line(-20, 45, 18, 45, "#aec0ba", 2);
  label("OPEN →", 18, -46, "#234555");
};
DETAIL_ART.flap = () => {
  poly(
    [
      [-20, 0],
      [-2, -16],
      [22, 0],
      [0, 19],
    ],
    "#d2e0df",
  );
  line(-17, 2, 17, 2, "#9bb6bd", 2);
  text("SEALED", 0, 7, 6, "#59777f");
};
SCENE_POLISH.set(25, {
  room: "kitchen",
  front() {
    if (workshop.step) {
      curve(
        [
          [204, 101],
          [215, 93],
          [227, 108],
          [239, 100],
        ],
        "#bdc9bd",
        2,
      );
      label("THE SEALED SIDE", 229, 234, "#d8bc90");
    }
  },
});
DETAIL_ART.cheese = () => {
  poly(
    [
      [-27, -37],
      [26, -34],
      [29, 36],
      [-27, 37],
    ],
    shade(-27, -37, 54, 74, "#f7d476", "#dda53e"),
  );
  for (const [x, y, r] of [
    [-9, -10, 5],
    [13, 19, 7],
    [14, -25, 3],
    [-18, 28, 3],
  ]) {
    ellipse(x, y, r, r, "#bc8638");
    ellipse(x + 1, y + 1, r - 1, r - 1, "#e6b75a");
  }
  line(-24, -33, 21, -30, "#ffe49a", 1);
};
SCENE_POLISH.set(26, {
  room: "kitchen",
  back() {
    ellipse(245, 213, 105, 14, "#afc9ce");
  },
  front() {
    if (finished) {
      line(227, 205, 263, 205, "#e3c990", 1);
      label("BARE BREAD", 245, 219, "#dfc99f");
    }
  },
});
// Batch 10 — snapping pasta, soaking biscuit, precarious ice cream.
DETAIL_ART.pot = () => {
  rounded(
    -70,
    -22,
    140,
    66,
    10,
    shade(-70, -22, 140, 66, "#9ab0b8", "#425e6b"),
    "#c2d2d7",
  );
  rounded(-90, -13, 23, 13, 5, null, "#acc1c6");
  rounded(67, -13, 23, 13, 5, null, "#acc1c6");
  ellipse(0, -22, 70, 19, "#b6cacf");
  ellipse(0, -23, 61, 13, "#4d8292");
  for (let i = 0; i < 4; i++)
    ellipse(
      -42 + i * 27,
      -22 + Math.sin(workshop.time * 3 + i) * 3,
      4,
      2,
      "#8bb4bd",
    );
};
DETAIL_ART.brokenpasta = () => {
  for (let i = 0; i < 9; i++) {
    line(-17 + i * 4, -44, -12 + i * 4, -5, "#e6c66c", 2);
    line(-12 + i * 4, 5, -6 + i * 4, 45, "#e6c66c", 2);
    line(-16 + i * 4, -42, -11 + i * 4, -8, "#f7dfa2", 0.7);
  }
};
SCENE_POLISH.set(27, {
  room: "kitchen",
  front() {
    for (let i = 0; i < 3; i++) {
      const y = 93 + ((i * 11 + workshop.time * 12) % 38);
      curve(
        [
          [317 + i * 20, y],
          [307 + i * 20, y - 10],
          [328 + i * 20, y - 16],
          [318 + i * 20, y - 24],
        ],
        "#b3cbd34d",
        2,
      );
    }
    if (workshop.step > 1) {
      localProp(340, 177, () => {
        rounded(
          -68,
          -5,
          136,
          49,
          8,
          shade(-68, -5, 136, 49, "#9bb2b9", "#4e6b77"),
        );
        line(-63, -4, 63, -4, "#c2d4d6", 2);
      });
    }
  },
});
DETAIL_ART.cup = (p) => {
  ellipse(41, 0, 16, 21, "#d9e4dd");
  ellipse(42, 0, 10, 14, "#2b3b48");
  rounded(-35, -26, 70, 55, 8, shade(-35, -26, 70, 55, "#f5f3e3", "#b2c8c8"));
  ellipse(0, 28, 34, 9, "#b5cccb");
  ellipse(0, -26, 35, 10, "#e6ede4");
  ellipse(0, -26, 30, 7, p.fill === 0 ? "#718b8d" : "#785137");
  curve(
    [
      [-27, -14],
      [-29, 0],
      [-26, 12],
      [-23, 18],
    ],
    "#ffffff99",
    3,
  );
};
DETAIL_ART.cookie = () => {
  ellipse(0, 0, 26, 30, "#a8733e");
  ellipse(0, -2, 24, 28, shade(-24, -28, 48, 56, "#e3bc77", "#b2854c"));
  for (let i = 0; i < 10; i++)
    ellipse(-16 + ((i * 11) % 33), -20 + ((i * 17) % 41), 1.6, 1.6, "#8d653d");
  rounded(-17, -22, 34, 40, 5, null, "#ba914e");
  const g = workshop.gesture;
  if (g?.held) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(-28, 7 - g.held * 9, 56, 30);
    ctx.clip();
    ellipse(0, 0, 25, 30, "#93643e88");
    ctx.restore();
  }
};
SCENE_POLISH.set(28, {
  room: "kitchen",
  back() {
    ellipse(280, 214, 62, 12, "#88aaa9");
  },
  front() {
    if (workshop.step) {
      localProp(280, 175, () =>
        rounded(
          -34,
          -17,
          68,
          46,
          7,
          shade(-34, -17, 68, 46, "#e8eee0", "#aec5c4"),
        ),
      );
      label("IT WAS FINE A SECOND AGO", 280, 232, "#dec6a0");
    }
  },
});
DETAIL_ART.cone = () => {
  poly(
    [
      [-32, -55],
      [32, -55],
      [0, 45],
    ],
    shade(-32, -55, 64, 100, "#e3bb79", "#a26f36"),
  );
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-31, -53);
  ctx.lineTo(31, -53);
  ctx.lineTo(0, 44);
  ctx.closePath();
  ctx.clip();
  for (let y = -70; y < 70; y += 13) {
    line(-40, y, 40, y + 50, "#976333", 1);
    line(-40, y + 50, 40, y, "#f0cd91", 1);
  }
  ctx.restore();
  ellipse(0, -55, 33, 7, "#d2a96c");
  ellipse(0, -56, 28, 4, "#9c6e37");
};
DETAIL_ART.scoop = () => {
  for (let i = 0; i < 8; i++)
    ellipse(-26 + i * 8, 11 + Math.sin(i) * 4, 10, 9, "#c77593");
  ellipse(0, -6, 36, 28, shade(-36, -34, 72, 56, "#f1bdd0", "#bc6e91"));
  for (let i = 0; i < 8; i++)
    curve(
      [
        [-23 + i * 6, -4],
        [-28 + i * 6, -15],
        [-17 + i * 6, -28],
        [-11 + i * 6, -18],
      ],
      "#f8d4de55",
      2,
    );
};
SCENE_POLISH.set(29, {
  room: "kitchen",
  front() {
    if (finished) {
      curve(
        [
          [316, 147],
          [321, 158],
          [315, 170],
          [318, 177],
        ],
        "#d68da8",
        3,
      );
      ellipse(317, 185 + Math.sin(workshop.time * 3) * 3, 2, 3, "#d68da8");
    }
  },
});
// Batch 11 — foil strips, watery ketchup stream, straw disappearing behind the carton.
DETAIL_ART.foil = (p) => {
  const curl = workshop.gesture?.o === p ? taskProgress() * 10 : 0;
  poly(
    [
      [-11, -19],
      [10, -19],
      [13 + curl, 8],
      [7, 20],
      [-11, 18],
    ],
    shade(-11, -19, 24, 39, "#f3e8ec", "#91a5b2"),
  );
  for (let y = -13; y < 16; y += 7) line(-7, y, 8, y + 2, "#fff5f499", 1);
};
SCENE_POLISH.set(30, {
  room: "kitchen",
  front() {
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI) / 6;
      line(
        245 + Math.cos(a) * 43,
        133 + Math.sin(a) * 10,
        245 + Math.cos(a) * 39,
        137 + Math.sin(a) * 10,
        "#c2c4c1",
        2,
      );
    }
    if (finished) label("STILL ATTACHED AT THE RIM", 245, 231);
  },
});
const ks = tune("ketchup").steps[0];
ks.fx.pourAngle = 2.8;
ks.fx.streamColor = "#bc835d";
ks.fx.streamEnd = [270, 153];
ks.fx.spout = [0, -44];
DETAIL_ART.ketchup = () => {
  rounded(-23, -27, 46, 72, 10, shade(-23, -27, 46, 72, "#d17059", "#943b37"));
  rounded(-12, -45, 24, 20, 3, "#e9dcc2");
  rounded(-17, -7, 34, 32, 4, "#efe6cf");
  text("TOMATO", 0, 5, 7, "#9a483d");
  ellipse(0, 14, 7, 6, "#c9614d");
  line(-16, -18, -16, 28, "#f4b89a55", 2);
};
SCENE_POLISH.set(31, {
  room: "kitchen",
  front() {
    if (workshop.gesture?.held) {
      const f = Math.min(1, workshop.gesture.held / 0.7);
      ellipse(270, 157, 26 * f, 5 * f, "#b5775099");
    }
    if (finished) label("THE WATERY BIT FIRST", 270, 236, "#d7b68e");
  },
});
DETAIL_ART.juice = () => {
  rounded(-30, -43, 60, 91, 2, "#e4b765");
  poly(
    [
      [-30, -43],
      [-16, -60],
      [16, -60],
      [30, -43],
    ],
    "#f7d491",
  );
  box(-30, -17, 60, 32, "#ba7842");
  text("ORANGE", 0, -3, 9, "#fff0cd");
  text("JUICE", 0, 9, 10, "#fff0cd");
  ellipse(0, 32, 12, 10, "#f4d180");
  ellipse(0, 32, 9, 7, "#e29f49");
  ellipse(8, -47, 4, 3, "#6a654f");
};
SCENE_POLISH.set(32, {
  room: "kitchen",
  front() {
    // Cover the submerged portion, while the exposed straw shortens continuously.
    if (workshop.gesture || finished) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(227, 132, 66, 100);
      ctx.clip();
      localProp(260, 172, () => DETAIL_ART.juice());
      ctx.restore();
    }
    if (finished) label("STRAW: NOW INSIDE", 260, 235, "#e6ca91");
  },
});
// Batch 12 — ice tray reflections, hinged cabinet panels, a nozzle aimed at plaster.
DETAIL_ART.ice = (p) => {
  rounded(-13, -15, 26, 30, 5, "#9bc9d6aa", "#d1ebed");
  poly(
    [
      [-10, -12],
      [9, -12],
      [5, -7],
      [-10, -7],
    ],
    "#f0fbefaa",
  );
  curve(
    [
      [-7, -4],
      [-1, -1],
      [-5, 5],
      [4, 9],
    ],
    "#ecfaf088",
    1,
  );
};
SCENE_POLISH.set(33, {
  room: "kitchen",
  front() {
    rounded(224, 137, 32, 42, 5, null, "#ecc77d");
    label("THIS ONE", 240, 130, "#e6cf9e");
    if (finished) {
      curve(
        [
          [227, 186],
          [235, 190],
          [245, 189],
          [252, 186],
        ],
        "#b8dae0",
        1,
      );
    }
  },
});
DETAIL_ART.door = (p) => {
  rounded(
    -36,
    -69,
    72,
    138,
    3,
    shade(-36, -69, 72, 138, "#b68d65", "#775139"),
    "#d1ad7d",
  );
  rounded(-28, -58, 56, 116, 2, null, "#644934");
  rounded(20, -6, 5, 23, 2, "#d3c5a3");
  line(-30, -62, 29, -62, "#e1ba85", 1);
};
tune("cupboard").steps[0].fx = { scale: 1 };
tune("cupboard").steps[1].fx = { scaleX: 0.82, angle: 0 };
SCENE_POLISH.set(34, {
  room: "bedroom",
  back() {
    for (let i = 0; i < 3; i++) {
      rounded(184 + i * 36, 112, 24, 29, 3, "#a9b8ad");
      ellipse(196 + i * 36, 112, 12, 4, "#d1dccb");
    }
  },
  front() {
    if (finished) {
      poly(
        [
          [239, 78],
          [247, 84],
          [247, 214],
          [239, 217],
        ],
        "#1c2427",
      );
      line(241, 83, 241, 210, "#dab282", 1);
      label("ONE DOOR CANNOT CLOSE", 245, 235);
    }
  },
});
DETAIL_ART.bottle = () => {
  rounded(
    -31,
    -47,
    62,
    94,
    13,
    shade(-31, -47, 62, 94, "#b4d4d0", "#6b9b9d"),
    "#cbdfd6",
  );
  rounded(-24, -10, 48, 42, 4, "#edf0d9");
  text("HAND", 0, 5, 10, "#567b78");
  text("LOTION", 0, 19, 8, "#567b78");
};
SCENE_POLISH.set(35, {
  room: "bath",
  front() {
    if (workshop.gesture) {
      const o = workshop.gesture.o;
      const p = Math.min(1, workshop.gesture.length / 65);
      o.angle = Math.PI * (1 - p);
    }
    if (finished) {
      ctx.setLineDash([2, 4]);
      line(273, 122, 321, 122, "#d5ddd4", 1);
      ctx.setLineDash([]);
      ellipse(324, 122, 3, 5, "#c6d4c080");
      label("THE WALL IS READY", 325, 218);
    }
  },
});
// Batch 13 — toothpaste compression, tearing beside perforations, spilling beside a plant.
function mintTube(pinched) {
  const n = pinched ? 10 : 20;
  poly(
    [
      [-50, -20],
      [-8, -n],
      [25, -13],
      [40, -7],
      [40, 7],
      [25, 13],
      [-8, n],
      [-50, 20],
    ],
    shade(-50, -20, 90, 40, "#f6f4db", "#bccac3"),
  );
  poly(
    [
      [-32, -14],
      [-8, -n + 2],
      [4, -9],
      [4, 9],
      [-8, n - 2],
      [-32, 14],
    ],
    "#5a99ad",
  );
  for (let y = -15; y < 17; y += 4) line(-47, y, -41, y, "#8aa9aa", 1);
  text("MINT", -16, 3, 7, "#fff7d9");
  if (pinched) {
    line(-13, -8, -8, -3, "#9db2af", 1);
    line(-13, 8, -8, 3, "#9db2af", 1);
  }
}
DETAIL_ART.tube = () => mintTube(!!workshop.gesture?.held);
DETAIL_ART.pinchedtube = () => mintTube(true);
SCENE_POLISH.set(36, {
  room: "bath",
  front() {
    if (workshop.step) {
      curve(
        [
          [248, 150],
          [256, 141],
          [269, 149],
          [282, 148],
        ],
        "#dcecdc",
        4,
      );
      curve(
        [
          [250, 150],
          [260, 144],
          [270, 149],
          [280, 148],
        ],
        "#72aabd",
        1,
      );
    }
    if (finished) label("NOT QUITE SCREWED ON", 260, 222);
  },
});
const towel = tune("towel");
towel.fixtures[0].x = 245;
towel.fixtures[0].art = "towelRoll";
towel.pieces[0].art = "towelSheet";
towel.steps[0].to = [350, 185];
DETAIL_ART.towelRoll = () => {
  rounded(-42, -21, 84, 42, 5, shade(-42, -21, 84, 42, "#fff9e8", "#c6d2cc"));
  ellipse(42, 0, 11, 21, "#ced7ce");
  ellipse(43, 0, 4, 11, "#8c7960");
  rounded(-36, 3, 72, 57, 0, "#e8ebdb");
  for (let y = 13; y < 57; y += 10)
    for (let x = -28; x < 32; x += 12) ellipse(x, y, 1, 1, "#bec9bf");
};
DETAIL_ART.towelSheet = () => {
  poly(
    [
      [-36, -26],
      [-15, -28],
      [0, -25],
      [16, -28],
      [36, -24],
      [36, 29],
      [-36, 29],
    ],
    "#f2f1df",
  );
  for (let y = -17; y < 24; y += 10)
    for (let x = -28; x < 32; x += 12) ellipse(x, y, 1.3, 1.3, "#c2cfc3");
};
SCENE_POLISH.set(37, {
  room: "kitchen",
  front() {
    if (finished) {
      ctx.setLineDash([3, 3]);
      line(210, 162, 281, 162, "#839c99", 1);
      ctx.setLineDash([]);
      label("THE LINE WAS RIGHT THERE", 240, 235);
    }
  },
});
const water = tune("watering").steps[0];
water.fx.spout = [75, -24];
water.fx.streamEnd = [350, 221];
water.fx.streamColor = "#8fc6d5";
water.fx.pourAngle = 0.3;
SCENE_POLISH.set(38, {
  room: "studio",
  back() {
    rounded(165, 42, 170, 123, 5, "#758e8d", "#b1c5ba");
    box(175, 52, 150, 103, "#9ab3ac");
    line(250, 52, 250, 155, "#e3dec3", 4);
  },
  front() {
    for (let i = 0; i < 4; i++)
      line(255, 115 + i * 11, 240 + (i % 2) * 30, 111 + i * 11, "#c6d6a1", 1);
    if (finished) {
      ellipse(350, 224, 44, 5, "#a3d3d44d");
      line(314, 224, 332, 223, "#b7dfdf", 1);
    }
  },
});
// Batch 14 — inside-out sleeve seam, unequal lace loops, fabric caught in a zip.
tune("laundry").steps[1].fx.clear = [1];
DETAIL_ART.foldedshirt = () => {
  rounded(
    -45,
    -28,
    90,
    56,
    4,
    shade(-45, -28, 90, 56, "#a6c9d1", "#628da5"),
    "#b7d7d6",
  );
  poly(
    [
      [-43, -25],
      [-15, -12],
      [-32, 1],
      [-43, -7],
    ],
    "#bfd6d9",
  );
  curve(
    [
      [-41, -22],
      [-20, -13],
      [-36, -3],
      [-40, -1],
    ],
    "#719ba9",
    1,
  );
  line(2, -24, 2, 23, "#527c94", 1);
  line(-39, 23, 39, 23, "#c2dddb", 1);
};
SCENE_POLISH.set(39, {
  room: "bedroom",
  back() {
    rounded(100, 67, 278, 159, 14, "#bcb09c", "#ded2b9");
  },
  front() {
    if (workshop.step === 1) {
      ctx.setLineDash([2, 2]);
      curve(
        [
          [224, 107],
          [210, 129],
          [239, 137],
          [237, 154],
        ],
        "#c8e2df",
        1,
      );
      ctx.setLineDash([]);
    }
    if (finished) label("THE SLEEVE IS STILL INSIDE", 250, 227);
  },
});
DETAIL_ART.loop = () => {
  ctx.beginPath();
  ctx.moveTo(12, 8);
  ctx.bezierCurveTo(-38, 1, -42, -30, -14, -22);
  ctx.bezierCurveTo(6, -18, 17, -3, 12, 8);
  ctx.strokeStyle = "#f2e9ce";
  ctx.lineWidth = 3;
  ctx.stroke();
};
SCENE_POLISH.set(40, {
  room: "bedroom",
  front() {
    for (let i = 0; i < 4; i++) {
      ellipse(232, 155 + i * 9, 2, 2, "#ced7cb");
      ellipse(263, 155 + i * 9, 2, 2, "#ced7cb");
    }
    curve(
      [
        [194, 195],
        [211, 199],
        [275, 199],
        [300, 195],
      ],
      "#cecbb7",
      1,
    );
    if (finished) {
      ellipse(245, 151, 5, 3, "#ded4b9");
      curve(
        [
          [245, 151],
          [246, 167],
          [275, 174],
          [279, 191],
        ],
        "#f0e4c9",
        2,
      );
    }
  },
});
tune("zip").steps[0].fx.spawn = [
  F("fabric", 249, 106, { scale: 0.36, angle: 0.5 }),
];
SCENE_POLISH.set(41, {
  room: "bedroom",
  front() {
    const zip = workshop.props[0];
    for (let y = zip.y + 8; y < 215; y += 6) {
      box(242, y, 6, 2, "#e2c682");
    }
    curve(
      [
        [249, 104],
        [257, 106],
        [251, 114],
        [245, 116],
      ],
      "#c3d6dc",
      2,
    );
    for (let x of [216, 274]) {
      rounded(x - 10, 164, 19, 28, 3, null, "#c99eae");
    }
    if (finished) {
      line(246, 116, 251, 120, "#e0cb9f", 1);
      label("FABRIC IN THE TEETH", 245, 235);
    }
  },
});
// Keep the oversized lace loop rooted at the knot instead of floating above it.
DETAIL_ART.loop = (p) => {
  const s = p.scale || 1,
    a = [(245 - p.x) / s, (145 - p.y) / s];
  ctx.beginPath();
  ctx.moveTo(...a);
  ctx.bezierCurveTo(-20, -8, -54, -40, -30, -43);
  ctx.bezierCurveTo(2, -45, 16, -15, ...a);
  ctx.strokeStyle = "#f2e9ce";
  ctx.lineWidth = 2.5;
  ctx.stroke();
};
// Batch 15 — reversed slat face, refractive screen bubbles, battery polarity.
tune("blinds").steps[0].fx = {
  angle: 0,
  scaleY: -1,
  reset: true,
  color: "#c2d4e0",
};
DETAIL_ART.slat = (p) => {
  rounded(-82, -6, 164, 12, 2, p.color || "#829dad");
  line(-80, -5, 80, -5, "#d6e1dc", 2);
  line(-80, 5, 80, 5, "#4c6a7c", 2);
};
SCENE_POLISH.set(42, {
  room: "bedroom",
  front() {
    line(191, 70, 191, 218, "#d2c8af", 1);
    line(299, 70, 299, 218, "#d2c8af", 1);
    curve(
      [
        [340, 67],
        [344, 107],
        [336, 169],
        [342, 191],
      ],
      "#d9cfb9",
      2,
    );
    ellipse(342, 195, 3, 5, "#b7a78b");
    if (finished) {
      poly(
        [
          [166, 155],
          [323, 155],
          [389, 218],
          [102, 218],
        ],
        "#ecd19a12",
      );
    }
  },
});
DETAIL_ART.bubble = () => {
  ellipse(0, 0, 11, 9, "#c2e2e122");
  ctx.strokeStyle = "#bfdfe2aa";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 9, 0, 0, Math.PI * 2);
  ctx.stroke();
  curve(
    [
      [-8, -1],
      [-9, -7],
      [-1, -8],
      [3, -6],
    ],
    "#eff8e2",
    1.3,
  );
  ellipse(4, 4, 3, 1, "#97c9d1");
};
SCENE_POLISH.set(43, {
  room: "desk",
  front() {
    ctx.save();
    ctx.globalAlpha = 0.11;
    poly(
      [
        [212, 67],
        [234, 67],
        [276, 213],
        [254, 213],
      ],
      "#ecffff",
    );
    ctx.restore();
    if (finished) {
      const a = 0.45 + 0.25 * Math.sin(workshop.time * 2);
      ctx.globalAlpha = a;
      ctx.strokeStyle = "#ead6aa";
      ctx.beginPath();
      ctx.arc(245, 145, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },
});
DETAIL_ART.battery = () => {
  rounded(
    -16,
    -35,
    32,
    70,
    4,
    shade(-16, -35, 32, 70, "#66798b", "#172c3a"),
    "#a5b9bf",
  );
  rounded(-16, -35, 32, 18, 4, "#d9b273");
  rounded(-7, -39, 14, 5, 1, "#e8d2a1");
  text("+", 0, -20, 11, "#3d3932");
  text("AA", 0, 6, 12, "#e4e6d4");
  text("−", 0, 28, 12, "#d6d9c6");
  line(-12, -10, -12, 27, "#ffffff22", 2);
};
SCENE_POLISH.set(44, {
  room: "desk",
  front() {
    if (workshop.step < 3) {
      text("+", 244, 112, 10, "#e3c08b");
      text("−", 275, 112, 10, "#e3c08b");
    } else {
      ellipse(260, 103, 3, 3, "#263841");
      label("NO RESPONSE", 260, 222, "#b4b9b4");
    }
  },
});
// Batch 16 — routed headphone cord, actual mouse reach limit, sideways printer stock.
DETAIL_ART.headphones = () => {
  ctx.strokeStyle = "#70818d";
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.arc(0, 0, 33, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#becbd0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -1, 35, Math.PI, Math.PI * 2);
  ctx.stroke();
  rounded(-40, -8, 18, 39, 7, "#273c4c", "#7794a3");
  rounded(22, -8, 18, 39, 7, "#273c4c", "#7794a3");
  rounded(-35, -3, 7, 29, 3, "#657e8f");
  rounded(28, -3, 7, 29, 3, "#657e8f");
};
SCENE_POLISH.set(45, {
  room: "studio",
  front() {
    if (workshop.step === 0) {
      ctx.setLineDash([3, 5]);
      curve(
        [
          [140, 185],
          [170, 50],
          [291, 64],
          [320, 185],
        ],
        "#9fb4b855",
        1,
      );
      ctx.setLineDash([]);
      for (const [x, y] of tune("headphones").steps[0].fx.route)
        ellipse(x, y, 2, 2, "#c4b78a");
    }
    const h = workshop.props[1];
    curve(
      [
        [h.x - 30, h.y + 28],
        [h.x - 20, h.y + 65],
        [139, 166],
        [140, 185],
      ],
      "#bbbfad",
      2,
    );
  },
});
DETAIL_ART.mouse = () => {
  rounded(
    -25,
    -32,
    50,
    65,
    22,
    shade(-25, -32, 50, 65, "#b3c5ca", "#5c7a89"),
    "#cedbd4",
  );
  line(0, -29, 0, -2, "#4e6877", 1);
  line(-24, -1, 24, -1, "#66818d", 1);
  rounded(-3, -23, 6, 12, 2, "#263c4d");
};
SCENE_POLISH.set(46, {
  room: "desk",
  front() {
    const m = workshop.props[0],
      slack = Math.max(0, 335 - m.x) * 0.4;
    curve(
      [
        [130, 190],
        [170, 190 + slack],
        [m.x - 35, 190 + slack],
        [m.x, m.y - 31],
      ],
      "#c1c7b6",
      3,
    );
    const cx = 300 + Math.min(90, Math.max(0, m.x - 230) * 0.8);
    poly(
      [
        [cx, 110],
        [cx + 9, 116],
        [cx + 4, 118],
        [cx + 2, 124],
      ],
      "#e4e4c7",
    );
    line(402, 85, 402, 136, "#dcaa7c", 1);
  },
});
SCENE_POLISH.set(47, {
  room: "desk",
  front() {
    for (let i = 0; i < 5; i++)
      line(212, 188 + i * 3, 319, 188 + i * 3, "#4d6774", 1);
    ellipse(322, 164, 2, 2, finished ? "#dcad75" : "#a6c5ab");
    if (finished) {
      line(225, 109, 306, 109, "#e2e1d3", 1);
      label("ONE SHEET, WRONG DIRECTION", 270, 232);
    }
  },
});

tune("mousecord").steps[0].fx.spawn = [];
// Batch 17 — stapled wrong corner, actually shortened wrapping, a lost tape end.
DETAIL_ART.stapler = () => {
  rounded(-35, 12, 70, 10, 3, "#82959a");
  poly(
    [
      [-31, 12],
      [-28, -7],
      [28, -7],
      [34, 12],
    ],
    "#344653",
  );
  const press = Math.min(1, (workshop.gesture?.held || 0) / 0.7);
  localProp(
    -29,
    1,
    () =>
      rounded(0, -14, 64, 16, 5, shade(0, -14, 64, 16, "#c07565", "#854c44")),
    -0.18 + press * 0.18,
  );
};
SCENE_POLISH.set(48, {
  room: "desk",
  front() {
    if (workshop.step > 0) label("LEFT OUT", 360, 229, "#d7c5a7");
    if (finished) {
      rounded(274, 195, 12, 6, 1, null, "#cad7d8");
      line(275, 201, 275, 204, "#536a71", 1);
      line(285, 201, 285, 204, "#536a71", 1);
    }
  },
});
const wrap = tune("wrapping");
wrap.steps[0].fx = {
  reset: true,
  clear: [1],
  spawn: [F("shortWrap", 252, 159)],
};
DETAIL_ART.shortWrap = () => {
  rounded(-67, -43, 116, 91, 2, "#839ba2");
  for (let x = -59; x < 45; x += 16)
    for (let y = -32; y < 45; y += 19) {
      line(x - 3, y, x + 3, y, "#c9d9c9", 1);
      line(x, y - 3, x, y + 3, "#c9d9c9", 1);
    }
  line(49, -43, 49, 48, "#d8dec9", 2);
  line(58, -42, 58, 47, "#604e42", 2);
};
DETAIL_ART.scissors = () => {
  const a = workshop.gesture ? Math.sin(workshop.time * 18) * 0.15 : 0.2;
  for (const side of [-1, 1])
    localProp(
      0,
      0,
      () => {
        ellipse(side * 9, -24, 9, 14, "#c6816e");
        ellipse(side * 9, -24, 5, 9, "#293b47");
        poly(
          [
            [side * 4, -10],
            [side * 9, 49],
            [0, 33],
            [-2, -7],
          ],
          "#c7d5d7",
        );
      },
      side * a,
    );
  ellipse(0, -3, 3, 3, "#77909c");
};
SCENE_POLISH.set(49, {
  room: "desk",
  front() {
    if (finished) {
      line(304, 211, 311, 211, "#e7c086", 2);
      label("JUST SHORT", 344, 217, "#e0c49c");
    }
  },
});
DETAIL_ART.taperoll = () => {
  ellipse(0, 0, 47, 44, "#b6b79c");
  ellipse(0, -4, 43, 39, "#d9d4ad");
  ellipse(0, -4, 26, 24, "#8e7856");
  ellipse(0, -4, 20, 18, "#2b3a45");
  ctx.strokeStyle = "#f3ead066";
  ctx.lineWidth = 1;
  for (let r = 30; r < 42; r += 4) {
    ctx.beginPath();
    ctx.ellipse(0, -4, r, r * 0.9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
};
DETAIL_ART.tape = () => {
  rounded(-25, -8, 50, 16, 1, "#d8dabc88", "#e4e6ca");
  line(-23, -5, 23, -5, "#ffffff55", 1);
};
SCENE_POLISH.set(50, {
  room: "desk",
  front() {
    if (workshop.gesture) {
      const o = workshop.gesture.o;
      curve(
        [
          [278, 145],
          [296, 137],
          [o.x - 9, o.y],
          [o.x + 8, o.y],
        ],
        "#e4dfb8",
        2,
      );
    }
    if (finished) label("NO TAB. NO CLUE.", 245, 225, "#d8cba9");
  },
});
// Batch 18 — pen-cap gap, dirty crockery, fuel hose connected to the filler.
DETAIL_ART.pen = () => {
  rounded(-52, -5, 104, 10, 4, shade(-52, -5, 104, 10, "#a4c9d5", "#4d8094"));
  poly(
    [
      [-52, -5],
      [-67, 0],
      [-52, 5],
    ],
    "#ccd5cf",
  );
  ellipse(-66, 0, 1, 1, "#263c4e");
  line(-43, -3, 43, -3, "#d7e6df", 1);
};
DETAIL_ART.pencap = () => {
  rounded(-28, -9, 56, 18, 5, shade(-28, -9, 56, 18, "#b2d0d9", "#57829a"));
  rounded(-23, -13, 39, 4, 2, "#d5dfd8");
  line(25, -8, 25, 8, "#365d72", 1);
};
SCENE_POLISH.set(51, {
  room: "desk",
  front() {
    if (finished) {
      line(214, 170, 218, 170, "#e8bc7f", 2);
      label("ALMOST A CLICK", 220, 194, "#e0ca9c");
    }
  },
});
DETAIL_ART.dirtyplate = () => {
  ellipse(0, 0, 32, 29, shade(-32, -29, 64, 58, "#e8ece0", "#8cacae"));
  ellipse(0, 0, 25, 22, "#d3e2d7");
  ctx.strokeStyle = "#88aaa6";
  ctx.beginPath();
  ctx.ellipse(0, 0, 23, 20, 0, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 5; i++)
    ellipse(
      -14 + i * 7,
      Math.sin(i * 3) * 12,
      4,
      2,
      ["#9e704c", "#b68156"][i % 2],
    );
};
DETAIL_ART.dishwasherdoor = () => {
  rounded(
    -65,
    -63,
    130,
    126,
    5,
    shade(-65, -63, 130, 126, "#c0ced1", "#7e98a7"),
    "#c6d7d5",
  );
  rounded(-48, -49, 96, 9, 3, "#344d5c");
  rounded(32, -59, 15, 6, 2, "#263e4c");
  ellipse(39, -56, 1, 1, "#b9cca8");
  line(-55, -30, 55, -30, "#dce2d8", 1);
};
SCENE_POLISH.set(52, {
  room: "kitchen",
  back() {
    rounded(43, 61, 183, 165, 8, "#6e898e");
  },
  front() {
    if (finished) label("ONE DIRTY PLATE REMAINS", 124, 249, "#dcc6a1");
  },
});
const fuel = tune("fuel").steps[0];
fuel.to = [285, 177];
fuel.fx.pourAngle = 0;
SCENE_POLISH.set(53, {
  room: "studio",
  back() {
    rounded(43, 55, 82, 160, 8, "#af7565", "#deae8d");
    rounded(53, 70, 62, 43, 3, "#203641");
    label("FUEL", 84, 96, "#cde1ca");
  },
  front() {
    const n = workshop.props[0];
    curve(
      [
        [114, 117],
        [168, 214],
        [n.x - 60, 238],
        [n.x - 20, n.y + 25],
      ],
      "#12212c",
      6,
    );
    rounded(327, 143, 14, 12, 3, null, "#d0e0d9");
    for (const x of [239, 359]) {
      ellipse(x, 191, 8, 8, "#8096a1");
      ellipse(x, 191, 3, 3, "#c5d2d3");
    }
    if (finished) label("½ — THAT WILL DO", 245, 106, "#dfc78a");
  },
});
// Batch 19 — a cup filled to its rim, squeezed jam, and persistent citrus pith.
const coffee = tune("coffee");
coffee.fixtures[0].fill = 0;
coffee.steps[0].fx.spout = [51, -23];
coffee.steps[0].fx.streamEnd = [260, 146];
coffee.steps[0].fx.streamColor = "#855839";
coffee.steps[0].fx.pourAngle = 0.45;
DETAIL_ART.coffeepot = () => {
  rounded(-29, -27, 58, 65, 8, shade(-29, -27, 58, 65, "#d3dedc", "#688a96"));
  poly(
    [
      [28, -14],
      [53, -31],
      [53, -19],
      [29, 4],
    ],
    "#afc5c7",
  );
  rounded(-44, -19, 18, 41, 7, null, "#172e3b");
  rounded(-21, -36, 42, 10, 3, "#2f4855");
  ellipse(0, -39, 6, 4, "#8ca9b0");
  line(-20, -19, -20, 24, "#e7f0e4", 2);
};
SCENE_POLISH.set(54, {
  room: "kitchen",
  back() {
    ellipse(260, 215, 63, 12, "#8da8a7");
  },
  front() {
    const w = workshop,
      held = w.gesture?.held || 0;
    if (!w.step && held) ellipse(260, 146, 30, 7, "#76503b");
    if (w.step) {
      const p = w.props.find((p) => p.id === "cup");
      ellipse(p.x, p.y - 27, 31, 8, "#6b442d");
      curve(
        [
          [p.x - 26, p.y - 28],
          [p.x - 3, p.y - 33],
          [p.x + 11, p.y - 31],
          [p.x + 26, p.y - 27],
        ],
        "#c2a077",
        1,
      );
      if (w.gesture || finished) {
        curve(
          [
            [p.x - 29, p.y - 24],
            [p.x - 37, p.y - 6],
            [p.x - 26, p.y + 2],
            [p.x - 31, p.y + 20],
          ],
          "#976844",
          3,
        );
        for (let i = 0; i < 4; i++)
          ellipse(
            p.x - 33 - i * 5,
            p.y + 25 + ((w.time * 25 + i * 9) % 24),
            2,
            3,
            "#9b714a",
          );
      }
    }
  },
});
DETAIL_ART.donut = () => {
  const press = Math.min(1, (workshop.gesture?.held || 0) / 0.7);
  ctx.save();
  ctx.scale(1, 1 - press * 0.25);
  ellipse(0, 6, 39, 26, "#a36836");
  ellipse(0, -3, 38, 26, shade(-38, -29, 76, 52, "#f0c88a", "#b98247"));
  for (let i = 0; i < 32; i++)
    ellipse(-30 + ((i * 17) % 60), -20 + ((i * 13) % 39), 0.8, 0.7, "#fff0cc");
  ellipse(34, 7, 4, 3, "#944851");
  ctx.restore();
};
DETAIL_ART.jam = () => {
  ellipse(0, 0, 23, 9, "#a34361");
  ellipse(15, 6, 17, 7, "#be6179");
  curve(
    [
      [-14, -2],
      [-6, -7],
      [2, -4],
      [7, -4],
    ],
    "#e9a8a6",
    2,
  );
};
SCENE_POLISH.set(55, {
  room: "kitchen",
  front() {
    const p = Math.min(1, (workshop.gesture?.held || 0) / 0.7);
    if (p || finished) {
      curve(
        [
          [279, 158],
          [300, 158],
          [280, 183],
          [296, 190],
        ],
        "#a84b68",
        4 + 3 * p,
      );
      ellipse(293, 185, 4, 3, "#c57b88");
    }
  },
});
function citrusSegment(p) {
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 31, 0, 0, Math.PI * 2);
  ctx.fillStyle = shade(-22, -31, 44, 62, "#ffc36c", "#ce7c31");
  ctx.fill();
  for (let i = 0; i < 7; i++)
    curve(
      [
        [-15 + i * 5, -23],
        [-21 + i * 6, -6],
        [-13 + i * 4, 16],
        [-10 + i * 3, 25],
      ],
      "#f7d39966",
      1,
    );
  curve(
    [
      [-3, -25],
      [-8, -4],
      [5, 10],
      [2, 26],
    ],
    "#fff0c4",
    2,
  );
  if (!p.mark)
    for (const x of [-13, 12])
      curve(
        [
          [x, -19],
          [x - 6, -3],
          [x + 5, 14],
          [x, 22],
        ],
        "#f5e6bc",
        2,
      );
}
DETAIL_ART.segment = (p) => {
  const g = workshop.gesture;
  if (g?.o === p) {
    ctx.save();
    ctx.translate(g.origin.x - p.x, g.origin.y - p.y);
    citrusSegment({ mark: "thread" });
    ctx.restore();
    curve(
      [
        [-13, -19],
        [-20, -2],
        [-7, 15],
        [-13, 22],
      ],
      "#f5e6bc",
      2,
    );
    curve(
      [
        [11, -20],
        [5, -1],
        [17, 14],
        [12, 23],
      ],
      "#f5e6bc",
      2,
    );
  } else citrusSegment(p);
};
SCENE_POLISH.set(56, {
  room: "kitchen",
  back() {
    rounded(112, 91, 266, 118, 15, "#aa8055", "#d0ae7f");
  },
  front() {
    if (finished)
      label("ONE WHITE THREAD ON EVERY SEGMENT", 245, 236, "#ecd3a5");
  },
});
// Batch 20 — visibly unequal cucumber cuts, spreading jam, torn cheese packaging.
DETAIL_ART.cucumber = () => {
  ctx.save();
  const edge = [-92, -60, 0, 11, 70][workshop.step] || -92;
  ctx.beginPath();
  ctx.rect(edge, -28, 190, 56);
  ctx.clip();
  ellipse(0, 0, 91, 23, shade(-91, -23, 182, 46, "#83a05d", "#355c3c"));
  for (let i = 0; i < 35; i++)
    ellipse(-81 + ((i * 19) % 165), -16 + ((i * 11) % 32), 1, 1.3, "#a9bb71");
  curve(
    [
      [-79, -10],
      [-35, -24],
      [40, -20],
      [79, -9],
    ],
    "#b9c97c55",
    2,
  );
  ctx.restore();
  if (workshop.step) {
    ellipse(edge, 0, 6, 22, "#c5d6a2");
    ellipse(edge + 1, 0, 3, 13, "#e8e6be");
  }
};
DETAIL_ART.cucumberslice = () => {
  rounded(-14, -24, 28, 48, 3, shade(-14, -24, 28, 48, "#7f9e5c", "#3f6842"));
  ellipse(14, 0, 10, 24, "#c4d9a5");
  ellipse(14, 0, 6, 19, "#dce7bc");
  for (let i = 0; i < 6; i++)
    ellipse(12 + (i % 2) * 4, -13 + Math.floor(i / 2) * 13, 1, 2, "#f6efd0");
};
SCENE_POLISH.set(57, {
  room: "kitchen",
  back() {
    rounded(123, 116, 269, 108, 12, "#ad865c", "#d3b082");
  },
  front() {
    if (workshop.gesture) {
      const o = workshop.gesture.o;
      line(o.x, 145, o.x, 187, "#e8dab1", 1);
    }
    if (finished) label("THIN / THICK / THIN / THICK", 248, 239);
  },
});
function toastFace() {
  rounded(-49, -43, 98, 87, 14, shade(-49, -43, 98, 87, "#b17a40", "#774c2c"));
  rounded(-43, -37, 86, 75, 10, "#dfbc7a");
  for (let i = 0; i < 42; i++)
    ellipse(
      -35 + ((i * 17) % 72),
      -29 + ((i * 13) % 58),
      1.3,
      0.8,
      "#bc915766",
    );
}
DETAIL_ART.toastFace = toastFace;
DETAIL_ART.jamSpread = () => {
  for (let i = 0; i < 8; i++)
    curve(
      [
        [-33, -26 + i * 8],
        [-13, -34 + i * 8],
        [13, -22 + i * 8],
        [32, -28 + i * 8],
      ],
      "#b15469",
      6,
    );
  for (let i = 0; i < 12; i++)
    ellipse(-28 + ((i * 17) % 54), -25 + ((i * 11) % 52), 1, 1, "#e6a18d");
};
DETAIL_ART.tornToast = () => {
  toastFace();
  DETAIL_ART.jamSpread();
  for (let i = 0; i < 3; i++) {
    rounded(-24 + i * 16, -17 + i * 13, 27, 9, 3, "#efcf7b");
    curve(
      [
        [-23 + i * 14, -8 + i * 13],
        [-20 + i * 14, -3 + i * 13],
        [-10 + i * 14, -7 + i * 13],
        [-5 + i * 14, -2 + i * 13],
      ],
      "#86603b",
      3,
    );
  }
};
const toast = tune("toast");
toast.fixtures[0].art = "toastFace";
toast.steps[0].fx.spawn = [F("jamSpread", 250, 165)];
toast.steps[1].fx.clear = [0, 1];
toast.steps[1].fx.spawn = [F("tornToast", 250, 165)];
SCENE_POLISH.set(58, {
  room: "kitchen",
  back() {
    ellipse(250, 214, 83, 13, "#9eb9b7");
  },
  front() {
    const g = workshop.gesture;
    if (g) {
      const p = taskProgress();
      if (!workshop.step) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(208, 124, 84, 76 * p);
        ctx.clip();
        localProp(250, 165, () => DETAIL_ART.jamSpread());
        ctx.restore();
      } else {
        rounded(g.o.x - 6, g.o.y + 20, 16, 10, 2, "#edce7e");
      }
    }
  },
});
DETAIL_ART.cheesepack = () => {
  rounded(-54, -51, 108, 104, 6, "#b6d2d133", "#abc3c5");
  rounded(-43, -35, 86, 74, 2, "#dfbd63");
  for (let i = 0; i < 8; i++)
    ellipse(-28 + ((i * 19) % 58), -21 + ((i * 23) % 47), 3, 3, "#bc963f");
  for (let y = 38; y < 49; y += 3) line(-42, y, 42, y, "#b5a05c", 1);
  if (!workshop.step) rounded(-53, -49, 106, 9, 2, "#739da7");
  curve(
    [
      [-48, -35],
      [-37, -11],
      [-55, 13],
      [-47, 38],
    ],
    "#e5f1e577",
    2,
  );
  label("RESEAL HERE", 0, -34, "#4c6a6d");
};
SCENE_POLISH.set(59, {
  room: "kitchen",
  front() {
    if (workshop.gesture) {
      const o = workshop.gesture.o;
      curve(
        [
          [203, 111],
          [238, 117],
          [o.x - 25, o.y],
          [o.x, o.y],
        ],
        "#cfddce",
        3,
      );
    }
    if (finished) {
      line(204, 107, 284, 119, "#334a55", 2);
      label("SEAL REMOVED. CHEESE EXPOSED.", 245, 235, "#d8c59c");
    }
  },
});
// Batch 21 — dry crumbs, a sinking tea tag, and the wrong seasoning in each jar.
function fallingGrains() {
  const g = workshop.gesture,
    s = workshop.def.steps[workshop.step];
  if (!g?.held || !s?.fx.particles) return;
  const a = g.o.angle || 0,
    sp = s.fx.spout || [0, 40],
    from = [
      g.o.x + sp[0] * Math.cos(a) - sp[1] * Math.sin(a),
      g.o.y + sp[0] * Math.sin(a) + sp[1] * Math.cos(a),
    ],
    end = s.fx.streamEnd;
  for (let i = 0; i < 20; i++) {
    const f = (workshop.time * 1.4 + i / 20) % 1;
    localProp(
      from[0] + (end[0] - from[0]) * f + Math.sin(i * 5) * f * 8,
      from[1] + (end[1] - from[1]) * f * f,
      () => ellipse(0, 0, s.fx.grainSize || 1.5, 1, s.fx.streamColor),
      f * 8 + i,
    );
  }
}
const crisps = tune("crisps");
Object.assign(crisps.steps[1].fx, {
  particles: true,
  pourAngle: -0.4,
  spout: [0, 55],
  streamEnd: [330, 181],
  streamColor: "#d7b36d",
  grainSize: 2.2,
});
DETAIL_ART.crisps = () => {
  poly(
    [
      [-37, -55],
      [36, -55],
      [42, 55],
      [-42, 55],
    ],
    shade(-37, -55, 80, 110, "#d99e66", "#9f5b47"),
  );
  rounded(-37, -55, 73, 7, 1, "#e9c67c");
  if (!workshop.step) rounded(-42, 48, 84, 7, 1, "#e9c67c");
  else {
    line(-40, 52, 39, 52, "#6b4937", 3);
  }
  rounded(-29, -29, 58, 47, 8, "#f4db9d");
  text("CRISPS", 0, -9, 11, "#8e563b");
  ellipse(-7, 7, 12, 5, "#d6ac57");
  ellipse(9, 3, 11, 5, "#e6bd65");
  for (let y = -43; y < 43; y += 15) line(-34, y, -29, y + 10, "#f1c88c55", 1);
};
SCENE_POLISH.set(60, {
  room: "kitchen",
  front() {
    fallingGrains();
    if (finished)
      for (let i = 0; i < 26; i++)
        ellipse(
          292 + ((i * 19) % 76),
          177 + ((i * 7) % 13),
          1 + (i % 2),
          1,
          "#e2bc70",
        );
  },
});
DETAIL_ART.tag = () => {
  rounded(-14, -10, 28, 20, 2, "#88a475", "#c2cfa2");
  label("TEA", 0, 4, "#213d35");
  ellipse(0, -8, 1.5, 1.5, "#485f43");
};
SCENE_POLISH.set(61, {
  room: "kitchen",
  back() {
    ellipse(280, 216, 60, 11, "#86a5a4");
  },
  front() {
    const t = workshop.props[0];
    if (!workshop.step)
      curve(
        [
          [t.x, t.y - 8],
          [t.x + 10, t.y + 7],
          [267, 141],
          [280, 158],
        ],
        "#e6ddbf",
        1,
      );
    localProp(280, 177, () =>
      rounded(
        -34,
        -17,
        68,
        46,
        7,
        shade(-34, -17, 68, 46, "#edf0e2", "#abc4c3"),
      ),
    );
    if (workshop.step) {
      ctx.globalAlpha = 0.28;
      localProp(
        280,
        151,
        () => {
          rounded(-9, -3, 18, 9, 2, "#769475");
        },
        0.25,
      );
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#c6a87f";
      ctx.beginPath();
      ctx.ellipse(
        280,
        151,
        17 + Math.sin(workshop.time * 4) * 3,
        4,
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  },
});
DETAIL_ART.shaker = (p) => {
  rounded(-25, -26, 50, 63, 10, "#b6c9c844", "#abc4c5");
  ellipse(0, -27, 25, 8, "#677f89");
  ellipse(0, -28, 20, 5, "#233d4c");
  rounded(-17, -9, 34, 27, 4, "#e5dfc4");
  text(p.label || "S", 0, 11, 19, "#2e4653");
  line(-20, -15, -20, 22, "#e4eee588", 2);
};
for (const [j, col] of [
  [0, "#715447"],
  [1, "#e3dfc9"],
])
  Object.assign(tune("shakers").steps[j].fx, {
    particles: true,
    pourAngle: Math.PI,
    spout: [0, -30],
    streamEnd: [j ? 325 : 210, 152],
    streamColor: col,
  });
SCENE_POLISH.set(62, {
  room: "kitchen",
  front() {
    fallingGrains();
    for (let j = 0; j < Math.min(2, workshop.step); j++) {
      const x = j ? 325 : 210;
      rounded(x - 19, 199, 38, 10, 3, j ? "#dfd9bb" : "#6d5141");
      label(j ? "SALT" : "PEPPER", x, 235, j ? "#e5dfc7" : "#d0a083");
    }
  },
});
// The torn seam travels with the bag; the tea string follows its tag.
tune("crisps").steps[1].fx.clear = [1];
DETAIL_ART.teabag = () => {
  rounded(-10, -13, 20, 26, 2, "#b6a489");
  for (let i = 0; i < 12; i++)
    ellipse(-7 + ((i * 5) % 14), -9 + ((i * 7) % 18), 0.6, 0.6, "#7e6b50");
};
// Batch 22 — wet soap adheres to paper; curtain stays on its rail; sponge floats.
DETAIL_ART.soap = () => {
  rounded(
    -34,
    -20,
    68,
    40,
    14,
    shade(-34, -20, 68, 40, "#d6e3c0", "#7eaa8a"),
    "#a5c6a1",
  );
  rounded(-26, -14, 52, 27, 10, null, "#aac6a4");
  label("SOAP", 0, 4, "#5c846c");
  curve(
    [
      [-23, -11],
      [-11, -18],
      [10, -17],
      [20, -12],
    ],
    "#edf4d8aa",
    2,
  );
  for (let i = 0; i < 4; i++)
    ellipse(25 + i * 3, 11 + (i % 2) * 5, 2, 2, "#cadfd899");
};
SCENE_POLISH.set(63, {
  room: "bath",
  front() {
    const p = workshop.props[0],
      h = Math.min(1, (workshop.gesture?.held || 0) / 0.7);
    if (h || finished) {
      localProp(p.x, p.y, () => {
        poly(
          [
            [-36, 9],
            [-24, 0],
            [-16, 10],
            [-8, 5],
            [4, 15],
            [24, 3],
            [36, 12],
            [30, 25],
            [-30, 24],
          ],
          "#e8e2c5",
        );
        for (let i = 0; i < 6; i++)
          line(-25 + i * 10, 14, -23 + i * 10, 22, "#b8b595", 1);
      });
    }
    if (finished) label("DAMP PAPER. FIRMLY ATTACHED.", 270, 235, "#d8cfb5");
  },
});
tune("curtain").steps[0].fx.scaleX = 1;
DETAIL_ART.curtain = (p) => {
  ctx.save();
  ctx.translate(-p.x, -p.y);
  const progress = finished ? 1 : taskProgress(),
    width = 68 + 210 * progress,
    hem = 215 + 16 * progress;
  rounded(78, 66, width, hem - 66, 2, "#9bb9b2");
  for (let i = 0; i < 13; i++) {
    const x = 80 + (i * (width - 4)) / 12;
    curve(
      [
        [x, 68],
        [x - 4, 110],
        [x + 5, 169],
        [x, hem - 2],
      ],
      i % 2 ? "#c3d3c3" : "#608e8e",
      3,
    );
    ctx.strokeStyle = "#d5ddd1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, 64, 3, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  line(79, hem - 5, 76 + width, hem - 5, "#d3dfce", 2);
  ctx.restore();
};
DETAIL_ART.bathtub = () => {
  rounded(
    -98,
    -21,
    196,
    62,
    13,
    shade(-98, -21, 196, 62, "#e5eade", "#8fadb1"),
  );
  ellipse(0, -22, 99, 20, "#dce7df");
  ellipse(0, -23, 84, 13, "#4f8291");
  rounded(-74, 43, 19, 13, 4, "#516c79");
  rounded(55, 43, 19, 13, 4, "#516c79");
};
SCENE_POLISH.set(64, {
  room: "bath",
  front() {
    if (finished) {
      ellipse(315, 234, 36, 5, "#7ca9b377");
      label("HEM OUTSIDE THE BATHTUB", 240, 253, "#d0e0d4");
    }
  },
});
DETAIL_ART.sink = () => {
  rounded(
    -100,
    -49,
    200,
    99,
    16,
    shade(-100, -49, 200, 99, "#bacdd0", "#657f8e"),
    "#c2d5d4",
  );
  ellipse(0, 0, 87, 34, "#3d5258");
  ellipse(0, 0, 79, 27, "#6e7560");
  for (let i = 0; i < 13; i++)
    ellipse(-64 + ((i * 23) % 126), -17 + ((i * 11) % 32), 2, 1, "#ad9772");
  curve(
    [
      [-16, -40],
      [-17, -73],
      [18, -72],
      [18, -42],
    ],
    "#b3c7cb",
    8,
  );
  line(-13, -39, -13, -60, "#e0e9de", 2);
};
DETAIL_ART.sponge = () => {
  rounded(-31, -15, 62, 30, 5, shade(-31, -15, 62, 30, "#efce75", "#b99243"));
  rounded(-31, 7, 62, 8, 2, "#5f8c72");
  for (let i = 0; i < 30; i++)
    ellipse(-25 + ((i * 13) % 51), -10 + ((i * 7) % 17), 1.6, 1.1, "#a5843e");
  line(-23, -12, 21, -12, "#ffe3a5", 1);
};
SCENE_POLISH.set(65, {
  room: "kitchen",
  front() {
    if (finished) {
      const p = workshop.props[0];
      ctx.strokeStyle = "#b1b79b66";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(
          p.x,
          p.y + 7,
          40 + i * 8 + Math.sin(workshop.time * 3) * 2,
          11 + i * 3,
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
      }
    }
  },
});
// Batch 23 — wet footprints, rubbish outside the liner, stretched knit neckline.
DETAIL_ART.mop = () => {
  rounded(-4, -54, 8, 74, 3, shade(-4, -54, 8, 74, "#c6a16f", "#7c6048"));
  rounded(-30, 14, 60, 10, 4, "#789da7");
  for (let i = 0; i < 14; i++)
    curve(
      [
        [-27 + i * 4, 23],
        [-34 + i * 4, 30],
        [-19 + i * 4, 42],
        [-29 + i * 4, 49],
      ],
      i % 2 ? "#c2d5d0" : "#8bacb4",
      2,
    );
};
DETAIL_ART.footprints = () => {
  for (let i = 0; i < 7; i++)
    localProp(
      -94 + i * 28,
      25 - i * 7 + (i % 2) * 7,
      () => {
        ellipse(0, 0, 7, 13, "#3e616d");
        ellipse(0, 13, 5, 5, "#3e616d");
        for (let j = 0; j < 3; j++)
          line(-4, -5 + j * 4, 4, -5 + j * 4, "#82a7af", 1);
      },
      0.9,
    );
};
SCENE_POLISH.set(66, {
  room: "studio",
  front() {
    const g = workshop.gesture;
    if (g && !workshop.step) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(150, 123, 220, 108);
      ctx.clip();
      for (let i = 0; i < g.path.length; i += 3)
        ellipse(g.path[i].x, g.path[i].y + 30, 29, 9, "#94c4ce33");
      ctx.restore();
    }
    if (workshop.step) {
      for (let i = 0; i < 6; i++)
        line(
          167 + i * 34,
          147 + (i % 3) * 25,
          183 + i * 34,
          143 + (i % 3) * 25,
          "#c4e0dd88",
          1,
        );
    }
  },
});
DETAIL_ART.bin = () => {
  poly(
    [
      [-43, -39],
      [43, -39],
      [33, 52],
      [-33, 52],
    ],
    shade(-43, -39, 86, 91, "#9aafb0", "#526f80"),
  );
  for (let x = -26; x < 30; x += 13) line(x, -17, x * 0.8, 44, "#d5e0d133", 1);
  ellipse(0, -39, 44, 13, "#b5c8c6");
  ellipse(0, -39, 31, 9, "#172d38");
  curve(
    [
      [-30, -40],
      [-21, -29],
      [12, -31],
      [30, -40],
    ],
    "#617b7c",
    3,
  );
  poly(
    [
      [-30, -39],
      [-25, -20],
      [-17, -27],
      [-11, -30],
    ],
    "#354d56",
  );
};
SCENE_POLISH.set(67, {
  room: "kitchen",
  front() {
    const o = workshop.props[0];
    if (workshop.step) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(213, 148, 94, 90);
      ctx.clip();
      localProp(260, 174, () => DETAIL_ART.bin());
      ctx.restore();
      localProp(294, 144, () => {
        poly(
          [
            [-6, -5],
            [2, -9],
            [7, -1],
            [3, 5],
            [-5, 3],
          ],
          "#eee5cb",
        );
        line(-4, -3, 4, 2, "#9ba9a7", 1);
      });
      label("BETWEEN BIN AND LINER", 260, 242, "#ddd0ad");
    }
  },
});
DETAIL_ART.knitshirt = () => {
  poly(
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
    shade(-60, -48, 120, 97, "#96bcc5", "#5f8da6"),
  );
  line(-27, 43, 27, 43, "#d1ded1", 1);
  for (const x of [-44, 44]) line(x - 4, -9, x + 4, -15, "#c3d8d1", 1);
  const p = finished ? 1 : taskProgress();
  ellipse(0, -39, 15 + 13 * p, 7 + 7 * p, "#223845");
  ctx.strokeStyle = "#c7d9d1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -39, 16 + 13 * p, 8 + 7 * p, 0, 0, Math.PI * 2);
  ctx.stroke();
};
const hanger = tune("hanger");
hanger.fixtures[0].art = "knitshirt";
hanger.steps[0].fx.spawn = [];
DETAIL_ART.hanger = () => {
  curve(
    [
      [0, -20],
      [-2, -28],
      [-2, -35],
      [4, -35],
    ],
    "#c1d1d2",
    3,
  );
  curve(
    [
      [4, -35],
      [18, -42],
      [12, -52],
      [5, -49],
    ],
    "#c1d1d2",
    3,
  );
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-48, 18);
  ctx.lineTo(48, 18);
  ctx.closePath();
  ctx.strokeStyle = "#cda16b";
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineJoin = "miter";
};
SCENE_POLISH.set(68, {
  room: "bedroom",
  back() {
    rounded(171, 79, 177, 152, 8, "#42525d");
  },
  front() {
    if (finished) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(195, 148, 130, 80);
      ctx.clip();
      localProp(260, 171, () => DETAIL_ART.knitshirt());
      ctx.restore();
      label("A WIDER NECKLINE THAN BEFORE", 260, 244);
    }
  },
});
tune("bin").steps[0].fx.sink = false;
tune("bin").steps[0].fx.hide = true;
DETAIL_ART.feet = () => {
  for (const side of [-1, 1])
    localProp(
      side * 13,
      side * 4,
      () => {
        rounded(-9, -18, 18, 37, 8, "#334855");
        rounded(-8, -18, 16, 31, 7, "#a37858");
        for (let j = 0; j < 3; j++)
          line(-5, -7 + j * 5, 5, -7 + j * 5, "#e5d4b4", 1);
        line(-6, 14, 6, 14, "#cdbaa0", 1);
      },
      0.1,
    );
};
// Batch 24 — a tucked glove finger, upholstery and exposed zip, a deep wax tunnel.
DETAIL_ART.glove = () => {
  rounded(-29, -23, 58, 66, 10, shade(-29, -23, 58, 66, "#9db39a", "#608974"));
  for (let i = 0; i < 3; i++)
    rounded(-27 + i * 18, -65 + (i % 2) * 8, 14, 50, 7, "#85a68e");
  poly(
    [
      [-29, -6],
      [-53, -24],
      [-58, -8],
      [-29, 22],
    ],
    "#73977f",
  );
  rounded(-27, 29, 54, 16, 3, "#a7b59a");
  for (let x = -22; x < 24; x += 5) line(x, 31, x, 43, "#739781", 1);
  for (let x = -18; x < 22; x += 17)
    curve(
      [
        [x, -14],
        [x - 4, -1],
        [x + 4, 8],
        [x, 21],
      ],
      "#c5d2b366",
      1,
    );
};
DETAIL_ART.finger = () => {
  rounded(-7, -24, 14, 48, 7, shade(-7, -24, 14, 48, "#a6bea2", "#6b957d"));
  line(-3, -18, -3, 15, "#d5ddba88", 1);
};
tune("glove").steps[0].fx.spawn = [];
SCENE_POLISH.set(69, {
  room: "bedroom",
  front() {
    if (finished) {
      ellipse(287, 139, 8, 5, "#3b6655");
      curve(
        [
          [278, 136],
          [284, 142],
          [290, 135],
          [295, 138],
        ],
        "#b4c9ac",
        2,
      );
      label("LITTLE FINGER: INSIDE", 260, 237);
    }
  },
});
DETAIL_ART.sofa = () => {
  rounded(
    -99,
    -56,
    198,
    97,
    15,
    shade(-99, -56, 198, 97, "#ab9cae", "#71657f"),
  );
  line(0, -48, 0, 2, "#766b84", 1);
  rounded(-101, 0, 202, 48, 8, "#82758e");
  for (const x of [-105, 105]) rounded(x - 13, -20, 26, 81, 9, "#786983");
  for (const x of [-82, 82]) rounded(x - 6, 53, 12, 14, 2, "#524536");
  line(-87, 42, 87, 42, "#c2acc0", 1);
};
DETAIL_ART.cushion = (p) => {
  rounded(
    -44,
    -32,
    88,
    64,
    12,
    shade(-44, -32, 88, 64, "#b4ccb5", "#749d92"),
    "#c7d9bc",
  );
  rounded(-38, -26, 76, 52, 9, null, "#628e84");
  curve(
    [
      [-37, -24],
      [-20, -14],
      [-24, -8],
      [-31, -10],
    ],
    "#d5dfc466",
    1,
  );
  if (p.mark === "zip") {
    rounded(-34, 20, 68, 5, 2, "#365d58");
    for (let i = 0; i < 17; i++)
      line(-31 + i * 4, 19, -29 + i * 4, 25, "#e3d5a6", 1);
    rounded(27, 18, 8, 12, 2, "#b4aa7a");
    rounded(29, 21, 3, 6, 1, "#4f7165");
  }
};
SCENE_POLISH.set(70, {
  room: "bedroom",
  front() {
    if (finished) label("ZIP FACING THE ROOM", 260, 254, "#d0dfc9");
  },
});
function waxCandle(lit) {
  const depth = workshop.step
    ? 1
    : Math.min(1, (workshop.gesture?.held || 0) / 1.5);
  ellipse(0, 50, 46, 9, "#a6a6a0");
  rounded(-29, -44, 58, 88, 5, shade(-29, -44, 58, 88, "#f0e4c3", "#b8aa83"));
  ellipse(0, -44, 29, 10, "#ede0bc");
  ellipse(0, -44, 8 + depth * 11, 4 + depth * 4, "#b4a27c");
  ellipse(0, -42, 6 + depth * 8, 3 + depth * 4, "#635544");
  line(0, -46, 0, -35, "#3b3932", 2);
  if (lit) {
    ctx.globalAlpha = 0.15;
    ellipse(0, -61, 22, 32, "#edc36d");
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(Math.sin(workshop.time * 5) * 3, -79);
    ctx.bezierCurveTo(-17, -53, -2, -44, 7, -56);
    ctx.quadraticCurveTo(11, -64, Math.sin(workshop.time * 5) * 3, -79);
    ctx.fillStyle = "#e9b857";
    ctx.fill();
    ellipse(0, -57, 3, 8, "#fff0ba");
  } else
    curve(
      [
        [0, -48],
        [-13, -64],
        [15, -72],
        [0, -93],
      ],
      "#c5d4cf55",
      2,
    );
}
DETAIL_ART.candle = () => waxCandle(true);
DETAIL_ART.candleout = () => waxCandle(false);
tune("candle").steps[0].fx.spawn = [];
SCENE_POLISH.set(71, {
  room: "desk",
  front() {
    if (finished) label("DEEP CENTER. UNMELTED EDGES.", 250, 249, "#e1d1ac");
  },
});
// Batch 25 — a trapped sleeve, an actual folded page corner, spiral-bound paper.
DETAIL_ART.suitcase = () => {
  rounded(-87, -46, 174, 92, 13, "#956b55", "#c5a184");
  rounded(-78, -37, 156, 75, 9, "#423f42");
  for (let y = -30; y < 34; y += 9) line(-73, y, 73, y, "#72626044", 1);
  rounded(-24, 44, 48, 9, 4, "#253640");
  for (const x of [-67, 67]) rounded(x - 7, 43, 14, 12, 3, "#243743");
};
DETAIL_ART.suitcaselid = () => {
  rounded(
    -85,
    -40,
    170,
    80,
    13,
    shade(-85, -40, 170, 80, "#cb9e78", "#946c56"),
    "#dfbb8d",
  );
  rounded(-76, -31, 152, 62, 9, null, "#6f5146");
  for (const x of [-55, 55]) rounded(x - 6, -37, 12, 74, 2, "#745243");
  for (const x of [-55, 55]) rounded(x - 8, 23, 16, 12, 2, "#d0b27b");
};
SCENE_POLISH.set(72, {
  room: "bedroom",
  back() {
    if (workshop.step) {
      poly(
        [
          [301, 162],
          [344, 165],
          [374, 181],
          [365, 199],
          [323, 185],
          [299, 187],
        ],
        "#83aab8",
      );
      line(328, 174, 365, 188, "#c8d9ce", 1);
    }
  },
  front() {
    if (finished) {
      line(335, 172, 350, 176, "#d3dfd1", 1);
      label("SLEEVE OUTSIDE. CASE CLOSED.", 245, 244);
    }
  },
});
DETAIL_ART.openbook = () => {
  rounded(-79, -56, 158, 114, 3, "#876354");
  rounded(-74, -51, 73, 103, 2, "#d5c7a9");
  rounded(1, -51, 73, 103, 2, "#efe4c9");
  for (let y = -37; y < 43; y += 9)
    for (const side of [-1, 1])
      line(side < 0 ? -63 : 12, y, side < 0 ? -13 : 62, y, "#9a9f9466", 1);
  curve(
    [
      [0, -49],
      [-5, -16],
      [-4, 24],
      [0, 51],
    ],
    "#b4a58c",
    2,
  );
  for (let y = 53; y < 57; y += 2) line(-72, y, 72, y, "#baa98a", 1);
};
const dog = tune("dogear");
dog.pieces[0].y = 119;
dog.steps[0].fx.hide = true;
SCENE_POLISH.set(73, {
  room: "desk",
  front() {
    if (finished) {
      poly(
        [
          [271, 111],
          [319, 111],
          [319, 154],
        ],
        "#2a3b48",
      );
      poly(
        [
          [271, 111],
          [312, 154],
          [271, 154],
        ],
        "#cbbf9f",
      );
      line(271, 111, 312, 154, "#f4e4bd", 2);
      line(274, 151, 306, 151, "#a39575", 1);
    }
    if (!workshop.gesture) label("BOOKMARK", 375, 224, "#c49baa");
  },
});
DETAIL_ART.notebook = () => {
  rounded(-49, -62, 98, 124, 5, "#a48ba4");
  rounded(-37, -55, 80, 112, 1, "#e0d8bd");
  for (let y = -41; y < 49; y += 10) line(-24, y, 35, y, "#a8b9b3", 0.7);
  for (let y = -49; y < 54; y += 11) {
    ctx.strokeStyle = "#263f4c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-43, y, 9, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    line(-48, y - 2, -38, y - 2, "#b7c9c7", 1);
  }
};
DETAIL_ART.notebookPage = () => {
  rounded(-36, -53, 72, 106, 1, "#f0e6c9");
  line(-26, -46, -26, 46, "#c99591", 1);
  for (let y = -37; y < 47; y += 10) line(-24, y, 29, y, "#b4c6be", 0.7);
};
DETAIL_ART.verticalFringe = () => {
  for (let i = 0; i < 10; i++)
    poly(
      [
        [-2, -50 + i * 11],
        [13 + (i % 3) * 3, -49 + i * 11],
        [7, -44 + i * 11],
        [0, -42 + i * 11],
      ],
      "#f0e4c4",
    );
};
tune("notebook").pieces[0].art = "notebookPage";
tune("notebook").steps[0].fx.spawn = [F("verticalFringe", 205, 160)];
SCENE_POLISH.set(74, {
  room: "desk",
  front() {
    if (workshop.gesture) {
      const p = workshop.gesture.o;
      curve(
        [
          [208, 112],
          [218, 128],
          [p.x - 25, p.y - 42],
          [p.x - 32, p.y - 47],
        ],
        "#d5c5a0",
        1,
      );
    }
    if (finished) label("PAPER STILL IN EVERY LOOP", 245, 245, "#e0cfab");
  },
});
// Batch 26 — a graphite point that actually breaks on paper, folded adhesive, empty envelope.
const pencil = tune("pencil");
pencil.steps[0].to = [190, 66];
pencil.steps[0].fx.angle = 0;
pencil.steps[1].to = [330, 130];
pencil.steps[1].fx.angle = 0;
DETAIL_ART.pencil = (p) => {
  rounded(-5, -51, 10, 91, 1, "#d6ad51");
  line(-2, -48, -2, 39, "#f3d880", 2);
  rounded(-5, -56, 10, 8, 1, "#bc827d");
  line(-5, -48, 5, -48, "#b4c1bd", 2);
  const tip = p.mark === "broken" ? 46 : p.mark === "sharp" ? 57 : 50;
  poly(
    [
      [-5, 40],
      [5, 40],
      [0, tip],
    ],
    "#e0c39a",
  );
  if (p.mark !== "broken")
    poly(
      [
        [-2, tip - 6],
        [2, tip - 6],
        [0, tip],
      ],
      "#263a45",
    );
  else line(-2, 45, 2, 45, "#384749", 2);
};
DETAIL_ART.sharpener = () => {
  rounded(-25, -19, 50, 38, 5, shade(-25, -19, 50, 38, "#9eb9c2", "#607f94"));
  rounded(-15, -15, 30, 30, 2, "#d2dcd8");
  ellipse(0, 0, 8, 8, "#304856");
  ellipse(0, 0, 4, 4, "#182a37");
  line(-11, -11, -11, 10, "#7e979e", 2);
  ellipse(9, -9, 2, 2, "#7c8c8e");
};
SCENE_POLISH.set(75, {
  room: "desk",
  front() {
    if (workshop.step) {
      for (let i = 0; i < 5; i++)
        curve(
          [
            [174 + i * 8, 152],
            [171 + i * 8, 146],
            [180 + i * 8, 148],
            [178 + i * 8, 155],
          ],
          "#cba76d",
          2,
        );
    }
    if (finished) {
      line(326, 179, 337, 185, "#52606a", 1);
      label("A PERFECT POINT. BRIEFLY.", 274, 248, "#dfcba3");
    }
  },
});
function bandageHalf() {
  rounded(-25, -14, 50, 28, 8, "#d4ad8d", "#efd1aa");
  for (let i = 0; i < 12; i++)
    ellipse(-18 + (i % 6) * 6, -6 + Math.floor(i / 6) * 12, 1, 1, "#a67e65");
}
DETAIL_ART.plaster = () => {
  rounded(-53, -14, 106, 28, 8, "#d1a98a");
  rounded(-15, -12, 30, 24, 3, "#f0e7cf");
  for (let x = -10; x < 14; x += 4)
    for (let y = -8; y < 11; y += 4) ellipse(x, y, 0.6, 0.6, "#c4c7b7");
  for (let i = 0; i < 6; i++) ellipse(23 + i * 4, -5, 1, 1, "#9b765e");
};
DETAIL_ART.plasterhalf = bandageHalf;
DETAIL_ART.foldedBandage = () => {
  rounded(-25, -12, 50, 28, 8, "#b78c70");
  localProp(0, -2, bandageHalf);
  line(-17, 14, 17, 14, "#ebcaa5", 1);
};
tune("plaster").steps[0].fx.art = "foldedBandage";
tune("plaster").steps[0].fx.angle = 0;
SCENE_POLISH.set(76, {
  room: "bath",
  front() {
    if (finished) label("ADHESIVE AGAINST ADHESIVE", 266, 228, "#e3cfb1");
  },
});
DETAIL_ART.envelope = () => {
  rounded(
    -67,
    -38,
    134,
    76,
    3,
    shade(-67, -38, 134, 76, "#eee4c9", "#c7bfa7"),
    "#f3e9cf",
  );
  line(-64, -34, 0, 10, "#afa88f", 1);
  line(64, -34, 0, 10, "#afa88f", 1);
  line(-64, 35, 0, -9, "#d9cfb1", 1);
  line(64, 35, 0, -9, "#d9cfb1", 1);
};
DETAIL_ART.envelopeflap = () => {
  const open = !workshop.step,
    apex = open ? -38 : 15,
    base = open ? 17 : -33;
  poly(
    [
      [-66, base],
      [66, base],
      [0, apex],
    ],
    open ? "#c5bea6" : "#e3dac1",
  );
  line(-62, base, 0, apex + (open ? 5 : -3), "#f2e8cf", 1);
  line(62, base, 0, apex + (open ? 5 : -3), "#b4ae96", 1);
};
tune("envelope").steps[0].fx.angle = 0;
tune("envelope").steps[1].fx.hide = true;
SCENE_POLISH.set(77, {
  room: "desk",
  front() {
    if (finished) {
      localProp(245, 169, () => DETAIL_ART.envelopeflap());
      ellipse(245, 177, 12, 12, "#b16375");
      ellipse(245, 176, 8, 8, "#95495f");
      text("T", 245, 180, 10, "#d89ca0");
      label("LETTER STILL OUTSIDE", 370, 223, "#d6caa9");
    }
  },
});
// Batch 27 — recognisable cards, oriented chess squares, a lid caught on a pawn.
function cardBack() {
  rounded(-27, -38, 54, 76, 4, "#e9e4cd", "#b1b7a8");
  rounded(-22, -33, 44, 66, 2, "#517b94");
  for (let y = -26; y < 30; y += 9)
    for (let x = -15; x < 20; x += 10) {
      poly(
        [
          [x, y - 3],
          [x + 3, y],
          [x, y + 3],
          [x - 3, y],
        ],
        "#91b2be",
      );
    }
  rounded(-18, -29, 36, 58, 1, null, "#c5d9d2");
}
DETAIL_ART.playingcard = (p) => {
  if (p.mark !== "face") {
    cardBack();
    return;
  }
  rounded(-27, -38, 54, 76, 4, "#f3ebd4", "#b5bfad");
  text("A", -17, -20, 13, "#b15367");
  localProp(17, 21, () => text("A", 0, 0, 13, "#b15367"), Math.PI);
  poly(
    [
      [0, -16],
      [12, 0],
      [0, 16],
      [-12, 0],
    ],
    "#ba536b",
  );
};
DETAIL_ART.deck = () => {
  for (let i = 5; i >= 0; i--) localProp(i * 2, i * 2, cardBack);
};
SCENE_POLISH.set(78, {
  room: "desk",
  back() {
    rounded(166, 76, 220, 155, 18, "#426e66", "#819e86");
  },
  front() {
    if (finished) label("ONE CARD IS TELLING ON ITSELF", 265, 245, "#c8d7bb");
  },
});
DETAIL_ART.chessboard = () => {
  rounded(-87, -87, 174, 174, 5, "#9f7b55", "#d5b684");
  for (let row = 0; row < 8; row++)
    for (let col = 0; col < 8; col++) {
      const x = -80 + col * 20,
        y = -80 + row * 20;
      box(x, y, 20, 20, (row + col) % 2 ? "#2a4247" : "#e2d4af");
      if ((row + col) % 2) line(x + 2, y + 3, x + 17, y + 3, "#526363", 0.5);
    }
  for (let i = 0; i < 8; i++) {
    text("abcdefgh"[i], -70 + i * 20, 86, 5, "#463e31");
    text(String(8 - i), -84, -68 + i * 20, 5, "#463e31");
  }
};
SCENE_POLISH.set(79, {
  room: "desk",
  front() {
    if (finished) {
      rounded(305, 214, 20, 20, 1, null, "#dfb972");
      label("BLACK ON THE RIGHT", 245, 252, "#ddca9d");
    }
  },
});
DETAIL_ART.gamebox = () => {
  rounded(-81, -46, 162, 93, 5, "#b89b77");
  rounded(-73, -37, 146, 76, 2, "#45616d");
  line(-25, -35, -25, 36, "#8a9c9d", 2);
  for (let i = 0; i < 4; i++) rounded(-64 + i * 9, -29, 7, 54, 1, "#b5c7be");
  rounded(-13, -29, 73, 54, 4, null, "#819b9b");
};
DETAIL_ART.pawn = (p) => {
  const c = p.color || "#be7684";
  ellipse(0, 22, 15, 5, "#704856");
  poly(
    [
      [-6, -4],
      [6, -4],
      [13, 20],
      [-13, 20],
    ],
    c,
  );
  ellipse(0, -13, 10, 10, c);
  ellipse(-3, -16, 3, 3, "#e7b9b4");
  line(-7, 17, 7, 17, "#e4acaf", 1);
};
DETAIL_ART.boxlid = () => {
  rounded(
    -81,
    -46,
    162,
    92,
    5,
    shade(-81, -46, 162, 92, "#93b7b4", "#4c8086"),
    "#bed3be",
  );
  rounded(-73, -38, 146, 76, 3, null, "#314f60");
  text("GAME NIGHT", 0, -6, 14, "#213f4c");
  for (let i = 0; i < 3; i++) {
    rounded(-30 + i * 23, 9, 17, 17, 2, "#d7cfac");
    ellipse(-22 + i * 23, 17, 2, 2, "#4d6c6c");
  }
};
SCENE_POLISH.set(80, {
  room: "desk",
  front() {
    if (finished) {
      localProp(333, 166, () => {
        ellipse(0, -13, 10, 10, "#bc7583");
        ellipse(-3, -16, 3, 3, "#e9c0b8");
      });
      line(329, 177, 333, 181, "#d8b98b", 2);
      label("ONE PIECE UNDER THE LID", 250, 244, "#dfcfa7");
    }
  },
});
// Batch 28 — a gridded 3D cube and a domino cascade that stops at the gap.
const cube = tune("cube");
cube.pieces[0].y = 127;
for (const s of cube.steps) {
  s.to = [302, 127];
  s.fx.angle = 0;
}
cube.steps[1].fx.spawn = [F("cubeTopBand", 245, 165)];
DETAIL_ART.cube = (p) => {
  poly(
    [
      [-44, -38],
      [-17, -59],
      [69, -59],
      [69, 28],
      [44, 50],
      [-44, 50],
    ],
    "#1a2c37",
  );
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      rounded(
        -40 + c * 28,
        -34 + r * 28,
        24,
        24,
        2,
        p.mark === "mixed"
          ? ["#c87987", "#e2be6c", "#80aa8d", "#789ebc", "#e5dfc2"][
              (r * 3 + c) % 5
            ]
          : "#7eaa8b",
      );
      line(
        -37 + c * 28,
        -31 + r * 28,
        -19 + c * 28,
        -31 + r * 28,
        "#d7e3be55",
        1,
      );
      const x = 46 + c * 8,
        y = -36 - c * 7 + r * 28;
      poly(
        [
          [x, y],
          [x + 6, y - 5],
          [x + 6, y + 19],
          [x, y + 24],
        ],
        "#b56b77",
      );
    }
  localProp(0, -38, () => DETAIL_ART.cubeface({}));
};
DETAIL_ART.cubeface = () => {
  const shift = workshop.gesture ? taskProgress() * 5 : 0;
  ctx.translate(shift, 0);
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const x = -16 + c * 28 - r * 9,
        y = -20 + r * 7;
      poly(
        [
          [x, y],
          [x + 24, y],
          [x + 17, y + 5],
          [x - 7, y + 5],
        ],
        "#dfbf70",
      );
    }
  ctx.translate(-shift, 0);
};
DETAIL_ART.cubeTopBand = () => {
  for (let i = 0; i < 3; i++) {
    rounded(-40 + i * 28, -34, 24, 24, 2, "#bc7584");
    line(-37 + i * 28, -31, -19 + i * 28, -31, "#e2afb1", 1);
    const x = 46 + i * 8,
      y = -36 - i * 7;
    poly(
      [
        [x, y],
        [x + 6, y - 5],
        [x + 6, y + 19],
        [x, y + 24],
      ],
      "#7d9fb8",
    );
  }
};
SCENE_POLISH.set(81, {
  room: "desk",
  back() {
    stageShadow(250, 222, 84, 10);
  },
  front() {
    if (workshop.step)
      label(
        finished ? "ONE TURN TOO MANY" : "SOLVED. NOT FOR LONG.",
        245,
        finished ? 245 : 235,
        "#dfcf9e",
      );
  },
});
function dominoTile() {
  rounded(
    -7,
    -29,
    14,
    58,
    3,
    shade(-7, -29, 14, 58, "#f3e9cf", "#b9bdab"),
    "#e4e0c8",
  );
  line(-5, 0, 5, 0, "#7b9191", 1);
  for (const y of [-18, 17]) ellipse(0, y, 2, 2, "#324c56");
}
DETAIL_ART.domino = dominoTile;
DETAIL_ART.dominorow = () => {
  for (let i = 1; i < 5; i++) localProp(-125 + i * 35, -5, dominoTile);
};
DETAIL_ART.fallenrow = () => {
  for (let i = 0; i < 5; i++) {
    const fall = Math.min(
      1,
      Math.max(0, (workshop.time - workshop.finishAt - i * 0.16) * 4),
    );
    localProp(
      -95 + i * 35,
      12,
      () => localProp(0, -29, dominoTile),
      (fall * Math.PI) / 2,
    );
  }
};
SCENE_POLISH.set(82, {
  room: "desk",
  back() {
    rounded(74, 205, 318, 9, 3, "#aa8965");
  },
  front() {
    if (workshop.step) {
      ctx.setLineDash([3, 3]);
      line(289, 215, 334, 215, "#d8b47c", 1);
      ctx.setLineDash([]);
      label("TOO FAR", 312, 231, "#e1cca0");
    }
    if (finished && workshop.time - workshop.finishAt > 1.2)
      label("AND… STOP.", 240, 253, "#c9d8cd");
  },
});
