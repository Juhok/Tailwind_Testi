module.exports = async (page,io,assert) => {

await io.drag([72,88],[278,67],{hold:.3});assert.equal((await io.state()).pepperInS,0);
await io.drag([72,88],[166,67],{hold:1.8});assert.equal((await io.state()).pepperInS,1);await io.shot('during');await io.drag([408,88],[278,67],{hold:1.8});await io.until(s=>s.phase===2);assert.equal((await io.state()).saltInP,1);

};
