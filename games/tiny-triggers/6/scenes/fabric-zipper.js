(() => {
  'use strict';
  TinyV5.register({
    id: 'fabric-zipper',
    title: 'The Fabric-Eating Zipper',
    chapter: 'home',
    description: 'Zip your jacket up to your chin. Pull back if the lining catches.',
    hint: 'Drag the metal pull from the bottom up under the chin. Once the lining catches, release, grab the pull again, and drag down while holding it.',
    verdict: 'Reverse gear. Forward commitment.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const startY = 218, catchY = 95;
      let phase = 0, time = 0, sliderY = startY, dragging = false, grabY = 17;
      let catchProgress = 0, wedge = 0, targetWedge = 0, reverseStart = 0, baseWedge = 0;
      let pointerX = 240, settle = 0, finished = false;

      function curve(points, color, width = 2) {
        ctx.beginPath(); ctx.moveTo(...points[0]);
        for (let n = 1; n + 2 < points.length; n += 3) ctx.bezierCurveTo(...points[n], ...points[n + 1], ...points[n + 2]);
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      }

      function jacket() {
        // Cropped portrait, throat, and turned collar establish the zipper's height.
        round(222, 51, 36, 46, 10, '#bf8f79');
        ellipse(240, 9, 43, 62, '#d6ad91');
        ctx.save(); ctx.beginPath(); ctx.ellipse(240, 9, 43, 62, 0, 0, Math.PI * 2); ctx.clip();
        ellipse(257, 7, 32, 61, '#c89c83'); ctx.restore();
        curve([[236, 19], [231, 29], [235, 32], [242, 30]], '#b6836f', 1.7);
        curve([[229, 46], [236, 49], [245, 49], [251, 45]], '#976c61', 1.8);
        curve([[229, 61], [236, 64], [246, 64], [251, 60]], '#b78773', 1.5);
        poly([[213, 75], [224, 82], [240, 94], [256, 82], [267, 75], [275, 133], [204, 133]], '#934f54');
        for (let x = 222; x < 261; x += 4) line(x, 82, x, 104, '#b2786b', 1);
        ctx.beginPath(); ctx.moveTo(214, 74);
        ctx.bezierCurveTo(193, 77, 150, 82, 132, 91);
        ctx.bezierCurveTo(98, 110, 88, 162, 67, 249);
        ctx.lineTo(151, 256); ctx.lineTo(170, 190); ctx.lineTo(166, 256);
        ctx.lineTo(314, 256); ctx.lineTo(310, 190); ctx.lineTo(329, 256);
        ctx.lineTo(413, 249); ctx.bezierCurveTo(392, 162, 382, 110, 348, 91);
        ctx.bezierCurveTo(330, 82, 287, 77, 266, 74);
        ctx.lineTo(240, 112); ctx.closePath();
        const cloth = ctx.createLinearGradient(80, 100, 388, 240);
        cloth.addColorStop(0, '#497f84'); cloth.addColorStop(.48, '#326c75'); cloth.addColorStop(1, '#25535f');
        ctx.fillStyle = cloth; ctx.fill();
        poly([[132, 91], [146, 104], [126, 188], [112, 249], [67, 249], [100, 133]], '#3d727c');
        poly([[348, 91], [334, 104], [354, 188], [368, 249], [413, 249], [380, 133]], '#214b58');
        curve([[146, 104], [139, 139], [130, 179], [116, 244]], '#69949570', 1.4);
        curve([[334, 104], [341, 139], [350, 179], [364, 244]], '#0f394680', 2);
        curve([[169, 128], [175, 174], [168, 208], [174, 251]], '#275460', 2);
        curve([[311, 128], [305, 174], [312, 208], [306, 251]], '#3d758080', 1.5);
        curve([[96, 209], [112, 211], [120, 216], [128, 223]], '#234c5b', 2);
        curve([[383, 209], [367, 211], [359, 216], [351, 223]], '#427581', 1.6);
        round(81, 239, 68, 18, 4, '#254b59'); round(331, 239, 68, 18, 4, '#1d3f4c');
        for (let x = 87; x < 144; x += 6) line(x, 241, x - 3, 254, '#4a7178', 1);
        for (let x = 338; x < 393; x += 6) line(x, 241, x + 3, 254, '#365e68', 1);
        // Real pockets, stitching, and a tiny unbranded mountain patch.
        line(181, 179, 196, 226, '#173f4c', 7); line(179, 179, 194, 225, '#6b9291', 1.5);
        line(299, 179, 284, 226, '#173f4c', 7); line(301, 179, 286, 225, '#6b9291', 1.5);
        round(164, 125, 31, 22, 4, '#284d59', '#79a0a0');
        poly([[169, 141], [177, 130], [183, 138], [187, 133], [192, 141]], '#a6bdad');
        line(173, 252, 308, 252, '#82a09a50', 1);
      }

      function opening() {
        const gapAt = y => y < sliderY ? 5 + Math.min(18, (sliderY - y) * .15) : 3;
        const points = [];
        for (let y = 84; y <= 249; y += 5) points.push([240 - gapAt(y) - 2, y]);
        for (let y = 249; y >= 84; y -= 5) points.push([240 + gapAt(y) + 2, y]);
        poly(points, '#1a3543');
        if (sliderY > 98) {
          poly([[227, 84], [253, 84], [246, sliderY], [234, sliderY]], '#ac7165');
          poly([[231, 84], [249, 84], [243, sliderY], [237, sliderY]], '#754852');
        }
        ctx.beginPath();
        for (let y = 84; y <= 249; y += 5) { const x = 240 - gapAt(y) - 3; if (y === 84) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.strokeStyle = '#628788'; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath();
        for (let y = 84; y <= 249; y += 5) { const x = 240 + gapAt(y) + 3; if (y === 84) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
        ctx.strokeStyle = '#173e4a'; ctx.lineWidth = 3; ctx.stroke();
        for (let y = 87; y < 249; y += 7) {
          const open = y < sliderY, gap = gapAt(y);
          round(240 - gap - 2, y, open ? 5 : 6, 3, .7, '#bdc5b5');
          round(240 + gap - (open ? 3 : 4), y + (open ? 0 : 2), open ? 5 : 6, 3, .7, '#88a4a6');
        }
      }

      function collar() {
        poly([[213, 73], [226, 84], [235, 100], [221, 121], [198, 88]], '#173d49');
        poly([[213, 73], [226, 84], [232, 101], [218, 111], [202, 87]], '#56888a');
        line(208, 80, 226, 101, '#91b0a680', 1.5);
        poly([[267, 73], [254, 84], [245, 100], [259, 121], [282, 88]], '#133946');
        poly([[267, 73], [254, 84], [248, 101], [262, 111], [278, 87]], '#457b81');
        line(272, 80, 254, 101, '#91b0a680', 1.5);
        // Loose lining is visible before it is ingested by the slider.
        if (phase === 0) {
          poly([[254, 84], [262, 91], [257, 108], [250, 101]], '#d29b7d');
          line(254, 89, 258, 98, '#f0bc94', 1);
        }
      }

      function caughtFabric() {
        if (phase === 0) return;
        const c = catchProgress, w = wedge;
        const rootX = 260 + w * 10, rootY = 88 + w * 4;
        const tipX = 243, tipY = sliderY + 2;
        ctx.save(); ctx.globalAlpha = c;
        poly([[rootX + 5, rootY + 2], [rootX + 4 + w * 9, rootY + 22 + w * 11], [tipX + 1, tipY + 8], [tipX - 1, tipY]], '#102c3bb0');
        poly([[rootX, rootY], [rootX + 3 + w * 7, rootY + 18 + w * 10], [tipX, tipY + 6], [tipX, tipY]], '#bc7d64');
        poly([[rootX, rootY], [rootX + 1, rootY + 9 + w * 5], [tipX, tipY + 3], [tipX, tipY]], '#e4b38d');
        const folds = 2 + Math.floor(w * 5);
        for (let n = 0; n < folds; n++) {
          const f = (n + 1) / (folds + 1);
          const x = tipX + (rootX - tipX) * f, y = tipY + 2 + (1 - f) * w * 8;
          curve([[x - 1, y - 3 - w * 5], [x + 6, y - 4], [x - 5, y + 6 + w * 5], [x + 4, y + 7 + w * 7]], n % 2 ? '#e8b28c' : '#8e584e', 1.6 + w);
        }
        line(tipX, tipY + 3, rootX, rootY + 3, '#ffe0ae', 1.2);
        ctx.restore();
        if (w > .12) {
          curve([[252, 111], [264, 119 + w * 10], [283, 114 + w * 11], [295, 129 + w * 4]], '#17414e', 1.5 + w);
          curve([[254, 114], [263, 126 + w * 12], [275, 127 + w * 11], [281, 140 + w * 7]], '#5e8b8d', 1.3);
          curve([[229, 110], [221, 119 + w * 8], [216, 120 + w * 4], [207, 132 + w * 9]], '#204c58', 1.5);
        }
      }

      function slider() {
        const strain = phase === 3 && dragging ? Math.sin(time * 32) * .6 : 0;
        const x = 240 + strain;
        ellipse(x, sliderY + 13, 12, 8, '#0d283a70');
        poly([[x - 9, sliderY - 9], [x + 9, sliderY - 9], [x + 7, sliderY + 11], [x - 7, sliderY + 11]], '#4f6874');
        poly([[x - 8, sliderY - 10], [x + 8, sliderY - 10], [x + 6, sliderY + 8], [x - 6, sliderY + 8]], '#bcc7bf');
        poly([[x + 2, sliderY - 9], [x + 8, sliderY - 10], [x + 6, sliderY + 8], [x + 2, sliderY + 7]], '#829da4');
        line(x - 5, sliderY - 7, x - 4, sliderY + 5, '#f1ede0', 1.5);
        round(x - 4, sliderY - 2, 8, 11, 3, '#6c8991');
        ctx.save(); ctx.translate(x, sliderY + 6);
        ctx.rotate(dragging ? clamp((pointerX - 240) * .004, -.16, .16) : .035);
        round(-6, 0, 12, 24, 4, '#c3cbc1', '#78929a');
        round(-3, 7, 6, 11, 2, '#355663');
        line(-4, 3, -4, 20, '#f7f0df', 1.2);
        ctx.restore();
        if ((phase === 0 || phase === 2) && !dragging) {
          ctx.beginPath(); ctx.arc(240, sliderY + 17, 21 + Math.sin(time * 3) * 1, 0, Math.PI * 2);
          ctx.strokeStyle = '#ecce926d'; ctx.lineWidth = 1.3; ctx.stroke();
        }
        if (phase >= 3) {
          line(228, sliderY - 7, 220, sliderY - 13, '#f3bf88', 1.6);
          line(252, sliderY - 7, 260, sliderY - 14, '#f3bf88', 1.6);
          line(255, sliderY + 10, 266, sliderY + 12, '#f3bf88', 1.6);
        }
      }

      return {
        down(p) {
          if ((phase === 0 || phase === 2 || phase === 3) && Math.hypot(p.x - 240, p.y - sliderY - 17) < 28) {
            dragging = true; grabY = p.y - sliderY; pointerX = p.x;
            reverseStart = p.y; baseWedge = wedge; targetWedge = wedge;
            api.tone(460, .035, .015);
          }
        },
        move(p) {
          if (!dragging || p.x < 177 || p.x > 303) return;
          pointerX = p.x;
          if (phase === 0) {
            sliderY = clamp(p.y - grabY, catchY, startY);
            if (sliderY <= catchY + 1.5) {
              sliderY = catchY; phase = 1; dragging = false;
              api.say('Almost at your chin. The lining just went into the zipper.');
              api.tone(210, .13, .025);
            }
          } else if (phase === 2 || phase === 3) {
            const down = p.y - reverseStart;
            if (down > 6) {
              phase = 3; targetWedge = clamp(baseWedge + (down - 6) / 76, wedge, 1);
              api.say('Pulling backward… is feeding even more fabric into it.');
            }
          }
        },
        up() { dragging = false; targetWedge = wedge; },
        cancel() { dragging = false; targetWedge = wedge; },
        update(dt) {
          time += dt;
          if (phase === 1) {
            catchProgress = Math.min(1, catchProgress + dt / .7);
            if (catchProgress >= 1) { phase = 2; api.say('Caught. Release, then try pulling the metal tab back down.'); }
          } else if (phase === 3 && dragging) {
            wedge = Math.min(targetWedge, wedge + dt * 1.05);
            sliderY = catchY + wedge * 4;
            if (wedge >= 1) {
              phase = 4; dragging = false;
              api.say('Four millimeters backward. A whole lot more stuck.'); api.tone(145, .15, .03);
            }
          } else if (phase === 4) {
            settle += dt;
            if (settle > .55 && !finished) { phase = 5; finished = true; api.done(); }
          }
        },
        draw() {
          const bg = ctx.createLinearGradient(0, 0, 480, 270); bg.addColorStop(0, '#2a3341'); bg.addColorStop(1, '#1a2a38');
          rect(0, 0, 480, 270, bg);
          round(16, 19, 84, 180, 9, '#364450');
          round(23, 26, 70, 166, 5, '#263845');
          line(26, 30, 86, 83, '#52647150', 2);
          line(26, 46, 66, 81, '#52647130', 4);
          round(375, 22, 87, 47, 8, '#172b38');
          text(phase === 0 ? 'ZIP UP' : phase < 3 ? 'CAUGHT' : 'TIGHTER.', 419, 50, 11, '#e7ccaa');
          jacket(); opening(); collar(); caughtFabric(); slider();
          if (phase === 0) {
            line(50, 156, 50, 116, '#bcd1c0', 2);
            line(43, 124, 50, 115, '#bcd1c0', 2); line(57, 124, 50, 115, '#bcd1c0', 2);
          } else if (phase === 2 || phase === 3) {
            line(50, 118, 50, 158, '#e2c495', 2);
            line(43, 150, 50, 159, '#e2c495', 2); line(57, 150, 50, 159, '#e2c495', 2);
            text('BACK', 50, 178, 8, '#e2c495');
          }
          if (phase >= 3) {
            round(363, 90, 104, 50, 8, '#1c303c', '#49626a');
            text('MORE FABRIC.', 415, 110, 9, '#e9bd96');
            text('LESS ZIP.', 415, 127, 9, '#e9bd96');
          }
          rect(0, 257, 480, 13, '#192c39');
          text(phase === 0 ? 'Almost warm enough.' : phase < 3 ? 'A tiny bite of lining.' : 'The reverse pull made the bite bigger.', 240, 267, 8, '#d9c5a4');
        },
        debug() {
          return {
            phase, dragging, sliderY, pull: { x: 240, y: sliderY + 17 },
            zipProgress: (startY - sliderY) / (startY - catchY),
            caught: phase >= 1, catchProgress, wedge,
            fabricThickness: phase === 0 ? 0 : catchProgress * (1 + wedge * 2.4),
            reverseSliderTravel: Math.max(0, sliderY - catchY),
            finished,
          };
        },
      };
    },
  });
})();
