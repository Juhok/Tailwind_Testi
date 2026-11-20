(() => {
'use strict';
TinyV6.register(20, {
id: "socks",
title: "Pairing is subjective",
description: "Socks: deliberately match the wrong pairs.",
hint: "Choose a sock → Find its wrong partner",
verdict: "Close enough. From different feet.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

const socks=[{x:120,y:77,k:0},{x:350,y:77,k:1},{x:120,y:180,k:1},{x:350,y:180,k:0}];let phase=0,drag=-1,ox=0,oy=0,t=0;const paired=[false,false];
function sock(c,i){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(drag===i?-.09:0);shadow(6,48,33,8);ctx.beginPath();ctx.moveTo(-22,-37);ctx.lineTo(14,-37);ctx.lineTo(14,17);ctx.bezierCurveTo(16,22,43,23,43,36);ctx.bezierCurveTo(43,54,16,55,-11,42);ctx.quadraticCurveTo(-26,35,-22,18);ctx.closePath();ctx.save();ctx.clip();ctx.fillStyle=c.k?gradient(-20,-20,60,80,'#dc986d','#9a5958'):gradient(-20,-20,60,80,'#89b7ba','#416e89');ctx.fill();if(c.k){for(let y=-30;y<50;y+=13)rect(-25,y,80,5,'#ebcc9655');}else{for(let y=-27;y<44;y+=18)for(let x=-15;x<42;x+=17){poly([[x,y-4],[x+4,y],[x,y+4],[x-4,y]],'#c7d4b77a');}}rect(-26,-40,45,13,c.k?'#e3be89':'#a9c6bc');poly([[-25,18],[-7,18],[0,37],[-15,42]],c.k?'#a86953':'#355a76');ellipse(38,40,15,16,c.k?'#ebc891':'#a4c2bc');for(let x=-19;x<14;x+=5)line(x,-36,x,-28,c.k?'#a07158':'#638f99',1);curve([[-18,-20],[-22,5],[-20,23],[-8,28]],'#ffffff25',2);ctx.restore();ctx.restore();}
return {draw(){rect(0,0,480,270,'#30424a');for(let y=0;y<270;y+=7)line(0,y,480,y,'#78908410');for(let x=0;x<480;x+=9)line(x,0,x,270,'#899b8e0e');round(44,26,163,126,9,'#243640');round(274,26,163,126,9,'#243640');line(56,144,195,144,'#bdbe9a55',2);line(286,144,425,144,'#bdbe9a55',2);for(let i=0;i<4;i++)if(i!==drag)sock(socks[i],i);if(drag>=0)sock(socks[drag],drag);for(let j=0;j<2;j++)if(paired[j]){let x=j?350:120;round(x-41,54,90,9,2,'#d5caa1');for(let n=0;n<4;n++)line(x-35+n*4,55,x-35+n*4,61,'#8d896d',1);}if(phase===3)text('Two pairs. Four opinions.',240,243,11,'#d0d3b8');},
 down(p){if(phase>=2)return;drag=socks.findIndex((c,i)=>i>=2&&!paired[i-2]&&hit(p,c.x+5,c.y+7,79,98));if(drag>=0){ox=p.x-socks[drag].x;oy=p.y-socks[drag].y;}},move(p){if(drag>=0){socks[drag].x=p.x-ox;socks[drag].y=p.y-oy;}},up(){if(drag<0)return;let n=drag-2,c=socks[drag],dest=socks[n];if(near(c,dest.x,dest.y,50)&&c.k!==dest.k){paired[n]=true;c.x=dest.x+26;c.y=dest.y+4;dest.x-=20;api.tone(410+n*90,.08,.02);phase=paired.filter(Boolean).length;if(phase===2)t=0;}else{c.x=n?350:120;c.y=180;}drag=-1;},cancel(){if(drag>=0){socks[drag].x=drag===2?120:350;socks[drag].y=180;}drag=-1;},update(dt){if(phase===2&&(t+=dt)>.45){phase=3;api.done();}},debug(){return {phase,paired:paired.filter(Boolean).length};}};

}
});
})();
