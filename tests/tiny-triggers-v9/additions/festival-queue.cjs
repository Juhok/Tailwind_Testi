module.exports=async(page,io,assert)=>{

await io.click(400,90);assert.equal((await io.state()).phase,'join');await io.drag([36,210],[81,210],{hold:.5});assert.equal((await io.state()).phase,'waiting');await io.down(81,210);await io.move(350,210);await io.until(s=>s.phase==='reveal');await io.up();await io.until(s=>s.phase==='done');assert.equal((await io.state()).visibleContinuation,true);assert.equal((await io.state()).hiddenPeople,33);

};
