module.exports=async(page,io,assert)=>{

await io.click(307,181);assert.equal((await io.state()).phase,'approach');
await io.drag([74,189],[265,189]);await io.until(s=>s.phase==='collect');
await io.down(307,183);await io.until(s=>s.progress>.75);await io.shot('nearly-collected');await io.until(s=>s.phase==='snatched');await io.up();assert.equal((await io.state()).wood,false);assert.equal((await io.state()).quest,9);

};
