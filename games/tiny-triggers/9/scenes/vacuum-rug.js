(() => {
  'use strict';
  TinyV5.register({
    id: 'vacuum-rug',
    title: 'The Robot Vacuum and the Rug',
    chapter: 'home',
    description: 'Guide the little cleaner across the rug. Then help with its next lap.',
    hint: 'Drag the round vacuum right along the bottom of the rug. Let it finish its loop, then drag it right again.',
    verdict: 'The obstacle was an inside job.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      let phase = 0, time = 0, fold = 0, folding = false, dragging = false;
      let robot = { x: 92, y: 181, angle: 0 };
      let lapPoint = 0, stuckTime = 0, finished = false, firstPass = false;
      let grabOffset = 0, cleaned = 0;
      const route = [[410, 181], [410, 42], [103, 42], [103, 181]];
      const crumbs = [
        [209, 181], [249, 176], [293, 187], [337, 177], [365, 185],
        [410, 116], [386, 42], [305, 42], [215, 42], [134, 42], [103, 116],
      ].map(([x, y], i) => ({ x, y, gone: false, size: 1.6 + i % 3 * .45 }));

      function sweep() {
        for (const crumb of crumbs) {
          if (!crumb.gone && Math.hypot(robot.x - crumb.x, robot.y - crumb.y) < 29) {
            crumb.gone = true;
            cleaned++;
          }
        }
      }

      function guide(p) {
        if (!dragging || (phase !== 0 && phase !== 2)) return;
        if (p.y < 138 || p.y > 223) return;
        const next = clamp(p.x - grabOffset, 82, phase === 2 ? 153 : 391);
        // Sweep the actual travelled segment, including quick touch swipes.
        for (const crumb of crumbs) {
          if (!crumb.gone && Math.abs(crumb.y - 181) < 26 &&
              crumb.x >= Math.min(robot.x, next) - 23 && crumb.x <= Math.max(robot.x, next) + 23) {
            crumb.gone = true;
            cleaned++;
          }
        }
        robot.x = next;
        if (phase === 0 && robot.x >= 157 && !folding) {
          folding = true;
          api.tone(240, .09, .025);
          api.say('One corner catches the brush. It keeps right on cleaning.');
        }
        if (phase === 0 && robot.x >= 383) {
          firstPass = true;
          phase = 1;
          dragging = false;
          api.say('Around it goes, leaving its little surprise behind…');
        } else if (phase === 2 && robot.x >= 151) {
          phase = 3;
          dragging = false;
          api.tone(135, .18, .035);
          api.say('Same rug. Brand-new obstacle.');
        }
      }

      function rugShape() {
        ctx.beginPath();
        ctx.moveTo(146, 64);
        ctx.lineTo(376, 64);
        ctx.lineTo(376, 210);
        ctx.lineTo(146 + 49 * fold, 210);
        ctx.lineTo(146, 210 - 49 * fold);
        ctx.closePath();
      }

      function drawRug() {
        round(144, 65, 236, 149, 3, '#080e1580');
        // The corner really leaves the floor: its triangular footprint is cut out.
        ctx.save();
        rugShape();
        ctx.clip();
        rect(146, 64, 230, 146, '#b46355');
        rect(153, 71, 216, 132, '#d39172');
        rect(160, 78, 202, 118, '#984e49');
        rect(167, 85, 188, 104, '#b56b5a');
        for (let y = 67; y < 210; y += 4) line(146, y, 377, y, '#ffe3ad13', 1);
        for (let x = 171; x < 350; x += 20) {
          poly([[x, 94], [x + 5, 100], [x, 106], [x - 5, 100]], '#e6b58b');
          poly([[x, 169], [x + 5, 175], [x, 181], [x - 5, 175]], '#e6b58b');
        }
        poly([[260, 103], [305, 137], [260, 172], [215, 137]], '#d99c79');
        poly([[260, 114], [290, 137], [260, 160], [230, 137]], '#a3544e');
        poly([[260, 127], [274, 137], [260, 148], [246, 137]], '#edc399');
        for (let x = 177; x < 350; x += 18) {
          line(x, 118, x + 4, 122, '#e5b18a', 1.2);
          line(x + 4, 150, x, 154, '#e5b18a', 1.2);
        }
        ctx.restore();
        // Hand-knotted fringe follows the edge; the lifted section has its own fringe.
        for (let y = 70; y < 209; y += 6) {
          line(376, y, 382, y + 1, '#e4b993', 1.4);
          if (y < 210 - 49 * fold) line(140, y, 146, y, '#e4b993', 1.4);
        }
        if (fold > .015) {
          const a = [146, 210 - 49 * fold], b = [146 + 49 * fold, 210];
          const tip = [146 + 49 * fold, 210 - 49 * fold - 6 * Math.sin(fold * Math.PI / 2)];
          poly([a, b, [tip[0] + 6, tip[1] + 9]], '#10131b80');
          poly([a, b, tip], '#e1b58a');
          line(a[0], a[1], b[0], b[1], '#8b4e44', 2);
          line(b[0], b[1], tip[0], tip[1], '#ffe0ad', 2);
          for (let n = 1; n < 6; n++) {
            const f = n / 6;
            line(a[0] + (tip[0] - a[0]) * f, a[1] + (tip[1] - a[1]) * f,
              b[0], b[1] + (tip[1] - b[1]) * f, '#9f78545c', 1);
          }
          for (let n = 0; n < 7; n++) {
            const f = n / 7;
            line(tip[0], tip[1] + (b[1] - tip[1]) * f,
              tip[0] + 5 * fold, tip[1] + (b[1] - tip[1]) * f - 1, '#f4d3a6', 1.3);
          }
        }
      }

      function drawRobot() {
        const snag = phase >= 3;
        const rock = snag ? Math.sin(stuckTime * 20) * Math.max(.25, 1 - stuckTime / 2.2) : 0;
        const x = robot.x + rock * 2.5;
        ellipse(x, robot.y + 6, 28, 24, '#090e1880');
        ctx.save();
        ctx.translate(x, robot.y);
        ctx.rotate(robot.angle + rock * .035);
        const spinning = phase === 1 || dragging || (snag && stuckTime < 1.7);
        const spin = spinning ? time * 26 : 0;
        ctx.save();
        ctx.translate(18, 17);
        ctx.rotate(spin);
        for (let n = 0; n < 3; n++) {
          ctx.rotate(Math.PI * 2 / 3);
          line(0, 0, 12, 0, '#9bafaf', 2);
          line(8, -1, 12, -3, '#667f84', 1);
          line(8, 1, 12, 3, '#667f84', 1);
        }
        ctx.restore();
        round(-10, -26, 18, 9, 3, '#0c1720');
        round(-10, 17, 18, 9, 3, '#0c1720');
        for (let n = -7; n < 8; n += 4) {
          const tread = n + (spinning ? Math.floor(time * 25) % 4 : 0);
          line(tread, -25, tread, -20, '#5c6a6e', 1);
          line(tread, 20, tread, 25, '#5c6a6e', 1);
        }
        ellipse(0, 2, 25, 25, '#74868b');
        const g = ctx.createLinearGradient(-20, -22, 25, 22);
        g.addColorStop(0, '#f3f1e7');
        g.addColorStop(1, '#b4c6c6');
        ellipse(0, -1, 24, 24, g);
        ctx.beginPath();
        ctx.arc(0, -1, 20, -1.22, 1.22);
        ctx.strokeStyle = '#72868c';
        ctx.lineWidth = 3;
        ctx.stroke();
        line(20, -9, 21, 6, '#253f4a', 2.5);
        ellipse(-4, -2, 12, 12, '#a4b7b9');
        ellipse(-4, -4, 11, 10, '#e6ece6');
        ellipse(-4, -4, 5, 4, '#a4b8bb');
        ellipse(-4, -4, 2.5, 2, '#35545b');
        round(8, -10, 5, 5, 2, snag ? '#d76a56' : '#55bca5');
        line(-16, 9, -8, 14, '#ffffff80', 2);
        ctx.restore();
        if (snag) {
          const pulse = .6 + Math.sin(time * 7) * .2;
          ctx.globalAlpha = pulse;
          line(136, 151, 131, 143, '#f6af79', 2);
          line(146, 147, 146, 137, '#f6af79', 2);
          line(155, 150, 161, 142, '#f6af79', 2);
          ctx.globalAlpha = 1;
          if (stuckTime > .65) {
            round(76, 116, 60, 22, 7, '#44333d', '#b66b62');
            text('STUCK', 106, 131, 9, '#ffd3b1');
          }
        }
      }

      return {
        down(p) {
          if ((phase === 0 || phase === 2) && Math.hypot(p.x - robot.x, p.y - robot.y) < 35) {
            dragging = true;
            grabOffset = p.x - robot.x;
            api.tone(510, .04, .015);
          }
        },
        move: guide,
        up(p) { if (p) guide(p); dragging = false; },
        cancel() { dragging = false; },
        update(dt) {
          time += dt;
          if (folding) fold = Math.min(1, fold + dt * 1.7);
          if (phase === 1) {
            const dest = route[lapPoint];
            const dx = dest[0] - robot.x, dy = dest[1] - robot.y;
            const distance = Math.hypot(dx, dy), step = dt * 145;
            robot.angle = Math.atan2(dy, dx);
            if (distance <= step) {
              robot.x = dest[0]; robot.y = dest[1]; lapPoint++;
              if (lapPoint === route.length) {
                phase = 2;
                robot.angle = 0;
                api.say('Next lap. Guide it across that same corner again.');
              }
            } else {
              robot.x += dx / distance * step;
              robot.y += dy / distance * step;
            }
            sweep();
          }
          if (phase === 3) {
            stuckTime += dt;
            if (stuckTime > 1.85 && !finished) {
              finished = true;
              phase = 4;
              api.done();
            }
          }
        },
        draw() {
          rect(0, 0, 480, 270, '#23313c');
          for (let x = 0; x < 480; x += 54) {
            rect(x + 1, 0, 52, 270, x % 108 ? '#293945' : '#2b3b46');
            line(x + 4, 0, x + 4, 270, '#42505b30', 1);
            line(x, 83 + x % 37, x + 54, 83 + x % 37, '#1e2d37', 1);
          }
          // A cropped sofa and a planter establish a living-room floor, not a diagram.
          round(434, 67, 56, 151, 12, '#16232c');
          round(438, 57, 58, 151, 12, '#55737a', '#69838a');
          round(443, 70, 43, 58, 7, '#64868a');
          round(443, 133, 43, 59, 7, '#64868a');
          line(443, 131, 480, 131, '#3f616a', 2);
          ellipse(43, 75, 23, 8, '#101d2880');
          ellipse(42, 66, 18, 17, '#aa8068');
          ellipse(42, 60, 18, 12, '#cca084');
          ellipse(42, 60, 14, 9, '#4c4039');
          for (let n = 0; n < 7; n++) {
            const angle = n * 2.4;
            ctx.save(); ctx.translate(42, 58); ctx.rotate(angle);
            ellipse(0, -12, 5, 17, n % 2 ? '#668b70' : '#88a17a');
            line(0, -1, 0, -24, '#a7b79570', 1);
            ctx.restore();
          }
          drawRug();
          for (const c of crumbs) {
            if (!c.gone) {
              ellipse(c.x + 1, c.y + 2, c.size + 1, c.size, '#15232a50');
              poly([[c.x - c.size, c.y + 1], [c.x, c.y - c.size], [c.x + c.size, c.y + 1]], '#e8c78c');
              ellipse(c.x + 5, c.y + 3, 1.1, 1, '#c7a06e');
            }
          }
          if (phase === 0 || phase === 2) {
            ctx.save();
            ctx.setLineDash([3, 6]);
            line(robot.x + 33, 181, phase === 0 ? 356 : 169, 181, '#f6ddb075', 2);
            ctx.restore();
            const arrowX = phase === 0 ? 356 : 174;
            line(arrowX - 8, 175, arrowX, 181, '#f2ce91', 2);
            line(arrowX - 8, 187, arrowX, 181, '#f2ce91', 2);
            if (!dragging) {
              ctx.beginPath(); ctx.arc(robot.x, robot.y, 31 + Math.sin(time * 3) * 1.2, 0, Math.PI * 2);
              ctx.strokeStyle = '#b7d0bd80'; ctx.lineWidth = 1.5; ctx.stroke();
            }
          }
          drawRobot();
          round(18, 229, 444, 27, 8, '#17242e');
          const label = phase === 0 ? 'FIRST LAP' : phase === 1 ? 'STILL CLEANING…' : phase === 2 ? 'NEXT LAP' : 'SELF-MADE ROADBLOCK';
          text(label, 33, 247, 10, '#dfc7a7', 'left');
          for (let n = 0; n < 3; n++) ellipse(415 + n * 14, 242, 3, 3,
            n === 0 || (n === 1 && firstPass) || (n === 2 && phase >= 3) ? '#d9a779' : '#475760');
        },
        debug() {
          return {
            phase, lap: phase < 2 ? 1 : 2, fold, folding, firstPass,
            cleaned, totalCrumbs: crumbs.length, dragging,
            robot: { x: robot.x, y: robot.y },
            stuck: phase >= 3, stuckTime, finished,
          };
        },
      };
    },
  });
})();
