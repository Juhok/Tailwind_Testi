module.exports=async(page,io,assert)=>{
 await io.click(248,100);assert.equal((await io.state()).phase,'parking');
 await io.drag([350,225],[350,101]);assert((await io.state()).y>=211,'Neighbour blocks direct approach');
 await io.drag([350,211],[248,211]);await io.shot('aligned');await io.drag([248,211],[248,102]);
 assert.equal((await io.state()).parked,true);await io.until(s=>s.phase==='door');
 let s=await io.state();assert.equal(s.projection,'top-down');assert(s.zoom>1.8,'Zoom retains overhead projection');
 const h=s.handle;await io.click(h.x,h.y);assert.equal((await io.state()).phase,'door');
 await io.drag([h.x,h.y],[h.x-9,h.y]);assert.equal((await io.state()).phase,'door');
 await io.drag([h.x,h.y],[h.x-40,h.y]);assert.equal((await io.state()).doorBlocked,true);await io.shot('blocked-door');
 await io.until(s=>s.phase==='squeeze');s=await io.state();assert.equal(s.cleanTrousers,true);const d=s.driver;
 await io.drag([d.x,d.y],[d.x-19,d.y]);assert.equal((await io.state()).squeeze,0,'Cannot teleport sideways out of cars');
 await io.down(d.x,d.y);await io.move(d.x-19,d.y+75);s=await io.state();assert(s.squeeze>.6);assert(s.stain>0);await io.shot('squeezing');
 await io.move(d.x-19,d.y+101);await io.up();await io.until(s=>s.phase==='done');s=await io.state();
 assert.equal(s.projection,'top-down');assert.equal(s.stain,1);assert.equal(s.cleanTrousers,false);assert(s.doorAngle<.3,'Door stays constrained');
};
