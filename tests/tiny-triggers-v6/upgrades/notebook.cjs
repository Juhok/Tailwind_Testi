module.exports = async (page,io,assert) => {

await io.drag([330,85],[290,90]);assert.equal((await io.state()).phase,0);
await io.down(330,85);await io.move(381,108,10);await io.shot('during');await io.move(435,125,10);await io.up();
await io.until(s=>s.phase===2);assert.equal((await io.state()).fringe,10);

};
