module.exports = async function (page, io, assert) {
  let state = await io.state();
  assert.equal(state.phase, 'unpack');
  assert.equal(state.bagCount, 4);
  assert.equal(state.doorOpen, 0);

  // No fridge shortcut, pre-placed mug or coffee setup before unpacking.
  await io.drag([447, 124], [338, 124]);
  await io.drag([75, 69], [284, 197]);
  await io.click(234, 132);
  state = await io.state();
  assert.equal(state.bagCount, 4);
  assert.equal(state.mugSet, false);
  assert.equal(state.coffeeSet, false);
  assert.equal(state.doorOpen, 0);
  assert.equal(await page.evaluate(() => finished), false);

  // Each item genuinely leaves the full bag only after a deliberate placement.
  await io.drag([205, 97], [204, 55]);
  assert.equal((await io.state()).bagCount, 4, 'Dropping off the counter is rejected');
  await io.drag([205, 97], [33, 163]);
  assert.equal((await io.state()).bagCount, 3);
  await io.drag([245, 99], [79, 166]);
  assert.equal((await io.state()).bagCount, 2);
  await io.drag([279, 97], [125, 167]);
  assert.equal((await io.state()).bagCount, 1);
  await io.shot('three-groceries-unpacked');
  await io.drag([234, 132], [173, 170]);
  await io.until((s) => s.phase === 'coffee');
  state = await io.state();
  assert.equal(state.bagCount, 0);
  assert.deepEqual([...state.unpacked].sort(), ['bread', 'cereal', 'coffee', 'greens']);
  assert.equal(state.coffeeSet, false);
  assert.equal(state.mugSet, false);

  await io.drag([75, 69], [284, 197]);
  await io.drag([447, 124], [338, 124]);
  assert.equal((await io.state()).phase, 'coffee');
  await io.drag([173, 177], [235, 188]);
  state = await io.state();
  assert.equal(state.phase, 'mug');
  assert.equal(state.coffeeSet, true);
  assert.equal(state.mugSet, false);
  await io.drag([447, 124], [338, 124]);
  assert.equal((await io.state()).doorOpen, 0);
  await io.drag([75, 69], [284, 197]);
  state = await io.state();
  assert.equal(state.phase, 'fridge');
  assert.equal(state.mugSet, true);
  await io.shot('coffee-and-mug-ready');

  await io.down(447, 124);
  await io.move(406, 124);
  state = await io.state();
  assert(state.doorOpen > 0.3 && state.doorOpen < 0.5);
  assert.equal(state.phase, 'fridge');
  assert.equal(await page.evaluate(() => finished), false);
  await io.move(338, 124);
  await io.up();
  state = await io.state();
  assert.equal(state.phase, 'revealing');
  assert.equal(state.milkBayVisible, true);
  assert.equal(state.milkPresent, false);
  assert.equal(await page.evaluate(() => finished), false);
  await io.until((s) => s.phase === 'complete');
  assert.equal(await page.evaluate(() => finished), true);
  await io.shot('stocked-fridge-no-milk');
  // Shared runner performs Retry and checks the initial phase/completion reset.
};
