# Orbital Oddity Mobile 11 — The guardian's story

New version copied forward from v10; all previous releases remain untouched.

## Changes

- **Reachable pickups:** shards, hearts, both buffs and save portals use actual world-space hazard collision radii, with at least 1.15 units of additional approach clearance (1.5 for portals). A finite, distributed search replaces unsafe retry exhaustion. If crowded terrain offers no safe candidate, conflicting hazards are removed to form a small approach area. Rocket placement retains its own clearance check.
- **Harder spaceflight:** 2–3 objects per wave; intervals decrease from 0.56 to 0.31 seconds and speeds increase during approach. Asteroids, debris and satellites also cross laterally. Alternate waves include trajectories toward the player's location at spawn, with roughly two seconds of warning; no homing. Existing hull grace and flight checkpoints remain.
- **Spherical Earth:** a radius-18 globe with continents, not a flat island. Rover and basket remain on the surface, the camera follows local gravity, and the spider chases along the sphere and avoids the volcano. Towing ropes follow curved ground; rocks arc outward and laser sightlines are blocked by Earth's horizon. No Earth grid or axes helper. Five volcanic impacts still defeat the spider.
- **Distinct music:** original Web Audio themes for flight, quiet Earth exploration, epic boss combat, guardian defense, and retro city. Epic themes layer synthesized string ostinatos, brass, choir-like pads and drums. These are original compositions, not recordings or copies of Two Steps From Hell tracks.
- **Revised adult guardian:** rises (0–5s), falls onto her back (5–10s), then the angular chest pyramids expand (10–16s). Only after growth do the towers fire. The asteroid interval shrinks progressively from 1.15s to 0.12s. Epic defense music begins with firing; a slow fade to black spans 24–36s before the city appears.
- **Looping epilogue:** the selected rover drives through moving neon scenery. GAME OVER and the exact congratulations text remain visible from the first city frame. A 40-second repeating story shows a fully clothed child raised by wolves whose tails are oddity shards, then a separate adult guardian tableau. The childhood scene has no adult body features or transformation. The city never exits on a timer: P or the on-screen Menu button opens Keep watching / Explore more planets / New adventure.

## Controls / saves

WASD/arrows or joystick/tilt: drive and steer on planets, two-axis movement in flight. E or the action button: deliver/tow/detach. P/mobile Pause: pause gameplay; P/Menu opens the epilogue menu.

Orbital checkpoints are unchanged. The stage-only Earth mission key intentionally remains `orbitalOddityMobileEarthMissionV10` so existing flight/Earth/boss/delivery checkpoints can resume on the new sphere. Saves contain no flat-world positions. Winning clears the Earth checkpoint. Optional rocket remains available from level 50; growth starts at 31 and save portals appear on every level from 36.

## Checks

Serve repository root with `python3 -m http.server 4191 --bind 127.0.0.1`, then:

```sh
cd tests/orbital-oddity-mobile-v11
npm ci
npm test
```

Set `CHROME_PATH` if Chrome is not `/usr/bin/google-chrome-stable`. Set `GAME_URL` to test another hosted copy. Headless checks use SwiftShader; screenshots go to `/tmp/oo11-*.png`.

Coverage: pickup clearance across early/dense/late levels and forced fallback, dense flight traffic, spherical movement and local-up alignment, curved towing, laser collision/horizon occlusion, a complete chase/rock/eating boss simulation, checkpoint compatibility, fall-before-growth-before-firing, fade, looping city/constant ending text/story phases, keyboard/mobile exit menus, and nonzero audio output/theme transitions. Physical phone tilt, audio quality and real-device performance still require human playtesting.
