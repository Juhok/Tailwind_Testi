module.exports = async (page,io,assert) => {

await io.drag([116,105],[289,106]);await io.wait(250);assert.equal((await io.state()).phase,0);
await io.down(116,105);await io.move(328,105);await io.wait(180);await io.shot('during');await io.up();await io.until(s=>s.phase===2);assert((await io.state()).squash>.9);

};
