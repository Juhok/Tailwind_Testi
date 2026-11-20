module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'search');
  assert.equal(state.looseEndVisible, false);
  assert.equal(state.paperLength, 0);

  // There is initially no paper to grab; a click does not spin the roll.
  await io.drag([240, 195], [240, 252]);
  await io.click(302, 108);
  await io.drag([378, 128], [370, 214]);
  state = await io.state();
  assert.equal(state.phase, 'search');
  assert.equal(state.rotationTravel, 0);
  assert.equal(await page.evaluate(() => finished), false);

  await io.down(302, 108);
  await io.move(284, 152);
  await io.move(240, 170);
  await io.up();
  state = await io.state();
  assert(state.rotation > 1.4 && state.rotation < 1.7);
  assert.equal(state.phase, 'search');
  assert.equal(state.looseEndVisible, false);
  await io.shot('searching-roll');

  await io.down(240, 170);
  await io.move(196, 152);
  await io.move(178, 108);
  await io.up();
  state = await io.state();
  assert.equal(state.phase, 'ready');
  assert.equal(state.looseEndVisible, true);
  assert.equal(state.paperLength, 13);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('end-found');

  await io.click(240, 194);
  await io.drag([240, 194], [275, 194]);
  assert.equal((await io.state()).paperLength, 13, 'Only pulling downward feeds paper');
  await io.drag([240, 194], [240, 215]);
  state = await io.state();
  assert(state.paperLength > 30 && state.paperLength < 40);
  assert.equal(state.phase, 'ready');
  assert.equal(state.detached, false);
  await io.wait(350);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('partial-sheet');

  await io.drag([240, 213], [240, 250]);
  await io.until((s) => s.phase === 'tearing');
  state = await io.state();
  assert.equal(state.detached, true);
  assert(state.sheets >= 1 && state.sheets <= 2);
  assert.equal(await page.evaluate(() => finished), false);
  await io.until((s) => s.phase === 'retracting' && s.retractProgress > 0.1);
  state = await io.state();
  assert(state.paperLength < 7 && state.paperLength > 0);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('end-retracting');
  await io.until((s) => s.phase === 'complete');
  state = await io.state();
  assert.equal(state.paperLength, 0);
  assert.equal(state.looseEndVisible, false);
  assert.equal(state.detached, true);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('empty-slot-short-strip');
  // The shared runner checks Retry restores the initial phase and completion.
};
