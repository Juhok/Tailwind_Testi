(() => {
  'use strict';
  TinyV5.register({
    id: 'armor-paywall',
    title: 'The Armor Paywall',
    chapter: 'games',
    description: 'Win the long battle. Claim the legendary armor. Try it on.',
    hint: 'Hold the sword button at bottom right to defeat the sentinel, or drag your sword toward it. Then drag the gold armor onto your knight.',
    verdict: 'Legendary defense. No protection from monetization.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const maxHealth = 20;
      const popupTitle = 'Your playtime has expired.';
      const popupCta = 'Continue playing — €12.99.';
      let phase = 0, time = 0, health = maxHealth, attacks = 0;
      let holding = false, swordDrag = false, dragUsed = false, cooldown = 0;
      let strikeAge = 10, hitFlash = 0, deathTime = 0, equipped = false;
      let equipTime = 0, revealTime = 0, popupTime = 0, finished = false;
      let armorDrag = false, armorX = 329, armorY = 148, grabX = 0, grabY = 0;

      function strike() {
        if (phase !== 0 || cooldown > 0) return;
        attacks++;
        health--;
        cooldown = .43;
        strikeAge = 0;
        hitFlash = .24;
        api.tone(160 + attacks % 4 * 35, .055, .026);
        if (health <= 0) {
          phase = 1;
          holding = swordDrag = false;
          api.say('Victory. Something legendary is in that chest…');
        }
      }

      function star(x, y, size, color) {
        line(x - size, y, x + size, y, color, 1.5);
        line(x, y - size, x, y + size, color, 1.5);
      }

      function armor(x, y, scale = 1, alpha = 1) {
        ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.globalAlpha = alpha;
        poly([[-20, -23], [-9, -29], [-5, -21], [5, -21], [9, -29], [20, -23],
          [23, -10], [16, -5], [15, 20], [0, 27], [-15, 20], [-16, -5], [-23, -10]], '#805529');
        poly([[-18, -23], [-10, -26], [-4, -18], [4, -18], [10, -26], [18, -23],
          [18, -7], [13, 0], [13, 17], [0, 23], [-13, 17], [-13, 0], [-18, -7]], '#e4af4c');
        poly([[-13, -15], [0, -8], [13, -15], [10, 15], [0, 20], [-10, 15]], '#f9d17c');
        poly([[0, -8], [13, -15], [10, 15], [0, 20]], '#d49135');
        line(-12, -13, 0, -5, '#fff0af', 2);
        line(0, -5, 0, 15, '#fff0af', 1.5);
        poly([[-26, -23], [-15, -29], [-12, -15], [-25, -11]], '#f2c563');
        poly([[26, -23], [15, -29], [12, -15], [25, -11]], '#f2c563');
        line(-26, -23, -15, -28, '#fff0af', 2);
        line(15, -28, 26, -23, '#fff0af', 2);
        poly([[0, -12], [5, -6], [0, 0], [-5, -6]], '#72e0c7');
        line(-12, 13, 12, 13, '#a97935', 2);
        ctx.restore();
      }

      function knight() {
        const swing = strikeAge < .34 ? Math.sin(strikeAge / .34 * Math.PI) : 0;
        const x = 116 + swing * 114;
        const gold = equipped || (phase === 3 && equipTime > .36);
        ellipse(x, 202, 28, 7, '#07131880');
        ctx.save(); ctx.translate(x, 181);
        poly([[-15, -29], [-24, 14], [-5, 7], [5, 12], [17, -26]], gold ? '#395d77' : '#783f4c');
        round(-13, -1, 10, 22, 3, gold ? '#d89c3d' : '#61727c');
        round(4, -1, 10, 22, 3, gold ? '#e9b950' : '#73848c');
        round(-17, 17, 15, 8, 3, '#38454f'); round(3, 17, 17, 8, 3, '#38454f');
        if (gold) {
          armor(0, -18, .73);
          line(-10, 1, -10, 16, '#ffe3a1', 2);
          line(7, 1, 7, 16, '#ffe3a1', 2);
        } else {
          poly([[-15, -33], [14, -33], [18, -10], [11, 5], [-12, 5], [-17, -10]], '#9d775d');
          line(-12, -27, 9, -8, '#d2ae81', 3);
          round(-15, -4, 30, 5, 1, '#513c35'); round(-3, -5, 7, 7, 1, '#bc9a56');
        }
        round(-12, -54, 25, 25, 8, gold ? '#efc76b' : '#a5b3b6');
        poly([[-11, -49], [0, -58], [12, -49], [11, -41], [-11, -41]], gold ? '#ffe19a' : '#c1cacc');
        rect(-8, -43, 18, 6, '#283a43');
        rect(1, -43, 2, 6, gold ? '#e1b45f' : '#9dadb2');
        line(0, -54, 0, -45, '#ffffff70', 2);
        round(13, -28, 9, 20, 4, gold ? '#ddaa4e' : '#7d8d94');
        ellipse(20, -14, 5, 5, '#b5b7a9');
        // Sword arc and a short lunge make every hit a real action beat.
        ctx.save(); ctx.translate(20, -14); ctx.rotate(.7 + swing * 1.05);
        round(-3, -3, 6, 16, 2, '#654c39');
        round(-11, -7, 22, 5, 1, gold ? '#f0c568' : '#b7a470');
        poly([[-4, -8], [-4, -53], [0, -62], [4, -53], [4, -8]], '#d8e4df');
        line(0, -13, 0, -53, '#ffffff', 1);
        ctx.restore();
        poly([[-20, -25], [-34, -20], [-32, 2], [-21, 11], [-12, 1], [-12, -20]], gold ? '#d6a04b' : '#657986');
        poly([[-21, -20], [-29, -17], [-27, 0], [-21, 5], [-17, -1], [-17, -17]], '#394f61');
        line(-21, -16, -21, 0, '#d5bc7c', 2);
        line(-26, -9, -16, -9, '#d5bc7c', 2);
        ctx.restore();
        if (gold && phase < 5) {
          for (let n = 0; n < 5; n++) {
            const a = time * 1.1 + n * 1.256;
            star(x + Math.cos(a) * 37, 158 + Math.sin(a) * 39, 2 + Math.sin(time * 4 + n), '#ffdc87');
          }
        }
      }

      function sentinel() {
        if (phase >= 2) return;
        const collapse = phase === 1 ? Math.min(1, deathTime / .95) : 0;
        const shake = hitFlash > 0 ? Math.sin(time * 100) * 3 : 0;
        ellipse(332, 202, 42, 10, '#07131880');
        ctx.save(); ctx.translate(330 + shake, 172 + collapse * 22); ctx.globalAlpha = 1 - collapse;
        round(-25, 0, 18, 30, 4, '#5c6878'); round(9, 0, 18, 30, 4, '#657381');
        poly([[-29, -46], [26, -46], [36, -10], [21, 10], [-22, 10], [-34, -9]], hitFlash > .12 ? '#b5c6bc' : '#7e8993');
        poly([[-27, -43], [-8, -39], [-8, 4], [-21, 7], [-31, -9]], '#576675');
        poly([[4, -38], [26, -43], [32, -11], [16, 5], [5, 2]], '#657381');
        poly([[-45, -45], [-25, -52], [-16, -29], [-40, -19]], '#8a9399');
        poly([[44, -45], [25, -52], [16, -29], [40, -19]], '#8a9399');
        round(-43, -24, 15, 33, 5, '#5d6b79'); round(30, -24, 15, 33, 5, '#687783');
        poly([[-20, -70], [0, -79], [20, -70], [17, -45], [0, -36], [-17, -45]], '#89949c');
        poly([[-20, -70], [-30, -83], [-24, -56], [-15, -53]], '#5d6d7b');
        poly([[20, -70], [30, -83], [24, -56], [15, -53]], '#5d6d7b');
        rect(-13, -61, 26, 7, '#263c49');
        rect(-10, -59, 7, 3, '#edb171'); rect(4, -59, 7, 3, '#edb171');
        poly([[0, -35], [8, -23], [0, -10], [-8, -23]], '#daa779');
        line(0, -74, -4, -66, '#4c5c6b', 2);
        line(1, -8, -7, 1, '#3f5263', 2);
        if (health < 13) { line(-18, -36, -10, -23, '#f4bd74', 2); line(-10, -23, -16, -13, '#f4bd74', 2); }
        if (health < 6) { line(17, -44, 10, -31, '#f4bd74', 2); line(10, -31, 20, -16, '#f4bd74', 2); }
        ctx.restore();
        if (hitFlash > 0) {
          const reach = 1 - hitFlash / .24;
          line(298 + reach * 10, 124, 354 - reach * 7, 183, '#fff2b8', 4);
          for (let n = 0; n < 5; n++) {
            const a = n * 1.257;
            star(330 + Math.cos(a) * (20 + reach * 25), 153 + Math.sin(a) * (20 + reach * 25), 2, '#f6cb7c');
          }
        }
        if (phase === 1) {
          for (let n = 0; n < 13; n++) {
            const a = n * 2.4, d = 18 + collapse * 48;
            const x = 330 + Math.cos(a) * d, y = 157 + Math.sin(a) * d + collapse * 22;
            ctx.globalAlpha = 1 - collapse * .8;
            poly([[x - 5, y - 4], [x + 4, y - 5], [x + 6, y + 4], [x - 3, y + 6]], n % 2 ? '#81909a' : '#acb4b2');
          }
          ctx.globalAlpha = 1;
        }
      }

      function chest() {
        ellipse(329, 205, 39, 8, '#07131880');
        poly([[300, 179], [304, 154], [352, 154], [358, 179]], '#684b3d');
        line(306, 159, 350, 159, '#d0a665', 4);
        poly([[298, 179], [359, 179], [354, 203], [303, 203]], '#a6764b');
        rect(304, 181, 8, 20, '#d4ae66'); rect(345, 181, 7, 20, '#d4ae66');
        round(323, 179, 12, 12, 2, '#f5cf79'); rect(328, 183, 3, 5, '#655140');
        line(301, 178, 357, 178, '#ffe2a0', 3);
      }

      function popup() {
        rect(0, 0, 480, 270, '#07111bd6');
        const s = .88 + .12 * Math.min(1, popupTime / .25);
        ctx.save(); ctx.translate(240, 135); ctx.scale(s, s); ctx.translate(-240, -135);
        round(52, 47, 376, 184, 15, '#060d1670');
        round(52, 42, 376, 184, 15, '#f1e7d5', '#fff6e3');
        round(52, 42, 376, 39, 15, '#293a4a');
        rect(52, 65, 376, 16, '#293a4a');
        text('THE ADVENTURE CONTINUES*', 240, 67, 11, '#e8c68b');
        ellipse(240, 103, 13, 13, '#d49c4c');
        ellipse(240, 103, 10, 10, '#f5e5c1');
        line(240, 96, 240, 103, '#7c5a3d', 2);
        line(240, 103, 246, 106, '#7c5a3d', 2);
        text(popupTitle, 240, 133, 16, '#2f3a45');
        round(80, 149, 320, 39, 8, '#a3663c');
        round(80, 146, 320, 39, 8, '#cf9455');
        text(popupCta, 240, 171, 15, '#fff6df');
        text('*Armor equipped. Adventure not included.', 240, 209, 10, '#716d66');
        ctx.restore();
      }

      return {
        down(p) {
          if (phase === 0) {
            if (Math.hypot(p.x - 414, p.y - 224) < 31) { holding = true; strike(); }
            else if (Math.hypot(p.x - 145, p.y - 145) < 43) { swordDrag = true; dragUsed = false; }
          } else if (phase === 2 && Math.hypot(p.x - armorX, p.y - armorY) < 39) {
            armorDrag = true; grabX = p.x - armorX; grabY = p.y - armorY;
            api.tone(680, .05, .02);
          }
        },
        move(p) {
          if (phase === 0 && swordDrag && !dragUsed && p.x > 275 && p.y > 87 && p.y < 209) {
            strike(); dragUsed = true;
          }
          if (phase === 2 && armorDrag) { armorX = clamp(p.x - grabX, 30, 450); armorY = clamp(p.y - grabY, 42, 218); }
        },
        up(p) {
          holding = swordDrag = false;
          if (phase === 2 && armorDrag) {
            if (p && Math.hypot(armorX - 116, armorY - 156) < 44) {
              phase = 3; equipTime = 0; api.say('Legendary armor: equipped. This is going to be good.');
              api.tone(880, .24, .03);
            } else { armorX = 329; armorY = 148; api.say('That armor belongs on your knight.'); }
          }
          armorDrag = false;
        },
        cancel() {
          holding = swordDrag = armorDrag = false;
          if (phase === 2) { armorX = 329; armorY = 148; }
        },
        update(dt) {
          time += dt; strikeAge += dt; cooldown = Math.max(0, cooldown - dt); hitFlash = Math.max(0, hitFlash - dt);
          if (phase === 0 && holding && cooldown <= 0) strike();
          if (phase === 1) {
            deathTime += dt;
            if (deathTime >= 1.05) {
              phase = 2; api.say('LEGENDARY DROP! Drag the gold armor onto your knight.'); api.tone(690, .2, .03);
            }
          } else if (phase === 3) {
            equipTime += dt;
            if (equipTime >= .8) { equipped = true; phase = 4; }
          } else if (phase === 4) {
            revealTime += dt;
            if (revealTime >= 1.05) { phase = 5; api.say('Your armor is ready. Your playtime is not.'); api.tone(210, .2, .025); }
          } else if (phase === 5) {
            popupTime += dt;
            if (popupTime > .4 && !finished) { finished = true; api.done(); }
          }
        },
        draw() {
          const sky = ctx.createLinearGradient(0, 0, 0, 270);
          sky.addColorStop(0, '#152536'); sky.addColorStop(1, '#34474a');
          rect(0, 0, 480, 270, sky);
          ellipse(243, 60, 28, 28, '#b4c5b652');
          ellipse(254, 54, 25, 26, '#1b2e3b');
          for (let n = 0; n < 12; n++) ellipse(19 + n * 39, 12 + n * 17 % 66, .9, .9, '#cedacb60');
          poly([[181, 170], [181, 105], [198, 105], [198, 88], [219, 88], [219, 109], [261, 109], [261, 86], [281, 86], [281, 103], [300, 103], [300, 170]], '#20323f');
          poly([[182, 104], [190, 83], [199, 104]], '#293e4b');
          poly([[260, 86], [271, 66], [283, 86]], '#293e4b');
          round(230, 131, 23, 40, 10, '#142632');
          for (const x of [18, 61, 407, 453]) {
            rect(x, 36, 13, 152, '#162d34');
            poly([[x + 7, 19], [x - 24, 99], [x - 11, 95], [x - 34, 143], [x + 43, 143], [x + 23, 95], [x + 36, 99]], '#1a343a');
          }
          poly([[0, 189], [90, 170], [207, 177], [300, 164], [480, 184], [480, 270], [0, 270]], '#344b48');
          ellipse(241, 203, 210, 33, '#5c6558');
          ellipse(241, 204, 197, 24, '#737264');
          for (let n = 0; n < 17; n++) {
            const x = 57 + n * 23, y = 197 + n * 11 % 22;
            line(x, y, x + 9, y + 2, '#4d5a52', 1.3);
          }
          // Pixel-like crenellations frame the arena without hiding its actors.
          for (const x of [16, 426]) {
            round(x, 147, 35, 54, 3, '#566565');
            rect(x - 3, 143, 41, 11, '#78807a');
            rect(x - 3, 136, 9, 10, '#78807a'); rect(x + 13, 136, 9, 10, '#78807a'); rect(x + 29, 136, 9, 10, '#78807a');
            line(x, 173, x + 35, 173, '#3d5053', 2); line(x + 17, 154, x + 17, 172, '#3d5053', 2);
          }
          sentinel();
          if (phase >= 2) chest();
          knight();
          if (phase === 2) {
            ellipse(329, 198, 32, 6, '#ffe4a140');
            if (!armorDrag) {
              for (let n = 0; n < 7; n++) {
                const a = n * Math.PI * 2 / 7 + time * .35;
                star(329 + Math.cos(a) * 38, 147 + Math.sin(a) * 39, 2 + Math.sin(time * 4 + n), '#ffe1a1');
              }
              ctx.save(); ctx.setLineDash([3, 6]);
              line(285, 151, 164, 151, '#f9d27a80', 2); ctx.restore();
              line(171, 145, 163, 151, '#f9d27a', 2); line(171, 157, 163, 151, '#f9d27a', 2);
              ctx.beginPath(); ctx.arc(116, 156, 35, 0, Math.PI * 2); ctx.strokeStyle = '#f9d27a80'; ctx.lineWidth = 1.5; ctx.stroke();
            }
            armor(armorX, armorY + (armorDrag ? 0 : Math.sin(time * 3) * 2), 1.04);
          }
          if (phase === 3) {
            const f = Math.min(1, equipTime / .55);
            armor(116, 156, 1.2 - f * .47, 1 - Math.max(0, f - .5) * 2);
            ctx.beginPath(); ctx.arc(116, 156, 35 + equipTime * 35, 0, Math.PI * 2);
            ctx.strokeStyle = '#f7d783'; ctx.lineWidth = Math.max(.5, 3 - equipTime * 3); ctx.stroke();
          }
          round(19, 16, 128, 30, 6, '#142632d9', '#516166');
          text(equipped ? 'LEGENDARY KNIGHT' : 'ONE LAST BATTLE', 83, 35, 9, equipped ? '#f6ce7d' : '#cad4cb');
          if (phase <= 1) {
            text('IRON SENTINEL', 329, 23, 10, '#e4cfb2');
            round(255, 30, 150, 11, 3, '#14232f', '#76847b');
            for (let n = 0; n < maxHealth; n++) if (n < health) rect(258 + n * 7.2, 33, 5.7, 5, health < 6 ? '#e79562' : '#d5b17a');
            text(`${health} / ${maxHealth}`, 329, 55, 9, '#e0d6bd');
          } else {
            text(phase === 2 ? 'LEGENDARY DROP' : 'ARMOR EQUIPPED', 329, 31, 12, '#f4d28b');
          }
          if (phase === 0) {
            round(24, 226, 338, 28, 7, '#142632db');
            text('Hold to fight · or drag your sword', 192, 244, 10, '#d7d4bd');
            ellipse(414, 227, 29, 28, '#0c1b28');
            ellipse(414, holding ? 225 : 222, 27, 26, holding ? '#bc8b48' : '#806948');
            ctx.save(); ctx.translate(414, holding ? 225 : 222); ctx.rotate(.7);
            poly([[-3, 1], [-3, -15], [0, -21], [3, -15], [3, 1]], '#f7e8bc');
            line(-8, 2, 8, 2, '#f7e8bc', 3); line(0, 3, 0, 12, '#f7e8bc', 4);
            ctx.restore();
          } else {
            round(24, 228, 432, 27, 7, '#142632db');
            text(phase === 1 ? 'VICTORY!' : phase === 2 ? 'Drag your prize onto your knight' : 'At last. Time to try this thing out.', 240, 246, 11, '#ecd3a2');
          }
          if (phase === 5) popup();
        },
        debug() {
          return {
            phase, health, maxHealth, attacks, holding, swordDrag, armorDrag,
            armor: { x: armorX, y: armorY }, equipped, equipTime, revealTime,
            popupVisible: phase === 5,
            popupTitle: phase === 5 ? popupTitle : null,
            popupCta: phase === 5 ? popupCta : null,
            finished,
          };
        },
      };
    },
  });
})();
