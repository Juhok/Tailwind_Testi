const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome-stable',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'],headless:true});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.GAME_URL || 'http://127.0.0.1:4190/games/orbital-oddity-mobile/10/'));await p.waitForFunction(()=>window.orbitalOddityMobile);
const result=await p.evaluate(()=>{
 orbitalOddityMobile.jumpToLevel(50);finale.begin('boss',14);finale.waiting=false;finale.overlay.classList.add('hidden');
 const f=finale;f.towing=false;f.basket.position.set(-5,.1,-12);f.roverModel.position.set(7,.1,3);
 let ticks=0;while(f.stage==='boss'&&!f.waiting&&ticks<1200){f.time+=.05;f.hitGrace=Math.max(0,f.hitGrace-.05);f.roverModel.position.set(5+Math.sin(f.time)*5,.1,4+Math.cos(f.time)*5);f.updateEarth(.05);f.updateEffects(.05);ticks++;}
 const naturalBoss={stage:f.stage,hits:f.spiderHits,shards:f.shards,hull:f.hull,seconds:ticks*.05};
 f.begin('flight',14);f.waiting=false;f.overlay.classList.add('hidden');for(let j=0;j<5;j++){f.hitGrace=0;f.hurt('Test collision');}const death={waiting:f.waiting,save:f.readSave().stage,hull:f.hull};
 f.resume();const retry={hull:f.hull,stage:f.stage,waiting:f.waiting};
 f.waiting=false;f.overlay.classList.add('hidden');f.ship.position.set(0,4,2);f.hazards=[];
 // Run a complete flight with deterministic clear corridor, then all cutscene time transitions.
 f.flightObstacle=()=>{};for(let j=0;j<1101&&f.stage==='flight';j++){f.time+=.05;f.updateFlight(.05);}
 const arrived=f.stage;f.time=12;f.updateLanding();const landed=f.stage;
 const lifecycle={arrived,landed};
 paused=true;const t=f.time;f.update(.1);const pauseFrozen=f.time===t;paused=false;
 f.reset();orbitalOddityMobile.jumpToLevel(36);const buffs=buffPowerups.length;const r=planetRadius;
 return {naturalBoss,death,retry,lifecycle,pauseFrozen,buffs,r};
});console.log(result);assert.equal(result.naturalBoss.stage,'delivery');assert.equal(result.naturalBoss.hits,5);assert.ok(result.naturalBoss.shards>0);assert.ok(result.death.waiting);assert.equal(result.retry.hull,5);assert.equal(result.lifecycle.landed,'earth');assert.equal(result.lifecycle.arrived,'landing');assert.ok(result.pauseFrozen);assert.equal(result.buffs,2);assert.deepEqual(errors,[]);await b.close();console.log('GAMEPLAY PASS')})().catch(e=>{console.error(e);process.exit(1)});
