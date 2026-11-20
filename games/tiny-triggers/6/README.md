# Tiny Triggers — Volume 6

**Relax. Take your time. Make it worse.**

Volume 6 upgrades the 83 earlier scenes with individually authored illustrations, direct manipulation, intermediate animation and visible consequences. The 25 v5 additions remain: **108 scenes in 16 chapters**, with the dark layout, calm xylophone/triangle soundtrack, teasing hints, 99% loading screens and DVD near-corner animation.

## Collection and progress

Complete the journey normally or choose **Unlock collection** and enter the development code `pixelvibe`. Unlocking does not mark scenes complete. **Group by chapter** switches between chapters and a basic numbered list; the preference is remembered.

V6 writes only `tinyTriggers.v6` and its collection-preference keys. On the first visit it copies v5's valid completed prefix and collection preferences. With no v5 save, eligible v4 progress is copied as a fallback. Existing v6 values take priority. Earlier saves and releases are never changed. Progress and preferences are local to this browser/device.

## Scene ownership and verification

Each earlier scene has its own `upgrades/<id>.js` module and `tests/tiny-triggers-v6/upgrades/<id>.cjs` gesture test. Three workers handle separate queues one scene at a time, verifying mouse, touch, Retry and start/action/result screenshots before moving to the next individual assignment. The adapter replaces scenes in place, preserving identities and chapter order. See [UPGRADE_CONTRACT.md](UPGRADE_CONTRACT.md) and [UPGRADE_MANIFEST.json](UPGRADE_MANIFEST.json).

```sh
npm ci --prefix tests/tiny-triggers-v6
node tests/tiny-triggers-v6/upgrade.cjs banana
MOBILE=1 node tests/tiny-triggers-v6/upgrade.cjs banana
node tests/tiny-triggers-v6/migration.cjs
node tests/tiny-triggers-v6/collection.cjs
node tests/tiny-triggers-v6/audit.cjs
REQUIRE_COMPLETE=1 node tests/tiny-triggers-v6/shell.cjs
npm test --prefix tests/tiny-triggers-v6
```

Use `GAME_URL` to target the published page. Scene screenshots are written to `/tmp/tt6-upgrades` and `/tmp/tt6-scenes`. Per-scene verification notes are alongside the tests. Browser touch emulation is not physical-phone verification.

## Release policy

Every published iteration, including small UI changes, receives a new numbered folder and Games-page article. Published versions are immutable. This release uses `games/tiny-triggers/6/`; v1–v5 remain unchanged.
