const {chromium}=require('playwright'),{spawn}=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const port=26400+process.pid%1000,root=path.resolve(__dirname,'../..');const server=process.env.SITE_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});let b;try{
 const base=process.env.SITE_URL||`http://127.0.0.1:${port}/`;for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 b=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const snapshot=()=>({order:[...chapterBook.order],chapters:chapterBook.chapters.map(({id,title,indices})=>({id,title,indices})),scenes:scenes.map((s,i)=>({title:s[0],id:TASKS.get(i)?.id})),upgrades:TinyV6.entries.size});
 await p.goto(new URL('games/tiny-triggers/9/',base).href);const old=await p.evaluate(snapshot);assert.equal(old.order.length,199);
 await p.evaluate(order=>{localStorage.setItem('tinyTriggers.v9',JSON.stringify({done:order,index:order.at(-1)}));localStorage.setItem('tinyTriggers.v9.collectionGrouped','false');},old.order);
 const oldStorage=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('tinyTriggers.v10'))));
 await p.goto(new URL('games/tiny-triggers/10/',base).href);const fresh=await p.evaluate(snapshot);
 assert.deepEqual(fresh.order.slice(0,199),old.order,'Previously published chapter order must remain exact');assert.deepEqual(fresh.scenes.slice(0,199),old.scenes,'Earlier IDs and titles remain exact');assert.deepEqual(fresh.chapters.slice(0,35),old.chapters);assert.equal(fresh.upgrades,83);
 assert.equal(await p.evaluate(()=>completed.size),199);assert.equal(await p.evaluate(()=>index),old.order.at(-1));assert.equal(await p.evaluate(()=>collectionGrouped),false);assert(!(await p.locator('#album').isDisabled()),'Completed v9 save keeps collection available');
 const afterStorage=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.startsWith('tinyTriggers.v10'))));assert.deepEqual(afterStorage,oldStorage,'Every earlier storage key untouched');assert.deepEqual(errors,[]);
 console.log('PASS independent v9/v10 comparison: all 199 scene IDs/titles/order, 35 chapters, 83 upgrades, completed v9 continuation and untouched old storage');
}finally{await b?.close();server?.kill();}})().catch(e=>{console.error(e);process.exitCode=1});
