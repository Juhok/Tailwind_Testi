module.exports = async (page,io,assert) => {

await io.drag([350,180],[120,77]);assert.equal((await io.state()).paired,0);
await io.drag([120,180],[120,77]);assert.equal((await io.state()).paired,1);await io.shot('during');await io.drag([350,180],[350,77]);await io.until(s=>s.phase===3);

};
