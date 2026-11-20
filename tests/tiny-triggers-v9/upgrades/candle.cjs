module.exports = async (page,io,assert) => {

await io.drag([240,193],[240,160]);assert.equal((await io.state()).phase,0);await io.until(s=>s.tunnel===1);assert.equal((await io.state()).lit,true);await io.shot('during');await io.drag([389,115],[240,109]);await io.until(s=>s.phase===2);assert.equal((await io.state()).lit,false);

};
