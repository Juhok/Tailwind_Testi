module.exports=async(page,io,assert)=>{

await io.click(264,180);assert.equal((await io.state()).phase,'standing');await io.drag([111,167],[264,139]);assert.equal((await io.state()).phase,'seated');for(const x of [330,190,330]){await io.drag([264,140],[x,140]);}await io.until(s=>s.phase==='done');assert((await io.state()).squeaks>=4);

};
