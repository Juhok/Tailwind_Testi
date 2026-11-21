(() => {
'use strict';
TinyV6.register(23, {
id: "crumb",
title: "A clean sweep, almost",
description: "Dust pile: sweep everything away except one tiny crumb.",
hint: "Sweep the large pile → Sweep the rest, mostly",
verdict: "One crumb. A whole unfinished job.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,bx=370,by=175,progress=0,target=0,loaded=false,t=0,dx=0,dy=0;
const dirt=Array.from({length:42},(_,i)=>({x:227+Math.abs(Math.sin(i*42.83)*181.3%1)*93,y:151+Math.abs(Math.sin(i*19.17)*532.7%1)*57,r:1.1+i%3}));
function broom(){ctx.save();ctx.translate(bx,by);ctx.rotate(-.13);shadow(0,23,48,6);line(0,-11,28,-129,'#9f7754',11);line(-2,-12,25,-127,'#d1b183',3);round(-40,-18,80,18,5,'#698d85');round(-37,-16,74,7,2,'#a0b6a0');poly([[-36,0],[36,0],[45,23],[-47,23]],'#cba76b');for(let i=0;i<19;i++)line(-35+i*4,0,-45+i*5+(drag?-6:0),24,'#776a4b',1);ctx.restore();}
return {draw(){rect(0,0,480,270,'#485653');for(let x=0;x<480;x+=120)line(x,0,x,270,'#72807966',2);for(let y=0;y<270;y+=90)line(0,y,480,y,'#72807966',2);specks(0,0,480,270,80,'#182e2a16');shadow(91,209,55,14);poly([[47,143],[121,143],[142,207],[29,207]],'#254d60');poly([[53,151],[117,151],[130,199],[41,199]],'#527a89');line(33,206,139,206,'#c1c8ac',4);round(72,96,25,58,6,'#315c6d');round(79,102,11,25,4,'#485653');for(let i=0;i<dirt.length;i++){let p=dirt[i],f=clamp(progress*1.25-i*.006,0,1);let x=mix(p.x,55+Math.abs(Math.sin(i*11.3)*237.1%1)*65,f),y=mix(p.y,168+Math.abs(Math.sin(i*9.1)*72.7%1)*29,f);ellipse(x,y,p.r,p.r*.6,i%4?'#b2a48a':'#e1c795');}poly([[328,214],[333,212],[337,215],[334,219],[329,219]],'#e6c794');line(329,214,333,214,'#fff0ba',1);broom();if(phase===2){text('Everything. Except that.',277,249,10,'#d1d4bd');}},
 down(p){if(!phase&&hit(p,bx,by-30,90,155)){drag=true;dx=p.x-bx;dy=p.y-by;}},move(p){if(drag){bx=clamp(p.x-dx,83,430);by=clamp(p.y-dy,100,221);if(bx<315&&bx>230&&Math.abs(by-176)<42)loaded=true;if(loaded&&Math.abs(by-176)<48)target=Math.max(target,clamp((310-bx)/172,0,1));}},up(){if(drag){drag=false;if(target>.96){phase=1;t=0;api.tone(260,.08,.02);}}},cancel(){drag=false;},update(dt){progress+=(target-progress)*Math.min(1,dt*8);if(phase===1&&(t+=dt)>.6){phase=2;api.done();}},debug(){return {guide:{broom:[bx,by-30],broomBase:[bx,by]},phase,progress,remaining:phase===2?1:43-Math.floor(progress*42)};}};

}
});
})();
