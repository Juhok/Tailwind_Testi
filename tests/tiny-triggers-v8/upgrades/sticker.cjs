module.exports=async(page,io,assert)=>{
await io.down(185,145);await io.move(155,120);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([295,145],[400,100]);assert.equal((await io.state()).phase,0);await io.drag([185,145],[80,100]);await io.until(s=>s.left>.98);await io.shot('during');await io.drag([295,145],[400,100]);await io.until(s=>s.strip);

};
