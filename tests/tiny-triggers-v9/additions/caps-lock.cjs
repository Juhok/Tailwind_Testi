module.exports=async(page,io,assert)=>{

await io.click(240,148);assert.equal((await io.state()).phase,'typing');await io.down(240,232);await io.until(s=>s.phase==='ready');await io.up();assert.equal((await io.state()).typed,17);await io.click(240,148);await io.until(s=>s.phase==='error');await io.shot('rejected');await io.click(372,97);await io.until(s=>s.phase==='done');assert.equal((await io.state()).revealed,true);assert.equal((await io.state()).caseReversed,true);

};
