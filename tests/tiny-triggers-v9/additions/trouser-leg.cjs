module.exports=async(page,io,assert)=>{
 await io.click(276,227);assert.equal((await io.state()).phase,0);
 await io.drag([240,187],[240,72]);assert.equal((await io.state()).phase,1);assert.equal((await io.state()).stuck,true);await io.shot('stuck');
 await io.drag([240,74],[240,190]);assert.equal((await io.state()).phase,2);
 await io.drag([276,227],[338,215]);assert.equal((await io.state()).phase,3);assert.equal((await io.state()).untwist,1);await io.shot('untwisted');
 await io.drag([240,187],[240,72]);await io.until(s=>s.finished);assert.equal((await io.state()).phase,4);
};
