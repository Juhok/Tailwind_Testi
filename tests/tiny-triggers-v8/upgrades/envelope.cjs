module.exports = async (page,io,assert) => {

await io.drag([83,145],[280,174]);assert.equal((await io.state()).phase,0);
await io.down(280,76);await io.move(280,128,10);await io.shot('during');await io.move(280,179,10);await io.up();await io.wait(180);assert.equal((await io.state()).phase,1);
await io.drag([205,153],[367,153]);await io.until(s=>s.phase===3);assert.equal((await io.state()).letterInside,false);

};
