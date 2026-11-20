(() => {
'use strict';
TinyV6.register(29, {
id: "icecream",
title: "Living on the edge",
description: "Ice cream: press the scoop crookedly onto the edge of the cone.",
hint: "Press the scoop onto the rim",
verdict: "Structurally questionable. Delicious.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,x=116,y=125,tx=116,ty=125,squash=0,t=0,ox=0,oy=0;
function cone(){ctx.save();ctx.translate(289,237);ctx.rotate(squash*.045);ctx.translate(-289,-237);ctx.beginPath();ctx.moveTo(246,139);ctx.lineTo(332,139);ctx.lineTo(289,239);ctx.closePath();ctx.fillStyle=gradient(246,139,90,100,'#dbaf66','#997040');ctx.fill();ctx.save();ctx.clip();for(let i=-110;i<120;i+=15){line(246+i,136,346+i,242,'#75573377',2);line(232+i,242,332+i,136,'#f2cc8266',2);}ctx.restore();ellipse(289,139,43,12,'#e2bd7b');ellipse(289,138,36,8,'#725c43');curve([[253,141],[273,151],[308,151],[325,142]],'#f5d492',3);ctx.restore();}
function scoop(){ctx.save();ctx.translate(x,y);ctx.rotate(squash*.13);ctx.scale(1+squash*.09,1-squash*.12);shadow(2,44,47,7);ellipse(0,0,45,43,gradient(-35,-32,60,76,'#ecc0b4','#b66d82'));for(let i=0;i<7;i++)ellipse(-35+i*12,29+Math.sin(i)*4,12,11,i%2?'#d49ba1':'#e0afb0');ctx.save();ctx.beginPath();ctx.ellipse(0,0,43,41,0,0,Math.PI*2);ctx.clip();specks(-45,-40,90,80,75,'#89495744');for(let n=0;n<5;n++)curve([[-37,-17+n*12],[-18,-39+n*11],[22,-13+n*11],[37,-26+n*13]],n%2?'#f5d6c1aa':'#ae69776b',2);ctx.restore();ellipse(-17,-21,16,7,'#f7d7c14d');ctx.restore();}
return {draw(){rect(0,0,480,270,'#2d424d');for(let x=0;x<480;x+=48){rect(x,0,24,176,'#42606a22');}rect(0,176,480,94,'#3c535a');ellipse(289,243,84,10,'#172f3a80');cone();round(55,169,128,35,6,'#b2bab0');ellipse(119,170,65,15,'#d1d2bc');ellipse(119,168,54,10,'#829d9c');scoop();if(squash>0){let len=squash*30;curve([[x+31,y+29],[x+38,y+45],[x+27,y+48],[x+31,y+36+len]],'#c58a98',5);ellipse(x+31,y+38+len,4,5,'#e3b3b1');}if(phase===2)text('A brave structural decision.',240,260,10,'#d0d0b7');},down(p){if(!phase&&near(p,x,y,53)){drag=true;ox=p.x-x;oy=p.y-y;}},move(p){if(drag){tx=clamp(p.x-ox,48,431);ty=clamp(p.y-oy,50,193);}},up(){if(drag){drag=false;if(tx>316&&tx<350&&ty>85&&ty<140){phase=1;tx=328;ty=113;t=0;api.tone(250,.1,.02);}else{tx=116;ty=125;}}},cancel(){if(drag){drag=false;tx=116;ty=125;}},update(dt){x+=(tx-x)*Math.min(1,dt*20);y+=(ty-y)*Math.min(1,dt*20);if(phase){squash+=(1-squash)*Math.min(1,dt*4);}if(phase===1&&(t+=dt)>1){phase=2;api.done();}},debug(){return {phase,x,y,squash};}};

}
});
})();
