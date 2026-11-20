(function () {
  'use strict';
  TinyV5.register({
    id: 'microwave-ice', title: 'The Microwave Ice Cube', chapter: 'kitchen',
    description: 'Heat your meal, take out the hot plate, then cut into the middle.',
    hint: 'Press START. After heating, drag the door handle left. Drag the plate onto the counter. Grab the knife handle above the meal and pull it straight down through the center.',
    verdict: 'The plate is lava. The middle is a geological ice sample.',
    create(api) {
      const { ctx } = api;
      let phase = 'ready', heat = 0, door = 0, extraction = 0, cut = 0, reveal = 0, elapsed = 0, clock = 0;
      let gesture = null, start = null, hotTouch = false;
      const platePos = () => ({ x: 181 + 89 * extraction, y: 155 + 47 * extraction });
      const knifePos = () => ({ x: 270, y: 132 + 59 * cut });
      function steam(x, y, strength, seed) {
        if (strength <= 0) return;
        ctx.save(); ctx.globalAlpha = strength * 0.67; ctx.strokeStyle = '#ecebd5'; ctx.lineWidth = 1.8;
        const wave = Math.sin(clock * 3 + seed) * 5;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - 9, y - 10, x + 10 + wave, y - 18, x + wave * 0.5, y - 28);
        ctx.bezierCurveTo(x - 6, y - 33, x + 5, y - 38, x + wave, y - 44);
        ctx.stroke(); ctx.restore();
      }
      function mealHalf(side, gap) {
        const left = side < 0 ? -62 - gap : gap, width = 62;
        api.round(left, -23, width, 37, 4, '#b5693e');
        api.rect(left + 2, -5, width - 4, 4, '#efbf6c');
        api.rect(left + 2, 4, width - 4, 4, '#e4b067');
        api.round(left, -29, width, 28, 4, '#df9f4d', '#f0bc66');
        for (let i = 0; i < 7; i++) {
          const x = left + 6 + (i * 17) % 49, y = -23 + (i * 11) % 17;
          api.ellipse(x, y, 5 + i % 3, 2.5, i % 2 ? '#b7743e' : '#efbf6b');
          if (i % 3 === 0) api.line(x - 2, y, x + 2, y - 2, '#6f824d', 1.5);
        }
        // Freshly cut, cooked edges contrast with the blue center.
        if (gap > 0) api.rect(side < 0 ? left + width - 3 : left, -25, 3, 36, '#efbf77');
      }
      function iceChunk() {
        api.poly([[-18, -23], [8, -31], [25, -18], [-1, -9]], '#d7f5ee', '#f4ffff');
        api.poly([[-18, -23], [-1, -9], [-1, 16], [-18, 4]], '#8cb6cd', '#dbf4f2');
        api.poly([[-1, -9], [25, -18], [25, 5], [-1, 16]], '#b3e0e7', '#eafff6');
        api.poly([[5, -8], [20, -14], [20, 3], [5, 10]], '#8ebfcf');
        api.line(-12, -18, -5, -12, '#f2ffff', 1.5);
        api.line(4, -3, 18, -9, '#e7ffff', 1.5);
        // Frost crystals are drawn lines, not an emoji or textual reveal.
        for (const [x, y, r] of [[10, -2, 5], [-9, -8, 3], [8, -22, 3]]) {
          for (let a = 0; a < 3; a++) {
            const angle = a * Math.PI / 3;
            api.line(x - Math.cos(angle) * r, y - Math.sin(angle) * r, x + Math.cos(angle) * r, y + Math.sin(angle) * r, '#efffff', 1);
          }
        }
      }
      function drawPlate() {
        const p = platePos(), scale = 0.83 + extraction * 0.52;
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(scale, scale);
        if (heat >= 1) {
          api.ellipse(0, 12, 83, 26, '#e8943940');
          api.ellipse(0, 12, 79, 23, '#e28a3e55');
        }
        api.ellipse(2, 17, 79, 25, '#14232e');
        api.ellipse(0, 10, 79, 25, '#c3c9c0');
        api.ellipse(0, 5, 79, 25, '#ede8d3', heat >= 1 ? '#eca064' : '#f8f0d8');
        api.ellipse(0, 5, 69, 19, '#d6d8c8');
        if (reveal > 0.01) {
          ctx.save(); ctx.globalAlpha = Math.min(1, reveal * 3); iceChunk(); ctx.restore();
        }
        mealHalf(-1, reveal * 21); mealHalf(1, reveal * 21);
        if (cut > 0 && reveal < 0.05) {
          api.line(0, -29, 0, -29 + 43 * cut, '#543e35', 2);
          if (cut > 0.75) api.line(0, -17, 0, -12 + 25 * (cut - 0.75), '#cae9ec', 1.5);
        }
        steam(-48 - reveal * 13, -28, heat, 0); steam(48 + reveal * 13, -25, heat, 2);
        if (heat >= 1 && extraction > 0.2) {
          ctx.strokeStyle = '#efa76b'; ctx.lineWidth = 1.5;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.moveTo(-84 - i * 5, 10);
            ctx.quadraticCurveTo(-90 - i * 5, 2, -85 - i * 5, -5); ctx.stroke();
          }
        }
        ctx.restore();
      }
      function drawDoor() {
        const width = 241 * Math.cos(door * 1.45), slant = door * 16;
        ctx.save();
        // Horizontal perspective compresses the hinged door as it swings open.
        ctx.translate(58, 49); ctx.transform(width / 241, -slant / 241, 0, 1 + slant * 2 / 148, 0, 0);
        api.round(0, 0, 241, 148, 8, '#45596235', '#95a7a7');
        api.rect(4, 0, 233, 10, '#455962'); api.rect(4, 138, 233, 10, '#455962');
        api.rect(0, 8, 10, 132, '#455962'); api.rect(217, 8, 24, 132, '#455962');
        api.round(9, 9, 211, 130, 6, '#101e292f');
        // The window is transparent, with sparse mesh and diagonal reflections.
        api.round(17, 17, 194, 114, 4, '#1f34451f', '#586e75');
        for (let row = 0; row < 12; row++) {
          for (let col = 0; col < 20; col++) api.ellipse(21 + col * 9.6, 21 + row * 9.5, 0.55, 0.55, '#b8ccd73d');
        }
        api.poly([[22, 19], [52, 19], [163, 128], [144, 128]], '#d6e4dd0b');
        api.round(224, 33, 10, 82, 4, '#c3ccc8', '#e0e4d8');
        ctx.restore();
      }
      function drawKnife() {
        if (phase !== 'cut' && gesture !== 'knife') return;
        const k = knifePos();
        ctx.save(); ctx.translate(k.x, k.y);
        api.round(-7, -17, 14, 32, 4, '#536b76', '#94a8aa');
        api.ellipse(0, -9, 1.5, 1.5, '#d9dfd3'); api.ellipse(0, 5, 1.5, 1.5, '#d9dfd3');
        api.poly([[-5, 14], [7, 14], [6, 33], [-3, 46], [-5, 46]], '#c9d9d8', '#eff5e7');
        api.line(-3, 16, -3, 42, '#f1f9eb', 1.3);
        ctx.restore();
      }
      return {
        draw() {
          api.bg('kitchen');
          api.round(42, 39, 335, 178, 12, '#142530');
          api.round(40, 30, 335, 179, 12, '#8e9e9d', '#bec8bd');
          api.round(54, 45, 248, 154, 7, '#182936');
          api.round(62, 53, 232, 138, 5, phase === 'heating' || phase === 'hot' ? '#5c513b' : '#263b47');
          api.ellipse(181, 167, 96, 18, '#516169');
          api.ellipse(181, 164, 91, 15, '#738181');
          api.line(73, 77, 280, 77, '#50616a', 1);
          if (extraction < 0.05) drawPlate();
          drawDoor();
          api.round(313, 47, 49, 34, 4, '#172f31');
          const timer = phase === 'ready' ? '0:30' : phase === 'heating' ? `0:${String(Math.ceil((1 - heat) * 30)).padStart(2, '0')}` : '0:00';
          api.text(timer, 337.5, 69, 14, '#b7e4a7');
          for (let i = 0; i < 6; i++) api.round(318 + (i % 2) * 22, 91 + Math.floor(i / 2) * 15, 16, 10, 2, '#657c80');
          api.round(312, 143, 52, 35, 5, phase === 'ready' ? '#acd2b7' : '#657b7b', '#c2d1be');
          api.text('START', 338, 165, 9, phase === 'ready' ? '#264d45' : '#d6dfcf');
          api.text('700 W', 338, 193, 7, '#3e565f');
          if (extraction >= 0.05) drawPlate();
          if (hotTouch && gesture === 'plate') {
            const p = platePos();
            api.ellipse(p.x + 58, p.y + 14, 8, 5, '#e9b189');
            api.line(p.x + 63, p.y + 4, p.x + 72, p.y - 3, '#f9b477', 2);
            api.line(p.x + 69, p.y + 11, p.x + 80, p.y + 7, '#f9b477', 2);
          }
          drawKnife();
          let instruction = '';
          if (phase === 'ready') instruction = 'HEAT UNTIL PIPING HOT.';
          else if (phase === 'heating') instruction = 'HEATING…';
          else if (phase === 'hot') instruction = 'PULL THE DOOR HANDLE LEFT.';
          else if (phase === 'plate') instruction = 'SLIDE THE HOT PLATE ONTO THE COUNTER.';
          else if (phase === 'cut') instruction = 'PULL THE KNIFE DOWN THROUGH THE CENTER.';
          else if (phase === 'done') instruction = 'BOILING OUTSIDE. SOLID ICE INSIDE.';
          api.text(instruction, 240, 257, 8.2, '#d4ddd1');
          if (phase === 'cut' && cut < 0.1) {
            api.line(387, 171, 387, 219, '#d7dfcb', 1.5);
            api.line(387, 219, 382, 212, '#d7dfcb', 1.5); api.line(387, 219, 392, 212, '#d7dfcb', 1.5);
          }
        },
        down(p) {
          if (phase === 'ready' && api.hit(p, 338, 160, 58, 43)) { gesture = 'start'; }
          else if (phase === 'hot' && api.hit(p, 287, 120, 41, 103)) { gesture = 'door'; start = p; }
          else if (phase === 'plate' && api.hit(p, 181, 155, 151, 62)) {
            gesture = 'plate'; start = p; hotTouch = true; api.say('Ouch! The plate is scorching.'); api.tone(780, 0.055, 0.014);
          } else if (phase === 'cut' && api.hit(p, knifePos().x, knifePos().y, 42, 48)) {
            gesture = 'knife'; start = { x: p.x, y: p.y, cut };
          }
        },
        move(p) {
          if (gesture === 'door') door = api.clamp((start.x - p.x) / 94, 0, 1);
          if (gesture === 'plate') extraction = api.clamp(((p.x - start.x) * 89 + (p.y - start.y) * 47) / (89 * 89 + 47 * 47), 0, 1);
          if (gesture === 'knife' && Math.abs(p.x - 270) < 30) cut = api.clamp(start.cut + (p.y - start.y) / 59, 0, 1);
        },
        up(p) {
          if (gesture === 'start' && api.hit(p, 338, 160, 58, 43)) { phase = 'heating'; elapsed = 0; api.say('The outside is getting very hot.'); api.tone(540, 0.06, 0.014); }
          if (gesture === 'door') { if (door >= 0.9) { door = 1; phase = 'plate'; } else door = 0; }
          if (gesture === 'plate') {
            if (extraction >= 0.85) { extraction = 1; phase = 'cut'; api.say('Steaming meal. Scorching plate. Cut into the middle.'); }
            else extraction = 0;
          }
          if (gesture === 'knife' && cut >= 0.95) { cut = 1; phase = 'revealing'; elapsed = 0; api.tone(270, 0.05, 0.015); }
          gesture = null;
        },
        cancel() { if (gesture === 'door') door = 0; if (gesture === 'plate') extraction = 0; gesture = null; },
        update(dt) {
          clock += dt;
          if (phase === 'heating') {
            elapsed += dt; heat = api.clamp(elapsed / 2.6, 0, 1);
            if (heat >= 1) { phase = 'hot'; api.say('Ding. Pull the handle to open the door.'); api.tone(960, 0.16, 0.02); }
          }
          if (phase === 'revealing') {
            elapsed += dt; const t = api.clamp(elapsed / 1.05, 0, 1); reveal = t * t * (3 - 2 * t);
            if (elapsed >= 1.35) { reveal = 1; phase = 'done'; api.say('A solid frozen chunk, inside a steaming-hot meal.'); api.done(); }
          }
        },
        debug() {
          return { phase, heat, steaming: heat > 0.35, plateTooHot: heat >= 1, hotTouch, door, extraction, cut, reveal, frozenChunkVisible: reveal > 0.2, outsideHot: heat >= 1, solidFrozenCore: reveal >= 1, knife: knifePos(), elapsed };
        },
      };
    },
  });
})();
