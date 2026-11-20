module.exports=async(page,io,assert)=>{
 await io.click(240,194);assert.equal((await io.state()).phase,'order');
 await io.drag([240,110],[174,103]);assert.equal((await io.state()).phase,'order');
 await io.drag([240,110],[240,192]);assert.equal((await io.state()).phase,'screens');
 await io.down(240,194);await io.move(400,230);await io.up();assert.equal((await io.state()).answered,0);
 for(let i=0;i<10;i++){await io.until(s=>s.transition===0);await io.click(240,194);assert.equal((await io.state()).answered,i+1);if(i===5)await io.shot('sixth-screen');if(i<9)assert.equal((await io.state()).phase,'screens');}
 await io.until(s=>s.phase==='done');assert.equal((await io.state()).burgerCount,1);assert.equal((await io.state()).total,4.5);
};
