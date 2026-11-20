"use strict";
// Compatibility entry point. Volume 4's authoritative suite is all.cjs;
// never accidentally execute the copied Volume 3 URL or numeric progression.
try {
  require("./all.cjs").runChecks();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
