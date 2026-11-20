module.exports=async(page,io,assert)=>{
 await io.click(118,185);assert.equal((await io.state()).phase,0,'Finish document first');
 await io.click(355,57);assert.equal((await io.state()).phase,1);
 await io.click(118,185);assert.equal((await io.state()).phase,2);
 await io.down(178,143);await io.move(320,211);await io.up();assert.equal((await io.state()).phase,2,'cancelled power click does not start updates');
 await io.click(178,143);await io.until(s=>s.progress>15&&s.progress<80);await io.shot('installing');await io.until(s=>s.phase===4);
 const stuck=await io.state();assert.equal(stuck.progress,99);await io.wait(800);const later=await io.state();assert.equal(later.progress,99);assert(later.gearAngle>stuck.gearAngle);assert(later.computerOn);await io.shot('stuck');await io.until(s=>s.finished);
};
