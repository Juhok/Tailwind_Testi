// Fast semantic coverage: follows only published hint descriptors via the scene
// interface. This is NOT a mouse/touch substitute; hints-ui and scene runners
// separately exercise real browser pointer events.
const {chromium}=require('playwright'),{spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..'),port=27000+process.pid%1000;
 const server=process.env.GAME_URL?null:spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
 const url=process.env.GAME_URL||`http://127.0.0.1:${port}/games/tiny-triggers/11/`;let browser;
 try{
  for(let i=0;i<50;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:'/usr/bin/google-chrome-stable',args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.evaluate(()=>{document.querySelector("#world-dialog").close();});
  const ids=process.argv.slice(2).length?process.argv.slice(2):await page.evaluate(()=>[...TASKS.values()].map(t=>t.id));
  const results=[];
  for(const id of ids){
   const result=await page.evaluate(async id=>{
    collectionUnlocked=true;muted=true;const entry=[...TASKS].find(([,d])=>d.id===id);load(entry[0]);active=false;
    const instance=workshop.instance;let pointer=null,seconds=0,actions=[];
    const advance=duration=>{for(let i=0;i<Math.ceil(duration*60);i++){updateWorkshop(1/60);seconds+=1/60;}drawWorkshop();};
    const move=p=>{instance.move?.({x:p[0],y:p[1]});pointer=p;advance(1/60);};
    try{
     for(let step=0;step<160&&!finished;step++){
      await new Promise(resolve=>setTimeout(resolve,0)); // Allow async asset/voice promises to settle.
      const g=TinyHints.current(workshop);if(!g)throw Error('Missing guide before completion');
      actions.push({kind:g.kind,label:g.label,from:g.from,to:g.to,at:g.at,phase:instance.debug()?.phase});
      if(g.kind==='wait'){advance(.4);continue;}
      const start=g.kind==='drag'?g.from:g.at;
      for(const p of [start,g.to,...(g.via||[])].filter(Boolean))if(p.some((v,i)=>!Number.isFinite(v)||v<0||v>(i===0?480:270)))throw Error('Guide outside stage '+JSON.stringify(p));
      if(!pointer){instance.down?.({x:start[0],y:start[1]});pointer=start;advance(1/60);}
      if(g.kind==='drag'){
       for(const destination of [...(g.via||[]),g.to]){
        const origin=pointer.slice();for(let i=1;i<=18;i++)move([origin[0]+(destination[0]-origin[0])*i/18,origin[1]+(destination[1]-origin[1])*i/18]);
       }
      }
      if(g.kind==='hold'||g.hold)advance(g.holdSeconds??3);
      if(g.release!==false){instance.up?.({x:pointer[0],y:pointer[1]});pointer=null;}
      advance(.2);
     }
     if(!finished)throw Error('Guide did not complete within 160 actions');
     return {id,passed:true,actions:actions.length,seconds};
    }catch(e){return {id,passed:false,error:e.message,state:instance.debug(),actions:actions.slice(-5)};}
   },id);
   results.push(result);console.log(JSON.stringify(result));
  }
  fs.writeFileSync(process.env.GUIDE_REPORT||'/tmp/tt11-guide-drive.json',JSON.stringify(results,null,2));
  assert.deepEqual(errors,[]);assert(results.every(r=>r.passed),`${results.filter(r=>!r.passed).length} guidance failures`);
 }finally{await browser?.close();server?.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
