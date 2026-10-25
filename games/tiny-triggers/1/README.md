# Tiny Triggers — Volume 1

**Relax. Take your time. Make it worse.**

Standalone Canvas 2D game: 20 miniature drag-and-drop scenes, original code-drawn pixel-style artwork, and procedural Web Audio xylophone/triangle music. No runtime dependencies, downloads, analytics, or external assets.

## Playing

Open `index.html` through any static server. Click/touch, hold, drag, release. Music starts after the first interaction; Sound toggles it. Retry resets only the current scene. Hints explain each gesture. Scene collection allows freely selecting/replaying every scene. Completed scenes and current scene are saved under `tinyTriggers.v1` in localStorage; storage failures do not prevent play.

## Scenes

1. Banana peeled from the opposite end, three separate strips
2. Toilet paper flipped and hung under
3. Whole four-finger chocolate bar bitten without separating
4. Unequal pizza cuts
5. Milk before cereal
6. Burger eaten layer by layer
7. One bite from each doughnut
8. A teaspoon of milk returned to the fridge
9. One crooked picture
10. One rotated tile
11. Loading stopped at 99%
12. Countdown 3, 2, 2, 1
13. Almost-fitting puzzle piece
14. Volume 49 or 51, never 50
15. Almost-closed drawer
16. Fitted sheet's opposite corner pops off
17. Three “one last thing” speech bubbles
18. Pulling a PUSH door's inviting handle, then pushing
19. Covering an unfinished loading tip
20. Bouncing logo narrowly missing the corner

## Checks and publishing

From the repository root:

```sh
npm ci --prefix tests/tiny-triggers-v1
npm test --prefix tests/tiny-triggers-v1
```

Requires Python 3 and Chrome (`CHROME_PATH` overrides the default). The test starts its own local server and drives real mouse/touch events through all scenes. `GAME_URL` can target the published build.

Versioned path: `games/tiny-triggers/1/`. Listed in its own section/article on `games.html`. Publish by committing and pushing to `main`, then verify GitHub Pages. Preserve v1 when making v2, just as with Orbital Oddity Mobile. This is a GitHub Pages release, not an itch.io upload.
