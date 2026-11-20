module.exports=async(page,io,assert)=>{
 await io.drag([350,170],[350,110]);assert.equal((await io.state()).phase,0);
 await io.drag([108,158],[108,114]);await io.until(s=>s.phase===1);await io.shot('flash');await io.until(s=>s.phase===2);
 await io.drag([108,116],[108,158],{hold:.5});assert.equal((await io.state()).phase,2,'fully off is not the sweet spot');
 await io.down(108,116);await io.move(108,136);await io.until(s=>s.litOnce&&s.brightness>.9);await io.shot('finger-powered');assert.equal(await page.evaluate(()=>finished),false,'holding light does not finish');await io.up();
 await io.until(s=>s.phase===4);assert.equal((await io.state()).brightness,0);await io.until(s=>s.finished);
};
