const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  { spawn } = require("node:child_process"),
  path = require("node:path");
(async () => {
  const server = process.env.GAME_URL
    ? null
    : spawn("python3", ["-m", "http.server", "4200", "--bind", "127.0.0.1"], {
        cwd: path.resolve(__dirname, "../.."),
        stdio: "ignore",
      });
  let browser;
  try {
    const url =
      process.env.GAME_URL || "http://127.0.0.1:4200/games/tiny-triggers/2/";
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
    const p = await browser.newPage({ viewport: { width: 1200, height: 900 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(url);
    await p.waitForFunction(() => typeof load === "function");
    async function drag(x, y, x2, y2, hold = 0) {
      const r = await p.locator("canvas").boundingBox();
      await p.mouse.move(r.x + (x * r.width) / 480, r.y + (y * r.height) / 270);
      await p.mouse.down();
      await p.mouse.move(
        r.x + (x2 * r.width) / 480,
        r.y + (y2 * r.height) / 270,
        { steps: 14 },
      );
      if (hold) await p.waitForTimeout(hold);
      await p.mouse.up();
    }
    async function done(i) {
      assert.ok(await p.locator("#next").isVisible(), "scene " + (i + 1));
      assert.equal(await p.evaluate(() => index), i);
      console.log("PASS scene", i + 1, await p.locator("#title").textContent());
    }
    async function next(i) {
      await p.locator("#next").click();
      assert.ok(await p.locator("#loading").isVisible());
      await p.waitForFunction(() => transition && transition.progress === 99);
      const tr = await p.evaluate(() => ({
        percent: transition.progress,
        partial:
          document.querySelector("#loading-tip").textContent.length <
          transition.tip.length,
        logo: transition.showLogo,
      }));
      assert.equal(tr.percent, 99);
      assert.ok(tr.partial);
      if (i === 3) {
        assert.ok(tr.logo);
        await p.screenshot({ path: "/tmp/tt2-loading.png" });
      }
      await p.waitForFunction((n) => index === n && !transition, i);
      assert.equal(await p.locator("#album").isDisabled(), i < 18);
    }
    assert.ok(await p.locator("#album").isDisabled());
    await p.evaluate(() => {
      collection();
      load(10);
    });
    assert.equal(await p.evaluate(() => index), 0);
    assert.equal(await p.locator("#collection").isVisible(), false);
    for (let i = 0; i < 3; i++) {
      await p.locator("#hint").click();
      assert.doesNotMatch(
        await p.locator("#feedback").textContent(),
        /three lower peel/,
      );
    }
    await p.locator("#hint").click();
    assert.match(
      await p.locator("#feedback").textContent(),
      /three lower peel/,
    );
    await p.screenshot({ path: "/tmp/tt2-start.png" });
    for (const x of [210, 232, 254]) await drag(x, 190, x, 90);
    await done(0);
    await next(1);
    await drag(124, 150, 340, 150);
    assert.equal(await p.locator("#next").isVisible(), false);
    await drag(124, 150, 65, 150);
    await drag(124, 150, 340, 150);
    await done(1);
    await next(2);
    await drag(135, 145, 380, 145);
    await done(2);
    await next(3);
    assert.equal(
      await p.evaluate(() =>
        unequalPieces([
          [226.5, 65, 226.5, 225],
          [273.5, 65, 273.5, 225],
        ]),
      ),
      false,
    );
    await drag(150, 145, 350, 145);
    assert.equal(await p.evaluate(() => state.cuts.length), 0);
    await drag(145, 110, 355, 110);
    await drag(200, 230, 200, 60);
    await done(3);
    await p.screenshot({ path: "/tmp/tt2-pizza.png" });
    await next(4);
    await drag(385, 128, 240, 155);
    assert.equal(await p.evaluate(() => state.steps), 0);
    const r = await p.locator("canvas").boundingBox();
    await p.mouse.move(
      r.x + (100 * r.width) / 480,
      r.y + (128 * r.height) / 270,
    );
    await p.mouse.down();
    await p.mouse.move(
      r.x + (220 * r.width) / 480,
      r.y + (111 * r.height) / 270,
      { steps: 10 },
    );
    await p.waitForTimeout(900);
    const pour = await p.evaluate(() => ({
      tilt: objects[0].tilt,
      fill: state.fill,
    }));
    assert.ok(pour.tilt > 0.8 && pour.fill > 0.1 && pour.fill < 1);
    await p.screenshot({ path: "/tmp/tt2-pour.png" });
    await p.waitForTimeout(1700);
    await p.mouse.up();
    assert.equal(await p.evaluate(() => state.steps), 1);
    await drag(385, 128, 240, 155);
    await done(4);
    await next(5);
    for (let i = 0; i < 5; i++) await drag(155, 90 + i * 28, 385, 145);
    await done(5);
    await next(6);
    for (const a of [
      [95, 105],
      [195, 105],
      [95, 195],
      [195, 195],
    ])
      await drag(...a, 385, 145);
    await done(6);
    await next(7);
    await drag(110, 135, 220, 111, 2500);
    assert.equal(await p.evaluate(() => state.steps), 1);
    assert.equal(await p.evaluate(() => state.fill), 0.965);
    await p.screenshot({ path: "/tmp/tt2-milk-glass.png" });
    await drag(110, 135, 365, 150);
    await done(7);
    await next(8);
    await drag(282, 105, 282, 130);
    await done(8);
    await next(9);
    await drag(266, 113, 266, 190);
    await done(9);
    await next(10);
    await drag(100, 145, 377, 145);
    await done(10);
    await next(11);
    for (const [from, to] of [
      [0, 1],
      [1, 3],
      [2, 0],
      [3, 2],
    ])
      await drag(125 + from * 75, 205, 125 + to * 75, 112);
    await done(11);
    await next(12);
    await drag(355, 190, 122, 202);
    await done(12);
    assert.deepEqual(
      await p.evaluate(() => [objects[0].x, objects[0].y]),
      [128, 206],
    );
    await next(13);
    assert.equal(await p.evaluate(() => state.value), 1);
    const volumes = await p.evaluate(() =>
      Array.from({ length: 101 }, (_, n) => [
        legalVolume(n, 1),
        legalVolume(n, -1),
      ]).flat(),
    );
    assert.ok(volumes.every((n) => n >= 1 && n <= 99 && n % 5 !== 0));
    await drag(102.8, 150, 240, 150);
    await done(13);
    await next(14);
    await p.screenshot({ path: "/tmp/tt2-drawer-open.png" });
    await drag(375, 151, 280, 151);
    await done(14);
    await p.screenshot({ path: "/tmp/tt2-drawer-shut.png" });
    await next(15);
    await p.screenshot({ path: "/tmp/tt2-bed.png" });
    for (const a of [
      [166, 116, 140, 92],
      [284, 116, 310, 92],
      [145, 190, 110, 220],
      [306, 190, 340, 220],
    ])
      await drag(...a);
    await done(15);
    await p.waitForTimeout(650);
    assert.equal(await p.evaluate(() => state.corners.length), 3);
    assert.equal(await p.evaluate(() => state.pop.time), 1);
    await p.screenshot({ path: "/tmp/tt2-bed-pop.png" });
    await next(16);
    for (let i = 0; i < 3; i++) await drag(140, 130, 375, 135);
    await done(16);
    await next(17);
    await p.screenshot({ path: "/tmp/tt2-door.png" });
    await drag(283, 156, 283, 212);
    assert.equal(await p.evaluate(() => state.pulled), true);
    await drag(283, 156, 283, 95);
    await done(17);
    await p.screenshot({ path: "/tmp/tt2-door-open.png" });
    assert.equal(await p.locator("#album").isDisabled(), false);
    await p.locator("#next").click();
    assert.ok(await p.locator("#ending").isVisible());
    await p.locator("#replay").click();
    assert.equal(await p.locator("#scene-list button").count(), 18);
    assert.doesNotMatch(
      await p.locator("#scene-list").textContent(),
      /Helpful advice|So very close/,
    );
    await p.reload();
    assert.equal(await p.locator("#album").isDisabled(), false);
    assert.match(await p.locator("#count").textContent(), /18 \/ 18/);
    const audio = await p.evaluate(async () => {
      startAudio();
      const themes = Array.from({ length: 18 }, (_, s) =>
        Array.from({ length: 64 }, (_, n) => scenePhrase(s, n)),
      );
      const a = xyloBuffer(audio, 523).getChannelData(0);
      let energy = 0,
        tail = 0;
      for (let i = 0; i < a.length; i++) {
        energy += a[i] * a[i];
        if (i > a.length * 0.8) tail += a[i] * a[i];
      }
      return {
        unique: new Set(themes.map((t) => JSON.stringify(t))).size,
        energy,
        tail,
        samples: a.length,
      };
    });
    assert.equal(audio.unique, 18);
    assert.ok(audio.energy > 50 && audio.tail < audio.energy * 0.05);
    console.log("audio", audio);
    const m = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    m.on("pageerror", (e) => errors.push(e.message));
    await m.goto(url);
    assert.ok(await m.locator("#album").isDisabled());
    assert.ok(
      await m.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await m.screenshot({ path: "/tmp/tt2-mobile.png" });
    const cd = await m.context().newCDPSession(m),
      mr = await m.locator("canvas").boundingBox(),
      pt = (x, y) => ({
        x: mr.x + (x * mr.width) / 480,
        y: mr.y + (y * mr.height) / 270,
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
    assert.match(await m.locator("#feedback").textContent(), /One strip/);
    await m.locator("#hint").tap();
    assert.match(await m.locator("#feedback").textContent(), /A hint/);
    await m.locator("#sound").tap();
    await m.waitForTimeout(600);
    assert.equal(
      await m.locator("#sound").getAttribute("aria-pressed"),
      "false",
    );
    assert.deepEqual(errors, []);
    console.log(
      "ALL PASS: sequential 18-scene run, transitions, locks, hints, rebuilt mechanics, audio, touch.",
    );
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
