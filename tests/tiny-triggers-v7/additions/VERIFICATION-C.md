# V7 worker C verification

Each scene was implemented and verified before starting the next. No shared runtime or older-version files were edited.

- `offline-online`: laptop Play Offline, spinner, exact connection error and fictional Retry/Quit. Mouse/touch passes include wrong input, drag-away cancellation, spinner lockout, completion, Retry reset. Reviewed final error screenshot.
- `wrong-audio`: fit headphones, Launch, animated but silent game, AUDIO settings reveal unused monitor selected. Mouse/touch passes include wrong placement/cancel, real master-output measurement (<0.0001 peak), reveal and Retry. `exclusiveAudio: true`; scene never schedules audio, and no DOM/network/audio-device changes. Reviewed final routing screenshot.
- `update-shutdown`: close saved document, power menu, Shut Down, updating gears/progress, stuck at 99%. Mouse/touch passes include out-of-order/cancel, intermediate progress, persistent 99 while gear angle increases, Retry. Reviewed final screenshot.
- `light-switch`: flip, brief flash, hold intermediate rocker position for illumination, release extinguishes. Mouse/touch passes include wrong gesture, incorrect position, intermediate brightness, no completion while held, final dark state, Retry. Reviewed lit and dark screenshots.
- `travel-plug`: drag charger from case to incompatible wall socket, rotate, try three distinct orientations. Mouse/touch passes include wrong drop/repeated orientation rejection, three unsuccessful attempts, phone still at 1%, Retry. Reviewed final screenshot.
- `wiper-setting`: pull stalk inward, front washer spray, stationary front blades, scraping rear blade visible in dry rearview mirror. Mouse/touch passes include wrong direction/partial-pull cancellation, visible spray, rear cycles, dry rear glass, Retry. Reviewed jet and persistent wet-streak final screenshots. Squeaks use short master-bus tones only and stop at completion.

Screenshots: `/tmp/tt7-additions/<id>-mouse-*.png` and `<id>-touch-*.png`.

- Reassigned `afk-teammate`: start five-player match, drag captain to rally flag; four characters move out and match clock fast-forwards to exactly 15:00 while fifth remains at its identical original coordinate. Mouse/touch passes include premature rally, cancelled Start, wrong rally drop, animated departure, intermediate clock, unchanged AFK position, final 4/5 objective count, Retry. Reviewed lobby and final screenshots.
