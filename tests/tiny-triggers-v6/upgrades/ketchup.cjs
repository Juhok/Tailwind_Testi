module.exports=async(page,io,assert)=>{
await io.down(382,116);await io.move(300,100);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([382,116],[310,150],{hold:.3});assert.equal((await io.state()).water,0);await io.down(382,116);await io.move(212,88);await io.until(s=>s.water>.3);await io.shot('during');await io.until(s=>s.phase===1);await io.up();

};
