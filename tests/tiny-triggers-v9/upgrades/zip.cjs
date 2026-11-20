module.exports = async (page,io,assert) => {

await io.drag([300,180],[300,80]);assert.equal((await io.state()).phase,0);
await io.down(241,222);await io.move(241,171);await io.wait(150);await io.shot('during');assert((await io.state()).slider<190);await io.move(241,92);await io.up();await io.until(s=>s.phase===2);assert((await io.state()).jam>.9);

};
