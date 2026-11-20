module.exports=async(page,io,assert)=>{
await io.down(140,76);await io.move(220,100);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([140,76],[220,245]);assert.equal((await io.state()).delivered,0);
await io.drag([140,76],[366,138]);await io.until(s=>s.delivered===1);await io.shot('during');
await io.drag([140,76],[366,138]);await io.until(s=>s.delivered===2);await io.drag([140,76],[366,138]);await io.until(s=>s.delivered===3);

};
