module.exports = async (page, io, assert) => {
  const cancelDrag = async (from,to,hold=0) => {
    const cdp=await page.context().newCDPSession(page),box=await page.locator('#stage').boundingBox();
    const point=([x,y])=>({x:box.x+x*box.width/480,y:box.y+y*box.height/270});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(from)]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(to)]});
    if(hold)await io.wait(hold);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
    await cdp.detach();
  };
  // The lamp and placemat do not skip unpacking.
  await io.drag([361,70],[300,160]);
  await io.click(247,165);
  assert.equal((await io.state()).phase, 'packed');
  await io.drag([110,134],[172,90]);
  assert.deepEqual((await io.state()).cup, {x:110,y:153}, 'Missing the mat returns the cup to the bag');
  assert.equal((await io.state()).unpacked, false);
  if (process.env.MOBILE) {
    await cancelDrag([110,134],[220,140]);
    assert.deepEqual((await io.state()).cup,{x:110,y:153},'Cancelled unpack restores cup');
    assert.equal((await io.state()).phase,'packed');
  }
  await io.drag([110,134],[247,146],{steps:25});
  await io.until(s=>s.phase==='inspect');
  assert.equal((await io.state()).punctured,true);
  assert.equal((await io.state()).smearVisible,false);
  await io.shot('puncture');
  // A click and tilting away from the lamp do not reveal the underside.
  await io.click(247,150);
  await io.drag([247,150],[170,150],{hold:.8});
  assert.equal((await io.state()).phase,'inspect');
  assert.equal((await io.state()).smearVisible,false);
  await io.wait(400);
  await io.drag([247,150],[272,150],{hold:.7});
  assert.equal((await io.state()).phase,'inspect','Shallow tilt does not catch the inspection light');
  await io.wait(400);
  if (process.env.MOBILE) {
    await cancelDrag([247,150],[329,150],950);
    assert.equal((await io.state()).phase,'inspect','Cancelled inspection does not finish');
    assert.equal((await io.state()).reveal,0);
  }
  await io.down(247,150);await io.move(329,150);await io.wait(1100);
  assert((await io.state()).angle>.48,'The whole cup tilts toward the lamp');
  assert.equal((await io.state()).phase,'inspect','Release is required');
  assert.equal((await io.state()).smearVisible,true);
  await io.shot('tilted-smear');
  await io.up();
  await io.until(s=>s.phase==='done');
  const result=await io.state();
  assert.equal(result.smearVisible,true);
  assert.equal(result.foilStillAttached,true);
  assert.equal(result.cause,'unknown');
};
