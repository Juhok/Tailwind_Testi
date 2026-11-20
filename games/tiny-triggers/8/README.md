# Tiny Triggers — Volume 8

**Relax. Take your time. Make it worse.**

Six reserved scenes join all 128 scenes from v7: **134 scenes in 23 chapters**. Every earlier scene retains its artwork, interaction, identity, and chapter position.

## Play and collection

Use mouse or touch to drag, turn, pour, shake, and otherwise inconvenience the objects. Complete the sequential journey, or choose **Unlock collection** and enter `pixelvibe` to replay any scene without marking the journey complete. **Group by chapter** switches between chapters and a numbered list. Retry resets the current scene; hints tease before giving practical guidance.

## New scenes

- The Suddenly Busy Crossing: approach a quiet crossing, then wait as traffic arrives from both directions.
- The Mystery Hole in the Lid: unpack and tilt a pudding cup toward the light to reveal its punctured foil and a hidden smear.
- The Mostly Empty Nugget Bag: open, pour a tiny handful, and shake out one final crumb.
- Perfect Parking, Impossible Exit: park carefully, discover the blocked door, and squeeze past the dirty car.
- The Fogging Windshield: watch visibility shrink, adjust the ventilation, and see the fog return.
- The Gap That Never Comes: prepare to join traffic, lose promising gaps, then watch the opposite driver take the big one.

Two new chapters are appended: **Right of wait** and **A bag of questions**. The collection order of every earlier scene is unchanged.

## Saves

V8 writes only `tinyTriggers.v8` and its collection preference keys. It copies the latest valid v7/v6/v5/v4 progress on first use and copies collection unlock/view preferences from v7/v6/v5. Completed earlier journeys resume at the first unplayed addition. Earlier saves are never written, invalid saves are skipped, and holes cannot bypass sequential progress. Saves remain local to the browser/device.

## Development and checks

Each new scene has its own `additions/<id>.js` and real-input test in `tests/tiny-triggers-v8/additions/<id>.cjs`. Three workers develop one scene at a time, including mouse, touch-emulation, and screenshot checks. No external assets are required. See [ADDITIONS.md](ADDITIONS.md) for the specifications. Development documentation is not linked from the game interface.

```sh
npm ci --prefix tests/tiny-triggers-v8
node tests/tiny-triggers-v8/additions.cjs
MOBILE=1 node tests/tiny-triggers-v8/additions.cjs
node tests/tiny-triggers-v8/retained.cjs
node tests/tiny-triggers-v8/migration.cjs
node tests/tiny-triggers-v8/collection.cjs
node tests/tiny-triggers-v8/lifecycle.cjs
REQUIRE_COMPLETE=1 node tests/tiny-triggers-v8/shell.cjs
node tests/tiny-triggers-v8/audit.cjs
```

`GAME_URL` targets the published page; `SITE_URL` targets a site root for the cross-version/file comparison. Physical-phone testing is not implied by touch emulation.

Every published update gets a new numbered folder. **V1–v7 remain unchanged.**
