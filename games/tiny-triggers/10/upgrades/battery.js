(() => {
'use strict';
TinyV6.register(44, {
id: "battery",
title: "Positive thinking",
description: "Batteries: insert the last battery backwards and close the cover.",
hint: "Turn the last battery around → Insert it backwards → Close the cover",
verdict: "All charged up. Going nowhere.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,mode='',bx=98,by=120,a=0,ta=0,cx=398,cy=144,sy=0,ox=0,oy=0,t=0;
function cell(x,y,ang){ctx.save();ctx.translate(x,y);ctx.rotate(ang);shadow(2,47,18,5);round(-17,-45,34,90,6,gradient(-17,0,34,0,'#adb8ae','#f0e4b8'));round(-17,-44,34,25,4,'#bd885b');rect(-6,-49,12,5,'#d5d6bd');rect(-15,36,30,7,'#69818a');text('+',0,-26,17,'#f3e4b8');text('−',0,32,17,'#3e5a60');ctx.save();ctx.rotate(-Math.PI/2);text('AA',0,4,12,'#4c6262');ctx.restore();line(-11,-17,-11,28,'#fffae09a',2);ctx.restore();}
function cover(){shadow(cx,cy+67,48,8);round(cx-50,cy-69,100,138,11,gradient(cx-50,cy-69,100,138,'#718991','#344f60'));round(cx-41,cy-57,82,111,5,'#55727d');for(let n=0;n<5;n++)line(cx-22,cy-35+n*6,cx+22,cy-35+n*6,'#a9bdb275',2);poly([[cx-8,cy+37],[cx,cy+45],[cx+8,cy+37]],'#bdd0bb');round(cx-12,cy+55,24,5,2,'#203a49');}
return {draw(){wood();shadow(251,248,89,11);round(177,24,150,222,23,'#1c3543');round(180,21,144,221,21,gradient(180,20,144,220,'#8b9f9f','#3d5e6c'));for(let x of [195,310])for(let y of [42,222]){ellipse(x,y,3,3,'#b9c5ad');line(x-1,y-1,x+1,y+1,'#34505a');}round(201,76,103,139,7,'#1f3641');for(let x of [223,281]){round(x-20,84,40,124,8,'#152a35');text(x===281?'+':'−',x,96,13,'#c3ceb6');for(let n=0;n<4;n++)curve([[x-12,195+n*3],[x-3,191+n*3],[x+4,200+n*3],[x+12,195+n*3]],'#a6bab0',1.4);}cell(223,145,Math.PI);cell(bx,by,a);round(219,40,62,22,4,'#203b43');ellipse(233,50,3,3,phase===4?'#3e5155':'#78968b');text(phase===4?'OFF':'',257,55,10,'#9db3a8');cover();if(phase===4)text('The cover fits. The polarity does not.',240,265,9,'#d1d2ba');},
 down(p){if(phase===0&&hit(p,bx,by-34,62,57)){mode='rotate';sy=p.y;}else if(phase===1&&hit(p,bx,by,58,113)){mode='cell';ox=p.x-bx;oy=p.y-by;}else if(phase===2&&hit(p,cx,cy,113,151)){mode='cover';ox=p.x-cx;oy=p.y-cy;}},move(p){if(mode==='rotate')ta=clamp((p.y-sy)/83,0,1)*Math.PI;if(mode==='cell'){bx=p.x-ox;by=p.y-oy;}if(mode==='cover'){cx=p.x-ox;cy=p.y-oy;}},up(){if(mode==='rotate'){if(ta>2.6){ta=Math.PI;phase=1;api.tone(420,.07,.02);}else ta=0;}if(mode==='cell'){if(near({x:bx,y:by},281,145,40)){bx=281;by=145;phase=2;api.tone(240,.08,.02);}else{bx=98;by=120;}}if(mode==='cover'){if(near({x:cx,y:cy},251,145,42)){cx=251;cy=145;phase=3;t=0;api.tone(140,.1,.02);}else{cx=398;cy=144;}}mode='';},cancel(){if(mode==='rotate')ta=0;if(mode==='cell'){bx=98;by=120;}if(mode==='cover'){cx=398;cy=144;}mode='';},update(dt){a+=(ta-a)*Math.min(1,dt*14);if(phase===3&&(t+=dt)>.6){phase=4;api.done();}},debug(){return {guide:{cell:[bx,by],cover:[cx,cy]},phase,angle:a,reversed:phase>0,closed:phase>=3};}};

}
});
})();
