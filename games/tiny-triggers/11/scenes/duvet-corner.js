(function () {
  'use strict';
  TinyV5.register({
    id: 'duvet-corner', title: 'The Missing Duvet Corner', chapter: 'home',
    description: 'Pull the duvet into its cover, shake it straight, and rescue the last corner.',
    hint: 'Drag the ivory duvet upward into the open seam. Grab the bottom of the cover and shake right–left–right–left. Drag the middle lump into the lower-right corner.',
    verdict: 'Four corners. A strict three-corner occupancy limit.',
    create(api) {
      const { ctx } = api;
      let phase = 'insert', insertion = 0, insertionTarget = 0, shakes = 0, settled = 0;
      let fix = 0, slip = 0, elapsed = 0, jiggle = 0, gesture = null, start = null, anchor = 0, direction = 0;
      const lump = { x: 267, y: 147 }, corner = { x: 343, y: 211 };
      function path(points, fill, stroke, width = 1) {
        ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
      }
      function curve(points, color, width = 2) {
        ctx.beginPath(); ctx.moveTo(points[0], points[1]); ctx.bezierCurveTo(...points.slice(2)); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      }
      function fold(x, y, flipX, flipY, amount = 1) {
        ctx.save(); ctx.translate(x, y); ctx.scale(flipX, flipY); ctx.globalAlpha = amount;
        path([[0, 0], [35, 5], [29, 27], [7, 35]], '#bee2d9');
        path([[0, 0], [10, 20], [28, 30], [7, 35]], '#78b2ad');
        api.line(5, 6, 23, 24, '#d5e9df', 2);
        ctx.restore();
      }
      function stuffedLump(x, y, size, opposite = false) {
        ctx.save(); ctx.translate(x, y);
        api.ellipse(2, 9, size + 3, size * 0.6, '#3a777777');
        api.ellipse(0, 0, size, size * 0.7, '#b3d4cd');
        api.ellipse(-4, -5, size * 0.78, size * 0.46, '#e1e7d9');
        curve([-size + 4, 7, -size * 0.5, -8, size * 0.5, -7, size - 2, 9], '#5a9997', 3);
        curve([-size * 0.5, 10, -size * 0.5, -17, 12, -14, size * 0.4, 6], '#92bdb5', 2);
        curve([-size, 0, -size - 13, -7, -size - 11, 15, -size - 21, 12], '#5c9997', 2);
        if (!opposite) {
          api.round(-8, -8, 17, 8, 2, '#f6efdb');
          api.line(-4, -4, 5, -4, '#bab8a5', 1);
        }
        ctx.restore();
      }
      function drawCover() {
        const full = phase === 'insert' ? 0 : phase === 'shake' ? Math.min(3, shakes) : 3;
        const missingInset = (1 - fix) * (phase === 'insert' ? 0 : 23);
        // The two fabric edges enclose an actual open mouth at the foot.
        api.round(115, 69, 250, 156, 7, '#3e7a80', '#90c2bc');
        api.ellipse(240, 221, 120, 10, '#234b58');
        const tailY = 216 - insertion * 94;
        if (phase === 'insert') {
          const wave = Math.sin(insertion * 5) * 3;
          path([[145, tailY], [332, tailY + 3], [339, tailY + 49], [327, tailY + 63], [303, tailY + 66 + wave], [280, tailY + 60], [252, tailY + 68], [224, tailY + 62], [193, tailY + 67], [149, tailY + 57]], '#f1efdf', '#c8c8b8');
          curve([158, tailY + 30, 191, tailY + 47, 211, tailY + 18, 241, tailY + 40], '#d8d7c7', 2);
          curve([247, tailY + 45, 276, tailY + 25, 302, tailY + 51, 329, tailY + 38], '#d8d7c7', 2);
          api.round(229, tailY + 48, 22, 9, 2, '#b4c6c1');
        }
        // The front cover, sewn on three sides, masks the duvet as it goes in.
        const plate = ctx.createLinearGradient(120, 75, 350, 220);
        plate.addColorStop(0, '#89bbb5'); plate.addColorStop(0.55, '#6ba6a5'); plate.addColorStop(1, '#4d898e');
        const tl = slip * 17;
        path([[119 + tl, 76 + tl], [150, 70], [352, 74], [361, 90], [357, 191], [350 - missingInset, 214 - missingInset], [318, 219], [127, 215], [116, 200]], plate, '#b4d2c9', 1.3);
        ctx.save();
        ctx.setLineDash([3, 4]);
        path([[127 + tl, 82 + tl], [151, 78], [346, 82], [351, 92], [348, 190], [343 - missingInset, 208 - missingInset], [318, 211], [134, 207], [124, 195]], null, '#c2d7c8', 0.8);
        ctx.setLineDash([]); ctx.restore();
        // Long folds, distinct from an elastic fitted sheet or mattress corner.
        curve([144, 100, 177, 123, 176, 171, 144, 201], '#4c8b8c', 2);
        curve([193, 85, 174, 113, 204, 129, 184, 147], '#99c1b8', 2);
        curve([320, 91, 290, 113, 311, 147, 332, 166], '#91bcb5', 2);
        curve([173, 193, 197, 174, 228, 205, 253, 192], '#8fbcb3', 2);
        if (full >= 1) fold(127 + slip * 49, 84 + slip * 38, 1, 1, 1 - slip * 0.65);
        if (full >= 2) fold(349, 84, -1, 1);
        if (full >= 3) fold(131, 207, 1, -1);
        if (fix > 0.04) fold(345, 209, -1, -1, fix);
        if (phase !== 'insert' && fix < 0.99) {
          // The empty sewn pocket stays at the corner, while its stuffing is here.
          path([[326, 185], [356, 190], [355, 217], [326, 215]], '#4c858a', '#9abdb8');
          api.line(329, 213, 350, 194, '#355e6e', 2);
          const lx = lump.x + (corner.x - lump.x) * fix;
          const ly = lump.y + (corner.y - lump.y) * fix;
          stuffedLump(lx, ly, 28 - fix * 12);
        }
        if (slip > 0) {
          // The opposite corner of the insert visibly slides back into the cover.
          api.poly([[125, 82], [157, 83], [132, 113]], '#477d83');
          curve([133, 87, 150, 100, 176, 101, 190, 123], '#d0e0d4', 2);
          stuffedLump(139 + slip * 65, 94 + slip * 32, 10 + slip * 13, true);
        }
        // Open double hem and three little fabric ties along the bottom edge.
        curve([124, 217, 176, 228, 294, 217, 355, 218], '#bdd4c8', 3);
        for (const tx of [172, 240, 306]) {
          api.line(tx, 220, tx - 3, 229, '#b1ccc1', 2);
          api.line(tx + 6, 220, tx + 8, 229, '#87b4aa', 2);
        }
      }
      return {
        draw() {
          api.bg('bedroom');
          api.round(91, 35, 298, 212, 15, '#15222e');
          api.round(98, 29, 284, 210, 13, '#6d696a');
          api.round(105, 35, 270, 198, 10, '#c9c1ad');
          api.round(116, 39, 112, 42, 12, '#ddd6c4');
          api.round(252, 39, 112, 42, 12, '#ddd6c4');
          curve([127, 49, 152, 42, 198, 43, 217, 49], '#b7ae9d', 1);
          curve([263, 49, 287, 42, 334, 43, 353, 49], '#b7ae9d', 1);
          ctx.save();
          ctx.translate(jiggle, Math.abs(jiggle) * -0.13);
          ctx.translate(240, 155); ctx.rotate(jiggle * 0.0015); ctx.translate(-240, -155);
          drawCover();
          ctx.restore();
          if (phase === 'insert') {
            api.text('PULL UP', 50, 155, 9, '#c4d1cd');
            api.line(51, 201, 51, 169, '#bdd5cc', 2);
            api.line(51, 169, 46, 175, '#bdd5cc', 2); api.line(51, 169, 56, 175, '#bdd5cc', 2);
          } else if (phase === 'shake') {
            api.text('SHAKE SIDE TO SIDE', 240, 257, 9, '#d0ddd4');
            api.line(187, 241, 293, 241, '#afc8c0', 1.5);
            api.line(187, 241, 193, 237, '#afc8c0', 1.5); api.line(187, 241, 193, 245, '#afc8c0', 1.5);
            api.line(293, 241, 287, 237, '#afc8c0', 1.5); api.line(293, 241, 287, 245, '#afc8c0', 1.5);
          } else if (phase === 'fix') {
            api.text('ONE CORNER IS STILL IN HERE.', 240, 257, 8.6, '#d0ddd4');
            ctx.save(); ctx.setLineDash([3, 5]);
            api.line(286, 162, 325, 195, '#dce2bd', 1.5); ctx.restore();
            api.line(325, 195, 317, 192, '#dce2bd', 1.5); api.line(325, 195, 323, 186, '#dce2bd', 1.5);
          } else if (phase === 'done') {
            api.text('NOW THE OTHER CORNER.', 240, 257, 9, '#d0ddd4');
          }
        },
        down(p) {
          if (phase === 'insert' && api.hit(p, 240, 241 - insertion * 94, 192, 48)) { gesture = 'insert'; start = { x: p.x, y: p.y, amount: insertion }; }
          else if (phase === 'shake' && api.hit(p, 240, 211, 246, 52)) { gesture = 'shake'; anchor = p.x; }
          else if (phase === 'fix' && api.near(p, lump.x + (corner.x - lump.x) * fix, lump.y + (corner.y - lump.y) * fix, 36)) { gesture = 'fix'; start = p; }
        },
        move(p) {
          if (gesture === 'insert') insertionTarget = api.clamp(start.amount + (start.y - p.y) / 110, 0, 1);
          if (gesture === 'shake') {
            const distance = p.x - anchor;
            jiggle = api.clamp(distance * 0.17, -12, 12);
            if (Math.abs(distance) >= 48 && (!direction || Math.sign(distance) !== direction)) {
              direction = Math.sign(distance); anchor = p.x; shakes++; api.tone(210 + shakes * 35, 0.045, 0.012);
              if (shakes >= 4) { phase = 'settling'; settled = 0; gesture = null; api.say('Three corners are full. The last one is bunched in the middle.'); }
            }
          }
          if (gesture === 'fix') {
            const dx = corner.x - lump.x, dy = corner.y - lump.y;
            fix = api.clamp(((p.x - start.x) * dx + (p.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
          }
        },
        up(p) {
          if (gesture === 'insert' && insertionTarget < 0.94) insertionTarget = 0;
          else if (gesture === 'insert') insertionTarget = 1;
          if (gesture === 'fix') {
            if (fix > 0.85 && api.near(p, corner.x, corner.y, 30)) {
              fix = 1; phase = 'slipping'; elapsed = 0; api.say('There. All four—'); api.tone(600, 0.07, 0.016);
            } else fix = 0;
          }
          gesture = null;
        },
        cancel() { if (gesture === 'insert') insertionTarget = insertion; if (gesture === 'fix') fix = 0; gesture = null; },
        update(dt) {
          if (phase === 'insert') {
            insertion += api.clamp(insertionTarget - insertion, -dt * 2, dt * 2);
            if (insertion > 0.999 && gesture === null) { insertion = 1; phase = 'shake'; api.say('Grab the open hem and shake right, left, right, left.'); }
          }
          if (gesture !== 'shake') jiggle *= Math.max(0, 1 - dt * 12);
          if (phase === 'settling') { settled += dt; if (settled >= 0.45) phase = 'fix'; }
          if (phase === 'slipping') {
            elapsed += dt;
            slip = api.clamp((elapsed - 0.4) / 1.05, 0, 1);
            if (elapsed >= 1.7) { phase = 'done'; api.say('That corner is in. The opposite one slipped out.'); api.done(); }
          }
        },
        debug() {
          return { phase, insertion, shakes, fix, slip, dragging: gesture, alignedCorners: phase === 'insert' ? 0 : phase === 'shake' ? Math.min(3, shakes) : phase === 'slipping' && slip === 0 ? 4 : 3, oppositeSlipped: slip >= 1, coverOpening: true };
        },
      };
    },
  });
})();
