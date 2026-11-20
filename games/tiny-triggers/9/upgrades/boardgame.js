(() => {
'use strict';
TinyV6.register(80, {
id: "boardgame",
title: "One piece in the lid",
description: "Board game: pack everything away, but leave one piece caught under the lid.",
hint: "Put the first piece inside → Leave one on the rim → Close the lid over it",
verdict: "It almost stacks neatly.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,mode='',t=0,px=80,py=164,gx=105,gy=221,lx=284,ly=53,tx=lx,ty=ly,dx=0,dy=0,settle=0;
function pawn(x,y,color){shadow(x,y+10,14,4);ellipse(x,y+5,13,6,'#172d31');ellipse(x,y+3,12,6,color);poly([[x-10,y+1],[x-5,y-10],[x-5,y-18],[x+5,y-18],[x+5,y-10],[x+10,y+1]],color);ellipse(x,y-20,8,8,color);ellipse(x-2,y-22,3,4,'#ffffff55');curve([[x-7,y],[x-4,y-7],[x-3,y-10],[x-3,y-15]],'#ffffff36',1.5);}
function dice(x,y){round(x,y,22,22,3,'#e1d7b4');round(x+1,y+1,18,17,2,'#f0e7cb');for(const [a,b] of [[5,5],[15,5],[10,10],[5,15],[15,15]])ellipse(x+a,y+b,1.6,1.6,'#4d6463');}
function lid(){let a=phase>=3?-Math.sin(Math.min(1,settle)*Math.PI/2)*.065:0;ctx.save();ctx.translate(lx,ly);ctx.rotate(a);shadow(0,61,122,9);round(-121,-48,242,109,5,'#122730');round(-119,-51,238,105,5,gradient(-119,-51,238,105,'#527b85','#315560'));rect(-112,-44,224,4,'#8aa198');line(-112,-39,-112,45,'#8aa19866',1);line(110,-39,110,45,'#16363d',2);curve([[-99,26],[-47,-4],[-20,36],[21,14],[45,-14],[65,32],[99,4]],'#d3bc7d',3);for(let i=0;i<7;i++)ellipse(-97+i*31,20+Math.sin(i*1.6)*13,4,4,i%2?'#b9866a':'#98b0a2');text('ODDITY',0,-20,18,'#f0ddab');text('TRAILS',0,-2,12,'#f0ddab');ctx.restore();}
return {draw(){wood();shadow(280,237,128,13);round(162,104,242,126,5,'#162e34');poly([[164,111],[402,111],[402,221],[164,221]],'#506e6c');rect(169,110,228,103,'#c1b998');rect(177,118,212,87,'#465d59');rect(182,123,126,75,'#8eaa91');for(let y=0;y<4;y++)for(let x=0;x<7;x++)rect(186+x*17,127+y*16,14,13,(x+y)%2?'#c9c5a0':'#627e74');line(246,123,246,198,'#395850',2);rect(315,121,3,79,'#b5a985');dice(337,131);dice(351,166);pawn(329,189,'#be7f6e');rect(169,208,228,15,'#627e77');line(169,209,397,209,'#d4c9a3',2);rect(170,222,226,6,'#2b4b4e');
 if(phase<3||py<200)pawn(px,py,'#b97589');pawn(gx,gy,'#c9af68');lid();
 if(phase===4)text('One tiny piece. One permanent gap.',240,255,10,'#d7ded3');
 },
 down(p){if(phase===0&&hit(p,px,py-9,50,55)){mode='pink';dx=p.x-px;dy=p.y-py;}else if(phase===1&&hit(p,gx,gy-9,50,55)){mode='gold';dx=p.x-gx;dy=p.y-gy;}else if(phase===2&&hit(p,lx,ly,244,106)){mode='lid';dx=p.x-lx;dy=p.y-ly;}},
 move(p){if(mode==='pink'){px=clamp(p.x-dx,30,440);py=clamp(p.y-dy,40,237);}if(mode==='gold'){gx=clamp(p.x-dx,30,440);gy=clamp(p.y-dy,40,237);}if(mode==='lid'){tx=clamp(p.x-dx,140,340);ty=clamp(p.y-dy,40,172);}},
 up(){if(mode==='pink'){if(near({x:px,y:py},235,160,52)){phase=1;px=237;py=168;api.tone(340,.06,.012);}else {px=80;py=164;}}else if(mode==='gold'){if(near({x:gx,y:gy},382,212,28)){phase=2;gx=382;gy=216;api.tone(280,.06,.012);}else {gx=105;gy=221;api.say('One piece belongs on the rim.');}}else if(mode==='lid'){if(near({x:tx,y:ty},284,156,33)){phase=3;tx=284;ty=153;settle=0;api.tone(160,.09,.015);}else {tx=284;ty=53;}}mode='';},
 cancel(){if(mode==='pink'){px=80;py=164;}if(mode==='gold'){gx=105;gy=221;}if(mode==='lid'){tx=284;ty=53;}mode='';},
 update(dt){t+=dt;lx+=(tx-lx)*Math.min(1,dt*14);ly+=(ty-ly)*Math.min(1,dt*14);if(phase===3){settle=Math.min(1,settle+dt*1.5);if(settle===1){phase=4;api.done();}}},
 debug(){return {phase,inside:phase>0?1:0,trapped:phase>=2,lidGap:phase>=3?12:0};}
};

}
});
})();
