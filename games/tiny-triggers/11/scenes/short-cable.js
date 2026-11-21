(() => {
  'use strict';

  TinyV5.register({
    id: 'short-cable',
    title: 'Ten Centimeters Too Short',
    chapter: 'home',
    description: 'Plug in. Settle into the sofa. Lean back just a little.',
    hint: 'Drag the loose connector into the bottom of the phone. Drag the person right to settle into the sofa, then grab them again for that last small lean back.',
    verdict: 'Comfort: connected. Charger: disconnected.',
    create(api) {
      const { ctx } = api;
      const source = { x: 74, y: 145 };
      const cableLength = 232;
      let phase = 'plug';
      let settled = 0;
      let lean = 0;
      let connected = false;
      let free = { x: 136, y: 182, angle: 0.12 };
      let gesture = null;
      let elapsed = 0;
      let breakFrom = null;
      let completed = false;

      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      function line(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      function transform(x, y, angle, dx, dy) {
        return { x: x + dx * Math.cos(angle) - dy * Math.sin(angle), y: y + dx * Math.sin(angle) + dy * Math.cos(angle) };
      }
      function phonePose() {
        return { x: 214 + settled * 66 + lean * 32, y: 138 + settled * 15 - lean * 6, angle: -0.06 + settled * 0.1 + lean * 0.15 };
      }
      function phonePort() {
        const p = phonePose();
        return transform(p.x, p.y, p.angle, 0, 31);
      }
      function connector() {
        if (!connected) return free;
        const p = phonePose();
        return { ...transform(p.x, p.y, p.angle, 0, 39), angle: p.angle };
      }
      function cableEnd() {
        const p = connector();
        return transform(p.x, p.y, p.angle, 0, 9);
      }
      function bodyPose() {
        return {
          headX: 248 + settled * 66 + lean * 39,
          headY: 87 + settled * 13 + lean * 3,
          shoulderX: 253 + settled * 63 + lean * 28,
          shoulderY: 117 + settled * 12 + lean * 5,
          hipX: 278 + settled * 54,
          hipY: 198 + settled * 4,
        };
      }
      function distance() {
        const end = cableEnd();
        return Math.hypot(end.x - source.x, end.y - source.y);
      }

      function sofa() {
        api.ellipse(315, 244, 149, 13, '#101e2966');
        api.round(171, 106, 288, 119, 25, '#466b6b');
        api.round(185, 114, 129, 88, 18, '#62877e');
        api.round(319, 114, 126, 88, 18, '#60847b');
        line([[195, 129], [195, 179]], '#89a39455', 1.5);
        line([[330, 127], [330, 180]], '#89a39455', 1.5);
        api.round(183, 183, 257, 49, 15, '#77968a');
        api.line(309, 190, 310, 228, '#41696a', 2);
        api.round(164, 158, 43, 78, 15, '#547976');
        api.round(428, 151, 45, 85, 15, '#537874');
        api.round(169, 158, 34, 16, 8, '#819b89');
        api.round(433, 152, 35, 16, 8, '#819b89');
        api.rect(180, 233, 11, 14, '#665742');
        api.rect(446, 233, 11, 14, '#665742');
        line([[215, 223], [299, 223]], '#9bb09b55', 1);
        line([[320, 223], [420, 223]], '#9bb09b55', 1);
        // One soft cushion compresses as the person finally leans against it.
        ctx.save();
        ctx.translate(397, 169);
        ctx.rotate(0.13 - lean * 0.05);
        api.round(-26, -30, 49, 58 - lean * 6, 10, '#b7a077');
        line([[-18, -23], [15, -23]], '#d1b78a77', 1);
        line([[-18, 19], [14, 19]], '#87795655', 1);
        ctx.restore();
      }

      function person() {
        const b = bodyPose();
        const p = phonePose();
        line([[b.hipX - 5, b.hipY], [b.hipX - 22, 218], [b.hipX - 48, 235]], '#425e70', 24);
        line([[b.hipX + 8, b.hipY], [b.hipX - 5, 223], [b.hipX - 28, 240]], '#536f7d', 22);
        api.round(b.hipX - 67, 229, 32, 14, 7, '#c3b593');
        api.round(b.hipX - 47, 235, 33, 13, 6, '#d1c09b');
        ctx.beginPath();
        ctx.moveTo(b.shoulderX - 18, b.shoulderY);
        ctx.quadraticCurveTo(b.shoulderX + 3, b.shoulderY - 8, b.shoulderX + 23, b.shoulderY + 5);
        ctx.lineTo(b.hipX + 19, b.hipY + 2);
        ctx.quadraticCurveTo(b.hipX - 3, b.hipY + 10, b.hipX - 28, b.hipY + 1);
        ctx.closePath();
        ctx.fillStyle = '#b79b6e';
        ctx.fill();
        line([[b.shoulderX + 14, b.shoulderY + 16], [b.hipX + 10, b.hipY - 8]], '#d2b98455', 1.5);
        line([[b.shoulderX - 13, b.shoulderY + 18], [b.hipX - 18, b.hipY - 9]], '#8d795844', 1);
        api.poly([[b.headX - 7, b.headY + 20], [b.headX + 11, b.headY + 20], [b.shoulderX + 10, b.shoulderY + 6], [b.shoulderX - 10, b.shoulderY + 5]], '#bb8d72');
        api.ellipse(b.headX, b.headY, 22, 28, '#d2a588');
        api.poly([[b.headX - 18, b.headY - 2], [b.headX - 29, b.headY + 7], [b.headX - 19, b.headY + 12]], '#d2a588');
        api.ellipse(b.headX + 16, b.headY + 5, 5, 8, '#ba8d75');
        ctx.beginPath();
        ctx.moveTo(b.headX - 22, b.headY - 10);
        ctx.bezierCurveTo(b.headX - 26, b.headY - 38, b.headX + 27, b.headY - 37, b.headX + 25, b.headY - 3);
        ctx.lineTo(b.headX + 18, b.headY + 12);
        ctx.lineTo(b.headX + 11, b.headY - 13);
        ctx.lineTo(b.headX - 1, b.headY - 17);
        ctx.quadraticCurveTo(b.headX - 12, b.headY - 9, b.headX - 22, b.headY - 10);
        ctx.fillStyle = '#4d443e';
        ctx.fill();
        line([[b.headX - 17, b.headY + 1], [b.headX - 10, b.headY + 2]], '#5e4c40', 1.5);
        line([[b.headX - 18, b.headY + 17], [b.headX - 10, b.headY + 18]], '#9a715b', 1.2);
        // Phone and hands are rigidly tied to this same moving body pose.
        line([[b.shoulderX + 10, b.shoulderY + 18], [b.shoulderX + 9, b.shoulderY + 43], [p.x + 18, p.y + 20]], '#a18760', 15);
        line([[b.shoulderX - 10, b.shoulderY + 17], [b.shoulderX - 14, b.shoulderY + 39], [p.x + 12, p.y + 18]], '#c4aa78', 14);
        api.ellipse(p.x + 16, p.y + 16, 10, 8, '#d5a98a');
      }

      function phone() {
        const p = phonePose();
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        api.round(-20, -33, 40, 65, 6, '#152d38');
        api.round(-17, -29, 34, 56, 3, '#365968');
        api.line(-4, -30, 4, -30, '#8aa49a', 1.5);
        api.round(-11, -19, 21, 10, 2, '#c4d8bf');
        api.rect(10, -16, 3, 4, '#c4d8bf');
        api.rect(-9, -17, 17, 6, '#294551');
        api.rect(-8, -16, connected ? 14 : 3, 4, connected ? '#b6df95' : '#e29476');
        if (connected) api.poly([[3, -3], [-4, 7], [0, 7], [-2, 16], [6, 4], [2, 4]], '#d9ebb0');
        else {
          api.round(-6, -1, 12, 13, 2, '#a76355');
          api.rect(-1, 1, 2, 6, '#f2d5aa');
          api.rect(-1, 9, 2, 1.5, '#f2d5aa');
        }
        api.text(connected ? 'CHARGING' : '8%', 0, 23, connected ? 5 : 7, connected ? '#c8dfb7' : '#efc2a0');
        api.rect(-4, 30, 8, 2, '#061b26');
        api.round(15, 7, 6, 17, 3, '#d0a081');
        ctx.restore();
      }

      function cord() {
        const end = cableEnd();
        const length = distance();
        let sag = Math.sqrt(Math.max(0, cableLength * cableLength - length * length)) * 0.38;
        if (phase === 'recoil') sag += Math.sin(elapsed * 23) * Math.exp(-elapsed * 5) * 6;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo((source.x + end.x) / 2, (source.y + end.y) / 2 + sag, end.x, end.y);
        ctx.strokeStyle = '#182b35';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = '#cfdbcb';
        ctx.lineWidth = 3;
        ctx.stroke();
        const plug = connector();
        ctx.save();
        ctx.translate(plug.x, plug.y);
        ctx.rotate(plug.angle);
        api.round(-5, -5, 10, 14, 2, '#e0e4ce');
        api.rect(-3, -8, 6, 5, '#7c9796');
        api.line(-2, 0, 2, 0, '#acbcb1', 1);
        api.rect(-2, 8, 4, 3, '#a6beb2');
        ctx.restore();
        if (connected && length > 224) {
          const port = phonePort();
          line([[port.x - 12, port.y + 5], [port.x - 17, port.y + 1]], '#f0d3a0', 1.4);
          line([[port.x + 9, port.y + 6], [port.x + 13, port.y + 1]], '#f0d3a0', 1.4);
        }
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#2b3c46');
        for (let x = 17; x < 480; x += 45) api.line(x, 0, x, 226, '#a6ae8c0b', 1);
        api.rect(0, 230, 480, 40, '#4c4c45');
        api.rect(0, 225, 480, 6, '#8c8d75');
        api.line(0, 225, 480, 225, '#c2b89755', 1);
        api.round(89, 37, 85, 52, 3, '#b3a27d');
        api.rect(94, 42, 75, 42, '#5e7d78');
        api.poly([[95, 82], [116, 56], [137, 76], [157, 53], [168, 81]], '#b4bd99');
        api.ellipse(108, 52, 5, 5, '#e2c48d');
        api.round(42, 97, 30, 47, 3, '#bec9b5');
        api.ellipse(51, 109, 1.5, 2, '#577378');
        api.ellipse(62, 109, 1.5, 2, '#577378');
        api.round(53, 118, 28, 28, 4, '#e1e2c9');
        api.line(58, 122, 74, 122, '#fff2d777', 1);
        api.ellipse(source.x, source.y - 1, 3, 2, '#9fb3a7');
        sofa();
        person();
        phone();
        cord();
        if (phase === 'plug') {
          line([[153, 169], [186, 171]], '#eadfb6', 1.8);
          line([[181, 166], [186, 171], [180, 175]], '#eadfb6', 1.8);
          api.text('PLUG THE PHONE IN', 105, 254, 8, '#e3d9b4');
        } else if (phase === 'settle') {
          line([[286, 153], [319, 153]], '#eee1b1', 2);
          line([[313, 148], [319, 153], [313, 158]], '#eee1b1', 2);
          api.text('SETTLE INTO THE SOFA', 123, 254, 8, '#e3d9b4');
        } else if (phase === 'lean') {
          api.text('JUST A LITTLE FARTHER BACK…', 139, 254, 8, '#e3d9b4');
        } else if (phase === 'unplugging' && elapsed < 0.2) {
          const p = phonePort();
          ctx.save();
          ctx.globalAlpha = 1 - elapsed / 0.2;
          line([[p.x - 10, p.y + 6], [p.x - 19, p.y + 7]], '#f7db9f', 2);
          line([[p.x + 8, p.y + 6], [p.x + 14, p.y + 12]], '#f7db9f', 2);
          ctx.restore();
        }
      }

      return {
        draw,
        down(p) {
          if (phase === 'plug' && api.near(p, free.x, free.y, 25)) {
            gesture = { kind: 'plug', dx: p.x - free.x, dy: p.y - free.y };
          } else if (phase === 'settle' || phase === 'lean') {
            const b = bodyPose();
            if (api.hit(p, (b.shoulderX + b.hipX) / 2, 156, 100, 116)) {
              gesture = { kind: phase, startX: p.x, startPose: phase === 'settle' ? settled : lean };
            }
          }
        },
        move(p) {
          if (!gesture) return;
          if (gesture.kind === 'plug') {
            free.x = api.clamp(p.x - gesture.dx, 35, 420);
            free.y = api.clamp(p.y - gesture.dy, 42, 242);
            free.angle = phonePose().angle;
          } else if (gesture.kind === 'settle') {
            settled = api.clamp(gesture.startPose + (p.x - gesture.startX) / 62, 0, 1);
          } else {
            lean = api.clamp(gesture.startPose + (p.x - gesture.startX) / 34, 0, 1);
            if (distance() >= 231.5) {
              breakFrom = { ...connector(), lean };
              free = { ...connector() };
              connected = false;
              phase = 'unplugging';
              elapsed = 0;
              gesture = null;
              api.tone(900, 0.055, 0.02, 0.2);
              api.say('There. Comfortable. And no longer charging.');
            }
          }
        },
        up() {
          if (!gesture) return;
          if (gesture.kind === 'plug') {
            const tip = transform(free.x, free.y, free.angle, 0, -8);
            const port = phonePort();
            if (api.near(tip, port.x, port.y, 17) && Math.hypot(free.x - 136, free.y - 182) > 20) {
              connected = true;
              phase = 'settle';
              api.say('Charging. Get comfortable.');
              api.tone(630, 0.08, 0.016);
            } else free = { x: 136, y: 182, angle: 0.12 };
          } else if (gesture.kind === 'settle' && settled >= 0.95) {
            settled = 1;
            phase = 'lean';
            api.say('Nearly comfortable. One tiny lean back.');
          }
          gesture = null;
        },
        cancel() {
          if (gesture?.kind === 'plug') free = { x: 136, y: 182, angle: 0.12 };
          gesture = null;
        },
        update(dt) {
          if (phase !== 'unplugging' && phase !== 'recoil') return;
          elapsed += dt;
          if (phase === 'unplugging') {
            const p = smooth(elapsed / 0.38);
            lean = breakFrom.lean + (1 - breakFrom.lean) * p;
            free.x = breakFrom.x - p * 45;
            free.y = breakFrom.y + Math.sin(p * Math.PI / 2) * 30;
            free.angle = breakFrom.angle + p * 0.45;
            if (elapsed >= 0.38) { phase = 'recoil'; elapsed = 0; }
          } else {
            free.x = breakFrom.x - 45 + Math.sin(elapsed * 17) * Math.exp(-elapsed * 7) * 3;
            free.y = breakFrom.y + 30 + Math.sin(elapsed * 21) * Math.exp(-elapsed * 7) * 2;
            if (elapsed >= 0.65) {
              phase = 'complete';
              free.x = breakFrom.x - 45;
              free.y = breakFrom.y + 30;
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          const c = connector(), port = phonePort();
          const tip = transform(c.x, c.y, c.angle, 0, -8);
          const end = cableEnd();
          return {
            phase, settled, lean, connected, charging: connected,
            phoneX: phonePose().x, phoneY: phonePose().y,
            plugX: c.x, plugY: c.y,
            phonePort: port, connectorTip: tip, wireEndpoint: end,
            connectionGap: Math.hypot(tip.x - port.x, tip.y - port.y),
            cableDistance: distance(), cableSlack: Math.max(0, cableLength - distance()),
            taut: connected && distance() > 224,
            batteryColor: connected ? 'green' : 'red',
            dragging: gesture ? gesture.kind : null, completed,
          };
        },
      };
    },
  });
})();
