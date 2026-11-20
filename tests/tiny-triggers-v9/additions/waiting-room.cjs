module.exports=async(page,io,assert)=>{

await io.click(302,166);assert.equal((await io.state()).phase,'rush');await io.drag([175,205],[102,149]);assert.equal((await io.state()).phase,'seat');await io.drag([165,194],[302,166]);await io.until(s=>s.minutes>15);await io.shot('still-waiting');assert.equal((await io.state()).called,42);await io.until(s=>s.phase==='done');assert.equal((await io.state()).minutes,40);

};
