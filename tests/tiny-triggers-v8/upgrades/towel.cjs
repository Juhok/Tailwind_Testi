module.exports=async(page,io,assert)=>{
await io.down(266,111);await io.move(269,145);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([266,111],[270,145]);assert.equal((await io.state()).phase,0);await io.down(266,111);await io.move(270,163);await io.wait(150);await io.shot('during');await io.move(270,216);await io.up();await io.until(s=>s.phase===1);

};
