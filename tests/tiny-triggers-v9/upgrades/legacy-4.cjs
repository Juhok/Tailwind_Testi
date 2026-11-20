module.exports=async(page,io,assert)=>{
await io.down(100,147);await io.move(160,100);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([390,147],[250,80],{hold:.2});assert.equal((await io.state()).milk,0);
await io.down(100,147);await io.move(230,80);await io.until(s=>s.milk>=1);await io.up();assert.equal((await io.state()).phase,1);
await io.down(390,147);await io.move(250,80);await io.until(s=>s.flakes>.2);await io.shot('during');assert((await io.state()).flakes>0);await io.until(s=>s.phase===2);await io.up();

};
