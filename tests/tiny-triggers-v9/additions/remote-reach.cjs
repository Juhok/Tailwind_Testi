module.exports=async(page,io,assert)=>{

await io.click(263,218);assert.equal((await io.state()).phase,'look');await io.drag([114,151],[173,214]);assert.equal((await io.state()).phase,'found');await io.drag([173,212],[267,218]);await io.until(s=>s.phase==='done');assert.equal((await io.state()).touched,true);assert((await io.state()).remote>370);

};
