(function () {
  'use strict';
  TinyV8.register({
    id: 'busy-crossing', title: 'The Suddenly Busy Crossing', chapter: 'road',
    description: 'A lovely quiet road. Walk up to the crossing.',
    hint: 'Drag the orange-coated pedestrian up the pavement to the yellow curb tiles, then release and watch both lanes.',
    verdict: 'Apparently the entire town was waiting for you.',
    create(api) {
      const { ctx } = api;
      const colors = ['#d19762', '#85b5b2', '#b4b674', '#a691b7', '#c77b78', '#7d9fb6'];
      let phase = 'approach', personY = 242, dragging = false, grabY = 0;
      let clock = 0, trafficTime = 0, walk = 0, passed = [0, 0], completed = false;
      const cars = [];

      function car(x, y, direction, color, variant) {
        ctx.save(); ctx.translate(x, y); ctx.scale(direction, 1);
        api.round(-35, -15, 74, 35, 9, '#12212b88');
        for (const yy of [-17, 12]) {
          api.round(-24, yy, 13, 5, 2, '#101b23');
          api.round(17, yy, 13, 5, 2, '#101b23');
        }
        api.round(-38, -14, 77, 29, 6, color);
        api.round(-35, -12, 71, 25, 5, color);
        api.line(-31, -12, 28, -12, '#f0edce66', 2);
        api.poly([[-14, -12], [13, -12], [22, -7], [22, 7], [13, 12], [-14, 12], [-21, 7], [-21, -7]], '#203846');
        api.round(-11, -10, 25, 20, 3, color);
        api.line(-9, -8, 10, -8, '#f0edce66', 2);
        api.poly([[15, -9], [20, -6], [20, 6], [15, 9]], '#85a9b6');
        api.line(-16, -7, -14, 5, '#7297a6', 2);
        api.rect(-6, -16, 7, 3, '#364f58'); api.rect(-6, 14, 7, 3, '#364f58');
        api.rect(35, -11, 3, 7, '#fff0bd'); api.rect(35, 5, 3, 7, '#fff0bd');
        api.rect(-38, -10, 3, 6, '#cf665a'); api.rect(-38, 5, 3, 6, '#cf665a');
        api.line(30, -9, 30, 9, '#20384633', 1);
        api.rect(37, -3, 2, 7, '#b4b8aa');
        if (variant % 4 === 1) {
          api.line(-4, -9, -4, 9, '#596c6c', 2);
          api.line(6, -9, 6, 9, '#596c6c', 2);
          api.round(-9, -6, 20, 12, 2, '#746d58');
          api.line(-5, -5, -5, 5, '#bbb390', 2);
        }
        ctx.restore();
      }

      function pedestrian() {
        const sway = dragging ? Math.sin(walk) * 2 : phase !== 'approach' ? Math.sin(clock * 1.5) * .6 : 0;
        const leg = dragging ? Math.sin(walk) * 3 : phase !== 'approach' ? Math.sin(clock * .9) * .7 : 0;
        ctx.save(); ctx.translate(240 + sway, personY);
        api.ellipse(2, 13, 13, 5, '#1c2a3650');
        api.round(-8, 5, 6, 12 + leg, 2, '#304452');
        api.round(2, 5, 6, 12 - leg, 2, '#304452');
        api.round(-10, 14 + leg, 8, 5, 2, '#d0c9b6');
        api.round(2, 14 - leg, 8, 5, 2, '#d0c9b6');
        api.round(-12, -7, 6, 16, 3, '#b87548');
        api.round(6, -7, 6, 16, 3, '#d39860');
        api.ellipse(-9, 10, 3, 3, '#dcb291'); api.ellipse(9, 10, 3, 3, '#dcb291');
        api.round(-8, -8, 16, 20, 4, '#da9b5b');
        api.round(-7, -4, 14, 17, 4, '#446c6c', '#abc4a5');
        api.round(-5, 4, 10, 6, 2, '#638b7c');
        const look = phase === 'approach' ? 0 : Math.sin(clock * 1.9) * 2;
        api.ellipse(look, -13, 7, 8, '#e0b995');
        api.ellipse(look, -17, 8, 5, '#564740');
        api.rect(look - 7, -17, 14, 4, '#65534a');
        api.line(look - 3, -20, look + 4, -20, '#9a7860', 1.5);
        ctx.restore();
      }

      function sign(x, y) {
        api.line(x, y, x, y + 45, '#52636b', 4);
        api.round(x - 14, y - 15, 28, 29, 3, '#7195a3', '#b4c9c5');
        api.poly([[x, y - 11], [x - 12, y + 10], [x + 12, y + 10]], '#e6e4cd');
        api.ellipse(x + 1, y - 5, 2, 2, '#344953');
        api.line(x + 1, y - 2, x - 2, y + 3, '#344953', 2);
        api.line(x - 2, y + 3, x - 5, y + 7, '#344953', 2);
        api.line(x - 2, y + 3, x + 3, y + 7, '#344953', 2);
        api.line(x, y, x + 4, y + 2, '#344953', 1.5);
        for (let i = -7; i < 9; i += 5) api.rect(x + i, y + 9, 3, 1, '#344953');
      }

      function startTraffic() {
        phase = 'rush'; trafficTime = 0; personY = 210;
        for (let lane = 0; lane < 2; lane++) {
          const direction = lane === 0 ? -1 : 1;
          for (let i = 0; i < 7; i++) cars.push({
            x: lane === 0 ? 530 + i * 117 : -55 - i * 121,
            y: lane === 0 ? 112 : 161, direction,
            speed: lane === 0 ? 195 : 205, lane,
            variant: i + lane * 3, crossed: false
          });
        }
        api.say('Oh. Everybody is driving today.');
        api.tone(115, .18, .014, -0.4);
      }

      return {
        draw() {
          api.rect(0, 0, 480, 270, '#263a46');
          // A small neighbourhood, with the pavement continuing on either side.
          api.rect(0, 0, 480, 28, '#344d59');
          api.round(20, -13, 147, 75, 4, '#637b7b');
          api.rect(20, 12, 147, 5, '#92a29a');
          api.round(32, 22, 75, 36, 2, '#263d49');
          api.round(115, 22, 39, 40, 2, '#2d434c');
          api.rect(34, 23, 71, 5, '#bac9b055');
          api.line(70, 23, 70, 57, '#819793', 3);
          api.line(116, 25, 116, 59, '#8c9b92', 2);
          api.rect(143, 41, 3, 7, '#c8bd94');
          api.text('CORNER BAKERY', 92, 10, 7, '#e6ddba');
          api.round(299, -15, 161, 77, 4, '#837e71');
          for (let x = 312; x < 450; x += 37) {
            api.rect(x, 8, 25, 34, '#283f49');
            api.rect(x + 2, 11, 21, 3, '#acb9aa55');
            api.line(x + 12, 8, x + 12, 41, '#b0ae95', 2);
            api.rect(x - 2, 42, 29, 4, '#b0ae95');
          }
          api.rect(0, 62, 480, 24, '#75837c');
          api.rect(0, 83, 480, 6, '#c2c3a9');
          api.rect(0, 89, 480, 102, '#34434c');
          api.rect(0, 89, 480, 4, '#253540');
          api.rect(0, 187, 480, 4, '#253540');
          for (let x = 10; x < 480; x += 30) {
            api.line(x, 68, x, 83, '#62736e', 1);
            if (x < 200 || x > 280) api.rect(x, 137, 16, 2, '#a4a891');
          }
          for (let i = 0; i < 45; i++) {
            const x = (i * 83 + 19) % 480, y = 96 + (i * 29) % 88;
            api.rect(x, y, 2, 1, i % 2 ? '#69777740' : '#162b3544');
          }
          // The zebra crossing is deliberately still empty before the approach.
          for (let y = 95; y < 187; y += 13) {
            api.rect(207, y, 66, 8, '#d3d2b7');
            api.rect(209, y + 1, 62, 2, '#e8e4cb');
            api.rect(221 + (y % 3) * 12, y + 5, 3, 2, '#a2aaa0');
          }
          api.rect(0, 191, 480, 79, '#788780');
          api.rect(0, 191, 480, 5, '#c8c8af');
          api.rect(0, 196, 480, 2, '#52665f');
          for (let y = 218; y < 270; y += 24) {
            api.line(0, y, 480, y, '#657970', 1);
            for (let x = y % 48; x < 480; x += 48) api.line(x, y - 20, x, y, '#657970', 1);
          }
          api.rect(205, 197, 70, 12, '#b8a67b');
          for (let x = 210; x < 274; x += 7) for (let y = 200; y < 208; y += 5) api.ellipse(x, y, 1, 1, '#8b7d61');
          for (const [x, y] of [[185, 45], [36, 228], [438, 233]]) {
            api.ellipse(x + 4, y + 17, 23, 8, '#344f4850');
            api.line(x, y + 4, x, y + 18, '#645a49', 5);
            api.ellipse(x, y - 3, 19, 20, '#3c6256');
            api.ellipse(x - 7, y - 10, 12, 12, '#587968');
            api.rect(x - 12, y - 13, 5, 3, '#789278');
          }
          sign(289, 49); sign(186, 213);
          // No lane can be entered: the pedestrian stops safely on the pavement.
          for (const vehicle of cars) car(vehicle.x, vehicle.y, vehicle.direction, colors[vehicle.variant % colors.length], vehicle.variant);
          pedestrian();
          if (phase === 'approach') {
            api.round(301, 226, 113, 28, 5, '#263d47');
            api.text('JUST ACROSS HERE', 357, 244, 8, '#ced5ba');
            ctx.setLineDash([3, 4]); api.line(240, personY - 25, 240, 215, '#e4dab1', 1.5); ctx.setLineDash([]);
            api.poly([[236, 218], [240, 213], [244, 218]], '#e4dab1');
          } else {
            api.round(300, 225, 118, 30, 5, '#263d47');
            api.text(phase === 'done' ? 'STILL WAITING...' : 'ANY SECOND NOW...', 359, 239, 8, '#e1ceb0');
            api.text('LOOK LEFT. LOOK RIGHT.', 359, 249, 6, '#9fb6ad');
          }
        },
        down(p) {
          if (phase === 'approach' && api.hit(p, 240, personY - 2, 38, 48)) {
            dragging = true; grabY = p.y - personY;
          }
        },
        move(p) {
          if (!dragging) return;
          const next = api.clamp(p.y - grabY, 210, 244);
          walk += Math.abs(next - personY) * .4; personY = next;
        },
        up() {
          if (!dragging) return;
          dragging = false;
          if (personY <= 214) startTraffic();
          else personY = 242;
        },
        cancel() {
          if (dragging) personY = 242;
          dragging = false;
        },
        update(dt) {
          clock += dt;
          if (phase === 'approach') return;
          trafficTime += dt;
          for (const vehicle of cars) {
            vehicle.x += vehicle.direction * vehicle.speed * dt;
            if (!vehicle.crossed && (vehicle.direction > 0 ? vehicle.x > 275 : vehicle.x < 205)) {
              vehicle.crossed = true; passed[vehicle.lane]++;
            }
            if (vehicle.direction > 0 && vehicle.x > 560) {
              vehicle.x -= 121 * 7; vehicle.crossed = false; vehicle.variant += 2;
            } else if (vehicle.direction < 0 && vehicle.x < -80) {
              vehicle.x += 117 * 7; vehicle.crossed = false; vehicle.variant += 2;
            }
          }
          if (!completed && trafficTime >= 7.3 && passed.every(n => n >= 5)) {
            phase = 'done'; completed = true; api.done();
          }
        },
        debug() {
          return { phase, dragging, personY, trafficTime, vehicles: cars.length,
            passed: [...passed], directions: cars.length ? [-1, 1] : [],
            trafficPositions: cars.map(c => Math.round(c.x)),
            safelyOnPavement: personY >= 210, completed };
        }
      };
    }
  });
})();
