module.exports=async(page,io,assert)=>{

await io.click(227,143);assert.equal((await io.state()).phase,'hunt');await io.drag([292,147],[192,147]);assert.equal((await io.state()).phase,'edge');await io.drag([279,108],[299,99]);assert.equal((await io.state()).phase,'edge');await io.drag([279,108],[365,45]);await io.until(s=>s.phase==='done');assert.equal((await io.state()).stripWidth,7);assert.equal((await io.state()).restStuck,true);

};
