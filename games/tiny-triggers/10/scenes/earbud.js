(function () {
  'use strict';
  TinyV5.register({
    id: 'earbud', title: 'One Earbud Gives Up', chapter: 'digital', exclusiveAudio: true,
    description: 'Put both earbuds in, then press Play.',
    hint: 'Drag L from the charging case into the left ear and R into the right ear. Press the phone’s mint Play button.',
    verdict: 'Your stereo subscription has been downgraded to left.',
    create(api) {
      const { ctx } = api;
      const ears = { left: { x: 184, y: 108 }, right: { x: 299, y: 108 } };
      const slots = { left: { x: 219, y: 222 }, right: { x: 265, y: 222 } };
      const inserted = { left: false, right: false };
      let phase = 'fitting', dragging = null, pointer = null, playPressed = false, disposed = false;
      let clock = 0, elapsed = 0, rhythm = 0, note = 0, warningTime = 0, voiceTime = 0;
      let voicePrepared = false, voiceBytes = 0, voiceResolved = false, voiceSuccess = null, leftNotes = 0, rightNotes = 0;
      const melody = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
      Promise.resolve(api.prepareVoice()).then((bytes) => {
        if (disposed) return;
        voicePrepared = !!bytes; voiceBytes = bytes?.byteLength || 0;
      }).catch(() => { if (!disposed) voicePrepared = false; });
      function announce() {
        phase = 'warning'; warningTime = 0; voiceTime = 0;
        api.say('Right earbud: “Battery low.”');
        Promise.resolve(api.voice(1)).then((success) => {
          if (disposed) return;
          voiceResolved = true; voiceSuccess = !!success; voiceTime = 0;
        }).catch(() => { if (!disposed) { voiceResolved = true; voiceSuccess = false; } });
      }
      function bud(x, y, side, fitted) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(fitted ? (side === 'left' ? -0.16 : 0.16) : 0);
        api.ellipse(1, 3, 12, 12, '#13273466');
        api.round(-3, -1, 10, 30, 5, '#c8d4d2', '#f4f4df');
        api.ellipse(0, -5, 13, 12, '#f4f5e6');
        api.ellipse(side === 'left' ? -7 : 7, -6, 4, 6, '#445d68');
        api.ellipse(side === 'left' ? -7 : 7, -7, 1.3, 2.7, '#233b47');
        api.line(0, 18, 4, 18, '#a1b8bc', 1);
        api.ellipse(2, 24, 1.3, 1.3, fitted && !(side === 'right' && phase === 'done') ? '#87cbae' : '#829a9f');
        ctx.restore();
      }
      function battery(x, y, side) {
        const on = inserted[side], dead = side === 'right' && phase === 'done';
        const low = side === 'right' && phase === 'warning';
        const color = !on ? '#607482' : dead ? '#70818c' : low ? '#e4a16b' : '#a7dfbc';
        api.round(x - 14, y - 5, 27, 11, 2, '#1b2e39', color);
        api.rect(x + 13, y - 2, 3, 5, color);
        let level = side === 'left' ? 20 : phase === 'playing' ? Math.max(2, 8 - elapsed * 1.3) : 7;
        if (dead) level = 0; if (low) level = 2;
        if (on && level) api.rect(x - 11, y - 2, level, 5, color);
        api.text(side === 'left' ? 'L' : 'R', x, y - 15, 8, '#becbd0');
      }
      function waveform(x, y, side) {
        const audible = side === 'left' ? ['playing', 'warning', 'done'].includes(phase) : phase === 'playing';
        const warning = side === 'right' && phase === 'warning';
        const color = warning ? '#e7ad79' : audible ? '#8ad6bd' : '#59717e';
        for (let i = 0; i < 6; i++) {
          const height = audible || warning ? 3 + Math.abs(Math.sin(clock * (warning ? 12 : 9) + i * 1.6)) * 16 : 1.5;
          api.round(x - 17 + i * 6, y - height / 2, 3, height, 1, color);
        }
      }
      function phone() {
        api.round(26, 130, 108, 118, 10, '#0b1d28');
        api.round(22, 125, 108, 118, 10, '#526c79', '#91a5a9');
        api.round(28, 132, 96, 104, 6, '#172d3b');
        api.round(56, 129, 40, 3, 1, '#0e222e');
        api.text('A LITTLE MUSIC', 76, 146, 7.2, '#b9d4d1');
        api.round(39, 155, 28, 28, 4, '#668e97');
        api.ellipse(53, 169, 10, 10, '#274957'); api.ellipse(53, 169, 3, 3, '#b4d7cb');
        api.line(78, 160, 112, 160, '#8bb7b7', 2);
        api.line(78, 168, 103, 168, '#527b88', 2);
        api.line(39, 192, 113, 192, '#557783', 2);
        api.line(39, 192, 39 + (['playing', 'warning', 'done'].includes(phase) ? (clock * 6) % 72 : 0), 192, '#9ed7bb', 2);
        const ready = inserted.left && inserted.right;
        api.ellipse(76, 215, 17, 17, ready ? playPressed ? '#76b49b' : '#a2dfbd' : '#47656f');
        if (['playing', 'warning', 'done'].includes(phase)) {
          api.rect(70, 208, 4, 14, '#285346'); api.rect(79, 208, 4, 14, '#285346');
        } else api.poly([[72, 207], [72, 223], [84, 215]], ready ? '#2a5549' : '#8ba6ac');
      }
      return {
        draw() {
          api.bg('desk');
          // A pair of ears, a charging case, and a tangible music player.
          api.round(185, 181, 113, 65, 20, '#55778a');
          api.round(227, 155, 29, 39, 10, '#bd8e73');
          api.ellipse(183, 111, 16, 24, '#c99a7a');
          api.ellipse(300, 111, 16, 24, '#c99a7a');
          api.ellipse(184, 109, 7, 13, '#ae7d65'); api.ellipse(299, 109, 7, 13, '#ae7d65');
          api.ellipse(242, 103, 57, 70, '#d7aa83');
          api.ellipse(242, 51, 54, 27, '#574441');
          api.poly([[189, 57], [199, 39], [225, 40], [197, 80], [190, 88]], '#574441');
          api.poly([[262, 34], [292, 47], [297, 85], [281, 66]], '#574441');
          if (phase === 'done') {
            api.line(214, 102, 225, 103, '#4b3933', 2); api.ellipse(262, 104, 2, 3, '#4b3933');
            api.line(256, 93, 268, 88, '#715045', 2);
          } else {
            api.ellipse(220, 104, 2, 3, '#4b3933'); api.ellipse(263, 104, 2, 3, '#4b3933');
          }
          api.line(241, 109, 237, 125, '#b47f65', 1.3);
          ctx.beginPath(); ctx.moveTo(229, 141); ctx.quadraticCurveTo(242, phase === 'done' ? 136 : 149, 254, 141); ctx.strokeStyle = '#9d6b58'; ctx.lineWidth = 1.5; ctx.stroke();
          battery(148, 69, 'left'); battery(335, 69, 'right');
          waveform(147, 105, 'left'); waveform(337, 105, 'right');
          phone();
          // Open lid and molded sockets make the loose objects real earbuds.
          api.round(193, 185, 99, 30, 11, '#a6bbb9', '#e2e8d8');
          api.round(198, 190, 89, 19, 7, '#506d77');
          api.round(191, 207, 103, 48, 13, '#cbd7cb', '#edf0dc');
          api.ellipse(218, 224, 17, 13, '#8ba3a5'); api.ellipse(265, 224, 17, 13, '#8ba3a5');
          api.text('L', 218, 245, 7, '#5a777e'); api.text('R', 265, 245, 7, '#5a777e');
          for (const side of ['left', 'right']) {
            if (dragging === side) continue;
            const p = inserted[side] ? ears[side] : slots[side]; bud(p.x, p.y, side, inserted[side]);
          }
          if (dragging && pointer) bud(pointer.x, pointer.y, dragging, false);
          if (phase === 'warning' || phase === 'done') {
            const warning = phase === 'warning';
            api.round(357, 122, 111, 50, 7, warning ? '#69543e' : '#263c48', warning ? '#d5a66e' : '#607a86');
            api.poly([[357, 136], [347, 130], [357, 146]], warning ? '#69543e' : '#263c48');
            api.text(warning ? 'Battery low' : 'Disconnected', 412, 140, 9.2, warning ? '#ffe2aa' : '#8fa5ad');
            api.text(warning ? 'RIGHT EARBUD' : 'RIGHT: OFF', 412, 157, 7, warning ? '#d9b992' : '#6f8793');
          }
          api.text(phase === 'fitting' ? 'PUT BOTH EARBUDS IN.' : phase === 'ready' ? 'PRESS PLAY.' : phase === 'done' ? 'LEFT SIDE STILL GOING.' : phase === 'warning' ? 'ONE IMPORTANT ANNOUNCEMENT.' : 'STEREO. FOR NOW.', 240, 17, 9, '#d2ded5');
        },
        down(p) {
          if (phase === 'fitting' || phase === 'ready') {
            for (const side of ['left', 'right']) {
              if (!inserted[side] && api.near(p, slots[side].x, slots[side].y, 23)) { dragging = side; pointer = p; return; }
            }
            if (phase === 'ready' && api.near(p, 76, 215, 25)) playPressed = true;
          }
        },
        move(p) { if (dragging) pointer = p; if (playPressed && !api.near(p, 76, 215, 26)) playPressed = false; },
        up(p) {
          if (dragging) {
            const ear = ears[dragging];
            if (api.near(p, ear.x, ear.y, 29)) {
              inserted[dragging] = true; api.tone(500, 0.045, 0.012, dragging === 'left' ? -1 : 1);
              if (inserted.left && inserted.right) { phase = 'ready'; api.say('Both earbuds are in. Press Play.'); }
            }
            dragging = null; pointer = null;
          }
          if (playPressed && phase === 'ready' && api.near(p, 76, 215, 25)) {
            phase = 'playing'; elapsed = 0; rhythm = 0.32; api.say('A lovely little stereo melody.');
          }
          playPressed = false;
        },
        cancel() { dragging = null; pointer = null; playPressed = false; },
        update(dt) {
          if (disposed) return;
          clock += dt;
          if (phase === 'playing') { elapsed += dt; if (elapsed >= 4.2) announce(); }
          if (phase === 'warning') {
            warningTime += dt;
            if (voiceResolved) voiceTime += dt;
            if (warningTime >= 1.55 && voiceResolved && (!voiceSuccess || voiceTime >= 1.4)) {
              phase = 'done'; api.say('The right earbud shuts off. The song carries on in the left.'); api.done();
            }
          }
          if (phase === 'playing' || phase === 'warning' || phase === 'done') {
            rhythm += dt;
            while (rhythm >= 0.32) {
              rhythm -= 0.32;
              const frequency = melody[note % melody.length];
              api.tone(frequency, 0.27, 0.055, -1); leftNotes++;
              if (phase === 'playing') { api.tone(frequency * 1.5, 0.27, 0.048, 1); rightNotes++; }
              note++;
            }
          }
        },
        dispose() { disposed = true; },
        debug() {
          return { phase, dragging, pointer: pointer ? { ...pointer } : null, inserted: { ...inserted }, elapsed, warningTime, voiceTime, voicePrepared, voiceBytes, voiceResolved, voiceSuccess, announcement: phase === 'warning' ? 'Battery low' : '', leftPlaying: ['playing', 'warning', 'done'].includes(phase), rightPlaying: phase === 'playing', rightOff: phase === 'done', leftNotes, rightNotes, exclusiveAudio: true };
        },
      };
    },
  });
})();
