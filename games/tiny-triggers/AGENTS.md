# Tiny Triggers release versioning

User requirement (2026-11-20): **create a new numbered version for every published iteration, including small UI fixes.** Never patch a previously published version in place. Copy the latest release into the next unused `games/tiny-triggers/<number>/` folder, make changes only there, and add a new Games-page article. Preserve earlier versions and their localStorage saves. If progress/preferences can safely carry forward, copy them to new version-specific keys without writing to the old keys. Multiple development edits before an iteration is published belong to that iteration; a later published update requires another number.

Current authorized work is v9: implement attachment items 135–200 with individual, concurrently developed scenes. Item 194 refines the existing biscuit/tea scene without duplication: 65 new scenes, 199 total. Preserve earlier identities, collection unlock/list toggle, and saves; do not modify published v1–v8.
