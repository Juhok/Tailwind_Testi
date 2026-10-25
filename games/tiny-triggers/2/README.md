# Tiny Triggers — Volume 2

**Relax. Take your time. Make it worse.**

Dark, compact sequel to v1. Eighteen playable acts; the old unfinished-tip and near-miss-logo puzzles now appear during real scene transitions instead.

## Changes

- Dark high-contrast canvas and UI; persistent instructions moved out of view to keep the play area prominent. A screen-reader description remains available.
- Sequential first playthrough. The collection unlocks only after completing all 18 scenes. Independent `tinyTriggers.v2` progress preserves v1 saves.
- Three playful hint responses before actual assistance on click four.
- Free-direction pizza cuts with ellipse clipping and sampled portion-area checks to reject equal portions and duplicate cuts.
- Timed pouring: cartons tilt, a white stream emerges from the spout, vessels visibly fill, and a contents window drains. Hold about two seconds. The fridge task leaves one teaspoon.
- Larger burger hit regions prioritize the current top layer.
- Bottom-left puzzle gap, deliberately misaligned placement.
- Volume starts at 1; 0, 100, and all multiples of five are unavailable.
- Side-on cutaway drawer with a residual gap; perspective bed, pillows and cloth stretch with an animated opposite-corner pop; depth-based door pull/down and push/up.
- Every scene change uses a short transition while preparing the next music buffers. Progress caps at 99%; tips are interrupted mid-sentence. Every third destination includes a logo that misses screen corners.
- Physical-model-inspired wooden-bar samples: mallet transient, fast-decaying inharmonic overtones, prominent xylophone voice, and softer triangle accents. Eighteen different keys/pattern/rhythm combinations with eight varying phrases per theme.
- Touch button deduplication carried forward from v1; storage failures are nonfatal; hidden tabs pause progress and audio.

## Run and verify

Serve the repository with any static server, then open `games/tiny-triggers/2/`.

```sh
npm ci --prefix tests/tiny-triggers-v2
npm test --prefix tests/tiny-triggers-v2
```

Requires Python 3 and Chrome, overridable with `CHROME_PATH`. The test starts its own local server. `GAME_URL` can target a deployment. It drives all 18 scenes sequentially with real mouse events, checks unlocks/loading/hints/save restoration, exercises revised interactions and audio-buffer properties, and verifies touch input at a mobile viewport. Screenshots go to `/tmp/tt2-*.png`.

Publishing: add the v2 article in the existing Tiny Triggers section of `games.html`, commit/push `main`, check the GitHub Pages workflow and the live assets. Preserve `games/tiny-triggers/1/` and all Orbital Oddity versions.
