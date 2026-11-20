# Tiny Triggers release versioning

User requirement (2026-11-20): **create a new numbered version for every published iteration, including small UI fixes.** Never patch a previously published version in place. Copy the latest release into the next unused `games/tiny-triggers/<number>/` folder, make changes only there, and add a new Games-page article. Preserve earlier versions and their localStorage saves. If progress/preferences can safely carry forward, copy them to new version-specific keys without writing to the old keys. Multiple development edits before an iteration is published belong to that iteration; a later published update requires another number.

Current authorized work is v7: add attachment items 1–20 as individual, concurrently developed scenes. Reserve items 21–26 for the following update. Preserve all 108 previous scenes, the collection unlock/list toggle, and earlier saves. Do not modify published v1–v6.
