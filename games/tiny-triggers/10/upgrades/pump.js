(() => {
'use strict';
TinyV6.register(35, {
id: "pump",
title: "Wall care routine",
description: "Pump bottle: turn the nozzle to point straight at the wall.",
hint: "Turn the nozzle toward the wall",
verdict: "Moisturised plaster. Excellent.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,a=Math.PI,target=Math.PI,t=0;
return {draw(){rect(0,0,480,270,'#35505b');for(let x=0;x<361;x+=72)line(x,0,x,229,'#81978c33',2);for(let y=0;y<231;y+=57)line(0,y,360,y,'#81978c33',2);poly([[361,0],[480,0],[480,243],[361,225]],'#4a6a70');for(let y=0;y<230;y+=57)line(361,y,480,y+18,'#91a29455',2);line(361,0,361,226,'#a9b4a05c',3);rect(0,226,480,44,'#829b96');ellipse(106,260,116,27,'#c2cbb6');ellipse(106,261,93,18,'#3f626d');shadow(251,223,60,10);
 round(200,105,101,117,19,gradient(200,105,102,110,'#c3d2b6','#6b988f'));round(208,129,85,84,13,'#a1b79a');line(213,119,213,191,'#e5ead08c',6);round(217,143,69,52,6,'#e8dfbb');text('HAND',251,160,11,'#426968');text('LOTION',251,178,12,'#426968');curve([[235,186],[241,179],[261,198],[269,185]],'#8aab87',2);round(221,98,60,15,5,'#789b93');for(let x=226;x<279;x+=6)line(x,100,x,111,'#c6cfb4',1);
 let press=phase?Math.sin(clamp(t/.6,0,1)*Math.PI)*7:0;
 rect(242,77+press,18,23-press,'#dce1c6');let ex=250+Math.cos(a)*66,ey=76+Math.sin(a)*18+press;curve([[250,81+press],[250+Math.cos(a)*24,70+press],[ex,ey-10],[ex,ey+1]],'#243e4a',17);curve([[250,77+press],[250+Math.cos(a)*24,66+press],[ex,ey-14],[ex,ey-3]],'#ced8bd',12);line(244,72+press,259,72+press,'#f2edd5',2);ellipse(ex,ey+1,5,2,'#3d5a5d');
 if(phase){let f=clamp((t-.18)/.7,0,1);if(f>0&&f<1)for(let i=0;i<5;i++){let q=clamp(f-i*.07,0,1);ellipse(mix(316,360,q),mix(80,113,q)+Math.sin(q*Math.PI)*-12,2.2,2.8,'#f0e8cb');}if(t>.7){ellipse(362,113,3,15,'#dddac1');for(let i=0;i<6;i++)ellipse(364+(i%2)*5,99+i*5,2+i%2,3,'#e8e2c4');curve([[364,122],[365,132],[367,135],[367,143]],'#e8e2c4',3);}}
 if(phase===2)text('The wall looks moisturised.',190,29,10,'#e1dfc6');},
 down(p){if(!phase&&hit(p,250+Math.cos(a)*60,78+Math.sin(a)*18,65,58))drag=true;},move(p){if(drag){let ang=Math.atan2((p.y-76)*3,p.x-250);target=clamp(ang,0,Math.PI);}},up(){if(drag){drag=false;if(target<.32){phase=1;t=0;target=0;api.tone(300,.1,.02);}else target=Math.PI;}},cancel(){if(drag){drag=false;target=Math.PI;}},update(dt){a+=(target-a)*Math.min(1,dt*18);if(phase===1&&(t+=dt)>1.4){phase=2;api.done();}},debug(){return {phase,angle:a,wallFacing:a<.32};}};

}
});
})();
