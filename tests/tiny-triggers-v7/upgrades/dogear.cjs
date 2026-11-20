module.exports=async(page,io,assert)=>{

await io.drag([395,128],[275,110]);assert.equal((await io.state()).phase,0);await io.down(328,74);await io.move(292,112);await io.wait(150);await io.shot('during');await io.move(245,157);await io.up();await io.until(s=>s.phase===1);assert((await io.state()).bookmarkUnused);

};
