(() => {
  'use strict';

  TinyV5.register({
    id: 'pull-tab',
    title: 'The Broken Pull Tab',
    chapter: 'kitchen',
    description: 'Lift the ring. Pull the lid. That was the plan.',
    hint: 'Drag the flat ring upward, then let go. Grab the raised ring again and pull it to the right.',
    verdict: 'The handle is open. The can is not.',
    create(api) {
      const { ctx } = api;
      let phase = 'flat';
      let lift = 0;
      let tension = 0;
      let gesture = null;
      let attached = true;
      let elapsed = 0;
      let time = 0;
      let ringX = 245;
      let ringY = 123;
      let recoil = 0;
      let completed = false;

      const smooth = (n) => { const t = api.clamp(n, 0, 1); return t * t * (3 - 2 * t); };
      function stroke(points, color, width = 2) {
        ctx.beginPath();
        points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      function hand(x, y, strength = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.15 + strength * 0.15);
        ctx.beginPath();
        ctx.moveTo(4, 4);
        ctx.quadraticCurveTo(-2, -4, 3, -7);
        ctx.quadraticCurveTo(7, -10, 14, -1);
        ctx.lineTo(18, 7);
        ctx.lineTo(15, -3);
        ctx.quadraticCurveTo(16, -8, 21, -5);
        ctx.lineTo(27, 9);
        ctx.quadraticCurveTo(41, 12, 39, 27);
        ctx.lineTo(49, 35);
        ctx.lineTo(26, 49);
        ctx.lineTo(15, 32);
        ctx.quadraticCurveTo(4, 30, -1, 19);
        ctx.quadraticCurveTo(-7, 8, 0, 7);
        ctx.lineTo(9, 17);
        ctx.lineTo(14, 16);
        ctx.closePath();
        ctx.fillStyle = '#d0a185';
        ctx.fill();
        ctx.strokeStyle = '#e9bfa3';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        stroke([[18, 10], [25, 20]], '#a87965', 1);
        stroke([[27, 12], [31, 21]], '#a87965', 1);
        api.poly([[22, 42], [46, 29], [63, 47], [35, 65]], '#647568');
        stroke([[25, 44], [49, 31]], '#9aab90', 3);
        ctx.restore();
      }

      function ring(x, y, progress, angle, broken) {
        const ry = 9 + progress * 12;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#546874';
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(-0.8, -0.8, 15, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#cbd7d4';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(-1.4, -1.5, 15, ry, 0, Math.PI * 1.05, Math.PI * 1.85);
        ctx.strokeStyle = '#f1f0df';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (broken) {
          api.poly([[-5, ry - 1], [-5, ry + 6], [-1, ry + 4], [1, ry + 7], [5, ry + 3], [5, ry - 1]], '#c1ceca');
        }
        ctx.restore();
      }

      function drawCan() {
        api.ellipse(221, 223, 108, 15, '#101b225e');
        ctx.save();
        ctx.translate(recoil, 0);
        const metal = ctx.createLinearGradient(121, 0, 319, 0);
        metal.addColorStop(0, '#4b626b');
        metal.addColorStop(0.13, '#b4c4bd');
        metal.addColorStop(0.27, '#dce0cf');
        metal.addColorStop(0.48, '#91a7a5');
        metal.addColorStop(0.85, '#658087');
        metal.addColorStop(1, '#354e5b');
        ctx.beginPath();
        ctx.moveTo(121, 108);
        ctx.lineTo(121, 195);
        ctx.bezierCurveTo(121, 230, 319, 230, 319, 195);
        ctx.lineTo(319, 108);
        ctx.closePath();
        ctx.fillStyle = metal;
        ctx.fill();
        ctx.save();
        ctx.clip();
        for (let y = 191; y <= 211; y += 7) {
          ctx.beginPath();
          ctx.ellipse(220, y - 18, 97, 33, 0, 0.04, Math.PI - 0.04);
          ctx.strokeStyle = '#314d5866';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        api.rect(121, 139, 198, 50, '#b85b43');
        api.rect(121, 142, 198, 3, '#e1ac79');
        api.rect(121, 183, 198, 3, '#e1ac79');
        api.rect(121, 139, 15, 50, '#283c4640');
        api.rect(301, 139, 18, 50, '#283c4650');
        api.text('GARDEN PANTRY', 220, 158, 7, '#f8e6c3');
        api.text('TOMATOES', 220, 174, 15, '#fff0c9');
        for (let x = 140; x <= 157; x += 4) api.rect(x, 158, 2, 16, '#f6d6a573');
        api.ellipse(290, 166, 10, 9, '#d88457');
        api.poly([[289, 158], [284, 154], [289, 155], [294, 152], [293, 157], [298, 159], [291, 160]], '#85906c');
        ctx.restore();

        api.ellipse(220, 108, 100, 47, '#3d5460');
        api.ellipse(220, 105, 99, 45, '#cfdbd2');
        api.ellipse(220, 105, 95, 41, '#718a8e');
        const lid = ctx.createLinearGradient(0, 65, 0, 146);
        lid.addColorStop(0, '#c3d1cb');
        lid.addColorStop(0.4, '#9cb4b4');
        lid.addColorStop(0.67, '#b4c6bf');
        lid.addColorStop(1, '#718f97');
        ctx.fillStyle = lid;
        ctx.beginPath();
        ctx.ellipse(220, 104, 92, 38, 0, 0, Math.PI * 2);
        ctx.fill();
        // This continuous scored lid is never peeled back or opened.
        for (const [rx, ry, color] of [[84, 31, '#526f79'], [81.5, 29.4, '#d8e0d087']]) {
          ctx.beginPath();
          ctx.ellipse(220, 105, rx, ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(220, 104, 80, 28, 0, 0, Math.PI * 2);
        ctx.clip();
        for (let y = 83; y < 128; y += 4) api.line(149, y, 291, y, '#f4f3d811', 1);
        api.poly([[158, 75], [189, 75], [229, 139], [198, 139]], '#f3ecd91c');
        ctx.restore();
        api.ellipse(245, 106, 5, 3.5, '#607c83');
        api.ellipse(245, 105, 3.5, 2.5, '#d4ded3');
        if (attached) {
          const ry = 9 + lift * 12;
          const connectionY = ringY + (lift * 2 - 1) * ry;
          stroke([[245, 106], [ringX, connectionY]], '#5f7880', 8);
          stroke([[244, 105], [ringX - 1, connectionY]], '#cbd8ce', 5);
          ring(ringX, ringY, lift, tension * 0.003, false);
        } else {
          // A broken neck remains on the rivet, not an opening in the lid.
          api.poly([[240, 105], [241, 99], [244, 102], [246, 98], [249, 101], [249, 106]], '#b7c9c5');
          stroke([[241, 99], [244, 102], [246, 98], [249, 101]], '#e2e7d7', 1);
        }
        ctx.restore();
      }

      function draw() {
        const wall = ctx.createLinearGradient(0, 0, 0, 270);
        wall.addColorStop(0, '#293b41');
        wall.addColorStop(1, '#1f3038');
        ctx.fillStyle = wall;
        ctx.fillRect(0, 0, 480, 270);
        api.rect(0, 180, 480, 90, '#6a5c4c');
        api.rect(0, 180, 480, 3, '#99816a');
        for (let y = 193; y < 270; y += 21) api.line(0, y, 480, y + 2, '#b1946a12', 1);
        api.poly([[26, 188], [105, 181], [133, 245], [40, 256]], '#afab8d');
        for (let x = 40; x < 108; x += 12) api.line(x, 190, x + 14, 245, '#53747455', 3);
        for (let y = 199; y < 245; y += 12) api.line(37, y, 112, y - 5, '#53747444', 3);
        drawCan();
        if (!attached) {
          ring(ringX, ringY, 1, -0.18, true);
          hand(ringX + 14, ringY + 4, 0.25);
          if (phase === 'snapping' && elapsed < 0.2) {
            ctx.save();
            ctx.globalAlpha = 1 - elapsed / 0.2;
            stroke([[258, 96], [270, 90]], '#f8dfaa', 2);
            stroke([[251, 90], [255, 81]], '#f8dfaa', 2);
            stroke([[260, 107], [271, 109]], '#f8dfaa', 2);
            ctx.restore();
          }
        } else if (gesture) {
          hand(ringX + 12, ringY + 4, tension / 75);
        }
        if (phase === 'flat' && !gesture) {
          const y = 70 + Math.sin(time * 3) * 2;
          stroke([[274, 94], [274, y]], '#f5e7bc', 2);
          stroke([[270, y + 5], [274, y], [278, y + 5]], '#f5e7bc', 2);
          api.text('LIFT THE RING', 220, 251, 9, '#e6cfab');
        } else if (phase === 'lifted' && !gesture) {
          stroke([[281, 83], [311, 83]], '#f5e7bc', 2);
          stroke([[305, 78], [311, 83], [305, 88]], '#f5e7bc', 2);
          api.text('NOW PULL', 220, 251, 9, '#e6cfab');
        }
        if (phase === 'tension' && tension > 20) {
          const alpha = api.clamp(tension / 70, 0, 1);
          ctx.save();
          ctx.globalAlpha = alpha;
          stroke([[241, 99], [237, 91]], '#f1d7a0', 1.2);
          stroke([[250, 102], [256, 99]], '#f1d7a0', 1.2);
          ctx.restore();
        }
      }

      function release() {
        if (gesture?.kind === 'lift') {
          if (lift >= 0.95) {
            lift = 1;
            phase = 'lifted';
            api.say('Ring up. Now pull it to the right.');
          } else lift = 0;
          ringX = 245;
          ringY = 123 - lift * 41;
        } else if (gesture?.kind === 'pull') {
          phase = 'lifted';
          tension = 0;
          ringX = 245;
          ringY = 82;
        }
        gesture = null;
      }

      return {
        draw,
        down(p) {
          if (phase === 'flat' && api.near(p, ringX, ringY, 28)) {
            gesture = { kind: 'lift', startY: p.y };
          } else if (phase === 'lifted' && api.hit(p, ringX, ringY, 56, 62)) {
            gesture = { kind: 'pull', startX: p.x };
            phase = 'tension';
          }
        },
        move(p) {
          if (!gesture) return;
          if (gesture.kind === 'lift') {
            lift = api.clamp((gesture.startY - p.y) / 42, 0, 1);
            ringY = 123 - lift * 41;
          } else if (gesture.kind === 'pull') {
            tension = api.clamp(p.x - gesture.startX, 0, 75);
            ringX = 245 + tension * 0.24;
            ringY = 82 + tension * 0.08;
            if (tension >= 70) {
              phase = 'snapping';
              attached = false;
              elapsed = 0;
              gesture = null;
              api.tone(1180, 0.06, 0.027, 0.15);
              api.say('The ring came off. Just the ring.');
            }
          }
        },
        up: release,
        cancel() {
          if (gesture?.kind === 'lift') lift = 0;
          release();
        },
        update(dt) {
          time += dt;
          if (phase !== 'snapping' && phase !== 'recoil') return;
          elapsed += dt;
          if (phase === 'snapping') {
            const p = smooth(elapsed / 0.28);
            ringX = 262 + p * 103;
            ringY = 88 + p * 17 - Math.sin(p * Math.PI) * 13;
            recoil = -Math.sin(p * Math.PI) * 3.5;
            if (elapsed >= 0.28) {
              phase = 'recoil';
              elapsed = 0;
            }
          } else {
            ringX = 365 + Math.sin(elapsed * 17) * Math.exp(-elapsed * 8) * 4;
            ringY = 105 + Math.sin(elapsed * 13) * Math.exp(-elapsed * 8) * 2;
            recoil = Math.sin(elapsed * 22) * Math.exp(-elapsed * 10) * 1.8;
            if (elapsed >= 0.62) {
              phase = 'complete';
              ringX = 365;
              ringY = 105;
              recoil = 0;
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          return {
            phase, liftProgress: lift, tension, attached,
            ringX, ringY, recoil, gesture: gesture ? gesture.kind : null,
            sealed: true, lidOpened: false, lidLift: 0,
            heldDetachedRing: !attached, completed,
          };
        },
      };
    },
  });
})();
