module.exports=async(page,io,assert)=>{
 await io.click(215,204);assert.equal((await io.state()).phase,'main');await io.drag([66,207],[177,207]);assert.equal((await io.state()).closures,1);
 await io.down(177,207);await io.move(71,207);await io.until(s=>Math.abs(Math.abs(s.heading)-Math.PI)<.1);assert(Math.abs(Math.abs((await io.state()).heading)-Math.PI)<.1,'Car faces left while reversing route');
 await io.move(71,82);await io.until(s=>Math.abs(s.heading+Math.PI/2)<.1);assert(Math.abs((await io.state()).heading+Math.PI/2)<.1,'Car points up the vertical street: '+JSON.stringify(await io.state()));await io.shot('vertical-street');
 await io.move(274,82);await io.up();let s=await io.state();assert.equal(s.closures,2);assert.equal(s.heading,0,'Orientation persists after release');assert(s.secondBarrier.x-33>284,'Barrier clears the entire intersection');await io.shot('second-closure');
 await io.down(274,82);await io.move(260,82);await io.move(260,207);await io.until(s=>Math.abs(s.heading-Math.PI/2)<.1);assert(Math.abs((await io.state()).heading-Math.PI/2)<.1,'Car points down the vertical road');
 await io.move(388,207);await io.up();assert.equal((await io.state()).redLight,true);assert.equal((await io.state()).heading,0);assert.equal((await io.state()).verticalMarkings,true);
};
