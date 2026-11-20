# Tiny Triggers release versioning

User requirement (2026-11-20): **create a new numbered version for every published iteration, including small UI fixes.** Never patch a previously published version in place. Copy the latest release into the next unused `games/tiny-triggers/<number>/` folder, make changes only there, and add a new Games-page article. Preserve earlier versions and their localStorage saves. If progress/preferences can safely carry forward, copy them to new version-specific keys without writing to the old keys. Multiple development edits before an iteration is published belong to that iteration; a later published update requires another number.

Current authorized work is v6: bring the 83 older scenes up to the bespoke artwork/animation quality of v5 additions, with scene-specific agent assignments. Keep 108 scenes and the collection unlock/list toggle. Do not modify published v1–v5.
