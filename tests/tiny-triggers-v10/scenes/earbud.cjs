'use strict';
module.exports = async function (page, io, assert) {
  assert.equal((await io.state()).phase, 'fitting');
  await io.click(76, 215);
  assert.equal((await io.state()).leftPlaying, false);
  await io.drag([219, 222], [299, 108]); // A left bud does not fit the right ear.
  assert.equal((await io.state()).inserted.left, false);
  await io.drag([219, 222], [184, 108]);
  await io.click(76, 215);
  assert.equal((await io.state()).phase, 'fitting', 'Both earbuds are needed before Play');
  await io.drag([265, 222], [299, 108]);
  assert.equal((await io.state()).phase, 'ready');
  await io.until((s) => s.voicePrepared && s.voiceBytes > 1000);
  await page.waitForFunction(() => audio && audio.state === 'running' && gain);
  assert.equal(await page.evaluate(() => muted), false);
  // A silent monitoring branch observes the real stereo master output. It does
  // not replace oscillators, call scene APIs, or change any gameplay state.
  await page.evaluate(() => {
    const splitter = audio.createChannelSplitter(2);
    const analyzers = [audio.createAnalyser(), audio.createAnalyser()];
    const sink = audio.createGain(); sink.gain.value = 0;
    gain.connect(splitter);
    analyzers.forEach((analyzer, channel) => {
      analyzer.fftSize = 2048; analyzer.smoothingTimeConstant = 0;
      splitter.connect(analyzer, channel); analyzer.connect(sink);
    });
    sink.connect(audio.destination);
    window.__earbudProbe = { splitter, analyzers, sink };
  });
  const sample = async (duration = 800) => page.evaluate(async (duration) => {
    const peak = [0, 0], rms = [0, 0], buffers = [new Float32Array(2048), new Float32Array(2048)];
    const deadline = performance.now() + duration;
    let samples = 0;
    while (performance.now() < deadline) {
      window.__earbudProbe.analyzers.forEach((analyzer, channel) => {
        analyzer.getFloatTimeDomainData(buffers[channel]);
        let energy = 0;
        for (const value of buffers[channel]) { peak[channel] = Math.max(peak[channel], Math.abs(value)); energy += value * value; }
        rms[channel] += Math.sqrt(energy / buffers[channel].length);
      });
      samples++; await new Promise((resolve) => setTimeout(resolve, 25));
    }
    return { peak, rms: rms.map((value) => value / samples) };
  }, duration);
  const metrics = {};
  try {
    await io.click(76, 215);
    assert.equal((await io.state()).phase, 'playing');
    metrics.stereo = await sample(900);
    assert(metrics.stereo.peak[0] > 0.002 && metrics.stereo.peak[1] > 0.002, 'The actual master must contain melody in both stereo channels');
    await io.shot('both-ears-playing');
    await io.until((s) => s.phase === 'warning' && s.voiceResolved && s.warningTime > 0.45);
    const warning = await io.state();
    assert.equal(warning.announcement, 'Battery low');
    assert.equal(warning.voiceSuccess, true, 'The local spoken announcement must successfully start while unmuted');
    assert(warning.voicePrepared && warning.voiceBytes > 1000);
    assert.equal(warning.rightPlaying, false);
    assert.equal(await page.evaluate(() => finished), false);
    metrics.voice = await sample(300);
    assert(metrics.voice.peak[1] > 0.002, 'The right-only Battery low recording must reach the master after the right melody stops');
    await io.shot('right-battery-warning');
    await io.until((s) => s.phase === 'done');
    const done = await io.state();
    assert(done.warningTime >= 1.55 && done.voiceTime >= 1.4);
    assert(done.leftPlaying && done.rightOff && !done.rightPlaying);
    assert.equal(await page.evaluate(() => finished), true);
    await io.wait(350);
    metrics.leftOnly = await sample(900);
    assert(metrics.leftOnly.peak[0] > 0.002, 'The left melody must continue audibly after done');
    assert(metrics.leftOnly.peak[1] < metrics.leftOnly.peak[0] * 0.015 + 0.00001, 'The right output must really shut off, not merely change its indicator');
    assert((await io.state()).leftNotes > done.leftNotes + 2);
    await io.shot('left-only');
    await page.locator('#sound').click();
    assert.equal(await page.evaluate(() => muted), true);
    await io.wait(650);
    metrics.muted = await sample(600);
    assert(metrics.muted.peak.every((peak) => peak < 0.0001), 'Master mute must silence both actual output channels');
    // Explicit Retry verifies fresh insertion state and the sound-off version
    // of the warning, using exactly the same user gestures.
    await page.locator('#reset').click();
    const reset = await io.state();
    assert.equal(reset.phase, 'fitting');
    assert.deepEqual(reset.inserted, { left: false, right: false });
    assert.equal(reset.leftNotes, 0);
    assert.equal(await page.evaluate(() => finished), false);
    await io.drag([219, 222], [184, 108]);
    await io.drag([265, 222], [299, 108]);
    await io.click(76, 215);
    await io.until((s) => s.phase === 'warning' && s.voiceResolved);
    const silentWarning = await io.state();
    assert.equal(silentWarning.voiceSuccess, false);
    assert.equal(silentWarning.announcement, 'Battery low');
    await io.shot('muted-visible-warning');
    await io.until((s) => s.phase === 'done');
    metrics.mutedReplay = await sample(350);
    assert(metrics.mutedReplay.peak.every((peak) => peak < 0.0001));
    await page.locator('#sound').click();
    metrics.resumedLeft = await sample(700);
    assert(metrics.resumedLeft.peak[0] > 0.002 && metrics.resumedLeft.peak[1] < 0.0001, 'Unmuting restores only the surviving left ear');
    console.log(JSON.stringify({ earbudAudio: metrics }));
  } finally {
    await page.evaluate(() => {
      const probe = window.__earbudProbe;
      if (!probe) return;
      gain.disconnect(probe.splitter); probe.splitter.disconnect();
      probe.analyzers.forEach((analyzer) => analyzer.disconnect()); probe.sink.disconnect();
      delete window.__earbudProbe;
    });
  }
};
