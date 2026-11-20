module.exports=async(page,io,assert)=>{
 await io.click(400,240);await io.click(183,211);assert.equal((await io.state()).phase,0);
 await io.drag([183,211],[183,183]);await io.until(s=>s.phase===1);
 const before=(await io.state()).characterX;await io.wait(650);assert((await io.state()).characterX>before+3);
 await io.down(183,211);await io.move(183,223);await io.until(s=>s.phase===2);const fixed=(await io.state()).characterX;await io.wait(400);assert(Math.abs((await io.state()).characterX-fixed)<2);await io.shot('counter-held');
 await io.up();await io.until(s=>s.finished);assert.equal((await io.state()).wandering,true);assert((await io.state()).characterX>fixed+15);
};
