module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'flat');
  assert.equal(state.attached, true);
  assert.equal(state.sealed, true);

  // Clicking, pulling sideways before lifting, and grabbing the lid do nothing.
  await io.click(245, 123);
  await io.drag([245, 123], [327, 123]);
  await io.drag([174, 105], [174, 52]);
  state = await io.state();
  assert.equal(state.phase, 'flat');
  assert.equal(state.liftProgress, 0);
  assert.equal(state.attached, true);
  assert.equal(await page.evaluate(() => finished), false);

  await io.down(245, 123);
  await io.move(245, 102);
  state = await io.state();
  assert(state.liftProgress > 0.4 && state.liftProgress < 0.6);
  assert.equal(state.attached, true);
  await io.up();
  assert.equal((await io.state()).phase, 'flat');

  await io.drag([245, 123], [245, 77]);
  state = await io.state();
  assert.equal(state.phase, 'lifted');
  assert.equal(state.liftProgress, 1);
  assert.equal(state.attached, true);
  assert.equal(state.lidOpened, false);
  await io.shot('lifted-intact');

  // Real resistance is visible before fracture; releasing a short pull is safe.
  await io.down(245, 82);
  await io.move(282, 82);
  state = await io.state();
  assert.equal(state.phase, 'tension');
  assert(state.tension > 30 && state.tension < 45);
  assert.equal(state.attached, true);
  assert.equal(state.lidLift, 0);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('under-tension');
  await io.up();
  assert.equal((await io.state()).phase, 'lifted');

  await io.drag([245, 82], [323, 82]);
  await io.until((s) => s.phase === 'snapping' || s.phase === 'recoil');
  state = await io.state();
  assert.equal(state.attached, false);
  assert.equal(state.sealed, true);
  assert.equal(await page.evaluate(() => finished), false);
  await io.until((s) => s.phase === 'complete');
  state = await io.state();
  assert.equal(state.heldDetachedRing, true);
  assert(state.ringX > 345, 'Detached ring is visibly separated from the can');
  assert.equal(state.sealed, true);
  assert.equal(state.lidOpened, false);
  assert.equal(state.lidLift, 0);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('ring-in-hand-sealed-can');
  // Shared runner performs the real Retry click and asserts initial phase/reset.
};
