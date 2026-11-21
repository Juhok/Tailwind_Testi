(function () {
  'use strict';
  TinyV5.register({
    id: 'elevator', title: 'The Elevator Door Button', chapter: 'home',
    description: 'The hallway is empty. Press Close Doors.',
    hint: 'Press and release the right-hand CLOSE button on the control panel. Watch the gap between the doors.',
    verdict: 'Holding the elevator for someone who does not exist.',
    create(api) {
      const { ctx } = api;
      let phase = 'ready', closure = 0, elapsed = 0, pauseElapsed = 0, armed = false, reopenComplete = false;
      const center = 220, apertureLeft = 105, apertureRight = 335, travel = 111;
      const closeHit = (p) => api.near(p, 432, 178, 23);
      const smooth = (p) => p * p * (3 - 2 * p);
      function doorway() {
        // A genuinely empty corridor, with receding tiles and unoccupied rooms.
        ctx.save(); ctx.beginPath(); ctx.rect(105, 53, 230, 185); ctx.clip();
        api.rect(105, 53, 230, 185, '#c3b899');
        api.poly([[105, 53], [182, 85], [182, 173], [105, 238]], '#a29f8c');
        api.poly([[335, 53], [258, 85], [258, 173], [335, 238]], '#bab29b');
        api.rect(182, 85, 76, 88, '#d5cab0');
        api.poly([[105, 53], [335, 53], [258, 85], [182, 85]], '#d4d0b7');
        api.poly([[105, 238], [182, 173], [258, 173], [335, 238]], '#a2957c');
        for (const y of [181, 193, 210, 232]) api.line(105, y, 335, y, '#c4b69b', 1);
        for (const x of [99, 160, 220, 280, 341]) api.line(220 + (x - 220) * 0.29, 173, x, 238, '#c6b99f', 1);
        api.line(105, 228, 182, 168, '#e0d5b7', 2);
        api.line(335, 228, 258, 168, '#e0d5b7', 2);
        // Far door and a wall light are plainly objects, never a hidden person.
        api.round(207, 99, 35, 73, 2, '#837a66', '#e2d7b7');
        api.rect(212, 104, 25, 64, '#a2987e');
        api.ellipse(232, 140, 1.5, 1.5, '#e9d6a2');
        api.rect(126, 111, 11, 22, '#ded2ab');
        api.rect(127, 113, 9, 15, '#f5e9bd');
        api.poly([[122, 135], [143, 135], [152, 161], [114, 161]], '#e8d19f19');
        api.poly([[196, 66], [244, 66], [239, 70], [201, 70]], '#fff2c9');
        api.poly([[208, 78], [231, 78], [229, 80], [210, 80]], '#fff1c4');
        ctx.restore();
      }
      function leaf(x, left) {
        const metal = ctx.createLinearGradient(x, 0, x + 118, 0);
        metal.addColorStop(0, '#576d79'); metal.addColorStop(0.22, '#889da3');
        metal.addColorStop(0.55, '#a5b4b1'); metal.addColorStop(0.78, '#7d9199'); metal.addColorStop(1, '#536a78');
        api.rect(x, 53, 118, 185, metal);
        for (let i = 0; i < 22; i++) api.line(x + 2, 61 + i * 8, x + 116, 61 + i * 8, i % 3 ? '#e4eee30a' : '#243f4e14', 0.6);
        api.rect(x + (left ? 114 : 0), 53, 4, 185, '#263f4b');
        api.line(x + (left ? 112 : 5), 55, x + (left ? 112 : 5), 237, '#c8d1c7', 1);
        api.line(x + 17, 53, x + 17, 238, '#d6ddd022', 1);
      }
      function doorIcon(x, y, closing, color) {
        api.line(x, y - 8, x, y + 8, color, 1.2);
        if (closing) {
          api.poly([[x - 13, y - 7], [x - 13, y + 7], [x - 3, y]], color);
          api.poly([[x + 13, y - 7], [x + 13, y + 7], [x + 3, y]], color);
        } else {
          api.poly([[x - 3, y - 7], [x - 3, y + 7], [x - 13, y]], color);
          api.poly([[x + 3, y - 7], [x + 3, y + 7], [x + 13, y]], color);
        }
      }
      return {
        draw() {
          api.bg('desk');
          // Interior walls and floor create a view from inside the lift.
          const wall = ctx.createLinearGradient(0, 0, 480, 0);
          wall.addColorStop(0, '#526a76'); wall.addColorStop(0.2, '#879a9c'); wall.addColorStop(0.75, '#84989b'); wall.addColorStop(1, '#405b6c');
          api.rect(0, 0, 480, 270, wall);
          api.poly([[0, 238], [480, 238], [480, 270], [0, 270]], '#354b58');
          api.line(39, 238, 0, 270, '#81918d', 1); api.line(401, 238, 480, 270, '#81918d', 1);
          api.line(0, 261, 480, 261, '#526773', 1);
          api.rect(88, 38, 264, 204, '#223a48');
          api.rect(96, 46, 248, 194, '#81989d');
          api.rect(102, 51, 236, 187, '#152e3d');
          doorway();
          // Warm floor light narrows exactly with the physical doorway gap.
          const gap = 230 - closure * 222;
          api.poly([[center - gap / 2, 239], [center + gap / 2, 239], [center + gap * 0.65, 269], [center - gap * 0.65, 269]], '#c4bd8f24');
          ctx.save(); ctx.beginPath(); ctx.rect(apertureLeft, 53, 230, 185); ctx.clip();
          leaf(apertureLeft - 118 + travel * closure, true);
          leaf(apertureRight - travel * closure, false);
          ctx.restore();
          api.rect(96, 237, 248, 7, '#b5c0b6');
          api.line(105, 239, 335, 239, '#455d66', 1);
          api.line(105, 242, 335, 242, '#6d858c', 1);
          api.line(95, 48, 95, 236, '#b3c1b9', 2); api.line(345, 48, 345, 236, '#b3c1b9', 2);
          // Floor display, overhead downlights, and a small control panel.
          api.round(170, 10, 100, 26, 4, '#1a303c', '#95a69f');
          api.text('03', 207, 24, 16, '#d4dfbc');
          if (phase === 'closing' || phase === 'paused') doorIcon(247, 24, true, phase === 'paused' ? '#e7b879' : '#b9d9bc');
          else doorIcon(247, 24, false, phase === 'ready' ? '#667f8b' : '#c5dcbc');
          api.round(20, 20, 43, 5, 2, '#e9e6cd'); api.round(402, 20, 43, 5, 2, '#e9e6cd');
          api.round(370, 76, 88, 157, 8, '#2e495a', '#9eafaa');
          api.text('FLOOR', 414, 89, 7, '#a8bbb9');
          for (const [x, label] of [[392, '1'], [432, '3']]) {
            api.ellipse(x, 112, 14, 14, label === '3' ? '#a4c8b5' : '#718b94');
            api.text(label, x, 112, 11, '#2e4d5a');
          }
          api.line(380, 137, 448, 137, '#6a838d', 1);
          api.text('DOORS', 414, 149, 7, '#b7c7c1');
          api.ellipse(392, 178, 17, 17, '#78909a');
          const lit = armed || phase === 'closing' || phase === 'paused';
          api.ellipse(432, 178, 18, 18, lit ? '#c8d8ac' : '#97b5ae');
          api.ellipse(432, 178, 14.5, 14.5, armed ? '#89ad98' : lit ? '#aac8aa' : '#9fbdb4');
          doorIcon(392, 178, false, '#2d4b5b'); doorIcon(432, 178, true, '#294e4b');
          api.text('OPEN', 392, 203, 6.8, '#c4cfca'); api.text('CLOSE', 432, 203, 6.8, '#d4ded0');
          api.ellipse(414, 219, 3, 3, '#d1bc83');
          // Side handrail, to reinforce the elevator interior rather than a
          // generic pair of doors or a screen-wide progress illustration.
          api.round(0, 183, 68, 8, 4, '#bdc7bd', '#456370');
          api.rect(16, 190, 7, 9, '#516d7b');
          if (phase === 'ready') api.text('AN EMPTY HALLWAY. LET’S GO.', 219, 260, 8, '#d5dfd2');
          else if (phase === 'paused') api.text('ALMOST…', 219, 260, 8.4, '#e4dcc0');
          else if (phase === 'done') api.text('STILL NOBODY THERE.', 219, 260, 8.4, '#d5dfd2');
        },
        down(p) { if (phase === 'ready') armed = closeHit(p); },
        move(p) { if (armed && !closeHit(p)) armed = false; },
        up(p) {
          if (armed && phase === 'ready' && closeHit(p)) {
            phase = 'closing'; elapsed = 0; api.say('Closing the doors…'); api.tone(130, 0.2, 0.012);
          }
          armed = false;
        },
        cancel() { armed = false; },
        update(dt) {
          if (phase === 'closing') {
            elapsed += dt; closure = smooth(api.clamp(elapsed / 2.5, 0, 1));
            if (elapsed >= 2.5) { closure = 1; phase = 'paused'; elapsed = 0; pauseElapsed = 0; api.say('Almost closed.'); }
          } else if (phase === 'paused') {
            elapsed += dt; pauseElapsed = elapsed;
            if (elapsed >= 1.35) { phase = 'reopening'; elapsed = 0; api.say('Reopening. For absolutely nobody.'); api.tone(640, 0.11, 0.015); }
          } else if (phase === 'reopening') {
            elapsed += dt; closure = 1 - smooth(api.clamp(elapsed / 1.75, 0, 1));
            if (elapsed >= 1.75) { closure = 0; phase = 'open-again'; elapsed = 0; reopenComplete = true; }
          } else if (phase === 'open-again') {
            elapsed += dt;
            if (elapsed >= 0.4) { phase = 'done'; api.say('Doors fully open. Hallway still empty.'); api.done(); }
          }
        },
        debug() {
          const leftEdge = apertureLeft + travel * closure, rightEdge = apertureRight - travel * closure;
          return { phase, armed, closure, gap: rightEdge - leftEdge, leftEdge, rightEdge, symmetryError: Math.abs((center - leftEdge) - (rightEdge - center)), elapsed, pauseElapsed, hallwayPeople: 0, reopened: reopenComplete };
        },
      };
    },
  });
})();
