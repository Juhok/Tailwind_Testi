module.exports = async (page,io,assert) => {

await io.drag([240,175],[320,175]);assert.equal((await io.state()).phase,0);
await io.down(184,76);await io.move(246,105);await io.wait(160);await io.shot('during');assert((await io.state()).angle<2.6);await io.move(319,76);await io.up();await io.until(s=>s.phase===2);assert((await io.state()).wallFacing);

};
