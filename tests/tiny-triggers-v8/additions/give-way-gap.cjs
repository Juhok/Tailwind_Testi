module.exports=async(page,io,assert)=>{
  await io.click(240,224);
  assert.equal((await io.state()).phase,0,'tap is not an approach');
  await io.drag([240,224],[270,237]);
  assert.equal((await io.state()).phase,0,'dragging away does not approach');
  if(process.env.MOBILE){
    const cdp=await page.context().newCDPSession(page),r=await page.locator('#stage').boundingBox();
    const p=(x,y)=>({x:r.x+x*r.width/480,y:r.y+y*r.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(240,224)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(240,188)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();
    assert.equal((await io.state()).phase,0,'cancelled approach does not advance');
    assert.equal((await io.state()).carY,224,'cancelled approach restores car');
  }
  await io.drag([240,224],[240,188]);
  assert.equal((await io.state()).phase,1);
  await io.drag([240,200],[240,165]);
  assert.equal((await io.state()).attempts,0,'traffic must clear before a committed attempt');
  await io.until(s=>s.gapOpen);
  await io.shot('first-opening');
  await io.click(240,200);
  assert.equal((await io.state()).attempts,0,'neutral tap is not a committed move');
  await io.drag([240,200],[240,167]);
  assert.equal((await io.state()).attempts,1);
  assert.equal((await io.state()).phase,2);
  await io.wait(1000);await io.shot('first-cutoff');
  await io.until(s=>s.phase===3&&s.gapOpen);
  await io.drag([240,200],[240,165]);
  assert.equal((await io.state()).attempts,2);
  await io.until(s=>s.phase===5&&s.gapOpen);
  assert.equal((await io.state()).oppositeTookGap,false);
  await io.shot('huge-gap');
  if(process.env.MOBILE){
    const cdp=await page.context().newCDPSession(page),r=await page.locator('#stage').boundingBox();
    const p=(x,y)=>({x:r.x+x*r.width/480,y:r.y+y*r.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(240,200)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(240,165)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();
    assert.equal((await io.state()).attempts,2,'cancelled commitment does not steal the huge gap');
    assert.equal((await io.state()).phase,5);
  }
  await io.drag([240,200],[240,165]);
  assert.equal((await io.state()).phase,6);
  await io.until(s=>s.oppositeTookGap&&s.oppositeProgress<1.5);
  await io.shot('opposite-turn');
  await io.until(s=>s.finished);
  const final=await io.state();
  assert.equal(final.attempts,3);
  assert.equal(final.waiting,true,'player remains safely behind the give-way line');
  assert.equal(final.oppositeTookGap,true);
  assert(final.traffic>0,'traffic returns after the stolen opening');
};
