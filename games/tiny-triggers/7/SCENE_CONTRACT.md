> Inherited v5 scene API reference. V7 assignments use [ADDITION_CONTRACT.md](ADDITION_CONTRACT.md). The original 25 scenes remain unchanged.

# Retained-scene API contract (Volume 6)

This describes the shared API inherited from Volume 5. For the 83 replacements, follow `UPGRADE_CONTRACT.md` and use `TinyV6.register`; the 25 files in `scenes/` are retained unchanged.

Each worker owns exactly one `scenes/<id>.js` and `tests/tiny-triggers-v6/scenes/<id>.cjs`. Do not edit shared files or other scenes. Use no external assets, libraries, requests, or timers. Canvas artwork is code-native. Read the requested spec in your task. Retain all requested narrative beats, with recognizable objects, meaningful gestures, intermediate animation, and a visible final result. Mouse and touch use the same logical 480×270 canvas coordinates. Aim for clear, attractive illustrated/pixel-influenced objects on a dark background, not text-heavy cards. Screen regions must be generous enough for touch.

Register a self-contained IIFE:

```js
TinyV5.register({
 id: 'unique-id', title: 'The Title', chapter: 'home',
 description: 'Short player instruction.', hint: 'Concrete full gesture guidance.',
 verdict: 'Short funny final line.',
 create(api) {
   const {ctx} = api;
   // Local state only; no shared state mutation except api.done()/say().
   return {
     draw() {}, // full 480×270 frame; invoked inside ctx.save/restore
     down(p) {}, move(p) {}, up(p) {}, cancel() {},
     update(dt) {}, // active time only, seconds, <= .05
     debug() { return {phase: 0}; } // expose useful behavioral facts
   };
 }
});
```

`api` provides `ctx`, `done()` (marks completed; call only after final visible consequence), `say(text)` (short footer), `tone(freq=660,duration=.12,volume=.025,pan=0)` (goes through master mute, optional stereo pan), `rect(x,y,w,h,color)`, `round(x,y,w,h,r,color,stroke?)`, `ellipse(x,y,rx,ry,color)`, `line(x1,y1,x2,y2,color,width=2)`, `poly(points,color)`, `text(string,x,y,size=11,color='#edf2ec',align='center')`, `bg(room='desk')` (dark wall and tabletop; room may be kitchen,bath,bedroom,desk), `clamp(n,a,b)`, `hit(p,x,y,w,h)` (center coordinates), `near(p,x,y,r)`. Use ctx directly for more detailed art, clipping, gradients, curves, rotation. All helper functions available at create time. `p={x,y}`. No DOM inputs: fictional cookies/paywalls stay entirely inside canvas, never real billing/cookies. Earbud sound must mute properly and use stereo if appropriate. Keep visual feedback for sound-off players. Don't call helper globals from existing game directly; use api.

Draw continues after done, but user input stops. Leave final art legible; do not reset until actual Retry. Avoid relying on font symbols/emoji to draw objects. Do not silently auto-complete interactive steps. For repeated-enemy task keep 50 real enemies but allow hold-to-fight and clear counter so it isn't 50 tedious clicks.

## Verification file

CommonJS exports `async function(page, io, assert)`. The runner opens your scene in a real browser with preceding progression unlocked. `io.click(x,y)`, `io.drag([x,y],[x,y],{steps:16,hold:0})` (hold seconds at target), `io.move(x,y)`, `io.down(x,y)`, `io.up()`, `io.wait(ms)`, `io.state()` (your debug object), `io.until(predicate)` where predicate runs IN PAGE against your `workshop.instance.debug()` result. You can use page mouse etc. `io.shot('name')` saves a canvas screenshot. Assert wrong/out-of-order gestures don't finish, intermediate state shows requested effect, eventual finished true, and Retry resets. Do not force state/phase/finished/win, and do not substitute synthetic JS event dispatch for real browser input. You may await animation state. Tests should represent meaningful user actions and outcomes.

Run `node tests/tiny-triggers-v6/scene.cjs <id>` once root provides harness. If unavailable, syntax check and report exact manual gestures in final result. Report file paths, interaction sequence, verification, any concerns. Do not commit/push. Shared workspace: never undo colleagues' changes.

## Earbud-only audio

Set `exclusiveAudio: true` on the scene definition to suppress the usual soundtrack and win chime. `api.prepareVoice()` preloads the local robot announcement without starting audio. `api.voice(pan=1)` returns a Promise<boolean> and plays “Battery low” (1.25 seconds) through the normal master mute bus on the selected side; false means muted/unavailable. Keep the visible warning even with sound off. `api.tone(...,pan)` can play the actual two-channel melody then only the surviving channel. No scene network/DOM/speech synthesis calls are needed.
