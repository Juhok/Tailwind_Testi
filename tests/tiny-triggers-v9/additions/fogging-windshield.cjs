module.exports=async(page,io,assert)=>{
 const cancelDrag=async(from,to)=>{const cdp=await page.context().newCDPSession(page),b=await page.locator('#stage').boundingBox();const pt=([x,y])=>({x:b.x+x*b.width/480,y:b.y+y*b.height/270});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pt(from)]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[pt(to)]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();};
 await io.drag([305,230],[425,230]);assert.equal((await io.state()).phase,'parked');assert.equal((await io.state()).fan,0,'Vent cannot skip the start');
 await io.drag([242,226],[280,226]);assert.equal((await io.state()).phase,'parked','A cancelled START press does not set off');
 await io.click(130,240);assert.equal((await io.state()).phase,'parked');
 await io.click(242,226);assert.equal((await io.state()).phase,'driving');assert.equal((await io.state()).fog,0);
 await io.until(s=>s.fog>.45);await io.shot('fog-creeping');
 await io.until(s=>s.phase==='fogged');assert.equal((await io.state()).tinyPatch,true);assert.equal((await io.state()).fog,1);await io.shot('tiny-patch');
 await io.drag([305,230],[280,230]);assert.equal((await io.state()).phase,'fogged');assert.equal((await io.state()).fan,0);
 await io.drag([305,230],[363,230]);assert.equal((await io.state()).phase,'fogged');assert.equal((await io.state()).fan,0,'Incomplete adjustment resets');
 if(process.env.MOBILE){await cancelDrag([305,230],[425,230]);assert.equal((await io.state()).phase,'fogged');assert.equal((await io.state()).fan,0,'Cancelled full drag does not clear');}
 await io.drag([305,230],[425,230],{steps:22});assert.equal((await io.state()).phase,'clearing');assert.equal((await io.state()).fan,1);
 await io.until(s=>s.phase==='clearing'&&s.fog<.5);await io.shot('vent-clearing');
 await io.until(s=>s.phase==='clear');assert.equal((await io.state()).fog,0);assert.equal((await io.state()).clearedOnce,true);await io.shot('briefly-clear');
 await io.until(s=>s.phase==='refog'&&s.fog>.4);await io.shot('returning');
 await io.until(s=>s.finished);const s=await io.state();assert.equal(s.phase,'done');assert.equal(s.fan,1);assert.equal(s.refogged,true);assert(s.fog>=.8);assert.equal(s.controlsVisible,true);
};
