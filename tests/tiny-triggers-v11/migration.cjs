'use strict';
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const root = path.resolve(__dirname, '../..'), port = 24000 + process.pid % 1000;
  const server = process.env.GAME_URL ? null : spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const url = process.env.GAME_URL || `http://127.0.0.1:${port}/games/tiny-triggers/11/`;
  let browser;
  try {
    for (let n = 0; n < 50; n++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const contexts = [];
    async function open(seed = {}, mobile = false) {
      const context = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1100, height: 850 } });
      contexts.push(context);
      await context.addInitScript(values => {
        if (!sessionStorage.getItem('migration-seeded')) {
          for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value);
          localStorage.setItem('tinyTriggers.v11.tutorialSeen', 'true');
          sessionStorage.setItem('migration-seeded', 'true');
        }
      }, seed);
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.waitForFunction(() => typeof journeyUI !== 'undefined' && journeyUI && workshop);
      await page.locator('#world-dialog').waitFor({ state: 'visible' });
      return { context, page, errors };
    }
    const first = await open();
    const order = await first.page.evaluate(() => [...chapterBook.order]);
    assert.equal(order.length, 199);
    assert.equal(await first.page.evaluate(() => journey.worlds.length), 7);
    assert.equal(await first.page.evaluate(() => completed.size), 0);
    assert.deepEqual(first.errors, []);
    await first.context.close();

    const cases = [
      ['empty', [], order[0]],
      ['partial', order.slice(0, 12), order[12]],
      ['complete', order, order.at(-1)],
      ['sparse', [0, 1, 12, 93, 198], 93],
    ];
    for (const [label, done, index] of cases) {
      const old = JSON.stringify({ done, index });
      const seed = { 'tinyTriggers.v10': old, 'tinyTriggers.v10.collectionUnlocked': 'true', 'tinyTriggers.v10.collectionGrouped': 'false' };
      const { page, context, errors } = await open(seed);
      const state = await page.evaluate(() => ({ done: [...completed], own: JSON.parse(localStorage.getItem('tinyTriggers.v11')), unlocked: collectionUnlocked, grouped: collectionGrouped, mapOpen: document.querySelector('#world-dialog').open, active }));
      assert.deepEqual(state.done, done, `${label}: carry every valid completed scene, including holes`);
      assert.deepEqual(state.own.done, done);
      assert.equal(state.unlocked, true); assert.equal(state.grouped, false);
      assert.equal(state.mapOpen, true); assert.equal(state.active, false);
      for (const [key, value] of Object.entries(seed)) assert.equal(await page.evaluate(key => localStorage.getItem(key), key), value, `${label}: preserve ${key} byte-for-byte`);
      await page.evaluate(() => localStorage.setItem('tinyTriggers.v10', JSON.stringify({ done: [], index: 0 })));
      await page.reload();
      await page.waitForFunction(() => typeof journeyUI !== 'undefined' && journeyUI);
      assert.deepEqual(await page.evaluate(() => [...completed]), done, `${label}: own v11 save wins on reload`);
      assert.deepEqual(errors, []);
      await context.close();
    }

    // V11's own sparse save and explicit false preferences override older values.
    const ownDone = [0, 2, 5, 127];
    const priority = await open({
      'tinyTriggers.v10': JSON.stringify({ done: order, index: 198 }),
      'tinyTriggers.v10.collectionUnlocked': 'true', 'tinyTriggers.v10.collectionGrouped': 'false',
      'tinyTriggers.v11': JSON.stringify({ done: ownDone, index: 127 }),
      'tinyTriggers.v11.collectionUnlocked': 'false', 'tinyTriggers.v11.collectionGrouped': 'true',
    });
    assert.deepEqual(await priority.page.evaluate(() => [...completed]), ownDone);
    assert.equal(await priority.page.evaluate(() => collectionUnlocked), false);
    assert.equal(await priority.page.evaluate(() => collectionGrouped), true);
    await priority.page.locator('#world-close').click();
    assert(await priority.page.locator('#album').isDisabled());
    assert.equal(await priority.page.evaluate(() => Boolean(workshop?.instance)), true, 'A stale inaccessible index is replaced with a playable scene');
    assert.deepEqual(priority.errors, []); await priority.context.close();

    const corrupted = await open({
      'tinyTriggers.v11': JSON.stringify({ done: [], index: 198, journey: { world: 6, current: 'retreat', visited: ['passage-6', 'junction-34', 'exit-34', 'retreat', 'scene-198', 'unknown'] } }),
    });
    assert.deepEqual(await corrupted.page.evaluate(() => [...journeyUI.status().revealedWorlds]), [0]);
    assert.equal(await corrupted.page.evaluate(() => journeyUI.canPlay(198)), false);
    assert.equal(await corrupted.page.evaluate(() => index), 0);
    assert.deepEqual(await corrupted.page.evaluate(() => journeyUI.snapshot().visited), []);
    await corrupted.page.evaluate(() => journeyUI.choose('retreat'));
    assert.equal(await corrupted.page.locator('#ending').isVisible(), false, 'Corrupt visits cannot claim the holiday');
    assert.deepEqual(corrupted.errors, []); await corrupted.context.close();

    const fallback = await open({
      'tinyTriggers.v11': 'not json', 'tinyTriggers.v10': JSON.stringify({ done: [0, 2, 74], index: 2 }),
      'tinyTriggers.v11.collectionGrouped': 'invalid', 'tinyTriggers.v10.collectionGrouped': 'false',
    });
    assert.deepEqual(await fallback.page.evaluate(() => [...completed]), [0, 2, 74]);
    assert.equal(await fallback.page.evaluate(() => collectionGrouped), false);
    assert.deepEqual(fallback.errors, []); await fallback.context.close();

    for (const mobile of [false, true]) {
      const { page, context, errors } = await open({}, mobile);
      const press = selector => mobile ? page.locator(selector).tap() : page.locator(selector).click();
      await press('#world-close');
      await press('#unlock-collection');
      await page.locator('#collection-code').fill('wrong');
      await press('#unlock-form button[type=submit]');
      assert(await page.locator('#unlock-error').textContent());
      await page.locator('#collection-code').fill('pixelvibe');
      await press('#unlock-form button[type=submit]');
      await page.locator('#collection').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#scene-list button').count(), 199);
      assert.equal(await page.locator('.collection-chapter').count(), 35);
      const expected = await page.locator('#scene-list button').evaluateAll(elements => elements.map(element => element.dataset.scene));
      await press('#collection-grouping');
      assert.equal(await page.locator('.collection-basic-list li').count(), 199);
      assert.equal(await page.locator('.collection-chapter').count(), 0);
      assert.deepEqual(await page.locator('#scene-list button').evaluateAll(elements => elements.map(element => element.dataset.scene)), expected);
      assert.equal(await page.evaluate(() => completed.size), 0);
      await page.locator('#scene-list button').last().click();
      await page.waitForFunction(() => !transition && index === chapterBook.order.at(-1));
      assert.equal(await page.evaluate(() => completed.size), 0, 'Collection browsing does not complete any scene or road');
      await page.reload();
      await page.locator('#world-dialog').waitFor({ state: 'visible' });
      await press('#world-close');
      await press('#album');
      assert.equal(await page.locator('.collection-basic-list li').count(), 199);
      assert.equal(await page.evaluate(() => collectionGrouped), false);
      assert.equal(await page.evaluate(() => completed.size), 0);
      assert.deepEqual(errors, []); await context.close();
    }

    // Measure an exclusive scene's actual output, then verify that the map
    // suspends its audio clock and animation without changing the mute setting.
    const sound = await open({ 'tinyTriggers.v11.collectionUnlocked': 'true' });
    const page = sound.page;
    await page.locator('#world-close').click();
    await page.evaluate(() => load([...TASKS].find(([, scene]) => scene.id === 'radio-song')[0]));
    await page.locator('#sound').click(); await page.locator('#sound').click();
    await page.waitForFunction(() => audio?.state === 'running');
    await page.evaluate(() => {
      const analyser = audio.createAnalyser(), sink = audio.createGain();
      analyser.fftSize = 2048; sink.gain.value = 0;
      gain.connect(analyser); analyser.connect(sink).connect(audio.destination);
      window.migrationProbe = { analyser, sink };
    });
    const measure = () => page.evaluate(async () => {
      const data = new Float32Array(migrationProbe.analyser.fftSize), start = audio.currentTime;
      let peak = 0;
      while (audio.currentTime - start < .7) {
        await new Promise(resolve => setTimeout(resolve, 20));
        migrationProbe.analyser.getFloatTimeDomainData(data);
        for (const sample of data) peak = Math.max(peak, Math.abs(sample));
      }
      return peak;
    });
    const playingPeak = await measure(); assert(playingPeak > .0001);
    await page.locator('#world-open').click();
    await page.waitForFunction(() => audio.state === 'suspended');
    const paused = await page.evaluate(() => ({ clock: audio.currentTime, animation: workshop.time, muted }));
    await page.waitForTimeout(250);
    assert.deepEqual(await page.evaluate(() => ({ clock: audio.currentTime, animation: workshop.time, muted })), paused);
    assert.equal(paused.muted, false);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
      delete document.hidden;
    });
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => audio.state), 'suspended', 'Returning to the tab must not resume scene audio behind the map');
    await page.locator('#world-close').click();
    await page.waitForFunction(() => audio.state === 'running');
    const resumedPeak = await measure(); assert(resumedPeak > .0001);
    await page.locator('#reset').click();
    assert.equal(await page.evaluate(() => workshop.instance.debug().station), 0);
    assert.equal(await page.evaluate(() => finished), false);
    await page.locator('#sound').click();
    const start = await page.evaluate(() => audio.currentTime);
    await page.waitForFunction(start => audio.currentTime - start >= 1.2, start);
    const mutedPeak = await measure(); assert(mutedPeak < .00001);
    await page.locator('#world-open').click();
    await page.waitForFunction(() => audio.state === 'suspended');
    await page.locator('#world-close').click();
    await page.waitForFunction(() => audio.state === 'running');
    assert.equal(await page.evaluate(() => muted), true, 'Map open/close preserves player mute choice');
    await page.locator('#sound').click();
    await page.evaluate(() => load([...TASKS].find(([, scene]) => scene.id === 'wrong-audio')[0]));
    const switchTime = await page.evaluate(() => audio.currentTime);
    await page.waitForFunction(start => audio.currentTime - start >= 1, switchTime);
    const switchedPeak = await measure(); assert(switchedPeak < .00001, 'Scene switch leaves no radio melody behind');
    assert.deepEqual(sound.errors, []);
    await sound.context.close();
    console.log(JSON.stringify({ passed: true, migrationCases: cases.map(c => c[0]), sparseOwnPriority: true, corruptVisitsBlocked: true, collectionMouseTouch: true, audio: { playingPeak, resumedPeak, mutedPeak, switchedPeak, mapSuspends: true, visibilityPreserved: true } }));
  } finally {
    await browser?.close(); server?.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
