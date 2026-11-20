module.exports=async(page,io,assert)=>{
await io.down(167,173);await io.move(194,173);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([167,173],[195,173]);assert.notEqual((await io.state()).value%5,0);assert.equal((await io.state()).phase,0);await io.shot('during');await io.drag([195,173],[238.5,173]);await io.until(s=>s.phase===1);assert([49,51].includes((await io.state()).value));

};
