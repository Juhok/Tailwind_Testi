module.exports = async (page,io,assert) => {

await io.drag([282,188],[282,120]);assert.equal((await io.state()).phase,0);
await io.drag([282,188],[282,243]);assert.equal((await io.state()).pulled,true);await io.wait(200);await io.shot('during');
await io.drag([282,188],[282,94]);await io.until(s=>s.phase===3);

};
