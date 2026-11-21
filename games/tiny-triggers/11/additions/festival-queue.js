(function(){
"use strict";
TinyV9.register({"id":"festival-queue","title":"The Festival Toilet Queue","chapter":"waiting","description":"Join the queue and shuffle toward the corner.","hint":"Drag yourself to the back of the line. Then drag toward the corner and hold while the queue slowly moves.","verdict":"The corner was only the introduction.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='join',x=36,drag=false,goal=36,t=0,cam=0,reveal=0;
return{draw(){api.rect(0,0,480,270,'#344c51');api.rect(0,151,480,119,'#69705a');ctx.save();ctx.translate(-cam,0);
api.line(5,24,780,24,'#afaa83',2);for(let i=0;i<23;i++)api.poly([[12+i*34,25],[35+i*34,25],[23+i*34,42]],['#c39b69','#83a99d','#b07e79'][i%3]);
for(let i=0;i<3;i++){api.round(628+i*62,56,51,102,5,'#7e9d90','#aec0a1');api.round(635+i*62,67,37,83,3,'#567f78');api.rect(639+i*62,72,29,9,'#c3cba9');label('WC',653+i*62,98,12,C.paper);api.rect(663+i*62,112,4,8,'#b6c2a7');api.line(635+i*62,144,672+i*62,144,'#aac1a8',1)}
// One continuous queue snakes around the unseen side of the partition.
for(let i=0;i<33;i++){const row=Math.floor(i/11),col=i%11;const px=320+(row%2?10-col:col)*28,py=194-row*43;person(px,py,.66,['#9b8d70','#799d91','#a18c89','#7895ab'][i%4],Math.sin(t)*.1)}
for(let i=0;i<6;i++){const px=99+i*31+(phase==='waiting'?Math.min(x-81,110):phase==='reveal'||phase==='done'?110:0);person(px,221,.8,['#849d93','#b49b78','#8d8698'][i%3])}
ctx.save();ctx.beginPath();ctx.rect(257,50,287-220*ease(reveal/2),174);ctx.clip();api.round(263,52,277,171,2,'#7b7865');for(let i=0;i<16;i++)api.line(266+i*18,55,266+i*18,222,'#9b9274',2);api.rect(257,50,287,8,'#b1a583');api.rect(264,214,275,9,'#595e50');api.round(291,73,192,36,3,'#d2c49a');label('TOILETS AROUND CORNER',387,94,10,'#4b6054');api.poly([[496,83],[520,83],[520,77],[534,91],[520,105],[520,99],[496,99]],'#d3c59a');ctx.restore();
person(x,240,1.02,C.blue,drag?t*4:0);if(phase==='join'){api.ellipse(81,240,17,5,'#b8c7a277');label('QUEUE ENDS HERE',97,258,8,C.paper)}
ctx.restore();if(phase==='reveal'||phase==='done'){panel(15,233,451,29);label('THE QUEUE CONTINUES. AND CONTINUES.',240,252,11,C.gold)}
},down(p){if((phase==='join'||phase==='waiting')&&hit(p,x-cam,209,65,95)){drag=true}},move(p){if(drag)goal=clamp(p.x+cam,35,574)},up(){if(phase==='join'&&drag&&x>61&&x<115){phase='waiting';x=81;goal=81;api.say('Shuffle forward to the corner.')}drag=false},cancel(){drag=false;goal=x},update(dt){t+=dt;if(drag){const speed=phase==='join'?150:38;x+=clamp(goal-x,-dt*speed,dt*speed);if(phase==='waiting'&&x>=257){phase='reveal';drag=false;reveal=0;api.say('Oh. The rest of the queue.')}}if(phase==='reveal'||phase==='done'){reveal+=dt;const u=ease(reveal/2);cam=315*u;x=257+300*u;if(reveal>2.7&&phase!=='done'){phase='done';api.done()}}},debug(){return{phase,x,cam,hiddenPeople:33,visibleContinuation:cam>300,drag}}};

}});})();
