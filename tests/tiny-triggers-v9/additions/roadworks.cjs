module.exports=async(page,io,assert)=>{

await io.click(215,204);assert.equal((await io.state()).phase,'main');await io.drag([66,207],[177,207]);assert.equal((await io.state()).closures,1);await io.down(177,207);await io.move(71,207);await io.move(71,82);await io.move(230,82);await io.up();assert.equal((await io.state()).closures,2);await io.shot('second-closure');await io.down(230,82);await io.move(258,82);await io.move(258,207);await io.move(388,207);await io.up();assert.equal((await io.state()).redLight,true);

};
