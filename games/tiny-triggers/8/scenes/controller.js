(() => {
  'use strict';
  TinyV5.register({
    id: 'controller',
    title: 'The Controller Disconnects',
    chapter: 'games',
    description: 'Finish the boss. It only needs one more hit.',
    hint: 'Tap or hold the gold sword button on the controller. When the boss has one hit left, release and press it once more.',
    verdict: 'The boss did not get the disconnect notice.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const attackX = 339, attackY = 218, maxHealth = 6;
      let phase = 0, worldTime = 0, heroClock = 0, bossHealth = maxHealth;
      let connected = true, holding = false, holdTime = 0, attackedThisHold = false;
      let successfulAttacks = 0, failedAttacks = 0, cooldown = 0, attackAge = 10, hitFlash = 0;
      let disconnectedAt = 0, unplugProgress = 0, warningVisible = false, finished = false, canceledPresses = 0;
      const inside = p => p && Math.hypot(p.x - attackX, p.y - attackY) < 22;

      function heroPose() {
        const swing = attackAge < .36 ? Math.sin(attackAge / .36 * Math.PI) : 0;
        return { x: 145 + swing * 88, y: 119 + Math.sin(heroClock * 5) * .65, sword: .6 + swing * 1.35, swing };
      }

      function bossPose() {
        const cycle = connected ? 0 : (worldTime - disconnectedAt) % 2.8;
        const windup = connected ? 0 : cycle < 1.6 ? cycle / 1.6 : cycle < 1.9 ? 1 - (cycle - 1.6) / .3 : 0;
        return { x: 331 + Math.sin(worldTime * 2.4) * 2, y: 115 + Math.sin(worldTime * 3) * 2, windup, cycle };
      }

      function attack() {
        if (!connected) return;
        if (phase === 1) {
          attackedThisHold = true;
          connected = false; phase = 2; failedAttacks++;
          disconnectedAt = worldTime; holding = false;
          api.say('The finishing input did nothing. The game is still running.');
          api.tone(125, .2, .035);
          return;
        }
        if (phase !== 0 || cooldown > 0) return;
        attackedThisHold = true;
        successfulAttacks++; bossHealth--; attackAge = 0; hitFlash = .24; cooldown = .55;
        api.tone(320 + successfulAttacks * 45, .07, .026);
        if (bossHealth === 1) {
          phase = 1; holding = false;
          api.say('One hit left. Release, then press the gold attack button for the finisher.');
        }
      }

      function hero() {
        const p = heroPose();
        ellipse(p.x, 141, 15, 3, '#080f2280');
        ctx.save(); ctx.translate(p.x, p.y);
        poly([[-8, -14], [-17, 13], [-4, 8], [5, 10], [8, -12]], '#ba6a75');
        rect(-8, 7, 6, 15, '#688fa8'); rect(3, 7, 6, 15, '#85aabd');
        rect(-10, 19, 8, 4, '#d8dfce'); rect(3, 19, 10, 4, '#d8dfce');
        round(-10, -14, 20, 24, 4, '#6e9da8');
        poly([[-8, -12], [0, -6], [8, -12], [7, 5], [-7, 5]], '#a8c9c4');
        rect(-9, 3, 18, 4, '#4c6e85');
        round(-11, -32, 22, 21, 5, '#608eaa');
        round(-8, -26, 17, 11, 3, '#d7d7bc');
        rect(1, -23, 4, 3, '#354f65');
        poly([[-11, -28], [-4, -37], [10, -32], [12, -25]], '#85b1bf');
        line(-7, -14, -13, 0, '#91b7ba', 5);
        ctx.save(); ctx.translate(11, -5); ctx.rotate(p.sword);
        line(0, 0, 0, 9, '#936b51', 4); line(-7, -2, 7, -2, '#dac78a', 3);
        poly([[-2, -4], [-2, -31], [0, -37], [3, -31], [3, -4]], '#e6f0d6');
        ctx.restore(); ctx.restore();
      }

      function boss() {
        const p = bossPose();
        const shake = hitFlash > 0 ? Math.sin(worldTime * 70) * 2 : 0;
        ellipse(p.x, 141, 30, 5, '#070e2280');
        ctx.save(); ctx.translate(p.x + shake, p.y);
        round(-19, 8, 13, 18, 3, '#685a88'); round(6, 8, 13, 18, 3, '#786794');
        poly([[-25, -18], [-15, -24], [17, -24], [27, -15], [22, 12], [0, 18], [-22, 11]], hitFlash > .13 ? '#d7c1ce' : '#9b7b9d');
        poly([[-22, -14], [-8, -18], [-8, 10], [-19, 7]], '#6b5a8a');
        poly([[4, -18], [23, -14], [19, 8], [4, 13]], '#83678f');
        poly([[0, -14], [8, -5], [0, 6], [-8, -5]], '#e8b385');
        round(-17, -38, 34, 23, 5, '#b090a7');
        poly([[-17, -35], [-25, -47], [-22, -28], [-14, -24]], '#817598');
        poly([[17, -35], [25, -47], [22, -28], [14, -24]], '#817598');
        rect(-12, -30, 24, 6, '#493b67');
        rect(-10, -28, 7, 2, '#f2be86'); rect(4, -28, 7, 2, '#f2be86');
        round(-33, -15, 13, 26, 4, '#80668e');
        ctx.save(); ctx.translate(24, -12); ctx.rotate(-p.windup * 1.65 + Math.sin(worldTime * 2) * .08);
        round(0, -6, 12, 24, 4, '#80668e');
        round(-3, 12, 20, 19, 4, '#b78ba3');
        line(0, 18, 12, 18, '#e1b4c0', 1.4);
        if (!connected) {
          ctx.globalAlpha = .25 + p.windup * .6;
          ellipse(7, 23, 14 + p.windup * 8, 13 + p.windup * 7, '#edb38e40');
          ctx.globalAlpha = 1;
        }
        ctx.restore(); ctx.restore();
        if (hitFlash > 0) {
          line(p.x - 30, p.y - 31, p.x + 22, p.y + 10, '#fff0b9', 3);
          line(p.x + 11, p.y - 32, p.x - 18, p.y + 13, '#f7bf98', 1.5);
        }
        if (!connected && p.cycle > 1.6 && p.cycle < 2.65) {
          const x = 346 - (p.cycle - 1.6) * 210;
          ellipse(x + 12, 126, 17, 5, '#eaa77b45');
          ellipse(x, 126, 8, 6, '#e9b285'); ellipse(x - 1, 125, 4, 3, '#fff0b8');
        }
      }

      function screen() {
        round(36, 15, 408, 163, 10, '#0a152381');
        round(36, 10, 408, 163, 10, '#49616e', '#6c8490');
        round(43, 17, 394, 149, 6, '#0a1c30');
        ctx.save(); ctx.beginPath(); ctx.roundRect(48, 23, 384, 137, 3); ctx.clip();
        const sky = ctx.createLinearGradient(0, 23, 0, 160); sky.addColorStop(0, '#203750'); sky.addColorStop(1, '#42465d');
        rect(48, 23, 384, 137, sky);
        ellipse(217, 62, 18, 18, '#c2bdaa'); ellipse(226, 58, 16, 16, '#273d53');
        for (let n = 0; n < 22; n++) {
          const x = 55 + n * 43.3 % 369, y = 48 + n * 13.7 % 65;
          ellipse(x, y, .7, .7, '#c2d2ce80');
        }
        for (let n = 0; n < 9; n++) {
          const x = 55 + n * 48, h = 22 + n * 17 % 47;
          rect(x, 136 - h, 31, h, '#26374d'); rect(x + 6, 128 - h, 18, 8, '#26374d');
          for (let j = 0; j < 3; j++) rect(x + 7 + j % 2 * 11, 144 - h + j * 10, 3, 4, '#6d84955e');
        }
        rect(48, 139, 384, 21, '#4e5d6d'); rect(48, 139, 384, 4, '#83958e');
        for (let n = 0; n < 14; n++) { line(51 + n * 29, 144, 51 + n * 29, 160, '#2d435a', 1); line(51 + n * 29, 152, 79 + n * 29, 152, '#2d435a', 1); }
        // Ambient motes are world-time driven, independent of the frozen hero.
        for (let n = 0; n < 8; n++) {
          const x = 58 + (n * 47 + worldTime * (6 + n % 3)) % 365;
          const y = 133 - (n * 19 + worldTime * 12) % 72;
          ellipse(x, y, 1.1, 1.1, '#c5d9c195');
        }
        hero(); boss();
        text('YOU', 72, 34, 8, '#bed9d4');
        for (let n = 0; n < 3; n++) poly([[94 + n * 12, 31], [98 + n * 12, 27], [102 + n * 12, 31], [98 + n * 12, 36]], '#9bbd9a');
        text('LAST GUARDIAN', 328, 31, 8, '#dfc4ba');
        round(250, 38, 156, 11, 3, '#182b40', '#879398');
        for (let n = 0; n < maxHealth; n++) if (n < bossHealth) rect(253 + n * 25, 41, 22, 5, bossHealth === 1 ? '#f3bd7b' : '#c894a2');
        if (bossHealth === 1) text('ONE HIT LEFT', 328, 56, 8, '#f1ce97');
        if (warningVisible) {
          round(89, 63, 302, 26, 6, '#111c2bd9', '#bb7c86');
          line(102, 70, 112, 80, '#e5a0a0', 2); line(112, 70, 102, 80, '#e5a0a0', 2);
          text('Controller disconnected', 249, 76, 12, '#f0d7cf');
        }
        ctx.restore();
        ellipse(240, 169, 2, 1, '#80a699');
      }

      function cord() {
        const px = 240 + unplugProgress * 28, py = 181 - unplugProgress * 13;
        ctx.beginPath(); ctx.moveTo(440, 147);
        ctx.bezierCurveTo(471, 199, 344, 193, px, py - 3);
        ctx.strokeStyle = '#0f1d2b'; ctx.lineWidth = 7; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(440, 146);
        ctx.bezierCurveTo(469, 197, 344, 191, px, py - 4);
        ctx.strokeStyle = '#617583'; ctx.lineWidth = 3; ctx.stroke();
        ctx.save(); ctx.translate(px, py); ctx.rotate(unplugProgress * .25);
        round(-7, -8, 14, 11, 3, '#273f50');
        rect(-5, 1, 10, 7, '#b0bbb8'); line(-3, 3, 3, 3, '#506678', 1);
        ctx.restore();
        if (!connected) {
          line(243, 180, 249, 172, '#f1b781', 1.5);
          line(250, 184, 260, 182, '#f1b781', 1.5);
        }
      }

      function controller() {
        ellipse(240, 258, 146, 10, '#06142160');
        ctx.beginPath(); ctx.moveTo(148, 185);
        ctx.bezierCurveTo(126, 178, 112, 188, 106, 208);
        ctx.lineTo(91, 247); ctx.bezierCurveTo(84, 269, 109, 274, 124, 256);
        ctx.lineTo(143, 237); ctx.bezierCurveTo(172, 242, 203, 225, 240, 229);
        ctx.bezierCurveTo(277, 225, 308, 242, 337, 237); ctx.lineTo(356, 256);
        ctx.bezierCurveTo(371, 274, 396, 269, 389, 247); ctx.lineTo(374, 208);
        ctx.bezierCurveTo(368, 188, 354, 178, 332, 185);
        ctx.bezierCurveTo(303, 189, 273, 180, 240, 183);
        ctx.bezierCurveTo(207, 180, 177, 189, 148, 185); ctx.closePath();
        const shell = ctx.createLinearGradient(0, 182, 0, 269); shell.addColorStop(0, '#b0bfc1'); shell.addColorStop(1, '#738c9d');
        ctx.fillStyle = shell; ctx.fill(); ctx.strokeStyle = '#486577'; ctx.lineWidth = 2; ctx.stroke();
        curveGrip(117, 224, -1); curveGrip(363, 224, 1);
        round(231, 182, 18, 6, 2, '#253a4d');
        round(230, 194, 20, 4, 2, connected ? '#92d5b4' : '#405567');
        if (!connected) text('OFF', 240, 209, 8, '#4a5d6b');
        else {
          line(236, 207, 239, 210, '#536d7c', 1); line(239, 210, 245, 204, '#536d7c', 1);
        }
        round(148, 199, 13, 35, 3, '#314d62'); round(137, 210, 35, 13, 3, '#314d62');
        line(154, 201, 154, 208, '#6a8594', 1.2); line(140, 216, 147, 216, '#6a8594', 1.2);
        for (const x of [201, 279]) {
          ellipse(x, 236, 17, 15, '#486779'); ellipse(x, 233, 13, 12, '#29475d');
          ctx.beginPath(); ctx.ellipse(x, 232, 9, 8, 0, 0, Math.PI * 2); ctx.strokeStyle = '#607c8c'; ctx.lineWidth = 1; ctx.stroke();
        }
        round(211, 208, 10, 4, 2, '#587383'); round(259, 208, 10, 4, 2, '#587383');
        for (const [x, y, c] of [[322, 200, '#8e85a4'], [305, 218, '#7197aa'], [322, 236, '#ad7c85']]) {
          ellipse(x, y + 2, 8, 8, '#4a6275'); ellipse(x, y, 8, 8, c);
        }
        ellipse(attackX, attackY + 3, 12, 12, '#6d624f');
        ellipse(attackX, attackY + (holding ? 2 : 0), 12, 12, connected ? '#d6b77b' : '#bba77e');
        ctx.save(); ctx.translate(attackX, attackY + (holding ? 2 : 0)); ctx.rotate(.65);
        poly([[-1.5, 1], [-1.5, -7], [0, -10], [1.5, -7], [1.5, 1]], '#fff0ca');
        line(-4, 2, 4, 2, '#fff0ca', 1.5); line(0, 3, 0, 7, '#fff0ca', 2); ctx.restore();
        if (connected && !holding) {
          ctx.beginPath(); ctx.arc(attackX, attackY, 17 + Math.sin(worldTime * 3) * .7, 0, Math.PI * 2);
          ctx.strokeStyle = '#f5d5948c'; ctx.lineWidth = 1; ctx.stroke();
        }
      }

      function curveGrip(x, y, direction) {
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + direction * 5, y + 7, x + direction * 9, y + 17, x + direction * 9, y + 27);
        ctx.strokeStyle = '#627e90'; ctx.lineWidth = 2; ctx.stroke();
        for (let n = 0; n < 4; n++) line(x + direction * 5, y + 9 + n * 5, x + direction * 10, y + 7 + n * 5, '#92a7b0', 1);
      }

      return {
        down(p) {
          if (connected && (phase === 0 || phase === 1) && inside(p)) {
            holding = true; holdTime = 0; attackedThisHold = false;
          }
        },
        move(p) {
          if (holding && !inside(p)) { holding = false; canceledPresses++; }
        },
        up(p) {
          if (holding && inside(p) && !attackedThisHold) attack();
          holding = false;
        },
        cancel() { if (holding) canceledPresses++; holding = false; },
        update(dt) {
          // The world never pauses, including after api.done(). Only the hero's
          // animation clock and attack state stop when input disconnects.
          worldTime += dt; cooldown = Math.max(0, cooldown - dt); hitFlash = Math.max(0, hitFlash - dt);
          if (connected) { heroClock += dt; attackAge += dt; }
          if (holding && connected && phase === 0) {
            holdTime += dt;
            if (holdTime >= .35 && cooldown <= 0) attack();
          }
          if (!connected) {
            const elapsed = worldTime - disconnectedAt;
            unplugProgress = Math.min(1, elapsed / .35);
            warningVisible = elapsed >= .22;
            if (phase === 2 && elapsed >= 1.05) { phase = 3; finished = true; api.done(); }
          }
        },
        draw() {
          rect(0, 0, 480, 270, '#233442');
          for (let n = 0; n < 5; n++) line(0, 45 + n * 48, 480, 38 + n * 48, '#41536135', 1);
          screen(); cord(); controller();
          text(connected ? phase === 1 ? 'ONE MORE.' : 'TAP / HOLD' : 'NO INPUT.', 58, 209, 8, connected ? '#e0c995' : '#d7a3a3');
          if (!connected) text('Still running…', 57, 225, 7, '#a9bac3');
        },
        debug() {
          return {
            phase, holding, connected, bossHealth, maxHealth, successfulAttacks, failedAttacks,
            worldTime, heroClock, heroPose: heroPose(), bossPose: bossPose(),
            controllerLedOn: connected, unplugProgress, warningVisible,
            warning: warningVisible ? 'Controller disconnected' : null,
            canceledPresses, finished,
          };
        },
      };
    },
  });
})();
