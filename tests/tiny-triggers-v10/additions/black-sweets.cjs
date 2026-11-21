module.exports=async(page,io,assert)=>{

await io.click(280,170);assert.equal((await io.state()).phase,'share');await io.drag([103,149],[210,149]);assert.equal((await io.state()).phase,'reach');await io.drag([94,226],[210,220]);assert.equal((await io.state()).red,true);await io.drag([94,226],[280,170]);await io.until(s=>s.phase==='done');assert.equal((await io.state()).red,false);assert.equal((await io.state()).blackSweets,6);

};
