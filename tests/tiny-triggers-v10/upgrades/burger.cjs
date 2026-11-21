module.exports = async (page,io,assert) => {

await io.drag([240,207],[400,220]);await io.wait(300);assert.equal((await io.state()).phase,0);
await io.down(240,209);await io.move(340,142);await io.wait(200);await io.shot('during');assert((await io.state()).settle>.3);await io.move(240,55);await io.up();await io.until(s=>s.phase===2);

};
