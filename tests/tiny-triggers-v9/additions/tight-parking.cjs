module.exports=async(page,io,assert)=>{
  const cancelTouch = async (from,to) => {
    const cdp=await page.context().newCDPSession(page), r=await page.locator('#stage').boundingBox();
    const p=([x,y])=>({x:r.x+x*r.width/480,y:r.y+y*r.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(from)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(to)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
    await cdp.detach();
  };
  await io.click(248,100);
  assert.equal((await io.state()).phase,'parking');
  if(process.env.MOBILE){
    await cancelTouch([350,225],[248,102]);
    const s=await io.state();assert.equal(s.phase,'parking');assert.equal(s.x,350);assert.equal(s.y,225);
  }
  await io.drag([350,225],[350,101]);
  assert((await io.state()).y>=211,'Neighbouring car blocks direct approach');
  assert.equal((await io.state()).parked,false);
  await io.drag([350,211],[248,211]);
  await io.shot('aligned');
  await io.drag([248,211],[248,102]);
  assert.equal((await io.state()).parked,true);
  await io.until(s=>s.phase==='door');
  if(process.env.MOBILE){
    await cancelTouch([358,160],[275,160]);
    assert.equal((await io.state()).phase,'door');assert.equal((await io.state()).doorOpening,0);
  }
  await io.click(358,160);
  assert.equal((await io.state()).phase,'door');
  await io.drag([358,160],[340,160]);
  assert.equal((await io.state()).phase,'door','Small handle nudge is not the full attempt');
  await io.drag([358,160],[275,160]);
  assert.equal((await io.state()).doorBlocked,true);
  await io.shot('blocked-door');
  await io.until(s=>s.phase==='squeeze');
  assert.equal((await io.state()).cleanTrousers,true);
  if(process.env.MOBILE){
    await cancelTouch([356,180],[260,217]);
    assert.equal((await io.state()).phase,'squeeze');assert.equal((await io.state()).stain,0);
  }
  await io.drag([356,180],[262,180]);
  assert.equal((await io.state()).phase,'squeeze','Must move down through the gap, not teleport sideways');
  assert.equal((await io.state()).stain,0);
  await io.down(356,180);
  await io.move(280,207);
  assert((await io.state()).squeeze>.75);
  await io.shot('squeezing');
  await io.move(260,217);
  await io.up();
  await io.until(s=>s.phase==='done');
  const s=await io.state();
  assert.equal(s.stain,1);
  assert.equal(s.cleanTrousers,false);
  assert.equal(s.doorOpening,1,'Door is still obstructed, never magically widens');
};
