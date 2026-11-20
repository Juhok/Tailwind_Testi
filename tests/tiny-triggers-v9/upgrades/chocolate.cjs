module.exports = async (page,io,assert) => {

await io.drag([155,90],[175,100]);assert.equal((await io.state()).phase,0);
await io.down(321,182);await io.move(355,202);await io.wait(150);await io.shot('during');assert((await io.state()).pull>.25);await io.move(393,227);await io.up();await io.until(s=>s.phase===2);

};
