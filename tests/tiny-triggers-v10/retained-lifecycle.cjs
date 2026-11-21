const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..'),port=25500+process.pid%1000;
 const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
 const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/10/`;
 let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
  for(const mobile of[false,true]){
   const context=await browser.newContext(mobile?{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1}:{viewport:{width:1100,height:850}});
   await context.addInitScript(()=>{localStorage.setItem('tinyTriggers.v10.collectionUnlocked','true');localStorage.setItem('tinyTriggers.v10.collectionGrouped','false');});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>typeof chapterBook!=='undefined');
   const cdp=mobile?await context.newCDPSession(page):null;let touching=false;
   const point=async(x,y)=>{const b=await page.locator('#stage').boundingBox();return{x:b.x+x*b.width/480,y:b.y+y*b.height/270};};
   const down=async(x,y)=>{const p=await point(x,y);if(cdp){touching=true;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});}else{await page.mouse.move(p.x,p.y);await page.mouse.down();}};
   const move=async(x,y)=>{const p=await point(x,y);if(cdp&&touching)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p]});else await page.mouse.move(p.x,p.y,{steps:12});};
   const up=async()=>{if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});touching=false;}else await page.mouse.up();};
   const drag=async(a,b)=>{await down(...a);for(let i=1;i<=12;i++)await move(a[0]+(b[0]-a[0])*i/12,a[1]+(b[1]-a[1])*i/12);await up();};
   const click=async(x,y)=>{await down(x,y);await up();};
   const press=async(selector)=>mobile?await page.locator(selector).tap():await page.locator(selector).click();
   const state=()=>page.evaluate(()=>workshop.instance.debug());
   const choose=async title=>{await press('#album');await page.waitForFunction(()=>document.querySelector('#collection').open);const b=page.locator('#scene-list button').filter({hasText:title});assert.equal(await b.count(),1);if(mobile)await b.tap();else await b.click();await page.waitForFunction(title=>!transition&&document.querySelector('#title').textContent===title,title);};
   const notFinished=async()=>assert.equal(await page.evaluate(()=>finished),false);
   const resetWithKeyboard=async()=>{await page.locator('#reset').focus();await page.keyboard.press('Enter');};

   await choose('The Suddenly Busy Crossing');await drag([240,242],[240,202]);
   await page.waitForFunction(()=>workshop.instance.debug().trafficTime>.65);
   await press('#album');const traffic=await state();await page.waitForTimeout(700);
   assert.deepEqual(await state(),traffic,'Collection freezes crossing time, car positions and pedestrian');await notFinished();
   await press('#close');await page.waitForFunction(n=>workshop.instance.debug().trafficTime>n+.25,traffic.trafficTime);
   await press('#reset');assert.equal((await state()).phase,'approach');assert.equal((await state()).vehicles,0);await page.waitForTimeout(400);await notFinished();

   await choose('The Fogging Windshield');await click(242,226);await page.waitForFunction(()=>workshop.instance.debug().fog>.18);
   await press('#album');const fog=await state();await page.waitForTimeout(700);
   assert.deepEqual(await state(),fog,'Collection freezes windshield fog, road motion and phase timer');
   await press('#close');await page.waitForFunction(n=>workshop.instance.debug().fog>n+.05,fog.fog);
   await page.waitForFunction(()=>workshop.instance.debug().phase==='fogged');await drag([305,230],[425,230]);assert.equal((await state()).phase,'clearing');
   await press('#reset');assert.equal((await state()).phase,'parked');assert.equal((await state()).fog,0);
   await page.waitForTimeout(2300);assert.equal((await state()).phase,'parked');assert.equal((await state()).clearedOnce,false);await notFinished();

   await choose('The Mystery Hole in the Lid');await drag([110,134],[247,146]);assert.equal((await state()).phase,'settling');
   await resetWithKeyboard();await page.waitForTimeout(800);assert.equal((await state()).phase,'packed');await notFinished();
   await down(110,134);await move(235,141);assert.equal((await state()).drag,'unpack');
   await resetWithKeyboard();await up();assert.equal((await state()).phase,'packed');assert.equal((await state()).drag,null);assert.deepEqual((await state()).cup,{x:110,y:153});await notFinished();

   // Switch away before a scene's delayed consequence, then let its old deadline pass.
   await choose('The Suddenly Busy Crossing');await drag([240,242],[240,202]);assert.equal((await state()).phase,'rush');
   const crossingIndex=await page.evaluate(()=>index);
   await choose('Peel by peel');assert.equal(await page.locator('#title').textContent(),'Peel by peel');
   await page.waitForTimeout(7600);await notFinished();assert.equal(await page.evaluate(i=>completed.has(i),crossingIndex),false,'Discarded scene cannot complete another scene');
   await choose('The Suddenly Busy Crossing');assert.equal((await state()).phase,'approach');assert.equal((await state()).vehicles,0);
   await choose('The Fogging Windshield');assert.equal((await state()).phase,'parked');assert.equal((await state()).fan,0);assert.equal((await state()).fog,0);
   assert.deepEqual(errors,[]);console.log(JSON.stringify({mode:mobile?'touch':'mouse',pauseCrossing:true,pauseFog:true,retryAnimation:true,retryDuringDrag:true,switchOldNew:true,noCompletionLeaks:true}));
   await context.close();
  }
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
