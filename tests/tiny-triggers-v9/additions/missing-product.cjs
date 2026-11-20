module.exports=async(page,io,assert)=>{
 await io.drag([240,224],[98,130]);assert.equal((await io.state()).phase,0);
 await io.drag([240,224],[343,135]);await io.until(s=>s.phase===2);
 await io.drag([415,225],[240,171]);assert.equal((await io.state()).phase,2);
 await io.down(240,171);for(const p of [[68,85],[154,85],[240,85],[326,85]]){await io.move(...p);await io.wait(220);}await io.shot('checking-flavors');await io.move(240,171);await io.up();await io.until(s=>s.finished);assert((await io.state()).inspected.length>=3);assert.equal((await io.state()).emptySlot,7);
};
