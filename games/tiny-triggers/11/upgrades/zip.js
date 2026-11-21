(() => {
'use strict';
TinyV6.register(41, {
id: "zip",
title: "Fabric snack",
description: "Zipper: zip it up while catching a small piece of fabric in it.",
hint: "Zip up into the loose fabric",
verdict: "The zipper has eaten.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,y=218,target=218,sy=0,base=0,t=0,jam=0;
function jacket(){poly([[179,42],[219,30],[261,30],[303,43],[349,89],[341,213],[306,213],[305,121],[312,247],[169,247],[176,121],[172,213],[137,213],[129,90]],'#172d39');poly([[177,40],[219,31],[237,65],[237,244],[171,244],[177,113],[172,209],[137,209],[129,90]],gradient(145,45,90,200,'#5c7c85','#2b4e60'));poly([[243,65],[263,31],[305,43],[347,91],[340,209],[306,209],[305,113],[310,244],[243,244]],gradient(245,40,98,200,'#75929a','#3f626f'));poly([[219,31],[239,53],[263,31],[254,77],[238,91],[226,71]],'#a6b7ad');line(139,199,170,199,'#a9beb055',2);line(308,199,339,199,'#a9beb055',2);line(179,48,167,110,'#99b4ac66',2);line(301,50,313,111,'#bad0bd55',2);curve([[182,116],[190,145],[182,181],[187,237]],'#a3b8a42b',2);curve([[299,116],[286,151],[304,182],[291,236]],'#143b4855',2);line(185,174,216,185,'#1b3946',5);line(265,185,296,174,'#1b3946',5);line(185,171,216,182,'#94afa388',1);line(265,182,296,171,'#b2c6b688',1);for(let z=229;z<244;z+=4)line(172,z,309,z,'#a4b7a638',1);}
return {draw(){rect(0,0,480,270,'#2d424b');for(let n=0;n<28;n++)line(n*19,0,n*19-70,270,'#7c91870e',1);shadow(242,249,117,11);jacket();let spread=clamp((218-y)/115,0,1);for(let z=76;z<235;z+=7){let closed=z>y;let gap=closed?1:4+(y-z)*.09;rect(236-gap,z,5,4,closed?'#b9c3af':'#94a9a1');rect(242+gap,z+2,5,4,closed?'#8a9d96':'#bac5b4');}let tipX=mix(267,241,jam),tipY=mix(99,111,jam);ctx.beginPath();ctx.moveTo(270,82);ctx.bezierCurveTo(253,84,260,102,tipX,tipY);ctx.bezierCurveTo(256,123,279,100,282,90);ctx.closePath();ctx.fillStyle='#d7ba9f';ctx.fill();curve([[274,87],[257,97],[263,102],[tipX,tipY]],'#8d6d68',1.5);if(jam){for(let i=0;i<4;i++)curve([[244,113+i*3],[256,107+i*7],[267,100+i*6],[275,98+i*4]],'#a57f74',1);}
 round(230,y-11,22,26,4,gradient(230,y,22,10,'#d0d5bd','#7e9690'));round(235,y+2,12,29,5,'#d5cdb0');round(238,y+9,6,14,2,'#45626a');line(232,y-7,248,y-7,'#f2ecd2',2);if(phase===2)text('A tiny bite of lining.',240,264,10,'#d1d3bd');},down(p){if(!phase&&hit(p,241,y+8,56,60)){drag=true;sy=p.y;base=target;}},move(p){if(drag)target=clamp(base+p.y-sy,110,224);},up(){if(drag){drag=false;if(target<=113){phase=1;t=0;target=111;api.tone(160,.08,.025);}}},cancel(){if(drag){drag=false;target=218;}},update(dt){y+=(target-y)*Math.min(1,dt*18);jam+=(clamp((150-y)/39,0,1)-jam)*Math.min(1,dt*10);if(phase===1&&(t+=dt)>.8){phase=2;api.done();}},debug(){return {phase,slider:y,jam};}};

}
});
})();
