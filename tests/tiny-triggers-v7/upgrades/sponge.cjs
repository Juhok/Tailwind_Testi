module.exports = async (page,io,assert) => {

await io.drag([89,164],[240,185]);assert.equal((await io.state()).phase,0);
await io.down(240,185);await io.move(381,83);await io.move(350,83);await io.move(410,83);await io.move(350,98);await io.up();await io.until(s=>s.phase===1);await io.shot('during');await io.drag([350,98],[240,185]);await io.until(s=>s.phase===3);assert.equal((await io.state()).soak,1);

};
