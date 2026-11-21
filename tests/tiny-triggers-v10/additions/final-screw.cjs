module.exports=async(page,io,assert)=>{

await io.drag([402,66],[330,96]);assert.equal((await io.state()).phase,'shelf');await io.drag([365,225],[217,146]);assert.equal((await io.state()).phase,'tool');await io.drag([402,66],[330,96]);assert.equal((await io.state()).phase,'turn');for(let i=0;i<3;i++){await io.drag([330,96],[395,96]);await io.until(s=>s.phase==='turn'||s.phase==='done');assert.equal((await io.state()).attempts,i+1);if(i===0)await io.shot('stripped-head');}assert.equal((await io.state()).damaged,true);

};
