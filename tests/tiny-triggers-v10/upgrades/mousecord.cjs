module.exports=async(page,io,assert)=>{

await io.drag([217,218],[290,218]);assert.equal((await io.state()).phase,0);await io.down(217,218);await io.move(345,215);await io.wait(150);await io.shot('during');assert((await io.state()).mx<=337);await io.move(418,215);await io.up();await io.until(s=>s.phase===1);assert((await io.state()).cursorShort);

};
