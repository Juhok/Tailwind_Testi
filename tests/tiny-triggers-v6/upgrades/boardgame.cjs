module.exports = async (page,io,assert) => {

await io.drag([284,53],[284,153]);assert.equal((await io.state()).phase,0);
await io.drag([80,150],[237,154]);assert.equal((await io.state()).phase,1);
await io.drag([105,207],[240,154]);assert.equal((await io.state()).phase,1);
await io.drag([105,207],[382,198]);assert.equal((await io.state()).phase,2);await io.shot('during');
await io.drag([284,53],[284,154]);await io.until(s=>s.phase===4);assert.equal((await io.state()).trapped,true);assert.equal((await io.state()).lidGap,12);

};
