module.exports=async(page,io,assert)=>{
await io.down(111,151);await io.move(170,151);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([369,151],[240,151]);assert.equal((await io.state()).phase,0);await io.drag([111,151],[250,151]);await io.until(s=>s.left>.97);await io.shot('during');await io.drag([369,151],[230,151]);await io.until(s=>s.gap);

};
