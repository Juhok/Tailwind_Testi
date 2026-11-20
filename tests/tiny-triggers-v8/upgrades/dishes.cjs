module.exports=async(page,io,assert)=>{

await io.drag([334,237],[334,90]);assert.equal((await io.state()).loaded,0);await io.drag([67,150],[292,135]);await io.drag([126,166],[348,135]);assert.equal((await io.state()).loaded,2);await io.shot('during');await io.drag([334,237],[334,90]);await io.until(s=>s.phase===3);assert((await io.state()).leftOut);

};
