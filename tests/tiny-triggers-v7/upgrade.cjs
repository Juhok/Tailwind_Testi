const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

(async () => {
  const ids = process.argv.slice(2);
  if (!ids.length) throw new Error('Pass scene ids');
  const root = path.resolve(__dirname, '../..');
  const port = 4220 + (process.pid % 10000);
  const server = process.env.GAME_URL ? null : spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  const url = process.env.GAME_URL || `http://127.0.0.1:${port}/games/tiny-triggers/7/`;
  let browser;
  try {
    for (let n = 0; n < 50; n++) {
      try { if ((await fetch(url)).ok) break; } catch {}
      await new Promise(r => setTimeout(r, 100));
    }
    browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome-stable', args:['--no-sandbox','--disable-dev-shm-usage']});
    const context = await browser.newContext(process.env.MOBILE ? {viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1} : {viewport:{width:1100,height:850}});
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const loadedModules = new Map(), moduleReads = [];
    page.on('response', response => {
      const match = new URL(response.url()).pathname.match(/\/upgrades\/([^/]+)\.js$/);
      if(match) moduleReads.push(response.body().then(bytes => loadedModules.set(match[1],digest(bytes))));
    });
    await page.goto(url);
    await Promise.all(moduleReads);
    await page.waitForFunction(() => typeof TinyV5 !== 'undefined' && typeof chapterBook !== 'undefined');
    const output = '/tmp/tt7-upgrades'; fs.mkdirSync(output,{recursive:true});
    let current;
    const position = async (x,y) => { const r = await page.locator('#stage').boundingBox(); return [r.x+x*r.width/480,r.y+y*r.height/270]; };
    const cdp = process.env.MOBILE ? await context.newCDPSession(page) : null;
    let touching=false;
    const move = async (x,y,steps=10) => {
      const [px,py]=await position(x,y);
      if(cdp && touching) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:px,y:py}]});
      else await page.mouse.move(px,py,{steps});
    };
    const io = {
      move,
      async down(x,y) { const [px,py]=await position(x,y); if(cdp){touching=true;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:px,y:py}]});} else {await move(x,y);await page.mouse.down();} },
      async up(){ if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});touching=false;}else await page.mouse.up(); },
      async cancel(){ if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});touching=false;}else await page.mouse.up(); },
      async click(x,y){await io.down(x,y);await io.up();},
      async drag(from,to,{steps=16,hold=0}={}){await io.down(...from); if(cdp){for(let j=1;j<=steps;j++) await move(from[0]+(to[0]-from[0])*j/steps,from[1]+(to[1]-from[1])*j/steps);}else await move(...to,steps);if(hold)await page.waitForTimeout(hold*1000);await io.up();},
      wait: ms => page.waitForTimeout(ms),
      state: () => page.evaluate(() => workshop.instance.debug()),
      until: async predicate => page.waitForFunction(`(${predicate.toString()})(workshop.instance.debug())`,null,{timeout:20000}),
      shot: name => page.locator('#stage').screenshot({path:`${output}/${current}-${process.env.MOBILE?'touch':'mouse'}-${name}.png`}),
    };
    for(const id of ids){
      current=id;
      const exists=await page.evaluate(id => {
        const pair=[...TASKS].find(([,t])=>t.id===id);
        if(!pair)return false;
        completed=new Set(chapterBook.order.slice(0,chapterBook.position.get(pair[0])));
        load(pair[0]); return true;
      },id);
      assert(exists,`Missing scene ${id}`);
      const initial=await io.state();
      await io.shot('start');
      const testFile = path.join(__dirname,'upgrades',`${id}.cjs`);
      const testedBytes = digest(fs.readFileSync(testFile));
      await require(testFile)(page,io,assert);
      await page.waitForFunction(()=>finished,null,{timeout:20000});
      assert.equal(await page.locator('#next').isVisible(),true);
      await io.shot('finish');
      assert.deepEqual(errors,[],id+' browser errors');
      await page.locator('#reset').click();
      assert.equal(await page.evaluate(()=>finished),false,'Retry resets completion');
      const reset=await io.state();
      if('phase' in initial)assert.equal(reset.phase,initial.phase,'Retry resets phase');
      const record = {id,input:process.env.MOBILE?'touch':'mouse',passed:true,reset:true};
      // Keep proof tied to actual module/test bytes for integration review.
      const hash = filename => digest(fs.readFileSync(filename));
      const moduleHash = hash(path.join(root,'games/tiny-triggers/7/upgrades',`${id}.js`));
      assert.equal(moduleHash,loadedModules.get(id),'Scene bytes must not change during a test');
      assert.equal(hash(testFile),testedBytes,'Gesture test must not change during its run');
      const resultDir = '/tmp/tt7-verified'; fs.mkdirSync(resultDir,{recursive:true});
      fs.writeFileSync(path.join(resultDir,`${id}-${record.input}.json`), JSON.stringify({...record,
        module:moduleHash, test:testedBytes, checkedAt:new Date().toISOString()
      },null,2));
      console.log(JSON.stringify(record));
    }
  }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
