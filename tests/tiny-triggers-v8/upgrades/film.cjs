module.exports=async(page,io,assert)=>{

await io.drag([240,137],[305,137]);assert.equal((await io.state()).removed,0);await io.drag([201,89],[174,89]);await io.drag([278,105],[307,105]);await io.shot('during');assert.equal((await io.state()).removed,2);await io.drag([207,186],[174,186]);await io.drag([274,193],[307,193]);await io.until(s=>s.removed===4);assert((await io.state()).centerPresent);

};
