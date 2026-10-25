# Tiny Triggers — Volume 3

**Relax. Take your time. Make it worse.**

83 illustrated, mouse/touch scenes. [SPECIFICATIONS.md](SPECIFICATIONS.md) provides the complete English translation and implementation mapping of the Finnish attachment: 78 source entries, 77 unique ideas, 65 new scenes, three revised existing scenes, and nine matching existing scenes. The repeated coffee idea is implemented once.

## Structure

- `game.js`: retained scenes, sequential progression, saving, hints, collection, music and 99% transitions.
- `catalog.js`: English descriptions, physical props and ordered gestures for the additions and revised banana/chocolate/burger scenes.
- `workshop.js`: code-drawn pixel-art props and shared recognition for dragging, tearing, folding, cutting, holding/pouring/soaking, rubbing/sweeping and routing a cable around an obstacle. Finishing an action changes the visible objects; arbitrary clicks or wrong-target drops do not complete tasks.
- `index.html`, `style.css`: dark, compact UI with the same tagline and accessibility descriptions as v2.

Every scene is available for replay only after all 83 are completed. The first three hint clicks tease; subsequent clicks reveal the scene's action sequence. Progress uses `tinyTriggers.v3`, leaving v1/v2 progress untouched. Revised early scenes start fresh in this edition. Audio starts after user interaction and can be muted. Hidden tabs pause animation/audio. Music and scene transitions are inherited from v2; loading prepares sound buffers and intentionally stops at 99% before disappearing with an unfinished tip.

## Verification

```sh
npm ci --prefix tests/tiny-triggers-v3
npm test --prefix tests/tiny-triggers-v3
```

Needs Python 3 and Chrome (`CHROME_PATH` overrides the executable). The test starts its own server; `GAME_URL` targets a published build instead. It exercises each new/revised scene with real pointer events, checks wrong-target rejection and ordered steps, replays all retained scene mechanics, checks the 83-scene collection, progression lock, saved progress, 99% transitions and real touch input. It also captures before/after contact sheets under `/tmp/tt3-sheet-*.png` for visual review. Per-scene test setup advances the saved-completion fixture; production progression remains locked.

## Publishing

The new card is in the Tiny Triggers section of `games.html`. Commit and push to `main`, verify GitHub Pages deployment and compare published assets with the tested files. Do not modify prior Tiny Triggers or Orbital Oddity versions.
