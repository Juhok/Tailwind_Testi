module.exports = async function (page, io, assert) {
  const initial = await io.state();
  assert.equal(initial.phase, 'open');
  assert.equal(initial.clipAttached, true);
  assert.equal(initial.leftEdge, 156);
  assert.equal(initial.rightEdge, 324);

  // Background motion and clicking fabric are not curtain-closing gestures.
  await io.drag([238, 91], [238, 191]);
  await io.click(134, 145);
  let state = await io.state();
  assert.equal(state.leftEdge, 156);
  assert.equal(state.rightEdge, 324);
  assert.equal(await page.evaluate(() => finished), false);

  // A short drag must leave a real partial opening, not snap to completion.
  await io.drag([140, 145], [178, 145]);
  state = await io.state();
  assert(state.leftEdge > 185 && state.leftEdge < 210);
  assert.equal(state.phase, 'open');
  assert.equal(state.clipAttached, true);

  await io.drag([175, 145], [235, 145]);
  state = await io.state();
  assert.equal(state.leftClosed, true);
  assert.equal(state.rightClosed, false);
  await io.wait(400);
  assert.equal(await page.evaluate(() => finished), false);
  assert.equal((await io.state()).clipAttached, true);

  // The second curtain must meet the first before the clip fails.
  await io.drag([342, 145], [253, 145]);
  await io.until((s) => s.phase === 'clip-falling');
  state = await io.state();
  assert.equal(state.leftEdge, 240);
  assert.equal(state.rightEdge, 240);
  assert.equal(state.clipAttached, false);
  assert.equal(await page.evaluate(() => finished), false);
  await io.until((s) => s.cornerDrop > 18 && s.phase === 'clip-falling');
  await io.shot('clip-in-flight');
  await io.until((s) => s.phase === 'complete');
  state = await io.state();
  assert.equal(await page.evaluate(() => finished), true);
  assert(state.cornerDrop >= 45);
  assert(state.lightGap > 10 && state.lightGap < 20);
  assert.equal(state.clipY, 239);
  await io.shot('dangling-corner');

  await page.locator('#reset').click();
  state = await io.state();
  assert.equal(state.phase, 'open');
  assert.equal(state.clipAttached, true);
  assert.equal(state.cornerDrop, 0);
  assert.equal(state.lightGap, 0);
  assert.equal(state.leftEdge, 156);
  assert.equal(state.rightEdge, 324);
  assert.equal(await page.evaluate(() => finished), false);

  // Either curtain can be closed first after a real Retry.
  await io.drag([342, 145], [253, 145]);
  state = await io.state();
  assert.equal(state.rightClosed, true);
  assert.equal(state.leftClosed, false);
  await io.drag([140, 145], [228, 145]);
  await io.until((s) => s.phase === 'complete');
};
