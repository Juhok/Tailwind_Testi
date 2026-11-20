const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

(async () => {
  const ids = process.argv.slice(2);
  if (!ids.length) throw new Error('Pass scene ids');
  const root = path.resolve(__dirname, '../..');
  const port = 4220 + (process.pid % 10000);
  const server = process.env.GAME_URL ? null : spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const url = process.env.GAME_URL || `http://127.0.0.1:${port}/games/tiny-triggers/9/`;
  let browser;
  try {
    for (let n = 0; n < 50; n++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await new Promise(r => setTimeout(r, 100));
    }
    browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable', args:['--no-sandbox','--disable-dev-shm-usage']});
    const context = await browser.newContext(process.env.MOBILE ? {viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1} : {viewport:{width:1100,height:850}});
    if(process.env.LIFECYCLE)await context.addInitScript(()=>localStorage.setItem('tinyTriggers.v9.collectionUnlocked','true'));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => typeof TinyV5 !== 'undefined' && typeof chapterBook !== 'undefined');
    const output = '/tmp/tt9-additions'; fs.mkdirSync(output,{recursive:true});
    let current;
    const position = async (x,y) => { const r = await page.locator('#stage').boundingBox(); return [r.x+x*r.width/480,r.y+y*r.height/270]; };
    const cdp = process.env.MOBILE ? await context.newCDPSession(page) : null;
    let touching=false,pressed=false,pausedCheck=false;
    const move = async (x,y,steps=10) => {
      const [px,py]=await position(x,y);
      if(cdp && touching) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:px,y:py}]});
      else await page.mouse.move(px,py,{steps});
    };
    const io = {
      move,
      async down(x,y) { pressed=true; const [px,py]=await position(x,y); if(cdp){touching=true;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:px,y:py}]});} else {await move(x,y);await page.mouse.down();} },
      async up(){ pressed=false; if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});touching=false;}else await page.mouse.up(); },
      async click(x,y){await io.down(x,y);await io.up();},
      async drag(from,to,{steps=16,hold=0}={}){await io.down(...from); if(cdp){for(let j=1;j<=steps;j++) await move(from[0]+(to[0]-from[0])*j/steps,from[1]+(to[1]-from[1])*j/steps);}else await move(...to,steps);if(hold)await page.waitForTimeout(hold*1000);await io.up();},
      wait: ms => page.waitForTimeout(ms),
      state: () => page.evaluate(() => workshop.instance.debug()),
      until: async predicate => {
        if(process.env.LIFECYCLE&&!pressed&&!pausedCheck){
          if(cdp)await page.locator('#album').tap();else await page.locator('#album').click();
          await page.waitForFunction(()=>document.querySelector('#collection').open&&!active);
          const paused=await io.state();await page.waitForTimeout(350);assert.deepEqual(await io.state(),paused,current+' pauses completely in collection');
          if(cdp)await page.locator('#close').tap();else await page.locator('#close').click();
          await page.waitForFunction(()=>active);pausedCheck=true;
        }
        return page.waitForFunction(`(${predicate.toString()})(workshop.instance.debug())`,null,{timeout:20000});
      },
      shot: name => page.locator('#stage').screenshot({path:`${output}/${current}-${process.env.MOBILE?'touch':'mouse'}-${name}.png`}),
    };
    for(const id of ids){
      current=id;pausedCheck=false;pressed=false;
      const hashFile = file => require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex');
      const sceneFile = path.join(root,'games/tiny-triggers/9/additions',`${id}.js`);
      const testFile = path.join(__dirname,'additions',`${id}.cjs`);
      const startHashes = {sourceSha256:hashFile(sceneFile),testSha256:hashFile(testFile)};
      const exists=await page.evaluate(id => {
        const pair=[...TASKS].find(([,t])=>t.id===id);
        if(!pair)return false;
        completed=new Set(chapterBook.order.slice(0,chapterBook.position.get(pair[0])));
        load(pair[0]); return true;
      },id);
      assert(exists,`Missing scene ${id}`);
      const initial=await io.state();
      await io.shot('start');
      await require(path.join(__dirname,'additions',`${id}.cjs`))(page,io,assert);
      if(process.env.LIFECYCLE&&!pausedCheck&&!await page.evaluate(()=>finished))await io.until(()=>true);
      await page.waitForFunction(()=>finished,null,{timeout:20000});
      assert.equal(await page.locator('#next').isVisible(),true);
      await io.shot('finish');
      assert.deepEqual(errors,[],id+' browser errors');
      await page.locator('#reset').click();
      assert.equal(await page.evaluate(()=>finished),false,'Retry resets completion');
      if(process.env.LIFECYCLE){await page.waitForTimeout(700);assert.equal(await page.evaluate(()=>finished),false,'Retry cannot inherit delayed completion');assert(pausedCheck,'Test must cover an active animation pause');}
      const reset=await io.state();
      if('phase' in initial)assert.equal(reset.phase,initial.phase,'Retry resets phase');
      assert.equal(hashFile(sceneFile),startHashes.sourceSha256,'Source changed during check');
      assert.equal(hashFile(testFile),startHashes.testSha256,'Test changed during check');
      const proofDir='/tmp/tt9-checks';fs.mkdirSync(proofDir,{recursive:true});
      if(!process.env.GAME_URL)fs.writeFileSync(path.join(proofDir,`${id}-${process.env.MOBILE?'touch':'mouse'}.json`),JSON.stringify({...startHashes,id,input:process.env.MOBILE?'touch-emulation':'mouse',passed:true}));
      console.log(JSON.stringify({id,input:process.env.MOBILE?'touch':'mouse',passed:true,reset:true}));
    }
  }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
