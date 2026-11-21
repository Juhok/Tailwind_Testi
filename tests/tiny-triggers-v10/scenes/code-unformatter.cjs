'use strict';

module.exports = async function (page, io, assert) {
  assert.equal((await io.state()).phase, 'ready');
  await io.click(196, 130); // The code itself is not the formatting control.
  await io.wait(200);
  assert.equal((await io.state()).phase, 'ready');
  await io.down(374, 49);
  await io.move(280, 110);
  await io.up(); // A cancelled press must not run the formatter.
  assert.equal((await io.state()).phase, 'ready');
  await io.shot('code-unformatter-before');
  await io.click(374, 49);
  await io.until((state) => state.phase === 'formatting' && state.tokenProgress > 0.1);
  const during = await io.state();
  assert(during.tokenProgress > 0.1 && during.tokenProgress < 1, 'Existing tokens must visibly travel, not instantly replace the code');
  assert(during.braceDisplacement > 0, 'Braces should move out of their tidy columns');
  assert(during.arraySplit, 'Array brackets should separate onto awkward lines');
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('code-unformatter-during');
  await io.until((state) => state.phase === 'done');
  const final = await io.state();
  assert(final.ruined);
  assert.equal(final.message, 'Formatting complete.');
  assert.deepEqual(final.indentOffsets, [9, 0, 7]);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('code-unformatter-after');
  // The shared runner clicks Retry and verifies the original ready phase.
};
