module.exports = async (page,io,assert) => {

await io.click(92,158);assert.equal((await io.state()).phase,0);
await io.drag([143,139],[322,174]);await io.wait(200);assert.equal((await io.state()).phase,1);await io.down(322,174);await io.wait(800);await io.shot('during');let s=await io.state();assert(s.fuel>15&&s.fuel<45);await io.until(s=>s.fuel===50);await io.up();await io.until(s=>s.phase===3);assert.equal((await io.state()).fuel,50);

};
