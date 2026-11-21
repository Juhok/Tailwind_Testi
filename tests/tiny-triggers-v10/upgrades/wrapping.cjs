module.exports=async(page,io,assert)=>{

await io.drag([332,72],[332,125]);assert.equal((await io.state()).phase,0);await io.down(332,72);await io.move(332,158);await io.wait(100);await io.shot('during');await io.move(332,223);await io.up();await io.until(s=>s.gap);

};
