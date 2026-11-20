module.exports = async (page,io,assert) => {

await io.drag([98,164],[305,106]);assert.equal((await io.state()).phase,0);
await io.drag([305,106],[210,105],{hold:1.1});await io.until(s=>s.phase===1);await io.shot('during');await io.drag([210,105],[305,106]);await io.until(s=>s.phase===3);

};
