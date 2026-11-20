module.exports = async (page,io,assert) => {

await io.drag([95,123],[282,97]);assert.equal((await io.state()).phase,0);
await io.drag([127,78],[127,165]);await io.wait(200);assert.equal((await io.state()).phase,1);await io.shot('during');await io.drag([95,123],[282,97]);await io.until(s=>s.phase===3);assert((await io.state()).sideways);

};
