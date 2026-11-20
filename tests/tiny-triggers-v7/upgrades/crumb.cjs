module.exports = async (page,io,assert) => {

await io.drag([370,175],[370,115]);assert.equal((await io.state()).phase,0);
await io.down(370,115);await io.move(270,175);await io.move(220,175);await io.wait(180);await io.shot('during');assert((await io.state()).progress>.2);await io.move(130,175);await io.up();await io.until(s=>s.phase===2);assert.equal((await io.state()).remaining,1);

};
