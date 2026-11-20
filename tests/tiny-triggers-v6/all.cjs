"use strict";
const { spawnSync } = require("node:child_process");
const path = require("node:path");

// Retained-scene regressions use bounded batches. The original stable catalogue
// numbers are used here; chapter order is tested separately by shell.cjs.
const manifest = require('../../games/tiny-triggers/6/UPGRADE_MANIFEST.json');
const batches = Array.from({length: Math.ceil(manifest.length / 3)}, (_, i) => manifest.slice(i * 3, i * 3 + 3).map(s => s.id));

function runChecks(run = spawnSync, log = console.log) {
  const checks = [{ file: "audit.cjs", args: [], label: "Complete scene inventory and syntax" }, ...batches.map((ids) => ({
    file: "upgrade.cjs",
    args: ids,
    label: `Upgraded scenes: ${ids.join(", ")}`,
  }))];
  const additions = require('node:fs').readdirSync(path.join(__dirname, 'scenes')).filter(n => n.endsWith('.cjs')).map(n=>n.slice(0,-4));
  if (additions.length !== 25) throw new Error('Expected 25 individual new-scene tests');
  for (let i=0; i<additions.length; i+=3) {
    const ids=additions.slice(i,i+3);
    checks.push({file:'scene.cjs',args:ids,label:`Retained v5 scenes: ${ids.join(', ')}`});
  }
  checks.push({ file: "migration.cjs", args: [], label: "Separate v6 saves and collection preferences" });
  checks.push({ file: "collection.cjs", args: [], label: "Mouse/touch code unlock and grouped/list view" });
  checks.push({ file: "shell.cjs", args: [], label: "Chapter progression, collection, loading, and mobile shell" });
  for (const [number, check] of checks.entries()) {
    log(`[${number + 1}/${checks.length}] ${check.label}`);
    // spawnSync deliberately serializes the whole workflow; no later batch
    // starts until the current one exits successfully.
    const result = run(process.execPath, [path.join(__dirname, check.file), ...check.args], {
      cwd: path.resolve(__dirname, "../.."),
      env: process.env,
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`${check.label} failed (${result.signal ? `signal ${result.signal}` : `exit ${result.status}`}). Later checks were not started.`);
    }
  }
  log("PASS: 108 scenes, plus chapter/save/audio/mobile shell checks.");
}

module.exports = { batches, runChecks };
  if (require.main === module) {
  if (process.argv.includes("--list")) {
    console.log("node audit.cjs");
    batches.forEach((ids) => console.log(`node upgrade.cjs ${ids.join(" ")}`));
    console.log("node new.cjs (25 retained v5 scenes)");
    console.log("node migration.cjs");
    console.log("node collection.cjs");
    console.log("node shell.cjs");
  } else {
    try { runChecks(); } catch (error) { console.error(error); process.exitCode = 1; }
  }
}
