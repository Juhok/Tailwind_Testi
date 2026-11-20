module.exports=async(page,io,assert)=>{

await io.click(256,241);assert.equal((await io.state()).phase,'coding');await io.down(114,235);await io.until(s=>s.phase==='ready');await io.up();await io.click(256,241);await io.until(s=>s.phase==='rejected');await io.shot('rejected');await io.click(256,241);await io.until(s=>s.phase==='conflicts');assert.equal((await io.state()).conflicts,12);

};
