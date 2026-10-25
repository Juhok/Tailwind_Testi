/* Orbital Oddity Mobile 10 — optional Earth mission. No external media required. */
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
    this.time=0; this.spawnTimer=0; this.musicClock=0; this.musicBeat=0;
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
      if(stage==='delivery') {this.spiderHits=5; this.towing=true; this.basket.position.copy(this.roverModel.position).add(new THREE.Vector3(0,0,3)); this.pad.visible=true;}
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
  music(dt) {
    if(!audioCtx || paused) return;
    this.musicClock-=dt; if(this.musicClock>0) return;
    this.musicClock=.15;
    const song=this.stage==='boss'?[164.81,196,220,246.94,220,196,146.83,164.81]:[220,261.63,329.63,392,440,392,329.63,261.63];
    const beat=this.musicBeat++, note=song[beat%8];
    tone(note*(beat%4===3?2:1),.2,'triangle',.16,musicGain);
    if(beat%4===0) {tone(song[Math.floor(beat/8)%8]/2,.45,'sawtooth',.075,musicGain);tone(55,.12,'sine',.25,musicGain);}
    if(beat%16===0) [1,1.25,1.5].forEach(r=>tone(220*r,.9,'sine',.055,musicGain));
    if(beat%2) tone(1400,.035,'triangle',.025,musicGain);
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
    const kind=Math.floor(Math.random()*3); let g;
    if(kind===0) g=this.mesh(new THREE.IcosahedronGeometry(.7+Math.random()*.5,0),0x8e7d79);
    else {g=new THREE.Group(); this.box(g,[.9,.7,.9],[0,0,0],kind===1?0xbfc4d0:0x89776d); for(const sign of [-1,1])this.box(g,[1.4,.12,.7],[sign*1.2,0,0],kind===1?0x3480e7:0x89665a);}
    g.position.set((Math.random()-.5)*16,(Math.random()-.5)*10,-100); this.world.add(g); this.hazards.push({g,radius:kind===0?1.2:1.8,speed:20+Math.random()*8});
  }
  updateFlight(dt) {
    const i=this.input(); this.ship.position.x=THREE.MathUtils.clamp(this.ship.position.x+i.x*7*dt,-8,8); this.ship.position.y=THREE.MathUtils.clamp(this.ship.position.y+i.y*6*dt,-5,5);
    this.ship.rotation.z=-i.x*.22; this.ship.userData.flame.scale.y=.9+Math.sin(this.time*26)*.2;
    const progress=Math.min(1,this.time/55); this.earth.position.z=-180+progress*153; this.earth.rotation.y=this.time*.025;
    this.spawnTimer-=dt; if(this.spawnTimer<=0 && progress<.94) {this.flightObstacle();this.spawnTimer=.65;}
    for(let n=this.hazards.length-1;n>=0;n--) {const h=this.hazards[n]; h.g.position.z+=dt*h.speed;h.g.rotation.z+=dt*.6;
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
    this.world.background=new THREE.Color(0x253d65); this.world.fog=new THREE.Fog(0x253d65,55,140);
    const ocean=this.mesh(new THREE.PlaneGeometry(300,300),0x174d74,.15);ocean.rotation.x=-Math.PI/2;ocean.position.y=-.4;this.world.add(ocean);
    const island=this.mesh(new THREE.CylinderGeometry(36,39,2,48),0x457464);island.position.y=-1;this.world.add(island);
    const grid=new THREE.GridHelper(68,34,0x7ec2ae,0x537f73);grid.position.y=.02;this.world.add(grid);
    this.roverModel=this.rover();this.roverModel.position.set(0,.1,15);this.world.add(this.roverModel);this.heading=0;
    this.basket=new THREE.Group();this.basket.position.set(0,.1,-5);
    this.box(this.basket,[2.6,.25,2.5],[0,.25,0],0xb78340);
    for(const z of [-1.2,1.2])for(let y=.65;y<1.6;y+=.4)this.box(this.basket,[2.6,.16,.12],[0,y,z],0xe1b978);
    for(const x of [-1.2,1.2])for(let y=.65;y<1.6;y+=.4)this.box(this.basket,[.12,.16,2.4],[x,y,0],0xe1b978);
    this.cargo=new THREE.Group(); this.basket.add(this.cargo);this.world.add(this.basket);this.updateCargo();
    this.basketBeacon=new THREE.Group();this.beacon(this.basketBeacon,0xffdd77);this.basket.add(this.basketBeacon);
    this.rope=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:0xffe0a0}));this.world.add(this.rope);this.rope.visible=false;
    this.volcano=new THREE.Group();this.volcano.position.set(-12,0,-12);
    const mountain=this.mesh(new THREE.ConeGeometry(5,7,12),0x4e2526);mountain.position.y=3.5;this.volcano.add(mountain);
    const lava=this.mesh(new THREE.SphereGeometry(1.25,12,8),0xff650d,2);lava.position.y=6.6;this.volcano.add(lava);
    this.world.add(this.volcano);
    this.pad=new THREE.Group();this.pad.position.set(15,0,-17);this.box(this.pad,[5,.2,5],[0,.1,0],0x385279);this.beacon(this.pad,0x80ffff);this.world.add(this.pad);this.pad.visible=false;
    for(let n=0;n<28;n++) {const a=n/28*Math.PI*2;const p=this.mesh(new THREE.ConeGeometry(1+Math.random(),2+Math.random()*4,5),0x254e4e);p.position.set(Math.sin(a)*32,1,Math.cos(a)*32);this.world.add(p);}
    this.spider=null;this.spiderHits=0;this.rockTimer=2;this.laserTimer=3;this.eatTimer=3;this.towing=false;
    this.camera.position.set(0,22,35);this.camera.lookAt(0,0,0);
  }
  updateCargo() {
    while(this.cargo.children.length)this.disposeTree(this.cargo.children[0]);
    for(let i=0;i<this.shards;i++){const gem=this.mesh(new THREE.OctahedronGeometry(.25),0xffdc5d,1.2);gem.position.set((i%4-1.5)*.5,.65+Math.floor(i/8)*.35,(Math.floor(i/4)%2-.5)*.8);this.cargo.add(gem);}
    this.cargo.visible=this.stage!=='earth';
  }
  spawnSpider() {
    this.spider=new THREE.Group();this.spider.position.set(8,0,-21);this.world.add(this.spider);
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
    if(!['earth','boss','delivery'].includes(this.stage))return;
    const near=this.roverModel.position.distanceTo(this.basket.position)<4;
    if(this.stage==='earth'&&near){this.stage='boss';this.spawnSpider();this.towing=true;this.time=0;this.checkpoint('boss');tone(330,.3,'sawtooth',.2);return;}
    if(this.stage==='delivery'&&this.basket.position.distanceTo(this.pad.position)<4&&this.roverModel.position.distanceTo(this.pad.position)<6){this.startGuardian();return;}
    if(near||this.towing)this.towing=!this.towing;
  }
  moveRover(dt) {
    const i=this.input();this.heading-=i.x*dt*2.1;
    const direction=new THREE.Vector3(-Math.sin(this.heading),0,-Math.cos(this.heading));
    const old=this.roverModel.position.clone();this.roverModel.position.addScaledVector(direction,i.y*dt*(this.towing?4.8:6));
    if(Math.hypot(this.roverModel.position.x,this.roverModel.position.z)>29||this.roverModel.position.distanceTo(this.volcano.position)<5.3)this.roverModel.position.copy(old);
    this.roverModel.rotation.y=this.heading;
    if(this.towing){const delta=this.roverModel.position.clone().sub(this.basket.position);delta.y=0;const distance=delta.length();if(distance>3)this.basket.position.addScaledVector(delta.normalize(),Math.min(distance-3,dt*7));}
    this.rope.visible=this.towing;
    if(this.towing){const p=this.rope.geometry.attributes.position;p.setXYZ(0,this.roverModel.position.x,.5,this.roverModel.position.z);p.setXYZ(1,this.basket.position.x,.7,this.basket.position.z);p.needsUpdate=true;this.rope.geometry.computeBoundingSphere();}
    this.roverModel.visible=this.hitGrace<=0||Math.sin(this.time*30)>-.2;
    this.camera.position.lerp(this.roverModel.position.clone().add(new THREE.Vector3(0,22,24)),1-Math.exp(-dt*4));this.camera.lookAt(this.roverModel.position.clone().add(new THREE.Vector3(0,0,-4)));
  }
  launchRock() {
    // Landing targets the basket, encouraging the player to bait the chasing spider.
    const target=this.basket.position.clone(); target.y=.3;
    if(target.distanceTo(this.volcano.position)>15) {target.copy(this.volcano.position).add(new THREE.Vector3(8,0,0));target.y=.3;}
    const marker=new THREE.Mesh(new THREE.RingGeometry(2.8,3,40),new THREE.MeshBasicMaterial({color:0xff793e,side:THREE.DoubleSide,transparent:true,opacity:.8}));marker.rotation.x=-Math.PI/2;marker.position.copy(target);marker.position.y=.04;this.world.add(marker);
    const g=this.mesh(new THREE.IcosahedronGeometry(.85,0),0xff601b,1.2);const origin=this.volcano.position.clone().add(new THREE.Vector3(0,7,0));g.position.copy(origin);this.world.add(g);this.rocks.push({g,origin,target,marker,age:0});
  }
  updateRocks(dt) {
    for(let n=this.rocks.length-1;n>=0;n--){const rock=this.rocks[n];rock.age+=dt;const u=Math.min(1,rock.age/2);rock.g.position.lerpVectors(rock.origin,rock.target,u);rock.g.position.y+=Math.sin(u*Math.PI)*7;rock.g.rotation.x+=dt*3;
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
    this.burst(this.spider.position.clone().add(new THREE.Vector3(0,2,0)),0xffcb67);
    if(this.spiderHits>=5){this.disposeTree(this.spider);this.spider=null;this.stage='delivery';this.pad.visible=true;this.checkpoint('delivery');this.lasers.forEach(l=>this.disposeTree(l.g));this.lasers=[];showToast('Spider defeated! Tow the shards to the cyan launchpad.');}
  }
  laser() {
    const from=this.spider.position.clone().add(new THREE.Vector3(0,1.5,0));const target=this.roverModel.position.clone().add(new THREE.Vector3(0,.4,0));
    const end=from.clone().add(target.clone().sub(from).normalize().multiplyScalar(45));
    const g=new THREE.Line(new THREE.BufferGeometry().setFromPoints([from,end]),new THREE.LineBasicMaterial({color:0xff477a,transparent:true,opacity:.4}));this.world.add(g);this.lasers.push({g,from,end,age:0,fired:false});
  }
  updateLasers(dt) {
    for(let n=this.lasers.length-1;n>=0;n--){const l=this.lasers[n];l.age+=dt;
      if(l.age>.85&&!l.fired){l.fired=true;l.g.material.opacity=1;tone(780,.12,'sawtooth',.12);const p=new THREE.Vector3();new THREE.Line3(l.from,l.end).closestPointToPoint(this.roverModel.position.clone().add(new THREE.Vector3(0,.5,0)),true,p);if(p.distanceTo(this.roverModel.position.clone().add(new THREE.Vector3(0,.5,0)))<1)this.hurt('The spider’s laser hit the rover.');}
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
      const delta=this.basket.position.clone().sub(this.spider.position);delta.y=0;const distance=delta.length();
      if(distance>2)this.spider.position.addScaledVector(delta.normalize(),Math.min(dt*3.1,distance-2));
      this.spider.lookAt(this.basket.position.x,0,this.basket.position.z);
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
    const distance=Math.round(this.roverModel.position.distanceTo(target));
    this.label('ACT IV · '+(this.stage==='boss'?'THE SHARD-EATER':this.stage==='delivery'?'FINAL DELIVERY':'EARTHFALL'),`Hull ${this.hull}/5 · ${objective} Target ${distance}m`,this.spiderHits/5);
    const near=this.roverModel.position.distanceTo(this.basket.position)<4;
    this.action.hidden=!(near||this.towing);
    this.action.textContent=this.stage==='earth'?'Deliver shards [E]':this.stage==='delivery'&&this.basket.position.distanceTo(this.pad.position)<4&&this.roverModel.position.distanceTo(this.pad.position)<6?'Deliver to launchpad [E]':this.towing?'Detach basket [E]':'Tow basket [E]';
  }
  startGuardian() {
    this.stage='guardian';this.time=0;this.towing=false;this.rope.visible=false;this.action.hidden=true;
    this.guardian=new THREE.Group();this.guardian.position.set(4,-20,-18);this.world.add(this.guardian);
    // Adult volcanic guardian: angular plated silhouette, glowing mineral chest armor.
    this.box(this.guardian,[2.7,3,2.1],[0,8,0],0x57333c,.15);
    this.box(this.guardian,[4,2.5,2.4],[0,10.4,0],0x78413d,.25);
    this.box(this.guardian,[3.8,1.8,2.5],[0,6.5,0],0x493041,.15);
    for (let i=0;i<6;i++) this.box(this.guardian,[.8,.8,.8],[Math.sin(i*.7)*.2,13.8-i*.75,-1.7],0x322038);
    for (const x of [-.7,.7]) this.box(this.guardian,[.12,2.8,.1],[x,8,1.1],0xff8d34,1);
    for(const s of [-1,1]){
      this.box(this.guardian,[1.5,6,1.8],[s*1.2,3,0],0x3d2838);
      const arm=this.box(this.guardian,[1.3,6,1.5],[s*3,8,0],0x784140);arm.rotation.z=s*.25;
      const armor=this.mesh(new THREE.ConeGeometry(1.2,2.1,4),0xff792d,.6);armor.rotation.x=Math.PI/2;armor.position.set(s*1.1,10,1.6);this.guardian.add(armor);
    }
    this.box(this.guardian,[2.7,3,2.5],[0,13.5,0],0xb76b50);
    this.box(this.guardian,[3,1,2.9],[0,15,0],0x301b36);
    for(const x of [-.65,.65])this.box(this.guardian,[.5,.2,.1],[x,13.7,1.3],0x9cffff,2);
    this.pyramids=[];
    for(const x of [-10,1]){const p=this.mesh(new THREE.ConeGeometry(5,8,4),0x6a4360,.1);p.position.set(x,-5,-12);this.world.add(p);this.pyramids.push(p);}
    this.guardianShards=[];
    for(let i=0;i<this.shards;i++){const g=this.mesh(new THREE.OctahedronGeometry(.3),0xffed89,2);g.position.copy(this.basket.position).add(new THREE.Vector3(0,1,0));this.world.add(g);this.guardianShards.push(g);}
    this.cargo.visible=false;this.camera.position.set(29,19,30);this.camera.lookAt(0,7,-12);
    this.defenseBolts=[];this.incoming=[];
  }
  updateGuardian(dt) {
    const t=this.time;this.guardian.position.y=-20+Math.min(1,t/6)*20;
    for(let i=0;i<this.guardianShards.length;i++){const g=this.guardianShards[i],u=THREE.MathUtils.clamp((t-5-i*.08)/4,0,1);g.position.lerpVectors(this.basket.position.clone().add(new THREE.Vector3(0,1,0)),new THREE.Vector3(4+Math.sin(i)*1.2,10,-16),u);g.rotation.y+=dt*2;}
    if(t>9){this.volcano.position.y=-Math.min(9,(t-9));this.pyramids.forEach(p=>p.position.y=-5+Math.min(1,(t-10)/5)*9);this.guardian.traverse(o=>{if(o.material)o.material.emissiveIntensity=.3+Math.sin(t*3)*.2;});}
    if(t>15){
      this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawnTimer=1.2;const g=this.mesh(new THREE.IcosahedronGeometry(1.2,0),0xffa15a,.8);g.position.set((Math.random()-.5)*35,35,-25);this.world.add(g);this.incoming.push(g);}
      for(let i=this.incoming.length-1;i>=0;i--){const a=this.incoming[i];a.position.y-=dt*7;
        if(a.position.y<22){const p=this.pyramids[i%2],origin=p.position.clone().add(new THREE.Vector3(0,4,0));const beam=new THREE.Line(new THREE.BufferGeometry().setFromPoints([origin,a.position.clone()]),new THREE.LineBasicMaterial({color:0x81ffff}));this.world.add(beam);this.effects.push({g:beam,v:new THREE.Vector3(),life:.3});this.burst(a.position,0xffd884);this.disposeTree(a);this.incoming.splice(i,1);tone(660,.08,'triangle',.1);}
      }
    }
    this.label('ACT V · THE ODDITY AWAKENS',t<6?'A volcanic guardian rises from beneath Earth.':t<10?'The oddity shards power her crystalline armor.':t<15?'The supervolcano sinks. Two colossal defense pyramids rise.':'The pyramids intercept incoming asteroids. Earth is protected.',t/25);
    this.action.hidden=false;this.action.textContent='Skip to epilogue';
    if(t>25)this.buildCity();
  }
  buildCity() {
    this.stage='city';this.newWorld();document.body.classList.add('retro-finale');this.action.hidden=true;
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
    this.camera.position.set(0,4,24);this.camera.lookAt(0,10,-70);this.resize();
  }
  updateCity(dt) {
    this.camera.position.z=24-Math.min(this.time,14)*1.2;this.camera.lookAt(0,10,-70);
    this.label('EPILOGUE · EARTH AFTER DARK','Original midnight synth · The city sleeps beneath the oddity’s protection.',this.time/14);
    if(this.time>14&&this.stage!=='complete'){
      this.stage='complete';try{localStorage.removeItem(this.saveKey);}catch{}this.refreshResume();
      this.showDialog('Game over','Congratulations! You saved the Earth. The oddity is manifestated', [['Explore more planets',()=>this.returnToOrbit()],['New adventure',()=>{this.reset();resetGame(1,false);}]]);
    }
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
    if(!paused&&(!this.waiting||this.stage==='complete'))this.music(dt);
    this.action.style.display=paused||this.waiting?'none':'';
    renderer.render(this.world,this.camera);
  }
}
