/* Isolated, scene-owned vignettes. Shared controls, saves and audio stay in game.js. */
"use strict";
const TinyV5 = (() => {
  const entries = [];
  let voiceBytes, voiceBuffer;
  function prepareVoice() {
    if (!voiceBytes) voiceBytes = fetch('assets/battery-low.wav')
      .then(response => { if (!response.ok) throw new Error('Voice unavailable'); return response.arrayBuffer(); })
      .catch(() => null);
    return voiceBytes;
  }
  function register(def) {
    if (entries.some((item) => item.id === def.id)) throw new Error(`Duplicate vignette: ${def.id}`);
    entries.push(def);
    NEW_TASKS.push({
      id: def.id, title: def.title, translation: def.description,
      steps: [{ cue: def.hint }], verdict: def.verdict, custom: def,
      fixtures: [], pieces: [],
    });
  }
  function apiFor(w) {
    return {
      ctx,
      done() { if (workshop === w && !finished) { win(); say(w.def.verdict); } },
      say(message) { if (workshop === w) say(message); },
      prepareVoice,
      async voice(pan = 1) {
        // Local, generated robot announcement. Like every instrument it passes
        // through the existing mute bus, never the browser's speech service.
        const bytes = await prepareVoice();
        if (!bytes || !audio || muted || document.hidden || !active || transition || workshop !== w) return false;
        try {
          if (!voiceBuffer) voiceBuffer = await audio.decodeAudioData(bytes.slice(0));
          if (muted || document.hidden || !active || transition || workshop !== w) return false;
          const source = audio.createBufferSource(), level = audio.createGain(), panner = audio.createStereoPanner();
          source.buffer = voiceBuffer; level.gain.value = .4;
          panner.pan.value = Math.max(-1, Math.min(1, pan));
          source.connect(level).connect(panner).connect(gain);
          w.voiceSources.add(source);
          source.onended = () => { w.voiceSources.delete(source); source.disconnect(); level.disconnect(); panner.disconnect(); };
          source.start();
          return true;
        } catch { return false; }
      },
      tone(freq = 660, duration = .12, volume = .025, pan = 0) {
        if (!audio || muted || document.hidden || !active || workshop !== w) return;
        const osc = audio.createOscillator(), envelope = audio.createGain(), panner = audio.createStereoPanner();
        osc.type = 'triangle'; osc.frequency.value = freq;
        panner.pan.value = Math.max(-1, Math.min(1, pan));
        envelope.gain.setValueAtTime(Math.min(.15, Math.max(0, volume)), audio.currentTime);
        envelope.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + Math.max(.02, duration));
        osc.connect(envelope).connect(panner).connect(gain);
        osc.start(); osc.stop(audio.currentTime + Math.max(.02, duration) + .02);
        osc.onended = () => { osc.disconnect(); envelope.disconnect(); panner.disconnect(); };
      },
      rect: box, round: rounded, ellipse, line, poly,
      text(value, x, y, size = 11, color = '#edf2ec', align = 'center') {
        ctx.save(); ctx.font = `${size}px monospace`; ctx.textAlign = align;
        ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(String(value), x, y); ctx.restore();
      },
      bg(room = 'desk') {
        box(0, 0, 480, 270, shade(0, 0, 480, 240, '#344556', '#172332'));
        if (room === 'kitchen' || room === 'bath') {
          for (let y = 20; y < 222; y += 40) for (let x = 15; x < 480; x += 60)
            rounded(x, y, 57, 37, 2, '#2a3d4b', '#3b5360');
        } else if (room === 'bedroom') box(0, 150, 480, 72, '#3e3d50');
        box(0, 225, 480, 45, '#18222e'); line(0, 225, 480, 225, '#566574', 1);
      },
      clamp: (n, a, b) => Math.max(a, Math.min(b, n)),
      hit: (p, x, y, width, height) => Math.abs(p.x - x) <= width / 2 && Math.abs(p.y - y) <= height / 2,
      near: (p, x, y, radius) => Math.hypot(p.x - x, p.y - y) <= radius,
    };
  }
  const original = { openWorkshop, taskDown, taskMove, taskUp, taskCancel, updateWorkshop, drawWorkshop };
  openWorkshop = function (def) {
    workshop?.instance?.dispose?.();
    for (const source of workshop?.voiceSources || []) { try { source.stop(); } catch {} }
    if (!def?.custom) return original.openWorkshop(def);
    const w = { def, props: [], fixtures: [], step: 0, time: 0, gesture: null, instance: null, voiceSources: new Set() };
    workshop = w;
    w.instance = def.custom.create(apiFor(w));
  };
  taskDown = function (event) {
    const w = workshop;
    if (!w?.instance) return original.taskDown(event);
    if (finished || transition || !active || w.pointer !== undefined) return;
    startAudio();
    w.pointer = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    w.instance.down?.(point(event)); event.preventDefault();
  };
  taskMove = function (event) {
    const w = workshop;
    if (!w?.instance) return original.taskMove(event);
    // Hover is meaningful in the fictional cookie banner. Touch gets the same
    // effect on down, so no hover-only requirement is imposed.
    if (finished || transition || !active || (w.pointer !== undefined && event.pointerId !== w.pointer)) return;
    w.instance.move?.(point(event));
  };
  taskUp = function (event) {
    const w = workshop;
    if (!w?.instance) return original.taskUp(event);
    if (event.pointerId !== w.pointer) return;
    delete w.pointer;
    w.instance.up?.(point(event));
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  taskCancel = function () {
    if (!workshop?.instance) return original.taskCancel();
    delete workshop.pointer; workshop.instance.cancel?.();
  };
  updateWorkshop = function (dt) {
    if (!workshop?.instance) return original.updateWorkshop(dt);
    workshop.time += dt; workshop.instance.update?.(dt);
  };
  drawWorkshop = function () {
    if (!workshop?.instance) return original.drawWorkshop();
    ctx.save(); workshop.instance.draw(); ctx.restore();
  };
  return Object.freeze({ register, entries });
})();
