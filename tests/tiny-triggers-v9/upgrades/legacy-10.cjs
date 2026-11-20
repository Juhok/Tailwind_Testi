module.exports=async(page,io,assert)=>{
await io.down(140,139);await io.move(200,139);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([140,139],[240,139]);assert((await io.state()).progress<99);assert.equal((await io.state()).phase,0);await io.shot('during');await io.drag([240,139],[376,139]);await io.until(s=>s.phase===1);assert.equal((await io.state()).progress,99);

};
