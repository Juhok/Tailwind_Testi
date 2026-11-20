module.exports = async (page, io, assert) => {
  // Cars and the crossing itself are not buttons; approaching must be a drag.
  await io.click(239, 135);
  await io.click(240, 242);
  await io.drag([240, 242], [240, 260]);
  assert.equal((await io.state()).phase, 'approach');
  assert.equal((await io.state()).vehicles, 0);
  if (process.env.MOBILE) {
    const cdp = await page.context().newCDPSession(page);
    const r = await page.locator('#stage').boundingBox();
    const point = (x, y) => ({ x: r.x + x * r.width / 480, y: r.y + y * r.height / 270 });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(240, 242)] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(240, 202)] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await cdp.detach();
    assert.equal((await io.state()).phase, 'approach', 'Cancelled approach must not start traffic');
    assert.equal((await io.state()).personY, 242);
    assert.equal((await io.state()).vehicles, 0);
  }
  await io.down(240, 242);
  await io.move(240, 226);
  assert.equal((await io.state()).phase, 'approach');
  assert.equal((await io.state()).vehicles, 0);
  await io.shot('walking');
  await io.move(240, 202);
  assert.equal((await io.state()).phase, 'approach', 'Traffic waits for committed approach');
  await io.up();
  assert.equal((await io.state()).phase, 'rush');
  await io.until(s => s.passed[0] >= 2 && s.passed[1] >= 2);
  const moving = await io.state();
  assert.equal(moving.safelyOnPavement, true);
  assert.deepEqual(moving.directions, [-1, 1]);
  assert.equal(await page.evaluate(() => finished), false, 'Must see the prolonged traffic first');
  await io.shot('both-directions');
  // Trying to move again does not move the person into traffic.
  await io.drag([240, 210], [240, 95]);
  assert.equal((await io.state()).personY, 210);
  await io.until(s => s.phase === 'done');
  const done = await io.state();
  assert(done.passed.every(n => n >= 5));
  assert.equal(done.safelyOnPavement, true);
  await io.wait(350);
  assert.notDeepEqual((await io.state()).trafficPositions, done.trafficPositions, 'Traffic continues after completion');
};
