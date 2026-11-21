(function(){
"use strict";
TinyV9.register({"id":"disconnect","title":"The Sudden Disconnect","chapter":"games","description":"Keep moving. Everything seems perfectly normal.","hint":"Drag your explorer right across the platforms. Lift toward the gems to jump, and keep going.","verdict":"Connected, right up until you were not.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='playing',x=66,y=187,target={x:66,y:187},drag=false,world=0,t=0,timer=0,distance=0,coins=0;
return{draw(){api.rect(0,0,480,270,'#1b3047');for(let i=0;i<35;i++){const xx=(i*79+17)%480,yy=(i*37+13)%140;api.ellipse(xx,yy,1+(i%3===0?.5:0),1,'#c0d4b577')}api.ellipse(405,48,25,25,'#b4c8ac');api.ellipse(416,39,22,22,'#1b3047');for(let i=0;i<6;i++){api.rect(i*95-15,91+(i%3)*14,71,179,'#263c50');api.poly([[i*95-23,96+(i%3)*14],[i*95+20,51+(i%3)*14],[i*95+63,96+(i%3)*14]],'#304b5a')}
if(phase==='menu'){api.rect(0,0,480,270,'#193344cc');label('MOONKEEP',240,77,29,C.paper);label('EXPLORERS',240,101,14,C.gold);button('PLAY',240,157,145,'#5e7777');button('SETTINGS',240,201,145,'#405c65');label('Connection lost. Returned to menu.',240,245,10,C.red);return}
for(const [px,py,w]of [[20,203,110],[128,165,100],[248,141,100],[365,192,96]]){api.rect(px,py,w,10,'#83a38a');api.rect(px+3,py+10,w-6,34,'#56685e');for(let i=0;i<w-10;i+=13)api.rect(px+7+i,py+17+(i%2)*8,6,4,'#7c8570');api.line(px+2,py+1,px+w-2,py+1,'#c4d1a2',2)}
for(let i=0;i<3;i++){const gx=155+i*76,gy=126-(i%2)*25;if(x>gx-8&&coins>i)continue;ctx.save();ctx.translate(gx,gy+Math.sin(world*4+i)*4);api.poly([[0,-9],[7,0],[0,10],[-7,0]],'#c6bc77');api.poly([[0,-9],[0,10],[-7,0]],'#efe1a7');ctx.restore()}
api.rect(0,247,480,23,'#2c5062');for(let xx=0;xx<480;xx+=21)api.line(xx,250,xx+11,249+Math.sin(world*4+xx)*3,'#83b6b4',2);
person(x,y,.85,C.blue,drag?world*10:0);api.line(x+8,y-27,x+20,y-16,'#e4c58d',3);if(drag&&phase==='playing'){api.line(x-16,y-7,x-27,y-5,'#8fbda0',1);api.line(x-19,y-15,x-32,y-13,'#8fbda0',1)}
panel(13,13,119,28);label('GEMS '+coins+' / 3',72,31,10,C.gold);api.round(363,14,102,24,4,'#2a5056');label(phase==='playing'?'PING 24 ms':phase==='frozen'?'PING --':'OFFLINE',414,30,9,C.mint);
if(phase==='frozen'){label('...',240,222,16,C.paper)}if(phase==='lost'){api.rect(0,0,480,270,'#172a36aa');panel(110,89,260,83,'#3a414c');label('Connection lost',240,121,21,C.red);label('Returning to menu...',240,149,11,C.paper)}
},down(p){if(phase==='playing'&&hit(p,x,y-22,74,82)){drag=true;target={x,y}}},move(p){if(drag&&phase==='playing')target={x:clamp(p.x,35,430),y:clamp(p.y+22,98,204)}},up(){drag=false},cancel(){drag=false},update(dt){t+=dt;if(phase==='playing'){world+=dt;if(drag){const dx=clamp(target.x-x,-dt*90,dt*90);x+=dx;distance+=Math.abs(dx);y+=(target.y-y)*Math.min(1,dt*5);coins=x>226?2:x>149?1:0;if(distance>154){phase='frozen';timer=0;api.say('Everything stops mid-action.')}}}else if(phase==='frozen'){timer+=dt;if(timer>1.8){phase='lost';timer=0;api.tone(120,.25,.02)}}else if(phase==='lost'){timer+=dt;if(timer>1.4){phase='menu';timer=0;api.say('Connection lost. Back to the menu.')}}else if(phase==='menu'){timer+=dt;if(timer>.5)api.done()}},debug(){return{phase,x,y,world,distance,coins,drag,networkRequests:0}}};

}});})();
