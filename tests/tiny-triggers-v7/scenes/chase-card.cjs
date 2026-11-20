'use strict';
module.exports = async function (page, io, assert) {
  assert.equal((await io.state()).phase, 'sealed');
  await io.drag([240, 130], [240, 20]); // The sealed packet is not yet a card.
  assert.equal((await io.state()).phase, 'sealed');
  assert.equal((await io.state()).reveal, 0);
  await io.drag([313, 86], [333, 86]); // A little tug cannot fully tear the seam.
  assert.equal((await io.state()).phase, 'sealed');
  assert.equal((await io.state()).tear, 0);
  await io.down(313, 86);
  await io.move(357, 78);
  const halfwayTorn = await io.state();
  assert(halfwayTorn.tear > 0.3 && halfwayTorn.tear < 0.8);
  assert.equal(halfwayTorn.cardExposed, false);
  await io.shot('tear');
  await io.move(402, 70);
  await io.up();
  await io.until((state) => state.phase === 'reveal');
  assert.equal((await io.state()).reveal, 0, 'Tearing alone must not reveal the entire card');
  await io.click(240, 99);
  assert.equal((await io.state()).reveal, 0, 'A click does not replace the slide gesture');
  await io.down(240, 98);
  await io.move(240, 53);
  await io.until((state) => state.reveal > 0.45);
  await io.up();
  const halfway = await io.state();
  assert(halfway.reveal > 0.45 && halfway.reveal <= 0.51);
  assert.equal(await page.evaluate(() => finished), false);
  await io.wait(250);
  assert((await io.state()).reveal <= 0.51, 'The reveal pauses when the player stops pulling');
  await io.shot('half-revealed');
  await io.drag([240, 70], [240, 18]);
  await io.until((state) => state.phase === 'done');
  const final = await io.state();
  assert.equal(final.reveal, 1);
  assert(final.misprintVisible && final.sparkling);
  assert(final.leftBorder >= 25 && final.rightBorder <= 2, 'The printed plate must have physically asymmetric borders');
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('misprinted-rare');
  // The shared runner verifies Retry returns to the sealed packet.
};
