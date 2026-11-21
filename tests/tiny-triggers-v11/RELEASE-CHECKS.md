# Tiny Triggers v11 release checks

## Scope

- New release folder only; v10 and older game folders remain unchanged.
- 199 original scenes /35 chapters carried into seven branching worlds.
- New tutorial, graph, map renderer, save-aware navigation and peaceful retreat.
- No original scene, audio asset or guidance descriptor modified.

## Local checks

- `journey-model.cjs`: actual catalogue uniqueness; both routes; optional backtracking; explicit passage gates; forged visits rejected; no deadlocks under left/right/mixed route policies; sparse/full migration; no auto-arrival; mobile target spacing.
- `tutorial.cjs --browser`: desktop and touch first-use introduction; actual banana drag through guidance; one-time marker; Retry/reload/switch behavior; original three teasing hints unchanged; prior save unaffected.
- `journey-ui.cjs`: actual mouse/touch banana and map-button interaction; unavailable scenes/passages blocked; right-branch sparse completion retained through reload; seven-world navigation and explicit passage visits; retreat and optional replay. Full journey uses simulated scene completion to isolate navigation; it is not a claim of a fresh full gesture playthrough.
- `migration.cjs`: v10 empty/partial/full/sparse saves; exact preservation of prior save and preferences; own-v11 priority; corrupt data recovery; 199-scene grouped/list collection; map pauses scene and AudioContext clocks; close resumes; visibility cannot resume behind map; measured mute/scene-switch silence.
- `guide-drive.cjs`:199/199 semantic hint descriptor scenarios passed, through scene interfaces (not physical gesture evidence).
- Visual inspection: desktop forest map, mobile branching map and tutorial, final beach/hammock retreat. Reduced motion is supported.

## Deployment

`live-files.py` compares every published runtime file and Games-page listing byte-for-byte with the local release. Live tutorial, navigation, migration and collection checks are run after the Pages deployment.

Physical-phone testing is not claimed; touch checks use Chromium device emulation.
