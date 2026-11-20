# V7 worker B verification

Each scene was implemented and verified before advancing to the next assignment. Current-file mouse and touch runs passed, including negative gestures, requested intermediate states, completion and Retry. Canvas screenshots were inspected using view_image.

Commands: `node tests/tiny-triggers-v7/addition.cjs <id>` and `MOBILE=1 node tests/tiny-triggers-v7/addition.cjs <id>`.

Physical phone input is not verified. No shared files, prior versions, or other scenes were edited.

- `stick-drift`: SHA-256 `b21e697a09770c56ac2a30f1af5c250d1acef393a1cb02e154729360027b8c01`; screenshots `/tmp/tt7-additions/stick-drift-{mouse,touch}-{start,finish}.png`.
- `mage-sword`: SHA-256 `e0ffdc7c706eb420cce1f5a7026c6eb2153654cf6d5e9a4471b47a1a26844572`; screenshots `/tmp/tt7-additions/mage-sword-{mouse,touch}-{start,finish}.png`.
- `trouser-leg`: SHA-256 `7a242a40f48f668abc7207b2a362de9fcd8fcfbd3cfe11386f11b0a943adc3f5`; screenshots `/tmp/tt7-additions/trouser-leg-{mouse,touch}-{start,finish}.png`.
- `checkout-ambush`: SHA-256 `e414b04f9f4551f6e4bb32e28d61590b4b0714b3d3e65a744cbb3a17162f3060`; screenshots `/tmp/tt7-additions/checkout-ambush-{mouse,touch}-{start,finish}.png`.
- `fizzy-bottle`: SHA-256 `671916176d8ab5de4ff28a43dfc336a30d5d7abf3934c6960251a925d36b5990`; screenshots `/tmp/tt7-additions/fizzy-bottle-{mouse,touch}-{start,finish}.png`.
- `missing-product`: SHA-256 `88a4fdddb1132d25778e07473f5a60af2b2105b1cd4660a34e741e1679527ed6`; screenshots `/tmp/tt7-additions/missing-product-{mouse,touch}-{start,finish}.png`.
- `exact-change`: SHA-256 `7aa1c78516ed9e7c1ca06b011eb688e9297d4949219072b3d571544e85ebf8d5`; screenshots `/tmp/tt7-additions/exact-change-{mouse,touch}-{start,finish}.png`.

Follow-up fixes: stick-drift rejects a neutral click; mage-sword requires an actual claim drag, with click/short-drag rejection; trousers remove the duplicate sock and show a cloth-covered trapped foot; checkout keeps player visible and moves status outside the queue; bottle fountain subsides after retightening; missing-product separates shelf prices and stocks bread in bakery. All affected scenes were rerun on both inputs after these changes.
