(() => {
'use strict';
TinyV6.register(8, {
id: "legacy-8",
title: "Gallery standards",
description: "Pull the right corner of the middle picture down.",
hint: "Grab the small brass corner and lower it a little.",
verdict: "The other two frames are judging you.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,a=0,goal=0,drag=false,t=0,origin=0;
function picture(x,y,w,h,rot,kind){ctx.save();ctx.translate(x,y);ctx.rotate(rot);round(-w/2+5,-h/2+7,w,h,3,'#07172270');round(-w/2,-h/2,w,h,2,gradient(0,-h/2,0,h,'#d5b577','#72533b'));rect(-w/2+4,-h/2+4,w-8,h-8,'#846548');rect(-w/2+8,-h/2+8,w-16,h-16,'#cfb88a');rect(-w/2+12,-h/2+12,w-24,h-24,'#e1d3ab');let l=-w/2+18,top=-h/2+18,iw=w-36,ih=h-36;ctx.save();ctx.beginPath();ctx.rect(l,top,iw,ih);ctx.clip();rect(l,top,iw,ih,gradient(l,top,0,ih,'#7a9c99','#c5c3a1'));ellipse(14,-19,12,12,'#e4c989');poly([[l,ih/5],[-18,-17],[2,8],[19,-10],[w/2,28],[w/2,h/2],[l,h/2]],kind===1?'#4d7775':'#567e6d');poly([[l,h/2],[-12,12],[12,29],[w/2,9],[w/2,h/2]],'#304f54');for(let j=0;j<5;j++)line(l,31+j*5,l+iw,31+j*5,'#b6c4ac55',1);if(kind===1){rect(-5,19,10,18,'#c6b28b');poly([[-11,20],[0,10],[11,20]],'#674e40');rect(-1,28,4,9,'#405057');}ctx.restore();for(const s of [-1,1])for(const z of [-1,1]){line(s*(w/2-2),z*(h/2-9),s*(w/2-9),z*(h/2-2),'#ead29a',2);}ctx.restore();}
return {draw(){rect(0,0,480,270,'#263943');for(let x=0;x<480;x+=40){rect(x,0,1,245,'#8a9b8b12');}rect(0,240,480,30,'#374d51');line(0,240,480,240,'#6e8580',3);for(let x of [84,240,396]){poly([[x-33,0],[x+33,0],[x+59,90],[x-59,90]],'#e8d7a007');ellipse(x,24,20,3,'#a1ac9b');rect(x-19,17,38,6,'#718b8d');}picture(83,128,109,124,0,0);picture(240,128,145,156,a,1);picture(397,128,109,124,0,2);for(let x of [83,240,397]){round(x-24,218,48,9,1,'#a8a489');line(x-18,222,x+17,222,'#5b6863',1);}ellipse(240,47,3,3,'#e0c996');if(drag||phase){line(167,213,313,213,'#bfdbcd44',1);}if(!phase){ctx.save();ctx.translate(240,128);ctx.rotate(a);ellipse(66,70,6,6,'#e8c88a');ctx.restore();}},down(p){if(!phase&&near(p,305,198,34)){drag=true;origin=p.y;}},move(p){if(drag)goal=clamp((p.y-origin)/130,-.4,.4);},up(){if(drag){drag=false;if(goal>.07&&goal<.32){phase=1;t=0;goal=.14;api.tone(420,.1,.02);}else goal=0;}},cancel(){if(drag){drag=false;goal=0;}},update(dt){if(phase===1){t+=dt;a=goal+Math.sin(t*15)*.035*Math.exp(-t*4);if(t>1){a=goal;phase=2;api.done();}}else a+=(goal-a)*Math.min(1,dt*18);},debug(){return {phase,angle:a};}};

}
});
})();
