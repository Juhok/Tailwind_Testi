'use strict';
module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'ready');
  assert(state.tabAvailable && state.actualSealIntact);
  await io.drag([210, 145], [280, 230]); // Food/lid center is not a peel tab.
  assert.equal((await io.state()).peelProgress, 0);
  await io.down(355, 79);
  await io.move(380, 128);
  state = await io.state();
  assert(state.peelProgress > 0.25 && state.peelProgress < 0.5);
  assert(state.holding && state.actualSealIntact);
  await io.shot('partial-curl');
  await io.up();
  assert.equal((await io.state()).phase, 'loose');
  await io.wait(250);
  assert((await io.state()).peelProgress < 0.5, 'A short pull remains resumable, not an automatic completion');
  state = await io.state();
  await io.down(state.handle.x, state.handle.y);
  await io.move(state.handle.x + 29, state.handle.y + 57);
  state = await io.state();
  assert(state.peelProgress > 0.7 && state.peelProgress < 0.95);
  assert.equal(await page.evaluate(() => finished), false);
  await io.up();
  await io.until((s) => s.phase === 'detaching' && s.peelProgress > 0.9);
  state = await io.state();
  assert(state.actualSealIntact && state.lowerFilmVisible, 'The actual sealing membrane never comes away');
  assert.equal(await page.evaluate(() => finished), false, 'The released laminate continues curling away before completion');
  await io.shot('released-layer');
  await io.until((s) => s.phase === 'done');
  state = await io.state();
  assert(state.laminateRemoved);
  assert.equal(state.tabAvailable, false);
  assert(state.actualSealIntact && state.lowerFilmVisible);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('no-tab-still-sealed');
  // The shared runner verifies Retry restores the marked peel tab.
};
