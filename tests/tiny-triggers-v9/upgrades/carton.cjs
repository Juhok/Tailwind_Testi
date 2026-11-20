module.exports=async(page,io,assert)=>{
await io.down(190,75);await io.move(165,60);await io.cancel();assert.equal((await io.state()).phase,0,"Cancelled gesture preserves initial phase");

await io.drag([288,103],[365,52]);assert.equal((await io.state()).phase,0);await io.down(190,75);await io.move(151,54);await io.wait(150);await io.shot('during');await io.move(105,45);await io.up();await io.until(s=>s.phase===1);

};
