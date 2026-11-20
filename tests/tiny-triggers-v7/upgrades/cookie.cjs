module.exports=async(page,io,assert)=>{
await io.down(112,115);await io.move(210,120);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([112,115],[274,128],{hold:.2});assert.equal((await io.state()).phase,0);assert.equal((await io.state()).soak,0);
await io.down(112,115);await io.move(274,128);await io.until(s=>s.soak>.5);await io.shot('during');await io.until(s=>s.phase===1);await io.up();await io.until(s=>s.sink>1);

};
