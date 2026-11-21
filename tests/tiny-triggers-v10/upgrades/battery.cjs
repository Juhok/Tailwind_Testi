module.exports = async (page,io,assert) => {

await io.drag([398,144],[251,145]);assert.equal((await io.state()).phase,0);
await io.drag([98,83],[98,172]);await io.until(s=>s.phase===1);await io.wait(200);await io.drag([98,120],[281,145]);assert.equal((await io.state()).phase,2);await io.shot('during');await io.drag([398,144],[251,145]);await io.until(s=>s.phase===4);

};
