# Tiny Triggers v9 verification

## Local release checks — 2026-11-21

Scope: **65 new scenes plus the existing biscuit-in-tea refinement**, for **199 scenes in 35 chapters**. These are v9 results, not copied v8 verification claims.

- **Individual gestures: PASS.** All 65 new scenes and the revised biscuit scene passed real browser mouse and touch-emulation gestures, intermediate/final-state assertions, and Retry. `verification.json` records the exact source/test SHA-256 hashes for all 66 changed scenes. `collect-proof.cjs` checked every record against the release files; `audit.cjs` passed.
- **Preservation: PASS.** A fresh v8/v9 browser comparison confirms all 134 earlier IDs, titles and sequence positions, the original 23 chapters, and 83 upgraded-scene definitions. The other 133 retained scene implementations, shared artwork/audio, and assets match v8 byte-for-byte. Published v1–v8 are unchanged.
- **Progress and saves: PASS.** Empty, partial, completed, invalid and interrupted saves migrate from v8/v7/v6/v5/v4 into separate v9 storage. Existing v9 data takes priority; older storage is not modified; completed earlier journeys resume at the first new scene.
- **Collection: PASS on desktop and touch.** Wrong codes remain locked; `pixelvibe` opens all 199 scenes without marking them complete. Grouped/list views preserve order, route to the selected scene, and remember the preference after reload. No idea-checklist link appears in the game.
- **Game UI: PASS.** All 199 collection links, sequential progression, reload persistence, 35 chapters, long instant loading tips, 99% loading, DVD near-corner animation, mobile titles, canvas bounds, and the menu tap immediately after a drag were checked.
- **Audio: PASS.** Xylophone PCM and actual master output contain sound. Muting reduced measured output peak from approximately 0.06846 to 0.000000532. The radio scene produced sound, measured zero output while muted or in the collection, resumed correctly, and left zero residual output when switching to the silent-output scene.
- **New-scene lifecycle: PASS.** Car door, rising flush, one-HP battle, smoke alarm, roadworks, overwritten tape, remote reach, short blanket, final screw, forgotten sock, bad cart wheel, and scrap-paper pen passed active animation pause/resume and Retry isolation on mouse and touch (12 scenes × 2 input modes).
- **Retained-scene lifecycle: PASS.** Crossing and windshield animations pause/resume correctly; the pudding scene resets during animation and active dragging; switching from earlier scenes to the banana and back causes no delayed completion or stale state. Both mouse and touch passed.
- **Visual review: PASS.** Existing start/intermediate/finish captures were reviewed during development. The final independent review inspected eleven late-scene desktop pairs and three mobile pairs, with no blocking clipping or unclear final states. Their screenshots postdate the reviewed source files.
- **Runtime integrity: PASS.** Referenced assets exist, JavaScript syntax passes, requested scenes are included once, and no new scene owns network requests, storage writes, or unmanaged timers.

## Post-deployment gate

After the release push, run `live-files.py` against GitHub Pages to compare every runtime file and the Games listing with the committed build. Repeat the game UI, migration, collection, audio and representative gesture checks with `GAME_URL`/`SITE_URL` targeting the published release. Report these live results separately; local results above do not imply deployment has already happened.

Physical-phone testing remains **unverified**. Touch checks use Chromium emulation.
