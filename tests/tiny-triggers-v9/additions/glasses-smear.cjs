module.exports=async(page,io,assert)=>{

await io.drag([170,145],[230,145]);assert.equal((await io.state()).haze,0);await io.down(391,214);await io.move(170,145);for(const x of [125,213,127,213])await io.move(x,145);await io.shot('wiping');await io.up();await io.until(s=>s.phase==='done');assert.equal((await io.state()).haze,1);assert.equal((await io.state()).otherLensClear,true);

};
