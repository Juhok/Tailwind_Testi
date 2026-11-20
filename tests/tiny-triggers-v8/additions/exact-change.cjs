module.exports=async(page,io,assert)=>{
 await io.click(387,103);await io.wait(300);assert.equal((await io.state()).coins,0);
 await io.drag([414,224],[405,198]);await io.until(s=>s.coins>=2);assert((await io.state()).coins<9);await io.shot('counting');
 await io.until(s=>s.phase===2);assert.equal((await io.state()).coins,9);assert.equal((await io.state()).paidCents,90);assert.equal((await io.state()).shortCents,10);await io.shot('one-short');
 await io.until(s=>s.finished);assert.equal((await io.state()).pocketSearch,true);
};
