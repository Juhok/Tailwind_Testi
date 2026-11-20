# Tiny Triggers v8 release checks

## Scope

Six new individually authored scenes, preserving all 128 previous scenes. Three concurrent workers each completed one scene before starting their second; shared files were integrated centrally. Final release has 134 scenes in 23 chapters.

## Passed local checks

- Six new scenes: real Playwright mouse and Chrome touch-emulation gestures, negative/out-of-order gestures, intermediate/final states, Retry, and touch cancellation. `verification.json` records source/test hashes of the passing current files.
- Start, intermediate, and final screenshots reviewed for each new scene on desktop and touch layouts.
- `audit.cjs`: every retained scene module, asset, renderer, audio implementation and stylesheet remains byte-for-byte identical; syntax and runtime-file references checked; old releases preserved.
- `retained.cjs`: independent v7/v8 comparison of all earlier scene IDs, titles, chapter ordering, and old localStorage values.
- `migration.cjs`: empty, partial and full v7/v6/v5/v4 saves, newest-valid-source preference, malformed/gapped saves, continuation at the new material, collection unlock.
- `collection.cjs`: grouped/list views on desktop and touch, all 134 links, preference persistence, no completion changes from the code, no checklist link.
- `shell.cjs` with REQUIRE_COMPLETE=1: all 134 collection routes, 23 chapters, sequential progress, restored saves, stable long loading tips, 99% bar, DVD graphic, mobile layout, generated xylophone PCM, measured master output and mute.
- Retained representative gestures: red-lights, wrong-audio, third-gear, earbud, cookie-switch, controller. Earbud measured both-channel music, right-side warning, left-only continuation and muted output.

- `lifecycle.cjs`: independent desktop and touch tests of exact animation freeze while collection is open, resume on close, Retry during animations/held drag, and switching between old/new scenes without stale completion. No browser errors.
- Independent read-only review found no save-key, migration-limit, registration, chapter-order, or scene-lifecycle defects.

## Deployment verification

After publishing, run `live-files.py` to compare every runtime file and the Games listing to the local commit. Run `migration.cjs`, `collection.cjs`, `shell.cjs`, and representative `addition.cjs` checks against the live `GAME_URL`; results are reported in the release handoff.

Physical-phone testing is unverified. Screenshots and per-run proof files remain under `/tmp/tt8-additions` and `/tmp/tt8-checks`, not in the deployed game.
