module.exports=async(page,io,assert)=>{
 await io.click(240,54);assert.equal((await io.state()).phase,0);
 await io.drag([240,54],[273,54]);assert.equal((await io.state()).phase,0);
 await io.drag([240,54],[314,54]);assert.equal((await io.state()).phase,1);await io.wait(700);await io.shot('fountain');assert((await io.state()).foam>0);
 await io.drag([309,46],[241,64]);assert.equal((await io.state()).phase,2);await io.drag([240,57],[180,57]);await io.until(s=>s.finished);assert.equal((await io.state()).tight,1);assert.equal((await io.state()).wetHands,true);
};
