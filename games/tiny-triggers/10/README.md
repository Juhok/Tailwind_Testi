# Tiny Triggers — Volume 10

**Relax. Take your time. Make it worse.**

Artwork, interaction and helpful-hint improvements across the same **199 scenes in 35 chapters**. This release adds no duplicate scenes and keeps every v9 identity and collection position.

## Play

Use mouse or touch. The first three requests for a gentle hint still tease; the fourth reveals the useful text plus a pulsing target, gesture path and pointer. Guidance follows the scene's current step, including held gestures and wait periods. It never performs an action for the player. Retry and switching scenes clear the guidance. Reduced-motion preference uses a static pointer.

Enter `pixelvibe` under **Unlock collection** to open scene selection without changing completion. **Group by chapter** toggles between chapters and a numbered list.

## Changes

See `IMPROVEMENTS.json` and `CHANGELOG.md` for the complete request mapping: 15 scene fixes, varying DVD corners, contained loading tips, and step-aware visual hints for all 199 scenes. Historical scene specifications and manifests are retained as reference; they are not a list of new v10 additions.

## Saves

Only `tinyTriggers.v10` and its preference keys are written. The latest valid v9/v8/v7/v6/v5/v4 save is copied on first visit; existing v10 data takes priority. V9 progress and chapter order are unchanged, including completed saves. Older versions with fewer scenes continue into their first unseen scene. All old saves and published v1–v9 files remain untouched. Storage remains local to the browser/device.

## Development and verification

Three concurrent workers handled independent scene queues. Artwork remains Canvas 2D; existing audio uses the shared Web Audio/mute bus. Guidance catalogs read scene snapshots; read-only target fields were added where counts alone could not describe arbitrary-order progress.

Tests are in `tests/tiny-triggers-v10`. `RELEASE-CHECKS.md` distinguishes real mouse/touch-emulation tests from fast semantic guidance checks. `verification.json` ties all 15 requested scene fixes to their tested source/test hashes. `audit.cjs` confirms other scene behavior/artwork is unchanged, allowing only read-only snapshot fields.

```sh
npm ci --prefix tests/tiny-triggers-v10
node tests/tiny-triggers-v10/audit.cjs
node tests/tiny-triggers-v10/retained.cjs
node tests/tiny-triggers-v10/migration.cjs
node tests/tiny-triggers-v10/collection.cjs
node tests/tiny-triggers-v10/hints-ui.cjs
node tests/tiny-triggers-v10/guide-drive.cjs
node tests/tiny-triggers-v10/shell.cjs
```

`GAME_URL` selects the published page; `SITE_URL` selects a site root for the retained-version comparison. Physical-phone behavior requires device testing; Chromium touch emulation is not a substitute.
