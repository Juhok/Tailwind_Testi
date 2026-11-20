module.exports = async (page,io,assert) => {

await io.drag([80,210],[90,106]);assert.equal((await io.state()).placed,0);
await io.drag([295,210],[90,106]);await io.drag([80,210],[190,106]);await io.shot('during');assert.equal((await io.state()).placed,2);
await io.drag([400,210],[290,106]);await io.drag([185,210],[390,106]);await io.until(s=>s.phase===2);

};
