module.exports=async(page,io,assert)=>{

await io.drag([69,245],[409,245]);assert.equal((await io.state()).phase,'library');await io.click(137,111);assert.equal((await io.state()).phase,'sports');await io.drag([69,245],[250,245]);assert((await io.state()).minute>45);await io.shot('still-sports');await io.drag([250,245],[409,245]);await io.until(s=>s.phase==='ended');assert.equal((await io.state()).filmSeen,false);assert.equal((await io.state()).minute,90);

};
