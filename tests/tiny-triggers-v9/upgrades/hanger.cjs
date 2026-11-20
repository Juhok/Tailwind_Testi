module.exports = async (page,io,assert) => {

await io.drag([103,123],[90,180]);assert.equal((await io.state()).phase,0);await io.wait(250);
await io.down(103,123);await io.move(305,72);await io.wait(130);assert.equal((await io.state()).phase,1);await io.move(305,106);await io.wait(120);await io.shot('during');await io.move(305,137);await io.up();await io.until(s=>s.phase===3);assert((await io.state()).stretch>.9);

};
