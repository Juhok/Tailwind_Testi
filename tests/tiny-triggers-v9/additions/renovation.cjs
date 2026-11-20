module.exports=async(page,io,assert)=>{

await io.click(224,44);await io.wait(250);assert.equal((await io.state()).phase,'morning');await io.drag([97,187],[220,174]);await io.until(s=>s.phase==='drilling');await io.shot('eight-am');await io.until(s=>s.phase==='done');assert.equal((await io.state()).hours,8);

};
