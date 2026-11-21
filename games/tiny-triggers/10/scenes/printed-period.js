(() => {
  'use strict';

  TinyV5.register({
    id: 'printed-period',
    title: 'The Extra Printed Page',
    chapter: 'digital',
    description: 'Print the one-page note. Take your page.',
    hint: 'Click Print on the monitor. Wait for the full sheet, then drag it left onto the desk. The printer has one last thing to say.',
    verdict: 'An entire page. For the final full stop.',
    create(api) {
      const { ctx } = api;
      const slotY = 154;
      const pageW = 116;
      const pageH = 94;
      let phase = 'idle';
      let elapsed = 0;
      let firstFeed = 0;
      let secondFeed = 0;
      let firstRetrieved = false;
      let sheetX = 354;
      let sheetY = slotY + pageH / 2;
      let sheetAngle = 0;
      let gesture = null;
      let printPressed = false;
      let rollerTurns = 0;
      let completed = false;

      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      const printHit = (p) => api.hit(p, 70, 143, 67, 23);
      function line(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function note(x, y, small = false) {
        if (small) {
          api.text('A quick note', x + 31, y + 13, 5.4, '#344851');
          api.line(x + 9, y + 20, x + 53, y + 20, '#8a9995', 0.7);
          api.text('Keep this for later.', x + 31, y + 32, 4.2, '#54656a');
          api.text('Nothing else to add.', x + 31, y + 42, 4.2, '#54656a');
          api.text('That is everything.', x + 31, y + 59, 4.4, '#344851');
        } else {
          api.text('A quick note', x + pageW / 2, y + 19, 10, '#35454b');
          api.line(x + 13, y + 25, x + pageW - 13, y + 25, '#a6afa4', 0.9);
          api.text('Keep this for later.', x + pageW / 2, y + 41, 7, '#5c6969');
          api.text('Nothing else to add.', x + pageW / 2, y + 54, 7, '#5c6969');
          // Deliberately missing here: the exact final full stop on page two.
          api.text('That is everything', x + pageW / 2, y + 78, 8, '#243940');
        }
      }

      function sheet(x, y, isSecond = false, angle = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        const left = -pageW / 2, top = -pageH / 2;
        api.rect(left + 2.5, top + 3, pageW, pageH, '#132b3440');
        api.rect(left, top, pageW, pageH, '#f2ecd6');
        api.line(left + 1, top + 1, left + pageW - 1, top + 1, '#ffffed', 1);
        if (isSecond) {
          // Nothing else is printed on this sheet: just the overflow period.
          api.ellipse(left + 17, top + 20, 3, 3, '#25343d');
        } else note(left, top);
        ctx.restore();
      }

      function feedSheet(progress, second) {
        if (progress <= 0) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(283, slotY, 144, 103);
        ctx.clip();
        const top = slotY - pageH + pageH * progress;
        sheet(354, top + pageH / 2, second);
        ctx.restore();
      }

      function monitor() {
        api.round(113, 153, 19, 36, 3, '#657f84');
        api.round(86, 183, 73, 8, 3, '#91a49a');
        api.round(20, 25, 207, 140, 7, '#122d38');
        api.round(24, 29, 199, 132, 4, '#8ca39f');
        api.rect(29, 34, 189, 119, '#3e5965');
        api.rect(29, 34, 189, 13, '#263f4b');
        api.ellipse(36, 40, 2, 2, '#be8171');
        api.ellipse(43, 40, 2, 2, '#d6b46c');
        api.ellipse(50, 40, 2, 2, '#88a48a');
        api.text('PRINT PREVIEW', 127, 43, 6, '#c5d2bf');
        api.rect(92, 51, 62, 76, '#e9e7d1');
        api.rect(154, 53, 2, 76, '#1e38404f');
        note(92, 51, true);
        api.round(36, 132, 68, 22, 4, phase === 'idle' ? (printPressed ? '#658a80' : '#a9c6a6') : '#718f8e');
        api.text(phase === 'idle' ? 'PRINT' : completed ? 'DONE' : 'PRINTING', 70, 146, 9, '#203f47');
        api.text('1 PAGE', 176, 146, 9, '#dce4c9');
        api.ellipse(123, 159, 2, 1, '#ccddc5');
      }

      function printer() {
        api.ellipse(355, 225, 109, 19, '#172b3540');
        // A loaded rear hopper and molded case make the machine unmistakable.
        api.poly([[277, 91], [284, 45], [419, 45], [428, 91]], '#405c64');
        api.rect(291, 49, 116, 47, '#d6ddc7');
        api.rect(294, 46, 114, 47, '#ecead2');
        api.line(298, 51, 402, 51, '#fff7df', 1);
        api.poly([[254, 92], [275, 77], [435, 77], [456, 92]], '#afc0b4');
        api.round(253, 91, 204, 80, 8, '#829d9e');
        api.round(259, 95, 192, 55, 6, '#b7c8b9');
        api.rect(259, 143, 192, 17, '#59767d');
        api.line(265, 100, 446, 100, '#e2e8ce6b', 1);
        api.round(385, 108, 54, 18, 3, '#34505c');
        const count = secondFeed >= 1 ? '2 / 1' : firstFeed >= 1 ? '1 / 1' : 'READY';
        api.text(count, 412, 120, 8, '#c6dfbc');
        api.ellipse(273, 116, 5, 5, '#4e7077');
        api.ellipse(273, 115, 2, 2, phase === 'idle' ? '#afc39a' : '#d7e9ac');
        api.text('PAPERWORK', 327, 121, 7, '#5d7676');
        api.round(282, 142, 145, 15, 4, '#18343f');
        api.poly([[286, 158], [423, 158], [441, 250], [273, 250]], '#44636c');
        api.line(284, 245, 431, 245, '#79938e', 2);
        api.line(291, 169, 283, 241, '#71918b40', 1);
        api.line(417, 169, 430, 241, '#71918b40', 1);

        if (!firstRetrieved) {
          if (phase === 'first-feeding') feedSheet(firstFeed, false);
          else if (phase === 'first-ready') sheet(sheetX, sheetY, false, sheetAngle);
        }
        if (secondFeed > 0) feedSheet(secondFeed, true);

        // These rollers stay in front of the paper and visibly turn while feeding.
        for (const x of [301, 407]) {
          api.round(x - 6, 143, 12, 12, 3, '#45616b');
          api.round(x - 4, 144, 8, 10, 2, '#8aaba2');
          const shift = Math.sin(rollerTurns * Math.PI * 2) * 3;
          api.line(x - 3, 149 + shift, x + 3, 149 + shift, '#d0d9bf', 1.3);
        }
        api.line(287, 143, 422, 143, '#375560', 2);
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#293d49');
        for (let x = 25; x < 480; x += 55) api.line(x, 0, x, 175, '#82988b0c', 1);
        api.rect(0, 175, 480, 95, '#796c56');
        api.rect(0, 175, 480, 5, '#ad9570');
        for (let y = 191; y < 270; y += 21) api.line(0, y, 480, y + 2, '#bea07812', 1);
        api.round(27, 196, 64, 39, 5, '#3a5661');
        for (let row = 0; row < 3; row++) for (let col = 0; col < 6; col++) {
          api.round(33 + col * 9, 202 + row * 8, 6, 5, 1, '#819a97');
        }
        api.round(47, 228, 28, 3, 1, '#a2b4a5');
        monitor();
        printer();
        if (firstRetrieved) sheet(sheetX, sheetY, false, sheetAngle);
        if (phase === 'first-ready' && !gesture) {
          line([[286, 210], [255, 210]], '#ede2b7', 2);
          line([[261, 205], [255, 210], [261, 215]], '#ede2b7', 2);
          api.text('TAKE YOUR PAGE', 176, 207, 9, '#e2dbb8');
        }
        if (phase === 'first-ready' && gesture?.kind === 'sheet') {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#f3dfb36b';
          ctx.lineWidth = 1.3;
          ctx.strokeRect(111, 167, 120, 94);
          ctx.restore();
          // Lifted paper must render above the case and tray while being taken.
          sheet(sheetX, sheetY, false, sheetAngle);
        }
      }

      function resetSheet() {
        sheetX = 354;
        sheetY = slotY + pageH / 2;
        sheetAngle = 0;
      }

      return {
        draw,
        down(p) {
          if (phase === 'idle' && printHit(p)) {
            gesture = { kind: 'print', start: p, current: p };
            printPressed = true;
          } else if (phase === 'first-ready' && api.hit(p, sheetX, sheetY, pageW, pageH)) {
            gesture = { kind: 'sheet', dx: p.x - sheetX, dy: p.y - sheetY };
          }
        },
        move(p) {
          if (!gesture) return;
          if (gesture.kind === 'print') {
            gesture.current = p;
            printPressed = printHit(p);
          } else {
            sheetX = api.clamp(p.x - gesture.dx, 62, 418);
            sheetY = api.clamp(p.y - gesture.dy, 94, 220);
            sheetAngle = (sheetX - 354) * 0.00035;
          }
        },
        up() {
          if (!gesture) return;
          if (gesture.kind === 'print') {
            const moved = Math.hypot(gesture.current.x - gesture.start.x, gesture.current.y - gesture.start.y);
            if (printPressed && printHit(gesture.current) && moved < 12) {
              phase = 'first-feeding';
              elapsed = 0;
              api.say('One page. Coming right up.');
              api.tone(520, 0.08, 0.017, 0.4);
            }
            printPressed = false;
          } else if (sheetX < 237 && sheetY > 180 && sheetY < 225) {
            firstRetrieved = true;
            sheetX = 171;
            sheetY = 211;
            sheetAngle = -0.055;
            phase = 'second-start';
            elapsed = 0;
            api.say('Wait. The printer is still going.');
          } else resetSheet();
          gesture = null;
        },
        cancel() {
          if (gesture?.kind === 'sheet') resetSheet();
          gesture = null;
          printPressed = false;
        },
        update(dt) {
          if (['idle', 'first-ready', 'complete'].includes(phase)) return;
          elapsed += dt;
          if (phase === 'first-feeding') {
            rollerTurns += dt * 3;
            firstFeed = api.clamp(elapsed / 1.55, 0, 1);
            if (firstFeed >= 1) {
              phase = 'first-ready';
              elapsed = 0;
              resetSheet();
              api.say('Your one page. Take it from the tray.');
            }
          } else if (phase === 'second-start') {
            if (elapsed >= 0.32) {
              phase = 'second-feeding';
              elapsed = 0;
              api.tone(410, 0.1, 0.016, 0.4);
            }
          } else if (phase === 'second-feeding') {
            rollerTurns += dt * 3;
            secondFeed = api.clamp(elapsed / 1.65, 0, 1);
            if (secondFeed >= 1) {
              phase = 'dot-reveal';
              elapsed = 0;
              api.say('The last full stop needed its own page.');
            }
          } else if (phase === 'dot-reveal' && elapsed >= 0.65) {
            phase = 'complete';
            completed = true;
            api.done();
          }
        },
        debug() {
          return {
            phase, screenPages: 1, printPressed,
            firstFeed, secondFeed, rollerTurns, firstRetrieved,
            sheetX, sheetY, dragging: gesture ? gesture.kind : null,
            firstLastSentence: 'That is everything',
            secondPageCharacters: '.',
            dotVisible: secondFeed > (pageH - 20) / pageH,
            printedPages: (firstFeed >= 1 ? 1 : 0) + (secondFeed >= 1 ? 1 : 0),
            twoPagesVisible: firstRetrieved && secondFeed >= 1,
            completed,
          };
        },
      };
    },
  });
})();
