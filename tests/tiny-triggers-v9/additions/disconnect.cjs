module.exports=async(page,io,assert)=>{

await io.click(420,200);assert.equal((await io.state()).distance,0);await io.down(66,164);await io.move(290,101);await io.until(s=>s.phase==='frozen');await io.up();const frozen=await io.state();await io.wait(500);assert.equal((await io.state()).world,frozen.world);assert.equal((await io.state()).x,frozen.x);await io.shot('frozen');await io.until(s=>s.phase==='lost');await io.shot('lost');await io.until(s=>s.phase==='menu');assert.equal((await io.state()).networkRequests,0);

};
