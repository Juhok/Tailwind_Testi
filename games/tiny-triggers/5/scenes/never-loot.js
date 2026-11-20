(() => {
  'use strict';
  TinyV5.register({
    id: 'never-loot',
    title: 'The Never-Dropping Loot',
    chapter: 'games',
    description: 'Hunt for a knight’s Suncrest Helm. Surely the next enemy has it.',
    hint: 'Hold the sword button at bottom right through all 50 enemies. When the rare circlet appears, drag it onto your knight.',
    verdict: 'Fifty enemies. One legendary disappointment.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const junkNames = ['Bent sword', 'Apple core', 'Odd sock', 'Small coin', 'Cracked mug', 'Wooden spoon', 'Fish bones'];
      const counts = junkNames.map(() => 0), defeatedIds = [], drops = [], flying = [];
      const names = ['SCRAP SLIME', 'CAVE IMP', 'IRON BEETLE', 'BONE GUARD', 'SPORE CAP'];
      let phase = 0, time = 0, kills = 0, attacks = 0, holding = false;
      let enemy = { id: 1, hp: 2, kind: 0, spawn: 0 };
      let cooldown = 0, strikeAge = 10, flash = 0, rewardTime = 0;
      let itemX = 320, itemY = 139, dragging = false, grabX = 0, grabY = 0;
      let rejected = false, rejectTime = 0, rejectX = 0, rejectY = 0, finished = false;

      function attack() {
        if (phase !== 0 || cooldown > 0 || enemy.spawn > 0) return;
        cooldown = .145; strikeAge = 0; flash = .1; attacks++; enemy.hp--;
        api.tone(190 + enemy.kind * 35, .035, .018);
        if (enemy.hp > 0) return;
        defeatedIds.push(enemy.id);
        kills++;
        if (kills === 50) {
          drops.push('Moonglass Circlet');
          phase = 1; holding = false; rewardTime = 0;
          api.say('Enemy 50. Finally—a legendary drop!');
          api.tone(810, .24, .035);
        } else {
          const kind = (kills - 1) % junkNames.length;
          counts[kind]++;
          drops.push(junkNames[kind]);
          flying.push({ kind, age: 0, fromX: 310, fromY: 150 });
          enemy = { id: kills + 1, hp: 2, kind: kills % names.length, spawn: .09 };
          if (kills === 10) api.say('Ten enemies. Excellent collection of other things.');
          if (kills === 25) api.say('Halfway there. The next one, surely.');
          if (kills === 40) api.say('Forty down. Still no Suncrest Helm.');
        }
      }

      function sparkle(x, y, s, color) {
        line(x - s, y, x + s, y, color, 1.4);
        line(x, y - s, x, y + s, color, 1.4);
      }

      function helmetSilhouette(x, y) {
        ctx.save(); ctx.translate(x, y);
        poly([[-16, 1], [-13, -11], [-5, -17], [-3, -24], [3, -24], [5, -17], [13, -11], [16, 1], [12, 16], [4, 19], [0, 11], [-4, 19], [-12, 16]], '#c5b58e');
        rect(-11, -1, 22, 5, '#273b49'); rect(-2, -2, 4, 12, '#c5b58e');
        line(-2, -24, 2, -24, '#efd89d', 2);
        ctx.restore();
      }

      function junk(kind, x, y, scale = 1) {
        ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
        if (kind === 0) {
          ctx.rotate(.6);
          poly([[-3, 3], [-3, -11], [2, -16], [5, -13], [2, -7], [3, 3]], '#a9b3ac');
          line(-8, 3, 8, 3, '#b69a64', 3); line(0, 4, 0, 13, '#815d42', 4);
        } else if (kind === 1) {
          ellipse(0, -7, 9, 4, '#c27666'); ellipse(0, 8, 9, 4, '#c27666');
          poly([[-6, -6], [6, -6], [3, 1], [6, 8], [-6, 8], [-3, 1]], '#e7d5aa');
          line(0, -9, 2, -15, '#8e7753', 2); ellipse(0, 0, 1, 2, '#785d41');
        } else if (kind === 2) {
          poly([[-7, -13], [6, -13], [7, 5], [13, 7], [12, 14], [1, 14], [-7, 6]], '#bb97a9');
          rect(-7, -12, 13, 4, '#d6bfbd'); line(-1, 1, 4, 4, '#8b748d', 2);
        } else if (kind === 3) {
          ellipse(0, 2, 10, 9, '#a47743'); ellipse(0, 0, 10, 9, '#d1b36b');
          ellipse(0, 0, 6, 5, '#b99a56'); line(0, -4, 0, 4, '#f1d79b', 2);
        } else if (kind === 4) {
          round(-9, -10, 17, 23, 3, '#b5c0b5');
          ctx.beginPath(); ctx.arc(10, 0, 7, -Math.PI / 2, Math.PI / 2); ctx.strokeStyle = '#b5c0b5'; ctx.lineWidth = 4; ctx.stroke();
          ellipse(0, -9, 8, 3, '#6b7b78');
          line(1, -7, -2, 0, '#5c6e71', 1.3); line(-2, 0, 2, 5, '#5c6e71', 1.3);
        } else if (kind === 5) {
          ctx.rotate(-.4); ellipse(0, -8, 6, 9, '#c6a474'); line(0, -2, 0, 14, '#c6a474', 4);
          ellipse(0, -9, 3, 5, '#a78459');
        } else {
          line(-13, 0, 12, 0, '#c7d0bf', 2);
          poly([[10, 0], [17, -7], [17, 7]], '#c7d0bf');
          ellipse(-12, 0, 5, 6, '#c7d0bf'); ellipse(-13, -1, 1.2, 1.2, '#415461');
          for (let n = -5; n <= 6; n += 5) { line(n, 0, n - 3, -6, '#c7d0bf', 1.5); line(n, 0, n - 3, 6, '#c7d0bf', 1.5); }
        }
        ctx.restore();
      }

      function circlet(x, y, scale = 1) {
        ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
        ellipse(0, 6, 29, 14, '#887397');
        ellipse(0, 3, 28, 12, '#e3c6eb');
        ellipse(0, 1, 22, 7, '#493c64');
        poly([[-28, 2], [-31, -20], [-17, -9], [-11, -32], [0, -14], [11, -32], [17, -9], [31, -20], [28, 2], [0, 13]], '#cfade6');
        poly([[-24, 0], [-24, -12], [-15, -5], [-10, -23], [0, -7], [10, -23], [15, -5], [24, -12], [24, 0], [0, 8]], '#8578ba');
        poly([[0, -15], [9, -4], [0, 8], [-9, -4]], '#95e4e5');
        poly([[0, -15], [0, 8], [-9, -4]], '#d8fff5');
        line(-27, 1, -13, 7, '#f8ddfa', 2); line(13, 7, 27, 1, '#f8ddfa', 2);
        ellipse(-11, -31, 2, 2, '#f4dbf6'); ellipse(11, -31, 2, 2, '#f4dbf6');
        ctx.restore();
      }

      function hero() {
        const swing = phase === 0 && strikeAge < .145 ? Math.sin(strikeAge / .145 * Math.PI) : 0;
        const x = 104 + swing * 96;
        ellipse(x, 194, 28, 7, '#07121f90');
        ctx.save(); ctx.translate(x, 174);
        poly([[-16, -37], [-32, 15], [-12, 5], [9, 12], [13, -34]], '#934f57');
        round(-14, -1, 11, 23, 3, '#657e94'); round(4, -1, 11, 23, 3, '#8298aa');
        round(-18, 17, 16, 7, 2, '#384e66'); round(3, 17, 17, 7, 2, '#384e66');
        poly([[-18, -38], [17, -38], [20, -11], [13, 5], [-12, 5], [-20, -11]], '#8299aa');
        poly([[0, -35], [15, -32], [15, -12], [4, 0], [0, -2]], '#5d7892');
        line(-13, -29, -3, -22, '#c0cfcd', 2); line(-3, -22, 8, -28, '#c0cfcd', 2);
        round(-16, -7, 33, 5, 1, '#47546b'); round(-3, -8, 7, 7, 1, '#d3b57b');
        round(-13, -61, 27, 27, 7, '#b6c6c8');
        poly([[-12, -56], [0, -66], [13, -56], [10, -49], [-11, -49]], '#d9dfd5');
        rect(-10, -51, 23, 5, '#354b61'); rect(0, -53, 3, 17, '#839dab');
        poly([[0, -65], [3, -78], [18, -75], [25, -65], [12, -67], [4, -62]], '#b96d5c');
        round(13, -33, 10, 23, 4, '#6e8aa2');
        ctx.save(); ctx.translate(23, -17); ctx.rotate(.75 + swing * 1.05);
        line(0, 1, 0, 12, '#805e42', 6); line(-11, -1, 11, -1, '#d4b275', 4);
        poly([[-4, -4], [-4, -52], [0, -63], [4, -52], [4, -4]], '#dde5d7');
        line(0, -10, 0, -54, '#f9f7e5', 1.3); ctx.restore();
        poly([[-23, -31], [-40, -23], [-37, 0], [-23, 13], [-10, -1], [-10, -24]], '#c2af76');
        poly([[-23, -25], [-35, -20], [-32, -2], [-23, 7], [-16, -3], [-16, -20]], '#466b87');
        poly([[-23, -16], [-18, -9], [-23, -1], [-28, -9]], '#c9d9cb');
        ctx.restore();
        text('KNIGHT', 104, 89, 10, '#bdd0d8');
        if (rejected) {
          round(72, 96, 65, 22, 7, '#783f54', '#d58a93');
          text('WRONG CLASS', 104, 111, 7, '#ffdbcf');
          line(123, 133, 138, 148, '#ef8b8b', 3); line(138, 133, 123, 148, '#ef8b8b', 3);
        }
      }

      function foe() {
        if (phase !== 0) return;
        const x = 310 + enemy.spawn * 160 + (flash > 0 ? Math.sin(time * 90) * 3 : 0);
        const y = 170 + Math.sin(time * 4) * 1.3;
        ellipse(x, 194, 30, 7, '#09152380');
        ctx.save(); ctx.translate(x, y);
        if (enemy.kind === 0) {
          ctx.beginPath(); ctx.moveTo(-30, 17); ctx.bezierCurveTo(-30, -26, -9, -31, 4, -28); ctx.bezierCurveTo(21, -34, 34, -4, 31, 17); ctx.quadraticCurveTo(0, 30, -30, 17); ctx.fillStyle = '#76ab8c'; ctx.fill();
          ellipse(-10, -17, 8, 4, '#b9d8a0'); ellipse(-11, 0, 4, 5, '#233e4b'); ellipse(12, 0, 4, 5, '#233e4b');
          line(-5, 11, 6, 11, '#36544c', 2);
        } else if (enemy.kind === 1) {
          poly([[-22, -22], [-33, -47], [-9, -34], [11, -34], [34, -47], [23, -21]], '#9882aa');
          ellipse(0, -17, 26, 24, '#9b7ba9'); ellipse(0, 12, 19, 18, '#7d6d99');
          line(-16, 7, -30, 17, '#9b7ba9', 8); line(16, 7, 30, 17, '#9b7ba9', 8);
          ellipse(-10, -21, 5, 4, '#f2d79a'); ellipse(10, -21, 5, 4, '#f2d79a');
          poly([[-9, -5], [9, -5], [5, 3], [-5, 3]], '#483c5c');
        } else if (enemy.kind === 2) {
          for (let n = -1; n <= 1; n++) { line(-17, n * 12, -34, n * 16 + 7, '#879da8', 4); line(17, n * 12, 34, n * 16 + 7, '#879da8', 4); }
          ellipse(0, 0, 25, 29, '#5e8094'); ellipse(-5, -5, 14, 20, '#8eb1b9');
          line(0, -23, 0, 27, '#354f70', 2); ellipse(-7, -23, 4, 3, '#e9cb86'); ellipse(8, -23, 4, 3, '#e9cb86');
          line(-8, -29, -14, -38, '#7796a6', 2); line(8, -29, 14, -38, '#7796a6', 2);
        } else if (enemy.kind === 3) {
          round(-19, -45, 39, 32, 9, '#c6cbb9'); round(-12, -21, 26, 13, 2, '#c6cbb9');
          ellipse(-8, -29, 5, 6, '#405168'); ellipse(9, -29, 5, 6, '#405168');
          line(0, -8, 0, 17, '#b7c3b2', 5);
          for (let n = 0; n < 3; n++) line(-13, -5 + n * 7, 13, -5 + n * 7, '#c6cbb9', 4);
          line(-12, -5, -24, 16, '#c6cbb9', 5); line(13, -5, 25, 16, '#c6cbb9', 5);
          line(-5, 14, -12, 28, '#c6cbb9', 5); line(6, 14, 14, 28, '#c6cbb9', 5);
        } else {
          round(-14, -10, 29, 37, 11, '#c5c29c');
          ctx.beginPath(); ctx.moveTo(-33, -8); ctx.bezierCurveTo(-31, -53, 30, -53, 34, -8); ctx.quadraticCurveTo(0, 4, -33, -8); ctx.fillStyle = '#bd7f70'; ctx.fill();
          ellipse(-17, -23, 5, 4, '#e6c5a0'); ellipse(8, -32, 6, 4, '#e6c5a0'); ellipse(21, -17, 4, 3, '#e6c5a0');
          ellipse(-6, 7, 2, 3, '#4b5c5e'); ellipse(7, 7, 2, 3, '#4b5c5e');
        }
        ctx.restore();
        text(`${names[enemy.kind]} #${enemy.id}`, 310, 83, 9, '#c3c6c0');
        for (let n = 0; n < 2; n++) round(299 + n * 13, 91, 9, 4, 1, n < enemy.hp ? '#cc9e76' : '#38485c');
        if (flash > 0) {
          line(280, 130, 338, 181, '#fff2bd', 3);
          sparkle(336, 128, 4, '#f7cb87'); sparkle(281, 180, 3, '#f7cb87');
        }
      }

      return {
        down(p) {
          if (phase === 0 && Math.hypot(p.x - 420, p.y - 225) < 31) { holding = true; attack(); }
          else if (phase === 2 && Math.hypot(p.x - itemX, p.y - itemY) < 42) {
            dragging = true; grabX = p.x - itemX; grabY = p.y - itemY; api.tone(690, .05, .02);
          }
        },
        move(p) {
          if (phase === 0 && holding && Math.hypot(p.x - 420, p.y - 225) > 64) holding = false;
          if (phase === 2 && dragging) { itemX = clamp(p.x - grabX, 37, 443); itemY = clamp(p.y - grabY, 77, 192); }
        },
        up() {
          holding = false;
          if (phase === 2 && dragging) {
            if (Math.hypot(itemX - 104, itemY - 140) < 48) {
              phase = 3; rejected = true; rejectX = itemX; rejectY = itemY;
              api.say('Moonglass Circlet. SORCERER ONLY. You are a knight.'); api.tone(125, .25, .035);
            } else { itemX = 320; itemY = 139; }
          }
          dragging = false;
        },
        cancel() { holding = dragging = false; if (phase === 2) { itemX = 320; itemY = 139; } },
        update(dt) {
          time += dt; cooldown = Math.max(0, cooldown - dt); strikeAge += dt; flash = Math.max(0, flash - dt);
          if (phase === 0) { enemy.spawn = Math.max(0, enemy.spawn - dt); if (holding && cooldown <= 0) attack(); }
          for (let n = flying.length - 1; n >= 0; n--) { flying[n].age += dt; if (flying[n].age > .8) flying.splice(n, 1); }
          if (phase === 1) { rewardTime += dt; if (rewardTime > 1) { phase = 2; api.say('A legendary Moonglass Circlet! Drag it onto your knight.'); } }
          else if (phase === 3) {
            rejectTime += dt;
            const f = Math.min(1, rejectTime / .6), ease = 1 - (1 - f) ** 3;
            itemX = rejectX + (320 - rejectX) * ease;
            itemY = rejectY + (139 - rejectY) * ease - Math.sin(f * Math.PI) * 34;
            if (rejectTime > 1.35 && !finished) { phase = 4; finished = true; api.done(); }
          }
        },
        draw() {
          const bg = ctx.createLinearGradient(0, 0, 0, 270); bg.addColorStop(0, '#17243a'); bg.addColorStop(1, '#354057');
          rect(0, 0, 480, 270, bg);
          for (let row = 0; row < 5; row++) for (let col = -1; col < 10; col++) {
            round(col * 59 + row % 2 * 29, 64 + row * 29, 56, 26, 3, row % 2 ? '#28384b' : '#2b3b4d');
          }
          for (const x of [35, 207, 412]) {
            round(x, 89, 39, 91, 19, '#1b2a3e');
            line(x + 12, 110, x + 12, 172, '#314155', 3); line(x + 27, 110, x + 27, 172, '#314155', 3);
          }
          for (const x of [181, 388]) {
            round(x - 3, 119, 6, 23, 2, '#725f4e');
            poly([[x - 7, 120], [x - 4, 108], [x + 1, 100 + Math.sin(time * 8) * 3], [x + 5, 111], [x + 7, 120]], '#d5a56d');
            poly([[x - 3, 120], [x, 108], [x + 4, 120]], '#f6d698');
            ellipse(x, 118, 16, 22, '#edbd7710');
          }
          poly([[0, 180], [480, 180], [480, 270], [0, 270]], '#3a4655');
          for (let n = 0; n < 8; n++) line(n * 73 - 33, 199, n * 73, 270, '#52606a40', 1);
          line(0, 215, 480, 215, '#52606a40', 1);
          round(15, 10, 205, 49, 7, '#122437', '#4a5867');
          helmetSilhouette(42, 35);
          text('WANTED', 134, 27, 8, '#aab8bd');
          text('SUNCREST HELM', 134, 43, 11, '#e8cc8b');
          round(296, 13, 166, 42, 7, '#122437', '#4a5867');
          text('ENEMIES DEFEATED', 379, 28, 8, '#acbfc5');
          text(`${kills} / 50`, 379, 46, 15, '#f1d49b');
          hero(); foe();
          round(18, 207, 354, 48, 7, '#132437', '#52606a');
          for (let n = 0; n < junkNames.length; n++) {
            const x = 44 + n * 49;
            if (counts[n]) { junk(n, x, 228, .7); text(String(counts[n]), x + 11, 247, 8, '#c4cabe'); }
            else ellipse(x, 229, 9, 9, '#344456');
          }
          if (phase === 0) {
            ellipse(420, 229, 30, 29, '#101b2d'); ellipse(420, holding ? 227 : 223, 28, 27, holding ? '#d0a468' : '#927858');
            ctx.save(); ctx.translate(420, holding ? 227 : 223); ctx.rotate(.65);
            poly([[-3, 0], [-3, -16], [0, -23], [3, -16], [3, 0]], '#fff0ca');
            line(-8, 1, 8, 1, '#fff0ca', 3); line(0, 3, 0, 12, '#fff0ca', 4); ctx.restore();
            text('HOLD', 420, 265, 8, '#e4d1aa');
          }
          for (const f of flying) {
            const t = f.age / .8, destX = 44 + f.kind * 49;
            const x = f.fromX + (destX - f.fromX) * t, y = f.fromY + (228 - f.fromY) * t - Math.sin(t * Math.PI) * 46;
            junk(f.kind, x, y, 1 - t * .3);
          }
          if (phase >= 1) {
            const reveal = phase === 1 ? Math.min(1, rewardTime / .7) : 1;
            ellipse(320, 188, 47, 8, '#b894dd35');
            for (let n = 0; n < 8; n++) {
              const a = n * Math.PI / 4 + time * .12;
              const x = 320 + Math.cos(a) * 54, y = 139 + Math.sin(a) * 43;
              ctx.globalAlpha = .35 * reveal;
              poly([[315, 144], [x - 7, y - 5], [x + 7, y + 5], [325, 144]], '#d2b3ed'); ctx.globalAlpha = 1;
              sparkle(x, y, 2 + Math.sin(time * 3 + n), '#d9c8ed');
            }
            if (phase === 1) { ctx.globalAlpha = reveal; circlet(itemX, itemY, .7 + .3 * reveal); ctx.globalAlpha = 1; }
            else circlet(itemX, itemY, 1.05);
            text('LEGENDARY', 320, 77, 8, '#e4bfed');
            text('MOONGLASS CIRCLET', 320, 92, 11, '#f0d5f2');
            if (phase === 2) {
              text('Drag to equip', 320, 189, 10, '#e1d1e6');
              ctx.save(); ctx.setLineDash([3, 5]); line(269, 145, 163, 145, '#d4bee08c', 1.5); ctx.restore();
              line(171, 139, 162, 145, '#d4bee0', 1.5); line(171, 151, 162, 145, '#d4bee0', 1.5);
            }
            if (rejected) {
              round(247, 169, 146, 26, 7, '#683b56', '#bd829f');
              text('SORCERER ONLY', 320, 186, 11, '#ffdbdf');
              text('50 enemies.', 424, 224, 9, '#e3cfaa'); text('Wrong class.', 424, 240, 9, '#e3cfaa');
            }
          }
        },
        debug() {
          return {
            phase, kills, targetKills: 50, attacks, holding,
            enemy: { ...enemy }, defeatedIds: [...defeatedIds], junkCounts: [...counts], drops: [...drops],
            playerClass: 'KNIGHT', wantedItem: 'SUNCREST HELM', wantedCollected: false,
            rareVisible: phase >= 1, rareItem: phase >= 1 ? 'MOONGLASS CIRCLET' : null,
            rareClass: rejected ? 'SORCERER' : null, rejected, equipped: false,
            dragging, item: { x: itemX, y: itemY }, finished,
          };
        },
      };
    },
  });
})();
