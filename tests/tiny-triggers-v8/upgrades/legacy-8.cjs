module.exports = async (page,io,assert) => {

await io.drag([83,180],[83,215]);assert.equal((await io.state()).phase,0);
await io.down(305,198);await io.move(305,220);await io.wait(170);await io.shot('during');assert((await io.state()).angle>.08);await io.up();await io.until(s=>s.phase===2);

};
