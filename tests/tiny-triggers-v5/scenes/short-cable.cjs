module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'plug');
  assert.equal(state.connected, false);
  await io.drag([262, 145], [330, 150]);
  await io.click(136, 182);
  await io.drag([136, 182], [103, 108]);
  state = await io.state();
  assert.equal(state.phase, 'plug');
  assert.equal(state.settled, 0);
  assert.equal(state.plugX, 136);
  assert.equal(state.connected, false);

  await io.drag([136, 182], [216, 177]);
  state = await io.state();
  assert.equal(state.phase, 'settle');
  assert.equal(state.charging, true);
  assert.equal(state.batteryColor, 'green');
  assert(state.connectionGap < 0.01, 'Connector tip is exactly on the moving phone port');
  await io.shot('phone-plugged-in');

  await io.down(262, 145);
  await io.move(292, 150);
  state = await io.state();
  assert(state.settled > 0.4 && state.settled < 0.6);
  assert.equal(state.phase, 'settle');
  assert.equal(state.connected, true);
  assert(state.connectionGap < 0.01);
  await io.move(326, 158);
  await io.up();
  state = await io.state();
  assert.equal(state.phase, 'lean');
  assert.equal(state.settled, 1);
  assert.equal(state.connected, true);
  assert(state.cableSlack > 10);
  await io.shot('nearly-comfortable');

  // A partial last lean visibly tightens the cord but keeps it connected.
  await io.down(325, 160);
  await io.move(347, 160);
  state = await io.state();
  assert(state.lean > 0.6 && state.lean < 0.7);
  assert.equal(state.taut, true);
  assert.equal(state.connected, true);
  assert.equal(state.charging, true);
  assert(state.connectionGap < 0.01);
  assert(state.cableSlack > 0 && state.cableSlack < 10);
  assert.equal(await page.evaluate(() => finished), false);
  await io.shot('taut-still-charging');
  await io.up();

  await io.drag([341, 160], [355, 160]);
  await io.until((s) => s.phase === 'unplugging' || s.phase === 'recoil');
  state = await io.state();
  assert.equal(state.connected, false);
  assert.equal(state.charging, false);
  assert.equal(state.batteryColor, 'red');
  assert.equal(await page.evaluate(() => finished), false);
  await io.until((s) => s.phase === 'complete');
  state = await io.state();
  assert.equal(state.lean, 1);
  assert(state.connectionGap > 35);
  assert.equal(state.connected, false);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('comfortable-but-unplugged');
  // Shared runner checks the real Retry button restores plug/unfinished.
};
