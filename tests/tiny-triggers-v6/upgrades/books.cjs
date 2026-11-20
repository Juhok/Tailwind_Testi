module.exports=async(page,io,assert)=>{
await io.down(194,95);await io.move(194,130);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([254,143],[300,175]);assert.equal((await io.state()).phase,0);await io.drag([194,95],[194,187]);await io.until(s=>s.flip>.98);await io.shot('during');await io.drag([254,143],[293,177]);await io.until(s=>s.phase===2);

};
