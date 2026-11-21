(() => {
  'use strict';

  TinyV5.register({
    id: 'forgotten-milk',
    title: 'The Forgotten Milk',
    chapter: 'kitchen',
    description: 'Unpack the whole shop. Set up a coffee. Check the fridge.',
    hint: 'Drag all four groceries from the full bag onto their spots at the left. Move the coffee packet onto the mat, then bring down the mug. Pull the fridge handle left.',
    verdict: 'Everything on the list. Except the reason for the list.',
    create(api) {
      const { ctx } = api;
      const groceries = [
        { id: 'bread', x: 205, y: 103, from: [205, 103], to: [33, 169], hit: [205, 97, 30, 61], unpacked: false },
        { id: 'cereal', x: 245, y: 107, from: [245, 107], to: [79, 174], hit: [245, 99, 39, 43], unpacked: false },
        { id: 'greens', x: 279, y: 110, from: [279, 110], to: [125, 180], hit: [279, 97, 35, 51], unpacked: false },
        { id: 'coffee', x: 234, y: 139, from: [234, 139], to: [173, 177], hit: [234, 132, 39, 32], unpacked: false },
      ];
      const coffee = groceries[3];
      const mug = { x: 75, y: 69 };
      let phase = 'unpack';
      let gesture = null;
      let coffeeSet = false;
      let mugSet = false;
      let bagCollapse = 0;
      let doorOpen = 0;
      let elapsed = 0;
      let time = 0;
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

      function drawItem(item) {
        ctx.save();
        ctx.translate(item.x, item.y);
        if (item.id === 'bread') {
          ctx.rotate(-0.14);
          api.round(-10, -38, 20, 76, 10, '#d9a15e');
          api.round(-7, -35, 9, 65, 4, '#efd097');
          for (let y = -24; y < 27; y += 13) line([[-6, y + 4], [5, y - 3]], '#ab743f', 2);
          api.poly([[-12, 2], [12, 2], [10, 38], [-10, 38]], '#c2ae83');
          line([[-7, 5], [-5, 35]], '#e0d1a7', 1);
        } else if (item.id === 'cereal') {
          api.poly([[-18, -29], [14, -29], [19, -24], [19, 29], [-18, 29]], '#d2a54d');
          api.rect(-16, -26, 30, 52, '#e9c477');
          api.rect(14, -26, 5, 55, '#b48b41');
          api.text('OATS', -1, -7, 10, '#6b6349');
          api.ellipse(-1, 9, 11, 5, '#f2e9c9');
          api.poly([[-12, 9], [10, 9], [6, 17], [-8, 17]], '#78908b');
          for (let i = 0; i < 5; i++) api.ellipse(-8 + i * 3.6, 8, 1.2, 1, '#b0925d');
          api.line(-11, -21, 8, -21, '#fff0bd', 2);
        } else if (item.id === 'greens') {
          api.poly([[-13, -1], [12, -1], [8, 25], [-8, 25]], '#a7b7a0');
          for (let i = 0; i < 5; i++) {
            const x = -11 + i * 5.3;
            line([[x, 13], [x * 1.3, -23 - i % 2 * 4]], '#9ca575', 2);
            ctx.save();
            ctx.translate(x, -18 - i % 2 * 5);
            ctx.rotate((i - 2) * 0.19);
            api.ellipse(0, 0, 8, 16, i % 2 ? '#587d62' : '#73976a');
            api.line(0, 9, 0, -10, '#b6c08477', 1);
            ctx.restore();
          }
          api.rect(-12, 5, 24, 8, '#d5c69d');
        } else if (item.id === 'coffee') {
          api.poly([[-16, -22], [14, -22], [17, 23], [-18, 23]], '#805344');
          api.rect(-15, -23, 29, 6, '#ad7960');
          api.rect(-12, -11, 24, 27, '#e7cf9c');
          api.text('COFFEE', 0, -3, 6, '#684d40');
          ctx.save();
          ctx.translate(0, 6);
          ctx.rotate(-0.5);
          api.ellipse(0, 0, 4, 6, '#73503c');
          line([[1, -4], [-1, 0], [1, 4]], '#c79a6b', 1);
          ctx.restore();
          api.line(-13, 20, 12, 20, '#ba8b68', 1);
        }
        ctx.restore();
      }

      function drawMug() {
        ctx.save();
        ctx.translate(mug.x, mug.y);
        ctx.beginPath();
        ctx.ellipse(16, 1, 7, 9, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#dce2ce';
        ctx.lineWidth = 4;
        ctx.stroke();
        api.round(-14, -8, 29, 24, 5, '#d5ddc9');
        api.ellipse(0, -7, 14.5, 5, '#eff0da');
        api.ellipse(0, -7, 10.5, 2.8, '#798f85');
        api.rect(-10, -3, 3, 14, '#f6f0d782');
        api.line(-9, 12, 9, 12, '#9db5a633', 1);
        ctx.restore();
      }

      function bag(back) {
        ctx.save();
        ctx.translate(0, bagCollapse * 5);
        ctx.translate(240, 220);
        ctx.scale(1, 1 - bagCollapse * 0.85);
        ctx.translate(-240, -220);
        if (back) {
          api.ellipse(240, 139, 55, 12, '#72553d');
          api.poly([[188, 138], [292, 138], [285, 219], [196, 219]], '#a68355');
          line([[203, 139], [203, 118], [221, 112], [231, 139]], '#b89868', 4);
          line([[252, 138], [259, 114], [277, 120], [278, 138]], '#b89868', 4);
        } else {
          api.poly([[188, 144], [292, 144], [284, 219], [196, 219]], '#bf9c68');
          api.poly([[188, 144], [204, 153], [211, 219], [196, 219]], '#9d7d53');
          api.poly([[292, 144], [278, 154], [273, 219], [284, 219]], '#ad895b');
          line([[204, 153], [241, 158], [278, 154]], '#dfbd8777', 1);
          api.text('MARKET', 242, 182, 11, '#756343');
          line([[238, 200], [242, 186], [247, 194]], '#7e7f50', 2);
          api.ellipse(236, 191, 5, 3, '#8b8a55');
          api.ellipse(248, 189, 5, 3, '#8b8a55');
          line([[210, 211], [270, 211]], '#e0bc8377', 1);
        }
        ctx.restore();
      }

      function fridge() {
        api.round(329, 27, 143, 216, 8, '#142a32');
        api.round(333, 29, 137, 210, 7, '#9aafab');
        api.round(341, 37, 121, 193, 4, '#d0dbc7');
        api.rect(347, 43, 109, 181, '#819d93');
        api.rect(351, 44, 101, 179, '#acc1ad');
        api.rect(350, 91, 103, 7, '#d9e1c7');
        api.rect(350, 154, 103, 7, '#d9e1c7');
        api.rect(350, 213, 103, 7, '#d9e1c7');
        // Plenty of food, but deliberately no carton or milk bottle anywhere.
        api.round(359, 72, 40, 17, 4, '#b2ac7f');
        for (let i = 0; i < 4; i++) api.ellipse(365 + i * 9, 72, 4, 5, '#ede2bf');
        api.round(415, 59, 20, 31, 4, '#789460');
        api.rect(414, 56, 22, 6, '#b7a779');
        api.rect(419, 69, 12, 10, '#d6d3a2');
        api.round(428, 119, 19, 34, 4, '#ac6845');
        api.rect(429, 115, 17, 5, '#e1c18c');
        api.rect(431, 132, 13, 10, '#e5d4a8');
        api.round(359, 196, 38, 15, 3, '#d8bb69');
        api.line(361, 198, 394, 198, '#f1d691', 2);
        api.round(414, 190, 34, 21, 5, '#718e66');
        api.ellipse(431, 190, 16, 5, '#8da57b');
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = phase === 'complete' || phase === 'revealing' ? '#fff0b4' : '#d3dbc2';
        ctx.lineWidth = 1.3;
        ctx.strokeRect(358, 108, 59, 42);
        ctx.restore();
        api.round(369, 156, 39, 10, 2, '#eee5bb');
        api.text('MILK', 389, 164, 7, '#74664b');
        if (phase === 'revealing' || phase === 'complete') {
          api.text('EMPTY', 388, 133, 8, '#ebedcf');
        }

        // A physical left hinge; the door narrows in perspective as pulled left.
        const width = 128 - doorOpen * 116;
        const edge = 335 + width;
        const shade = ctx.createLinearGradient(335, 0, edge, 0);
        shade.addColorStop(0, '#93a9a5');
        shade.addColorStop(0.3, '#c6d3c4');
        shade.addColorStop(1, '#b2c4b9');
        ctx.fillStyle = shade;
        ctx.beginPath();
        ctx.roundRect(335, 32, width, 201, 5);
        ctx.fill();
        api.line(edge - 2, 39, edge - 2, 225, '#eef0db77', 1);
        api.line(338, 37, 338, 228, '#5d7e7d', 2);
        api.round(edge - Math.max(5, width * 0.12) - 3, 99, 6, 50, 3, '#667f80');
        api.line(edge - Math.max(5, width * 0.12), 104, edge - Math.max(5, width * 0.12), 143, '#dce3d2', 1);
        if (doorOpen < 0.77) {
          ctx.save();
          ctx.translate(335, 0);
          ctx.scale(width / 128, 1);
          api.round(39, 57, 51, 29, 2, '#eee4bb');
          api.ellipse(65, 57, 4, 4, '#b46b52');
          for (let y = 65; y <= 78; y += 6) {
            line([[44, y], [46, y + 2], [49, y - 2]], '#738768', 1);
            api.line(54, y, 80, y, '#b0a477', 1);
          }
          ctx.restore();
        }
      }

      function draw() {
        api.rect(0, 0, 480, 270, '#293f43');
        for (let y = 19; y < 178; y += 40) api.line(0, y, 328, y, '#7e93801a', 1);
        for (let x = 27; x < 325; x += 63) api.line(x, 0, x, 178, '#7e938012', 1);
        api.round(26, 85, 98, 7, 2, '#b79b72');
        api.rect(32, 92, 4, 12, '#7f775e');
        api.rect(114, 92, 4, 12, '#7f775e');
        api.rect(0, 211, 328, 59, '#3a5352');
        api.line(163, 216, 163, 270, '#1f393f', 2);
        api.round(122, 230, 26, 3, 1, '#9ba992');
        api.round(183, 230, 26, 3, 1, '#9ba992');
        api.rect(0, 194, 329, 22, '#997c5b');
        api.rect(0, 191, 329, 7, '#c6aa7c');
        api.line(0, 195, 325, 195, '#ead4a05e', 1);
        api.round(212, 191, 105, 23, 5, '#e0d7b2');
        for (let x = 217; x < 315; x += 6) api.line(x, 194, x, 210, '#a99e7d22', 1);
        if (!coffeeSet && phase !== 'unpack') {
          api.round(222, 188, 29, 18, 3, '#80694c22', '#9b866150');
        }
        if (!mugSet && phase === 'mug') api.ellipse(284, 202, 17, 6, '#786f532e');
        fridge();
        for (const item of groceries) if (item.unpacked && gesture?.item !== item) drawItem(item);
        if (gesture?.item !== mug) drawMug();
        bag(true);
        for (const item of groceries) if (!item.unpacked && gesture?.item !== item) drawItem(item);
        bag(false);
        if (gesture?.kind === 'item') {
          const [x, y] = gesture.target;
          api.ellipse(x, y + 16, 21, 7, '#f4e4ac35');
          ctx.save();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#f4e4ac99';
          ctx.strokeRect(x - 23, y - 24, 46, 48);
          ctx.restore();
          if (gesture.item === mug) drawMug();
          else drawItem(gesture.item);
        }
        const labels = {
          unpack: `UNPACK THE BAG  ${groceries.filter((g) => g.unpacked).length}/4`,
          'bag-empty': 'ALL THE SHOPPING. READY FOR COFFEE.',
          coffee: 'SET THE COFFEE ON THE MAT',
          mug: 'BRING DOWN YOUR MUG',
          fridge: 'NOW, A LITTLE MILK…',
        };
        if (labels[phase]) api.text(labels[phase], 166, 257, 9, '#d4d8ba');
        if (phase === 'fridge' && !gesture) {
          line([[434, 124], [408, 124]], '#f9ebbd', 2);
          line([[414, 119], [408, 124], [414, 129]], '#f9ebbd', 2);
        }
      }

      function pick(item, p, target) {
        gesture = { kind: 'item', item, target, origin: [item.x, item.y], start: [p.x, p.y], offset: [p.x - item.x, p.y - item.y] };
      }

      return {
        draw,
        down(p) {
          if (phase === 'unpack') {
            const item = [...groceries].reverse().find((g) => !g.unpacked && api.hit(p, ...g.hit));
            if (item) pick(item, p, item.to);
          } else if (phase === 'coffee' && api.hit(p, coffee.x, coffee.y, 48, 60)) {
            pick(coffee, p, [235, 188]);
          } else if (phase === 'mug' && api.hit(p, mug.x, mug.y, 54, 45)) {
            pick(mug, p, [284, 197]);
          } else if (phase === 'fridge') {
            const width = 128 - doorOpen * 116;
            const handleX = 335 + width - Math.max(5, width * 0.12);
            if (api.hit(p, handleX, 124, 48, 76)) gesture = { kind: 'door', startX: p.x, startOpen: doorOpen };
          }
        },
        move(p) {
          if (!gesture) return;
          if (gesture.kind === 'item') {
            gesture.item.x = api.clamp(p.x - gesture.offset[0], 18, 315);
            gesture.item.y = api.clamp(p.y - gesture.offset[1], 30, 234);
          } else {
            doorOpen = api.clamp(gesture.startOpen + (gesture.startX - p.x) / 104, 0, 1);
            if (doorOpen >= 0.98) {
              doorOpen = 1;
              phase = 'revealing';
              elapsed = 0;
              gesture = null;
              api.tone(390, 0.12, 0.018, 0.5);
              api.say('Bread. Cereal. Greens. Coffee. Milk…?');
            }
          }
        },
        up() {
          if (!gesture) return;
          if (gesture.kind === 'item') {
            const { item, target, origin } = gesture;
            const distance = Math.hypot(item.x - origin[0], item.y - origin[1]);
            if (distance > 12 && api.near(item, ...target, 35)) {
              [item.x, item.y] = target;
              if (phase === 'unpack') {
                item.unpacked = true;
                if (groceries.every((g) => g.unpacked)) { phase = 'bag-empty'; elapsed = 0; }
              } else if (phase === 'coffee') {
                coffeeSet = true;
                phase = 'mug';
                api.say('Coffee ready. Bring down the mug.');
              } else if (phase === 'mug') {
                mugSet = true;
                phase = 'fridge';
                api.say('Just needs a splash of milk.');
              }
              api.tone(560, 0.05, 0.012);
            } else [item.x, item.y] = origin;
          }
          gesture = null;
        },
        cancel() {
          if (gesture?.kind === 'item') [gesture.item.x, gesture.item.y] = gesture.origin;
          gesture = null;
        },
        update(dt) {
          time += dt;
          if (phase === 'bag-empty') {
            elapsed += dt;
            bagCollapse = smooth(elapsed / 0.45);
            if (elapsed >= 0.45) {
              phase = 'coffee';
              api.say('Full bag unpacked. Set out the coffee.');
            }
          } else if (phase === 'revealing') {
            elapsed += dt;
            if (elapsed >= 0.85) {
              phase = 'complete';
              completed = true;
              api.done();
            }
          }
        },
        debug() {
          const unpacked = groceries.filter((g) => g.unpacked).map((g) => g.id);
          return {
            phase, unpacked, bagCount: 4 - unpacked.length, bagCollapse,
            guideItems: groceries.map(g => ({id:g.id,from:[g.x,g.y],to:[...g.to]})), coffee: {x:coffee.x,y:coffee.y}, mug: {...mug},
            coffeeSet, mugSet, doorOpen, milkPresent: false,
            milkBayVisible: doorOpen > 0.65,
            dragging: gesture?.kind === 'item' ? (gesture.item.id || 'mug') : gesture?.kind || null,
            completed,
          };
        },
      };
    },
  });
})();
