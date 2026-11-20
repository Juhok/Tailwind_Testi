"use strict";
const { spawnSync } = require("node:child_process");
const path = require("node:path");

// Never process more than three scenes at once. The original stable catalogue
// numbers are used here; chapter order is tested separately by shell.cjs.
const batches = Object.freeze(
  Array.from({ length: Math.ceil(83 / 3) }, (_, batch) =>
    Object.freeze(Array.from({ length: Math.min(3, 83 - batch * 3) }, (_, offset) => batch * 3 + offset + 1)),
  ),
);

function runChecks(run = spawnSync, log = console.log) {
  const checks = batches.map((ids) => ({
    file: "batch.cjs",
    args: ids.map(String),
    label: `Scenes ${ids[0]}–${ids.at(-1)} (${ids.length} at a time)`,
  }));
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
  log("PASS: 83 scenes in 28 sequential batches, followed by the shell checks.");
}

module.exports = { batches, runChecks };
if (require.main === module) {
  if (process.argv.includes("--list")) {
    batches.forEach((ids) => console.log(`node batch.cjs ${ids.join(" ")}`));
    console.log("node shell.cjs");
  } else {
    try { runChecks(); } catch (error) { console.error(error); process.exitCode = 1; }
  }
}
