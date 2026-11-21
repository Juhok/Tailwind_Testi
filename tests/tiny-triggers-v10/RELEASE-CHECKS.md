# Tiny Triggers v10 verification

## Local release checks — 2026-11-21

Scope: 15 requested scene fixes, improved loading screens, and useful visual hint guidance for all **199 scenes in 35 chapters**. These are v10 checks, not inherited v9 verification claims.

- **Requested scene gestures: PASS.** All 15 requested scene fixes passed actual Chromium mouse and touch-emulation inputs, intermediate/final assertions and Retry. Includes the far-right shoe reproduction, inversion/upright sequence, naturally picked-up cucumber knife, both package-seal ends, road heading/junction checks and top-down parking. `verification.json` records current scene/test hashes, validated by `collect-proof.cjs`.
- **Visual review: PASS.** Each scene worker inspected initial/intermediate/completed captures. The parent independently inspected the overhead parking squeeze, straight milk stream, card artwork, mobile hint overlay and loading layout.
- **Hint UI: PASS.** First three clicks remain teasing; fourth shows useful text and visual guidance without marking progress. Actual mouse/touch input follows the banana guide through the overlay. Retry/switch reset the guide; collection pauses it. Reduced-motion behavior was inspected in code.
- **Guidance coverage: PASS, 199/199.** The combined `guide-drive.cjs` check follows only guidance descriptors through each actual scene interface, including wait states, holds, multi-part paths, and uninterrupted biscuit dip/lift. This accelerated semantic simulation is **not** 199 real-pointer tests. Thirteen extra partial-progress/arbitrary-order probes passed for upgraded scenes.
- **Preservation: PASS.** All 199 IDs/titles/order and 35 chapter definitions match v9. Apart from the 15 requested scene fixes, 130 scene files remain byte-identical and 54 change only read-only debug snapshot fields needed for accurate guides. The audit removes only those method bodies before comparing every other byte. Shared scene rendering/audio and assets remain unchanged; published v1–v9 are untouched.
- **Progress and saves: PASS.** Empty, partial, full, invalid and interrupted v9/v8/v7/v6/v5/v4 saves migrate to isolated v10 storage; old keys remain unchanged. Completed v9 retains completion and collection access. Existing v10 data takes priority.
- **Collection: PASS, desktop and touch.** All199 links, grouped/list toggle, remembered preference, unlock code, wrong-code rejection and unchanged completion state.
- **Loading: PASS.** Four successive shown logos approach four different corners. All12 tip paragraphs stay horizontally inside their boxes at320/390/600/1100px. Existing intentionally long paragraphs can exceed the small mobile loading area's vertical reading space; the requested horizontal overflow is fixed.
- **Game UI/audio: PASS.** Full shell checks cover sequential progression, saves, all199 links,35 chapters, canvas/mobile layout,99% progress and long stable tips. Xylophone PCM/master output are audible; mute reduces measured output below the existing threshold. Radio mute, collection pause and switch-to-silent-scene each measured zero output. Earbud stereo/voice/left-only/mute/Retry passed on both input modes after its read-only snapshot addition.
- **Revised-scene lifecycle: PASS.** Roadworks, shoe and parking preserve state while the collection is open, resume afterward, and cannot inherit delayed completion after Retry. All three passed mouse and touch. The shoe pause checkpoint is between gestures rather than a nonexistent timed animation.
- **Independent shared review: PASS.** Hint renderer only reads and draws, migration only writes v10 keys, script order/version/footer are correct, and lifecycle suppresses obsolete guides.

## Publication gate

The release is published only after the local checks, including current pause/Retry checks on the revised driving/shoe scenes, pass. After deployment, `live-files.py` compares every runtime file and the Games listing to the committed local build; live UI, migration, collection, hints, audio and representative gestures are checked again. The final release response reports those results; this file records the pre-publication verification.

Physical-phone testing remains **unverified**. Touch tests use Chromium emulation.
