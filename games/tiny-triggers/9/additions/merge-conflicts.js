(function(){
"use strict";
TinyV9.register({"id":"merge-conflicts","title":"The Merge Conflict Surprise","chapter":"digital","description":"Finish your work, then sync it with the team.","hint":"Hold the keyboard to finish the final function. Press PUSH, then PULL after the rejection.","verdict":"Finished, except for the entire merge.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='coding',typed=0,hold=false,t=0,wait=0,conflicts=0,pressed=null;
const clean=['function launchShip() {','  const orbit = findOrbit();','  engine.start(orbit);','  return { ready: true };','}','function saveMission() {','  writeCheckpoint(ship);','}'];
const bad=['<<<<<<< YOUR FINISHED WORK','  engine.start(orbit);','=======','  engine.begin(nextOrbit);','>>>>>>> TEAM CHANGES','','<<<<<<< YOUR FINISHED WORK','  writeCheckpoint(ship);','=======','  persistMission(rover);','>>>>>>> TEAM CHANGES'];
return{draw(){room();api.ellipse(242,232,166,13,'#14252b');api.round(33,20,414,177,9,'#18252f','#657c83');api.round(42,29,396,151,3,'#182a35');api.rect(43,29,394,19,'#334d59');for(let i=0;i<3;i++)api.ellipse(55+i*11,38,3,3,['#d17e75','#ddba71','#7bb394'][i]);label('mission.js',135,41,9);api.rect(43,48,63,131,'#22333e');for(let i=0;i<5;i++){api.rect(50,61+i*17,4,5,'#6f9fa5');api.line(60,64+i*17,96,64+i*17,'#789998',2)}
const lines=phase==='conflicts'?bad:clean;lines.forEach((l,i)=>{const y=62+i*(phase==='conflicts'?9.7:13);if(phase==='conflicts'&&(i<5||i>5))api.rect(110,y-8,321,10,i%6===0?'#72464c':'#413943');api.text(String(i+1),118,y,7,'#57737b','right');const text=phase==='coding'&&i===7?l.slice(0,Math.floor(typed*2)):l;api.text(text,125,y,phase==='conflicts'?7.4:8.3,l.startsWith('<<<')||l.startsWith('>>>')||l==='======='?'#efa38f':(i%3===0?'#88c6b2':'#c1cfc2'),'left')});
api.rect(46,181,388,11,'#527f77');label(phase==='coding'?'UNSAVED CHANGES':phase==='ready'?'ALL CHECKS PASSED':phase==='rejected'?'PUSH REJECTED: REMOTE HAS NEW COMMITS':phase==='pulling'?'PULLING CHANGES...':phase==='conflicts'?'12 FILES WITH MERGE CONFLICTS':'PUSHING...',240,189,7,phase==='conflicts'?C.gold:C.paper);
api.poly([[219,197],[260,197],[270,219],[208,219]],'#627d82');api.round(185,216,111,8,4,'#98a49a');
api.poly([[60,214],[171,214],[189,258],[43,258]],'#415864');for(let r=0;r<4;r++)for(let k=0;k<10;k++){const down=hold&&(Math.floor(t*14)+k)%6===0;api.round(61+k*10-r*2,219+r*8,8,6,1,down?'#c7c393':'#789093')}
api.line(97,253,144,253,'#bac4aa',3);api.round(370,214,32,41,13,'#71908d');api.line(386,217,386,235,'#394e54',2);api.round(383,220,6,9,2,'#a9b9a7');
if(phase==='coding'){label('HOLD TO FINISH',119,207,9,C.gold);api.rect(48,263,141*typed,3,C.gold)}
if(phase==='ready'||phase==='pushing')button('PUSH',256,244,90);
if(phase==='rejected'||phase==='pulling')button('PULL',256,244,90,'#a87950');
if(phase==='conflicts'){api.round(198,225,143,33,5,'#693f4a');label('12 CONFLICTED FILES',270,246,10,C.gold)}
},down(p){if(phase==='coding'&&hit(p,117,234,150,60))hold=true;else if((phase==='ready'||phase==='rejected')&&hit(p,256,240,106,44))pressed=phase},move(){},up(p){hold=false;if(pressed&&hit(p,256,240,106,44)){phase=pressed==='ready'?'pushing':'pulling';wait=0;api.tone(430,.08,.02)}pressed=null},cancel(){hold=false;pressed=null},update(dt){t+=dt;if(phase==='coding'&&hold){typed=Math.min(1,typed+dt*.6);if(Math.floor(t*16)!==Math.floor((t-dt)*16))api.tone(180+Math.floor(t*8)%3*30,.02,.008);if(typed===1){phase='ready';hold=false;api.say('Task finished. Push your changes.')}}if(phase==='pushing'||phase==='pulling'){wait+=dt;if(wait>1.1){if(phase==='pushing'){phase='rejected';api.say('Remote changes detected. Pull to continue.');api.tone(155,.15,.02)}else{phase='conflicts';conflicts=12;wait=0;api.say('Merge conflicts in twelve files. All yours.')}}}if(phase==='conflicts'){wait+=dt;if(wait>1.2)api.done()}},debug(){return{phase,typed,conflicts,hold}}};

}});})();
