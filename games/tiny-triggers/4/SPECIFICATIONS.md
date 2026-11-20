# Tiny Triggers — Volume 4 specification

**Relax. Take your time. Make it worse.**

Volume 4 refines the existing **83-scene collection**. It does not add another set of crimes or duplicate the original ideas. The work is split into increments of **at most three scenes**, with interaction checks and visual review before proceeding to the next increment.

## Original English source checklist

The Finnish attachment was translated and mapped in Volume 3. Its **78 entries contained 77 unique ideas**, including one repeated overflowing-coffee idea. That historical source translation and its stable scene numbers are preserved here:

**[Volume 3 — complete English translation and implementation checklist](../3/SPECIFICATIONS.md)**

The linked document records the original request, not the final wording of every Volume 4 interaction. In particular, the following refinements supersede the older banana, chocolate, burger, and loading-screen descriptions. Existing Volume 1–3 files and saves remain unchanged.

## Explicit Volume 4 refinements

- **Peel by peel:** the object must read clearly as a banana. Remove square peel scraps and peel continuous strips from the opposite end of the banana.
- **Against the wall:** keep the roll on the correct axis. The loose paper hangs over the front or down the wall side, not sideways.
- **Off the grid:** make the chocolate's scored squares and the deliberately off-grid break clear, so the player can see the joke in the resulting shape.
- **Milk comes first:** retain the visible milk pour and add a similarly legible cereal pour, including falling flakes and a smoothly tipped box.
- **Bottom goes on top:** the bottom bun moves directly to the top of the burger; no intermediate side placement is required. Improve the stack's visual detail, including its ingredients, pickles, and sauce.
- Apply the same clarity standard throughout the existing collection: recognizable objects, understandable gestures, visible action feedback, and an unmistakable final imperfection.

## Chapters and journey order

All 83 scenes belong to exactly one of these **12 chapters**, in this first-playthrough order:

1. **First little crimes** — 3 scenes.
2. **Breakfast, technically** — 7 scenes.
3. **Lunch disagreements** — 9 scenes.
4. **A questionable sweet tooth** — 4 scenes.
5. **Tea break trouble** — 5 scenes.
6. **Bathroom habits** — 5 scenes.
7. **Home, almost sweet home** — 11 scenes.
8. **Cleaning up, mostly** — 7 scenes.
9. **Dressed to mildly distress** — 8 scenes.
10. **Digital discomfort** — 8 scenes.
11. **Desk manners** — 10 scenes.
12. **Play nicely. Or don't.** — 6 scenes.

The first three are banana, toilet paper, and chocolate. Breakfast follows, beginning with cereal. Internal scene IDs remain the same as the source catalogue; the visible journey number follows the new chapter order. Consequently, a source-checklist number may differ from the number shown during the Volume 4 playthrough.

The first playthrough remains sequential. The collection stays locked until all 83 scenes have been completed; afterwards, the grouped menu and chapter navigation provide replay access. Volume 4 uses its own **`tinyTriggers.v4`** local save because its order differs from earlier volumes. Saved gaps cannot unlock later chapters.

## Loading screens

- Keep genuine between-scene preparation with a short interstitial and a displayed maximum of **99%**.
- Show the entire long tip paragraph immediately. Do not type it letter by letter or progressively reveal the text.
- Vary the paragraphs between transitions. Their underlying advice is intentionally obvious, such as using a mouse to click an item or holding a button while dragging.
- Keep the interstitial too brief to comfortably read the entire paragraph during ordinary play.
- Replace the old “ALMOST” rectangle with a recognizable **DVD VIDEO** illustration that bounces near, but does not reach, the corner.

## Retained design

The dark theme, tagline, mouse/touch interactions, calm triangle/xylophone music, first-three-click teasing hints, and post-completion scene replay remain part of the game. The subject is still harmless everyday imperfections, not the separate makeup-game brainstorm.

## Verification and release

[README.md](README.md) documents the runner and screenshot locations. The runner processes stable scene IDs `1–3`, `4–6`, and so on through `82–83`, then checks the chapter/loading/mobile shell. It stops on a failed child process. Before/after artwork must also be reviewed; passing a completion assertion does not by itself establish visual clarity.

This document records requirements and mappings, not a claim that every release check has already passed. A release requires the completed sequential run, visual review, and a live deployment check. Mobile browser emulation must not be described as physical-phone testing.
