'use strict';
module.exports = async function (page, io, assert) {
  assert.equal((await io.state()).phase, 'ready');
  await io.drag([181, 155], [270, 202]);
  await io.drag([287, 120], [190, 120]);
  assert.equal((await io.state()).heat, 0);
  assert.equal((await io.state()).extraction, 0);
  await io.click(338, 160);
  await io.until((s) => s.phase === 'heating' && s.heat > 0.4 && s.heat < 0.85);
  assert((await io.state()).steaming);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('heating');
  await io.until((s) => s.phase === 'hot');
  assert((await io.state()).plateTooHot);
  await io.drag([181, 155], [270, 202]); // The closed door blocks extraction.
  assert.equal((await io.state()).extraction, 0);
  await io.drag([287, 120], [189, 120]);
  assert.equal((await io.state()).phase, 'plate');
  await io.down(181, 155);
  await io.move(226, 179);
  assert((await io.state()).extraction > 0.3 && (await io.state()).extraction < 0.7);
  assert((await io.state()).hotTouch);
  await io.shot('scorching-plate');
  await io.move(270, 202);
  await io.up();
  assert.equal((await io.state()).phase, 'cut');
  await io.click(326, 203); // Clicking the meal cannot reveal its core.
  assert.equal((await io.state()).cut, 0);
  await io.down(270, 132);
  await io.move(270, 160);
  const midway = await io.state();
  assert(midway.cut > 0.3 && midway.cut < 0.65);
  assert.equal(midway.frozenChunkVisible, false);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('cutting-center');
  await io.move(270, 193);
  await io.up();
  await io.until((s) => s.phase === 'revealing' && s.reveal > 0.3 && s.reveal < 0.9);
  assert((await io.state()).frozenChunkVisible);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('frozen-reveal');
  await io.until((s) => s.phase === 'done');
  const final = await io.state();
  assert(final.solidFrozenCore && final.outsideHot && final.steaming);
  assert.equal(final.cut, 1);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('hot-outside-ice-inside');
  // Shared runner verifies Retry resets heating and the sealed microwave door.
};
