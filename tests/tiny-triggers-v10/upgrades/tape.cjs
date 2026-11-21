module.exports = async (page,io,assert) => {

await io.down(378,88);await io.move(340,110);await io.cancel();await io.wait(180);assert.equal((await io.state()).phase,0);
await io.down(378,88);await io.move(335,118);await io.wait(130);await io.shot('during');assert((await io.state()).amount>.25);await io.move(293,150);await io.up();await io.until(s=>s.phase===2);assert.equal((await io.state()).looseEnd,false);

};
