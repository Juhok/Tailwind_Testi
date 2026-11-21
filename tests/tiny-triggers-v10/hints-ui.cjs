const {chromium}=require('playwright'),{spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..'),port=28000+process.pid%1000;
 const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
 const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/10/`;let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
  fs.mkdirSync('/tmp/tt10-ui',{recursive:true});
  for(const mobile of [false,true]){
   const context=await browser.newContext(mobile?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1100,height:850}});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
   const before=await page.evaluate(()=>({phase:workshop.instance.debug().phase,save:localStorage.getItem('tinyTriggers.v10')}));
   for(let n=1;n<=3;n++){await page.locator('#hint').click();assert.equal(await page.evaluate(()=>hintClicks),n);}
   await page.locator('#hint').click();assert.equal(await page.evaluate(()=>hintClicks),4);
   const guide=await page.evaluate(()=>TinyHints.current(workshop));assert.equal(guide.kind,'drag');
   assert.deepEqual(await page.evaluate(()=>({phase:workshop.instance.debug().phase,save:localStorage.getItem('tinyTriggers.v10')})),before,'Hint does not play or mark progress');
   await page.locator('#stage').screenshot({path:`/tmp/tt10-ui/hint-${mobile?'touch':'mouse'}.png`});
   const box=await page.locator('#stage').boundingBox(), pos=p=>({x:box.x+p[0]*box.width/480,y:box.y+p[1]*box.height/270});
   const from=pos(guide.from),to=pos(guide.to),cdp=mobile?await context.newCDPSession(page):null;
   if(mobile){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});for(let i=1;i<=20;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/20,y:from.y+(to.y-from.y)*i/20}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
   else {await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:20});await page.mouse.up();}
   await page.waitForFunction(()=>finished,null,{timeout:10000});assert(await page.locator('#next').isVisible(),'Overlay does not intercept actual input');
   await page.locator('#reset').click();assert.equal(await page.evaluate(()=>hintClicks),0);
   await page.evaluate(()=>{collectionUnlocked=true;load(0);});for(let n=0;n<4;n++)await page.locator('#hint').click();
   await page.locator('#album').click();assert.equal(await page.evaluate(()=>active),false);await page.locator('#close').click();assert.equal(await page.evaluate(()=>hintClicks),4);
   await page.evaluate(()=>{load(1);});assert.equal(await page.evaluate(()=>hintClicks),0,'Scene switch hides old guidance');
   assert.deepEqual(errors,[]);await context.close();
  }
  const page=await browser.newPage({viewport:{width:1100,height:850}});await page.goto(url);
  const corners=[];
  for(let n=0;n<4;n++){
   const item=await page.evaluate(()=>{active=false;beginTransition(0);transition.ready=false;transition.time=1.1;updateTransition(0);return {corner:transition.logoCorner,...TinyLoading.logoPosition(1.1,480,270,transition.logoCorner)};});
   corners.push(item);await page.locator('.frame').count().then(async count=>{await (count?page.locator('.frame').first():page.locator('#stage')).screenshot({path:`/tmp/tt10-ui/loading-corner-${n}.png`});});
   await page.evaluate(()=>{transition=null;document.querySelector('#loading').hidden=true;});
  }
  assert.equal(new Set(corners.map(p=>p.corner)).size,4);assert.equal(new Set(corners.map(p=>`${p.x<240}:${p.y<135}`)).size,4,'Four successive logos approach four corners');
  for(const width of [320,390,600,1100]){
   await page.setViewportSize({width,height:850});
   const sizes=await page.evaluate(()=>{
    document.querySelector('#loading').hidden=false;
    return TinyLoading.tips.map(tip=>{
     const el=document.querySelector('#loading-tip');el.textContent=tip;
     const box=el.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el);
     const rects=[...range.getClientRects()];return {left:box.left,right:box.right,textLeft:Math.min(...rects.map(r=>r.left)),textRight:Math.max(...rects.map(r=>r.right)),client:el.clientWidth,scroll:el.scrollWidth};
    });
   });
   for(const size of sizes){assert(size.textLeft>=size.left-1 && size.textRight<=size.right+1,`Tip text overflows box at ${width}: ${JSON.stringify(size)}`);assert(size.scroll<=size.client+1);}
   await page.screenshot({path:`/tmp/tt10-ui/loading-${width}.png`});
  }
  console.log('PASS fourth-click visual hints, no progress mutation, real mouse/touch gesture through overlay, Retry/switch/pause lifecycle; four DVD corners and all 12 tips at 320/390/600/1100px');
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
