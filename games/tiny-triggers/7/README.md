# Tiny Triggers — Volume 7

**Relax. Take your time. Make it worse.**

Twenty new, individually authored interactive scenes join all 108 scenes from v6: **128 scenes in 21 chapters**. New chapters cover digital frustration, team games, getting ready, shopping and driving. All previous scene artwork and interactions remain unchanged.

## Play and collection

Use the mouse or touch to manipulate each scene. Follow the sequential journey, or select **Unlock collection** and enter `pixelvibe` for scene selection without marking anything completed. **Group by chapter** switches between grouped chapters and a basic numbered list. Retry resets only the current scene. Hints first tease gently, then give concrete guidance.

## Progress

V7 writes only `tinyTriggers.v7` and its collection preference keys. On the first visit it copies the most recent valid v6, v5 or v4 progress; completed older journeys continue at the first unplayed addition. V6/v5 collection unlock and view preferences carry forward. Invalid saves are skipped, progress gaps cannot skip scenes, and previous versions' saves are never written. Progress remains local to the browser/device.

## New scene development

Each addition has its own `additions/<id>.js` file and real-input test in `tests/tiny-triggers-v7/additions/<id>.cjs`. Three scene workers develop separate assignments concurrently, finishing one scene's mouse/touch checks and visual review before starting their next. Shared rendering, audio, chapters and save integration remain owned centrally. See [ADDITIONS.md](ADDITIONS.md) for the supplied specifications and deferred ideas. There is no specifications/checklist link in the game interface.

Items **1–20** are included. The Finnish note reserves **21–26 for a later update**; none of those six are registered or playable in v7.

All menus, payments, chats, network errors and operating-system controls inside scenes are fictional. They do not charge money, send real messages, shut down the computer or change network/device settings. Sound effects respect the game's master mute; the wrong-output scene intentionally starts silent, with visual feedback.

## Verification

```sh
npm ci --prefix tests/tiny-triggers-v7
node tests/tiny-triggers-v7/addition.cjs ordering-kiosk
MOBILE=1 node tests/tiny-triggers-v7/addition.cjs ordering-kiosk
node tests/tiny-triggers-v7/additions.cjs
node tests/tiny-triggers-v7/migration.cjs
node tests/tiny-triggers-v7/collection.cjs
REQUIRE_COMPLETE=1 node tests/tiny-triggers-v7/shell.cjs
node tests/tiny-triggers-v7/audit.cjs
```

`GAME_URL` targets the live page. Scene screenshots are written to `/tmp/tt7-additions`. Mouse and browser touch emulation do not constitute physical-phone verification.

Every published change gets a new numbered release. **V1–v6 remain unchanged.**
