module.exports=async(page,io,assert)=>{
await io.down(115,150);await io.move(140,100);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([115,150],[385,149]);assert.equal((await io.state()).phase,0);
await io.down(115,150);await io.move(204,90);await io.until(s=>s.amount<.5);const flowing=await io.state();assert.equal(flowing.stream.from[0],flowing.stream.to[0]);assert.deepEqual(flowing.stream.from,flowing.spout);assert(flowing.spout[0]>194&&flowing.spout[0]<250,'Straight milk stream lands inside glass');await io.shot('during');await io.until(s=>s.amount<=.025);await io.up();assert.equal((await io.state()).phase,1);
await io.drag([204,90],[385,149]);await io.until(s=>s.phase===2&&s.scale<=.6001);const resting=await io.state();assert(resting.cartonBounds.left>342&&resting.cartonBounds.right<429);assert(resting.cartonBounds.top>116&&resting.cartonBounds.bottom<=194.1,'Carton fits between shelves');

};
