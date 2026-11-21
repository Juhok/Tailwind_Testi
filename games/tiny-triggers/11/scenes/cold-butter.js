(() => {
  'use strict';
  TinyV5.register({
    id: 'cold-butter',
    title: 'Cold Butter, Soft Bread',
    chapter: 'kitchen',
    description: 'Spread a little cold butter on this very soft slice of bread.',
    hint: 'Drag the knife blade onto the butter. Then grab the knife again, push it right, and keep holding the pressure. The bread gives before the butter does.',
    verdict: 'The butter held its shape. The bread did not.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const origin = { x: 369, y: 141 }, butterStart = { x: 212, y: 131 };
      let phase = 0, time = 0, knifeX = origin.x, knifeY = origin.y, dragging = false;
      let grabX = 0, grabY = 0, pushStart = 0, baseStrain = 0, targetStrain = 0;
      let strain = 0, settle = 0, finished = false, lastTone = 0;
      const holes = [[-1, -.3], [-.75, -.85], [-.4, -.76], [-.22, -1.1], [.05, -.82], [.31, -1.02], [.5, -.65], [.87, -.72], [1.06, -.22], [.88, .02], [1, .4], [.66, .53], [.44, .93], [.09, .77], [-.2, 1.03], [-.43, .7], [-.79, .82], [-.7, .4], [-1.05, .15]];
      const holeAmount = () => clamp((strain - .48) / .52, 0, 1);
      const butter = () => ({ x: butterStart.x + strain * 59, y: butterStart.y + strain * 6 });

      function breadOutline(inset = 0, dy = 0) {
        const sx = 1 - inset * .13, sy = 1 - inset * .11;
        const p = (x, y) => [215 + (x - 215) * sx, 139 + (y - 139) * sy + dy];
        ctx.moveTo(...p(142, 225));
        ctx.bezierCurveTo(...p(129, 225), ...p(126, 217), ...p(126, 205));
        ctx.lineTo(...p(113, 107));
        ctx.bezierCurveTo(...p(96, 93), ...p(104, 66), ...p(124, 58));
        ctx.bezierCurveTo(...p(148, 46), ...p(185, 51), ...p(212, 58));
        ctx.bezierCurveTo(...p(241, 48), ...p(278, 49), ...p(302, 58));
        ctx.bezierCurveTo(...p(324, 65), ...p(332, 91), ...p(315, 107));
        ctx.lineTo(...p(303, 205));
        ctx.bezierCurveTo(...p(303, 218), ...p(298, 225), ...p(285, 225));
        ctx.closePath();
      }

      function holePath(dy = 0) {
        const h = holeAmount();
        if (h <= 0) return;
        const rx = 3 + h * 32, ry = 1 + h * 22;
        holes.forEach(([x, y], n) => {
          const px = 218 + x * rx, py = 149 + y * ry + dy;
          if (!n) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
      }

      function table() {
        rect(0, 0, 480, 270, '#293b47');
        for (let row = 0; row < 5; row++) {
          rect(0, row * 58, 480, 56, row % 2 ? '#30424d' : '#2d3d48');
          for (let n = 0; n < 3; n++) {
            const y = row * 58 + 11 + n * 15;
            ctx.beginPath(); ctx.moveTo(-8, y);
            ctx.bezierCurveTo(97, y + 4, 128, y - 6, 218, y);
            ctx.bezierCurveTo(300, y + 6, 396, y - 4, 489, y + 2);
            ctx.strokeStyle = '#7d8b8528'; ctx.lineWidth = n === 2 ? 1 : .7; ctx.stroke();
          }
        }
        // A little opened butter wrapper, not another topping or a toast plate.
        poly([[24, 36], [89, 32], [98, 84], [23, 89], [31, 64]], '#b2bdba');
        poly([[28, 38], [89, 34], [84, 49], [31, 55]], '#e2e3d6');
        poly([[25, 77], [88, 74], [96, 85], [24, 89]], '#e2e3d6');
        round(35, 47, 45, 29, 3, '#c4ad68');
        round(35, 44, 45, 28, 3, '#f5df96');
        line(39, 48, 75, 48, '#fff1bb', 2);
        text('BUTTER', 58, 64, 8, '#8c783f');
        // Tea towel is well clear of the bread and the future through-hole.
        ctx.save(); ctx.translate(403, 42); ctx.rotate(.09);
        round(-51, -22, 102, 43, 4, '#869d9b');
        for (let x = -45; x < 50; x += 12) line(x, -22, x, 21, '#bdc8b98f', 3);
        for (let y = -16; y < 20; y += 12) line(-51, y, 51, y, '#567b8870', 3);
        ctx.restore();
      }

      function bread() {
        // Every bread layer uses an even-odd cutout. The center really exposes
        // the wood grain drawn underneath, including during the growing tear.
        ctx.save(); ctx.beginPath(); breadOutline(0, 7); holePath(7);
        ctx.fillStyle = '#0f202a80'; ctx.shadowColor = '#0b1d2680'; ctx.shadowBlur = 8; ctx.fill('evenodd'); ctx.restore();
        ctx.beginPath(); breadOutline(0, 4); holePath(4); ctx.fillStyle = '#92613f'; ctx.fill('evenodd');
        ctx.beginPath(); breadOutline(); holePath(); ctx.fillStyle = '#bf8b54'; ctx.fill('evenodd');
        ctx.beginPath(); breadOutline(.28); holePath(); ctx.fillStyle = '#e0b57a'; ctx.fill('evenodd');
        ctx.beginPath(); breadOutline(1); holePath();
        const crumb = ctx.createLinearGradient(115, 65, 297, 220);
        crumb.addColorStop(0, '#fae6b9'); crumb.addColorStop(1, '#ebcda0');
        ctx.fillStyle = crumb; ctx.fill('evenodd');
        ctx.save(); ctx.clip('evenodd');
        const noise = seed => { const v = Math.sin(seed * 78.233) * 43758.5453; return v - Math.floor(v); };
        for (let n = 0; n < 90; n++) {
          const x = 121 + noise(n + 1) * 192, y = 63 + noise(n + 191) * 158;
          const r = 1.1 + noise(n + 349) * 1.7;
          ellipse(x, y, r * 1.3, r, n % 3 ? '#c9aa7c55' : '#b89a704a');
          line(x - r, y + 1, x + r * .7, y + 1, '#fff2cc6f', .8);
        }
        if (strain > 0) {
          const b = butter();
          ellipse(b.x - 3, b.y + 13, 22 + strain * 15, 5 + strain * 4, '#a97d4c42');
          for (let n = 0; n < 5; n++) {
            ctx.beginPath(); ctx.moveTo(187 + n * 5, 137 + n * 6);
            ctx.bezierCurveTo(204 + n * 4, 137 + n * 8, b.x - 4, b.y + 8 + n * 2, b.x + 10, b.y + 10 + n * 3);
            ctx.strokeStyle = n % 2 ? '#fff0c5' : '#c09a6c'; ctx.lineWidth = 1 + strain * 1.1; ctx.stroke();
          }
        }
        ctx.restore();
        if (holeAmount() > 0) {
          ctx.beginPath(); holePath(); ctx.strokeStyle = '#c6a175'; ctx.lineWidth = 5; ctx.stroke();
          ctx.beginPath(); holePath(-1); ctx.strokeStyle = '#fff0c8'; ctx.lineWidth = 2.5; ctx.stroke();
          const h = holeAmount();
          // Short irregular crumb fibers terminate at the rim; no opaque patch
          // is painted over the hole or masquerades as the tabletop.
          for (let n = 0; n < 12; n++) {
            const a = n * .524;
            const x = 218 + Math.cos(a) * (3 + h * 32), y = 149 + Math.sin(a) * (1 + h * 22);
            line(x, y, x + Math.cos(a) * 3, y + Math.sin(a) * 3, '#f7e2b5', 1.2);
          }
          if (strain < .88) {
            line(202, 139, 233 + h * 5, 150, '#e3c89b', 1.4);
            line(211, 160, 239 + h * 3, 145, '#f4dfb5', 1.2);
          }
          const b = butter();
          poly([[b.x - 28, b.y + 7], [b.x - 16, b.y + 1], [b.x + 7, b.y + 6], [b.x + 12, b.y + 19], [b.x - 2, b.y + 23], [b.x - 10, b.y + 16], [b.x - 22, b.y + 18]], '#ac8259');
          poly([[b.x - 28, b.y + 4], [b.x - 16, b.y - 2], [b.x + 7, b.y + 3], [b.x + 12, b.y + 15], [b.x - 2, b.y + 19], [b.x - 10, b.y + 12], [b.x - 22, b.y + 14]], '#f2dbaf');
          line(b.x - 21, b.y + 6, b.x - 5, b.y + 11, '#c7aa7c', 1.2);
          for (let n = 0; n < 8; n++) {
            const x = 191 + n * 13, y = 182 + (n * 17 % 32);
            ellipse(x, y, 1.3 + n % 2, .9 + n % 3 * .3, '#ead3aa');
          }
        }
      }

      function butterLump() {
        const b = butter();
        ellipse(b.x + 1, b.y + 10, 22, 8, '#6f613f65');
        // Its size and crisp corners never change: this is solid cold butter,
        // not a smear or a spreading texture.
        poly([[b.x - 17, b.y - 6], [b.x + 13, b.y - 9], [b.x + 19, b.y + 6], [b.x - 11, b.y + 10]], '#c5a75d');
        poly([[b.x - 17, b.y - 16], [b.x + 13, b.y - 19], [b.x + 13, b.y - 9], [b.x - 17, b.y - 6]], '#e7c97c');
        poly([[b.x + 13, b.y - 19], [b.x + 19, b.y - 4], [b.x + 19, b.y + 6], [b.x + 13, b.y - 9]], '#d5b66a');
        poly([[b.x - 17, b.y - 16], [b.x + 13, b.y - 19], [b.x + 19, b.y - 4], [b.x - 11, b.y]], '#f7e4a4');
        line(b.x - 14, b.y - 14, b.x + 10, b.y - 16, '#fff4ca', 1.7);
        ellipse(b.x - 7, b.y - 9, 1.5, 1.2, '#fff7df');
        ellipse(b.x + 7, b.y - 10, 1, 1, '#fff7df');
      }

      function knife() {
        const jiggle = phase === 2 && dragging ? Math.sin(time * 30) * .4 : 0;
        ctx.save(); ctx.translate(knifeX + jiggle, knifeY); ctx.rotate(-.03);
        ctx.save(); ctx.translate(3, 5);
        poly([[-15, -17], [-6, -23], [11, -5], [44, 47], [61, 76], [49, 83], [32, 55], [-11, 0]], '#081c2c45'); ctx.restore();
        const metal = ctx.createLinearGradient(-15, -10, 41, 50);
        metal.addColorStop(0, '#f1efde'); metal.addColorStop(.4, '#b0c2c4'); metal.addColorStop(.6, '#e6e8da'); metal.addColorStop(1, '#7a989f');
        ctx.beginPath(); ctx.moveTo(-15, -17); ctx.quadraticCurveTo(-9, -27, -2, -18);
        ctx.lineTo(38, 44); ctx.lineTo(29, 52); ctx.lineTo(-11, 0); ctx.quadraticCurveTo(-18, -10, -15, -17);
        ctx.fillStyle = metal; ctx.fill();
        line(-11, -13, 31, 45, '#ffffff9c', 1.5);
        poly([[29, 47], [38, 42], [63, 76], [60, 83], [50, 84], [29, 54]], '#644b43');
        poly([[32, 48], [38, 46], [58, 75], [57, 79], [52, 79]], '#a77a5e');
        ellipse(40, 58, 2, 2, '#bfc9bd'); ellipse(52, 75, 2, 2, '#bfc9bd');
        ctx.restore();
      }

      function onKnife(p) {
        const ax = knifeX - 6, ay = knifeY - 6, bx = knifeX + 54, by = knifeY + 72;
        const dx = bx - ax, dy = by - ay;
        const f = clamp(((p.x - ax) * dx + (p.y - ay) * dy) / (dx * dx + dy * dy), 0, 1);
        return Math.hypot(p.x - ax - f * dx, p.y - ay - f * dy) < 22;
      }

      return {
        down(p) {
          if (phase < 3 && onKnife(p)) {
            dragging = true; grabX = p.x - knifeX; grabY = p.y - knifeY;
            pushStart = p.x; baseStrain = strain; targetStrain = strain;
            api.tone(490, .035, .015);
          }
        },
        move(p) {
          if (!dragging) return;
          if (phase === 0) { knifeX = clamp(p.x - grabX, 65, 395); knifeY = clamp(p.y - grabY, 67, 184); }
          else if (phase === 1 || phase === 2) {
            if (Math.abs(p.y - grabY - knifeY) > 65) return;
            targetStrain = clamp(baseStrain + Math.max(0, p.x - pushStart) / 110, strain, 1);
            if (targetStrain > .025 && phase === 1) { phase = 2; api.say('The butter stays solid. The soft crumb starts to stretch.'); }
          }
        },
        up() {
          if (phase === 0 && dragging) {
            if (Math.hypot(knifeX - butterStart.x, knifeY - butterStart.y) < 27) {
              phase = 1; knifeX = butterStart.x; knifeY = butterStart.y;
              api.say('Now push the knife right across the bread, and keep the pressure on.');
            } else { knifeX = origin.x; knifeY = origin.y; }
          }
          dragging = false; targetStrain = strain;
        },
        cancel() { dragging = false; targetStrain = strain; if (phase === 0) { knifeX = origin.x; knifeY = origin.y; } },
        update(dt) {
          time += dt;
          if (phase === 2 && dragging) {
            strain = Math.min(targetStrain, strain + dt * .65);
            knifeX = butterStart.x + strain * 80; knifeY = butterStart.y + strain * 10;
            const step = Math.floor(strain * 4);
            if (step > lastTone) { lastTone = step; api.tone(170 - step * 15, .055, .023); }
            if (strain >= 1) { phase = 3; dragging = false; api.say('A clean hole. An entirely unchanged lump of butter.'); }
          } else if (phase === 3) {
            settle += dt;
            if (settle > .6 && !finished) { phase = 4; finished = true; api.done(); }
          }
        },
        draw() {
          table(); bread(); butterLump(); knife();
          if (phase === 0 && !dragging) {
            ctx.save(); ctx.setLineDash([3, 6]); line(343, 117, 248, 117, '#d2d4b774', 1.5); ctx.restore();
            line(256, 111, 247, 117, '#d2d4b7', 1.5); line(256, 123, 247, 117, '#d2d4b7', 1.5);
            ctx.beginPath(); ctx.arc(knifeX + 49, knifeY + 67, 22, 0, Math.PI * 2); ctx.strokeStyle = '#e4d7a969'; ctx.lineWidth = 1.2; ctx.stroke();
          } else if ((phase === 1 || phase === 2) && !dragging) {
            line(338, 109, 376, 109, '#e9d3a6', 2);
            line(368, 103, 377, 109, '#e9d3a6', 2); line(368, 115, 377, 109, '#e9d3a6', 2);
            text('PUSH & HOLD', 373, 92, 8, '#d6d7bf');
          }
          if (phase >= 3) {
            round(334, 96, 129, 43, 7, '#1d303a');
            text('BUTTER: SOLID', 398, 113, 9, '#f2d99c');
            text('BREAD: OPTIONAL', 398, 128, 8, '#d2d9c7');
          }
          text(phase === 0 ? 'Just a little butter.' : phase < 3 ? 'Soft bread. Very cold butter.' : 'Spread: 0. Hole: 1.', 228, 255, 11, '#e6d8b7');
        },
        debug() {
          return {
            phase, dragging, strain, hole: holeAmount(), tableVisibleThroughHole: holeAmount() > 0,
            butterSolid: true, butter: { ...butter(), width: 36, height: 29 },
            knife: { x: knifeX, y: knifeY, handleX: knifeX + 49, handleY: knifeY + 67 },
            crumbCompression: strain, finished,
          };
        },
      };
    },
  });
})();
