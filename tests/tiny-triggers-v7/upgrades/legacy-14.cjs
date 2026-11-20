module.exports = async (page,io,assert) => {

await io.drag([160,140],[80,140]);assert.equal((await io.state()).phase,0);
await io.down(406,130);await io.move(348,130);await io.wait(150);await io.shot('during');assert((await io.state()).open<100);await io.move(281,130);await io.up();await io.until(s=>s.phase===2);assert((await io.state()).open>=10);

};
