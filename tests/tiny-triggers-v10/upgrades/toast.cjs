module.exports=async(page,io,assert)=>{

await io.drag([390,115],[420,210]);assert.equal((await io.state()).phase,0);
await io.down(390,115);await io.move(286,125);await io.move(270,158);await io.shot('jam-spread');let spreading=await io.state();assert(spreading.marksOnBread);let lastMark=spreading.jamMarks.at(-1);assert(Math.hypot(lastMark.x-spreading.contact.x,lastMark.y-spreading.contact.y)<12,'Jam is deposited beneath blade, not handle');await io.move(182,177);await io.up();assert.equal((await io.state()).phase,1);await io.shot('during');
await io.down(390,115);await io.move(286,132);await io.move(269,160);await io.shot('butter-spread');spreading=await io.state();assert(spreading.marksOnBread);lastMark=spreading.butterMarks.at(-1);assert(Math.hypot(lastMark.x-spreading.contact.x,lastMark.y-spreading.contact.y)<12);await io.move(181,180);await io.up();await io.until(s=>s.phase===2);assert((await io.state()).jam>0&&(await io.state()).butter>0);

};
