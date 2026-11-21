(() => {
'use strict';
TinyV6.register(71, {
id: "candle",
title: "A wax tunnel",
description: "Candle: extinguish it just as a deep hollow forms in the middle.",
hint: "Wait for the central wax tunnel → Snuff the flame",
verdict: "A candle with a very narrow ambition.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,x=389,y=115,tx=389,ty=115,t=0,tunnel=0,smoke=0,ox=0,oy=0;
function flame(px,py){let sway=Math.sin(t*9)*3;ellipse(px,py-13,32,37,'#f2bd5c0b');ellipse(px,py-13,22,28,'#f2bd5c12');ctx.beginPath();ctx.moveTo(px,py);ctx.bezierCurveTo(px-18,py-14,px+4+sway,py-25,px+1+sway,py-42);ctx.bezierCurveTo(px+19,py-20,px+15,py-7,px,py);ctx.fillStyle='#e6a655';ctx.fill();ctx.beginPath();ctx.moveTo(px,py-2);ctx.bezierCurveTo(px-7,py-9,px+1,py-16,px+3,py-26);ctx.bezierCurveTo(px+11,py-11,px+6,py-3,px,py-2);ctx.fillStyle='#f6e5a6';ctx.fill();}
return {draw(){rect(0,0,480,270,'#273b45');for(let x=0;x<480;x+=68)rect(x,0,1,223,'#82978b17');rect(0,223,480,47,'#354b54');shadow(241,236,96,11);ellipse(240,231,77,11,'#647c7b');ellipse(240,228,73,10,'#c0bca0');round(185,115,110,112,6,gradient(185,115,110,111,'#d7bc8c','#a7825f'));ellipse(240,225,55,9,'#ae8d68');line(194,125,194,212,'#f2dfae44',3);ellipse(240,116,55,17,'#ead3a1');ellipse(240,115,46,12,'#c2a474');ellipse(240,116,32,10,'#e1c48c');let deep=tunnel*24;ellipse(240,116,22,8,'#6f6047');ctx.save();ctx.beginPath();ctx.ellipse(240,116,22,8,0,0,Math.PI*2);ctx.rect(218,116,44,deep);ctx.clip();rect(217,116,46,deep+7,gradient(218,115,0,deep+5,'#8a704e','#bc9c65'));ctx.restore();ellipse(240,116+deep,20,6,phase?'#9d895f':'#dbbd74');curve([[230,115+deep],[234,111+deep],[248,113+deep],[252,115+deep]],'#f3db9a66',1);line(239,116+deep,240,105+deep,'#443c31',2);
 if(!phase)flame(240,106+deep);else{let life=clamp(smoke/1.8,0,1);ctx.globalAlpha=(1-life)*.55;curve([[240,108+deep],[220+Math.sin(t*3)*8,87+deep],[264,66+deep],[239,39+deep-life*35]],'#b9c1ae',3);ctx.globalAlpha=1;}
 ctx.save();ctx.translate(x,y);line(9,-3,54,51,'#b29560',6);line(12,-4,55,49,'#e7cf92',2);ctx.beginPath();ctx.moveTo(-15,16);ctx.lineTo(-10,-9);ctx.quadraticCurveTo(0,-20,10,-9);ctx.lineTo(15,16);ctx.closePath();ctx.fillStyle=gradient(-15,-15,30,30,'#e2c88d','#92774e');ctx.fill();ellipse(0,16,15,4,'#615b45');curve([[-11,-5],[-10,1],[-11,6],[-12,11]],'#f0d9a4',2);ctx.restore();if(phase===2)text('A tunnel, not a melt pool.',240,260,10,'#d1d2b9');},
 down(p){if(!phase&&hit(p,x+12,y+12,86,90)){drag=true;ox=p.x-x;oy=p.y-y;}},move(p){if(drag){tx=clamp(p.x-ox,55,411);ty=clamp(p.y-oy,55,195);}},up(){if(drag){drag=false;if(tunnel>=.98&&near({x:tx,y:ty},240,109,35)){phase=1;tx=326;ty=165;smoke=0;api.tone(190,.08,.015);}else{tx=389;ty=115;if(tunnel<.98)api.say('Let the middle melt a little longer.');}}},cancel(){if(drag){drag=false;tx=389;ty=115;}},update(dt){t+=dt;x+=(tx-x)*Math.min(1,dt*12);y+=(ty-y)*Math.min(1,dt*12);if(!phase)tunnel=Math.min(1,tunnel+dt*.28);else smoke+=dt;if(phase===1&&smoke>1.7){phase=2;api.done();}},debug(){return {guide:{snuffer:[x,y]},phase,tunnel,lit:phase===0};}};

}
});
})();
