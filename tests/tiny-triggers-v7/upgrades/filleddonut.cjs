module.exports=async(page,io,assert)=>{

await io.drag([213,121],[213,133]);assert.equal((await io.state()).phase,0);await io.down(213,121);await io.move(213,170);await io.until(s=>s.jam>.5);await io.shot('during');await io.until(s=>s.jam>.9);await io.up();await io.until(s=>s.phase===1);

};
