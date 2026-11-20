const {chromium}=require('playwright');
const path=require('node:path');
const {spawn}=require('node:child_process');const assert=require('node:assert/strict');
(async()=>{const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server','4233','--bind','127.0.0.1'],{cwd:path.resolve(__dirname,'../..'),stdio:'ignore'});let b;try{
const url=process.env.GAME_URL||'http://127.0.0.1:4233/games/tiny-triggers/6/';for(let i=0;i<40;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
for(const mobile of [false,true]){const c=await b.newContext(mobile?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>typeof chapterBook!=='undefined');
assert.equal(await p.locator('a[href="SPECIFICATIONS.md"]').count(),0);assert(await p.locator('#album').isDisabled());const before=await p.evaluate(()=>localStorage.getItem('tinyTriggers.v6'));
const press=async(sel)=>mobile? p.locator(sel).tap():p.locator(sel).click();await press('#unlock-collection');await p.locator('#collection-code').fill('wrong');await press('#unlock-form button[type=submit]');assert(await p.locator('#unlock-error').textContent());assert(await p.locator('#album').isDisabled());await press('#unlock-cancel');await p.waitForFunction(()=>active);
await press('#unlock-collection');await p.locator('#collection-code').fill('pixelvibe');await press('#unlock-form button[type=submit]');await p.waitForFunction(()=>document.querySelector('#collection').open);assert.equal(await p.locator('#scene-list button').count(),108);
const groupedOrder=await p.locator('#scene-list button').evaluateAll(bs=>bs.map(b=>b.dataset.scene));
assert.equal(await p.locator('.collection-chapter').count(),16);
await press('#collection-grouping');assert.equal(await p.locator('#collection-grouping').getAttribute('aria-pressed'),'false');assert.equal(await p.locator('.collection-chapter').count(),0);assert.equal(await p.locator('.chapter-nav').count(),0);assert.equal(await p.locator('.collection-basic-list li').count(),108);assert.deepEqual(await p.locator('#scene-list button').evaluateAll(bs=>bs.map(b=>b.dataset.scene)),groupedOrder);
assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await press('#collection-grouping');assert.equal(await p.locator('.collection-chapter').count(),16);await press('#collection-grouping');
assert.equal(await p.evaluate(()=>completed.size),0);assert.equal(await p.evaluate(()=>localStorage.getItem('tinyTriggers.v6')),before);
await p.locator('#scene-list button').last().click();await p.waitForFunction(()=>!transition && index===chapterBook.order.at(-1));assert.equal(await p.evaluate(()=>completed.size),0);await p.reload();await p.waitForFunction(()=>typeof chapterBook!=='undefined');assert(!(await p.locator('#album').isDisabled()));await press('#album');assert.equal(await p.locator('.collection-basic-list li').count(),108);assert.equal(await p.locator('#scene-list button').count(),108);await press('#close');await p.waitForFunction(()=>active);assert.deepEqual(errors,[]);console.log((mobile?'Touch':'Desktop')+' grouped/list toggle, 108 scenes in same order, navigation, remembered view, unchanged completion: PASS');await c.close();}
}finally{await b?.close();server?.kill();}})().catch(e=>{console.error(e);process.exitCode=1});
