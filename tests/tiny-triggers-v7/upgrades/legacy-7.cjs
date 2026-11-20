module.exports=async(page,io,assert)=>{
await io.down(115,150);await io.move(140,100);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([115,150],[385,149]);assert.equal((await io.state()).phase,0);
await io.down(115,150);await io.move(204,90);await io.until(s=>s.amount<.5);await io.shot('during');await io.until(s=>s.amount<=.025);await io.up();assert.equal((await io.state()).phase,1);
await io.drag([204,90],[385,149]);await io.until(s=>s.phase===2);

};
