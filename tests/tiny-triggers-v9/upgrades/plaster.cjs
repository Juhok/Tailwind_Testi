module.exports=async(page,io,assert)=>{

await io.drag([298,120],[298,160],{hold:.6});assert.equal((await io.state()).phase,0);await io.drag([166,140],[325,140]);await io.until(s=>s.fold>.98);await io.shot('during');await io.down(298,120);await io.move(298,160);await io.until(s=>s.hold>.65);await io.up();await io.until(s=>s.phase===2);

};
