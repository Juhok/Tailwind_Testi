module.exports=async(page,io,assert)=>{

await io.click(18,20);assert.equal((await io.state()).strikes,0);
await io.click(240,231);assert.equal((await io.state()).hp,16);
await io.click(240,231);assert.equal((await io.state()).hp,16);
await io.until(s=>s.cooldown===1);await io.click(240,231);assert.equal((await io.state()).hp,1);
await io.shot('one-hp');await io.down(240,231);await io.until(s=>s.phase==='lost');await io.up();
assert.equal((await io.state()).playerHp,0);assert((await io.state()).cooldown<1);

};
