module.exports=async(page,io,assert)=>{
 await io.click(240,90);assert.equal((await io.state()).phase,0);
 await io.drag([240,212],[270,195]);assert.equal((await io.state()).phase,0);
 await io.drag([240,212],[240,122]);assert.equal((await io.state()).phase,1);await io.wait(800);await io.shot('converging');
 await io.until(s=>s.finished);assert.equal((await io.state()).customersAhead,5);assert((await io.state()).trolley.y>200);
};
