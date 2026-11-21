(() => {
'use strict';
TinyV6.register(26, {
id: "sandwich",
title: "Coverage optional",
description: "Sandwich: place the cheese so that the center stays bare and the edges overhang.",
hint: "Cheese on one edge → Cheese on the other edge",
verdict: "The bread in the middle is on its own.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

const slices=[{x:66,y:137,home:66,placed:false,sag:0},{x:414,y:137,home:414,placed:false,sag:0}];let phase=0,drag=-1,ox=0,oy=0,t=0;
function bread(){shadow(241,224,92,13);ctx.beginPath();ctx.moveTo(171,222);ctx.quadraticCurveTo(155,220,156,203);ctx.lineTo(150,99);ctx.bezierCurveTo(132,69,166,47,192,54);ctx.quadraticCurveTo(240,41,283,55);ctx.bezierCurveTo(317,49,345,75,328,100);ctx.lineTo(321,204);ctx.quadraticCurveTo(320,225,303,224);ctx.closePath();ctx.fillStyle='#ae7646';ctx.fill();ctx.save();ctx.translate(239,139);ctx.scale(.91,.91);ctx.translate(-239,-139);ctx.beginPath();ctx.moveTo(171,222);ctx.quadraticCurveTo(155,220,156,203);ctx.lineTo(150,99);ctx.bezierCurveTo(132,69,166,47,192,54);ctx.quadraticCurveTo(240,41,283,55);ctx.bezierCurveTo(317,49,345,75,328,100);ctx.lineTo(321,204);ctx.quadraticCurveTo(320,225,303,224);ctx.closePath();ctx.fillStyle=gradient(160,60,150,160,'#f4dfb1','#d4b88a');ctx.fill();ctx.clip();specks(150,57,180,163,110,'#ac86574a');curve([[168,95],[198,72],[282,77],[313,94]],'#fff0ca',3);ctx.restore();}
function cheese(c,i){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(drag===i?-.06:0);ellipse(2,57,36,3,c.placed?'#5e4c282b':'#07161e60');let s=c.sag*16,side=i===0?-1:1;poly([[-35,-53],[35,-53],[35+(side===1?3:0),51+(side===1?s:0)],[-35-(side===-1?3:0),51+(side===-1?s:0)]],gradient(-35,-53,70,110,'#f4cf69','#d49c3f'));line(-32,-50,32,-50,'#ffebb1',2);for(let n=0;n<5;n++){let x=-23+(n*23%48),y=-33+(n*29%75);ellipse(x,y,5+n%3,4+n%2,'#b57e3655');curve([[x-4,y+1],[x-3,y+6],[x+3,y+6],[x+5,y+1]],'#ffe49a',1);}if(c.placed){let edge=side*20;curve([[edge,-50],[edge+side*4,-18],[edge-side*2,27],[edge+side*6,55]],'#b8883944',2);}ctx.restore();}
return {draw(){wood();round(118,29,244,215,14,'#a17b57');round(123,31,234,208,12,'#bb9770');for(let n=0;n<8;n++)curve([[128,44+n*25],[194,37+n*25],[282,51+n*25],[352,43+n*25]],'#795a3e33',1);ellipse(341,49,8,8,'#765b46');bread();for(let i=0;i<2;i++)if(i!==drag)cheese(slices[i],i);if(drag>=0)cheese(slices[drag],drag);if(phase===2)text('The middle gets plain bread.',240,260,10,'#ccd1b7');},down(p){if(phase)return;drag=slices.findIndex(c=>!c.placed&&hit(p,c.x,c.y,78,116));if(drag>=0){ox=p.x-slices[drag].x;oy=p.y-slices[drag].y;}},move(p){if(drag>=0){slices[drag].x=clamp(p.x-ox,40,440);slices[drag].y=clamp(p.y-oy,60,205);}},up(){if(drag<0)return;let c=slices[drag],x=drag===0?174:305;if(near(c,x,142,40)){c.x=x;c.y=142;c.placed=true;api.tone(370+drag*100,.07,.02);}else{c.x=c.home;c.y=137;}drag=-1;if(slices.every(c=>c.placed)){phase=1;t=0;}},cancel(){if(drag>=0){slices[drag].x=slices[drag].home;slices[drag].y=137;}drag=-1;},update(dt){slices.forEach(c=>{if(c.placed)c.sag+=(1-c.sag)*Math.min(1,dt*6);});if(phase===1&&(t+=dt)>.65){phase=2;api.done();}},debug(){return {guide:{slices:slices.map((c,i)=>({from:[c.x,c.y],placed:c.placed,to:[i?305:174,142]}))},phase,placed:slices.filter(c=>c.placed).length,gap:61};}};

}
});
})();
