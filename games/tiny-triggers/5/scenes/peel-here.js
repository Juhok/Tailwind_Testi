(function () {
  'use strict';
  TinyV5.register({
    id: 'peel-here', title: '“Peel Here”', chapter: 'kitchen',
    description: 'Pull the marked corner to open your lunch.',
    hint: 'Grab PEEL HERE at the upper right and pull diagonally down and right. Release after a good long pull; a short pull can be resumed from the loose tab.',
    verdict: 'Congratulations. You have opened the outside of the outside.',
    create(api) {
      const { ctx } = api;
      let phase = 'ready', peel = 0, grip = false, start = null, elapsed = 0, detachStart = 0, drift = 0;
      const origin = { x: 355, y: 79 }, end = { x: 425, y: 215 };
      const handle = () => ({ x: origin.x + (end.x - origin.x) * peel, y: origin.y + (end.y - origin.y) * peel });
      function curve(points, color, width = 1) {
        ctx.beginPath(); ctx.moveTo(points[0], points[1]); ctx.bezierCurveTo(...points.slice(2)); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      }
      function filmEdge() {
        api.round(85, 78, 270, 132, 12, '#b6e0da16', '#dbeee2');
        api.round(89, 82, 262, 124, 10, '#ffffff03', '#b7d9d26b');
        ctx.save(); ctx.beginPath(); ctx.roundRect(86, 79, 268, 130, 11); ctx.clip();
        api.poly([[92, 83], [134, 82], [268, 210], [238, 210]], '#f5ffef2d');
        api.poly([[216, 79], [223, 79], [355, 176], [355, 184]], '#ffffff3b');
        api.line(98, 88, 336, 88, '#f5fff077', 1.3);
        api.line(343, 97, 343, 190, '#f5fff070', 1.3);
        ctx.restore();
      }
      function bowtie(x, y, rotation, color) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
        api.poly([[-12, -7], [-3, -3], [0, -1], [3, -3], [12, -7], [11, 6], [3, 3], [0, 1], [-4, 4], [-11, 7]], color);
        api.line(-7, -3, 7, 3, '#c79644', 0.8); api.line(-6, 3, 7, -3, '#ffdf8b', 0.8);
        ctx.restore();
      }
      function drawTray() {
        api.round(78, 76, 291, 157, 18, '#0b1a20');
        api.round(74, 67, 291, 158, 18, '#dfddc6', '#f3efd9');
        api.round(82, 75, 275, 142, 13, '#8f9990');
        api.round(88, 81, 170, 125, 10, '#594e36');
        api.round(263, 81, 86, 125, 10, '#46624a');
        api.round(93, 86, 160, 115, 9, '#a67f43');
        for (let i = 0; i < 27; i++) {
          const x = 106 + (i * 37) % 137, y = 98 + (i * 29) % 91;
          bowtie(x, y, (i % 5) * 0.37 - 0.5, i % 3 ? '#edc471' : '#f8d27b');
        }
        for (let i = 0; i < 18; i++) {
          const x = 274 + (i * 17) % 64, y = 93 + (i * 23) % 102;
          ctx.save(); ctx.translate(x, y); ctx.rotate(i * 0.7);
          api.ellipse(0, 0, 12, 6, i % 2 ? '#729967' : '#94ac72');
          api.line(-9, 0, 9, 0, '#496d50', 0.7); ctx.restore();
        }
        for (const [x, y] of [[286, 109], [326, 143], [290, 185], [169, 114], [218, 176]]) {
          api.ellipse(x, y, 9, 8, '#b75d45'); api.ellipse(x, y - 1, 6, 5, '#dd8460');
          api.ellipse(x - 2, y - 2, 1.2, 1, '#edc28a'); api.ellipse(x + 2, y + 1, 1.1, 1, '#edc28a');
        }
        for (let i = 0; i < 12; i++) api.ellipse(106 + (i * 43) % 141, 96 + (i * 19) % 99, 1.3, 1, '#527b4e');
        api.line(259, 85, 259, 202, '#dfdebf', 2.5);
        // This continuous lower membrane is never removed. Its highlights and
        // sealed perimeter survive the entire upper-laminate animation.
        filmEdge();
        api.round(154, 218, 127, 16, 3, '#f0edd7');
        api.text('FRESH PASTA + GREENS', 217.5, 229, 7, '#62736c');
      }
      function drawLaminate() {
        if (phase === 'done') return;
        const h = handle();
        const a = { x: 355 - 270 * peel, y: 79 };
        const b = peel < 0.45 ? { x: 355, y: 79 + peel / 0.45 * 131 } : { x: 355 - 270 * (peel - 0.45) / 0.55, y: 210 };
        if (peel < 1) {
          ctx.save(); ctx.beginPath(); ctx.roundRect(85, 78, 270, 132, 12); ctx.clip();
          ctx.beginPath(); ctx.moveTo(85, 79); ctx.lineTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          if (peel < 0.45) ctx.lineTo(355, 210);
          ctx.lineTo(85, 210); ctx.closePath(); ctx.fillStyle = '#ecfff017'; ctx.fill();
          ctx.restore();
        }
        ctx.save();
        ctx.translate(drift * 410, -drift * 164);
        ctx.globalAlpha = 1 - drift * 0.72;
        if (peel > 0.012) {
          // A flexible, transparent sheet bends over the moving peel front.
          // Curved top/bottom boundaries and the narrow rolled edge make this
          // a separate thin laminate, not an opaque lid or zipper strip.
          const sheen = ctx.createLinearGradient(a.x, a.y, h.x, h.y + 32);
          sheen.addColorStop(0, '#c9e9f177'); sheen.addColorStop(0.22, '#f4fffb26');
          sheen.addColorStop(0.65, '#b6dce844'); sheen.addColorStop(1, '#f5ffff8f');
          ctx.beginPath(); ctx.moveTo(a.x, a.y);
          ctx.bezierCurveTo(a.x + 28 * peel, a.y - 39 * peel, h.x - 40 * peel, h.y - 47 * peel, h.x, h.y);
          ctx.bezierCurveTo(h.x + 10 * peel, h.y + 24 * peel, h.x - 29 * peel, h.y + 43 * peel, h.x - 58 * peel, h.y + 32 * peel);
          ctx.bezierCurveTo(b.x + 38 * peel, b.y + 43 * peel, b.x - 23 * peel, b.y + 18 * peel, b.x, b.y);
          ctx.bezierCurveTo(b.x + 8 * peel, b.y - 20 * peel, a.x - 12 * peel, a.y + 34 * peel, a.x, a.y);
          ctx.closePath(); ctx.fillStyle = sheen; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = '#e3f6edb3'; ctx.stroke();
          curve([a.x, a.y, a.x - 12 * peel, a.y + 34 * peel, b.x + 8 * peel, b.y - 20 * peel, b.x, b.y], '#f4fff3c9', 3);
          curve([a.x + 15 * peel, a.y + 3, h.x - 68 * peel, h.y - 27 * peel, h.x - 52 * peel, h.y + 8 * peel, h.x - 18 * peel, h.y + 19 * peel], '#ffffff59', 2);
        }
        ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(peel * 0.52);
        api.poly([[-12, 3], [4, -23], [26, -13], [14, 7]], '#dceae3c7');
        api.round(-31, -25, 73, 18, 3, '#e9bd70', '#fff0c1');
        api.text('PEEL HERE', 5.5, -13, 8.3, '#5f5038');
        api.line(-6, -5, 1, 1, '#eaf5e8', 1.5);
        ctx.restore(); ctx.restore();
      }
      return {
        draw() {
          api.bg('kitchen');
          api.ellipse(224, 232, 156, 16, '#132328');
          drawTray(); drawLaminate();
          if (phase === 'ready') {
            api.text('GRAB THE MARKED CORNER.', 226, 40, 9, '#d2d9cd');
          } else if (phase === 'loose') {
            api.text('KEEP PULLING THE LOOSE TAB.', 226, 40, 8.7, '#d2d9cd');
          } else if (phase === 'detaching') {
            api.text('THAT IS… VERY THIN.', 226, 40, 9, '#d2d9cd');
          } else if (phase === 'done') {
            api.text('NO TAB LEFT. STILL SEALED.', 226, 40, 9, '#e4ddbc');
            // A final seal glint makes the intact film readable without labels.
            api.line(100, 89, 131, 89, '#fffde5', 1.8);
            api.line(343, 161, 343, 190, '#fffde5', 1.8);
          }
        },
        down(p) {
          if (phase !== 'ready' && phase !== 'loose') return;
          const h = handle();
          if (api.hit(p, h.x + 4, h.y - 7, 67, 48)) {
            grip = true; start = { x: p.x, y: p.y, peel }; phase = 'peeling';
          }
        },
        move(p) {
          if (!grip) return;
          const dx = end.x - origin.x, dy = end.y - origin.y;
          peel = api.clamp(start.peel + ((p.x - start.x) * dx + (p.y - start.y) * dy) / (dx * dx + dy * dy), 0, 1);
        },
        up() {
          if (!grip) return;
          grip = false;
          if (peel >= 0.67) {
            detachStart = peel; elapsed = 0; phase = 'detaching'; api.say('Only the thin outer layer is coming away…'); api.tone(450, 0.045, 0.014);
          } else {
            phase = peel > 0.025 ? 'loose' : 'ready';
            if (phase === 'ready') peel = 0;
          }
        },
        cancel() { grip = false; if (phase === 'peeling') phase = peel > 0.025 ? 'loose' : 'ready'; },
        update(dt) {
          if (phase !== 'detaching') return;
          elapsed += dt;
          const t = api.clamp(elapsed / 0.85, 0, 1);
          peel = detachStart + (1 - detachStart) * (t * t * (3 - 2 * t));
          drift = api.clamp((elapsed - 0.85) / 1.15, 0, 1);
          if (elapsed >= 2.12) { peel = 1; drift = 1; phase = 'done'; api.say('No tab left to grab. The real seal is untouched.'); api.done(); }
        },
        debug() {
          return { phase, peelProgress: peel, holding: grip, tabAvailable: phase !== 'done' && drift < 0.95, laminateRemoved: peel >= 1, actualSealIntact: true, lowerFilmVisible: true, detachDrift: drift, handle: handle() };
        },
      };
    },
  });
})();
