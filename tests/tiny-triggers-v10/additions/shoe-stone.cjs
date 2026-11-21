module.exports=async(page,io,assert)=>{
 await io.click(159,185);assert.equal((await io.state()).phase,'walk');
 // Reproduce the reported far-right dead end.
 await io.drag([159,185],[479,185]);assert.equal((await io.state()).phase,'pain');
 let s=await io.state();assert(s.shoe.x>=370);
 await io.drag([s.shoe.x,s.shoe.y],[s.shoe.x,100]);assert.equal((await io.state()).phase,'flip');
 await io.until(s=>s.phase==='flip'); // Pause/resume checkpoint between gestures.
 await io.click(305,123);assert.equal((await io.state()).phase,'flip');assert.equal((await io.state()).shakes,0);
 await io.drag([262,98],[352,98]);assert.equal((await io.state()).phase,'shake');assert.equal((await io.state()).flipped,true);
 await io.shot('upside-down');
 s=await io.state();await io.down(s.shoe.x,s.shoe.y);for(const x of [355,235,355,235])await io.move(x,123);await io.up();
 assert.equal((await io.state()).phase,'turnback');assert.equal((await io.state()).flipped,true);
 s=await io.state();await io.drag([s.shoe.x+43,s.shoe.y+25],[s.shoe.x-47,s.shoe.y+25]);
 assert.equal((await io.state()).phase,'replace');assert.equal((await io.state()).rotation,0);
 await io.shot('shaken-upright');s=await io.state();await io.drag([s.shoe.x,s.shoe.y],[180,185]);
 for(let i=0;i<3;i++){s=await io.state();await io.drag([s.shoe.x,185],[479,185]);}
 s=await io.state();assert.equal(s.phase,'done');assert.equal(s.steps,3);assert.equal(s.message,'There it is. Again.');
 assert.equal(s.stoneStillInside,true);
};
