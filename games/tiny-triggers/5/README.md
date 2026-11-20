# Tiny Triggers — Volume 5

**Relax. Take your time. Make it worse.**

25 new interactive misfortunes extend the preserved 83 scenes to **108 scenes in 16 chapters**. The additions use isolated scene modules with bespoke illustrations, gestures, staged animation, and persistent final consequences. The dark layout, calm scene-specific xylophone/triangle music, teasing hints, sequential journey, 99% loading screens, complete mundane tip paragraphs, and DVD near-corner animation remain.

## Progress

Volume 5 writes only `tinyTriggers.v5`. On its first visit, it copies the valid completed prefix of `tinyTriggers.v4` if available. Earlier saves are never modified. The original 83-scene chapter order is unchanged. Players who finished v4 begin at the first new scene; collection replay unlocks only after all 108 scenes. Existing v5 progress always takes priority. Progress is browser/device-local.

## Additions

See [SPECIFICATIONS.md](SPECIFICATIONS.md) for all 25 additions and their distinctions from related existing scenes. The fake armor subscription and cookie preference trap are canvas fiction: no checkout, real cookie consent, payment request, or account is involved. The one-earbud scene uses stereo audio and a locally generated robotic “Battery low” announcement, with an equally visible battery failure for muted play. Audio asset provenance is in [assets/README.md](assets/README.md).

## Development and verification

Each addition is assigned independently to a native sub-agent; up to three scene workers run concurrently while the lead handles integration. Scene-owned JavaScript and gesture-test files prevent shared-file edit collisions. The shared contract is [SCENE_CONTRACT.md](SCENE_CONTRACT.md).

```sh
npm ci --prefix tests/tiny-triggers-v5
npm test --prefix tests/tiny-triggers-v5
node tests/tiny-triggers-v5/scene.cjs curtain-clip
MOBILE=1 node tests/tiny-triggers-v5/scene.cjs curtain-clip
```

The full suite covers the retained 83 scenes, each addition's real mouse gestures and consequences, Retry, progression, collection, saves, audio/mute, loading screens, and touch-menu regression. Each new scene also has a real CDP-touch run. `scene.cjs` accepts multiple IDs; `GAME_URL` targets the published page. Screenshots go to `/tmp/tt5-scenes`; retained scene batch sheets use `/tmp/tt5-batch-*.png`. Chrome defaults to `/usr/bin/google-chrome-stable`.

Browser emulation is not a substitute for physical-phone verification. Test outcomes are recorded from actual runs, not inferred from this document.

## Release

The new card lives in the Tiny Triggers section of `games.html`. Publish via the established repository main-branch GitHub Pages pipeline, verify the deployment and published asset hashes, then exercise the live page. All earlier Tiny Triggers and Orbital Oddity files remain unchanged.

Published path: `games/tiny-triggers/5/`.
