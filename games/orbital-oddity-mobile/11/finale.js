/* Orbital Oddity Mobile 11 — optional Earth mission. No external media required. */
class EarthFinale {
  constructor() {
    this.active = false;
    this.rocketPickup = null;
    this.saveKey = 'orbitalOddityMobileEarthMissionV10';
    this.hud = document.createElement('div'); this.hud.id = 'finaleHud'; this.hud.hidden = true;
    this.hud.innerHTML = '<strong></strong><div></div><progress max="1" value="0"></progress>';
    document.body.append(this.hud);
    this.action = document.createElement('button'); this.action.id = 'finaleAction'; this.action.hidden = true;
    this.action.onclick = () => this.interact(); document.body.append(this.action);
    this.overlay = document.createElement('div'); this.overlay.id = 'finaleOverlay'; this.overlay.className = 'panel hidden';
    document.body.append(this.overlay);
    this.resumeButtons = [startPanel, messagePanel].map(panel => {
      const b = document.createElement('button'); b.className = 'earth-resume'; b.textContent = 'Resume Earth mission';
      b.onclick = () => this.resume(); panel.append(b); return b;
    });
    addEventListener('keydown', e => { if (this.active && e.code === 'KeyE' && !e.repeat && !/INPUT|TEXTAREA/.test(e.target.tagName)) { e.preventDefault(); this.interact(); } });
    addEventListener('resize', () => { if (this.active) this.resize(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.active && playing && !paused && !this.waiting) togglePause(); });
    this.fade=document.createElement('div');this.fade.id='finaleFade';document.body.append(this.fade);
    this.cityText=document.createElement('div');this.cityText.id='cityEnding';this.cityText.hidden=true;
    this.cityText.innerHTML='<h2>GAME OVER</h2><p>Congratulations! You saved the Earth. The oddity is manifestated</p><p>Press P or tap Menu · The journey loops until you leave.</p>';document.body.append(this.cityText);
    this.storyText=document.createElement('div');this.storyText.id='cityStory';this.storyText.hidden=true;document.body.append(this.storyText);
    this.refreshResume();
  }
  readSave() {
    try {
      const s = JSON.parse(localStorage.getItem(this.saveKey));
      if (!s || !['flight','earth','boss','delivery'].includes(s.stage)) return null;
      return { stage:s.stage, level:Math.max(50, Math.min(10000, Number(s.level) || 50)), shards:Math.max(1, Math.min(14, Number(s.shards) || 14)) };
    } catch { return null; }
  }
  refreshResume() { const saved = this.readSave(); this.resumeButtons.forEach(b => b.hidden = !saved); }
  checkpoint(stage) {
    this.checkpointStage = stage;
    try { localStorage.setItem(this.saveKey, JSON.stringify({stage, level, shards:this.shards, savedAt:Date.now()})); } catch {}
    this.refreshResume();
  }
  resume() { const s = this.readSave(); if (s) { level=s.level; this.begin(s.stage, s.shards); } }
  state() { return {active:this.active, stage:this.stage || 'orbit', time:this.time || 0, rocketAvailable:!!this.rocketPickup, rocketDirection:this.rocketPickup?.dir.toArray(), checkpoint:this.checkpointStage, hull:this.hull, shards:this.shards, spiderHits:this.spiderHits, towing:this.towing, waiting:this.waiting, hazards:this.hazards?.length || 0}; }
  disposeTree(root) {
    if (!root) return;
    const geometries=new Set(), materials=new Set();
    root.traverse(o => { if(o.geometry) geometries.add(o.geometry); if(o.material) (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m)); });
    geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose());
    root.removeFromParent();
  }
  reset() {
    clearTimeout(levelAdvanceTimer);
    if (this.rocketPickup) this.disposeTree(this.rocketPickup.group);
    this.rocketPickup = null;
    this.disposeTree(this.world); this.world = null;
    this.active = false; this.stage = 'orbit'; this.waiting = false;
    this.fade.style.opacity='0';this.cityText.hidden=this.storyText.hidden=true;
    if(this.musicBus){this.musicBus.gain.cancelScheduledValues(audioCtx.currentTime);this.musicBus.gain.setValueAtTime(0,audioCtx.currentTime);}
    this.hud.hidden = this.action.hidden = true; this.overlay.classList.add('hidden');
    document.body.classList.remove('finale-active','retro-finale');
    updateViewportSize(); this.refreshResume();
  }
  mesh(geometry, color, glow=0) {
    return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color, roughness:.65, emissive:color, emissiveIntensity:glow, flatShading:true}));
  }
  box(parent, size, pos, color, glow=0) {
    const m=this.mesh(new THREE.BoxGeometry(...size),color,glow); m.position.set(...pos); parent.add(m); return m;
  }
  rocket() {
    const g=new THREE.Group();
    const body=this.mesh(new THREE.CylinderGeometry(.55,.68,3.4,12),0xe5edf5); body.position.y=1.8; g.add(body);
    const nose=this.mesh(new THREE.ConeGeometry(.56,1.25,12),0xff5e75); nose.position.y=4.1; g.add(nose);
    for(let i=0;i<4;i++) { const fin=this.mesh(new THREE.ConeGeometry(.55,1.3,3),0x2bbed1); fin.position.set(Math.sin(i*Math.PI/2)*.7,.6,Math.cos(i*Math.PI/2)*.7); g.add(fin); }
    const window=this.mesh(new THREE.SphereGeometry(.33,12,8),0x64eaff,1); window.position.set(0,2.6,.49); g.add(window);
    const flame=this.mesh(new THREE.ConeGeometry(.38,1.8,10),0xffbc42,2); flame.rotation.z=Math.PI; flame.position.y=-.7; g.add(flame); g.userData.flame=flame;
    return g;
  }
  spawnRocket() {
    if(level<50) return;
    const group=this.rocket();
    // Deliberately search for real clearance rather than placing inside dense terrain.
    let dir=null;
    for(let i=0;i<1000;i++) {
      const d=randomDir();
      if(angularDistance(playerDir,d)<.25) continue;
      if(obstacles.every(o=>angularDistance(o.dir,d)>(o.radius*5+1.5)/planetRadius)) { dir=d; break; }
    }
    if(!dir) {
      dir=playerDir.clone().addScaledVector(playerForward,.6).normalize();
      for(let i=obstacles.length-1;i>=0;i--) if(angularDistance(obstacles[i].dir,dir)<(obstacles[i].radius*5+1.5)/planetRadius) {
        this.disposeTree(obstacles[i].group); this.disposeTree(obstacles[i].shadow); obstacles.splice(i,1);
      }
    }
    placeOnPlanet(group,dir,.1,tangentBasis(dir).forward); scene.add(group); this.rocketPickup={group,dir};
    showToast('Rocket home available — approach it to launch, or keep exploring');
  }
  updateRocket(t) {
    if(!this.rocketPickup) return;
    const {group,dir}=this.rocketPickup;
    group.userData.flame.scale.y=.8+Math.sin(t*9)*.18;
    if(angularDistance(playerDir,dir)<1.2/planetRadius) this.begin('flight',14);
  }
  showDialog(title, text, buttons) {
    this.waiting=true; this.action.hidden=true;
    this.overlay.replaceChildren();
    const h=document.createElement('h2'); h.textContent=title;
    const p=document.createElement('p'); p.textContent=text;
    this.overlay.append(h,p);
    for(const [label,fn] of buttons) { const b=document.createElement('button'); b.textContent=label; b.style.margin='6px'; b.onclick=()=>{ this.overlay.classList.add('hidden'); this.waiting=false; fn(); }; this.overlay.append(b); }
    this.overlay.classList.remove('hidden');
    if(document.pointerLockElement) document.exitPointerLock();
    touchMoveX=touchMoveY=0; keys.clear();
    document.body.classList.remove('show-touch-controls');
  }
  begin(stage='flight', shards=14) {
    this.reset(); ensureAudio(); audioCtx.resume?.();
    this.active=true; this.shards=shards; this.hull=5; this.hitGrace=0; this.towing=false;
    playing=true; paused=false; awaitingLevelStart=false; clearExhaust();
    if(this.musicBus)this.musicBus.gain.setValueAtTime(.7,audioCtx.currentTime);
    toast.classList.remove('show'); toastTimer=0;
    [startPanel,messagePanel,pausePanel,settingsPanel,levelIntroPanel].forEach(p=>p.classList.add('hidden'));
    document.body.classList.add('finale-active'); this.hud.hidden=false;
    this.camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,700);
    this.setStage(stage);
    this.showDialog(stage==='flight'?'Earthbound':'Earth mission', stage==='flight'
      ? 'Act II · Bring the oddity shards home. Steer in two dimensions with WASD, arrows, joystick or tilt. Avoid rocks, wreckage and satellites. Earth grows closer throughout the flight. Your mission is saved here.'
      : 'Act IV · Up/down drives; left/right steers. Follow the beacon to the basket. Use E or the action button to deliver and tow. Lure the spider into the volcano’s marked impact zones. Five volcanic rock hits will destroy it.',
      [['Begin',()=>{updateTouchUi(); canvas.focus();}],['Return to orbit',()=>this.returnToOrbit()]]);
  }
  returnToOrbit() { const n=level; this.reset(); resetGame(n,true); }
  newWorld() {
    this.disposeTree(this.world);
    this.world=new THREE.Scene(); this.world.background=new THREE.Color(0x040819);
    this.world.add(new THREE.HemisphereLight(0xb7efff,0x152237,2.2));
    const light=new THREE.DirectionalLight(0xffdfbd,3); light.position.set(-12,24,10); this.world.add(light);
    this.hazards=[]; this.rocks=[]; this.lasers=[]; this.markers=[]; this.effects=[];
    this.time=0; this.spawnTimer=0; this.musicClock=0; this.musicBeat=0;this.currentTheme=null;this.wave=0;
  }
  starscape() {
    const points=[];
    for(let i=0;i<500;i++) points.push((Math.random()-.5)*400,(Math.random()-.5)*260,-Math.random()*330);
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    this.world.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xc9eaff,size:.35})));
  }
  earthGlobe() {
    const g=new THREE.Group(); g.add(this.mesh(new THREE.SphereGeometry(10,40,24),0x165eae,.15));
    // Stylized green continent clusters sit just above the blue globe.
    const continents=[[-.8,.5],[-.4,.4],[.2,.65],[.4,.3],[.6,-.2],[-.6,-.4],[1.7,.3],[2.2,-.2]];
    for(const [lon,lat] of continents) {
      const patch=this.mesh(new THREE.SphereGeometry(1,10,8),0x4aa773);
      patch.scale.set(2.4,1.5,.5); const n=new THREE.Vector3(Math.sin(lon)*Math.cos(lat),Math.sin(lat),Math.cos(lon)*Math.cos(lat)); patch.position.copy(n).multiplyScalar(9.8); patch.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n); g.add(patch);
    }
    const haze=new THREE.Mesh(new THREE.SphereGeometry(10.45,32,20),new THREE.MeshBasicMaterial({color:0x83dfff,wireframe:true,transparent:true,opacity:.09})); g.add(haze); return g;
  }
  rover() {
    const original=selectedPlayerModel==='custom'&&customModelReady?customShip:classicShip;
    const g=original.clone(true); g.visible=true;
    // Own resources so scene cleanup cannot dispose the orbital player/preview.
    g.traverse(o=>{if(o.geometry) o.geometry=o.geometry.clone(); if(o.material) {o.material=o.material.clone();o.material.opacity=1;}});
    g.scale.setScalar(1.8); return g;
  }
  setStage(stage) {
    this.stage=stage; this.newWorld(); this.action.hidden=true;
    if(stage==='flight'||stage==='landing') {
      this.starscape(); this.earth=this.earthGlobe(); this.earth.position.set(0,0,-180); this.world.add(this.earth);
      this.ship=this.rocket(); this.ship.scale.setScalar(.65); this.ship.rotation.x=-Math.PI/2; this.ship.position.set(0,-1,2); this.world.add(this.ship);
      this.camera.position.set(0,4,15); this.camera.lookAt(0,0,-20);
      if(stage==='landing') {
        this.earth.position.set(0,-65,-40); this.earth.scale.setScalar(6);
        this.roverModel=this.rover(); this.roverModel.position.set(0,0,1); this.world.add(this.roverModel);
        this.canopy=new THREE.Group();
        const dome=this.mesh(new THREE.SphereGeometry(3,16,8,0,Math.PI*2,0,Math.PI/2),0xff688c); dome.position.y=4; this.canopy.add(dome);
        for(const x of [-2,2]) for(const z of [-2,2]) {const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x,4,z),new THREE.Vector3(0,.3,0)]),new THREE.LineBasicMaterial({color:0xfff3dc}));this.canopy.add(line);}
        this.roverModel.add(this.canopy); this.canopy.visible=false;
      } else this.checkpoint('flight');
    } else if(['earth','boss','delivery'].includes(stage)) {
      this.buildEarth();
      if(stage==='boss') this.spawnSpider();
      if(stage==='delivery') {this.spiderHits=5; this.towing=true; this.placeSurface(this.basket,this.geo(0,14),.15); this.pad.visible=true;}
      this.checkpoint(stage);
    }
    this.resize();
  }
  resize() {
    this.camera.aspect=innerWidth/innerHeight; this.camera.updateProjectionMatrix();
    if(this.stage==='city'||this.stage==='complete') {renderer.setPixelRatio(1);renderer.setSize(Math.max(1,Math.floor(innerWidth/3)),Math.max(1,Math.floor(innerHeight/3)),false);}
    else updateViewportSize();
  }
  input() {
    return {
      x:THREE.MathUtils.clamp(Number(active('KeyD','ArrowRight','d'))-Number(active('KeyA','ArrowLeft','a'))+touchMoveX+(tiltControlsEnabled?tiltX:0),-1,1),
      y:THREE.MathUtils.clamp(Number(active('KeyW','ArrowUp','w'))-Number(active('KeyS','ArrowDown','s'))+touchMoveY+(tiltControlsEnabled?tiltY:0),-1,1)
    };
  }
  label(title, body, progress=0) {this.hud.children[0].textContent=title;this.hud.children[1].textContent=body;this.hud.children[2].value=THREE.MathUtils.clamp(progress,0,1);}
  theme() { return this.stage==='boss'?'epic-boss':this.stage==='guardian'?(this.time>=16?'epic-defense':'awakening'):this.stage==='flight'?'flight':this.stage==='city'?'retro':'earth'; }
  instrument(freq,duration,kind='strings',volume=.08) {
    if(!audioCtx)return;const now=audioCtx.currentTime;
    if(!this.musicBus){this.musicBus=audioCtx.createGain();this.musicBus.gain.value=.7;this.musicBus.connect(musicGain);}
    const envelope=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=kind==='brass'?1400:kind==='strings'?2100:900;filter.Q.value=.7;
    envelope.gain.setValueAtTime(.0001,now);envelope.gain.exponentialRampToValueAtTime(volume,now+(kind==='choir'?.16:.04));envelope.gain.exponentialRampToValueAtTime(.0001,now+duration);
    filter.connect(envelope).connect(this.musicBus);
    let ended=0;
    for(const detune of [-5,5]){const osc=audioCtx.createOscillator();osc.type=kind==='choir'?'sine':kind==='brass'?'sawtooth':'triangle';osc.frequency.value=freq;osc.detune.value=detune;osc.connect(filter);osc.start(now);osc.stop(now+duration+.03);osc.onended=()=>{osc.disconnect();if(++ended===2){filter.disconnect();envelope.disconnect();}};}
  }
  drum(strong=false) {
    if(!audioCtx)return;const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.setValueAtTime(strong?115:170,now);osc.frequency.exponentialRampToValueAtTime(38,now+.25);gain.gain.setValueAtTime(strong?.32:.16,now);gain.gain.exponentialRampToValueAtTime(.0001,now+.4);osc.connect(gain).connect(musicGain);osc.start();osc.stop(now+.42);osc.onended=()=>{osc.disconnect();gain.disconnect();};
  }
  music(dt) {
    if(!audioCtx||paused)return;const theme=this.theme();
    if(theme!==this.currentTheme){this.currentTheme=theme;this.musicBeat=0;this.musicClock=0;}
    this.musicClock-=dt;if(this.musicClock>0)return;const beat=this.musicBeat++;
    if(theme.startsWith('epic')){
      this.musicClock=theme==='epic-boss'?.16:.19;
      const root=[146.83,116.54,174.61,130.81][Math.floor(beat/16)%4];
      const motif=[2,3,2.667,2,2.4,3,4,3.56];
      this.instrument(root*motif[beat%8],.34,'strings',.06);
      if(beat%4===0){this.drum(beat%8===0);this.instrument(root/2,.7,'brass',.12);}
      if(beat%8===0){[1,1.1892,1.4983].forEach(r=>this.instrument(root*r,1.55,'choir',.055));this.instrument(root*2,1.1,'brass',.08);}
      if(theme==='epic-defense'&&this.time>22&&beat%2===0)this.drum(false);
    }else if(theme==='flight'){
      this.musicClock=.115;const root=[110,130.81,98,146.83][Math.floor(beat/16)%4],r=[1,2,1.5,3,2.4,2,1.5,4][beat%8];
      tone(root*r,.12,'square',.075,musicGain);if(beat%4===0){this.drum(beat%8===0);this.instrument(root/2,.3,'brass',.07);}if(beat%2)tone(1800,.035,'triangle',.035,musicGain);
    }else if(theme==='retro'){
      this.musicClock=.15;const root=[110,130.81,87.31,98][Math.floor(beat/16)%4];
      tone(root*[2,2.375,3,4,3.56,3,2.375,3][beat%8],.22,'triangle',.13,musicGain);
      if(beat%4===0){this.drum(beat%8===0);tone(root,.4,'sawtooth',.065,musicGain);}if(beat%16===0)[1,1.189,1.498].forEach(r=>this.instrument(root*2*r,1.8,'choir',.04));
    }else{
      this.musicClock=.32;this.instrument([220,261.63,329.63,293.66][beat%4],.8,'choir',.05);if(beat%4===0)this.instrument(110,1.3,'strings',.06);
    }
  }
  hurt(reason) {
    if(this.hitGrace>0||this.waiting) return;
    this.hull--; this.hitGrace=1.4; tone(85,.2,'sawtooth',.25);
    if(this.hull<=0) this.fail(reason);
  }
  fail(reason) {
    this.showDialog('Mission interrupted',reason+' Your act checkpoint is safe.',[['Retry checkpoint',()=>this.resume()],['Return to orbit',()=>this.returnToOrbit()]]);
  }
  flightObstacle() {
    const progress=Math.min(1,this.time/55),count=2+(progress>.5?1:0);
    this.wave++;
    for(let n=0;n<count&&this.hazards.length<80;n++) {
      const kind=(this.wave+n)%3;let g;
      if(kind===0)g=this.mesh(new THREE.IcosahedronGeometry(.7+Math.random()*.5,0),0x988c86);
      else {g=new THREE.Group();this.box(g,[.9,.7,.9],[0,0,0],kind===1?0xd7ddec:0x956e52);for(const sign of [-1,1])this.box(g,[1.4,.12,.7],[sign*1.2,0,0],kind===1?0x3689df:0x866052);}
      const speed=27+progress*11+Math.random()*5, vx=(Math.random()-.5)*(2+progress*2), vy=(Math.random()-.5)*1.2;
      // Alternate random traffic and aimed-at-launch trajectories, never homing.
      const aimed=n===0&&this.wave%2===0;
      const tx=aimed?this.ship.position.x+(Math.random()-.5): (Math.random()-.5)*16;
      const ty=aimed?this.ship.position.y+(Math.random()-.5): (Math.random()-.5)*10;
      const travel=92/speed;
      g.position.set(tx-vx*travel,ty-vy*travel,-90);this.world.add(g);
      this.hazards.push({g,radius:kind===0?1.2:1.8,speed,vx,vy});
    }
  }
  updateFlight(dt) {
    const i=this.input(); this.ship.position.x=THREE.MathUtils.clamp(this.ship.position.x+i.x*7*dt,-8,8); this.ship.position.y=THREE.MathUtils.clamp(this.ship.position.y+i.y*6*dt,-5,5);
    this.ship.rotation.z=-i.x*.22; this.ship.userData.flame.scale.y=.9+Math.sin(this.time*26)*.2;
    const progress=Math.min(1,this.time/55); this.earth.position.z=-180+progress*153; this.earth.rotation.y=this.time*.025;
    this.spawnTimer-=dt; if(this.spawnTimer<=0 && progress<.94) {this.flightObstacle();this.spawnTimer=.56-progress*.25;}
    for(let n=this.hazards.length-1;n>=0;n--) {const h=this.hazards[n]; h.g.position.z+=dt*h.speed;h.g.position.x+=dt*(h.vx||0);h.g.position.y+=dt*(h.vy||0);h.g.rotation.z+=dt*.6;
      if(h.g.position.distanceTo(this.ship.position)<h.radius+.65) {this.hurt('The rocket was damaged in the debris field.');this.disposeTree(h.g);this.hazards.splice(n,1);}
      else if(h.g.position.z>18){this.disposeTree(h.g);this.hazards.splice(n,1);}
    }
    this.ship.visible=this.hitGrace<=0||Math.sin(this.time*30)>-.2;
    this.label('ACT II · EARTHBOUND',`Hull ${this.hull}/5 · Avoid debris · Earth approach ${Math.floor(progress*100)}%`,progress);
    if(progress>=1&&!this.waiting) this.setStage('landing');
  }
  updateLanding() {
    this.ship.position.set(this.time*.9,2+this.time*.4,-this.time*3);
    this.roverModel.position.y=2-Math.min(this.time,12)*.3;
    if(this.time>9) {
      this.earth.position.set(0,-64,-10);
      this.roverModel.position.y=THREE.MathUtils.lerp(-.7,-4,Math.min(1,(this.time-9)/3));
    }
    this.canopy.visible=this.time>3;
    this.canopy.scale.setScalar(Math.min(1,Math.max(.01,(this.time-3)*1.5)));
    this.roverModel.rotation.z=Math.sin(this.time*2)*.07;
    if(this.time<=9)this.earth.position.y=-65+this.time*.25;
    this.camera.position.set(13,9,24);this.camera.lookAt(0,3,0);
    this.label('ACT III · WELCOME HOME',this.time<3?'Rover separation…':this.time<10?'Parachutes deployed. Descending toward Earth…':'Touchdown. The shards have come home.',this.time/12);
    this.action.hidden=false;this.action.textContent='Skip landing';
    if(this.time>=12)this.setStage('earth');
  }
  beacon(parent,color) {
    const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,12,8),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.45}));shaft.position.y=6;parent.add(shaft);
    const ring=this.mesh(new THREE.TorusGeometry(2,.08,8,40),color,1);ring.rotation.x=-Math.PI/2;ring.position.y=.15;parent.add(ring);
  }
  buildEarth() {
    this.earthRadius=18;this.world.background=new THREE.Color(0x070d25);this.world.fog=null;this.starscape();
    const geometry=new THREE.SphereGeometry(this.earthRadius,72,48),colors=[],pos=geometry.attributes.position;
    for(let i=0;i<pos.count;i++) {
      const v=new THREE.Vector3().fromBufferAttribute(pos,i).normalize();
      const land=Math.sin(v.x*7+v.z*3)+Math.cos(v.z*8-v.y*4)+Math.sin(v.y*9+v.x*2);
      const color=new THREE.Color(Math.abs(v.y)>.93?0x89cda8:land>-.35?0x468b65:0x16568d);
      colors.push(color.r,color.g,color.b);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    this.earthSurface=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.85,flatShading:true}));this.world.add(this.earthSurface);
    this.roverModel=this.rover();this.world.add(this.roverModel);this.roverForward=new THREE.Vector3(0,0,-1).projectOnPlane(this.geo(0,11)).normalize();this.placeSurface(this.roverModel,this.geo(0,11),.15,this.roverForward);
    this.basket=new THREE.Group();this.placeSurface(this.basket,this.geo(0,-4),.15);
    this.box(this.basket,[2.6,.25,2.5],[0,.25,0],0xb78340);
    for(const z of [-1.2,1.2])for(let y=.65;y<1.6;y+=.4)this.box(this.basket,[2.6,.16,.12],[0,y,z],0xe1b978);
    for(const x of [-1.2,1.2])for(let y=.65;y<1.6;y+=.4)this.box(this.basket,[.12,.16,2.4],[x,y,0],0xe1b978);
    this.cargo=new THREE.Group();this.basket.add(this.cargo);this.world.add(this.basket);this.updateCargo();
    this.basketBeacon=new THREE.Group();this.beacon(this.basketBeacon,0xffdd77);this.basket.add(this.basketBeacon);
    this.rope=new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({length:13},()=>new THREE.Vector3())),new THREE.LineBasicMaterial({color:0xffd68a}));this.world.add(this.rope);this.rope.visible=false;
    this.volcano=new THREE.Group();this.volcanoDir=this.geo(-9,-8);this.placeSurface(this.volcano,this.volcanoDir,-.45);
    const mountain=this.mesh(new THREE.ConeGeometry(4.5,7,12),0x4e2526);mountain.position.y=3.5;this.volcano.add(mountain);
    const lava=this.mesh(new THREE.SphereGeometry(1.25,12,8),0xff650d,2);lava.position.y=6.6;this.volcano.add(lava);this.world.add(this.volcano);
    this.pad=new THREE.Group();this.placeSurface(this.pad,this.geo(12,-12));this.box(this.pad,[5,.2,5],[0,.1,0],0x385279);this.beacon(this.pad,0x80ffff);this.world.add(this.pad);this.pad.visible=false;
    for(let n=0;n<40;n++){const d=new THREE.Vector3(Math.sin(n*2.4),Math.cos(n*1.7),Math.cos(n*2.4)).normalize();if([this.geo(0,11),this.geo(0,-4),this.volcanoDir,this.geo(12,-12)].some(k=>k.angleTo(d)<.45))continue;const tree=this.mesh(new THREE.ConeGeometry(.5,1.6,5),0x1c5945);this.placeSurface(tree,d,.8);this.world.add(tree);}
    this.spider=null;this.spiderHits=0;this.rockTimer=2;this.laserTimer=3;this.eatTimer=3;this.towing=false;
    this.updateEarthCamera(1);
  }
  geo(x,z) { return new THREE.Vector3(x,this.earthRadius,z).normalize(); }
  placeSurface(object, dir, lift=0, forward=null) {
    const n=dir.clone().normalize();object.position.copy(n).multiplyScalar(this.earthRadius+lift);
    let f=(forward||new THREE.Vector3(0,0,-1)).clone().projectOnPlane(n);
    if(f.lengthSq()<.00001)f=new THREE.Vector3(1,0,0).projectOnPlane(n);f.normalize();
    const right=new THREE.Vector3().crossVectors(n,f).normalize();
    object.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,n,new THREE.Vector3().crossVectors(right,n).normalize()));
  }
  groundDistance(a,b) { return a.clone().normalize().angleTo(b.clone().normalize())*this.earthRadius; }
  followSurface(object,target,step,lift=0,stop=0) {
    const n=object.position.clone().normalize(),d=target.clone().normalize(),distance=n.angleTo(d)*this.earthRadius;
    let f=d.clone().projectOnPlane(n);if(f.lengthSq()<1e-8)return;f.normalize();
    const angle=Math.min(step,Math.max(0,distance-stop))/this.earthRadius;
    let next=n.clone().multiplyScalar(Math.cos(angle)).addScaledVector(f,Math.sin(angle)).normalize();
    // Route around the volcano instead of cutting through its cone.
    if(this.volcanoDir&&next.angleTo(this.volcanoDir)*this.earthRadius<5){
      const away=n.clone().sub(this.volcanoDir).projectOnPlane(n).normalize();
      const side=new THREE.Vector3().crossVectors(n,away).normalize();if(side.dot(f)<0)side.negate();
      f.copy(side).addScaledVector(away,.25).normalize();next=n.clone().multiplyScalar(Math.cos(angle)).addScaledVector(f,Math.sin(angle)).normalize();
    }
    this.placeSurface(object,next,lift,f);
  }
  updateEarthCamera(dt) {
    const n=this.roverModel.position.clone().normalize(),f=this.roverForward.clone().projectOnPlane(n).normalize();
    const back=f.clone().negate().applyAxisAngle(n,cameraOrbitYaw);
    const desired=this.roverModel.position.clone().addScaledVector(n,12+cameraOrbitPitch*4).addScaledVector(back,15);
    this.camera.position.lerp(desired,1-Math.exp(-dt*5));this.camera.up.copy(n);this.camera.lookAt(this.roverModel.position.clone().addScaledVector(n,1).addScaledVector(f,2));
  }
  updateCargo() {
    while(this.cargo.children.length)this.disposeTree(this.cargo.children[0]);
    for(let i=0;i<this.shards;i++){const gem=this.mesh(new THREE.OctahedronGeometry(.25),0xffdc5d,1.2);gem.position.set((i%4-1.5)*.5,.65+Math.floor(i/8)*.35,(Math.floor(i/4)%2-.5)*.8);this.cargo.add(gem);}
    this.cargo.visible=this.stage!=='earth';
  }
  spawnSpider() {
    this.spider=new THREE.Group();this.placeSurface(this.spider,this.geo(8,-16));this.world.add(this.spider);
    const abdomen=this.mesh(new THREE.SphereGeometry(1.5,12,8),0x1e142e);abdomen.position.y=2;abdomen.scale.z=1.4;this.spider.add(abdomen);
    this.box(this.spider,[1.7,1,1.5],[0,1.4,1.8],0x3f2549);
    for(const x of [-.55,.55])this.box(this.spider,[.3,.3,.2],[x,1.6,2.6],0xff2459,2);
    this.legs=[];
    for(const sign of [-1,1])for(let i=0;i<4;i++){
      const leg=new THREE.Group(); leg.position.set(sign*.8,1.4,i*.8-1.2);
      const upper=this.box(leg,[2.3,.22,.25],[sign*1,0,0],0x59425c);upper.rotation.z=sign*.35;
      const lower=this.box(leg,[.23,1.8,.25],[sign*2,-.55,0],0x9a5870);lower.rotation.z=-sign*.3;
      this.spider.add(leg);this.legs.push(leg);
    }
    this.cargo.visible=true;this.basketBeacon.visible=false;
  }
  interact() {
    if(!this.active||this.waiting||paused)return;
    if(this.stage==='landing'){this.setStage('earth');return;}
    if(this.stage==='guardian'){this.buildCity();return;}
    if(this.stage==='city'){this.cityMenu();return;}
    if(!['earth','boss','delivery'].includes(this.stage))return;
    const near=this.roverModel.position.distanceTo(this.basket.position)<4;
    if(this.stage==='earth'&&near){this.stage='boss';this.spawnSpider();this.towing=true;this.time=0;this.checkpoint('boss');tone(330,.3,'sawtooth',.2);return;}
    if(this.stage==='delivery'&&this.basket.position.distanceTo(this.pad.position)<4&&this.roverModel.position.distanceTo(this.pad.position)<6){this.startGuardian();return;}
    if(near||this.towing)this.towing=!this.towing;
  }
  moveRover(dt) {
    const i=this.input(),normal=this.roverModel.position.clone().normalize();
    this.roverForward.projectOnPlane(normal).normalize().applyAxisAngle(normal,-i.x*dt*2.1);
    const angle=i.y*dt*(this.towing?4.8:6)/this.earthRadius;
    let next=normal.clone().multiplyScalar(Math.cos(angle)).addScaledVector(this.roverForward,Math.sin(angle)).normalize();
    if(next.angleTo(this.volcanoDir)*this.earthRadius<5.3)next.copy(normal);
    this.roverForward.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(normal,next)).projectOnPlane(next).normalize();
    this.placeSurface(this.roverModel,next,.15,this.roverForward);
    if(this.towing)this.followSurface(this.basket,this.roverModel.position,dt*7,.15,3);
    this.rope.visible=this.towing;
    if(this.towing){const p=this.rope.geometry.attributes.position,a=this.roverModel.position.clone().normalize(),b=this.basket.position.clone().normalize();for(let k=0;k<13;k++){const v=a.clone().lerp(b,k/12).normalize().multiplyScalar(this.earthRadius+.7);p.setXYZ(k,v.x,v.y,v.z);}p.needsUpdate=true;this.rope.geometry.computeBoundingSphere();}
    this.roverModel.visible=this.hitGrace<=0||Math.sin(this.time*30)>-.2;this.updateEarthCamera(dt);
  }
  launchRock() {
    let dir=this.basket.position.clone().normalize();
    if(dir.angleTo(this.volcanoDir)*this.earthRadius>15)dir=this.geo(-2,-8);
    const target=dir.clone().multiplyScalar(this.earthRadius+.3);
    const marker=new THREE.Mesh(new THREE.RingGeometry(2.8,3,40),new THREE.MeshBasicMaterial({color:0xff793e,side:THREE.DoubleSide,transparent:true,opacity:.8}));marker.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir);marker.position.copy(dir).multiplyScalar(this.earthRadius+.12);this.world.add(marker);
    const g=this.mesh(new THREE.IcosahedronGeometry(.85,0),0xff601b,1.2),origin=this.volcanoDir.clone().multiplyScalar(this.earthRadius+7);g.position.copy(origin);this.world.add(g);this.rocks.push({g,origin,target,marker,age:0});
  }
  updateRocks(dt) {
    for(let n=this.rocks.length-1;n>=0;n--){const rock=this.rocks[n];rock.age+=dt;const u=Math.min(1,rock.age/2);rock.g.position.lerpVectors(rock.origin,rock.target,u);rock.g.position.addScaledVector(rock.g.position.clone().normalize(),Math.sin(u*Math.PI)*8);rock.g.rotation.x+=dt*3;
      if(u>=1){
        if(this.spider&&this.spider.position.distanceTo(rock.target)<3.5)this.hitSpider();
        if(this.roverModel.position.distanceTo(rock.target)<3)this.hurt('The rover was caught in a volcanic impact.');
        this.burst(rock.target,0xff913b);this.disposeTree(rock.g);this.disposeTree(rock.marker);this.rocks.splice(n,1);
      }
    }
  }
  hitSpider() {
    if(!this.spider||this.stage!=='boss')return;
    this.spiderHits++;tone(110+this.spiderHits*65,.3,'sawtooth',.2);
    this.burst(this.spider.position.clone().normalize().multiplyScalar(this.earthRadius+2),0xffcb67);
    if(this.spiderHits>=5){this.disposeTree(this.spider);this.spider=null;this.stage='delivery';this.pad.visible=true;this.checkpoint('delivery');this.lasers.forEach(l=>this.disposeTree(l.g));this.lasers=[];showToast('Spider defeated! Tow the shards to the cyan launchpad.');}
  }
  laser() {
    const from=this.spider.position.clone().normalize().multiplyScalar(this.earthRadius+1.5),target=this.roverModel.position.clone().normalize().multiplyScalar(this.earthRadius+.7);
    const closest=new THREE.Vector3();new THREE.Line3(from,target).closestPointToPoint(new THREE.Vector3(),true,closest);
    if(closest.length()<this.earthRadius+.1)return; // Earth occludes beams across the horizon.
    const end=target.clone().add(target.clone().sub(from).normalize().multiplyScalar(2));
    const g=new THREE.Line(new THREE.BufferGeometry().setFromPoints([from,end]),new THREE.LineBasicMaterial({color:0xff477a,transparent:true,opacity:.4}));this.world.add(g);this.lasers.push({g,from,end,age:0,fired:false});
  }
  updateLasers(dt) {
    for(let n=this.lasers.length-1;n>=0;n--){const l=this.lasers[n];l.age+=dt;
      if(l.age>.85&&!l.fired){l.fired=true;l.g.material.opacity=1;tone(780,.12,'sawtooth',.12);const p=new THREE.Vector3();new THREE.Line3(l.from,l.end).closestPointToPoint(this.roverModel.position.clone().normalize().multiplyScalar(this.earthRadius+.7),true,p);if(p.distanceTo(this.roverModel.position.clone().normalize().multiplyScalar(this.earthRadius+.7))<1)this.hurt('The spider’s laser hit the rover.');}
      if(l.age>1.2){this.disposeTree(l.g);this.lasers.splice(n,1);}
    }
  }
  burst(pos,color) {
    for(let i=0;i<10;i++){const g=this.mesh(new THREE.BoxGeometry(.18,.18,.18),color,1);g.position.copy(pos);this.world.add(g);this.effects.push({g,v:new THREE.Vector3((Math.random()-.5)*7,Math.random()*6,(Math.random()-.5)*7),life:.8});}
  }
  updateEffects(dt) {for(let i=this.effects.length-1;i>=0;i--){const e=this.effects[i];e.life-=dt;e.g.position.addScaledVector(e.v,dt);e.v.y-=dt*6;if(e.life<=0){this.disposeTree(e.g);this.effects.splice(i,1);}}}
  updateEarth(dt) {
    this.moveRover(dt);
    if(this.stage==='boss'){
      const distance=this.groundDistance(this.spider.position,this.basket.position);
      this.followSurface(this.spider,this.basket.position,dt*3.1,0,2);
      this.legs.forEach((leg,i)=>leg.rotation.z=Math.sin(this.time*7+i)*.18);
      this.eatTimer-=dt;if(distance<3.1&&this.eatTimer<=0){this.eatTimer=3;this.shards--;this.updateCargo();tone(140,.2,'square',.12);if(this.shards<=0){this.fail('The spider ate all the shards.');return;}}
      this.laserTimer-=dt;if(this.laserTimer<=0){this.laserTimer=3.8;this.laser();}
      this.rockTimer-=dt;if(this.rockTimer<=0){this.rockTimer=2.8;this.launchRock();}
    }
    this.updateLasers(dt);this.updateRocks(dt);
    let objective, target;
    if(this.stage==='earth'){objective='Find the gold basket beacon. Deliver your 14 shards to awaken the spider.';target=this.basket.position;}
    else if(this.stage==='boss'){objective=`Spider: ${this.spiderHits}/5 volcanic hits · Shards ${this.shards}/14 · ${this.towing?'Towing':'Basket detached'}. Lure it into orange rock-impact rings beside the volcano.`;target=this.volcano.position;}
    else {objective=`Spider defeated · ${this.shards} shards safe. Tow the basket to the cyan launchpad.`;target=this.pad.position;}
    const distance=Math.round(this.groundDistance(this.roverModel.position,target));
    this.label('ACT IV · '+(this.stage==='boss'?'THE SHARD-EATER':this.stage==='delivery'?'FINAL DELIVERY':'EARTHFALL'),`Hull ${this.hull}/5 · ${objective} Target ${distance}m`,this.spiderHits/5);
    const near=this.roverModel.position.distanceTo(this.basket.position)<4;
    this.action.hidden=!(near||this.towing);
    this.action.textContent=this.stage==='earth'?'Deliver shards [E]':this.stage==='delivery'&&this.basket.position.distanceTo(this.pad.position)<4&&this.roverModel.position.distanceTo(this.pad.position)<6?'Deliver to launchpad [E]':this.towing?'Detach basket [E]':'Tow basket [E]';
  }
  guardianFigure() {
    const g=new THREE.Group();
    this.box(g,[2.7,3,2.1],[0,8,0],0x57333c,.15);this.box(g,[4,2.5,2.4],[0,10.4,0],0x78413d,.25);this.box(g,[3.8,1.8,2.5],[0,6.5,0],0x493041,.15);
    for(let i=0;i<6;i++)this.box(g,[.8,.8,.8],[Math.sin(i*.7)*.2,13.8-i*.75,-1.7],0x322038);
    for(const x of [-.7,.7])this.box(g,[.12,2.8,.1],[x,8,1.1],0xff8d34,1);
    g.userData.pyramids=[];
    for(const sign of [-1,1]){
      this.box(g,[1.5,6,1.8],[sign*1.2,3,0],0x3d2838);const arm=this.box(g,[1.3,6,1.5],[sign*3,8,0],0x784140);arm.rotation.z=sign*.25;
      const pyramid=this.mesh(new THREE.ConeGeometry(1.2,2.1,4),0xff792d,.6);pyramid.rotation.x=Math.PI/2;pyramid.position.set(sign*1.1,10,1.6);g.add(pyramid);g.userData.pyramids.push(pyramid);
    }
    this.box(g,[2.7,3,2.5],[0,13.5,0],0xb76b50);this.box(g,[3,1,2.9],[0,15,0],0x301b36);
    for(const x of [-.65,.65])this.box(g,[.5,.2,.1],[x,13.7,1.3],0x9cffff,2);return g;
  }
  startGuardian() {
    toast.classList.remove('show');toastTimer=0;
    this.stage='guardian';this.time=0;this.spawnTimer=0;this.towing=false;this.rope.visible=false;this.action.hidden=true;
    this.rocks.forEach(r=>{this.disposeTree(r.g);this.disposeTree(r.marker);});this.rocks=[];this.lasers.forEach(l=>this.disposeTree(l.g));this.lasers=[];
    this.guardianAnchor=new THREE.Group();this.placeSurface(this.guardianAnchor,this.geo(3,-7));this.world.add(this.guardianAnchor);
    this.guardian=this.guardianFigure();this.guardian.position.y=-20;this.guardianAnchor.add(this.guardian);this.pyramids=this.guardian.userData.pyramids;
    this.guardianShards=[];
    for(let i=0;i<this.shards;i++){const g=this.mesh(new THREE.OctahedronGeometry(.3),0xffed89,2);g.position.copy(this.basket.position);this.world.add(g);this.guardianShards.push(g);}
    this.cargo.visible=false;this.incoming=[];this.defenseShots=0;this.asteroidsSpawned=0;this.fade.style.opacity='0';
  }
  updateGuardian(dt) {
    const t=this.time,rise=THREE.MathUtils.smoothstep(t,0,5),fall=THREE.MathUtils.smoothstep(t,5,10),growth=THREE.MathUtils.smoothstep(t,10,16);
    this.guardian.position.y=-20+rise*20+fall*1.4;
    this.guardian.rotation.x=-Math.PI/2*fall;this.guardian.position.z=fall*7;
    this.pyramids.forEach((p,i)=>{p.scale.set(1+growth*2.5,1+growth*3.5,1+growth*2.5);p.position.x=(i?1:-1)*(1.1+growth*3.2);p.position.z=1.6+growth*1.2;p.material.emissiveIntensity=.6+growth*(1+Math.sin(t*3)*.25);});
    this.guardianAnchor.updateMatrixWorld(true);
    for(let i=0;i<this.guardianShards.length;i++){
      const target=this.pyramids[i%2].getWorldPosition(new THREE.Vector3()),u=THREE.MathUtils.clamp((t-3-i*.05)/8,0,1);
      this.guardianShards[i].position.lerpVectors(this.basket.position,target,u);this.guardianShards[i].visible=u<1;
    }
    if(t>10)this.volcano.position.copy(this.volcanoDir).multiplyScalar(this.earthRadius-Math.min(8,t-10));
    const view=this.guardianAnchor.localToWorld(new THREE.Vector3(28,24,27));this.camera.position.copy(view);this.camera.up.copy(this.guardianAnchor.position).normalize();this.camera.lookAt(this.guardianAnchor.localToWorld(new THREE.Vector3(0,3,-2)));
    if(t>=16){
      this.spawnTimer-=dt;
      if(this.spawnTimer<=0){this.spawnTimer=Math.max(.12,1.15-(t-16)*.055);const g=this.mesh(new THREE.IcosahedronGeometry(.6+Math.random()*.6,0),0xffa15a,.8);g.position.copy(this.guardianAnchor.localToWorld(new THREE.Vector3((Math.random()-.5)*38,38+Math.random()*10,-10+(Math.random()-.5)*24)));this.world.add(g);this.incoming.push({g,age:0});this.asteroidsSpawned++;}
      for(let i=this.incoming.length-1;i>=0;i--){const a=this.incoming[i];a.age+=dt;a.g.position.addScaledVector(this.guardianAnchor.position.clone().normalize(),-dt*9);a.g.rotation.x+=dt;
        if(a.age>1.4){const pyramid=this.pyramids[this.defenseShots%2];const origin=pyramid.localToWorld(new THREE.Vector3(0,1.05,0));const beam=new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin,a.g.position.clone()]),new THREE.LineBasicMaterial({color:0x81ffff}));this.world.add(beam);this.effects.push({g:beam,v:new THREE.Vector3(),life:.26});this.burst(a.g.position,0xffd884);this.disposeTree(a.g);this.incoming.splice(i,1);this.defenseShots++;tone(660,.07,'triangle',.06);}
      }
    }
    this.fade.style.opacity=String(THREE.MathUtils.clamp((t-24)/12,0,1));
    this.label('ACT V · THE EARTH GUARDIAN',t<5?'She rises from Earth, carrying the power of the shards.':t<10?'The guardian falls onto her back.':t<16?'Her twin chest pyramids grow into colossal defense towers.':'The asteroid storm intensifies. Her defenses protect the planet.',t/36);
    this.action.hidden=false;this.action.textContent='Skip to epilogue';if(t>=37)this.buildCity();
  }
  buildCity() {
    toast.classList.remove('show');toastTimer=0;
    this.stage='city';this.newWorld();this.camera.up.set(0,1,0);document.body.classList.add('retro-finale');this.action.hidden=false;
    this.fade.style.opacity='0';this.cityText.hidden=this.storyText.hidden=false;this.hud.hidden=true;
    try{localStorage.removeItem(this.saveKey);}catch{}this.refreshResume();
    this.cityRoad=new THREE.Group();this.world.add(this.cityRoad);
    this.world.background=new THREE.Color(0x120b2d);this.world.fog=new THREE.Fog(0x120b2d,45,145);
    const floor=this.mesh(new THREE.PlaneGeometry(200,200),0x100c26,.1);floor.rotation.x=-Math.PI/2;this.world.add(floor);
    const grid=new THREE.GridHelper(180,70,0xe050c4,0x392858);grid.position.y=.03;this.world.add(grid);
    for(let i=0;i<65;i++){
      const x=(i%2?1:-1)*(8+Math.random()*45),z=18-Math.floor(i/2)*4,h=4+Math.random()*21;
      const b=this.box(this.world,[3+Math.random()*3,h,3],[x,h/2,z],0x171a38);
      for(let y=1;y<h;y+=2)for(const dx of [-.8,.8])this.box(b,[.5,.65,.05],[dx,y-h/2,1.52],i%3?0x4fc9de:0xff66b0,.9);
      this.box(this.world,[.12,h,.12],[x-1.5,h/2,z+1.6],i%2?0xc253e8:0x44dbe3,1);
    }
    const moon=this.mesh(new THREE.SphereGeometry(9,24,16),0xff91ad,.7);moon.position.set(0,23,-100);this.world.add(moon);
    for(const x of [-7,7]){const p=this.mesh(new THREE.ConeGeometry(4,7,4),0x673d90,.5);p.position.set(x,3.5,-43);this.world.add(p);}
    this.cityRover=this.rover();this.cityRover.position.set(0,.1,9);this.world.add(this.cityRover);
    this.storyRoot=new THREE.Group();this.storyRoot.position.set(0,0,-16);this.world.add(this.storyRoot);this.buildStory();
    this.cityBuildings=this.world.children.filter(o=>o.isMesh&&o.geometry?.type==='BoxGeometry').map(g=>({g,z:g.position.z}));
    this.camera.position.set(0,5,22);this.camera.lookAt(0,3,-18);this.resize();this.updateCity(0);
  }
  wolf() {
    const g=new THREE.Group();this.box(g,[1.1,.9,2.4],[0,1,0],0x9ca8bc);this.box(g,[.9,.9,1],[0,1.45,-1.3],0xc4cedd);this.box(g,[.55,.4,.8],[0,1.2,-1.9],0x8893a7);
    for(const x of [-.35,.35]){const ear=this.mesh(new THREE.ConeGeometry(.23,.65,3),0xc4cedd);ear.position.set(x,2,-1.3);g.add(ear);for(const z of [-.8,.8])this.box(g,[.2,.9,.25],[x,.45,z],0x68748c);this.box(g,[.13,.13,.1],[x,1.55,-1.82],0x8dffff,2);}
    const tail=new THREE.Group();tail.position.set(0,1.2,1);g.add(tail);for(let i=0;i<6;i++){const shard=this.mesh(new THREE.OctahedronGeometry(.25-i*.02),0xffe17b,1.3);shard.position.set(Math.sin(i*.4)*.4,i*.12,i*.35);tail.add(shard);}g.userData.tail=tail;return g;
  }
  buildStory() {
    this.childhood=new THREE.Group();this.storyRoot.add(this.childhood);
    // Fully clothed childhood tableau. No adult body features or transformation here.
    const child=new THREE.Group();this.box(child,[.8,1.1,.6],[0,1.1,0],0x45a4a4);this.box(child,[.65,.65,.6],[0,2,0],0xc18b6e);this.box(child,[.75,.25,.7],[0,2.3,0],0x30223b);
    for(const x of [-.23,.23]){this.box(child,[.25,.7,.3],[x,.35,0],0x38385c);this.box(child,[.23,.9,.3],[x*2,1.1,0],0x45a4a4);}this.childhood.add(child);
    this.wolves=[];for(const x of [-2.5,2.5]){const wolf=this.wolf();wolf.position.set(x,0,1);this.childhood.add(wolf);this.wolves.push(wolf);}
    for(let i=0;i<8;i++){const tree=this.mesh(new THREE.ConeGeometry(.6,3,5),0x295b5d);tree.position.set((i%2?1:-1)*(4+i*.3),1.5,-2-i*.7);this.childhood.add(tree);}
    this.adultStory=new THREE.Group();this.storyRoot.add(this.adultStory);const adult=this.guardianFigure();adult.scale.setScalar(.38);this.adultStory.add(adult);this.adultStory.visible=false;
    this.storyRoot.scale.setScalar(1.8);
  }
  updateCity(dt) {
    const cycle=this.time%40,travel=(this.time*5)%130;
    for(const b of this.cityBuildings)b.g.position.z=((b.z+travel+110)%130)-110;
    this.cityRover.position.set(Math.sin(this.time*.35)*1.4,.15+Math.sin(this.time*9)*.035,9);this.cityRover.rotation.y=Math.PI+Math.cos(this.time*.35)*.06;
    this.wolves.forEach((w,i)=>{w.position.z=1+Math.sin(this.time+i)*.2;w.userData.tail.rotation.y=Math.sin(this.time*2+i)*.3;});
    this.childhood.visible=cycle<20;this.adultStory.visible=cycle>=20;
    this.storyText.textContent=cycle<10?'Before she became Earth’s guardian, she was a child raised by wolves.':cycle<20?'Their tails shimmered with oddity shards. They taught her to protect her home.':cycle<30?'She grew into the volcanic guardian, carrying the pack’s gift within her.':'The rover brought the shards home. Now her light watches over the sleeping city.';
    this.camera.position.set(0,5,22);this.camera.lookAt(0,3,-16);
    this.action.hidden=false;this.action.textContent='Menu [P]';this.cityText.hidden=false;this.storyText.hidden=false;
  }
  cityMenu() {
    if(this.waiting)return;
    paused=false;pausePanel.classList.add('hidden');
    this.showDialog('Journey complete','Congratulations! You saved the Earth. The oddity is manifestated',[
      ['Keep watching',()=>{updateTouchUi();}],['Explore more planets',()=>this.returnToOrbit()],['New adventure',()=>{this.reset();resetGame(1,false);}]
    ]);
  }
  update(dt) {
    if(!this.active)return;
    updateToast(dt);
    if(!paused&&!this.waiting){
      this.time+=dt;this.hitGrace=Math.max(0,this.hitGrace-dt);
      if(this.stage==='flight')this.updateFlight(dt);
      else if(this.stage==='landing')this.updateLanding();
      else if(['earth','boss','delivery'].includes(this.stage))this.updateEarth(dt);
      else if(this.stage==='guardian')this.updateGuardian(dt);
      else if(this.stage==='city')this.updateCity(dt);
      this.updateEffects(dt);
    }
    if(!paused&&!this.waiting)this.music(dt);
    this.action.style.display=paused||this.waiting?'none':'';
    if(this.stage==='city')document.body.classList.remove('show-touch-controls');
    renderer.render(this.world,this.camera);
  }
}
