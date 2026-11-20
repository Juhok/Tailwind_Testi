(function () {
  'use strict';
  TinyV5.register({
    id: 'wet-sock', title: 'The Wet Sock', chapter: 'home',
    description: 'Take a fresh-socked step into the kitchen.',
    hint: 'Drag the front white sock to move your foot, then release to plant it. The one little puddle is near the upper-right tiles.',
    verdict: 'An entire dry kitchen. You found the exception.',
    create(api) {
      const { ctx } = api;
      const puddle = { x: 316, y: 135, rx: 16, ry: 9 }, rotation = 0.47;
      let phase = 'walking', foot = { x: 126, y: 205 }, dragging = false, start = null, moved = 0, steps = 0;
      let wet = 0, elapsed = 0, clock = 0, lift = 0;
      const toe = () => ({ x: foot.x + Math.sin(rotation) * 30, y: foot.y - Math.cos(rotation) * 30 });
      function sockPath() {
        ctx.beginPath(); ctx.moveTo(-16, 35);
        ctx.bezierCurveTo(-24, 22, -17, 7, -19, -12);
        ctx.bezierCurveTo(-23, -29, -11, -43, 3, -43);
        ctx.bezierCurveTo(17, -43, 23, -30, 21, -14);
        ctx.bezierCurveTo(20, 0, 11, 12, 17, 35);
        ctx.closePath();
      }
      function stainPath(progress, extra = 0) {
        const points = [], rx = 3 + progress * 22 + extra, ry = 4 + progress * 42 + extra;
        const cy = -29 + progress * 9;
        for (let i = 0; i < 18; i++) {
          const a = i * Math.PI * 2 / 18;
          const irregular = 1 + Math.sin(i * 2.3) * 0.1 + Math.cos(i * 4.7) * 0.05;
          points.push([Math.cos(a) * rx * irregular, cy + Math.sin(a) * ry * irregular]);
        }
        ctx.beginPath();
        ctx.moveTo((points[17][0] + points[0][0]) / 2, (points[17][1] + points[0][1]) / 2);
        for (let i = 0; i < points.length; i++) {
          const next = points[(i + 1) % points.length];
          ctx.quadraticCurveTo(points[i][0], points[i][1], (points[i][0] + next[0]) / 2, (points[i][1] + next[1]) / 2);
        }
        ctx.closePath();
      }
      function drawSock(cx, cy, angle, active) {
        ctx.save(); ctx.translate(cx + 3, cy + 5); ctx.rotate(angle); sockPath();
        ctx.fillStyle = active && dragging ? '#1d2c334f' : '#1d2c337a'; ctx.fill(); ctx.restore();
        ctx.save();
        const recoil = active && phase === 'wicking' && elapsed < 0.4 ? Math.sin(elapsed * 35) * (0.4 - elapsed) * 5 : 0;
        ctx.translate(cx + recoil, cy - (active ? lift : 0)); ctx.rotate(angle);
        // Trouser cuff joins the sock at the ankle, keeping this recognizably
        // a worn sock and a step rather than a cloth dragged across the floor.
        api.round(-18, 31, 36, 55, 4, active ? '#5d7186' : '#566a7f');
        api.line(-10, 42, -10, 84, '#8190a0', 1);
        sockPath(); ctx.fillStyle = '#f0eee0'; ctx.fill(); ctx.strokeStyle = '#c9cfca'; ctx.lineWidth = 1.3; ctx.stroke();
        ctx.save(); sockPath(); ctx.clip();
        api.ellipse(-16, 2, 6, 36, '#d8ddd3');
        api.ellipse(17, -8, 4, 22, '#e0e3d8');
        if (active && wet > 0) {
          stainPath(wet, 2); ctx.fillStyle = '#8da5a58c'; ctx.fill();
          stainPath(wet); ctx.fillStyle = '#708b94'; ctx.fill();
          ctx.save(); stainPath(wet); ctx.clip();
          for (let i = 0; i < 34; i++) {
            const x = -17 + (i * 13) % 33, y = -39 + (i * 17) % 62;
            api.line(x, y, x + 2.5, y + 0.6, i % 2 ? '#a3b5b391' : '#566f7c80', 0.8);
          }
          ctx.restore();
        }
        // Cotton knit and toe seam remain visible through the wet fabric.
        ctx.beginPath(); ctx.moveTo(-16, -25); ctx.quadraticCurveTo(0, -20, 18, -25);
        ctx.strokeStyle = active && wet > 0.3 ? '#566f7b' : '#d1d6cb'; ctx.lineWidth = 1; ctx.stroke();
        for (let i = 0; i < 7; i++) api.line(-14 + i * 4.5, 20, -14 + i * 4.5, 34, '#bfc9c1', 0.8);
        api.line(-16, 20, 16, 20, '#d4dbd0', 1);
        ctx.restore();
        ctx.restore();
      }
      function drawFloor() {
        api.bg('kitchen');
        api.rect(0, 56, 480, 214, '#737c77');
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 6; col++) {
            api.rect(col * 85 - (row % 2) * 42, 62 + row * 48, 83, 46, (row + col) % 2 ? '#7a827c' : '#808780');
          }
        }
        // Cabinet fronts and plinth establish the kitchen entrance.
        api.rect(0, 0, 480, 54, '#4c6267');
        for (let x = 10; x < 480; x += 116) {
          api.round(x, -12, 105, 57, 3, '#6c8282', '#82938c');
          api.round(x + 42, 11, 28, 4, 2, '#b8bfad');
        }
        api.rect(0, 49, 480, 10, '#263e47');
        api.line(0, 59, 480, 59, '#a2aaa0', 1);
        // A doorway threshold, not a cleaning tool or a floor-wide spill.
        api.poly([[0, 238], [82, 238], [121, 270], [0, 270]], '#46484b');
        api.line(0, 238, 82, 238, '#c2b79a', 3);
      }
      function drawPuddle() {
        const x = puddle.x, y = puddle.y;
        ctx.beginPath(); ctx.moveTo(x - 16, y);
        ctx.bezierCurveTo(x - 19, y - 7, x - 6, y - 7, x - 2, y - 9);
        ctx.bezierCurveTo(x + 6, y - 11, x + 8, y - 4, x + 15, y - 2);
        ctx.bezierCurveTo(x + 21, y + 5, x + 8, y + 10, x - 1, y + 8);
        ctx.bezierCurveTo(x - 10, y + 10, x - 17, y + 6, x - 16, y);
        ctx.closePath(); ctx.fillStyle = '#497b8794'; ctx.fill(); ctx.strokeStyle = '#a6ced0'; ctx.lineWidth = 0.9; ctx.stroke();
        api.line(x - 9, y - 3, x - 2, y - 5, '#dfefdf', 1.3);
        const glint = 0.5 + 0.5 * Math.sin(clock * 1.5) ** 2;
        ctx.globalAlpha = glint;
        api.line(x + 7, y - 4, x + 7, y, '#eff7e9', 1); api.line(x + 5, y - 2, x + 9, y - 2, '#eff7e9', 1);
        ctx.globalAlpha = 1;
        if (phase === 'wicking' && elapsed < 0.7) {
          ctx.globalAlpha = 1 - elapsed / 0.7;
          ctx.beginPath(); ctx.ellipse(x, y, 16 + elapsed * 18, 9 + elapsed * 10, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#c2dad3'; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }
      return {
        draw() {
          drawFloor(); drawPuddle();
          drawSock(76, 237, 0.24, false);
          drawSock(foot.x, foot.y, rotation, true);
          if (phase === 'walking') {
            api.text('FRESH SOCKS. JUST ONE STEP.', 253, 251, 9, '#e0e2d2');
          } else if (phase === 'wicking') {
            api.text('OH. COLD.', 225, 251, 9, '#f0ead3');
          } else {
            api.text('THE ONLY WET SPOT IN THE KITCHEN.', 253, 251, 8.5, '#e0e2d2');
          }
        },
        down(p) {
          if (phase !== 'walking' || !api.hit(p, foot.x, foot.y, 68, 98)) return;
          dragging = true; moved = 0; lift = 7;
          start = { x: p.x, y: p.y, fx: foot.x, fy: foot.y };
        },
        move(p) {
          if (!dragging) return;
          const next = { x: api.clamp(start.fx + p.x - start.x, 56, 415), y: api.clamp(start.fy + p.y - start.y, 115, 225) };
          moved += Math.hypot(next.x - foot.x, next.y - foot.y); foot = next;
        },
        up() {
          if (!dragging) return;
          dragging = false; lift = 0;
          if (moved < 7) return;
          steps++; api.tone(170, 0.04, 0.009);
          const t = toe();
          if (((t.x - puddle.x) / 22) ** 2 + ((t.y - puddle.y) / 17) ** 2 < 1) {
            phase = 'wicking'; elapsed = 0; wet = 0.025; api.say('Straight into the only tiny puddle.'); api.tone(330, 0.05, 0.015);
          }
        },
        cancel() { dragging = false; lift = 0; if (start && phase === 'walking') foot = { x: start.fx, y: start.fy }; },
        update(dt) {
          clock += dt;
          if (phase === 'wicking') {
            elapsed += dt;
            // A wet toe gradually wicks moisture through the knit toward the heel.
            wet = 0.025 + 0.975 * api.clamp(elapsed / 2.75, 0, 1) ** 0.8;
            if (elapsed >= 3.1) { wet = 1; phase = 'done'; api.say('Fresh sock. Entirely un-fresh feeling.'); api.done(); }
          }
        },
        debug() {
          return { phase, foot: { ...foot }, toe: toe(), dragging, lifted: lift > 0, steps, moved, wetProgress: wet, wetArea: wet * wet, puddleCount: 1, puddle: { ...puddle }, elapsed };
        },
      };
    },
  });
})();
