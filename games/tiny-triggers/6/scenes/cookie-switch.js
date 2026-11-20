(() => {
  'use strict';
  TinyV5.register({
    id: 'cookie-switch',
    title: 'The Cookie Button Switch',
    chapter: 'digital',
    description: 'Reject all cookies on this very considerate little website.',
    hint: 'Aim for Reject All on the left and press it. Watch the buttons move before you release. Moving away cancels the press.',
    verdict: 'Your preferences. Their interpretation.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const rejectStart = 164, acceptStart = 318, buttonY = 208;
      let phase = 0, time = 0, swap = 0, hover = null, held = false, pendingRelease = false;
      let accepted = false, confirmTime = 0, closeTime = 0, finished = false;
      let pressX = rejectStart, pressY = buttonY, cancels = 0, directAcceptAttempts = 0;
      const inButton = (p, x) => p && Math.abs(p.x - x) <= 66 && Math.abs(p.y - buttonY) <= 19;
      const ease = t => t * t * (3 - 2 * t);

      function cancelPress() {
        if (phase !== 1 && phase !== 2) return;
        held = pendingRelease = false; phase = 5; cancels++;
        api.say('You moved away. Nothing was saved. Aim for Reject All again.');
      }

      function cookie(x, y, radius = 18) {
        ellipse(x, y, radius, radius, '#be8e57');
        ellipse(x - 1, y - 2, radius - 2, radius - 2, '#d9ae70');
        for (const [dx, dy, size] of [[-8, -5, 2.8], [5, -8, 2.3], [-2, 4, 3], [8, 7, 2.5], [-9, 9, 2]]) {
          poly([[x + dx - size, y + dy - 1], [x + dx, y + dy - size], [x + dx + size, y + dy + 1], [x + dx - 1, y + dy + size]], '#73523e');
        }
        line(x - 12, y - 7, x - 10, y - 11, '#f3ce93', 1.5);
      }

      function pageArt() {
        rect(0, 0, 480, 270, '#223543');
        round(15, 17, 450, 245, 12, '#0c1b2680');
        round(15, 11, 450, 245, 12, '#d7ded7', '#73878e');
        ctx.save(); ctx.beginPath(); ctx.roundRect(16, 12, 448, 243, 11); ctx.clip();
        rect(16, 12, 448, 33, '#344b5d');
        for (let n = 0; n < 3; n++) ellipse(29 + n * 10, 25, 2.5, 2.5, ['#cc8d7b', '#d9bc78', '#8fae9a'][n]);
        round(69, 18, 105, 23, 5, '#516575');
        ellipse(81, 29, 4, 4, '#d3b982');
        text('Unbothered.', 124, 32, 8, '#e4e6db');
        round(184, 20, 254, 16, 5, '#243c4d');
        round(194, 25, 5, 6, 1, '#8ca5ad');
        ctx.beginPath(); ctx.arc(196.5, 25, 2, Math.PI, 0); ctx.strokeStyle = '#8ca5ad'; ctx.lineWidth = 1; ctx.stroke();
        text('unbothered.example', 309, 31, 8, '#bacbd0');
        rect(16, 45, 448, 210, '#f2eddf');
        text('Unbothered.', 42, 70, 18, '#354b50', 'left');
        text('Stories   Slow living   About', 339, 67, 8, '#677871');
        line(39, 80, 442, 80, '#bdc7b9', 1);
        text('ROOM TO BREATHE', 42, 99, 8, '#93815b', 'left');
        text('The art of', 42, 119, 19, '#3c5255', 'left');
        text('doing nothing.', 42, 141, 19, '#3c5255', 'left');
        text('Small stories for a quieter day.', 42, 160, 9, '#768077', 'left');
        for (let n = 0; n < 4; n++) round(43, 174 + n * 10, 184 - n % 2 * 23, 3, 1, '#c2c5b7');
        round(41, 221, 130, 20, 10, '#dbe1d2');
        text('Take a little break', 106, 235, 8, '#627666');
        // Original editorial illustration behind the banner: a reading nook.
        round(270, 93, 169, 118, 8, '#c5d1c3');
        rect(282, 106, 63, 73, '#7a9a9f');
        rect(288, 112, 51, 61, '#c6ddd7');
        poly([[289, 152], [305, 135], [316, 147], [339, 125], [339, 174], [289, 174]], '#91b0a1');
        line(313, 112, 313, 174, '#e7ead7', 3); line(288, 141, 339, 141, '#e7ead7', 3);
        ellipse(370, 200, 41, 6, '#7d958a50');
        round(353, 133, 48, 51, 10, '#b77c61');
        round(348, 166, 57, 20, 6, '#dca47d');
        round(345, 153, 10, 30, 5, '#cb926f'); round(399, 153, 10, 30, 5, '#cb926f');
        line(353, 184, 349, 201, '#735c49', 4); line(400, 184, 405, 201, '#735c49', 4);
        poly([[365, 147], [383, 142], [390, 158], [372, 164]], '#f1e0b8');
        line(374, 148, 383, 145, '#b8a17d', 1);
        round(293, 186, 22, 18, 3, '#aa8a6a');
        for (let n = 0; n < 5; n++) {
          ctx.save(); ctx.translate(304, 187); ctx.rotate(-.8 + n * .4);
          ellipse(0, -11, 4, 13, n % 2 ? '#6c8f79' : '#8ba38a'); ctx.restore();
        }
        text(accepted ? 'Cookie preferences: Accept All' : 'A little space for yourself.', 434, 236, 8, accepted ? '#926c50' : '#899185', 'right');
        ctx.restore();
      }

      function button(label, x, y, type, pressed = false) {
        const reject = type === 'reject';
        const highlighted = phase === 0 && hover === type;
        round(x - 66, y - 16 + (pressed ? 1 : 3), 132, 34, 6, reject ? '#c3c6bb' : '#956541');
        const fill = reject ? (highlighted ? '#e4eee1' : '#f4eee1') : pressed ? '#ac774b' : '#c08c58';
        round(x - 66, y - 18 + (pressed ? 2 : 0), 132, 34, 6, fill, reject ? (highlighted ? '#6f9d85' : '#637b7d') : '#a57449');
        text(label, x, y + 4 + (pressed ? 2 : 0), 12, reject ? '#3b5357' : '#fff4df');
        if (highlighted && reject) {
          round(x - 69, y - 21, 138, 40, 8, null, '#8eb39a');
        }
      }

      function banner() {
        const visibility = phase === 4 ? 1 - clamp(closeTime / .5, 0, 1) : 1;
        if (phase === 6 || visibility <= 0) return;
        ctx.save(); ctx.globalAlpha = visibility;
        ctx.translate(0, phase === 4 ? ease(1 - visibility) * 76 : 0);
        round(31, 128, 418, 125, 12, '#15283875');
        round(31, 122, 418, 125, 12, '#e9e3d4', '#aebcaf');
        cookie(65, 155, 20);
        text('Your privacy, your choice.', 104, 147, 13, '#354b53', 'left');
        text('A tiny choice before you read.', 104, 163, 10, '#6c7b75', 'left');
        const f = ease(swap), arc = Math.sin(swap * Math.PI);
        const rejectX = rejectStart + (acceptStart - rejectStart) * f;
        const acceptX = acceptStart - (acceptStart - rejectStart) * f;
        const rejectY = buttonY - arc * 27, acceptY = buttonY + arc * 15;
        button('Reject All', rejectX, rejectY, 'reject');
        button('Accept All', acceptX, acceptY, 'accept', (phase === 2 && held) || phase === 3);
        if (phase === 0) text('Manage preferences', 241, 239, 8, '#7a8379');
        if ((phase === 1 || phase === 2) && held) {
          // This visible press ring remains stationary while the controls move.
          ctx.beginPath(); ctx.arc(pressX, pressY, 43, -.42, Math.PI + .42);
          ctx.strokeStyle = '#fffdf08c'; ctx.lineWidth = 1.5; ctx.stroke();
          line(pressX - 73, pressY - 22, pressX - 73, pressY - 13, '#708e8d', 1.6);
          line(pressX - 73, pressY - 22, pressX - 64, pressY - 22, '#708e8d', 1.6);
          line(pressX + 73, pressY + 21, pressX + 73, pressY + 12, '#708e8d', 1.6);
          line(pressX + 73, pressY + 21, pressX + 64, pressY + 21, '#708e8d', 1.6);
        }
        if (phase === 3) text('Accept All', 241, 239, 8, '#9d704c');
        ctx.restore();
      }

      return {
        down(p) {
          if (phase !== 0) return;
          if (inButton(p, rejectStart)) {
            phase = 1; held = true; pendingRelease = false; hover = 'reject';
            pressX = p.x; pressY = p.y; swap = 0;
            api.say('You aimed for Reject All. The buttons have other plans.');
            api.tone(420, .06, .02);
          } else if (inButton(p, acceptStart)) {
            directAcceptAttempts++;
            api.say('You wanted to reject them. Try the Reject All button.');
          }
        },
        move(p) {
          if (phase === 0) hover = inButton(p, rejectStart) ? 'reject' : inButton(p, acceptStart) ? 'accept' : null;
          else if ((phase === 1 || phase === 2) && held && !inButton(p, rejectStart)) cancelPress();
        },
        up(p) {
          if ((phase === 1 || phase === 2) && held) {
            if (!inButton(p, rejectStart)) { cancelPress(); return; }
            held = false; pendingRelease = true;
            if (phase === 2) { phase = 3; confirmTime = 0; }
          }
        },
        cancel() { cancelPress(); },
        update(dt) {
          time += dt;
          if (phase === 1) {
            swap = Math.min(1, swap + dt / .42);
            if (swap >= 1) {
              phase = pendingRelease ? 3 : 2;
              confirmTime = 0;
              api.tone(620, .05, .02);
            }
          } else if (phase === 3) {
            confirmTime += dt;
            if (confirmTime >= .45) {
              accepted = true; phase = 4; closeTime = 0;
              api.say('Preferences saved. Apparently those preferences were Accept All.');
              api.tone(760, .12, .025);
            }
          } else if (phase === 4) {
            closeTime += dt;
            if (closeTime >= .7 && !finished) { phase = 6; finished = true; api.done(); }
          } else if (phase === 5) {
            swap = Math.max(0, swap - dt / .28);
            if (swap <= 0) { phase = 0; hover = null; }
          }
        },
        draw() {
          pageArt();
          if (phase < 4 || phase === 5) rect(16, 81, 448, 174, '#30454a16');
          banner();
          if (accepted) {
            round(122, 72, 236, 40, 9, '#173a3a40');
            round(122, 68, 236, 40, 9, '#355b54', '#789f8d');
            ellipse(143, 88, 9, 9, '#94b899');
            line(138, 88, 142, 92, '#eaf1dc', 2); line(142, 92, 148, 84, '#eaf1dc', 2);
            text('Preferences saved', 254, 93, 13, '#edf0db');
          }
        },
        debug() {
          return {
            phase, hover, held, swap, pendingRelease, accepted, cancels, directAcceptAttempts,
            rejectX: rejectStart + (acceptStart - rejectStart) * ease(swap),
            acceptX: acceptStart - (acceptStart - rejectStart) * ease(swap),
            pressedAt: { x: pressX, y: pressY },
            bannerVisible: phase !== 6 && !(phase === 4 && closeTime >= .5),
            toast: accepted ? 'Preferences saved' : null,
            savedChoice: accepted ? 'Accept All' : null,
            finished,
          };
        },
      };
    },
  });
})();
