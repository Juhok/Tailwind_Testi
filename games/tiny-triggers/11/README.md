# Tiny Triggers · Volume 11

Relax. Take your time. Make it worse.

A holiday journey through **199 interactive scenes, 35 chapters, and seven worlds**.

## Play

On the first v11 visit, the banana scene introduces mouse/touch dragging using the existing Gentle Hint text and pointer. The introduction is recorded only when displayed, and does not repeat on Retry or reload. The normal three teasing hints and fourth useful hint remain unchanged.

Complete the banana and choose **Continue your journey**. The **Holiday map** is always available outside loading transitions. Select a scene or waypoint, then use the travel button. Numbered scenes open gameplay; junctions split into two roads; either completed branch opens the shared waypoint. The other road stays available for later exploration.

Five chapters form each world. Crossing the passage at the map edge reveals the next world. At the end of the seventh world, the Quiet Shore has a beach temple and a gently swinging hammock. Reaching it does not require completing both branches. The retreat is deliberately peaceful, with no final interruption.

### Worlds

1. Trigger Forest
2. Trigger Rainforest
3. Clatter Highlands
4. Neon Crossroads
5. Detour Dunes
6. Restless Coast
7. Last Straw Lagoon, leading to the Quiet Shore

## Saves and collection

- `tinyTriggers.v11` stores completed scene IDs, last scene, visited waypoints/passages, traveler position, and selected world.
- Branching completion is intentionally non-contiguous: no linear-prefix normalization.
- Existing v10–v4 progress is copied from the newest valid source; older storage is never modified.
- The one-time introduction uses `tinyTriggers.v11.tutorialSeen`.
- Collection unlock and grouping preferences carry forward to version-specific keys.
- Completing all 199 scenes unlocks the complete collection. The existing `pixelvibe` code still enables collection replay without marking scenes completed.
- Entering a scene through the collection does not teleport the traveler through locked map passages.

## Implementation

- `journey.js`: pure directed branching graph and save-independent reachability.
- `world-map.js` / `world-map.css`: original SVG pixel scenery, accessible map buttons, traveler animation, responsive controls, reduced-motion support.
- `journey-game.js` / `journey.css`: game integration, modal lifecycle, saved traversal and holiday finale.
- `tutorial.js`: nonblocking first-use hint presentation.
- Every existing scene, illustration, audio asset and hint descriptor is unchanged from v10.

No build step or external runtime dependency. Serve the repository with an HTTP server and open `games/tiny-triggers/11/`.

Tests live in `tests/tiny-triggers-v11`. `npm test` checks the model, real introductory gestures, map navigation, branching saves, migration, collection views, and audio pause/mute lifecycle. `npm run test:guides` checks all 199 hint descriptors through the scene interfaces; it is not a substitute for physical-phone testing.
