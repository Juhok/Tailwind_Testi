const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  { spawn } = require("node:child_process"),
  path = require("node:path");
(async () => {
  const server = process.env.GAME_URL
    ? null
    : spawn("python3", ["-m", "http.server", "4201", "--bind", "127.0.0.1"], {
        cwd: path.resolve(__dirname, "../.."),
        stdio: "ignore",
      });
  let browser;
  try {
    const url =
      process.env.GAME_URL || "http://127.0.0.1:4201/games/tiny-triggers/3/";
    for (let i = 0; i < 30; i++) {
      try {
        if ((await fetch(url)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    browser = await chromium.launch({
      executablePath:
        process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const p = await browser.newPage({ viewport: { width: 1100, height: 850 } }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(url);
    assert.equal(await p.evaluate(() => SCENE_COUNT), 83);
    assert.match(await p.locator("#count").textContent(), /0 \/ 83/);
    assert.ok(await p.locator("#album").isDisabled());
    await p.evaluate(() => {
      collection();
      load(70);
    });
    assert.equal(await p.evaluate(() => index), 0);
    const ids = await p.evaluate(() => [...TASKS.keys()]);
    const images = [];
    async function coords() {
      return p.locator("canvas").boundingBox();
    }
    async function gesture(from, to, mode, route) {
      const r = await coords(),
        move = async ([x, y], steps = 4) =>
          p.mouse.move(r.x + (x * r.width) / 480, r.y + (y * r.height) / 270, {
            steps,
          });
      await move(from);
      await p.mouse.down();
      if (mode === "route") {
        for (const v of route) await move(v, 10);
      } else if (["scrub", "sweep", "smooth", "walk"].includes(mode)) {
        await move([to[0] - 22, to[1] - 12], 8);
        await move([to[0] + 22, to[1] + 12], 8);
        await move([to[0] - 20, to[1] + 5], 8);
      }
      await move(to, 10);
      if (["soak", "pour", "squeeze", "press", "fuel", "wait"].includes(mode))
        await p.waitForTimeout(
          mode === "wait" ? 1650 : mode === "soak" ? 1450 : 850,
        );
      await p.mouse.up();
    }
    for (const i of ids) {
      await p.evaluate((i) => {
        completed = new Set(Array.from({ length: i }, (_, n) => n));
        load(i);
      }, i);
      await p.waitForTimeout(35);
      images.push({
        title: await p.locator("#title").textContent(),
        start: await p.locator("canvas").evaluate((c) => c.toDataURL()),
      });
      const count = await p.evaluate(() => workshop.def.steps.length);
      for (let j = 0; j < count; j++) {
        const data = await p.evaluate(() => {
          const s = workshop.def.steps[workshop.step],
            o = workshop.props.find((o) => o.id === s.id);
          return {
            from: [o.x, o.y],
            to: s.to,
            mode: s.mode,
            route: s.fx.route,
          };
        });
        if (j === 0) {
          await gesture(data.from, [445, 40], "drag");
          assert.equal(
            await p.evaluate(() => workshop.step),
            0,
            `wrong target must fail in ${i}`,
          );
        }
        await gesture(data.from, data.to, data.mode, data.route);
        assert.equal(
          await p.evaluate(() => workshop.step),
          j + 1,
          `scene ${i} step ${j}: ${data.mode}`,
        );
      }
      assert.ok(await p.locator("#next").isVisible(), "completed scene " + i);
      await p.waitForTimeout(70);
      images.at(-1).end = await p
        .locator("canvas")
        .evaluate((c) => c.toDataURL());
      console.log("PASS", i + 1, await p.locator("#title").textContent());
    }
    // New scenes must not alter progression: one legitimate next transition, capped.
    await p.locator("#next").click();
    assert.ok(await p.locator("#ending").isVisible());
    await p.locator("#replay").click();
    assert.equal(await p.locator("#scene-list button").count(), 83);
    await p.reload();
    assert.equal(await p.locator("#album").isDisabled(), false);
    await p.evaluate(() => {
      completed = new Set();
      load(0);
    });
    for (let i = 0; i < 3; i++) {
      await p.locator("#hint").click();
      assert.doesNotMatch(
        await p.locator("#feedback").textContent(),
        /Tear a little/,
      );
    }
    await p.locator("#hint").click();
    assert.match(await p.locator("#feedback").textContent(), /Tear a little/);
    // Retained scenes: execute the v2 test gestures against the actual input loop.
    const retained = [1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    for (const i of retained) {
      await p.evaluate((i) => {
        completed = new Set(Array.from({ length: i }, (_, n) => n));
        load(i);
      }, i);
      const d = (a, b, c, e, hold) =>
        gesture([a, b], [c, e], hold ? "pour" : "drag");
      switch (i) {
        case 1:
          await d(124, 150, 65, 150);
          await d(124, 150, 340, 150);
          break;
        case 3:
          await d(145, 110, 355, 110);
          await d(200, 230, 200, 60);
          break;
        case 4:
        case 7: {
          const r = await coords();
          await p.mouse.move(
            r.x + ((i === 4 ? 100 : 110) * r.width) / 480,
            r.y + ((i === 4 ? 128 : 135) * r.height) / 270,
          );
          await p.mouse.down();
          await p.mouse.move(
            r.x + (220 * r.width) / 480,
            r.y + (111 * r.height) / 270,
            { steps: 10 },
          );
          await p.waitForTimeout(2500);
          await p.mouse.up();
          if (i === 4) await d(385, 128, 240, 155);
          else await d(110, 135, 365, 150);
          break;
        }
        case 6:
          for (const [x, y] of [
            [95, 105],
            [195, 105],
            [95, 195],
            [195, 195],
          ])
            await d(x, y, 385, 145);
          break;
        case 8:
          await d(282, 105, 282, 130);
          break;
        case 9:
          await d(266, 113, 266, 190);
          break;
        case 10:
          await d(100, 145, 377, 145);
          break;
        case 11:
          for (const [a, b] of [
            [0, 1],
            [1, 3],
            [2, 0],
            [3, 2],
          ])
            await d(125 + a * 75, 205, 125 + b * 75, 112);
          break;
        case 12:
          await d(355, 190, 122, 202);
          break;
        case 13:
          await d(102.8, 150, 200, 150);
          assert.equal(await p.locator("#next").isVisible(), false);
          const x = await p.evaluate(() => objects[0].x);
          await d(x, 150, 240, 150);
          break;
        case 14:
          await d(375, 151, 280, 151);
          break;
        case 15:
          for (const a of [
            [166, 116, 140, 92],
            [284, 116, 310, 92],
            [145, 190, 110, 220],
            [306, 190, 340, 220],
          ])
            await d(...a);
          break;
        case 16:
          for (let n = 0; n < 3; n++) await d(140, 130, 375, 135);
          break;
        case 17:
          await d(283, 156, 283, 212);
          await d(283, 156, 283, 95);
          break;
      }
      assert.ok(await p.locator("#next").isVisible(), "retained " + i);
      console.log("RETAINED PASS", i + 1);
    }
    await p.locator("#next").click();
    await p.waitForFunction(() => transition?.progress === 99);
    assert.ok(
      await p.evaluate(
        () =>
          document.querySelector("#loading-tip").textContent.length <
          transition.tip.length,
      ),
    );
    await p.waitForFunction(() => index === 18 && !transition);
    assert.ok(await p.locator("#album").isDisabled());
    await p.reload();
    assert.equal(await p.evaluate(() => index), 18);
    assert.ok(await p.locator("#album").isDisabled());
    const m = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    m.on("pageerror", (e) => errors.push(e.message));
    await m.goto(url);
    const cd = await m.context().newCDPSession(m),
      r = await m.locator("canvas").boundingBox(),
      pt = ([x, y]) => ({
        x: r.x + (x * r.width) / 480,
        y: r.y + (y * r.height) / 270,
      });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [pt([227, 125])],
    });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [pt([150, 93])],
    });
    await cd.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.equal(await m.evaluate(() => workshop.step), 1);
    await m.locator("#hint").tap();
    assert.match(await m.locator("#feedback").textContent(), /A hint/);
    assert.ok(
      await m.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await m.screenshot({ path: "/tmp/tt3-mobile.png" });
    // Contact sheets keep the visual audit separate from interaction assertions.
    const sheet = await browser.newPage({
      viewport: { width: 1440, height: 1200 },
    });
    for (let part = 0; part < 4; part++) {
      const group = images.slice(part * 17, (part + 1) * 17);
      await sheet.setContent(
        '<html><body style="margin:0;background:#101721;color:white;font:14px monospace;display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></body></html>',
      );
      await sheet.evaluate((rows) => {
        for (const row of rows) {
          const d = document.createElement("div");
          d.textContent = row.title;
          for (const key of ["start", "end"]) {
            const img = document.createElement("img");
            img.src = row[key];
            img.style.width = "49%";
            d.append(img);
          }
          document.body.append(d);
        }
      }, group);
      await sheet.screenshot({
        path: `/tmp/tt3-sheet-${part}.png`,
        fullPage: true,
      });
    }
    assert.deepEqual(errors, []);
    console.log(
      "ALL PASS: 83 scenes, wrong moves, ordered stages, retained interactions, collection, saved progress, loading, touch, artwork.",
    );
  } finally {
    if (browser) await browser.close();
    server?.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
