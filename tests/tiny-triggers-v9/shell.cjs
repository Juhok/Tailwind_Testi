// Chapter progression, collection controls, loading presentation, and audio.
// This intentionally does not solve or change any scene's gestures.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");

(async () => {
  const server = process.env.GAME_URL ? null : spawn("python3", ["-m", "http.server", "4215", "--bind", "127.0.0.1"], {
    cwd: path.resolve(__dirname, "../.."), stdio: "ignore",
  });
  let browser;
  try {
    const url = process.env.GAME_URL || "http://127.0.0.1:4215/games/tiny-triggers/9/";
    for (let tries = 0; tries < 40; tries++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    const page = await browser.newPage({ viewport: { width: 1080, height: 850 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => typeof chapterBook !== "undefined" && typeof completed !== "undefined");
    // Real UI clicks must unlock the AudioContext. Inspect generated PCM and
    // the existing master bus, without relying on a machine's loudspeakers.
    await page.locator("#sound").click();
    await page.waitForFunction(() => audio && audio.state === "running");
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "false");
    assert.equal(await page.evaluate(() => muted), true);
    await page.locator("#sound").click();
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "true");
    const audioCheck = await page.evaluate(async () => {
      const wasActive = active;
      active = false; // Keep this small measurement independent of music timing.
      const pcm = xyloBuffer(audio, 440).getChannelData(0);
      let pcmPeak = 0, energy = 0;
      for (const sample of pcm) {
        if (!Number.isFinite(sample)) throw new Error("Non-finite xylophone PCM");
        pcmPeak = Math.max(pcmPeak, Math.abs(sample)); energy += sample * sample;
      }
      const analyser = audio.createAnalyser(); analyser.fftSize = 2048;
      const silentSink = audio.createGain(); silentSink.gain.value = 0;
      // A silent monitoring branch keeps the graph pulled without doubling
      // the actual master output already connected to audio.destination.
      gain.connect(analyser); analyser.connect(silentSink).connect(audio.destination);
      window.__tinyAudioProbe = { analyser, silentSink, wasActive };
      xylophone(440, 0.22);
      const samples = new Float32Array(analyser.fftSize);
      let masterPeak = 0;
      for (let attempt = 0; attempt < 12; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        analyser.getFloatTimeDomainData(samples);
        for (const sample of samples) masterPeak = Math.max(masterPeak, Math.abs(sample));
      }
      return { context: audio.state, pcmPeak, pcmRms: Math.sqrt(energy / pcm.length), masterPeak };
    });
    assert(audioCheck.pcmPeak > 0.1 && audioCheck.pcmRms > 0.01, "Xylophone PCM must contain sound");
    assert(audioCheck.masterPeak > 0.0001, "A played note must reach the master output");
    await page.locator("#sound").click();
    const muteStart = await page.evaluate(() => ({
      wall: performance.now(), audio: audio.currentTime, state: audio.state, gain: gain.gain.value,
    }));
    // AudioParam automation follows AudioContext time, which can lag wall time
    // under concurrent browser load. Allow the same 0.65 s on that clock; do
    // not wait for the gain value itself or relax the assertions below.
    await page.waitForFunction((start) => audio.state === "running" && audio.currentTime - start >= 0.65,
      muteStart.audio, { polling: 25, timeout: 10000 });
    audioCheck.muteTiming = await page.evaluate((start) => ({
      startState: start.state, endState: audio.state, startGain: start.gain,
      wallElapsed: (performance.now() - start.wall) / 1000,
      audioElapsed: audio.currentTime - start.audio,
    }), muteStart);
    audioCheck.mutedPeak = await page.evaluate(() => {
      const { analyser } = window.__tinyAudioProbe;
      const samples = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(samples);
      return samples.reduce((peak, sample) => Math.max(peak, Math.abs(sample)), 0);
    });
    assert.equal(await page.evaluate(() => muted), true);
    assert.equal(await page.locator("#sound").textContent(), "Sound off");
    audioCheck.mutedGain = await page.evaluate(() => gain.gain.value);
    assert(audioCheck.mutedGain < 0.002, "Mute must lower the actual master gain, not only its label");
    assert(audioCheck.mutedPeak < audioCheck.masterPeak * 0.02 + 0.00001, "Muting must attenuate the master output");
    await page.evaluate(() => {
      const { analyser, silentSink, wasActive } = window.__tinyAudioProbe;
      gain.disconnect(analyser); analyser.disconnect(); silentSink.disconnect();
      active = wasActive; delete window.__tinyAudioProbe;
    });
    await page.locator("#sound").click();
    assert.equal(await page.evaluate(() => muted), false);
    const catalogue = await page.evaluate(() => ({
      count: SCENE_COUNT, order: [...chapterBook.order], chapters: chapterBook.chapters.map((c) => ({ id: c.id, size: c.indices.length })),
      next: chapterBook.next(2), first: index,
    }));
    assert.equal(catalogue.count, 199);
    if (process.env.REQUIRE_COMPLETE) assert.equal(await page.evaluate(() => TinyV6.entries.size), 83, "Every earlier scene must be upgraded");
    assert.equal(catalogue.chapters.length, 35);
    assert.equal(new Set(catalogue.order).size, 199);
    assert.deepEqual(catalogue.order.slice(0, 4), [0, 1, 2, 4]);
    assert.equal(catalogue.next, 4);
    assert.equal(catalogue.first, 0);
    assert(await page.locator("#album").isDisabled());
    await page.evaluate(() => { collection(); load(18); });
    assert.equal(await page.evaluate(() => index), 0);
    assert(!(await page.locator("#collection").evaluate((d) => d.open)));

    // Every chapter boundary has an unambiguous next step. A fabricated hole
    // cannot unlock a later scene when saved progress is restored.
    const normalization = await page.evaluate(() => {
      const done = new Set(); let valid = true;
      for (let rank = 0; rank < chapterBook.order.length; rank++) {
        const scene = chapterBook.order[rank];
        valid &&= chapterBook.isAvailable(scene, done);
        if (rank < chapterBook.order.length - 1) valid &&= !chapterBook.isAvailable(chapterBook.order[rank + 1], done);
        done.add(scene);
        valid &&= chapterBook.prefix(done) === rank + 1;
      }
      const hole = chapterBook.normalizeProgress([0, 1, 18, 82], 18);
      return { valid, hole: [...hole.completed], current: hole.index, unlocked: chapterBook.isUnlocked(done) };
    });
    assert(normalization.valid && normalization.unlocked);
    assert.deepEqual(normalization.hole, [0, 1]);
    assert.equal(normalization.current, 2);
    await page.evaluate(() => localStorage.setItem("tinyTriggers.v9", JSON.stringify({ done: [0, 1, 2, 4], index: 18 })));
    await page.reload();
    assert.equal(await page.evaluate(() => index), 18);
    assert.equal(await page.locator("#chapter").textContent(), "05 / 199");
    assert.match(await page.locator("#category").textContent(), /Breakfast/);
    assert(await page.locator("#album").isDisabled());

    // Next follows chapter order instead of numeric IDs: chocolate -> cereal.
    await page.evaluate(() => {
      completed = new Set([0, 1, 2]); load(2); finished = true;
      document.querySelector("#next").hidden = false;
    });
    await page.locator("#next").click();
    const firstTip = await page.locator("#loading-tip").textContent();
    assert(firstTip.split(/\s+/).length >= 85);
    assert.equal(firstTip, await page.evaluate(() => transition.tip));
    await page.waitForTimeout(300);
    assert.equal(await page.locator("#loading-tip").textContent(), firstTip, "Loading text must not be typed or progressively revealed");
    await page.waitForTimeout(1050);
    assert.equal(await page.locator("#load-number").textContent(), "99%");
    assert.equal(await page.locator("#load-progress").evaluate((p) => p.value), 99);
    assert.equal(await page.locator("#loading-tip").textContent(), firstTip);
    await page.waitForFunction(() => transition === null);
    assert.equal(await page.evaluate(() => index), 4);

    const interstitial = await page.evaluate(() => {
      const tips = Array.from({ length: 12 }, () => TinyLoading.tipFor(0));
      const yogurtTip = TinyLoading.tipFor(30);
      const cartonTip = TinyLoading.tipFor(25);
      const journeyTips = chapterBook.order.map((scene) => TinyLoading.tipFor(scene));
      const noConsecutiveRepeats = journeyTips.every((tip, i) => i === 0 || tip !== journeyTips[i - 1]);
      let inBounds = true;
      for (let t = 0; t < 300; t += 0.017) {
        const p = TinyLoading.logoPosition(t);
        inBounds &&= p.x >= 4 && p.y >= 4 && p.x + p.width <= 476 && p.y + p.height <= 266;
      }
      const sample = document.createElement("canvas"); sample.width = 480; sample.height = 270;
      const c = sample.getContext("2d"); TinyLoading.drawDVD(c, 1.4);
      const pixels = c.getImageData(0, 0, 480, 270).data;
      let ink = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) ink++;
      return { unique: new Set(tips).size, long: tips.every((t) => t.split(/\s+/).length >= 85), distinctRegressionPair: yogurtTip !== cartonTip, noConsecutiveRepeats, inBounds, ink };
    });
    assert.equal(interstitial.unique, 12); assert(interstitial.long && interstitial.inBounds);
    assert(interstitial.distinctRegressionPair, "Scene 30 -> 25 must not repeat the loading tip");
    assert(interstitial.noConsecutiveRepeats, "Adjacent chapter transitions must use different tips");
    assert(interstitial.ink > 500 && interstitial.ink < 4800, "DVD should be a visible vector logo, not a solid box");

    // Every displayed collection button routes to exactly its scene ID. Fast
    // forwarding only the interstitial avoids repeatedly waiting for its joke.
    await page.evaluate(() => { completed = new Set(chapterBook.order); save(); load(0); });
    await page.locator("#album").click();
    assert.equal(await page.locator(".collection-chapter").count(), 35);
    assert.equal(await page.locator(".chapter-scenes button").count(), 199);
    const displayed = await page.locator(".chapter-scenes button").evaluateAll((bs) => bs.map((b) => Number(b.dataset.scene)));
    assert.deepEqual(displayed, catalogue.order);
    await page.locator(".chapter-nav a").last().click();
    assert.equal(await page.locator("#collection-v9-objects-heading").evaluate((h) => document.activeElement === h), true);
    await page.screenshot({ path: "/tmp/tt9-shell-collection-desktop.png" });
    await page.locator("#close").click();
    for (const scene of catalogue.order) {
      await page.locator("#album").click();
      await page.locator(`.chapter-scenes button[data-scene="${scene}"]`).click();
      assert.equal(await page.evaluate(() => transition.target), scene);
      await page.evaluate(() => { transition.ready = true; updateTransition(2); });
      assert.equal(await page.evaluate(() => index), scene);
    }
    await page.reload();
    assert.equal(await page.evaluate(() => completed.size), 199);
    assert(!(await page.locator("#album").isDisabled()));

    // V4 is copied once, never overwritten. A completed v4 opens the first
    // new scene but does not prematurely unlock the 199-scene collection.
    const migration = await browser.newContext();
    const migrant = await migration.newPage();
    await migrant.goto(url);
    const oldOrder = catalogue.order.slice(0, 83);
    const oldValue = JSON.stringify({done:oldOrder,index:82});
    await migrant.evaluate(value => { localStorage.removeItem('tinyTriggers.v9'); localStorage.setItem('tinyTriggers.v4',value); }, oldValue);
    await migrant.reload();
    assert.equal(await migrant.evaluate(() => completed.size),83);
    assert.equal(await migrant.evaluate(() => index),catalogue.order[83]);
    assert(await migrant.locator('#album').isDisabled());
    assert.equal(await migrant.evaluate(() => localStorage.getItem('tinyTriggers.v4')),oldValue);
    await migrant.evaluate(() => localStorage.setItem('tinyTriggers.v9',JSON.stringify({done:[0,1],index:2})));
    await migrant.reload();
    assert.equal(await migrant.evaluate(() => completed.size),2,'Existing v9 takes priority');
    assert.equal(await migrant.evaluate(() => index),2);
    await migration.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    phone.on("pageerror", (e) => errors.push(e.message));
    await phone.goto(url);
    assert(!(await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
    const touch = await mobile.newCDPSession(phone);
    async function touchGesture() {
      const rect = await phone.locator("canvas").boundingBox();
      const at = (x, y) => ({ x: rect.x + x * rect.width / 480, y: rect.y + y * rect.height / 270, id: 1, force: 1, radiusX: 4, radiusY: 4 });
      // A real canvas drag followed immediately by a menu tap; individual
      // scene modules separately verify their complete touch gestures.
      await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [at(250, 204)] });
      for (let step = 1; step <= 16; step++) {
        await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [at(250 + 3 * step, 204 - step)] });
      }
      await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await touchGesture();
    await phone.reload();
    assert.equal(await phone.evaluate(() => finished), false);
    await phone.locator("#hint").tap();
    assert.match(await phone.locator("#feedback").textContent(), /hint|annoyance/i);
    await phone.evaluate(() => { completed = new Set(chapterBook.order); save(); load(0); });
    await touchGesture(); // Regression: the very next button tap after a canvas drag.
    await phone.locator("#album").tap();
    assert(await phone.locator("#collection").evaluate((d) => d.open));
    await phone.locator(".chapter-nav a").last().tap();
    await phone.locator('.chapter-scenes button[data-scene="82"]').tap();
    assert.equal(await phone.evaluate(() => transition.target), 82);
    await phone.evaluate(() => { transition.ready = true; updateTransition(2); });
    assert.equal(await phone.evaluate(() => index), 82);
    // New long titles and chapter labels must not squeeze the mobile canvas
    // beyond the viewport. Gesture behavior is tested by each scene module.
    for (const scene of catalogue.order.slice(83)) {
      await phone.evaluate(n => load(n), scene);
      const sceneLayout = await phone.evaluate(() => {
        const r = document.querySelector('#stage').getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth, left: r.left, right: r.right, width: innerWidth };
      });
      assert(!sceneLayout.overflow && sceneLayout.left >= 0 && sceneLayout.right <= sceneLayout.width + 1, `Mobile scene ${scene}: ${JSON.stringify(sceneLayout)}`);
    }
    await phone.screenshot({ path: '/tmp/tt9-shell-new-mobile.png' });
    await phone.evaluate(() => { beginTransition(3); active = false; transition.ready = false; updateTransition(1.4); });
    const mobileTip = await phone.locator("#loading-tip").textContent();
    assert(mobileTip.split(/\s+/).length >= 85);
    const layout = await phone.evaluate(() => {
      const box = document.querySelector("#loading").getBoundingClientRect();
      const tip = document.querySelector("#loading-tip").getBoundingClientRect();
      return { overflow: document.documentElement.scrollWidth > innerWidth, inside: tip.top >= box.top && tip.bottom <= box.bottom };
    });
    assert(!layout.overflow && layout.inside, JSON.stringify(layout));
    await phone.screenshot({ path: "/tmp/tt9-shell-loading-mobile.png" });
    await mobile.close();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ok: true, chapters: 35, collectionLinks: 199, sequentialProgress: true, restoredSaves: true, fullStableTips: 12, audio: audioCheck, dvd: interstitial, mobile: layout }, null, 2));
  } finally {
    await browser?.close(); server?.kill();
  }
})().catch((error) => { console.error(error); process.exit(1); });
