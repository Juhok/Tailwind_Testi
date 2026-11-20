const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const port=24400+process.pid%1000,root=path.resolve(__dirname,'../..');
 const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
 try {
  const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/9/`;
  for(let i=0;i<40;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
  const order=await page.evaluate(()=>[...chapterBook.order]);assert.equal(order.length,199);
  for(const version of [8,7,6,5,4])for(const size of [0,12,83,...(version===4?[]:[95,108]),...(version>=7?[120,128]:[]),...(version===8?[134]:[])]){
   const limit=version===4?83:version===7?128:version===8?134:108;
   const oldSave=JSON.stringify({done:order.slice(0,size),index:order[Math.min(size,limit-1)]});
   const key=`tinyTriggers.v${version}`;
   await page.evaluate(({key,oldSave})=>{localStorage.clear();localStorage.setItem(key,oldSave);if(!key.endsWith('v4')){localStorage.setItem(key+'.collectionUnlocked','true');localStorage.setItem(key+'.collectionGrouped','false');}},{key,oldSave});
   await page.reload();
   assert.equal(await page.evaluate(()=>completed.size),size);
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),oldSave,'Old save must remain byte-for-byte unchanged');
   if(size===limit)assert.equal(await page.evaluate(()=>index),order[size],'Full old save starts first new scene');
   if(version!==4){assert.equal(await page.evaluate(()=>collectionUnlocked),true);assert.equal(await page.evaluate(()=>collectionGrouped),false);}
   const own=await page.evaluate(()=>localStorage.getItem('tinyTriggers.v9'));
   assert(own);await page.evaluate(key=>{localStorage.setItem(key,JSON.stringify({done:[],index:0}));},key);
   await page.reload();assert.equal(await page.evaluate(()=>completed.size),size,'Own v9 save takes priority');
  }
  // Most recent valid source wins; corrupt sources do not erase valid history.
  await page.evaluate(order=>{localStorage.clear();localStorage.setItem('tinyTriggers.v6',JSON.stringify({done:order.slice(0,12),index:order[12]}));localStorage.setItem('tinyTriggers.v5',JSON.stringify({done:order.slice(0,95),index:order[95]}));},order);await page.reload();assert.equal(await page.evaluate(()=>completed.size),12);
  await page.evaluate(()=>{localStorage.setItem('tinyTriggers.v9','invalid');localStorage.setItem('tinyTriggers.v6','null');});await page.reload();assert.equal(await page.evaluate(()=>completed.size),95);
  // V7 full progress continues into v8 without modifying the source save.
  await page.evaluate(order=>{localStorage.clear();localStorage.setItem('tinyTriggers.v7',JSON.stringify({done:order,index:133}));},order);await page.reload();assert.equal(await page.evaluate(()=>completed.size),128);assert.equal(await page.evaluate(()=>index),order[128]);assert(await page.locator('#album').isDisabled());
  // Old saves cannot claim new additions, and holes cannot skip progression.
  await page.evaluate(order=>{localStorage.clear();localStorage.setItem('tinyTriggers.v6',JSON.stringify({done:order,index:127}));},order);await page.reload();assert.equal(await page.evaluate(()=>completed.size),108);assert.equal(await page.evaluate(()=>index),order[108]);assert(await page.locator('#album').isDisabled());
  await page.evaluate(()=>{localStorage.clear();localStorage.setItem('tinyTriggers.v6',JSON.stringify({done:[0,2,4,108],index:108}));});await page.reload();assert.equal(await page.evaluate(()=>completed.size),1);assert.equal(await page.evaluate(()=>index),0);
  await page.evaluate(()=>localStorage.clear());await page.reload();assert(await page.locator('#album').isDisabled());
  await page.locator('#unlock-collection').click();await page.locator('#collection-code').fill('pixelvibe');await page.locator('#unlock-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#collection').open);assert.equal(await page.locator('#scene-list button').count(),199);assert.equal(await page.evaluate(()=>completed.size),0);
  assert.deepEqual(errors,[]);console.log('PASS v8/v7/v6/v5/v4 migration, newest-valid-source priority, full-save continuation, old-save isolation, invalid/holey saves, unlock');
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
