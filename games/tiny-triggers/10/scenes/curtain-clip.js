(() => {
  'use strict';

  TinyV5.register({
    id: 'curtain-clip',
    title: 'The Last Curtain Clip',
    chapter: 'home',
    description: 'Pull both curtains together. Almost dark.',
    hint: 'Drag the left curtain right, then the right curtain left until their edges meet.',
    verdict: 'One clip. Unlimited daylight.',
    create(api) {
      const { ctx } = api;
      let left = 156;
      let right = 324;
      let phase = 'open';
      let elapsed = 0;
      let drag = null;
      let drop = 0;
      let clipX = 240;
      let clipY = 48;
      let clipAngle = 0;
      let clipAttached = true;
      let done = false;
      let time = 0;

      const ease = (n) => 1 - Math.pow(1 - api.clamp(n, 0, 1), 3);
      function stroke(points, color, width) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      function clip(x, y, angle, highlight = false) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = highlight ? '#ffe6a8' : '#c5ad7d';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(0, -5, 3.7, 5.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        api.round(-3.4, 0, 6.8, 8, 1.5, '#b49a67');
        api.rect(-1.5, 1, 1.5, 5, '#f1d9a1');
        api.line(-3, 6.5, 3, 6.5, '#6a5940', 1);
        ctx.restore();
      }

      function curtain(isLeft) {
        const outer = isLeft ? 74 : 406;
        const inner = isLeft ? left : right;
        const sign = isLeft ? 1 : -1;
        const sag = isLeft ? drop : 0;
        const cornerX = inner - sign * sag * 0.31;
        const startX = Math.min(inner, outer);
        const width = Math.abs(inner - outer);
        const shake = phase === 'tension' && isLeft ? Math.sin(elapsed * 62) * 0.8 : 0;
        ctx.save();
        ctx.translate(shake, 0);
        ctx.beginPath();
        ctx.moveTo(outer, 58);
        ctx.lineTo(inner - sign * Math.min(30, width * 0.18), 58);
        ctx.quadraticCurveTo(inner - sign * 7, 58 + sag * 0.2, cornerX, 58 + sag);
        ctx.bezierCurveTo(cornerX + sign * 3, 132, inner - sign * 2, 183, inner, 217);
        for (let i = 1; i <= 8; i++) {
          const x = inner + (outer - inner) * i / 8;
          ctx.quadraticCurveTo(x - (outer - inner) / 16, 222, x, 217);
        }
        ctx.closePath();
        ctx.fillStyle = isLeft ? '#ad625b' : '#a15753';
        ctx.fill();
        ctx.clip();
        // Each drawn pleat widens with the fabric, so dragging really unfurls it.
        const pleat = width / 7;
        for (let i = -1; i < 9; i++) {
          const x = startX + i * pleat;
          const gradient = ctx.createLinearGradient(x, 0, x + pleat, 0);
          gradient.addColorStop(0, '#6e3e43');
          gradient.addColorStop(0.28, '#a65f59');
          gradient.addColorStop(0.55, '#c48370');
          gradient.addColorStop(0.77, '#b06b60');
          gradient.addColorStop(1, '#754249');
          ctx.fillStyle = gradient;
          ctx.fillRect(x, 56, pleat + 1, 169);
          stroke([[x + pleat * 0.42, 65], [x + pleat * 0.48, 144], [x + pleat * 0.4, 213]], '#cf907914', 1);
        }
        api.rect(startX, 58, width, 8, '#d496803e');
        api.rect(startX, 208, width, 2, '#492c3940');
        api.rect(startX, 211, width, 1, '#edb39543');
        for (let y = 80; y < 205; y += 16) {
          for (let x = startX + 6; x < startX + width; x += 12) {
            api.rect(x, y, 1, 2, '#f0b99510');
          }
        }
        ctx.restore();
        if (sag > 1) {
          // The folded-back inner corner hangs from its remaining neighbour.
          api.poly([[inner - 30, 59], [cornerX, 58 + sag], [inner - 3, 72 + sag]], '#7d4549');
          stroke([[inner - 29, 60], [cornerX, 58 + sag], [inner - 4, 72 + sag]], '#dca08a', 1.2);
          stroke([[cornerX, 61 + sag], [inner - 3, 157], [inner, 216]], '#e3a48a88', 1.2);
        }
        for (let i = 0; i <= 5; i++) {
          if (isLeft && i === 5 && !clipAttached) continue;
          clip(outer + (inner - outer) * i / 5, 49, 0, isLeft && i === 5);
        }
      }

      function arrow(x, direction) {
        const float = Math.sin(time * 3) * 2;
        const tip = x + direction * (23 + float);
        stroke([[x, 140], [tip, 140]], '#fff1c8', 2.5);
        stroke([[tip - direction * 6, 135], [tip, 140], [tip - direction * 6, 145]], '#fff1c8', 2.5);
        api.round(x - 6, 126, 12, 28, 6, '#fbe5c11c', '#fbe5c166');
      }

      function draw() {
        const wall = ctx.createLinearGradient(0, 0, 0, 270);
        wall.addColorStop(0, '#252c3b');
        wall.addColorStop(1, '#35313b');
        ctx.fillStyle = wall;
        ctx.fillRect(0, 0, 480, 270);
        for (let x = 22; x < 480; x += 34) api.rect(x, 0, 1, 235, '#ddd0bf04');
        api.rect(0, 236, 480, 34, '#211f2b');
        api.rect(0, 232, 480, 5, '#4b414a');
        api.rect(0, 233, 480, 1, '#75606a');
        api.round(91, 44, 300, 178, 5, '#121d2b');
        api.rect(98, 49, 284, 165, '#baac94');
        const daylight = ctx.createLinearGradient(0, 51, 0, 211);
        daylight.addColorStop(0, '#edddba');
        daylight.addColorStop(1, '#b2c4b0');
        ctx.fillStyle = daylight;
        ctx.fillRect(105, 55, 270, 151);
        api.ellipse(287, 86, 21, 21, '#fff5d4');
        api.poly([[105, 164], [145, 134], [187, 160], [247, 128], [310, 157], [375, 139], [375, 206], [105, 206]], '#91ac9c');
        api.poly([[105, 183], [171, 157], [235, 188], [305, 159], [375, 181], [375, 206], [105, 206]], '#6c9389');
        api.rect(236, 55, 8, 151, '#e3d6b8');
        api.rect(105, 130, 270, 7, '#e3d6b8');
        api.rect(106, 137, 269, 2, '#536c6860');
        api.rect(91, 212, 299, 8, '#c4b299');
        api.rect(91, 220, 299, 4, '#171d2a');
        if (drop > 2) {
          const alpha = api.clamp(drop / 46, 0, 1);
          ctx.save();
          ctx.globalAlpha = alpha;
          const beam = ctx.createLinearGradient(236, 88, 329, 264);
          beam.addColorStop(0, '#ffecc345');
          beam.addColorStop(1, '#ffecc308');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(221, 66);
          ctx.lineTo(240, 105);
          ctx.lineTo(348, 270);
          ctx.lineTo(294, 270);
          ctx.closePath();
          ctx.fill();
          api.poly([[273, 237], [292, 237], [313, 265], [295, 265]], '#f7d99d20');
          ctx.restore();
        }
        // Wall brackets and one continuous brass curtain pole.
        api.round(64, 30, 10, 22, 3, '#544b45');
        api.round(406, 30, 10, 22, 3, '#544b45');
        api.line(60, 40, 420, 40, '#b49b6c', 5);
        api.line(60, 38, 420, 38, '#e1c693', 1);
        api.ellipse(57, 40, 6, 6, '#ceb381');
        api.ellipse(423, 40, 6, 6, '#ceb381');
        curtain(true);
        curtain(false);
        // A little bedroom furniture frames the physical scene, not a UI card.
        api.line(38, 215, 35, 174, '#59796b', 3);
        api.line(37, 201, 23, 185, '#59796b', 2);
        api.ellipse(29, 183, 12, 5, '#739280');
        api.ellipse(44, 180, 12, 5, '#829a83');
        api.ellipse(29, 197, 11, 5, '#5a7d70');
        api.ellipse(45, 194, 10, 5, '#668c78');
        api.poly([[22, 211], [51, 211], [47, 236], [27, 236]], '#a87760');
        api.rect(21, 209, 31, 5, '#ca9473');
        api.round(417, 213, 49, 7, 2, '#9b7761');
        api.rect(422, 220, 5, 27, '#765c50');
        api.rect(456, 220, 5, 27, '#765c50');
        api.round(429, 193, 28, 20, 4, '#a9a58a');
        api.round(433, 198, 20, 9, 2, '#354a47');
        api.text('6:01', 443, 205, 7, '#d6dca9');
        if (phase === 'open') {
          if (left < 238) arrow(left - 17, 1);
          if (right > 242) arrow(right + 17, -1);
          if (!drag) api.text('PULL BOTH EDGES TOGETHER', 240, 250, 9, '#c2aaa1');
        }
        if (!clipAttached) {
          api.ellipse(clipX, 242, 7 + (242 - clipY) * 0.015, 2, '#10131d70');
          clip(clipX, clipY, clipAngle, true);
        }
        if (phase === 'clip-falling' && elapsed < 0.3) {
          const fade = 1 - elapsed / 0.3;
          ctx.save();
          ctx.globalAlpha = fade;
          stroke([[246, 43], [254, 39]], '#ffe1a4', 2);
          stroke([[241, 33], [241, 25]], '#ffe1a4', 2);
          stroke([[230, 40], [224, 34]], '#ffe1a4', 2);
          ctx.restore();
        }
      }

      function meeting() {
        if (left >= 238 && right <= 242) {
          left = right = 240;
          drag = null;
          phase = 'tension';
          elapsed = 0;
          api.say('Perfect. Finally dark.');
        }
      }

      return {
        draw,
        down(p) {
          if (phase !== 'open' || p.y < 59 || p.y > 224) return;
          if (p.x >= 65 && p.x <= left + 12) drag = { side: 'left', x: p.x, edge: left };
          else if (p.x >= right - 12 && p.x <= 415) drag = { side: 'right', x: p.x, edge: right };
        },
        move(p) {
          if (!drag || phase !== 'open') return;
          const edge = drag.edge + p.x - drag.x;
          if (drag.side === 'left') left = api.clamp(edge, 110, 240);
          else right = api.clamp(edge, 240, 370);
          meeting();
        },
        up() { drag = null; },
        cancel() { drag = null; },
        update(dt) {
          time += dt;
          if (phase === 'open' || phase === 'complete') return;
          elapsed += dt;
          if (phase === 'tension' && elapsed >= 0.32) {
            phase = 'clip-falling';
            elapsed = 0;
            clipAttached = false;
            api.tone(1250, 0.06, 0.027, 0.05);
            api.say('That was the last clip.');
          } else if (phase === 'clip-falling') {
            const t = Math.min(elapsed, 1.12);
            drop = 46 * ease(t / 0.85) + Math.sin(t * 17) * Math.exp(-t * 3) * 4;
            clipX = 240 + 55 * ease(t / 1.12);
            clipY = 49 - 42 * t + 190 * t * t;
            clipAngle = t * 8;
            if (elapsed >= 1.12) {
              phase = 'dangling';
              elapsed = 0;
              clipY = 239;
              api.tone(480, 0.05, 0.018, 0.3);
            }
          } else if (phase === 'dangling') {
            drop = 46 + Math.sin(elapsed * 13) * Math.exp(-elapsed * 6) * 1.8;
            clipY = 239 - Math.sin(Math.min(1, elapsed / 0.34) * Math.PI) * 8;
            clipAngle = 8.96 + ease(elapsed / 0.34) * 0.6;
            if (elapsed >= 0.64) {
              phase = 'complete';
              drop = 46;
              clipY = 239;
              if (!done) { done = true; api.done(); }
            }
          }
        },
        debug() {
          return {
            phase, leftEdge: left, rightEdge: right,
            leftClosed: left >= 238, rightClosed: right <= 242,
            dragging: drag ? drag.side : null,
            clipAttached, clipX, clipY, cornerDrop: drop,
            lightGap: drop * 0.31, completed: done,
          };
        },
      };
    },
  });
})();
