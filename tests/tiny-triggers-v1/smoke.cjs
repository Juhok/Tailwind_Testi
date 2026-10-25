const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");
(async () => {
  const server = process.env.GAME_URL
    ? null
    : spawn("python3", ["-m", "http.server", "4198", "--bind", "127.0.0.1"], {
        cwd: path.resolve(__dirname, "../.."),
        stdio: "ignore",
      });
  let browser;
  try {
    const url =
      process.env.GAME_URL || "http://127.0.0.1:4198/games/tiny-triggers/1/";
    for (let i = 0; i < 30; i++) {
      try {
        if ((await fetch(url)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    browser = await chromium.launch({
      executablePath:
        process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
      headless: true,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const p = await browser.newPage({ viewport: { width: 1200, height: 950 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(url);
    async function drag(x, y, x2, y2) {
      const r = await p.locator("canvas").boundingBox();
      await p.mouse.move(r.x + (x * r.width) / 480, r.y + (y * r.height) / 270);
      await p.mouse.down();
      await p.mouse.move(
        r.x + (x2 * r.width) / 480,
        r.y + (y2 * r.height) / 270,
        { steps: 18 },
      );
      await p.mouse.up();
    }
    async function choose(i) {
      await p.locator("#album").click();
      await p.locator("#scene-list button").nth(i).click();
    }
    async function done(i) {
      assert.equal(
        await p.locator("#next").isVisible(),
        true,
        `scene ${i + 1} must complete`,
      );
      console.log(`PASS ${i + 1}: ${await p.locator("#title").textContent()}`);
    }
    await p.screenshot({ path: "/tmp/tiny-triggers-start.png" });
    // Wrong gesture must not complete the banana.
    await drag(210, 190, 210, 220);
    assert.equal(await p.locator("#next").isVisible(), false);
    for (const x of [210, 232, 254]) await drag(x, 190, x, 90);
    await done(0);
    await choose(1);
    await drag(124, 150, 340, 150);
    assert.equal(await p.locator("#next").isVisible(), false);
    await drag(124, 150, 65, 150);
    await drag(124, 150, 340, 150);
    await done(1);
    await choose(2);
    await drag(135, 145, 380, 145);
    await done(2);
    await choose(3);
    await drag(100, 65, 195, 65);
    await drag(195, 65, 195, 225);
    await drag(100, 65, 250, 65);
    await drag(250, 65, 250, 225);
    await done(3);
    await choose(4);
    await drag(385, 128, 240, 155);
    assert.equal(await p.locator("#next").isVisible(), false);
    await drag(100, 128, 240, 155);
    await drag(385, 128, 240, 155);
    await done(4);
    await choose(5);
    for (let i = 0; i < 5; i++) await drag(155, 110 + i * 21, 385, 145);
    await done(5);
    await choose(6);
    for (const [x, y] of [
      [95, 105],
      [195, 105],
      [95, 195],
      [195, 195],
    ])
      await drag(x, y, 385, 145);
    await done(6);
    await choose(7);
    await drag(110, 135, 240, 165);
    await drag(110, 135, 360, 150);
    await done(7);
    await choose(8);
    await drag(282, 105, 282, 130);
    await done(8);
    await choose(9);
    await drag(266, 113, 266, 190);
    await done(9);
    await choose(10);
    await drag(100, 145, 377, 145);
    await done(10);
    await choose(11);
    for (const [from, to] of [
      [0, 1],
      [1, 3],
      [2, 0],
      [3, 2],
    ])
      await drag(125 + from * 75, 205, 125 + to * 75, 112);
    await done(11);
    await choose(12);
    await drag(355, 190, 232, 147);
    await done(12);
    await choose(13);
    await drag(170, 150, 240, 150);
    await done(13);
    await choose(14);
    await drag(240, 202, 240, 160);
    await done(14);
    await choose(15);
    for (const a of [
      [165, 110, 140, 80],
      [315, 110, 340, 80],
      [165, 190, 140, 220],
      [315, 190, 340, 220],
    ])
      await drag(...a);
    await done(15);
    await choose(16);
    for (let i = 0; i < 3; i++) await drag(140, 130, 375, 135);
    await done(16);
    await choose(17);
    await drag(245, 150, 190, 150);
    await drag(245, 150, 300, 150);
    await done(17);
    await choose(18);
    await drag(75, 145, 405, 145);
    await done(18);
    await choose(19);
    await drag(150, 155, 380, 63);
    await done(19);
    await p.locator("#next").click();
    assert.ok(await p.locator("#ending").isVisible());
    await p.screenshot({ path: "/tmp/tiny-triggers-complete.png" });
    assert.equal(
      await p.evaluate(
        () => JSON.parse(localStorage.getItem("tinyTriggers.v1")).done.length,
      ),
      20,
    );
    await p.reload();
    assert.match(await p.locator("#count").textContent(), /20 \/ 20/);
    await choose(3);
    await p.screenshot({ path: "/tmp/tiny-triggers-pizza.png" });
    // Audio is user-activated, produces oscillator nodes, and obeys mute.
    await drag(100, 65, 195, 65);
    assert.equal(await p.evaluate(() => audio.state), "running");
    assert.ok(await p.evaluate(() => gain.gain.value > 0));
    await p.locator("#sound").click();
    assert.equal(
      await p.locator("#sound").getAttribute("aria-pressed"),
      "false",
    );
    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    mobile.on("pageerror", (e) => errors.push(e.message));
    await mobile.goto(url);
    assert.equal(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await mobile.screenshot({ path: "/tmp/tiny-triggers-mobile.png" });
    // Real touch gesture via CDP on the first peel.
    const cd = await mobile.context().newCDPSession(mobile);
    const r = await mobile.locator("canvas").boundingBox();
    const pt = (x, y) => ({
      x: r.x + (x * r.width) / 480,
      y: r.y + (y * r.height) / 270,
    });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [pt(210, 190)],
    });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [pt(210, 90)],
    });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.match(await mobile.locator("#feedback").textContent(), /One strip/);
    await mobile.bringToFront();
    await mobile.locator("#album").tap();
    await mobile.screenshot({ path: "/tmp/mobile-menu-check.png" });
    await mobile
      .locator("#scene-list button")
      .first()
      .waitFor({ state: "visible" });
    assert.equal(await mobile.locator("#scene-list button").count(), 20);
    assert.deepEqual(errors, []);
    console.log(
      "ALL PASS: 20 mouse scenes, wrong moves, saved progress, ending, audio, mobile touch and layout.",
    );
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
