(function(){
"use strict";
TinyV9.register({"id":"stolen-firewood","title":"Someone Got There First","chapter":"games","description":"Reach the last log and hold to collect it.","hint":"Drag your adventurer along the path to the log. Hold on the firewood until the collection ring almost fills.","verdict":"You gathered a valuable experience.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='approach',x=74,t=0,drag=false,hold=false,progress=0,rival=441,steal=0,wood=true;
function log(px,py){ctx.save();ctx.translate(px,py);ctx.rotate(-.18);api.round(-30,-12,60,24,8,'#765238');api.line(-23,-7,24,-7,'#a3794d',3);api.line(-21,4,22,4,'#4b3b2c',2);api.ellipse(29,0,11,12,'#c29c66');api.ellipse(29,0,7,8,'#9c7648');api.ellipse(29,0,4,5,'#cdb17b');api.line(-9,-11,-3,-22,'#79553c',7);ctx.restore()}
return{draw(){api.rect(0,0,480,270,'#263c43');api.rect(0,149,480,121,'#415a42');for(let i=0;i<9;i++){const xx=i*63-10;api.rect(xx+12,70,13,99,'#554f39');api.poly([[xx-17,105],[xx+18,17],[xx+51,105]],'#284a3f');api.poly([[xx-25,143],[xx+18,59],[xx+60,143]],'#315748')}
api.poly([[0,218],[102,185],[263,178],[480,207],[480,259],[277,218],[102,226],[0,260]],'#837b5a');for(let i=0;i<30;i++)api.ellipse((i*83)%480,190+(i*17)%61,2+(i%3),1,'#a29668');
for(const xx of [135,177,227]){api.ellipse(xx,176,18,7,'#273f35');api.ellipse(xx,172,12,5,'#8d7850');api.line(xx-5,170,xx+3,172,'#bf9c67',1)}
panel(17,14,170,40);label('FIREWOOD FOR CAMP',102,31,9);label('9 / 10',102,47,13,C.gold);
api.line(300,141,300,164,'#dfc482',2);api.poly([[293,140],[307,140],[300,148]],C.gold);
person(x,222,1.18,C.blue,drag?t*10:0);
if(wood)log(307,184);
if(phase==='collect'||phase==='snatched'){api.round(238,113,136,11,4,'#1e3435');api.rect(241,116,130*progress,5,'#8ec7a8');label(phase==='snatched'?'RESOURCE UNAVAILABLE':'COLLECTING '+Math.round(progress*100)+'%',306,106,9,phase==='snatched'?C.red:C.paper)}
person(rival,204,1.1,'#bf8c70',t*10);if(!wood)log(rival+5,167);
if(phase==='snatched'&&steal>.5){label('+1 FIREWOOD',Math.min(410,rival),139,10,C.gold);label('9 / 10',x,151,13,C.red)}
},down(p){if(phase==='approach'&&hit(p,x,192,65,92))drag=true;else if(phase==='collect'&&hit(p,307,182,98,74))hold=true;},move(p){if(drag)x=clamp(p.x,64,267)},up(){if(drag&&x>246){x=267;phase='collect';api.say('The last log. Hold to collect.')}drag=false;hold=false},cancel(){drag=false;hold=false},update(dt){t+=dt;if(phase==='collect'){if(hold)progress=Math.min(.97,progress+dt*.31);else progress=Math.max(0,progress-dt*.22);if(progress>.68){rival=Math.max(319,rival-dt*142)}if(progress>=.965){phase='snatched';wood=false;steal=0;hold=false;api.tone(420,.12,.025);api.say('Another player collected it first.')}}if(phase==='snatched'){steal+=dt;rival=Math.min(428,rival+dt*48);if(steal>1.6)api.done()}},debug(){return{phase,x,progress,wood,rival,quest:9,held:hold}}};

}});})();
