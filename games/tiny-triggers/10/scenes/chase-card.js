(function () {
  'use strict';
  TinyV5.register({
    id: 'chase-card', title: 'The Off-Center Chase Card', chapter: 'games',
    description: 'Tear the booster open. Slowly slide out your rare card.',
    hint: 'Pull either end of the full-width top seal outward. Then drag the exposed card upward; you can pause halfway.',
    verdict: 'A once-in-a-lifetime pull. A twice-in-a-lifetime border.',
    create(api) {
      const { ctx } = api;
      let phase = 'sealed', tear = 0, reveal = 0, revealTarget = 0, clock = 0, opening = 0, finishing = 0;
      let gesture = null, start = null, baseReveal = 0, sparkleNote = false, tearDirection=1;
      const card = { x: 172, width: 136, height: 182 };
      const cardTop = () => 70 - reveal * 45;
      function star(x, y, r, color, angle = 0) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        api.poly([[0, -r], [r * 0.23, -r * 0.23], [r, 0], [r * 0.23, r * 0.23], [0, r], [-r * 0.23, r * 0.23], [-r, 0], [-r * 0.23, -r * 0.23]], color);
        ctx.restore();
      }
      function crystal(x, y, size, rotation = 0) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
        api.poly([[0, -size], [size * 0.6, -size * 0.3], [size * 0.45, size * 0.65], [0, size], [-size * 0.6, size * 0.4], [-size * 0.45, -size * 0.5]], '#a1e1ee');
        api.poly([[0, -size], [0, size], [-size * 0.6, size * 0.4], [-size * 0.45, -size * 0.5]], '#6a6cc4');
        api.poly([[0, -size], [size * 0.6, -size * 0.3], [0, 0]], '#e2fef3');
        ctx.restore();
      }
      function drawCard() {
        const x = card.x, y = cardTop(), w = card.width, h = card.height;
        api.round(x + 5, y + 5, w, h, 8, '#071018aa');
        const foil = ctx.createLinearGradient(x, y, x + w, y + h);
        foil.addColorStop(0, '#e6c387'); foil.addColorStop(0.22, '#faebba');
        foil.addColorStop(0.42, '#9cdacb'); foil.addColorStop(0.62, '#cda7e7'); foil.addColorStop(0.82, '#ffdc9a'); foil.addColorStop(1, '#d9eed5');
        api.round(x, y, w, h, 7, foil, '#f3e5b8');
        ctx.save(); ctx.beginPath(); ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 6); ctx.clip();
        for (let i = 0; i < 9; i++) {
          ctx.globalAlpha = 0.2;
          api.line(x - 80 + i * 24 + Math.sin(clock * 0.5) * 10, y + h, x + 5 + i * 24, y, i % 2 ? '#ffffff' : '#9d7dce', 8);
        }
        ctx.globalAlpha = 1;
        // The widened print plate is shifted right: 20 px of foil at left,
        // only 1 px at right. This is permanent physical misregistration.
        const px = x + 20, py = y + 7, pw = 115;
        api.round(px, py, pw, 169, 3, '#22314a');
        api.round(px + 3, py + 3, pw - 6, 17, 2, '#564975');
        api.text('ASTRAL DRAKE', px + pw / 2, py + 14, 8.2, '#fff0c0');
        const art = ctx.createLinearGradient(px, py + 22, px + pw, py + 134);
        art.addColorStop(0, '#59478e'); art.addColorStop(0.55, '#263f70'); art.addColorStop(1, '#132e42');
        api.rect(px + 3, py + 23, pw - 6, 112, art);
        ctx.save(); ctx.beginPath(); ctx.rect(px + 3, py + 23, pw - 6, 112); ctx.clip();ctx.translate(px+3,0);ctx.scale((pw-6)/97,1);ctx.translate(-px-3,0);
        api.ellipse(px + 72, py + 44, 20, 20, '#a6b9d0');
        api.ellipse(px + 65, py + 39, 19, 19, '#514a83');
        for (let i = 0; i < 15; i++) star(px + 8 + (i * 29) % 89, py + 29 + (i * 17) % 91, i % 3 ? 1 : 2, '#c3dce9');
        // A faceted dragon, curled tail and translucent crystal wings.
        api.poly([[px + 46, py + 81], [px + 7, py + 40], [px + 19, py + 83], [px + 32, py + 70]], '#877dde');
        api.poly([[px + 49, py + 82], [px + 33, py + 33], [px + 75, py + 66], [px + 57, py + 63]], '#9dd7e6');
        api.poly([[px + 33, py + 33], [px + 49, py + 82], [px + 53, py + 60]], '#d5f6e7');
        api.poly([[px + 8, py + 111], [px + 30, py + 122], [px + 55, py + 108], [px + 62, py + 83], [px + 74, py + 70], [px + 68, py + 57], [px + 57, py + 69], [px + 47, py + 98], [px + 32, py + 112]], '#88cbd5');
        api.poly([[px + 8, py + 111], [px + 30, py + 122], [px + 55, py + 108], [px + 47, py + 98], [px + 37, py + 117]], '#6a73b9');
        api.poly([[px + 64, py + 59], [px + 72, py + 47], [px + 74, py + 61], [px + 88, py + 66], [px + 75, py + 74], [px + 63, py + 70]], '#c2ecdf');
        api.poly([[px + 69, py + 57], [px + 71, py + 44], [px + 76, py + 59]], '#eedab0');
        api.ellipse(px + 76, py + 64, 1.6, 1.6, '#263754');
        crystal(px + 80, py + 112, 12, 0.3); crystal(px + 19, py + 100, 8, -0.3);
        ctx.restore();
        for (let i = 0; i < 3; i++) star(px + 38 + i * 13, py + 145, 4, '#f2d58a');
        api.text('PRISMATIC RARE', px + pw / 2, py + 160, 6.8, '#d5d0e4');
        // Foil glints sweep across the printed art and the oversized margin.
        for (let i = 0; i < 8; i++) {
          const pulse = 0.45 + 0.55 * Math.sin(clock * 3.1 + i * 2.8) ** 2;
          ctx.globalAlpha = pulse * (0.3 + reveal * 0.7);
          star(x + 10 + (i * 37) % 120, y + 20 + (i * 41) % 150, 2 + pulse * 2, '#fffce6', Math.PI / 8);
        }
        ctx.globalAlpha = 1; ctx.restore();
      }
      function drawPack() {
        const x = 158 + reveal * 100, y = 56 + reveal * 154;
        ctx.save(); ctx.translate(x + 82, y + 90); ctx.rotate(reveal * 0.12); ctx.translate(-82, -90);
        api.round(5, 5, 164, 199, 5, '#07141e99');
        const foil = ctx.createLinearGradient(0, 0, 164, 60);
        foil.addColorStop(0, '#303365'); foil.addColorStop(0.25, '#716ba1'); foil.addColorStop(0.48, '#454d86'); foil.addColorStop(0.77, '#9481b8'); foil.addColorStop(1, '#3c4774');
        if (phase === 'sealed') api.round(0, 0, 164, 199, 4, foil, '#a397c6');
        else {
          api.poly([[0, 33], [9, 27], [18, 34], [27, 27], [37, 34], [47, 28], [57, 34], [69, 27], [82, 34], [94, 27], [108, 34], [120, 28], [134, 34], [146, 28], [164, 33], [164, 199], [0, 179]], foil);
          api.poly([[2, 33], [13, 35], [21, 31], [34, 37], [47, 32], [65, 37], [82, 32], [102, 37], [122, 32], [141, 36], [162, 32], [162, 43], [2, 43]], '#b4a7c7');
          api.line(5, 39, 157, 39, '#182238', 4);
        }
        for (let i = 0; i < 16; i++) api.line(5 + i * 10, 187, 5 + i * 10, 197, '#b4a7cf', 1);
        api.line(10, 47, 154, 47, '#aaa2ce', 1);
        api.text('CRYSTAL', 82, 68, 16, '#f5edd7');
        api.text('CREST', 82, 86, 18, '#f5edd7');
        crystal(82, 116, 29, -0.16);
        star(36, 111, 5, '#efdfae'); star(129, 124, 7, '#c8e4ea');
        api.text('5 CARDS · 1 SHIMMERING CHANCE', 82, 176, 6.6, '#e6deec');
        if (phase === 'sealed') {
          // Either full-width edge can be grabbed; the torn strip follows that side.
          ctx.save(); ctx.translate(tear * 83*tearDirection, -tear * 18); ctx.rotate(tear * 0.2*tearDirection);
          api.round(0, 0, 173, 24, 3, '#aba0c6', '#e0d2e7');
          for (let i = 0; i < 20; i++) api.line(4 + i * 8, 2, 4 + i * 8, 11, '#706b91', 1);
          api.line(8, 18, 155, 18, '#534c73', 1);
          api.poly([[158, 11], [164, 7], [164, 15]], '#514768');
          ctx.restore();
          if (tear > 0.05) api.line(tearDirection>0?164*(1-tear):0,27,tearDirection>0?164:164*tear,27,'#111d2b',3);
        }
        ctx.restore();
        if (phase !== 'sealed') {
          ctx.save(); ctx.translate(tearDirection>0?368:106, 113 + Math.sin(clock) * 1); ctx.rotate(0.28);
          api.round(-54, -8, 108, 17, 2, '#9d91b6', '#dacbe0');
          for (let i = 0; i < 13; i++) api.line(-49 + i * 8, -6, -49 + i * 8, 0, '#625b84', 1);
          ctx.restore();
        }
      }
      function slideHit(p) {
        return p.x > card.x - 8 && p.x < card.x + card.width + 8 && p.y >= cardTop() - 7 && p.y <= Math.min(cardTop() + card.height, 93 + reveal * 154);
      }
      return {
        draw() {
          api.bg('desk');
          api.ellipse(239, 244, 121, 13, '#0c1822');
          if (phase !== 'sealed') drawCard();
          drawPack();
          if (phase === 'sealed') {
            api.text('PULL EITHER END',240,37,9,'#b7bed0');
            for(const d of [-1,1]){const xx=240+d*115;api.line(xx,68,xx+d*33,68,'#c6d2e1',2);api.line(xx+d*33,68,xx+d*26,63,'#c6d2e1',2);api.line(xx+d*33,68,xx+d*26,73,'#c6d2e1',2);}
          } else if (phase === 'reveal' && reveal < 0.95) {
            api.text('SLIDE UP', 104, 95, 10, '#bcc6d5');
            api.line(103, 149, 103, 111, '#a5c7d4', 2);
            api.line(103, 111, 98, 118, '#a5c7d4', 2); api.line(103, 111, 108, 118, '#a5c7d4', 2);
            api.text('Nice and slow…', 102, 170, 8, '#7e95a8');
          }
          if (reveal > 0.65) {
            for (let i = 0; i < 7; i++) {
              const angle = i * 0.97 - 0.7, radius = 103 + Math.sin(clock * 2 + i) * 5;
              const px = 241 + Math.cos(angle) * radius, py = 123 + Math.sin(angle) * 99;
              star(px, py, (3 + Math.sin(clock * 3 + i) * 1.5) * reveal, i % 2 ? '#d4bce9' : '#f3dda2');
            }
          }
          if (phase === 'done') api.text('PRISMATIC RARE. GENEROUSLY MARGINED.', 240, 257, 8.2, '#d2d0dd');
        },
        down(p) {
          if (phase === 'sealed' && api.hit(p, 240,68,184,42)) {
            gesture = 'tear'; start = p;tearDirection=p.x<240?-1:1;
          } else if (phase === 'reveal' && slideHit(p)) {
            gesture = 'slide'; start = p; baseReveal = revealTarget;
          }
        },
        move(p) {
          if (gesture === 'tear') tear = api.clamp((p.x - start.x)*tearDirection / 84, 0, 1);
          if (gesture === 'slide') revealTarget = api.clamp(baseReveal + (start.y - p.y) / 90, 0, 1);
        },
        up() {
          if (gesture === 'tear') {
            if (tear >= 0.9) {
              phase = 'opening'; opening = 0; api.say('A prismatic rare! Slide it upward, slowly.'); api.tone(390, 0.07, 0.02);
            } else tear = 0;
          }
          gesture = null;
        },
        cancel() { if (gesture === 'tear') tear = 0; gesture = null; },
        update(dt) {
          clock += dt;
          if (phase === 'opening') {
            opening += dt;
            if (opening >= 0.25) phase = 'reveal';
          }
          if (phase === 'reveal') {
            // Follow the user's distance, with a gentle speed cap for suspense.
            reveal += api.clamp(revealTarget - reveal, -dt * 0.52, dt * 0.52);
            if (reveal > 0.65 && !sparkleNote) { sparkleNote = true; api.tone(880, 0.12, 0.017); }
            if (reveal >= 0.999) {
              reveal = 1; finishing += dt;
              if (finishing >= 0.3) { phase = 'done'; api.say('One huge border. One almost missing.'); api.done(); }
            } else finishing = 0;
          }
        },
        guidance(){
          if(phase==='done')return null;
          if(phase==='opening'||(phase==='reveal'&&revealTarget>.99))return{kind:'wait',label:'The rare card is emerging…'};
          if(phase==='sealed')return{kind:'drag',from:[168,68],to:[80,60],label:'Pull either seal end outward'};
          const yy=Math.min(cardTop()+12,88+reveal*154);return{kind:'drag',from:[240,yy],to:[240,Math.max(4,yy-(1-revealTarget)*90)],label:'Slide the card upward'};
        },
        debug() {
          return { phase, tear, reveal, revealTarget, dragging: gesture, cardExposed: phase !== 'sealed', leftBorder: 20, rightBorder: 1, misprintVisible: reveal > 0.8, sparkling: reveal > 0.65,tearDirection,pack:{x:158,y:56,width:164,height:199},card:{...card,y:cardTop()},printWidth:115 };
        },
      };
    },
  });
})();
