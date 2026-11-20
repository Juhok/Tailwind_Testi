module.exports=async(page,io,assert)=>{
 await io.click(240,120);assert.equal((await io.state()).hp,3);
 for(let i=0;i<3;i++)await io.drag([180,105],[295,150]);await io.until(s=>s.phase===2);assert.equal((await io.state()).hp,0);await io.shot('reward');await io.click(240,116);assert.equal((await io.state()).phase,2);await io.drag([240,116],[260,120]);assert.equal((await io.state()).phase,2);
 await io.drag([240,113],[105,167]);await io.until(s=>s.finished);const s=await io.state();assert.equal(s.mageNeed,true);assert.equal(s.mageRoll,99);assert.equal(s.cannotEquip,true);
};
