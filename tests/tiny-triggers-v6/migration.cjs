const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const port=24400+process.pid%1000;const root=path.resolve(__dirname,'../..');const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let browser;
try{const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/6/`;for(let i=0;i<40;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
const order=await page.evaluate(()=>[...chapterBook.order]);
for(const size of [0,12,83,95,108]){
 const oldSave=JSON.stringify({done:order.slice(0,size),index:order[Math.min(size,107)]});
 await page.evaluate(({oldSave})=>{localStorage.clear();localStorage.setItem('tinyTriggers.v5',oldSave);localStorage.setItem('tinyTriggers.v5.collectionUnlocked','true');localStorage.setItem('tinyTriggers.v5.collectionGrouped','false');},{oldSave});
 await page.reload();
 assert.equal(await page.evaluate(()=>completed.size),size);assert.equal(await page.evaluate(()=>localStorage.getItem('tinyTriggers.v5')),oldSave);
 assert.equal(await page.evaluate(()=>collectionUnlocked),true);assert.equal(await page.evaluate(()=>collectionGrouped),false);
 await page.locator('#album').click();assert.equal(await page.locator('.collection-basic-list button').count(),108);await page.locator('#collection-grouping').click();await page.locator('#close').click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('tinyTriggers.v5.collectionGrouped')),'false');
 await page.evaluate(()=>{localStorage.setItem('tinyTriggers.v5',JSON.stringify({done:[],index:0}));});await page.reload();assert.equal(await page.evaluate(()=>completed.size),size,'V6 save takes priority');assert.equal(await page.evaluate(()=>collectionGrouped),true,'Own view preference takes priority');
}
await page.evaluate(()=>localStorage.clear());await page.reload();assert(await page.locator('#album').isDisabled());
await page.locator('#unlock-collection').click();await page.locator('#collection-code').fill('pixelvibe');await page.locator('#unlock-form button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#collection').open);assert.equal(await page.locator('#scene-list button').count(),108);assert.equal(await page.evaluate(()=>completed.size),0);
assert.deepEqual(errors,[]);console.log('PASS v5 -> v6 progress (0/12/83/95/108), saved preferences, old-save isolation, v6 priority, fresh unlock');
}finally{await browser?.close();server?.kill();}})().catch(e=>{console.error(e);process.exitCode=1});
