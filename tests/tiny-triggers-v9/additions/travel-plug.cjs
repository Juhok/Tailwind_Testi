module.exports=async(page,io,assert)=>{
 await io.click(254,228);assert.equal((await io.state()).turn,0,'not unpacked yet');
 await io.drag([132,201],[215,245]);assert.equal((await io.state()).attempts,0,'wrong drop returns charger');
 await io.drag([132,201],[349,111]);await io.until(s=>s.attempts===1&&!s.bounce);await io.shot('wrong-shape');assert.equal((await io.state()).charging,false);
 await io.drag([260,166],[349,111]);await io.until(s=>s.attempts===2&&!s.bounce);assert.equal((await io.state()).orientations.length,1,'same angle is not a new orientation');
 await io.click(254,228);await io.wait(350);await io.drag([260,166],[349,111]);await io.until(s=>s.orientations.length===2&&!s.bounce);await io.shot('turned-rejected');
 await io.click(254,228);await io.wait(350);await io.drag([260,166],[349,111]);await io.until(s=>s.finished);assert.equal((await io.state()).battery,1);assert.equal((await io.state()).charging,false);
};
