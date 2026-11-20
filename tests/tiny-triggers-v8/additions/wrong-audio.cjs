module.exports=async(page,io,assert)=>{
 await io.click(264,126);assert.equal((await io.state()).phase,0);
 await io.drag([419,200],[300,230]);assert.equal((await io.state()).wearing,false);
 await io.drag([419,200],[75,116]);assert.equal((await io.state()).phase,1);
 await io.down(264,126);await io.move(130,220);await io.up();assert.equal((await io.state()).phase,1);
 await io.click(264,126);assert.equal((await io.state()).gameRunning,true);await io.wait(700);await io.shot('silent-game');
 await page.waitForFunction(()=>audio&&audio.state==='running'&&gain);
 const peak=await page.evaluate(async()=>{const a=audio.createAnalyser(),sink=audio.createGain();sink.gain.value=0;gain.connect(a);a.connect(sink);sink.connect(audio.destination);const b=new Float32Array(2048);a.fftSize=b.length;let peak=0;const end=performance.now()+500;while(performance.now()<end){a.getFloatTimeDomainData(b);for(const v of b)peak=Math.max(peak,Math.abs(v));await new Promise(r=>setTimeout(r,25));}gain.disconnect(a);a.disconnect();sink.disconnect();return peak;});
 assert(peak<.0001,'Actual master output stays silent with wrong device selected');
 await io.click(341,63);assert.equal((await io.state()).selectedDevice,'monitor');await io.shot('wrong-route');await io.until(s=>s.finished);
};
