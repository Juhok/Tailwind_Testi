(() => {
'use strict';
TinyV6.register(62, {
id: "shakers",
title: "Labels are suggestions",
description: "Salt and pepper: fill the shakers with the opposite contents from their labels.",
hint: "Pepper into S → Salt into P",
verdict: "Seasoning is now a guessing game.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

const bags=[{x:72,y:88,home:72,fill:0,tilt:0,dwell:0},{x:408,y:88,home:408,fill:0,tilt:0,dwell:0}];let phase=0,drag=-1,ox=0,oy=0,t=0,finishT=0;
function shaker(x,label,n){shadow(x,232,43,8);round(x-33,143,66,82,12,'#bed0c432');round(x-26,119,52,35,8,'#bed0c432');let h=bags[n].fill*67;ctx.save();ctx.beginPath();ctx.roundRect(x-28,145,56,75,8);ctx.clip();rect(x-30,220-h,60,h,n?'#dedfc2':'#6b5143');specks(x-27,220-h,54,h,60,n?'#ffffff88':'#b3966b77');ellipse(x,220-h,27,3,n?'#edf0cf':'#8a6b4c');ctx.restore();curve([[x-29,149],[x-28,173],[x-28,197],[x-25,213]],'#e4ead48c',3);curve([[x+29,148],[x+29,170],[x+29,197],[x+24,216]],'#9ebbb766',2);ellipse(x,122,25,6,'#9eb6ac');ellipse(x,122,20,3,'#2b4650');round(x-18,168,36,34,5,'#e2d8b4');text(label,x,194,25,'#4a6668');}
function bag(b,i){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.tilt);shadow(0,46,28,5);poly([[-28,-41],[26,-41],[31,42],[-32,42]],i?'#ccd4bb':'#a58a63');poly([[-28,-41],[26,-41],[22,-29],[-25,-29]],i?'#e6e5ca':'#c0a87d');rect(-20,-14,40,38,i?'#e9e5c9':'#d4c298');text(i?'SALT':'PEPPER',0,1,i?11:8,'#4d615b');specks(-15,8,30,12,17,i?'#fffef0':'#554432');line(-23,34,24,34,i?'#9da992':'#7c6a49',2);ctx.restore();}
return {draw(){wood();round(131,111,218,132,15,'#58747a');round(137,116,206,120,12,'#75918b');shaker(185,'S',0);shaker(297,'P',1);for(let i=0;i<2;i++){let b=bags[i],targetX=i?278:166;let pouring=drag===i&&Math.hypot(b.x-targetX,b.y-67)<36&&b.fill<1&&b.dwell>.25;if(pouring){for(let n=0;n<18;n++){let q=(t*2.4+n/18)%1,x=mix(b.x+22,i?297:185,q)+Math.sin(n*7)*3;ellipse(x,mix(b.y+30,123,q),i?1:1.4,1.5,i?'#f1ecd1':'#b79764');}}bag(b,i);}for(let x of [83,405]){ellipse(x,218,26,8,'#8ba5a1');ellipse(x,214,25,7,'#d2d7bd');for(let n=0;n<7;n++)ellipse(x-12+n*4,214+Math.sin(n)*2,1,1,'#5d7b7d');}if(phase===2)text('Trust the letters. What could go wrong?',240,263,9,'#d4d3b9');},
 down(p){if(phase)return;drag=bags.findIndex(b=>b.fill<1&&hit(p,b.x,b.y,76,105));if(drag>=0){ox=p.x-bags[drag].x;oy=p.y-bags[drag].y;}},move(p){if(drag>=0){let b=bags[drag],nx=p.x-ox,ny=p.y-oy;if(Math.hypot(nx-b.x,ny-b.y)>2)b.dwell=0;b.x=nx;b.y=ny;}},up(){if(drag>=0){let b=bags[drag];b.x=b.home;b.y=88;drag=-1;if(bags.every(b=>b.fill===1)){phase=1;finishT=0;}}},cancel(){if(drag>=0){bags[drag].x=bags[drag].home;bags[drag].y=88;}drag=-1;},update(dt){t+=dt;bags.forEach((b,i)=>{let over=drag===i&&near(b,i?278:166,67,36)&&b.fill<1;b.dwell=over?b.dwell+dt:0;let pouring=over&&b.dwell>.25;b.tilt+=((pouring?.55:0)-b.tilt)*Math.min(1,dt*10);if(pouring)b.fill=Math.min(1,b.fill+dt*.8);});if(phase===1&&(finishT+=dt)>.6){phase=2;api.done();}},debug(){return {guide:{bags:bags.map((b,i)=>({from:[b.x,b.y],fill:b.fill,to:[i?278:166,67]}))},phase,pepperInS:bags[0].fill,saltInP:bags[1].fill};}};

}
});
})();
