module.exports = async (page, io, assert) => {
  await io.drag([141,143],[250,130]);
  assert.equal((await io.state()).phase,0,'sealed bag cannot pour');
  await io.click(187,69);
  assert.equal((await io.state()).phase,0,'tap cannot tear the seal');
  await io.drag([187,69],[156,94]);
  assert.equal((await io.state()).phase,0,'pulling the wrong way keeps the seam intact');
  if(process.env.MOBILE){
    const cdp=await page.context().newCDPSession(page);
    const r=await page.locator('#stage').boundingBox();
    const p=(x,y)=>({x:r.x+x*r.width/480,y:r.y+y*r.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(187,69)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(235,40)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
    await cdp.detach();
    assert.equal((await io.state()).phase,0,'cancelled tear never opens the bag');
    assert.equal((await io.state()).tear,0,'cancel restores the sealed seam');
  }
  await io.drag([187,69],[253,28]);
  assert.equal((await io.state()).phase,1);
  await io.shot('opened');
  await io.drag([141,143],[174,143]);
  assert.equal((await io.state()).phase,1,'not inverted enough to empty');
  assert.equal((await io.state()).nuggetsReleased,0);
  await io.drag([141,143],[254,108]);
  assert.equal((await io.state()).phase,2);
  await io.until(s=>s.nuggetsReleased>0&&s.nuggetsLanded<4);
  await io.shot('pour');
  await io.until(s=>s.phase===3);
  assert.equal((await io.state()).nuggetsLanded,4,'only a tiny handful comes out');
  assert.equal((await io.state()).crumbReleased,false,'no last crumb without a shake');
  await io.click(222,108);await io.wait(250);
  assert.equal((await io.state()).phase,3,'click is not a shake');
  await io.drag([222,108],[253,108]);
  assert.equal((await io.state()).phase,3,'one movement is not a shake');
  if(process.env.MOBILE){
    const cdp=await page.context().newCDPSession(page),r=await page.locator('#stage').boundingBox();
    const p=(x,y)=>({x:r.x+x*r.width/480,y:r.y+y*r.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(222,108)]});
    for(const x of [256,188,257,190,253])await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(x,108)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await cdp.detach();
    assert.equal((await io.state()).phase,3,'cancelled shaking cannot release the last crumb');
    assert.equal((await io.state()).swings,0,'cancelled shaking restores the committed shake count');
  }
  await io.shot('handful');
  await io.down(222,108);
  for(const x of [256,188,257,190,253])await io.move(x,108);
  await io.up();
  await io.until(s=>s.finished);
  const result=await io.state();
  assert.equal(result.nuggetsLanded,4,'shaking does not invent more nuggets');
  assert.equal(result.crumbLanded,true,'one final crumb lands on the tray');
  assert.equal(result.phase,5);
};
