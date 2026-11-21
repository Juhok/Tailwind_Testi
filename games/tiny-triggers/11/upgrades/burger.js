(() => {
'use strict';
TinyV6.register(5, {
id: "burger",
title: "Bottom goes on top",
description: "Lift the bottom bun directly onto the top of the burger.",
hint: "Lift the bottom bun onto the top in one move",
verdict: "All top. No bottom. Plenty of sauce.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,bx=240,by=209,tx=240,ty=209,settle=0,t=0;
function bun(x,y,bottom){ctx.save();ctx.translate(x,y);shadow(2,15,89,12);if(bottom){ctx.beginPath();ctx.moveTo(-87,-10);ctx.quadraticCurveTo(0,-26,87,-10);ctx.lineTo(80,12);ctx.quadraticCurveTo(0,27,-80,12);ctx.closePath();ctx.fillStyle=gradient(-80,-18,150,40,'#f0c17b','#aa5e2d');ctx.fill();curve([[-79,0],[-30,12],[32,12],[80,0]],'#f9d99c',3);specks(-70,-12,140,22,36,'#a7683c60');}else{ctx.beginPath();ctx.moveTo(-91,22);ctx.bezierCurveTo(-91,-63,88,-64,91,22);ctx.quadraticCurveTo(0,43,-91,22);ctx.fillStyle=gradient(0,-35,0,75,'#efc078','#aa552a');ctx.fill();curve([[-81,20],[-40,36],[40,36],[81,20]],'#e9ad62',4);for(let i=0;i<17;i++){let x=-65+i*8,y=-14+Math.sin(i*2)*13;ctx.save();ctx.translate(x,y);ctx.rotate(i*.7);ellipse(0,0,3.4,1.2,'#f6dfaa');ctx.restore();}}ctx.restore();}
function stack(){ctx.save();ctx.translate(0,settle*30);shadow(241,191,90,9);round(155,170,170,24,10,'#593323');specks(158,174,165,15,55,'#a46f4760');curve([[158,175],[190,165],[291,192],[322,175]],'#392c24',3);poly([[150,165],[332,165],[313,183],[289,175],[254,184],[226,173],[165,181]],'#f2b344');round(155,149,170,16,8,'#8b302e');round(158,147,164,10,5,'#ce5941');for(let i=0;i<8;i++)ellipse(169+i*20,151,3,1.3,'#f6be76');for(let i=0;i<8;i++){let x=155+i*23;ellipse(x,143+Math.sin(i)*4,18,7,i%2?'#83a854':'#5d873e');curve([[x-13,142],[x-3,137],[x+3,150],[x+13,142]],'#b4c672',1.4);}for(let i=0;i<3;i++){ellipse(192+i*43,132,21,8,'#405d36');ellipse(192+i*43,130,18,6,'#9cac57');for(let j=0;j<4;j++)ellipse(182+i*43+j*6,130,1,2,'#d3d38c');}curve([[155,127],[190,117],[290,140],[327,126]],'#f0d29b',5);curve([[290,128],[292,149],[306,158],[307,139]],'#f1b44f',5);bun(240,100,false);ctx.restore();}
return {draw(){wood();ellipse(240,227,142,25,'#718b94');ellipse(240,224,135,22,'#b0c2bd');ellipse(240,223,116,16,'#829c9d');if(drag||phase){ellipse(237,217,73,8,'#9c5c3466');for(let i=0;i<12;i++)ellipse(169+i*13,214+Math.sin(i)*4,2,1,'#d3a165');}stack();bun(bx,by,true);if(phase===2){curve([[184,86],[188,103],[199,104],[199,93]],'#f1d39e',3);text('No foundation. Extra roof.',240,254,10,'#ccd7cd');}},
 down(p){if(!phase&&near(p,bx,by,88)&&p.y>186){drag=true;tx=bx;ty=by;}},move(p){if(drag){tx=clamp(p.x,100,380);ty=clamp(p.y,42,230);}},up(){if(drag){drag=false;if(near({x:tx,y:ty},240,60,62)){phase=1;tx=240;ty=78;t=0;api.tone(260,.1,.025);}else{tx=240;ty=209;}}},cancel(){if(drag){drag=false;tx=240;ty=209;}},update(dt){bx+=(tx-bx)*Math.min(1,dt*20);by+=(ty-by)*Math.min(1,dt*20);let s=(drag||phase)&&by<183?1:0;settle+=(s-settle)*Math.min(1,dt*8);if(phase===1&&(t+=dt)>.7){phase=2;api.done();}},debug(){return {phase,bx,by,settle};}};

}
});
})();
