module.exports=async(page,io,assert)=>{
 const original=(await io.state()).afkPosition;
 await io.drag([104,162],[323,164]);assert.equal((await io.state()).phase,0,'match starts first');
 await io.down(240,214);await io.move(60,246);await io.up();assert.equal((await io.state()).phase,0);
 await io.click(240,214);assert.equal((await io.state()).phase,1);await io.drag([104,153],[175,80]);assert.equal((await io.state()).phase,1,'wrong rally drop cancels');
 await io.drag([104,153],[323,164]);await io.until(s=>s.progress>.15&&s.progress<.9);await io.shot('four-leave');assert.deepEqual((await io.state()).afkPosition,original);
 await io.until(s=>s.phase===3);assert.equal((await io.state()).playersDeparted,4);await io.until(s=>s.clock>400&&s.clock<850);await io.shot('fast-forward');await io.until(s=>s.phase===4);assert.equal((await io.state()).clock,900);assert.deepEqual((await io.state()).afkPosition,original);await io.until(s=>s.finished);
};
