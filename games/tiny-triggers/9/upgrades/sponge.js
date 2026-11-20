(() => {
'use strict';
TinyV6.register(65, {
id: "sponge",
title: "Let it soak",
description: "Scrub the plate, then leave the sponge floating in dirty water.",
hint: "Rub the sponge back and forth on the dirty plate, then drop it into the sink.",
verdict: "Freshly cleaned. Immediately reconsidered.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,x=89,y=164,tx=89,ty=164,ox=0,oy=0,clean=0,t=0,soak=0;
return {draw(){rect(0,0,480,270,'#3b5660');for(let x=0;x<480;x+=60)line(x,0,x,112,'#8fa59a33',1);for(let y=0;y<113;y+=40)line(0,y,480,y,'#8fa59a33',1);rect(0,112,480,158,'#8c9f96');round(124,121,230,132,24,'#d3d8bf');round(132,129,214,115,20,'#526e74');round(143,145,192,88,19,'#65796c');round(146,149,186,80,17,'#7f8b6d');for(let i=0;i<13;i++){let px=157+i*13,py=164+(i*19%51);ellipse(px,py,3+i%4,2,'#a8ad8188');}for(let i=0;i<8;i++){let px=164+i*19,py=172+(i*17%43);curve([[px,py],[px+3,py-4],[px+9,py+5],[px+13,py]],'#505e4f88',2);}for(let n=0;n<12;n++)ellipse(153+(n*23%169),155+(n*37%66),3+n%4,2+n%3,'#c4c9a355');
 curve([[176,123],[175,53],[228,48],[229,98]],'#355864',16);curve([[176,121],[175,55],[228,50],[229,95]],'#bacabd',10);rect(218,93,23,9,'#93aea8');ellipse(229,104,8,3,'#44666c');round(148,98,24,9,3,'#b7c8b6');line(158,98,158,86,'#d6dbc2',5);
 shadow(385,133,57,10);ellipse(381,86,54,49,'#b7c7b9');ellipse(381,83,48,43,'#e2dfbf');ellipse(381,83,37,33,'#c6d0b5');for(let i=0;i<8;i++){ctx.globalAlpha=1-clean;ellipse(359+(i*17%44),65+(i*23%39),5+i%5,3+i%4,'#946a49');}ctx.globalAlpha=1;
 if(phase>=2){for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x,ty+11,46+i*9,13+i*4,0,0,Math.PI*2);ctx.strokeStyle='#c8d2aa'+(i===0?'66':'33');ctx.lineWidth=1;ctx.stroke();}}
 ctx.save();ctx.translate(x,y);ctx.rotate(phase>=2?Math.sin(t*2)*.035:drag?-.09:0);shadow(1,21,43,6);round(-42,-21,84,43,9,gradient(-42,-21,84,43,'#e5c875','#c79e4f'));round(-41,-25,82,12,6,gradient(-41,-25,80,12,'#597c64','#315845'));specks(-37,-10,74,25,47,'#88683577');line(-32,-8,31,-8,'#ffdf9380',2);if(soak>0){ctx.globalAlpha=soak*.48;round(-41,5,82,14,5,'#657453');ctx.globalAlpha=1;}ctx.restore();if(phase===3)text('Clean plate. Questionable sponge.',240,265,9,'#334f56');},
 down(p){if(phase<2&&hit(p,x,y,101,64)){drag=true;ox=p.x-x;oy=p.y-y;}},move(p){if(drag){let nx=clamp(p.x-ox,45,435),ny=clamp(p.y-oy,40,228);if(phase===0&&near({x:tx,y:ty},381,83,53)&&near({x:nx,y:ny},381,83,53)){clean=Math.min(1,clean+Math.hypot(nx-tx,ny-ty)/130);if(clean===1){phase=1;api.say('Clean plate. Where will the sponge go?');}}tx=nx;ty=ny;}},up(){if(drag){drag=false;if(phase===1&&near({x:tx,y:ty},240,185,55)){phase=2;tx=240;ty=185;t=0;api.tone(270,.1,.02);}}},cancel(){drag=false;},update(dt){t+=dt;x+=(tx-x)*Math.min(1,dt*20);y+=((phase>=2?ty+Math.sin(t*3)*2:ty)-y)*Math.min(1,dt*20);if(phase>=2)soak=Math.min(1,soak+dt);if(phase===2&&t>1.2){phase=3;api.done();}},debug(){return {phase,clean,soak};}};

}
});
})();
