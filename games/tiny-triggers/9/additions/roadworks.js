(function(){
"use strict";
TinyV9.register({"id":"roadworks","title":"Roadworks on Every Route","chapter":"road","description":"Follow the diversion. Then follow the next one.","hint":"Drag your car to the first barrier, up the signed alternative road, then across the second detour to the temporary lights.","verdict":"All roads lead to waiting.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='main',car={x:66,y:207},drag=false,start=null,t=0,arrival=0,closures=0;
const targets={main:{x:177,y:207},alternative:{x:230,y:82},detour:{x:388,y:207}};
function barrier(x,y){api.line(x-24,y+5,x-27,y+21,'#afaa8a',4);api.line(x+24,y+5,x+27,y+21,'#afaa8a',4);api.round(x-33,y-6,66,16,2,'#e3d9ae');ctx.save();ctx.beginPath();ctx.rect(x-33,y-6,66,16);ctx.clip();for(let i=-42;i<42;i+=18)api.poly([[x+i,y-6],[x+i+10,y-6],[x+i+23,y+10],[x+i+13,y+10]],'#c47a51');ctx.restore();api.ellipse(x,y-11,4,4,Math.sin(t*4)>0?'#f1cc73':'#947341')}
function cone(x,y){api.poly([[x-7,y],[x,y-20],[x+7,y]],'#c8804f');api.line(x-4,y-8,x+4,y-8,'#e7dcb1',3);api.rect(x-10,y,20,4,'#34413c')}
return{draw(){api.rect(0,0,480,270,'#394e44');
api.round(14,54,451,60,7,'#65716a');api.round(14,179,451,60,7,'#65716a');api.rect(41,54,60,185,'#65716a');api.rect(230,54,60,185,'#65716a');api.rect(388,54,60,185,'#65716a');
api.rect(17,60,446,48,'#38454b');api.rect(17,185,446,48,'#38454b');for(const xx of [47,236,394])api.rect(xx,60,48,172,'#38454b');for(let x=20;x<460;x+=34){api.rect(x,83,17,2,'#c3b98f');api.rect(x,208,17,2,'#c3b98f')}
for(const [x,y,w] of [[118,123,90],[307,123,64]]){api.round(x,y,w,43,3,'#7a7c68');api.rect(x+5,y-4,w-10,9,'#a18b70');for(let a=x+8;a<x+w-5;a+=17)api.rect(a,y+15,10,12,'#b3c5b0');api.ellipse(x+w/2,y+51,11,5,'#2c4237')}
label('TOWN CENTRE',237,26,13);label('FOLLOW DIVERSION',239,43,8,C.gold);
barrier(215,203);cone(195,229);cone(242,232);api.rect(182,174,65,14,'#b18850');label('CLOSED',215,185,8);
if(closures>=1){barrier(269,79);cone(284,105);api.rect(230,47,78,15,'#b18850');label('ALSO CLOSED',269,58,7)}
if(phase==='detour'||phase==='lights'){api.line(433,156,433,217,'#9daba0',4);api.round(423,127,20,47,4,'#22343a');for(let i=0;i<3;i++)api.ellipse(433,136+i*14,5,5,i===0?'#eb806f':'#46594f');api.rect(421,218,25,6,'#242c32');api.rect(411,187,4,43,'#d2ceb0');cone(452,216)}
const goal=targets[phase];if(goal){ctx.save();ctx.setLineDash([5,7]);ctx.strokeStyle='#92c1b2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(car.x,car.y);if(phase==='alternative'){ctx.lineTo(71,82);ctx.lineTo(goal.x,82)}else if(phase==='detour'){ctx.lineTo(259,207);ctx.lineTo(goal.x,207)}else ctx.lineTo(goal.x,goal.y);ctx.stroke();ctx.restore();api.ellipse(goal.x,goal.y,15,15,'#90c7b43a')}
ctx.save();ctx.translate(car.x,car.y);const vertical=drag&&Math.abs(car.y-start.y)>Math.abs(car.x-start.x);if(vertical)ctx.rotate(-Math.PI/2);api.ellipse(0,7,27,13,'#14272c77');api.round(-22,-12,44,24,7,'#b77d66');api.round(-9,-10,20,20,4,'#d7a386');api.rect(-10,-8,6,16,'#637f88');api.rect(8,-8,6,16,'#637f88');api.rect(-16,-15,10,4,'#1c2d34');api.rect(10,-15,9,4,'#1c2d34');api.rect(-16,11,10,4,'#1c2d34');api.rect(10,11,9,4,'#1c2d34');api.line(20,-8,20,-3,'#f5d699',3);api.line(20,3,20,8,'#f5d699',3);ctx.restore();
if(phase==='lights'){panel(144,241,198,24);label('TEMPORARY LIGHTS. PLEASE WAIT.',243,257,8,C.gold)}
},down(p){if(targets[phase]&&hit(p,car.x,car.y,65,57)){drag=true;start={...car}}},move(p){if(drag){car.x=clamp(p.x,45,416);car.y=clamp(p.y,80,210)}},up(){if(drag){const q=targets[phase];if(Math.hypot(car.x-q.x,car.y-q.y)<35){car={...q};if(phase==='main'){closures=1;phase='alternative';api.say('Road closed. Take the upper diversion.')}else if(phase==='alternative'){closures=2;phase='detour';api.say('That route is closed too. Try the lower detour.')}else{phase='lights';arrival=0;api.say('Red. Naturally.')}api.tone(220,.09,.018)}else car={...start}}drag=false},cancel(){if(drag)car={...start};drag=false},update(dt){t+=dt;if(phase==='lights'){arrival+=dt;if(arrival>1.4)api.done()}},debug(){return{phase,car:{...car},closures,redLight:phase==='lights'}}};

}});})();
