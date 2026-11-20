module.exports=async(page,io,assert)=>{

await io.drag([96,151],[274,123]);assert.equal((await io.state()).phase,0);await io.down(96,151);await io.move(367,111);await io.shot('during');await io.up();await io.until(s=>s.besideBag);

};
