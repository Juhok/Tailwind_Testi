module.exports=async(page,io,assert)=>{
 await io.click(30,120);assert.equal((await io.state()).phase,0);
 await io.down(240,136);await io.move(370,215);await io.up();assert.equal((await io.state()).phase,0,'dragging away cancels offline button');
 await io.click(240,136);await io.until(s=>s.spinner);await io.shot('spinner');
 await io.click(182,148);assert.equal((await io.state()).phase,1,'spinner ignores premature retry');
 await io.until(s=>s.errorVisible);assert.deepEqual((await io.state()).options,['Retry','Quit']);await io.shot('error');await io.until(s=>s.finished);
};
