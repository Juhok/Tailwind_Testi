# Tiny Triggers — Volume 4

**Relax. Take your time. Make it worse.**

A visual and interaction refinement of the existing **83-scene** collection. There are no additional or duplicate crimes in this edition. Scenes are organized into **12 themed chapters**, beginning with three familiar everyday objects before moving through breakfast, lunch, sweets, tea, bathroom habits, home, cleaning, clothing, digital annoyances, the desk, and games.

Volume 4 keeps the dark interface, mouse/touch gestures, calm xylophone and triangle music, teasing hints, and collection unlock after completing the full journey. The first three hint requests tease; later requests explain the action. The tagline is unchanged.

## What changes in this edition

- More recognizable illustrated objects, clearer action cues, and visible intermediate and final results.
- Continuous banana peeling from the opposite end, rather than loose square scraps.
- A toilet roll with its paper hanging in front or behind it, never from the side.
- A clearer off-grid chocolate break that visibly ignores the scored squares.
- Animated cereal falling from a smoothly tipped box into the milk-filled bowl.
- A richer burger whose bottom bun can go directly onto the top of the stack.
- A guided chapter order and a grouped, navigable replay collection.
- Entire long loading-tip paragraphs appear immediately. Their advice is deliberately mundane; the short transition ends before normal reading can finish. There is no typewriter reveal.
- A recognizable bouncing DVD VIDEO illustration replaces the old “ALMOST” box. It comes near the corner without hitting it. Loading still stops at 99%.

See [CHANGELOG.md](CHANGELOG.md) for the release summary. [SPECIFICATIONS.md](SPECIFICATIONS.md) links the preserved Volume 3 English checklist and documents the Volume 4 refinements, which supersede the older banana, chocolate, burger, and presentation details.

## Progress and versions

Progress is stored locally under **`tinyTriggers.v4`**. The chapter-based first playthrough starts independently of earlier volumes because its order has changed. Numeric scene identities remain stable internally; chapter order determines the next playable scene and the number displayed to players. Invalid saves with gaps do not unlock later chapters.

The collection stays locked until all 83 scenes are complete. Afterwards, its 12 chapter groups provide replay access to every scene. Volume 1, 2, and 3 files and their saves remain untouched. Audio begins after a user gesture and can be muted; hidden tabs pause animation/audio.

## Files

- `catalog.js`: the English scene catalogue and task definitions.
- `atelier.js`: refined illustration and presentation support.
- `workshop.js`: shared physical gestures, ordered actions, and visual state changes.
- `game.js`: retained scene systems, progression, controls, music, and transitions.
- `chapters.js`: all 83 stable scene IDs grouped exactly once, guided play order, save validation, collection rendering, full loading tips, and the DVD vector illustration.
- `index.html`, `style.css`, `chapters.css`: the dark, compact game interface and responsive chapter/loading presentation.

## Verification workflow

Requirements: Node.js 20 or newer, Python 3, and Chrome at `/usr/bin/google-chrome-stable`. Install the checked-in Playwright dependency, then run:

```sh
npm ci --prefix tests/tiny-triggers-v4
npm test --prefix tests/tiny-triggers-v4
```

`npm test` executes **28 sequential batches**, from scenes `1 2 3` through `82 83`, and then the shell checks. **At most three scenes are processed per batch.** A failed child process stops the runner before any later batch begins. These batch numbers refer to stable catalogue IDs, not the themed play-order numbers displayed in the game.

To inspect the plan or run a specific increment:

```sh
npm run test:list --prefix tests/tiny-triggers-v4
npm run test:batch --prefix tests/tiny-triggers-v4 -- 1 2 3
npm run test:shell --prefix tests/tiny-triggers-v4
```

The batch harness uses real mouse gestures, verifies ordered steps and wrong-target rejection where applicable, and checks scene completion and browser errors. It captures **start / intermediate / completed** artwork as `/tmp/tt4-batch-<first-scene>.png` and records batch results under `/tmp/tt4-checks/`. Review each contact sheet before moving to the next refinement increment; a successful gesture assertion alone does not prove visual clarity.

The shell harness checks chapter coverage/order, sequential locking, save restoration, all 83 collection links, complete unchanging tip text, the 99% cap, DVD bounds, and mobile-emulation controls/layout. Screenshots include `/tmp/tt4-shell-collection-desktop.png` and `/tmp/tt4-shell-loading-mobile.png`. Per-scene test fixtures unlock scenes for targeted testing; production progression remains locked.

Batch tests serve the repository on local port **4204**; shell tests use **4205**. The shell harness also accepts `GAME_URL` for a published-build check and `CHROME_PATH` for another Chrome executable. The batch harness currently uses its fixed local URL and Chrome path.

Verification results must come from the completed run and visual review, not from this documentation. Browser touch emulation is **not physical-phone testing**.

## Publishing

The Volume 4 card is in the existing Tiny Triggers section of `games.html`. After the sequential checks and artwork review, commit the new version, push to `main`, verify the GitHub Pages deployment, compare published assets with the tested files, and perform a live-browser check.

Published path: `games/tiny-triggers/4/`. Do not modify earlier Tiny Triggers or Orbital Oddity versions.
