module.exports=async(page,io,assert)=>{

await io.click(209,77);assert.equal((await io.state()).phase,'approach');await io.drag([48,207],[110,207]);assert.equal((await io.state()).phase,'approach');await io.drag([110,207],[188,207]);await io.until(s=>s.bus>380);await io.shot('leaving');await io.until(s=>s.phase==='done');assert.equal((await io.state()).now,'08:59');assert.equal((await io.state()).nextMinutes,20);

};
