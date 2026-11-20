module.exports = async (page,io,assert) => {

await io.drag([251,54],[251,85]);await io.wait(250);assert.equal((await io.state()).phase,0);
await io.down(251,54);await io.move(251,113);await io.wait(150);await io.shot('during');assert((await io.state()).visibleLength<45);await io.move(251,153);await io.up();await io.until(s=>s.phase===2);assert.equal((await io.state()).visibleLength,0);

};
