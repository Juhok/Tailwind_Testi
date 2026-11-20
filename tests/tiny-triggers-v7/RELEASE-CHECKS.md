# V7 local release verification

- All 20 additions passed actual mouse and CDP touch-emulation input, negative/partial gestures where applicable, and Retry. `verification.json` pins each scene and test to the verified SHA-256.
- Root combined-build mouse checks passed for all 20 additions; final screenshots were reviewed alongside each worker's intermediate-state review.
- Independent completeness review found no blockers against attachment items 1–20. Items 21–26 are reserved, not registered.
- `audit.cjs` passed runtime JavaScript syntax, exact preservation of the 108 retained scene modules and assets, shared artwork/audio code, current-file receipts, and no published v1–v6 changes.
- `retained.cjs` passed the earlier 108 scene identities, ordering, first 16 chapters and save continuation. Representative retained banana, cereal, burger, earbud, cookie and controller gesture checks passed, including the earbud's measured stereo/mute behavior.
- `migration.cjs` and `collection.cjs` passed independently: v6/v5/v4 migration, precedence, invalid/holey saves, read-only previous storage, collection unlock, 128 links, 21 chapters, grouped/list parity and remembered preferences on desktop/touch.
- Independent real-UI lifecycle checks passed: collection pauses/resumes animation; Retry prevents stale completion; paused audio decays to silence; returning from an exclusive-audio addition restores earlier scene audio.
- `REQUIRE_COMPLETE=1 node tests/tiny-triggers-v7/shell.cjs` passed all 128 collection routes, sequential progression, restored saves, 99% loading, immediate long tips, DVD animation, mobile layout and measured master audio/mute. Local output peak was 0.05553; muted output peak was 0.000000372.
- Final visual review corrected the inherited footer volume label to 07 before publication.

Physical-phone testing is not verified. Live deployment verification is performed after publication with `live-files.py`, `shell.cjs`, and representative real-input scene checks; those results are reported separately rather than preclaimed here.
