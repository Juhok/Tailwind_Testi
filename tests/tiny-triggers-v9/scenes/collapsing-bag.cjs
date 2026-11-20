module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'ready');
  assert.equal(state.rimSeated, true);
  assert.equal(state.rimCollapse, 0);

  await io.click(283, 110);
  await io.click(96, 134);
  await io.drag([96, 134], [366, 114]);
  state = await io.state();
  assert.equal(state.phase, 'ready');
  assert.equal(state.correctDrop, false, 'A deliberate gap/edge drop is not the solution');
  assert.equal(state.paperX, 96);
  assert.equal(state.paperY, 134);
  assert.equal(state.rimSeated, true);
  await io.drag([96, 134], [150, 229]);
  state = await io.state();
  assert.equal(state.paperX, 96);
  assert.equal(state.paperY, 134);
  assert.equal(await page.evaluate(() => finished), false);

  await io.down(96, 134);
  await io.move(283, 110);
  state = await io.state();
  assert.equal(state.dragging, true);
  assert.equal(state.candidateCorrect, true);
  assert.equal(state.rimSeated, true);
  assert.equal(state.phase, 'ready', 'Nothing collapses before the correctly aimed release');
  await io.shot('correctly-aimed');
  await io.up();
  state = await io.state();
  assert.equal(state.correctDrop, true);
  assert.equal(state.phase, 'dropping');
  assert.equal(state.rimSeated, true);
  assert.equal(await page.evaluate(() => finished), false);

  await io.until((s) => s.phase === 'slipping' && s.rimCollapse > 0.2);
  state = await io.state();
  assert(state.rimCollapse > 0.2 && state.rimCollapse < 1);
  assert.equal(state.rimSeated, false);
  assert.equal(state.rubbishInGap, false);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('rim-slipping-inside');
  await io.until((s) => s.phase === 'complete');
  state = await io.state();
  assert.equal(state.rimCollapse, 1);
  assert.equal(state.rubbishInGap, true);
  assert.equal(state.correctDrop, true);
  assert(state.paperX - 20 > state.linerRightEdge, 'Rubbish lands outside the collapsed liner');
  assert.equal(state.paperY, 210);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('rubbish-outside-liner');
  // The shared browser runner verifies Retry restores ready + unfinished.
};
