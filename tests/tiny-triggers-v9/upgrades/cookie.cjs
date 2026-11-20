module.exports=async(page,io,assert)=>{
 await io.drag([112,115],[274,128],{hold:.2});assert.equal((await io.state()).phase,0);assert.equal((await io.state()).soak,0);
 await io.down(112,115);await io.move(274,128);await io.until(s=>s.soak===1);await io.wait(300);assert.equal((await io.state()).phase,0,'Soaking alone cannot complete the lift');await io.shot('soaked');
 await io.move(310,82);await io.up();assert.equal((await io.state()).phase,1);assert((await io.state()).fragment,'Detached lower half falls back into tea');await io.shot('breaking');await io.until(s=>s.sink>1);
};
