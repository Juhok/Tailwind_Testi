/* Tutorial lifecycle checks: the intro is not a completed scene or a hint click. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../../games/tiny-triggers/11/tutorial.js'), 'utf8');
const key = 'tinyTriggers.v11.tutorialSeen';

function setup({ data = new Map(), blocked = false, index = 0 } = {}) {
  let finished = false;
  const writes = [];
  const feedback = { textContent: '' };
  const button = { hidden: false, addEventListener(type, fn) { this[type] = fn; } };
  const context = {
    document: { querySelector(selector) { return selector === '#tutorial-dismiss' ? button : selector === '#feedback' ? feedback : null; } },
    localStorage: {
      getItem(k) { if (blocked) throw Error('Storage unavailable'); return data.get(k) ?? null; },
      setItem(k, value) { if (blocked) throw Error('Storage unavailable'); data.set(k, value); writes.push(k); },
    },
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  const tutorial = context.TinyTutorial.create({ getIndex: () => index, getFinished: () => finished, say: value => { feedback.textContent = value; } });
  return { tutorial, data, writes, feedback, button, setIndex(value) { index = value; }, finish() { finished = true; } };
}

const saved = new Map([
  ['tinyTriggers.v10', JSON.stringify({ index: 93, done: [0, 1, 93] })],
  ['tinyTriggers.v11', JSON.stringify({ index: 93, done: [0, 1, 93] })],
]);
const original = [...saved];
const first = setup({ data: saved, index: 93 });
assert.equal(first.tutorial.needsIntro(), true);
assert.equal(first.button.hidden, true);
assert.equal(first.tutorial.start(), false, 'Never mark seen or display banana directions over a different scene');
assert.deepEqual(first.writes, []);
first.setIndex(0);
assert.equal(first.tutorial.start(), true);
assert.match(first.feedback.textContent, /mouse or finger/);
assert.match(first.feedback.textContent, /drag it upward/);
assert.match(first.feedback.textContent, /then release/);
assert.equal(first.button.hidden, false);
assert.equal(first.tutorial.isActive(), true);
assert.equal(first.tutorial.shouldGuide(), true);
assert.equal(first.tutorial.needsIntro(), false);
assert.deepEqual(first.writes, [key], 'Only the version-specific tutorial marker is written');
for (const [k, value] of original) assert.equal(first.data.get(k), value, 'Existing progress and previous releases stay unchanged');
first.button.click();
assert.equal(first.button.hidden, true);
assert.equal(first.feedback.textContent, '');
assert.equal(first.tutorial.shouldGuide(), false);
assert.equal(first.tutorial.start(), false, 'Dismiss cannot cause another automatic intro');
first.tutorial.beforeLoad(0);
assert.equal(first.tutorial.start(), false, 'Retry does not show the tutorial again');
const reload = setup({ data: saved });
assert.equal(reload.tutorial.needsIntro(), false);
assert.equal(reload.tutorial.start(), false, 'Reload does not show the tutorial again');

const finish = setup();
finish.tutorial.start();
finish.finish();
finish.feedback.textContent = 'One long peel. The other end.';
assert.equal(finish.tutorial.shouldGuide(), false, 'Never draw tutorial arrows over a finished scene');
finish.tutorial.onWin();
assert.equal(finish.tutorial.isActive(), false);
assert.equal(finish.feedback.textContent, 'One long peel. The other end.', 'Finishing preserves the scene verdict');
const switchScene = setup();
switchScene.tutorial.start();
switchScene.feedback.textContent = 'Another scene’s feedback';
switchScene.tutorial.beforeLoad(1);
switchScene.setIndex(1);
assert.equal(switchScene.tutorial.shouldGuide(), false);
assert.equal(switchScene.button.hidden, true);
assert.equal(switchScene.feedback.textContent, 'Another scene’s feedback');

const privateMode = setup({ blocked: true });
assert.equal(privateMode.tutorial.start(), true, 'Blocked storage does not block play');
privateMode.tutorial.beforeLoad(0);
assert.equal(privateMode.tutorial.needsIntro(), false, 'Unavailable storage still remembers display for this page');
assert.equal(privateMode.tutorial.start(), false);
console.log('PASS one-time tutorial lifecycle, actual-display marker, existing saves untouched, dismiss/Retry/reload/win/switch behavior, blocked-storage fallback');

// Run after the complete v11 shell is assembled: node tutorial.cjs --browser.
async function browserCheck() {
  const { chromium } = require('playwright');
  const { spawn } = require('node:child_process');
  const root = path.resolve(__dirname, '../..');
  const port = 28000 + process.pid % 1000;
  const server = process.env.GAME_URL ? null : spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const url = process.env.GAME_URL || `http://127.0.0.1:${port}/games/tiny-triggers/11/`;
  let browser;
  try {
    for (let n = 0; n < 50; n++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    fs.mkdirSync('/tmp/tt11-tutorial', { recursive: true });
    for (const mobile of [false, true]) {
      const context = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1100, height: 850 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.locator('#tutorial-dismiss').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#title').textContent(), 'Peel by peel');
      assert.match(await page.locator('#feedback').textContent(), /mouse or finger/);
      const initial = await page.evaluate(() => ({ seen: localStorage.getItem('tinyTriggers.v11.tutorialSeen'), save: JSON.parse(localStorage.getItem('tinyTriggers.v11')), hintClicks }));
      assert.equal(initial.seen, 'true');
      assert.deepEqual(initial.save.done, [], 'Displaying help does not play the scene');
      assert.equal(initial.hintClicks, 0, 'Tutorial does not consume teasing hints');
      await page.screenshot({ path: `/tmp/tt11-tutorial/intro-${mobile ? 'touch' : 'mouse'}.png` });

      // Actual pointer input must reach the banana beneath its visual help.
      const guide = await page.evaluate(() => TinyHints.current(workshop));
      assert.equal(guide.kind, 'drag');
      const box = await page.locator('#stage').boundingBox();
      const point = p => ({ x: box.x + p[0] * box.width / 480, y: box.y + p[1] * box.height / 270 });
      const from = point(guide.from), to = point(guide.to);
      if (mobile) {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from] });
        for (let step = 1; step <= 20; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * step / 20, y: from.y + (to.y - from.y) * step / 20 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else {
        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await page.mouse.move(to.x, to.y, { steps: 20 });
        await page.mouse.up();
      }
      await page.waitForFunction(() => finished, null, { timeout: 10000 });
      assert.equal(await page.locator('#tutorial-dismiss').isVisible(), false);
      assert((await page.evaluate(() => JSON.parse(localStorage.getItem('tinyTriggers.v11')).done)).includes(0));
      await page.locator('#reset').click();
      assert.equal(await page.locator('#tutorial-dismiss').isVisible(), false, 'Retry does not repeat automatic help');
      for (let n = 1; n <= 4; n++) {
        await page.locator('#hint').click();
        assert.equal(await page.evaluate(() => hintClicks), n);
        if (n === 1) assert.match(await page.locator('#feedback').textContent(), /Already/);
      }
      await page.reload();
      await page.waitForFunction(() => typeof index === 'number');
      assert.equal(await page.locator('#tutorial-dismiss').isVisible(), false, 'Reload keeps introduction seen');
      assert.deepEqual(errors, []);
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 1100, height: 850 } });
    const imported = JSON.stringify({ index: 93, done: [0, 1, 12, 93] });
    await context.addInitScript(value => {
      if (!sessionStorage.getItem('tutorial-seed')) {
        localStorage.setItem('tinyTriggers.v10', value);
        sessionStorage.setItem('tutorial-seed', 'true');
      }
    }, imported);
    const page = await context.newPage();
    await page.goto(url);
    await page.locator('#tutorial-dismiss').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#title').textContent(), 'Peel by peel', 'Existing players see new controls once in the banana scene');
    assert.equal(await page.evaluate(() => localStorage.getItem('tinyTriggers.v10')), imported, 'Tutorial does not alter imported release');
    const carried = await page.evaluate(() => JSON.parse(localStorage.getItem('tinyTriggers.v11')).done);
    assert.deepEqual([...carried].sort((a, b) => a - b), [0, 1, 12, 93], 'Sparse imported completions survive the tutorial');
    await page.locator('#tutorial-dismiss').click();
    assert.equal(await page.locator('#tutorial-dismiss').isVisible(), false);
    await page.reload();
    await page.waitForFunction(() => typeof index === 'number');
    assert.equal(await page.locator('#tutorial-dismiss').isVisible(), false);
    await context.close();
    console.log('PASS browser tutorial on mouse/touch, real peel under guide, unchanged first hint, Retry/reload once-only behavior, sparse imported saves preserved');
  } finally {
    await browser?.close();
    server?.kill();
  }
}

if (process.argv.includes('--browser')) browserCheck().catch(error => { console.error(error); process.exitCode = 1; });
