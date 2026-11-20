const { chromium } = require("playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
const ids = process.argv.slice(2).map((n) => Number(n) - 1);
assert.ok(
  ids.length > 0 && ids.length <= 3,
  "Review at most three scenes per batch",
);
(async () => {
  let server;
  try {
    await fetch("http://127.0.0.1:4204/");
  } catch {
    server = require("node:child_process").spawn(
      "python3",
      ["-m", "http.server", "4204", "--bind", "127.0.0.1"],
      {
        cwd: require("node:path").resolve(__dirname, "../.."),
        stdio: "ignore",
      },
    );
    await new Promise((r) => setTimeout(r, 400));
  }
  const b = await chromium.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox"],
  });
  try {
    const p = await b.newPage({ viewport: { width: 1150, height: 850 } }),
      errors = [],
      rows = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:4204/games/tiny-triggers/4/");
    await p.waitForFunction(() => typeof SCENE_COUNT !== "undefined");
    const coords = () => p.locator("canvas").boundingBox();
    async function gesture(from, to, mode, route) {
      const r = await coords(),
        move = ([x, y], steps = 8) =>
          p.mouse.move(r.x + (x * r.width) / 480, r.y + (y * r.height) / 270, {
            steps,
          });
      await move(from);
      await p.mouse.down();
      if (mode === "route") for (const v of route) await move(v, 10);
      else if (["scrub", "sweep", "smooth", "walk"].includes(mode)) {
        await move([to[0] - 22, to[1] - 12]);
        await move([to[0] + 22, to[1] + 12]);
        await move([to[0] - 20, to[1] + 5]);
      }
      await move(to, 14);
      if (["soak", "pour", "squeeze", "press", "fuel", "wait"].includes(mode)) {
        if (await p.evaluate(() => !!workshop))
          await p.waitForFunction(
            (n) => workshop.gesture?.held >= n,
            mode === "wait" ? 1.55 : mode === "soak" ? 1.35 : 0.75,
            { timeout: 7000 },
          );
        else await p.waitForTimeout(1050);
      }
      await p.mouse.up();
    }
    for (const i of ids) {
      await p.evaluate((i) => {
        completed = new Set(Array.from({ length: SCENE_COUNT }, (_, n) => n));
        load(i);
      }, i);
      await p.waitForTimeout(60);
      const row = {
        title: `${i + 1}: ` + (await p.locator("#title").textContent()),
        start: await p.locator("canvas").evaluate((c) => c.toDataURL()),
      };
      if (await p.evaluate(() => isWorkshop())) {
        const count = await p.evaluate(() => workshop.def.steps.length);
        for (let j = 0; j < count; j++) {
          const a = await p.evaluate(() => {
            const s = workshop.def.steps[workshop.step],
              o = workshop.props.find((p) => p.id === s.id);
            return {
              from: [o.x, o.y],
              to: s.to,
              mode: s.mode,
              route: s.fx.route,
            };
          });
          if (j === 0) {
            await gesture(a.from, [455, 34], "drag");
            assert.equal(
              await p.evaluate(() => workshop.step),
              0,
              `bad drop ${i}`,
            );
          }
          await gesture(a.from, a.to, a.mode, a.route);
          assert.equal(
            await p.evaluate(() => workshop.step),
            j + 1,
            `scene${i} step${j}`,
          );
          if (j === 0)
            row.mid = await p.locator("canvas").evaluate((c) => c.toDataURL());
        }
      } else {
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
            if (i === 4) {
              const r = await coords();
              await p.mouse.move(
                r.x + (385 * r.width) / 480,
                r.y + (128 * r.height) / 270,
              );
              await p.mouse.down();
              await p.mouse.move(
                r.x + (240 * r.width) / 480,
                r.y + (100 * r.height) / 270,
                { steps: 12 },
              );
              await p.waitForFunction(
                () =>
                  state.cerealFill > 0.1 &&
                  state.cerealFill < 1 &&
                  objects.find((o) => o.type === "cereal").tilt > 2.7,
              );
              row.mid = await p
                .locator("canvas")
                .evaluate((c) => c.toDataURL());
              await p.waitForFunction(() => state.steps === 2);
              await p.mouse.up();
            } else await d(110, 135, 365, 150);
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
      }
      assert.ok(await p.locator("#next").isVisible(), "completion " + i);
      await p.waitForTimeout(1000);
      row.end = await p.locator("canvas").evaluate((c) => c.toDataURL());
      rows.push(row);
      console.log("PASS", row.title);
    }
    assert.deepEqual(errors, []);
    const sheet = await b.newPage({
      viewport: { width: 1440, height: 320 * ids.length },
    });
    await sheet.setContent(
      '<body style="margin:0;background:#101721;color:#dce8ee;font:14px monospace"></body>',
    );
    await sheet.evaluate((rows) => {
      for (const r of rows) {
        const t = document.createElement("div");
        t.textContent = r.title;
        document.body.append(t);
        for (const key of ["start", "mid", "end"]) {
          const img = document.createElement("img");
          img.src = r[key] || r.start;
          img.style.width = "33.33%";
          document.body.append(img);
        }
      }
    }, rows);
    await sheet.screenshot({
      path: "/tmp/tt4-batch-" + (ids[0] + 1) + ".png",
      fullPage: true,
    });
    fs.mkdirSync("/tmp/tt4-checks", { recursive: true });
    fs.writeFileSync(
      "/tmp/tt4-checks/" + (ids[0] + 1) + ".json",
      JSON.stringify({
        ids: ids.map((i) => i + 1),
        passed: true,
        checkedAt: new Date().toISOString(),
      }),
    );
  } finally {
    await b.close();
    server?.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
