module.exports=async(page,io,assert)=>{
 let s=await io.state();assert.equal(s.phase,'sealed');assert(s.pack.width>s.card.width&&s.pack.height>s.card.height);
 assert(s.card.y>=s.pack.y&&s.card.y+s.card.height<=s.pack.y+s.pack.height,'Entire card fits in sealed package');
 await io.drag([240,135],[240,20]);assert.equal((await io.state()).phase,'sealed');
 await io.drag([168,68],[146,68]);assert.equal((await io.state()).phase,'sealed');assert.equal((await io.state()).tear,0);
 // The left edge can tear fully; retry and exercise the opposite edge independently.
 await io.drag([168,68],[75,60]);await io.until(s=>s.phase==='reveal');assert.equal((await io.state()).tearDirection,-1);await io.shot('left-edge-open');
 await page.locator('#reset').click();await io.until(s=>s.phase==='sealed');
 await io.down(317,68);await io.move(360,64);s=await io.state();assert(s.tear>.3&&s.tear<.8);await io.shot('tear');
 await io.move(410,60);await io.up();await io.until(s=>s.phase==='reveal');assert.equal((await io.state()).tearDirection,1);
 await io.click(240,78);assert.equal((await io.state()).reveal,0);
 await io.down(240,78);await io.move(240,33);await io.until(s=>s.reveal>.45);await io.up();
 await io.wait(250);s=await io.state();assert(s.reveal>.45&&s.reveal<=.51);assert.equal(await page.evaluate(()=>finished),false);await io.shot('half-revealed');
 await io.drag([240,58],[240,5]);await io.until(s=>s.phase==='done');s=await io.state();assert.equal(s.reveal,1);
 assert(s.leftBorder>=18&&s.rightBorder<=2);assert.equal(s.printWidth,115);assert(s.sparkling&&s.misprintVisible);await io.shot('misprinted-rare');
};
