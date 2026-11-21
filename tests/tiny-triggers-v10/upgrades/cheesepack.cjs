module.exports = async (page,io,assert) => {

await io.drag([240,190],[200,210]);assert.equal((await io.state()).phase,0);
await io.down(346,72);await io.move(280,115);await io.wait(150);await io.shot('during');assert((await io.state()).pull>.4);await io.move(205,145);await io.up();await io.until(s=>s.phase===2);assert.equal((await io.state()).seamIntact,false);

};
