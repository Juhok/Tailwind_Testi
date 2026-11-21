(() => {
  'use strict';

  TinyV5.register({
    id: 'water-sleeve',
    title: 'Water Up Your Sleeve',
    chapter: 'kitchen',
    description: 'Wash your hands, then lift them toward your face.',
    hint: 'Drag the hands under the faucet and rub them back and forth for a moment. Then grab them again and lift them toward the face at the upper right.',
    verdict: 'Clean hands. Freshly watered sleeve.',
    create(api) {
      const { ctx } = api;
      let phase = 'wash';
      let handsX = 316;
      let handsY = 170;
      let gesture = null;
      let washDistance = 0;
      let washTime = 0;
      let flowProgress = 0;
      let wetness = 0;
      let elapsed = 0;
      let time = 0;
      let completed = false;

      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      const underWater = (x, y) => Math.abs(x - 230) < 35 && Math.abs(y - 149) < 22;
      const washProgress = () => Math.min(1, washDistance / 96, washTime / 0.75);
      function line(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function face() {
        api.poly([[415, 103], [437, 108], [480, 137], [480, 270], [422, 270], [409, 145]], '#557b87');
        ctx.beginPath();
        ctx.moveTo(414, 31);
        ctx.bezierCurveTo(391, 29, 384, 47, 385, 61);
        ctx.lineTo(375, 71);
        ctx.quadraticCurveTo(375, 75, 385, 77);
        ctx.quadraticCurveTo(384, 94, 402, 101);
        ctx.lineTo(416, 106);
        ctx.lineTo(418, 121);
        ctx.lineTo(440, 119);
        ctx.lineTo(429, 90);
        ctx.bezierCurveTo(449, 64, 442, 36, 414, 31);
        ctx.closePath();
        ctx.fillStyle = '#cda184';
        ctx.fill();
        api.ellipse(426, 67, 5, 8, '#b58a74');
        line([[388, 59], [396, 60]], '#5d4e43', 1.8);
        line([[385, 85], [392, 87]], '#956d5b', 1.4);
        ctx.beginPath();
        ctx.moveTo(384, 51);
        ctx.bezierCurveTo(381, 18, 438, 19, 445, 44);
        ctx.bezierCurveTo(449, 59, 442, 79, 431, 88);
        ctx.lineTo(429, 59);
        ctx.lineTo(417, 43);
        ctx.quadraticCurveTo(400, 52, 384, 51);
        ctx.fillStyle = '#54473e';
        ctx.fill();
        line([[395, 39], [416, 33], [433, 43]], '#78624b', 2);
        api.poly([[413, 114], [429, 122], [440, 114], [445, 125], [429, 135], [408, 123]], '#7a9b9f');
      }

      function sink() {
        api.rect(0, 160, 339, 110, '#708b86');
        api.rect(0, 160, 339, 7, '#a6b8a5');
        api.rect(0, 239, 339, 31, '#3b575b');
        api.line(156, 242, 156, 270, '#1e3944', 2);
        api.ellipse(185, 192, 136, 46, '#b7c9bc');
        api.ellipse(185, 183, 137, 43, '#dce3ce');
        api.ellipse(185, 182, 120, 34, '#506f77');
        api.ellipse(185, 188, 106, 25, '#90aaa0');
        api.ellipse(197, 196, 16, 7, '#b7c7bb');
        api.ellipse(197, 196, 10, 4.5, '#536f74');
        for (let i = -1; i <= 1; i++) api.line(191, 194 + i * 2, 203, 194 + i * 2, '#9daf9f', 0.7);
        api.round(53, 113, 25, 41, 5, '#789778');
        api.round(58, 106, 15, 10, 2, '#d1d5b8');
        api.rect(64, 99, 5, 10, '#a8b7a1');
        api.round(63, 98, 21, 5, 2, '#c6d0ba');
        api.rect(83, 100, 3, 6, '#c6d0ba');
        api.round(57, 128, 17, 16, 2, '#dedbb0');
        api.text('SOAP', 65.5, 138, 5, '#6d7d61');
        api.ellipse(183, 138, 18, 6, '#607e82');
        api.ellipse(183, 136, 15, 4, '#d1ddc9');
        ctx.beginPath();
        ctx.moveTo(183, 135);
        ctx.lineTo(183, 80);
        ctx.bezierCurveTo(183, 45, 230, 45, 230, 80);
        ctx.lineTo(230, 86);
        ctx.strokeStyle = '#597b84';
        ctx.lineWidth = 13;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = '#cbdace';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(180, 129);
        ctx.lineTo(180, 80);
        ctx.bezierCurveTo(180, 52, 214, 46, 224, 68);
        ctx.strokeStyle = '#f0f0d9';
        ctx.lineWidth = 2;
        ctx.stroke();
        api.ellipse(230, 86, 8, 3, '#6e9095');
        api.round(197, 119, 22, 6, 3, '#b2c7bc');
        api.line(202, 123, 194, 132, '#91afa7', 4);

        // The tap is already running. Touching it cannot skip the hand washing.
        const endY = underWater(handsX, handsY) && phase === 'wash' ? handsY - 15 : 189;
        api.rect(227, 89, 6, endY - 89, '#a7d9d05b');
        for (let i = 0; i < 3; i++) {
          const x = 227.5 + i * 2;
          line([[x, 90], [x + Math.sin(time * 9 + i) * 0.8, endY]], '#d5f4df99', 0.9);
        }
        if (!underWater(handsX, handsY) || phase !== 'wash') {
          api.ellipse(230, 190, 10 + Math.sin(time * 8) * 2, 3, '#e5f3d777');
          for (let i = 0; i < 4; i++) {
            const p = (time * 2 + i / 4) % 1;
            api.ellipse(230 + (i % 2 ? 1 : -1) * p * 17, 189 - Math.sin(p * Math.PI) * 9, 1, 1.5, '#c6e8d699');
          }
        }
      }

      function hand(x, y, angle = 0, size = 1, color = '#d6aa8c') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(size, size);
        ctx.beginPath();
        ctx.moveTo(-3, 39);
        ctx.lineTo(-8, 23);
        ctx.quadraticCurveTo(-16, 14, -16, -9);
        ctx.quadraticCurveTo(-18, -22, -12, -22);
        ctx.quadraticCurveTo(-8, -22, -8, -8);
        ctx.lineTo(-8, -26);
        ctx.quadraticCurveTo(-8, -33, -3, -32);
        ctx.quadraticCurveTo(1, -32, 1, -8);
        ctx.lineTo(2, -28);
        ctx.quadraticCurveTo(3, -35, 8, -32);
        ctx.quadraticCurveTo(12, -30, 10, -7);
        ctx.lineTo(12, -22);
        ctx.quadraticCurveTo(15, -29, 19, -23);
        ctx.lineTo(18, 3);
        ctx.quadraticCurveTo(27, -7, 30, -1);
        ctx.quadraticCurveTo(32, 4, 23, 17);
        ctx.lineTo(21, 39);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#b6856e';
        ctx.lineWidth = 1;
        ctx.stroke();
        line([[-8, 3], [3, 8], [12, 5]], '#b7866b77', 1);
        line([[15, 14], [7, 20], [0, 19]], '#b7866b77', 1);
        line([[0, 30], [18, 31]], '#a47a6540', 1);
        ctx.restore();
      }

      function sleevePath() {
        ctx.beginPath();
        ctx.moveTo(handsX - 3, handsY + 37);
        ctx.lineTo(handsX + 34, handsY + 37);
        ctx.lineTo(465, 270);
        ctx.lineTo(391, 270);
        ctx.closePath();
      }

      function arms() {
        api.poly([[handsX - 40, handsY + 35], [handsX - 10, handsY + 40], [365, 270], [302, 270]], '#4d737e');
        line([[handsX - 35, handsY + 42], [319, 267]], '#8eaaa535', 1);
        hand(handsX - 31, handsY + 8, -0.22, 0.9, '#c4977c');
        api.poly([[handsX - 42, handsY + 34], [handsX - 11, handsY + 39], [handsX - 8, handsY + 51], [handsX - 39, handsY + 46]], '#7b9f9f');
        sleevePath();
        ctx.fillStyle = '#688f99';
        ctx.fill();
        line([[handsX + 28, handsY + 49], [454, 266]], '#b3c6b52b', 1.5);
        line([[handsX + 3, handsY + 52], [399, 267]], '#2f5c6c40', 1);
        api.poly([[handsX - 4, handsY + 35], [handsX + 33, handsY + 35], [handsX + 35, handsY + 49], [handsX - 1, handsY + 49]], '#8badaa');
        for (let i = 0; i < 8; i++) api.line(handsX + i * 4, handsY + 38, handsX + i * 4 + 1, handsY + 47, '#4d7c8270', 1);
        hand(handsX, handsY);

        if (wetness > 0) {
          ctx.save();
          sleevePath();
          ctx.clip();
          const angle = Math.atan2(270 - (handsY + 46), 428 - (handsX + 17));
          ctx.translate(handsX + 17, handsY + 46);
          ctx.rotate(angle);
          const length = 8 + wetness * 39;
          ctx.beginPath();
          ctx.moveTo(-7, -5);
          ctx.bezierCurveTo(2, -10 - wetness * 6, length * 0.7, -6 - wetness * 9, length, -3);
          ctx.bezierCurveTo(length + 4, 4, length * 0.75, 15, length * 0.48, 10);
          ctx.bezierCurveTo(6, 12 + wetness * 5, -7, 7, -7, -5);
          ctx.closePath();
          ctx.fillStyle = `rgba(24, 55, 70, ${0.16 + wetness * 0.58})`;
          ctx.fill();
          api.ellipse(8 + wetness * 10, 1, 8 + wetness * 14, 5 + wetness * 4, `rgba(24, 47, 63, ${wetness * 0.27})`);
          ctx.restore();
        }

        if (phase === 'wash' && underWater(handsX, handsY)) {
          const progress = washProgress();
          for (let i = 0; i < 9; i++) {
            const a = i * 2.39;
            const x = handsX - 15 + Math.cos(a) * (11 + i % 3 * 4);
            const y = handsY + 2 + Math.sin(a) * 12;
            api.ellipse(x, y, 2.5 + progress * 2 + (i % 2), 2 + progress * 1.6, '#ecf1d9bb');
          }
          for (let i = 0; i < 5; i++) {
            const p = (time * 2.6 + i / 5) % 1;
            api.ellipse(handsX - 22 + i * 12, handsY + 10 + p * 33, 1.3, 2.3, '#d2f2e4a0');
          }
        } else if (phase !== 'wash') {
          api.ellipse(handsX + 8, handsY - 11, 2, 3, '#b6e9e7');
          api.ellipse(handsX - 5, handsY + 8, 1.5, 2.5, '#d7f4e7');
          api.ellipse(handsX + 14, handsY + 18, 1.5, 2, '#c8f0e5');
        }
      }

      function trickle() {
        if (flowProgress <= 0) return;
        const points = [[9, -12], [8, 4], [16, 16], [15, 31], [18, 44], [22, 53]];
        const scaled = flowProgress * (points.length - 1);
        const whole = Math.floor(scaled);
        const drawn = points.slice(0, whole + 1).map(([x, y]) => [handsX + x, handsY + y]);
        if (whole < points.length - 1) {
          const t = scaled - whole;
          drawn.push([handsX + points[whole][0] + (points[whole + 1][0] - points[whole][0]) * t,
            handsY + points[whole][1] + (points[whole + 1][1] - points[whole][1]) * t]);
        }
        line(drawn, '#5a95ac', 3.5);
        line(drawn, '#d5f5eb', 1.5);
        const end = drawn[drawn.length - 1];
        api.ellipse(end[0], end[1], 2.2, 3, '#d7f5ec');
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#283e47');
        for (let y = 15; y < 160; y += 39) api.line(0, y, 366, y, '#92a48b17', 1);
        for (let x = 24; x < 370; x += 56) api.line(x, 0, x, 160, '#92a48b12', 1);
        api.round(29, 34, 96, 43, 3, '#6b867f');
        api.rect(33, 38, 88, 35, '#bacbb6');
        api.line(76, 38, 76, 73, '#6b867f', 3);
        api.poly([[33, 68], [55, 48], [77, 66], [99, 51], [121, 69]], '#7f9f8b');
        face();
        sink();
        arms();
        trickle();
        if (phase === 'wash') {
          api.text('RUB UNDER THE RUNNING WATER', 143, 255, 8, '#d6dfbd');
          api.round(113, 239, 108, 4, 2, '#1d3a46');
          if (washProgress() > 0) api.round(113, 239, 108 * washProgress(), 4, 2, '#a8c9ad');
          if (!gesture && washProgress() === 0) {
            line([[290, 118], [260, 118]], '#efe7bd', 2);
            line([[266, 113], [260, 118], [266, 123]], '#efe7bd', 2);
          }
        } else if (phase === 'washed') {
          api.text('LIFT TOWARD YOUR FACE', 142, 255, 8, '#d6dfbd');
          line([[304, 110], [325, 87]], '#efe7bd', 2);
          line([[318, 89], [325, 87], [324, 94]], '#efe7bd', 2);
        }
      }

      return {
        draw,
        down(p) {
          if (!['wash', 'washed'].includes(phase)) return;
          if (api.hit(p, handsX - 8, handsY + 5, 88, 92)) {
            gesture = { dx: p.x - handsX, dy: p.y - handsY, startX: handsX, startY: handsY };
          }
        },
        move(p) {
          if (!gesture) return;
          const previousX = handsX, previousY = handsY;
          handsX = api.clamp(p.x - gesture.dx, 160, 369);
          handsY = api.clamp(p.y - gesture.dy, 75, 190);
          if (phase === 'wash' && underWater(previousX, previousY) && underWater(handsX, handsY)) {
            washDistance += Math.abs(handsX - previousX) + Math.abs(handsY - previousY) * 0.5;
          }
        },
        up() {
          if (!gesture) return;
          const distance = Math.hypot(handsX - gesture.startX, handsY - gesture.startY);
          if (phase === 'washed' && distance > 25 && api.near({ x: handsX, y: handsY }, 353, 91, 29) && handsY < 115) {
            phase = 'runoff';
            elapsed = 0;
            api.say('One last drop. Heading the wrong way.');
            api.tone(750, 0.06, 0.018, 0.4);
          } else if (phase === 'wash' && !underWater(handsX, handsY)) {
            handsX = 316;
            handsY = 170;
          }
          gesture = null;
        },
        cancel() {
          if (gesture && phase === 'wash' && !underWater(handsX, handsY)) { handsX = 316; handsY = 170; }
          gesture = null;
        },
        update(dt) {
          time += dt;
          if (phase === 'wash' && gesture && underWater(handsX, handsY)) {
            washTime += dt;
            if (washDistance >= 96 && washTime >= 0.75) {
              phase = 'washed';
              gesture = null;
              api.say('Clean hands. Lift them toward your face.');
              api.tone(610, 0.08, 0.014);
            }
          } else if (phase === 'runoff') {
            elapsed += dt;
            flowProgress = api.clamp(elapsed / 0.85, 0, 1);
            wetness = 0.12 * smooth((elapsed - 0.6) / 0.25);
            if (elapsed >= 0.85) {
              phase = 'soaking';
              elapsed = 0;
              flowProgress = 1;
              wetness = 0.12;
              api.say('Straight into the cuff.');
            }
          } else if (phase === 'soaking') {
            elapsed += dt;
            wetness = 0.12 + 0.88 * smooth(elapsed / 1.1);
            if (elapsed >= 1.25) {
              phase = 'complete';
              wetness = 1;
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          return {
            phase, handsX, handsY, dragging: !!gesture,
            washDistance, washTime, washProgress: washProgress(),
            handsClean: phase !== 'wash', underWater: underWater(handsX, handsY),
            flowProgress, wetness, sleeveWet: wetness > 0,
            waterReachedCuff: flowProgress >= 0.8, completed,
          };
        },
      };
    },
  });
})();
