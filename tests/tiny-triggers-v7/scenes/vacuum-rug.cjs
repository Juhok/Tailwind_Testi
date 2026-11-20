module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 0);
  assert.equal(state.fold, 0);
  assert.equal(state.finished, false);

  await io.click(185, 183);
  await io.drag([280, 135], [390, 181]);
  await io.drag([92, 181], [92, 75]);
  state = await io.state();
  assert.equal(state.phase, 0, 'Only a horizontal drag starting on the vacuum can guide it');
  assert.equal(state.folding, false);
  assert.equal(state.finished, false);

  await io.drag([92, 181], [226, 181], { steps: 18, hold: .7 });
  state = await io.state();
  assert.equal(state.phase, 0, 'Catching a corner does not end the first cleaning pass');
  assert.equal(state.folding, true);
  assert.ok(state.fold > .8, 'The carpet corner visibly rises');
  assert.ok(state.cleaned > 0, 'It keeps cleaning after folding the corner');
  assert.equal(state.finished, false);
  await io.shot('vacuum-rug-folded-first-pass');

  await io.drag([226, 181], [391, 181], { steps: 18 });
  state = await io.state();
  assert.equal(state.phase, 1, 'After crossing the whole rug it takes another cleaning lap');
  assert.equal(state.firstPass, true);
  assert.equal(state.finished, false);
  await io.until(s => s.phase === 2);
  state = await io.state();
  assert.equal(state.lap, 2);
  assert.equal(state.fold, 1, 'Its folded corner remains for the next lap');
  assert.ok(state.cleaned >= 9, 'The intervening lap is visibly productive');
  assert.equal(state.stuck, false, 'The next interactive pass cannot finish itself');
  await io.wait(500);
  assert.equal((await io.state()).phase, 2);
  await io.shot('vacuum-rug-next-lap');

  await io.drag([103, 181], [224, 181], { steps: 16 });
  state = await io.state();
  assert.equal(state.phase, 3, 'The front bumper catches its own folded corner');
  assert.equal(state.stuck, true);
  assert.ok(state.robot.x <= 153, 'The robot cannot drag through the obstruction');
  assert.equal(state.finished, false, 'Wheels spin and the body rocks before the result');
  await io.until(s => s.finished);
  state = await io.state();
  assert.equal(state.phase, 4);
  assert.ok(state.stuckTime >= 1.85);
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('vacuum-rug-stuck');
  // The shared runner clicks Retry and checks initial phase / completion reset.
};
