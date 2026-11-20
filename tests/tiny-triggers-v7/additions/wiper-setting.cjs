module.exports=async(page,io,assert)=>{
 await io.click(183,244);assert.equal((await io.state()).phase,0);
 await io.drag([374,205],[420,205]);assert.equal((await io.state()).phase,0,'wrong direction does not activate');
 await io.drag([374,205],[352,209]);assert.equal((await io.state()).phase,0,'partial pull springs back');assert.equal((await io.state()).pull,0);
 await io.drag([374,205],[318,215]);await io.until(s=>s.spray>.5&&s.drops>5);await io.shot('washer-fountain');assert.equal((await io.state()).frontWipersMoving,false);
 await io.until(s=>s.rearCycles>=1);await io.shot('rear-scrape');assert.equal((await io.state()).rearGlassWet,false);await io.until(s=>s.finished);
};
