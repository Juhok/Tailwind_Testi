module.exports=async(page,io,assert)=>{

await io.drag([291,128],[245,150]);assert.equal((await io.state()).phase,0);await io.drag([190,128],[99,85]);await io.until(s=>s.big>.98);await io.shot('during');await io.drag([291,128],[244,150]);await io.until(s=>s.phase===2);

};
