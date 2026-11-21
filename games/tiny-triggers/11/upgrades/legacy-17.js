(() => {
'use strict';
TinyV6.register(17, {
id: "legacy-17",
title: "An inviting handle",
description: "Pull the inviting handle. Then push the PUSH door.",
hint: "Pull the handle toward you (drag down), then push into the doorway (drag up).",
verdict: "Excellent handle. Terrible instructions.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,sy=0,amount=0,target=0,t=0,pulled=false;
function panel(){const a=amount,rx=329-a*99,top=43+a*24,bot=232-a*25;poly([[151,43],[rx,top],[rx,bot],[151,232]],gradient(151,43,180,160,'#527b7d','#2d515b'));poly([[151,43],[159,48],[159,226],[151,232]],'#9cae9b');let sx=(rx-151)/178;ctx.save();ctx.translate(151,top);ctx.transform(sx,0,0,1-a*.26,0,0);round(18,18,143,91,3,'#213c49');round(22,22,135,83,1,gradient(0,20,120,90,'#8da8a6','#365d68'));poly([[23,24],[65,24],[110,104],[89,104]],'#d7e4c922');poly([[78,24],[90,24],[136,104],[123,104]],'#d7e4c915');round(41,61,94,32,3,'#e4d8b2');text('PUSH',88,83,17,'#38565b');round(120,119,15,61,5,'#1c353f');round(126,123,13,52,4,gradient(126,0,13,0,'#d7dfc7','#759697'));line(129,129,129,168,'#f3eed0',2);rect(21,181,137,6,'#b1b9a1');ctx.restore();}
return {draw(){rect(0,0,480,270,'#293f49');for(let r=0;r<5;r++){line(0,r*47+17,480,r*47+17,'#71887c25',1);for(let x=(r%2)*58;x<480;x+=116)line(x,r*47+17,x,r*47+64,'#71887c25',1);}poly([[0,235],[480,235],[480,270],[0,270]],'#3c5259');poly([[147,42],[335,42],[335,235],[147,235]],'#172a35');rect(165,57,155,177,'#8b9f8e');rect(180,67,128,126,'#506f73');poly([[165,235],[320,235],[286,178],[194,178]],'#adad8b');line(242,178,242,235,'#d7d5ae',1);rect(139,34,12,205,'#8b9d8f');rect(329,34,12,205,'#8b9d8f');rect(139,32,202,13,'#b3b8a0');panel();line(148,235,339,235,'#d0cbaa',3);if(pulled&&phase<2){text('It says PUSH.',240,258,11,'#dfc190');}if(phase===3){text('The handle was very convincing.',240,258,10,'#cad1bc');}},down(p){if(phase<2&&hit(p,282,188,67,106)){drag=true;sy=p.y;}},move(p){if(drag){let dy=p.y-sy;if(!pulled)target=clamp(-dy/350,-.065,0);else target=clamp(-dy/130,0,.87);}},up(){if(drag){drag=false;if(!pulled&&target<-.04){pulled=true;phase=1;target=0;t=0;api.tone(130,.07,.025);}else if(pulled&&target>.4){phase=2;target=.87;t=0;api.tone(330,.12,.02);}else target=0;}},cancel(){if(drag){drag=false;target=0;}},update(dt){amount+=(target-amount)*Math.min(1,dt*12);if(phase===2&&(t+=dt)>.85){phase=3;api.done();}},debug(){return {phase,pulled,amount};}};

}
});
})();
