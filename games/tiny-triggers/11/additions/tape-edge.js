(function(){
"use strict";
TinyV9.register({"id":"tape-edge","title":"The Tape Edge Hunt","chapter":"objects","description":"Find the edge. Lift it carefully.","hint":"Drag across the tape roll to rotate it until the edge catches the light. Lift the small bright edge up and right.","verdict":"Congratulations on finding one seventh of the edge.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='hunt',drag=null,start=null,spin=0,distance=0,peel=0,t=0,settle=0;
const seam={x:279,y:108};
function ring(cx,cy,rx,ry,ix,iy,c){ctx.save();ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.ellipse(cx,cy,ix,iy,0,0,Math.PI*2,true);ctx.fill('evenodd');ctx.restore()}
return{draw(){room();api.rect(0,111,480,159,'#76664e');for(let y=120;y<270;y+=22)api.line(0,y,480,y,'#a18a5c33',1);api.ellipse(232,206,102,20,'#29372e77');
api.round(35,31,111,47,4,'#a29c7f');api.rect(45,42,83,4,'#c6bd91');api.rect(45,53,61,4,'#c6bd91');api.rect(45,65,73,3,'#7c7c62');api.line(385,129,414,225,'#9ba99b',4);api.ellipse(382,121,8,13,'#7c9d94');api.ellipse(382,121,5,9,'#324b48');api.ellipse(400,119,8,13,'#7c9d94');api.line(399,129,374,223,'#acb9a6',4);api.ellipse(390,154,3,3,'#d1cfaa');
ring(227,164,86,62,44,31,'#7c938376');for(let i=0;i<7;i++)ring(227,160+i*3,85,58,44,30,'#bcc9a521');api.ellipse(227,143,47,34,'#4e4e3c');api.ellipse(227,151,43,29,'#86795a');api.ellipse(227,147,41,26,'#6a624b');
const tape=ctx.createLinearGradient(147,90,314,184);tape.addColorStop(0,'#b0c8b5aa');tape.addColorStop(.3,'#e2e4bcbb');tape.addColorStop(.6,'#a2baa398');tape.addColorStop(1,'#d7ddafbb');ring(227,143,86,58,47,34,tape);for(let r=50;r<=84;r+=4){ctx.strokeStyle='#e1e8bb44';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(227,143,r,r*.676,0,0,Math.PI*2);ctx.stroke()}
ctx.save();ctx.translate(227,143);ctx.rotate(spin);for(let i=0;i<5;i++){const a=i*1.256;api.line(Math.cos(a)*52,Math.sin(a)*35,Math.cos(a)*82,Math.sin(a)*55,'#f1f0c146',1)}ctx.restore();
if(phase==='hunt'){const a=spin+1.2;api.line(227+Math.cos(a)*51,143+Math.sin(a)*35,227+Math.cos(a)*82,143+Math.sin(a)*56,'#f0efc590',1)}else{api.poly([[269,110],[280,103],[290,113],[279,121]],'#d8e3bb88');api.line(270,110,279,104,'#f6efc2',2);if(peel<.1)sparkle(281,101,6,C.gold)}
if(peel>.01){const ex=279+peel*87,ey=108-peel*63;ctx.fillStyle='#d8edcf80';ctx.strokeStyle='#edf0c3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(276,109);ctx.bezierCurveTo(284,84,ex-31,ey+25,ex,ey);ctx.lineTo(ex+7,ey+6);ctx.bezierCurveTo(ex-26,ey+34,290,93,282,114);ctx.closePath();ctx.fill();ctx.stroke();api.line(ex-2,ey-3,ex+6,ey+4,'#efefd1',3);api.ellipse(ex+7,ey+2,10,7,'#d1aa88');api.ellipse(ex+2,ey-4,8,6,'#dcb894');api.line(ex+13,ey+3,ex+36,ey+17,'#d1aa88',13)}
if(phase==='done'){label('JUST A NARROW STRIP.',241,241,12,C.gold);label('THE REST IS STILL STUCK.',241,257,9,C.paper)}else label(phase==='hunt'?'ROTATE TO FIND THE EDGE':'LIFT THE BRIGHT CORNER',240,250,10,C.gold);
},down(p){const d=Math.hypot((p.x-227)/1.35,p.y-143);if(phase==='hunt'&&d<68&&d>24){drag='spin';start={...p};distance=0}else if(phase==='edge'&&hit(p,279,108,51,44)){drag='peel';start={...p}}},move(p){if(drag==='spin'){const dx=p.x-start.x;spin=dx/36;distance=Math.abs(dx)}if(drag==='peel')peel=clamp((p.x-start.x-(p.y-start.y)) /140,0,1)},up(){if(drag==='spin'&&distance>70){phase='edge';spin=0;api.say('There it is. Lift the edge gently.')}if(drag==='peel'){if(peel>.86){peel=1;phase='settling';settle=0;api.tone(530,.09,.018)}else peel=0}drag=null},cancel(){if(drag==='peel')peel=0;drag=null},update(dt){t+=dt;if(phase==='settling'){settle+=dt;if(settle>.8){phase='done';api.done()}}},debug(){return{phase,spin,peel,stripWidth:peel>0?7:0,rollWidth:49,restStuck:true,drag}}};

}});})();
