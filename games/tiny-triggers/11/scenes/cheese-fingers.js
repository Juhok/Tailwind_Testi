(function () {
  'use strict';
  TinyV5.register({
    id: 'cheese-fingers', title: 'Cheese-Puff Fingers', chapter: 'digital',
    description: 'Have a cheese puff. Move the mouse. Press and release Space.',
    hint: 'Drag the puff from the bag into the mouth. Drag the mouse a short distance on its pad. Hold the large SPACE key, then let go.',
    verdict: 'The keyboard has acquired a cheese-based operating system.',
    create(api) {
      const { ctx } = api;
      let phase = 'snack', gesture = null, fingerOrange = false, elapsed = 0, time = 0;
      let puff = { x: 72, y: 74 }, mx = 378, my = 177, mouseTravel = 0;
      let start = null, keyDepression = 0, rise = 0;
      let hand = { x: 143, y: 87 }, handTarget = { x: 143, y: 87 };
      const mouseStains = [], keyStains = [];
      const key = { x: 211, y: 216, w: 105, h: 20 };
      function print(x, y, size, angle = 0) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        api.ellipse(0, 0, size * 0.62, size, '#e99528d9');
        ctx.strokeStyle = '#bd651ca6'; ctx.lineWidth = 0.6;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.ellipse(0, 1, size * (0.24 + i * 0.12), size * (0.38 + i * 0.17), 0, 0.2, Math.PI * 1.82); ctx.stroke();
        }
        api.ellipse(size * 0.65, -size * 0.35, 1.2, 1.3, '#efa23d');
        ctx.restore();
      }
      function drawPuff(x, y, size = 1) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.4); ctx.scale(size, size);
        api.round(-11, -5, 23, 11, 5, '#f5a637', '#c97720');
        api.ellipse(-7, -2, 5, 5, '#ffc462'); api.ellipse(2, 0, 7, 5, '#f1a13a');
        for (const dot of [[-8, 1], [-1, -3], [7, 2], [3, 3]]) api.ellipse(dot[0], dot[1], 1, 0.8, '#d68026');
        ctx.restore();
      }
      function drawHand() {
        const x = hand.x, y = hand.y;
        ctx.save(); ctx.translate(x, y);
        api.round(-4, 29, 26, 40, 8, '#bc866d');
        api.round(-3, 30, 27, 27, 8, '#d3a17e');
        api.round(-7, 12, 31, 31, 10, '#e3b58e', '#bb866d');
        api.round(-7, -3, 12, 30, 6, '#e7bc95', '#bf8d70');
        api.round(5, 8, 11, 24, 5, '#e5b58c', '#bd886d');
        api.round(15, 13, 10, 21, 5, '#ddb087', '#bd886d');
        ctx.save(); ctx.translate(-7, 24); ctx.rotate(-0.55);
        api.round(-7, -2, 11, 24, 5, '#dfae85', '#b9836c'); ctx.restore();
        api.line(-2, 19, 2, 19, '#c19173', 0.8);
        api.line(9, 24, 13, 24, '#c19173', 0.8);
        if (fingerOrange) {
          api.round(-6.4, -2, 10.8, 11, 5, '#ec9a2be6');
          api.round(6, 9, 9, 8, 4, '#ec9a2bd4');
          api.round(16, 14, 8, 7, 3, '#ed9f34c7');
          api.ellipse(-11, 26, 3, 5, '#e7982bd4');
          api.ellipse(5, 33, 2, 1.5, '#d78323');
        }
        api.round(-5, 59, 32, 12, 2, '#657a94');
        ctx.restore();
      }
      function drawKeyboard() {
        api.round(100, 143, 223, 101, 8, '#0b151f');
        api.round(98, 136, 223, 103, 8, '#536171', '#81909c');
        api.round(104, 143, 211, 89, 5, '#263441');
        const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
        rows.forEach((letters, row) => {
          const offset = row === 0 ? 110 : row === 1 ? 119 : 137;
          [...letters].forEach((letter, col) => {
            const x = offset + col * 20, y = 149 + row * 19;
            api.round(x, y + 2, 17, 16, 2, '#17232e');
            api.round(x, y, 17, 14, 2, '#a6afb1', '#d1d3ca');
            api.text(letter, x + 8.5, y + 10, 7, '#35434f');
          });
        });
        api.round(113, 207, 35, 18, 3, '#7f8d95', '#a6b4b9');
        api.text('Ctrl', 131, 219, 6.5, '#24333e');
        api.round(275, 207, 32, 18, 3, '#7f8d95', '#a6b4b9');
        api.text('Alt', 291, 219, 6.5, '#24333e');
        const x = key.x - key.w / 2, y = 205 + keyDepression * 10;
        api.round(x - 2, 204, key.w + 4, 29, 3, '#101e2a');
        api.round(x, y + 4, key.w, 19, 3, '#637984');
        api.round(x, y, key.w, 18, 3, '#bcc5c2', '#dbe0d5');
        api.text('SPACE', key.x, y + 12, 7.5, '#4e646d');
        keyStains.forEach((s) => print(key.x + s.x, y + s.y, s.size, s.angle));
        if (phase === 'rising' && rise > 0.1 && rise < 0.9) {
          for (const dx of [-31, 21]) {
            api.line(key.x + dx, y + 18, key.x + dx + 2, 233, '#d99a39', 1.2);
          }
        }
      }
      function drawMouse() {
        api.round(333, 128, 112, 111, 10, '#172831', '#4e6976');
        api.line(343, 229, 435, 229, '#3c5662', 1);
        curveCable();
        api.ellipse(mx + 3, my + 7, 28, 37, '#0b141c');
        api.ellipse(mx, my, 27, 36, '#c0cbca');
        api.ellipse(mx, my - 6, 24, 27, '#d6ded6');
        api.line(mx, my - 34, mx, my - 6, '#8c9d9f', 1.2);
        api.line(mx - 23, my - 6, mx + 23, my - 6, '#8c9d9f', 1);
        api.round(mx - 3, my - 26, 6, 12, 3, '#566c78');
        for (let i = 0; i < 3; i++) api.line(mx - 2, my - 24 + i * 3, mx + 2, my - 24 + i * 3, '#91a0a5', 0.7);
        mouseStains.forEach((s) => print(mx + s.x, my + s.y, s.size, s.angle));
      }
      function curveCable() {
        ctx.beginPath(); ctx.moveTo(mx, my - 35); ctx.bezierCurveTo(mx - 12, 100, 417, 119, 421, 83); ctx.strokeStyle = '#101d28'; ctx.lineWidth = 3; ctx.stroke();
      }
      function mouseHit(p) { return ((p.x - mx) / 29) ** 2 + ((p.y - my) / 38) ** 2 < 1; }
      return {
        draw() {
          api.bg('desk');
          // An open, folded snack bag and a few remaining puffs.
          api.poly([[25, 74], [40, 62], [110, 61], [126, 74], [121, 163], [31, 165]], '#d67428');
          api.poly([[25, 74], [43, 82], [111, 79], [126, 74], [112, 55], [40, 57]], '#f1be66');
          api.ellipse(76, 73, 40, 10, '#623b2d');
          drawPuff(52, 73, 0.7); drawPuff(92, 74, 0.8);
          api.poly([[32, 91], [119, 86], [117, 151], [34, 158]], '#ed9440');
          api.text('CHEEZY', 76, 107, 13, '#fff0c5');
          api.text('PUFFS', 76, 124, 13, '#fff0c5');
          drawPuff(68, 140, 0.85); drawPuff(87, 138, 0.65);
          api.line(40, 161, 112, 159, '#f2bb6b', 2);
          // Small face, with a real mouth target for the eating gesture.
          api.round(206, 83, 51, 20, 8, '#687f96');
          api.ellipse(231, 56, 28, 33, '#d9a77d');
          api.ellipse(231, 33, 25, 11, '#4b3635');
          api.ellipse(220, 49, 2, 2.5, '#3a3033'); api.ellipse(242, 49, 2, 2.5, '#3a3033');
          api.line(230, 52, 228, 60, '#b57d5d', 1);
          if (phase === 'snack') api.ellipse(231, 69, 10, 7, '#5b3331');
          else if (phase === 'chewing') api.ellipse(231, 69, 8, 3 + Math.sin(time * 25) * 2, '#5b3331');
          else { api.line(223, 69, 238, 69, '#77453b', 2); api.ellipse(237, 72, 1.5, 1.3, '#e68d2c'); }
          drawKeyboard(); drawMouse();
          if (phase === 'snack' && gesture !== 'puff') drawPuff(puff.x, puff.y);
          if (phase === 'chewing') {
            for (let i = 0; i < 5; i++) api.ellipse(218 + i * 6, 80 + elapsed * 26 + (i % 2) * 4, 1.5, 1, '#efa135');
          }
          drawHand();
          if (gesture === 'puff') drawPuff(puff.x, puff.y - 3);
          const instruction = phase === 'snack' ? 'A QUICK SNACK FIRST.' : phase === 'mouse' ? 'MOVE THE MOUSE ON ITS PAD.' : phase === 'keyboard' || phase === 'pressed' ? 'PRESS SPACE. THEN LET GO.' : phase === 'rising' ? 'STILL COMING BACK UP…' : phase === 'done' ? 'THAT KEY WILL REMEMBER.' : '';
          api.text(instruction, 240, 260, 8.5, '#c3ced0');
        },
        down(p) {
          if (phase === 'snack' && api.near(p, puff.x, puff.y, 25)) { gesture = 'puff'; handTarget = { x: p.x, y: p.y }; }
          else if (phase === 'mouse' && mouseHit(p)) {
            gesture = 'mouse'; start = { x: p.x, y: p.y, mx, my }; mouseTravel = 0;
            handTarget = { x: p.x, y: p.y };
            if (mouseStains.length < 3) mouseStains.push({ x: p.x - mx, y: p.y - my, size: 7, angle: -0.3 });
            api.tone(430, 0.03, 0.012);
          } else if (phase === 'keyboard' && api.hit(p, key.x, key.y, key.w, 27)) {
            phase = 'pressed'; gesture = 'key'; keyDepression = 1;
            handTarget = { x: p.x, y: p.y + 10 };
            keyStains.push({ x: p.x - key.x, y: api.clamp(p.y - 205, 3, 15), size: 6.5, angle: -0.15 });
            api.tone(230, 0.045, 0.015);
          }
        },
        move(p) {
          if (gesture === 'puff') { puff = { x: p.x, y: p.y }; handTarget = { x: p.x, y: p.y }; }
          if (gesture === 'mouse') {
            const nx = api.clamp(start.mx + p.x - start.x, 363, 415), ny = api.clamp(start.my + p.y - start.y, 166, 196);
            mouseTravel += Math.hypot(nx - mx, ny - my); mx = nx; my = ny;
            handTarget = { x: mx + (start.x - start.mx), y: my + (start.y - start.my) };
          }
        },
        up(p) {
          if (gesture === 'puff') {
            if (api.near(p, 231, 68, 26)) {
              phase = 'chewing'; elapsed = 0; fingerOrange = true; handTarget = { x: 147, y: 72 }; api.say('Delicious. Now move the mouse.'); api.tone(480, 0.05, 0.013);
            } else { puff = { x: 72, y: 74 }; handTarget = { x: 143, y: 87 }; }
          }
          if (gesture === 'mouse') {
            handTarget = { x: 337, y: 54 };
            if (mouseTravel >= 18) { phase = 'keyboard'; api.say('An orange mouse. Now press and release Space.'); }
            else api.say('Slide the mouse a little on its pad.');
          }
          if (gesture === 'key') {
            phase = 'rising'; elapsed = 0; rise = 0; handTarget = { x: 347, y: 48 }; api.say('The key is taking its time.');
          }
          gesture = null;
        },
        cancel() {
          if (gesture === 'puff') { puff = { x: 72, y: 74 }; handTarget = { x: 143, y: 87 }; }
          if (gesture === 'key') { phase = 'keyboard'; keyDepression = 0; handTarget = { x: 337, y: 54 }; }
          gesture = null;
        },
        update(dt) {
          time += dt;
          const speed = Math.min(1, dt * (gesture ? 25 : 9));
          hand.x += (handTarget.x - hand.x) * speed; hand.y += (handTarget.y - hand.y) * speed;
          if (phase === 'chewing') { elapsed += dt; if (elapsed >= 0.65) phase = 'mouse'; }
          if (phase === 'rising') {
            elapsed += dt; rise = api.clamp((elapsed - 0.3) / 2.8, 0, 1); keyDepression = 1 - rise ** 1.8;
            if (elapsed >= 3.45) { keyDepression = 0; phase = 'done'; api.say('Orange fingerprints. One very sticky spacebar.'); api.tone(320, 0.06, 0.013); api.done(); }
          }
        },
        debug() {
          return { phase, fingerOrange, puff: { ...puff }, mouse: { x: mx, y: my }, mouseTravel, mouseStains: mouseStains.map((s) => ({ x: s.x, y: s.y })), keyStains: keyStains.map((s) => ({ x: s.x, y: s.y })), keyDepression, rise, elapsed };
        },
      };
    },
  });
})();
