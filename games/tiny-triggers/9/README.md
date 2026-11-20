# Tiny Triggers — Volume 9

**Relax. Take your time. Make it worse.**

65 new scenes and one refined existing scene cover attachment items 135–200: **199 scenes in 35 chapters**. Item 194 reuses the biscuit-in-tea scene (stable ID `cookie`), now requiring a lift after soaking before the softened half breaks and sinks. All earlier identities and chapter positions remain unchanged.

## Play

Use mouse or touch to drag, turn, press, hold, and inconvenience the objects. Follow the sequential journey or enter `pixelvibe` under **Unlock collection**. **Group by chapter** toggles between themed chapters and a simple numbered list. Retry resets the current scene. Hints tease before giving practical help. No checklist or development documentation appears in the play interface.

## Saves

Only `tinyTriggers.v9` and its collection preference keys are written. On first visit, the latest valid v8/v7/v6/v5/v4 save is copied; preferences migrate from v8 through v5. Full earlier saves continue at the first new scene, without marking new scenes complete. Prior saves are never changed. Browser/device storage remains local.

## Development

Three workers handle independent scene files and real-input gesture checks, one scene at a time. The parent integrates chapters, migration, lifecycle checks, release metadata and the existing biscuit refinement. Artwork is code-native Canvas 2D; sound uses the shared mute-controlled Web Audio path. No external scene assets are needed.

- `REQUESTED_ADDITIONS.json`: complete requested-spec mapping, including the existing-scene overlap.
- `ADDITIONS.md`: readable scene briefs.
- `tests/tiny-triggers-v9`: gesture, lifecycle, persistence, collection, audio and publication checks.
- `tests/tiny-triggers-v9/RELEASE-CHECKS.md`: actual verification status.

```sh
npm ci --prefix tests/tiny-triggers-v9
node tests/tiny-triggers-v9/additions.cjs
MOBILE=1 node tests/tiny-triggers-v9/additions.cjs
node tests/tiny-triggers-v9/upgrade.cjs cookie
MOBILE=1 node tests/tiny-triggers-v9/upgrade.cjs cookie
node tests/tiny-triggers-v9/retained.cjs
node tests/tiny-triggers-v9/migration.cjs
node tests/tiny-triggers-v9/collection.cjs
node tests/tiny-triggers-v9/lifecycle.cjs
node tests/tiny-triggers-v9/audio.cjs
node tests/tiny-triggers-v9/shell.cjs
node tests/tiny-triggers-v9/collect-proof.cjs
node tests/tiny-triggers-v9/audit.cjs
```

`GAME_URL` selects the published page; `SITE_URL` selects a site root for comparison. Touch emulation does not establish physical-phone testing. Each published update gets a new number; **v1–v8 remain unchanged**.
