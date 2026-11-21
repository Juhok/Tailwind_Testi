module.exports = async (page,io,assert) => {

await io.drag([90,132],[90,154]);assert.equal((await io.state()).cleaned,0);
await io.drag([90,132],[90,55]);await io.drag([190,132],[190,55]);assert.equal((await io.state()).cleaned,2);await io.shot('during');await io.drag([290,132],[290,55]);await io.drag([390,132],[390,55]);await io.until(s=>s.phase===2);assert.deepEqual((await io.state()).threads,[1,1,1,1]);

};
