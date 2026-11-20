(() => {
'use strict';
TinyV6.register(38, {
id: "watering",
title: "Missed the saucer",
description: "Watering can: pour the final splash just outside the plant saucer.",
hint: "Pour onto the soil → Move the final splash beside the saucer",
verdict: "The table was thirsty too.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,x=98,y=164,tx=98,ty=164,water=0,tilt=0,t=0,ox=0,oy=0;
function leaf(cx,cy,dx,dy){ctx.beginPath();ctx.moveTo(cx,cy);ctx.bezierCurveTo(cx+dx*.1-dy*.4,cy+dy*.1+dx*.4,cx+dx*.8-dy*.3,cy+dy*.8+dx*.3,cx+dx,cy+dy);ctx.bezierCurveTo(cx+dx*.5+dy*.3,cy+dy*.5-dx*.3,cx+dy*.3,cy-dx*.3,cx,cy);ctx.fillStyle=gradient(cx,cy,dx,dy,'#3b7467','#83a476');ctx.fill();line(cx,cy,cx+dx*.88,cy+dy*.88,'#bed09b55',1);}
return {draw(){wood();rect(315,16,134,111,'#152e39');rect(321,21,122,100,'#718e8c');line(381,21,381,121,'#c7ccb1',4);line(321,69,443,69,'#c7ccb1',4);ellipse(410,43,13,13,'#d4d3a4');shadow(295,223,74,12);ellipse(293,221,66,11,'#744e42');ellipse(293,217,61,10,'#bc8360');poly([[245,153],[339,153],[326,214],[261,214]],gradient(245,153,95,60,'#c9916c','#91624e'));ellipse(292,153,49,14,'#dfab7b');ellipse(292,151,41,10,water>.2?'#3e3f30':'#665642');specks(255,145,74,13,32,'#9e936255');line(292,150,292,75,'#67906a',4);for(let i=0;i<6;i++){let cy=137-i*12,side=i%2?1:-1;leaf(292,cy,side*(36+i%3*8),-30);}leaf(292,79,12,-42);
 let pouring=(drag&&phase===0&&Math.hypot(x-210,y-105)<46)||(phase===2&&t<.8);let spill=phase>=2?clamp(t,0,1):0;if(spill){ellipse(381,222,spill*34,spill*8,'#89b6bd77');ellipse(382,220,spill*26,spill*4,'#c1d8ca44');curve([[370,222],[382,217],[394,224],[404,222]],'#c5e5dc77',1);}
 if(pouring){let end=phase===2?{x:380,y:220}:{x:287,y:150};curve([[x+69,y-6],[x+76,y+15],[end.x-9,end.y-10],[end.x,end.y]],'#a4d2d5aa',3);for(let i=0;i<7;i++){let q=(t*2+i/7)%1;ellipse(mix(x+70,end.x,q),mix(y-4,end.y,q),1.5,2.5,'#d2e7d9');}}
 ctx.save();ctx.translate(x,y);ctx.rotate(tilt);shadow(0,47,48,7);ctx.beginPath();ctx.ellipse(-37,-3,27,37,0,0,Math.PI*2);ctx.strokeStyle='#789da1';ctx.lineWidth=9;ctx.stroke();poly([[27,14],[57,-23],[73,-26],[39,29]],'#7fa9aa');ellipse(71,-26,10,5,'#bfd0bb');ellipse(71,-27,6,3,'#335d69');round(-34,-23,70,69,12,gradient(-34,-23,70,70,'#a3c0b5','#477886'));ellipse(0,-24,33,9,'#bad1bf');ellipse(0,-24,24,5,'#375e6a');line(-20,-10,-20,31,'#d2ddc7',4);curve([[-25,30],[-3,41],[16,40],[28,30]],'#345b6780',2);ctx.restore();if(phase===1)text('One last splash…',112,247,10,'#cdd3b8');if(phase===3)text('The saucer watched it happen.',240,255,10,'#cdd3b8');},
 down(p){if(phase<2&&hit(p,x,y,115,106)){drag=true;ox=p.x-x;oy=p.y-y;}},move(p){if(drag){tx=clamp(p.x-ox,70,345);ty=clamp(p.y-oy,65,195);}},up(){if(drag){drag=false;if(phase===1&&near({x:tx,y:ty},305,106,45)){phase=2;tx=305;ty=106;t=0;api.tone(540,.08,.02);}}},cancel(){drag=false;},update(dt){x+=(tx-x)*Math.min(1,dt*20);y+=(ty-y)*Math.min(1,dt*20);t+=dt;let pouring=drag&&phase===0&&near({x,y},210,105,46);tilt+=((pouring||(phase===2&&t<.8)?.34:0)-tilt)*Math.min(1,dt*8);if(pouring){water+=dt;if(water>.8){phase=1;api.say('Just one splash left.');}}if(phase===2&&t>.8){tx=98;ty=164;}if(phase===2&&t>1.65){phase=3;api.done();}},debug(){return {phase,water,spill:phase>=2};}};

}
});
})();
