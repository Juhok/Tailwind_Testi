const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..'),port=26000+process.pid%1000;
 const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
 const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/9/`;let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('tinyTriggers.v9.collectionUnlocked','true'));
  await page.goto(url);await page.waitForFunction(()=>typeof chapterBook!=='undefined');
  const select=async id=>page.evaluate(id=>{const pair=[...TASKS].find(([,t])=>t.id===id);if(!pair)throw Error('Missing '+id);load(pair[0]);},id);
  await select('radio-song');await page.locator('#sound').click();await page.locator('#sound').click();
  await page.waitForFunction(()=>audio?.state==='running');
  await page.evaluate(()=>{const analyser=audio.createAnalyser();analyser.fftSize=2048;const sink=audio.createGain();sink.gain.value=0;gain.connect(analyser);analyser.connect(sink).connect(audio.destination);window.audioProbe={analyser,sink};});
  const settle=async()=>{const start=await page.evaluate(()=>audio.currentTime);await page.waitForFunction(t=>audio.currentTime-t>=.8,start,{polling:25,timeout:15000});};
  const measure=async()=>page.evaluate(async()=>{const {analyser}=window.audioProbe,data=new Float32Array(analyser.fftSize),start=audio.currentTime;let peak=0;while(audio.currentTime-start<.9){await new Promise(r=>setTimeout(r,20));analyser.getFloatTimeDomainData(data);for(const value of data){if(!Number.isFinite(value))throw Error('Invalid audio sample');peak=Math.max(peak,Math.abs(value));}}return peak;});
  const playing=await measure();assert(playing>.0001,'Radio melody reaches actual master output');
  await page.locator('#sound').click();await settle();const mutedPeak=await measure();assert(mutedPeak<.00001,'Muted radio output is silent');
  await page.locator('#sound').click();await settle();const resumed=await measure();assert(resumed>.0001,'Radio resumes after unmute');
  await page.locator('#album').click();await settle();const paused=await measure();assert(paused<.00001,'Collection pauses radio generation');
  await page.locator('#close').click();const afterCollection=await measure();assert(afterCollection>.0001,'Radio resumes after collection');
  await select('wrong-audio');await settle();const afterSwitch=await measure();assert(afterSwitch<.00001,'Switching to the silent output scene leaves no radio audio');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,playing,mutedPeak,resumed,paused,afterCollection,afterSwitch}));
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
