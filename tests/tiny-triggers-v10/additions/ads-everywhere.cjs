module.exports=async(page,io,assert)=>{

await io.click(17,249);assert.equal((await io.state()).switches,0);await io.until(s=>s.phase==='ads');for(let i=0;i<3;i++){await io.click(423,195);await io.until(s=>s.phase==='ads');}await io.until(s=>s.phase==='done');assert.equal((await io.state()).station,0);assert.equal((await io.state()).advertising,true);

};
