# Tiny Triggers — Volume 4

**Relax. Take your time. Make it worse.**

## Scope

This edition refines the existing **83 crimes**, rather than adding more scenes. Work and review are organized into successive increments of **at most three scenes**. The original 77-idea English translation remains available in [SPECIFICATIONS.md](SPECIFICATIONS.md).

## Presentation and interaction

- Clearer object silhouettes, richer surface details, and more legible before/action/after states across the collection.
- Banana: pull continuous peel strips from the opposite end; remove the square-scrap interaction.
- Toilet paper: make front-versus-wall-side hanging unmistakable, keeping the roll on the correct axis.
- Chocolate: make the scored grid and the deliberately off-grid break visible.
- Cereal: smoothly tip the box and animate individual flakes falling into the bowl, matching the milk-pouring interaction.
- Burger: move the bottom bun directly to the top without an intermediate side drop; improve ingredients and presentation.
- Preserve the underlying jokes and interactive gestures while refining their visual communication.

## Chapters and progression

- Group all 83 scenes into 12 themed chapters, without duplicates.
- Use the chapter sequence during the first playthrough.
- Unlock the grouped replay collection only after all scenes are complete.
- Display chapter and journey positions while retaining stable internal scene IDs.
- Use a separate `tinyTriggers.v4` save. Earlier volumes and saved progress are unchanged.

## Loading screens

- Show a complete long paragraph immediately; remove the letter-by-letter reveal.
- Rotate among 12 intentionally over-explained tips whose actual advice is mundane, such as clicking with a mouse.
- Replace the “ALMOST” rectangle with a recognizable DVD VIDEO vector logo and near-corner bouncing.
- Keep the brief transition and the 99% maximum.

## Release checks

The test runner processes all 83 stable scene IDs in 28 sequential batches of no more than three, then runs the chapter/loading/mobile shell checks. It stops on the first failure. Contact sheets support visual review of the start, intermediate, and completed artwork.

A release is ready only after the complete run, contact-sheet review, and live deployment check. Mobile emulation does not establish physical-phone compatibility.
