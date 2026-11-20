(() => {
'use strict';
TinyV6.register(68, {
id: "hanger",
title: "Through the neck",
description: "Hanger: stretch the shirt neckline to push the hanger through it.",
hint: "Push through the neck opening",
verdict: "A little more room to breathe.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,hx=103,hy=123,tx=103,ty=123,stretch=0,target=0,ox=0,oy=0,t=0;
function hanger(){ctx.save();ctx.translate(hx,hy);shadow(1,36,56,5);curve([[0,-5],[0,-22],[-13,-25],[-10,-39]],'#ced4bb',4);curve([[-10,-39],[-6,-53],[14,-49],[14,-36]],'#ced4bb',4);ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(-58,29);ctx.quadraticCurveTo(-63,35,-51,36);ctx.lineTo(51,36);ctx.quadraticCurveTo(63,35,58,29);ctx.closePath();ctx.strokeStyle='#b9b9a1';ctx.lineWidth=6;ctx.stroke();line(-47,32,47,32,'#e5ddba',1);ctx.restore();}
function shirt(){ctx.beginPath();ctx.moveTo(267,61);ctx.quadraticCurveTo(305,73,343,61);ctx.lineTo(389,87);ctx.lineTo(412,145);ctx.lineTo(377,165);ctx.lineTo(352,135);ctx.lineTo(357,242);ctx.lineTo(252,242);ctx.lineTo(257,135);ctx.lineTo(232,165);ctx.lineTo(196,145);ctx.lineTo(220,87);ctx.closePath();ctx.ellipse(305,83+stretch*9,22+stretch*23,13+stretch*6,0,0,Math.PI*2);ctx.fillStyle=gradient(210,67,180,190,'#a6b5a5','#5f8385');ctx.fill('evenodd');ctx.beginPath();ctx.ellipse(305,83+stretch*9,25+stretch*23,16+stretch*6,0,0,Math.PI*2);ctx.strokeStyle='#d4d8bc';ctx.lineWidth=7-stretch*2;ctx.stroke();ctx.beginPath();ctx.ellipse(305,83+stretch*9,22+stretch*23,13+stretch*6,0,0,Math.PI*2);ctx.strokeStyle='#4b7478';ctx.lineWidth=2;ctx.stroke();line(205,142,231,156,'#d0d6b988',2);line(378,156,404,143,'#d0d6b988',2);line(257,232,352,232,'#d6dbc066',2);curve([[257,115],[273,142],[251,182],[265,225]],'#456d7355',2);curve([[352,115],[337,146],[359,191],[345,223]],'#c9d1b744',2);for(let i=0;i<5;i++){let side=i%2?1:-1;curve([[305+side*(28+stretch*20),96],[305+side*(35+stretch*20),104+i*4],[305+side*39,114+i*8],[305+side*42,124+i*10]],'#456a7150',1.3);}for(let x=266;x<345;x+=7)line(x,236,x+3,236,'#d0d8bc77',1);}
return {draw(){rect(0,0,480,270,'#314650');for(let y=0;y<270;y+=6)line(0,y,480,y,'#8b9c870e',1);shadow(305,246,115,9);if(phase>0)hanger();shirt();if(phase===0)hanger();if(phase===3)text('A roomier neckline. Forever.',240,264,10,'#d4d4bc');},
 down(p){if(phase<2&&hit(p,hx,hy+6,137,113)){drag=true;ox=p.x-hx;oy=p.y-hy;}},move(p){if(drag){tx=clamp(p.x-ox,65,411);ty=clamp(p.y-oy,55,194);if(phase===0&&near({x:tx,y:ty},305,72,38)){phase=1;api.tone(430,.06,.018);}if(phase===1){tx=305;target=clamp((ty-72)/56,0,1);}}},up(){if(drag){drag=false;if(phase===1&&target>.82){phase=2;t=0;target=1;ty=90;api.tone(220,.1,.02);}else if(phase===0){tx=103;ty=123;}}},cancel(){if(drag){drag=false;if(phase===0){tx=103;ty=123;}else{ty=72;target=0;}}},update(dt){hx+=(tx-hx)*Math.min(1,dt*18);hy+=(ty-hy)*Math.min(1,dt*18);stretch+=(target-stretch)*Math.min(1,dt*10);if(phase===2&&(t+=dt)>.75){phase=3;api.done();}},debug(){return {phase,stretch};}};

}
});
})();
