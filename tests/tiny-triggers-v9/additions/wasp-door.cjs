module.exports=async(page,io,assert)=>{

await io.click(338,119);assert.equal((await io.state()).open,0);await io.drag([244,145],[220,145]);assert.equal((await io.state()).phase,'closed');await io.drag([244,145],[104,145]);await io.until(s=>s.bumps>=2);await io.shot('wrong-pane');assert.equal((await io.state()).doorClear,true);await io.until(s=>s.phase==='done');assert((await io.state()).bumps>=4);

};
