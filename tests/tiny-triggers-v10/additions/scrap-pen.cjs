module.exports=async(page,io,assert)=>{
 await io.drag([120,145],[210,145]);assert.equal((await io.state()).cardTravel,0);
 await io.down(291,201);
 for(let i=0;i<3;i++){await io.move(110,130+i*11);await io.wait(80);await io.move(211,137+i*11);await io.wait(80)}
 assert.equal((await io.state()).phase,'scrap');
 for(let i=0;i<4;i++){await io.move(327,125+i*13);await io.wait(80);await io.move(421,132+i*13);await io.wait(80)}
 assert.equal((await io.state()).phase,'return');await io.shot('works-on-scrap');
 for(let i=0;i<3;i++){await io.move(110,130+i*11);await io.wait(80);await io.move(211,137+i*11);await io.wait(80)}
 await io.up();await io.until(s=>s.phase==='done');assert((await io.state()).inkPoints>3);assert.equal((await io.state()).cardInk,0);
};
