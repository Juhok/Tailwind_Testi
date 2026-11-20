module.exports=async(page,io,assert)=>{

await io.click(410,105);assert.equal((await io.state()).phase,'explain');await io.down(108,155);await io.until(s=>s.spoken>2);await io.shot('explaining');await io.up();const n=(await io.state()).keystrokes;await io.until(s=>s.phase==='done');assert((await io.state()).keystrokes>n+8);assert.equal((await io.state()).lookedUp,false);

};
