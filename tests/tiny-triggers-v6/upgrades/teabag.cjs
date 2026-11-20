module.exports=async(page,io,assert)=>{

await io.drag([376,113],[412,199]);assert.equal((await io.state()).phase,0);await io.down(376,113);await io.move(239,93);await io.shot('during');await io.up();await io.until(s=>s.drop===1);assert((await io.state()).wet>.9);

};
