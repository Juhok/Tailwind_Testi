module.exports=async(page,io,assert)=>{

await io.click(89,89);assert.equal((await io.state()).station,0);await io.drag([356,187],[374,187]);assert.equal((await io.state()).station,0);await io.drag([356,187],[415,187]);await io.until(s=>s.phase==='playing');assert.equal((await io.state()).station,1);await io.shot('same-song');await io.drag([356,187],[415,187]);await io.until(s=>s.phase==='playing');assert.equal((await io.state()).chorus,true);assert.equal((await io.state()).song,'Again again again');

};
