(() => {
  'use strict';

  TinyV5.register({
    id: 'toilet-hunt',
    title: 'The Toilet Paper Hunt',
    chapter: 'home',
    description: 'Find the loose end. Pull gently. Keep hoping.',
    hint: 'Drag around the big roll for half a turn to find the end. Then grab the little paper tab underneath and pull down.',
    verdict: 'A giant roll. A very small victory.',
    create(api) {
      const { ctx } = api;
      const cx = 240, cy = 108, paperTop = 182;
      let phase = 'search';
      let rotation = 0;
      let rotationTravel = 0;
      let paperLength = 0;
      let pulledLength = 0;
      let elapsed = 0;
      let time = 0;
      let gesture = null;
      let pointer = null;
      let tear = 0;
      let retract = 0;
      let completed = false;

      const wrap = (n) => Math.atan2(Math.sin(n), Math.cos(n));
      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      function path(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function hand(x, y, rotationAngle = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationAngle);
        // A tiny illustrated pinch follows the actual hand gesture.
        ctx.beginPath();
        ctx.moveTo(8, 23);
        ctx.lineTo(-2, 10);
        ctx.quadraticCurveTo(-8, 4, -4, 0);
        ctx.quadraticCurveTo(0, -2, 5, 5);
        ctx.lineTo(4, -3);
        ctx.quadraticCurveTo(5, -8, 9, -5);
        ctx.lineTo(14, 6);
        ctx.quadraticCurveTo(25, 9, 23, 21);
        ctx.lineTo(29, 30);
        ctx.closePath();
        ctx.fillStyle = '#c99b7d';
        ctx.fill();
        ctx.strokeStyle = '#e3b69a';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        path([[9, 5], [13, 11]], '#a97762', 1);
        api.poly([[6, 23], [25, 17], [33, 31], [13, 39]], '#587a80');
        path([[8, 24], [26, 19]], '#9cb9b4', 2);
        ctx.restore();
      }

      function paper(x, y, width, length, torn = false, opacity = 1) {
        if (length <= 0.3) return;
        ctx.save();
        ctx.globalAlpha = opacity;
        const shade = ctx.createLinearGradient(x, 0, x + width, 0);
        shade.addColorStop(0, '#d1d4c3');
        shade.addColorStop(0.2, '#f0edda');
        shade.addColorStop(0.68, '#faf4df');
        shade.addColorStop(1, '#c9cfbd');
        ctx.beginPath();
        ctx.moveTo(x, y + (torn ? 2 : 0));
        if (torn) {
          for (let i = 1; i <= 10; i++) ctx.lineTo(x + width * i / 10, y + (i % 2 ? 4 : 0));
        } else ctx.lineTo(x + width, y);
        ctx.bezierCurveTo(x + width - 2, y + length * 0.4, x + width + 1, y + length * 0.7, x + width - 2, y + length);
        for (let i = 1; i <= 10; i++) ctx.lineTo(x + width - 2 - (width - 3) * i / 10, y + length - (i % 2 ? 1.4 : 0));
        ctx.bezierCurveTo(x + 1, y + length * 0.6, x + 3, y + length * 0.25, x, y);
        ctx.closePath();
        ctx.fillStyle = shade;
        ctx.fill();
        ctx.save();
        ctx.clip();
        // The first perforation appears while feeding a real continuous strip.
        for (let lineY = y + length - 35; lineY > y + 5; lineY -= 35) {
          for (let dx = 3; dx < width - 2; dx += 5) api.line(x + dx, lineY, x + dx + 2, lineY, '#8e9b8677', 0.8);
        }
        for (let lineY = y + 7; lineY < y + length; lineY += 9) {
          for (let dx = 5; dx < width - 3; dx += 8) {
            api.ellipse(x + dx, lineY, 1.6, 1.6, '#9ba78c18');
          }
        }
        ctx.restore();
        api.line(x + 4, y + 5, x + 4, y + length - 3, '#ffffff38', 1);
        ctx.restore();
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#273d43');
        for (let row = 0; row < 6; row++) {
          for (let col = 0; col < 8; col++) {
            const x = col * 64 - (row % 2 ? 32 : 0);
            api.round(x + 2, row * 43 + 2, 60, 39, 2, (row + col) % 3 ? '#30484c' : '#334c50');
            api.line(x + 6, row * 43 + 3, x + 56, row * 43 + 3, '#67817b18', 1);
          }
        }
        api.rect(0, 242, 480, 28, '#24353c');
        api.line(0, 242, 480, 242, '#61716b', 2);
        path([[100, 243], [85, 270]], '#172c34', 1);
        path([[351, 243], [365, 270]], '#172c34', 1);

        // A porcelain toilet and pipe establish the bathroom at a glance.
        api.round(18, 133, 62, 58, 7, '#bbc9c2');
        api.round(15, 131, 68, 9, 3, '#e0e4d6');
        api.round(61, 147, 12, 4, 2, '#6f8e91');
        api.line(28, 195, 21, 223, '#7e9998', 4);
        api.poly([[34, 198], [87, 198], [78, 236], [42, 236]], '#b4c5bf');
        api.round(41, 233, 39, 7, 3, '#dce2d4');
        api.ellipse(61, 196, 38, 13, '#e4e7d8');
        api.ellipse(61, 194, 27, 7, '#718f8b');
        api.ellipse(61, 195, 20, 4, '#b6cbc2');

        api.ellipse(244, 123, 89, 87, '#15272e66');
        const shell = ctx.createLinearGradient(155, 32, 328, 190);
        shell.addColorStop(0, '#91a5a6');
        shell.addColorStop(0.35, '#c7cebd');
        shell.addColorStop(1, '#647f83');
        ctx.fillStyle = shell;
        ctx.beginPath();
        ctx.arc(cx, cy, 83, 0, Math.PI * 2);
        ctx.fill();
        api.ellipse(cx, cy, 76, 76, '#253c43');
        api.ellipse(cx, cy + 2, 70, 70, '#172d32');

        // Open-front jumbo dispenser: the actual paper edge and core rotate.
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        const roll = ctx.createRadialGradient(-20, -25, 8, 0, 0, 67);
        roll.addColorStop(0, '#f4efd6');
        roll.addColorStop(0.72, '#dedbc2');
        roll.addColorStop(1, '#b9bda5');
        ctx.fillStyle = roll;
        ctx.beginPath();
        ctx.arc(0, 0, 66, 0, Math.PI * 2);
        ctx.fill();
        for (let r = 21; r < 65; r += 3.6) {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0.035 * r, Math.PI * 2 + 0.035 * r - 0.06);
          ctx.strokeStyle = '#7c897d30';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
        // Off-centre winding marks make a partial rotation visibly observable.
        path([[-8, -63], [-5, -56], [-4, -48]], '#a5af934d', 1.2);
        path([[43, 30], [47, 32], [53, 35]], '#ffffed6b', 2);
        api.ellipse(0, 0, 19, 19, '#937e5a');
        api.ellipse(0, 0, 15, 15, '#b69d73');
        api.ellipse(0, 0, 11, 11, '#243c43');
        api.round(-4, -10, 8, 20, 2, '#718c8c');
        api.line(-2, -7, -2, 6, '#bfd1c3', 1);
        api.rect(10, -4, 3, 6, '#dfc398');
        ctx.restore();

        // Fixed support bridge, lock and the shadowed dispensing mouth.
        api.round(169, 159, 142, 24, 10, '#7a9292');
        api.round(184, 169, 112, 22, 7, '#a8b7ac');
        api.round(204, 174, 72, 16, 5, '#142b32');
        api.line(210, 176, 270, 176, '#091d23', 3);
        api.ellipse(240, 35, 5, 5, '#557078');
        api.line(240, 32, 240, 37, '#c2cabb', 1);
        api.text('JUMBO', 240, 163, 7, '#dce4d3');
        api.line(174, 69, 180, 56, '#e9efe18a', 2);
        api.line(302, 61, 307, 74, '#e9efe14a', 2);

        if (phase === 'ready') paper(225, paperTop, 30, paperLength);
        if (phase === 'tearing') {
          paper(225, paperTop, 30, 7);
          paper(225 + tear * 8, paperTop + tear * 7, 30, pulledLength, tear > 0.15);
          path([[224, 185], [231, 188], [236, 184], [242, 188], [249, 185], [255, 188]], '#566f6966', 0.8);
          if (tear < 0.7) {
            const flash = 1 - tear / 0.7;
            ctx.save();
            ctx.globalAlpha = flash;
            path([[216, 184], [210, 179]], '#f3dba9', 1.8);
            path([[264, 186], [271, 181]], '#f3dba9', 1.8);
            ctx.restore();
          }
        }
        if (phase === 'retracting' || phase === 'complete') {
          paper(225, paperTop, 30, 7 * (1 - retract));
          const fall = smooth(retract);
          ctx.save();
          ctx.translate(247 + fall * 45, 190 + fall * 51);
          ctx.rotate(fall * -1.52);
          api.ellipse(14, 40, 18, 4, '#11252c20');
          paper(-15, 0, 30, pulledLength, true);
          ctx.restore();
        }

        if (gesture && pointer) {
          hand(pointer.x + (gesture.kind === 'rotate' ? 3 : 5), pointer.y + 2,
            gesture.kind === 'rotate' ? -0.45 : -0.15);
        }
        if (phase === 'search' && !gesture) {
          ctx.beginPath();
          ctx.arc(cx, cy, 51, -0.45, 0.6);
          ctx.strokeStyle = '#faf1cf';
          ctx.lineWidth = 2;
          ctx.stroke();
          const tipX = cx + Math.cos(0.6) * 51, tipY = cy + Math.sin(0.6) * 51;
          path([[tipX + 1, tipY - 7], [tipX, tipY], [tipX + 7, tipY - 2]], '#faf1cf', 2);
          api.text('TURN THE ROLL. FIND THE END.', 260, 227, 9, '#c0cec1');
        } else if (phase === 'ready' && !gesture) {
          const arrowY = Math.min(253, paperTop + paperLength + 10 + Math.sin(time * 4) * 2);
          path([[240, arrowY - 5], [240, arrowY + 4]], '#f4e8c5', 2);
          path([[236, arrowY], [240, arrowY + 4], [244, arrowY]], '#f4e8c5', 2);
          api.text('FOUND IT. PULL DOWN.', 362, 219, 8, '#c9d3c4');
        }
      }

      return {
        draw,
        down(p) {
          if (phase === 'search') {
            const radius = Math.hypot(p.x - cx, p.y - cy);
            if (radius < 25 || radius > 75) return;
            gesture = { kind: 'rotate', lastAngle: Math.atan2(p.y - cy, p.x - cx) };
            pointer = p;
          } else if (phase === 'ready' && p.x >= 210 && p.x <= 271 && p.y >= paperTop - 1 && p.y <= paperTop + paperLength + 14) {
            gesture = { kind: 'pull', y: p.y, length: paperLength };
            pointer = p;
          }
        },
        move(p) {
          if (!gesture) return;
          pointer = p;
          if (gesture.kind === 'rotate' && phase === 'search') {
            const angle = Math.atan2(p.y - cy, p.x - cx);
            const delta = wrap(angle - gesture.lastAngle);
            gesture.lastAngle = angle;
            const radius = Math.hypot(p.x - cx, p.y - cy);
            if (radius < 23 || radius > 105 || Math.abs(delta) > 0.8) return;
            rotation += delta;
            rotationTravel += Math.abs(delta);
            if (rotationTravel >= 2.6 && Math.abs(wrap(rotation - Math.PI)) < 0.22) {
              phase = 'ready';
              paperLength = 13;
              gesture = null;
              api.tone(620, 0.07, 0.018);
              api.say('There it is. Take a little.');
            }
          } else if (gesture.kind === 'pull' && phase === 'ready') {
            const nextLength = api.clamp(gesture.length + p.y - gesture.y, 13, 64);
            rotation += (nextLength - paperLength) / 66;
            paperLength = nextLength;
            if (paperLength >= 64) {
              pulledLength = paperLength;
              phase = 'tearing';
              elapsed = 0;
              gesture = null;
              api.tone(930, 0.055, 0.022);
              api.say('That should be enough for…');
            }
          }
        },
        up() { gesture = null; pointer = null; },
        cancel() { gesture = null; pointer = null; },
        update(dt) {
          time += dt;
          if (phase === 'search' || phase === 'ready' || phase === 'complete') return;
          elapsed += dt;
          if (phase === 'tearing') {
            tear = smooth(elapsed / 0.42);
            if (elapsed >= 0.42) {
              phase = 'retracting';
              elapsed = 0;
              paperLength = 7;
            }
          } else if (phase === 'retracting') {
            retract = smooth(elapsed / 0.8);
            paperLength = 7 * (1 - retract);
            rotation -= dt * 0.6 * (1 - retract);
            if (elapsed >= 0.95) {
              phase = 'complete';
              paperLength = 0;
              retract = 1;
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          return {
            phase, rotation, rotationTravel, paperLength, pulledLength,
            looseEndVisible: paperLength > 0.5,
            sheets: (pulledLength || paperLength) / 35,
            gesture: gesture ? gesture.kind : null,
            tearProgress: tear, retractProgress: retract,
            detached: ['tearing', 'retracting', 'complete'].includes(phase),
            completed,
          };
        },
      };
    },
  });
})();
