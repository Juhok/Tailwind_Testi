module.exports=async(page,io,assert)=>{

await io.drag([108,135],[320,153]);assert.equal((await io.state()).phase,0);await io.drag([145,135],[61,135]);await io.until(s=>s.zipFront);await io.shot('during');await io.drag([108,135],[320,153]);await io.until(s=>s.phase===2&&s.settle>.65);const placed=await io.state();assert(placed.cushionBottom>=172&&placed.cushionBottom<=176,'Cushion rests on back of sofa seat');assert(placed.zipY>placed.y+20,'Zipper sits close to cushion bottom');

};
