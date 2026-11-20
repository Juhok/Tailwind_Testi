(function(){
'use strict';
TinyV8.register({id:'fogging-windshield',title:'The Fogging Windshield',chapter:'road',
description:'Set off with a clear view. That should last, right?',
hint:'Press START to set off. Once the windshield fogs up, drag the ventilation slider from 0 all the way right to 4 and release it.',
verdict:'Maximum ventilation. Minimum reassurance.',
create(api){
 const{ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
 let phase='parked',time=0,age=0,road=0,fog=0,fan=0,drag=null,press=null,travel=0,clearedOnce=false,air=0,finished=false;
 const wind=()=>{ctx.beginPath();ctx.moveTo(37,12);ctx.lineTo(442,12);ctx.lineTo(422,157);ctx.quadraticCurveTo(240,169,58,157);ctx.closePath();};
 function landscape(){
  ctx.save();wind();ctx.clip();
  const sky=ctx.createLinearGradient(0,0,0,147);sky.addColorStop(0,'#688b9c');sky.addColorStop(.7,'#c1cdbd');sky.addColorStop(1,'#cfd1b1');rect(20,0,442,180,sky);
  ellipse(319,43,13,13,'#e9d8a7');ellipse(319,43,19,19,'#e8d8a41c');
  poly([[14,96],[55,72],[82,84],[136,62],[190,83],[235,69],[287,84],[357,62],[411,81],[462,70],[472,164],[14,164]],'#6e9085');
  poly([[13,117],[82,101],[143,112],[210,98],[274,110],[331,95],[416,111],[468,106],[473,170],[14,170]],'#8a9e7d');
  poly([[225,89],[257,89],[362,171],[119,171]],'#485f65');line(224,90,117,170,'#d0cbb0',2);line(258,90,365,170,'#d0cbb0',2);
  for(let i=0;i<7;i++){const z=((i/7+road*.22)%1),y=92+Math.pow(z,1.8)*85,w=1+z*3;line(241,y,242,y+4+z*10,'#e3dbb7',w);}
  // Roadside trees, posts and a house drift outward as the car moves forward.
  for(let i=0;i<5;i++){const z=((i/5+road*.14)%1),y=91+z*z*76,dx=38+z*z*167,s=3+z*15;for(const side of[-1,1]){const x=241+dx*side;line(x,y-s*.3,x,y+s*.2,'#4d6754',2+z*2);poly([[x-s,y-s*.4],[x,y-s*2.2],[x+s,y-s*.4]],'#416b60');poly([[x-s*.8,y-s*.9],[x,y-s*2.8],[x+s*.8,y-s*.9]],'#507f6d');}}
  round(351,72,39,22,1,'#b5ad8b');poly([[347,73],[371,58],[394,73]],'#6d786a');rect(357,77,8,8,'#587a79');rect(373,78,10,16,'#717e69');
  for(let i=0;i<5;i++){const z=((i/5+road*.19)%1),y=96+z*z*65,x=212-z*z*103;line(x,y-4-z*7,x,y+1,'#e8debc',2+z*2);line(270+z*z*104,y-4-z*7,270+z*z*104,y+1,'#e8debc',2+z*2);}
  rect(22,8,436,154,'#b5d2d508');
  if(fog>.001){
   // Condensation grows inward, leaving only a small oval of visibility.
   const rx=24+(1-fog)*290,ry=12+(1-fog)*153;
   ctx.save();ctx.translate(242,86);ctx.scale(rx,ry);
   const veil=ctx.createRadialGradient(0,0,.56,0,0,1.13);veil.addColorStop(0,'#b8ccc900');veil.addColorStop(.56,`rgba(189,208,204,${fog*.7})`);veil.addColorStop(1,`rgba(189,208,204,${Math.min(.97,fog*1.12)})`);
   rect(-15,-20,30,40,veil);ctx.restore();
   for(let i=0;i<105;i++){const x=40+(i*79)%400,y=16+(i*43)%134;const d=Math.hypot((x-242)/rx,(y-86)/ry);if(d<1.05)continue;ctx.globalAlpha=clamp((fog-.12)*1.3,0,.62);ellipse(x,y,.6+i%3*.3,1.5+i%4*.6,'#edf3db');line(x+.5,y+1,x+.5,y+3+i%4,'#89aaa5',.7);}
   ctx.globalAlpha=1;
   for(let i=0;i<5;i++){ctx.globalAlpha=fog*.2;ctx.strokeStyle='#eff2dc';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(48+i*18,151);ctx.quadraticCurveTo(40+i*12,100,46+i*12,65);ctx.stroke();}ctx.globalAlpha=1;
  }
  // Defroster airflow remains behind the dashboard and in front of the glass.
  if(air>.01){for(let i=0;i<7;i++){const x=104+i*43,shift=((time*1.3+i*.19)%1);ctx.globalAlpha=air*(1-shift)*.5;ctx.beginPath();ctx.moveTo(x,153);ctx.bezierCurveTo(x-9,132-shift*15,x+9,120-shift*20,x,98-shift*26);ctx.strokeStyle='#e6edcf';ctx.lineWidth=1.5;ctx.stroke();}ctx.globalAlpha=1;}
  ctx.restore();
 }
 function glassFrame(){
  poly([[0,0],[34,0],[61,164],[0,184]],'#243d46');poly([[447,0],[480,0],[480,184],[420,164]],'#243d46');
  line(35,2,59,159,'#6f9293',3);line(446,2,422,159,'#6f9293',3);rect(0,0,480,11,'#28414a');
  // Rearview mirror, without any ground reticle/grid.
  line(260,5,260,19,'#19323b',5);round(217,16,90,28,6,'#17343d','#829b92');round(222,20,80,19,3,'#a5b8ad');poly([[242,38],[257,23],[266,23],[285,38]],'#6d8888');line(261,28,262,35,'#dfd8b6',1.5);line(225,23,245,23,'#cad5ba',1);
  line(91,158,196,150,'#1d3d49',3);line(170,152,223,148,'#15333e',4);line(287,158,378,151,'#1d3d49',3);line(353,152,404,148,'#15333e',4);
 }
 function dash(){
  poly([[0,163],[94,157],[223,163],[361,157],[480,163],[480,270],[0,270]],'#354f59');poly([[0,163],[94,157],[223,163],[361,157],[480,163],[480,180],[0,180]],'#78918e');
  for(const x of[80,283]){round(x,162,116,12,3,'#263e47');for(let i=0;i<13;i++)line(x+5+i*8,165,x+7+i*8,172,'#658683',1);}
  round(65,178,143,55,16,'#193541');for(const x of[103,170]){ellipse(x,203,23,22,'#5f8186');ellipse(x,203,20,19,'#173340');for(let j=0;j<7;j++){const a=2.3+j*.7;line(x+Math.cos(a)*15,203+Math.sin(a)*15,x+Math.cos(a)*18,203+Math.sin(a)*18,'#b0c3b6',1);}const a=phase==='parked'?2.4:3.6+Math.sin(time*2)*.03;line(x,203,x+Math.cos(a)*14,203+Math.sin(a)*14,'#e6bc83',1.5);ellipse(x,203,2,2,'#c7d1bc');}
  text(phase==='parked'?'0':'34',104,214,8,'#e2e5c6');text('km/h',104,223,5,'#aac2b5');text(phase==='parked'?'P':'D',171,214,8,'#cedec4');
  // Familiar tactile steering wheel; all ventilation controls sit outside the fog.
  ellipse(130,260,78,64,'#132d38');ellipse(130,260,64,51,'#7b9698');ellipse(130,260,55,43,'#2c4854');line(70,240,108,260,'#385762',12);line(188,239,151,259,'#385762',12);round(105,240,51,37,10,'#304e5a');line(116,249,144,249,'#799a99',2);
  ellipse(242,227,20,20,'#172f38');ellipse(242,226,16,16,phase==='parked'?'#7caa86':'#547776');ellipse(242,225,12,12,phase==='parked'?'#456f61':'#284d51');text(phase==='parked'?'START':'ON',242,228,6,'#e0e4bf');
  round(281,185,174,74,8,'#183740','#748f89');round(290,192,47,18,3,'#668a7d');text('FAN '+Math.round(fan*4),314,204,8,'#dce8be');text('VENTILATION',399,202,7,'#b2c6ad');
  // Windshield icon and little rising arrows identify the defroster setting.
  ctx.strokeStyle='#c8d8b5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(429,211);ctx.quadraticCurveTo(442,207,450,211);ctx.lineTo(447,217);ctx.lineTo(431,217);ctx.closePath();ctx.stroke();for(let x=434;x<448;x+=5){line(x,216,x+1,211,'#c8d8b5',1);}
  round(301,225,132,11,5,'#0e2931');round(305,229,124*fan,3,1,'#b2c99b');
  for(let i=0;i<5;i++){const x=305+i*30;line(x,240,x,243,'#92aca1',1);text(String(i),x,251,7,'#c2d1b2');}
  const kx=305+fan*120;round(kx-9,218,18,25,4,'#a8bb9b','#d7d9ba');for(let i=0;i<3;i++)line(kx-4+i*4,224,kx-4+i*4,237,'#768f7b',1);
  if(drag==='fan'){poly([[480,270],[442,259],[kx+5,239],[kx+4,224],[kx+13,218],[kx+20,224],[453,244],[480,248]],'#bd987c');round(kx+4,220,14,11,5,'#dbb898');}
  if(phase==='fogged')text('JUST ONE LITTLE CLEAR PATCH.',243,183,7,'#e2d7ae');
  else if(phase==='clear')text('THERE. THAT FIXED IT.',242,183,8,'#d1dfb9');
  else if(phase==='refog'||phase==='done')text('STILL ON MAX.',242,183,8,'#edd2a5');
 }
 return{draw(){rect(0,0,480,270,'#18323e');landscape();glassFrame();dash();},
  down(p){if(phase==='parked'&&hit(p,242,226,43,43)){drag='start';press={...p};travel=0;}else if(phase==='fogged'&&hit(p,305+fan*120,230,42,48)){drag='fan';press={...p};}},
  move(p){if(drag==='start')travel=Math.hypot(p.x-press.x,p.y-press.y);if(drag==='fan')fan=clamp((p.x-305)/120,0,1);},
  up(p){if(drag==='start'&&travel<12&&hit(p,242,226,43,43)){phase='driving';age=0;api.tone(170,.15,.014);api.say('A beautifully clear morning.');}else if(drag==='fan'){if(fan>.83){fan=1;phase='clearing';age=0;api.tone(330,.12,.014);api.say('Full ventilation. Watch the glass clear.');}else fan=0;}drag=null;},
  cancel(){if(drag==='fan')fan=0;drag=null;travel=0;},
  update(dt){time+=dt;if(phase!=='parked')road+=dt*.52;
   if(phase==='driving'){age+=dt;fog=clamp((age-1.1)/3.4,0,1);if(age>4.5){phase='fogged';age=0;api.say('Only a tiny patch left. Turn the ventilation all the way up.');}}
   if(phase==='clearing'){age+=dt;air=Math.min(1,air+dt*2);fog=Math.max(0,1-age/2.1);if(age>=2.1){phase='clear';age=0;clearedOnce=true;fog=0;}}
   else if(phase==='clear'){age+=dt;air=1;if(age>1.7){phase='refog';age=0;api.say('The fog is coming back. The fan is still on maximum.');}}
   else if(phase==='refog'){age+=dt;fog=Math.min(.85,age/3.4);air=.7;if(fog>=.85){phase='done';finished=true;api.done();}}
   else if(phase==='done'){air=.7;fog=.85;}
  },
  debug(){return{phase,fog,fan,drag,age,road,air,clearedOnce,finished,tinyPatch:phase==='fogged',controlsVisible:true,refogged:clearedOnce&&fog>.5,visibility:1-fog};}
 };
}});
})();
