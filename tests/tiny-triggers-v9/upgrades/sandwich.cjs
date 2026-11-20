module.exports = async (page,io,assert) => {

await io.drag([66,137],[240,142]);assert.equal((await io.state()).placed,0);
await io.drag([66,137],[174,142]);await io.wait(220);await io.shot('during');assert.equal((await io.state()).placed,1);await io.drag([414,137],[305,142]);await io.until(s=>s.phase===2);

};
