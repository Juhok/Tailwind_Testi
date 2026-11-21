const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const port = 25000 + process.pid % 1000;
  const root = path.resolve(__dirname, '../..');
  const server = process.env.GAME_URL ? null : spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const url = process.env.GAME_URL || `http://127.0.0.1:${port}/games/tiny-triggers/11/`;
  let browser;
  try {
    for (let i = 0; i < 50; i++) { try { if ((await fetch(url)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
    browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    fs.mkdirSync('/tmp/tt11-ui', { recursive: true });
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1180, height: 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => typeof journeyUI !== 'undefined' && journeyUI);
      assert.equal(await page.evaluate(() => journey.sceneNodes.size), 199);
      assert.equal(await page.evaluate(() => journey.worlds.length), 7);
      assert.equal(await page.evaluate(() => tutorial.isActive()), true);
      await page.locator('#world-open')[mobile ? 'tap' : 'click']();
      assert.equal(await page.evaluate(() => active), false);
      assert.deepEqual(await page.evaluate(() => [...journeyUI.status().revealedWorlds]), [0]);
      assert.equal(await page.evaluate(() => journeyUI.canPlay(1)), false);
      const before = await page.evaluate(() => journeyUI.snapshot());
      await page.evaluate(async () => { await journeyUI.choose('passage-0'); load(1); });
      assert.equal(await page.evaluate(() => index), 0, 'Locked scene cannot load');
      assert.deepEqual(await page.evaluate(() => journeyUI.snapshot()), before, 'Locked passage cannot move traveler');
      await page.screenshot({ path: `/tmp/tt11-ui/forest-${mobile ? 'touch' : 'mouse'}.png` });
      await page.locator('#world-close')[mobile ? 'tap' : 'click']();

      // Actual pointer interaction in the mandatory introduction, not win().
      const g = await page.evaluate(() => TinyHints.current(workshop));
      const box = await page.locator('#stage').boundingBox();
      const pt = p => ({ x: box.x + p[0] * box.width / 480, y: box.y + p[1] * box.height / 270 });
      const from = pt(g.from), to = pt(g.to);
      if (mobile) {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
        for (let i = 1; i <= 22; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * i / 22, y: from.y + (to.y - from.y) * i / 22 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.mouse.move(to.x, to.y, { steps: 22 }); await page.mouse.up();
      }
      await page.waitForFunction(() => finished);
      await page.locator('#next')[mobile ? 'tap' : 'click']();
      await page.locator('[data-node="junction-0"]')[mobile ? 'tap' : 'click']();
      await page.locator('.wm-play')[mobile ? 'tap' : 'click']();
      await page.waitForFunction(() => journeyUI.snapshot().visited.includes('junction-0'));
      const branches = await page.evaluate(() => journey.successors('junction-0').map(id => ({ id, i: journey.nodeById.get(id).sceneIndex, available: journeyUI.status().available.has(id) })));
      assert.equal(branches.length, 2); assert(branches.every(b => b.available));
      await page.screenshot({ path: `/tmp/tt11-ui/branch-${mobile ? 'touch' : 'mouse'}.png` });
      // Choosing the RIGHT road must survive reload even with skipped earlier
      // scene IDs. Simulate completion only here to isolate navigation logic.
      await page.locator(`[data-node="${branches[1].id}"]`)[mobile ? 'tap' : 'click']();
      await page.locator('.wm-play')[mobile ? 'tap' : 'click']();
      await page.waitForFunction(i => !transition && index === i, branches[1].i);
      assert.equal(await page.evaluate(() => index), branches[1].i);
      await page.evaluate(() => win());
      const sparse = await page.evaluate(() => [...completed]);
      assert(!sparse.includes(branches[0].i));
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#world-dialog').open);
      assert.deepEqual(await page.evaluate(() => [...completed]), sparse);
      assert.equal(await page.evaluate(() => journeyUI.canPlay(journey.nodeById.get(journey.successors('junction-0')[0]).sceneIndex)), true, 'Other branch remains available');
      for (const width of [320, 390, 768, 1180]) {
        await page.setViewportSize({ width, height: 900 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}`);
        assert(await page.evaluate(() => { const d = document.querySelector('#world-dialog'); return d.scrollWidth <= d.clientWidth + 2; }), `No modal overflow at ${width}`);
      }
      assert.deepEqual(errors, []); await context.close();
      console.log(`PASS ${mobile ? 'touch' : 'mouse'} banana gesture, map pause, locked passage, two routes, sparse reload and responsive map`);
    }

    // Navigation-only traversal of ALL seven worlds: real navigation functions,
    // artificial scene completions. Scene mechanics are tested separately.
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1180, height: 900 } });
    await page.goto(url);
    const route = await page.evaluate(async () => {
      const choices = [];
      for (let turn = 0; turn < 400; turn++) {
        const s = journeyUI.status();
        if (s.arrived) return { choices, done: completed.size, worlds: [...s.revealedWorlds] };
        const candidates = journey.nodes.filter(n => s.available.has(n.id) && !s.cleared.has(n.id));
        // Prefer right branches and onward gates over unfinished optional roads.
        const target = candidates.find(n => n.type === 'retreat')
          || candidates.find(n => n.type === 'passage')
          || candidates.find(n => n.kind === 'exit')
          || candidates.find(n => n.kind === 'junction')
          || candidates.find(n => n.route === 'right')
          || candidates.find(n => n.route === 'main') || candidates[0];
        if (!target) throw Error('Journey dead end');
        journeyUI.open();
        await journeyUI.choose(target.id);
        if (target.type === 'scene') {
          // Exercise actual transition completion and game win/save hooks.
          if (transition) { transition.ready = true; updateTransition(2); }
          win();
        }
        choices.push(target.id);
      }
      throw Error('Journey did not reach retreat');
    });
    assert.equal(route.worlds.length, 7);
    assert(route.done < 199, 'Holiday does not require both branches');
    assert(await page.locator('#ending').isVisible());
    assert.match(await page.locator('#ending').textContent(), /hammock/i);
    await page.screenshot({ path: '/tmp/tt11-ui/holiday.png' });
    assert(await page.locator('#album').isDisabled(), 'Collection still requires all scenes or code');
    await page.locator('#replay').click();
    await page.screenshot({ path: '/tmp/tt11-ui/coast.png' });
    await page.reload();
    assert.equal(await page.evaluate(() => journeyUI.status().arrived), true);
    console.log(`PASS seven-world navigation and explicit passages, peaceful retreat with ${route.done}/199 scenes, optional replay and arrival persistence`);
  } finally { await browser?.close(); server?.kill(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
