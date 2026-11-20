module.exports=async(page,io,assert)=>{
await io.down(116,184);await io.move(116,160);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([128,136],[351,115]);assert.equal((await io.state()).phase,0);
await io.drag([116,184],[116,85]);await io.until(s=>s.behind);assert.equal((await io.state()).phase,1);await io.shot('during');
await io.drag([128,136],[351,115]);await io.until(s=>s.hung);

};
