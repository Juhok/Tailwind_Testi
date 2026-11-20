module.exports=async(page,io,assert)=>{

await io.click(394,57);assert.equal((await io.state()).loaded,0);for(let i=0;i<3;i++){await io.drag([91,140],[328,149]);assert.equal((await io.state()).loaded,i+1)}assert.equal((await io.state()).phase,'door');await io.drag([238,149],[327,149]);assert.equal((await io.state()).phase,'start');await io.click(394,57);await io.until(s=>s.phase==='look');assert.equal((await io.state()).locked,true);assert.equal((await io.state()).sockVisible,false);await io.shot('locked');await io.drag([112,185],[112,246]);await io.until(s=>s.phase==='done');assert.equal((await io.state()).sockVisible,true);

};
