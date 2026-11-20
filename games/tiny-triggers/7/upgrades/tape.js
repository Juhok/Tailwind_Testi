(() => {
'use strict';
TinyV6.register(50, {
id: "tape",
title: "Where did it go?",
description: "Tape roll: press the loose end perfectly flat so it cannot be found again.",
hint: "Flatten the loose end",
verdict: "Future you will enjoy this.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,amount=0,target=0,sx=0,sy=0,t=0;
function ring(y,color){ctx.beginPath();ctx.ellipse(220,y,79,73,0,0,Math.PI*2);ctx.ellipse(220,y,34,31,0,0,Math.PI*2,true);ctx.fillStyle=color;ctx.fill('evenodd');}
return {draw(){wood();shadow(223,228,92,13);ring(154,'#746d46');ring(147,gradient(140,70,160,160,'#d9c28c','#9b9566'));for(let r=39;r<77;r+=3){ctx.beginPath();ctx.ellipse(220,147,r,r*.925,0,0,Math.PI*2);ctx.strokeStyle=r%2?'#f0d7a12b':'#6b795438';ctx.lineWidth=1;ctx.stroke();}ellipse(220,147,34,31,'#d8c49b');ellipse(220,152,29,26,'#394b4b');curve([[195,135],[208,121],[235,122],[246,139]],'#f2dfb4',4);curve([[154,141],[151,98],[186,77],[214,76]],'#f7e1b588',4);curve([[252,194],[269,186],[285,160],[286,140]],'#e4ce9366',4);
 if(phase<2){let ex=mix(378,293,amount),ey=mix(88,145,amount),lift=(1-amount)*35;ctx.beginPath();ctx.moveTo(289,116);ctx.bezierCurveTo(314,106-lift,ex-26,ey-26,ex,ey-14);ctx.lineTo(ex+7,ey+14);ctx.bezierCurveTo(ex-21,ey+3,315,151-lift,297,156);ctx.closePath();ctx.fillStyle='rgba(219,202,148,'+(.65*(1-amount*.7))+')';ctx.fill();curve([[289,116],[314,106-lift],[ex-26,ey-26],[ex,ey-14]],'#f2e1b3aa',1.3);curve([[297,156],[315,151-lift],[ex-21,ey+3],[ex+7,ey+14]],'#8c9a7966',1.3);if(amount>.2)ellipse(296,145,5*(1-amount),11*(1-amount),'#f5e7bb80');}
 if(phase===2)text('The end is… somewhere.',240,252,11,'#d0d2ba');},
 down(p){if(!phase&&near(p,378,88,42)){drag=true;sx=p.x;sy=p.y;}},move(p){if(drag)target=clamp((sx-p.x+p.y-sy)/138,0,1);},up(){if(drag){drag=false;if(target>.83){target=1;phase=1;t=0;api.tone(350,.07,.018);}else target=0;}},cancel(){if(drag){drag=false;target=0;}},update(dt){amount+=(target-amount)*Math.min(1,dt*15);if(phase===1&&(t+=dt)>.75){phase=2;api.done();}},debug(){return {phase,amount,looseEnd:phase<2};}};

}
});
})();
