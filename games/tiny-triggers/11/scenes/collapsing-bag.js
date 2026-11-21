(() => {
  'use strict';

  TinyV5.register({
    id: 'collapsing-bag',
    title: 'The Collapsing Bin Bag',
    chapter: 'home',
    description: 'Fresh liner. Drop the rubbish right into the opening.',
    hint: 'Drag the crumpled wrapper from the little table into the middle of the bin opening, then release it.',
    verdict: 'Perfect aim. Wrong side of the bag.',
    create(api) {
      const { ctx } = api;
      let phase = 'ready';
      let paperX = 96;
      let paperY = 134;
      let paperAngle = -0.15;
      let gesture = null;
      let released = { x: 283, y: 110 };
      let elapsed = 0;
      let collapse = 0;
      let correctDrop = false;
      let completed = false;
      let time = 0;

      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      const insideOpening = (x, y) => Math.pow((x - 283) / 60, 2) + Math.pow((y - 110) / 19, 2) <= 1;
      function line(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function rubbish() {
        ctx.save();
        ctx.translate(paperX, paperY);
        ctx.rotate(paperAngle);
        api.poly([[-21, -10], [-13, -17], [-2, -13], [8, -18], [20, -7], [16, 2], [22, 12], [7, 18], [-7, 13], [-19, 17], [-23, 3]], '#e9dfc0');
        api.poly([[-21, -10], [-8, -6], [-7, 13], [-19, 17], [-23, 3]], '#c2baa4');
        api.poly([[-13, -17], [-2, -13], [-8, -6], [-21, -10]], '#fff0d0');
        api.poly([[-17, -6], [-4, -9], [17, -3], [13, 7], [0, 4], [-13, 9]], '#b36b51');
        api.poly([[8, -18], [6, -7], [17, -3], [20, -7]], '#f7edcc');
        api.poly([[0, 4], [7, 18], [22, 12], [13, 7]], '#f8edce');
        line([[-13, -14], [-8, -6], [-10, 6], [-7, 13]], '#a99f8e', 1);
        line([[8, -16], [6, -7], [12, 0], [0, 4], [7, 15]], '#a79e88', 1);
        line([[-16, 13], [-10, 6], [-1, 9]], '#faf0d2', 1);
        line([[0, -5], [8, -2]], '#efd3ac', 2);
        ctx.restore();
      }

      function liner() {
        const x = 283 - 36 * collapse;
        const y = 113 + 70 * collapse;
        const rx = 78 - 29 * collapse;
        const ry = 23 - 8 * collapse;
        const bottomX = 283 - 30 * collapse;
        const bottomRX = 68 - 24 * collapse;
        const uneven = Math.sin(collapse * Math.PI) * 13;
        ctx.beginPath();
        ctx.moveTo(x - rx, y);
        ctx.bezierCurveTo(x - rx + 5, y + 40, bottomX - bottomRX - 4, 210, bottomX - bottomRX + 7, 227);
        ctx.bezierCurveTo(bottomX - 20, 240, bottomX + bottomRX, 237, bottomX + bottomRX, 226);
        ctx.bezierCurveTo(bottomX + bottomRX + 7, 198, x + rx - 2, y + 40, x + rx, y + uneven);
        ctx.closePath();
        const plastic = ctx.createLinearGradient(x - rx, 0, x + rx, 0);
        plastic.addColorStop(0, '#264e4e');
        plastic.addColorStop(0.28, '#567b6a');
        plastic.addColorStop(0.57, '#41655c');
        plastic.addColorStop(1, '#163b42');
        ctx.fillStyle = plastic;
        ctx.fill();
        ctx.save();
        ctx.clip();
        for (let i = 0; i < 7; i++) {
          const topX = x - rx + i * rx / 3;
          const bottom = bottomX - bottomRX + i * bottomRX / 3;
          line([[topX, y + 7], [topX + (i % 2 ? 7 : -6) + collapse * 8, y + (228 - y) * 0.5], [bottom, 228]], i % 2 ? '#97baa03c' : '#102f3a70', 1.4);
        }
        if (collapse > 0) {
          line([[x - 30, y + 13], [x + 15, y + 29], [x - 7, 219], [x + 37, 227]], '#8ba89266', 1.8);
          line([[x + rx - 4, y + 11], [x + 16, y + 34], [x + rx - 6, 215]], '#0f303c80', 2);
        }
        ctx.restore();
        api.ellipse(x, y, rx, ry, '#142e35');
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(collapse * -0.06);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx + 6, ry + 5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#80a092';
        ctx.lineWidth = 8 - collapse * 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(-1, -1, rx + 5, ry + 4, 0, Math.PI * 1.06, Math.PI * 1.96);
        ctx.strokeStyle = '#b1c4a8';
        ctx.lineWidth = 2;
        ctx.stroke();
        // The excess plastic really folds over the rim before slipping inward.
        api.poly([[rx - 12, 8], [rx + 8, 4], [rx + 8, 24 + uneven], [rx - 3, 18 + uneven]], '#698e7c');
        line([[rx + 5, 7], [rx + 4, 21 + uneven], [rx - 2, 16 + uneven]], '#acc0a1', 1.3);
        api.poly([[-rx - 7, 5], [-rx + 6, 11], [-rx + 4, 27], [-rx - 5, 23]], '#749683');
        line([[-rx - 3, 10], [-rx, 24]], '#aec2a46b', 1.2);
        ctx.restore();
      }

      function bin() {
        api.ellipse(283, 245, 100, 12, '#101e286e');
        const metal = ctx.createLinearGradient(192, 0, 374, 0);
        metal.addColorStop(0, '#739193');
        metal.addColorStop(0.28, '#a2b5ad');
        metal.addColorStop(0.74, '#68888a');
        metal.addColorStop(1, '#385c66');
        ctx.beginPath();
        ctx.moveTo(192, 115);
        ctx.lineTo(192, 219);
        ctx.bezierCurveTo(192, 253, 374, 253, 374, 219);
        ctx.lineTo(374, 115);
        ctx.closePath();
        ctx.fillStyle = metal;
        ctx.fill();
        api.ellipse(283, 115, 91, 32, '#b3c4b3');
        api.ellipse(283, 113, 85, 26, '#2f4c54');
        // A readable cutaway keeps bag and surrounding bin as distinct objects.
        ctx.beginPath();
        ctx.moveTo(204, 122);
        ctx.lineTo(204, 216);
        ctx.bezierCurveTo(207, 239, 360, 239, 361, 216);
        ctx.lineTo(361, 122);
        ctx.closePath();
        ctx.fillStyle = '#294850';
        ctx.fill();
        api.ellipse(283, 222, 77, 15, '#58736e');
        liner();
        if (phase !== 'ready') rubbish();
        // Pale side walls and a low front rail communicate the bin's shell.
        const alpha = 0.12 - collapse * 0.07;
        ctx.save();
        ctx.globalAlpha = alpha;
        api.round(204, 147, 156, 73, 3, '#dce9d2');
        ctx.restore();
        line([[197, 138], [197, 218], [201, 228]], '#c3cfba66', 2);
        line([[368, 138], [368, 219], [364, 228]], '#244955', 3);
        ctx.beginPath();
        ctx.ellipse(283, 219, 88, 26, 0, 0.05, Math.PI - 0.05);
        ctx.strokeStyle = '#8ba4a0';
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(283, 115, 90, 32, 0, 0.08, Math.PI - 0.08);
        ctx.strokeStyle = '#b6c9b577';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#293b46');
        for (let x = 32; x < 480; x += 64) api.line(x, 0, x, 226, '#778d8a0d', 1);
        api.rect(0, 230, 480, 40, '#28323d');
        api.rect(0, 225, 480, 6, '#687473');
        api.line(0, 226, 480, 226, '#a0a28a', 1);
        api.round(32, 150, 120, 8, 3, '#b2956c');
        api.rect(41, 158, 7, 71, '#776c58');
        api.rect(137, 158, 7, 71, '#776c58');
        api.line(47, 214, 137, 214, '#8d7d61', 4);
        api.ellipse(96, 152, 29, 5, '#63574844');
        api.round(43, 58, 74, 48, 3, '#b8b49a');
        api.rect(48, 63, 64, 38, '#50726d');
        api.poly([[51, 96], [68, 73], [82, 90], [99, 76], [109, 97]], '#a5b198');
        api.ellipse(95, 71, 4, 4, '#e7c77e');
        bin();
        if (phase === 'ready') {
          if (gesture) {
            const valid = insideOpening(paperX, paperY);
            ctx.beginPath();
            ctx.ellipse(283, 110, 60, 19, 0, 0, Math.PI * 2);
            ctx.strokeStyle = valid ? '#d1e6aa' : '#d9d7ab66';
            ctx.lineWidth = 2;
            ctx.setLineDash(valid ? [] : [4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            if (valid) line([[351, 84], [357, 90], [368, 76]], '#d1e6aa', 2.5);
          }
          rubbish();
          if (!gesture) {
            line([[132, 113], [167, 104], [187, 104]], '#efe4bc', 1.8);
            line([[181, 99], [187, 104], [181, 109]], '#efe4bc', 1.8);
            api.text('FRESH LINER.', 94, 186, 9, '#c9d1ba');
            api.text('RIGHT IN THE MIDDLE.', 104, 199, 8, '#b2bfae');
          }
        }
        if (phase === 'complete') {
          line([[348, 202], [390, 188], [427, 188]], '#d5bb8e99', 1);
          api.text('OUTSIDE', 410, 174, 8, '#ead6aa');
          api.text('THE BAG.', 410, 184, 8, '#ead6aa');
        }
      }

      function resetPaper() {
        paperX = 96;
        paperY = 134;
        paperAngle = -0.15;
        gesture = null;
      }

      return {
        draw,
        down(p) {
          if (phase === 'ready' && api.near(p, paperX, paperY, 30)) {
            gesture = { dx: p.x - paperX, dy: p.y - paperY, startX: p.x, startY: p.y };
          }
        },
        move(p) {
          if (!gesture || phase !== 'ready') return;
          paperX = api.clamp(p.x - gesture.dx, 24, 456);
          paperY = api.clamp(p.y - gesture.dy, 25, 239);
          paperAngle = -0.15 + (paperX - 96) * 0.001;
        },
        up() {
          if (!gesture || phase !== 'ready') return;
          const moved = Math.hypot(paperX - 96, paperY - 134) > 20;
          if (moved && insideOpening(paperX, paperY)) {
            released = { x: paperX, y: paperY };
            correctDrop = true;
            phase = 'dropping';
            elapsed = 0;
            gesture = null;
            api.say('Right in the middle. Perfect.');
          } else {
            resetPaper();
            api.say('Aim into the open middle of the liner.');
          }
        },
        cancel() { if (phase === 'ready') resetPaper(); },
        update(dt) {
          time += dt;
          if (phase === 'ready' || phase === 'complete') return;
          elapsed += dt;
          if (phase === 'dropping') {
            const p = smooth(elapsed / 0.28);
            paperX = released.x + (283 - released.x) * p;
            paperY = released.y + (135 - released.y) * p;
            paperAngle = p * 0.15;
            if (elapsed >= 0.28) {
              phase = 'slipping';
              elapsed = 0;
              api.tone(280, 0.15, 0.016);
              api.say('The liner had other plans.');
            }
          } else if (phase === 'slipping') {
            collapse = smooth(elapsed / 1.05);
            paperX = 283 + 49 * collapse;
            paperY = 135 + 62 * collapse;
            paperAngle = 0.15 + collapse * 1.1;
            if (elapsed >= 1.05) {
              collapse = 1;
              phase = 'settling';
              elapsed = 0;
            }
          } else {
            const p = smooth(elapsed / 0.38);
            paperY = 197 + p * 13;
            paperX = 332 + Math.sin(elapsed * 20) * Math.exp(-elapsed * 7) * 2;
            paperAngle = 1.25 + p * 0.12;
            if (elapsed >= 0.58) {
              phase = 'complete';
              paperX = 332;
              paperY = 210;
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          return {
            phase, paperX, paperY, dragging: !!gesture,
            candidateCorrect: phase === 'ready' && insideOpening(paperX, paperY),
            correctDrop, rimSeated: collapse === 0, rimCollapse: collapse,
            linerRightEdge: 361 - 65 * collapse,
            rubbishInGap: ['settling', 'complete'].includes(phase),
            completed,
          };
        },
      };
    },
  });
})();
