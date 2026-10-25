# Orbital Oddity Mobile 10 — Earthbound

Standalone browser release. Versions 1–9 are unchanged. Open through an HTTP server (the custom GLB loader requires HTTP and its existing Three.js CDN modules).

## Orbit changes

- Radius is `5 + max(0, level - 30) * 0.12`: growth on every level starting at 31.
- Travel speed stays constant in world units; the level timer grows with radius. Terrain collision and pickup angles scale to preserve physical sizes. Satellite paths and moon orbits follow the larger world.
- Save portals appear at the existing five-level milestones and on **every level from 36 onward**.
- A large optional rocket appears on **every level from 50 onward**, in a cleared area. Approach it to begin the Earth mission, or ignore it and continue normal progression.

## Five acts

1. **The rocket:** optional launch pickup, preserving endless orbital play.
2. **Earthbound:** 55-second two-axis flight through asteroids, satellites and wreckage. Earth visibly approaches. Five hull points; collisions grant brief damage grace.
3. **Earthfall:** rocket separation, expanding parachute, descent and touchdown. Skippable.
4. **The shard-eater:** Earth island arena. Deliver a cache of 14 oddity shards to the gold-beacon basket. Tow/detach it to lure the spider. The spider follows and eats shards, and telegraphs lasers before firing. The supervolcano throws rocks toward the nearby basket: orange rings show their landing area. **Five actual rock impacts** destroy the spider. Remaining shards must then be towed to the cyan launchpad.
5. **The guardian:** a stylized adult volcanic guardian rises, absorbs the shards into angular glowing chest armor, sinks the supervolcano and raises twin asteroid-defense pyramids. The ending transitions to a pixelated neon night city with an original synthesized soundtrack and the exact requested congratulations text.

The linked YouTube video was not retrievable during implementation; the final scene follows the written retro-night-city direction, not a verified recreation of the video. All new visuals are procedural and all new music is synthesized locally; no video/audio assets were copied.

## Controls and recovery

- Orbit/Earth: W/S or up/down to drive, A/D or left/right to steer; existing joystick and tilt supported.
- Spaceflight: the same inputs move horizontally and vertically.
- Earth interactions: **E** or the on-screen **Deliver / Tow / Detach** button.
- **P**, mobile Pause, or Resume button pauses/resumes. Backgrounding the tab pauses the Earth mission.
- Mission checkpoints at flight, Earth arrival, boss start and final delivery. Resume from either the start or game-over menu. Losing all hull or all shards offers checkpoint retry.
- Mission save key: `orbitalOddityMobileEarthMissionV10`. Existing orbital saves remain compatible and separate. Checkpoints restart the act, not the exact frame. Winning clears the mission checkpoint and permits further orbital exploration.

## Verification

From repository root, serve with `python3 -m http.server 4190 --bind 127.0.0.1`. In a second terminal:

```sh
cd tests/orbital-oddity-mobile-v10
npm ci
npm test
```

Chrome defaults to `/usr/bin/google-chrome-stable`; override with `CHROME_PATH`. Override `GAME_URL` to test another served build. Playwright launches Chrome with SwiftShader for headless WebGL. Screenshots go to `/tmp/oo10-*.png`.

Checks cover level boundaries, rocket pickup, keyboard flight input, landing, basket towing, shard eating, laser damage, five volcanic rock hits, reload recovery, exact ending text, restarting orbit, mobile layout/pause, and a simulated complete boss encounter with normal chase/rock/eating logic. Browser mobile emulation is not a substitute for testing tilt/audio/performance on physical phones.

Deployment follows the existing workflow: commit the new version and `games.html`, push `main`, then verify the GitHub Pages release.
