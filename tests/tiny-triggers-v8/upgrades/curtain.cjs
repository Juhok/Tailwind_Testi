module.exports=async(page,io,assert)=>{

await io.drag([143,124],[390,124]);assert.equal((await io.state()).phase,0);await io.down(143,124);await io.move(270,155);await io.wait(150);await io.shot('during');await io.move(393,188);await io.up();await io.until(s=>s.phase===1);

};
