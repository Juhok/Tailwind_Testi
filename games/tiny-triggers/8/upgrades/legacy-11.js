(() => {
'use strict';
TinyV6.register(11, {
id: "legacy-11",
title: "Wait for it",
description: "Arrange the countdown: 3, 2, 2, 1.",
hint: "Drag the four number cards into their matching outlined slots.",
verdict: "Three… two… two… one.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

const slots=[90,190,290,390],want=[3,2,2,1],cards=[{n:2,x:80,y:210,home:80},{n:1,x:185,y:210,home:185},{n:3,x:295,y:210,home:295},{n:2,x:400,y:210,home:400}];let phase=0,drag=-1,px=0,py=0,t=0,active=-1;
function card(c,i){ctx.save();ctx.translate(c.x,c.y);let flip=phase===1&&active===c.slot?Math.sin((t%0.72)/.72*Math.PI)*.14:0;ctx.scale(1,1-flip);shadow(3,34,34,6);round(-32,-40,64,80,5,'#212b34');round(-30,-38,60,74,3,gradient(0,-38,0,75,'#eef0d6','#a4b8ac'));rect(-27,-4,54,2,'#6c8378');text(String(c.n),0,8,52,'#2d4a50');line(-30,-1,-24,-1,'#e4c98c',4);line(24,-1,30,-1,'#e4c98c',4);round(-23,-36,46,3,1,'#ffffff70');if(active===c.slot&&phase){round(-35,-43,70,86,5,'#ffffff00','#dfba6a');}ctx.restore();}
return {draw(){rect(0,0,480,270,'#243742');rect(0,174,480,96,'#30454e');for(let x=0;x<480;x+=30)line(x,176,x+50,270,'#68827825',1);shadow(243,170,216,11);round(32,43,416,125,9,'#15252e');round(37,45,406,118,7,gradient(0,45,0,120,'#627d81','#344e5b'));for(let x of [46,434])for(let y of [55,153]){ellipse(x,y,3,3,'#aab8a5');line(x-1,y-1,x+1,y+1,'#354b4e');}text('COUNTDOWN',240,31,12,'#d5caa7');for(let i=0;i<4;i++){round(slots[i]-37,62,74,90,5,'#1d3039');if(!cards.some(c=>c.slot===i)){text(String(want[i]),slots[i],123,43,'#668084');}ellipse(slots[i],156,3,2,active===i?'#e7c77a':'#182c34');}cards.forEach((c,i)=>{if(i!==drag)card(c,i)});if(drag>=0)card(cards[drag],drag);if(phase===2)text('3 … 2 … 2 … 1.',240,237,13,'#d7d8b8');},
 down(p){if(phase)return;drag=cards.findIndex(c=>c.slot===undefined&&hit(p,c.x,c.y,72,86));if(drag>=0){px=p.x-cards[drag].x;py=p.y-cards[drag].y;}},move(p){if(drag>=0){cards[drag].x=clamp(p.x-px,35,445);cards[drag].y=clamp(p.y-py,50,230);}},up(){if(drag<0)return;let c=cards[drag],s=slots.findIndex((x,i)=>near({x:c.x,y:c.y},x,106,44)&&want[i]===c.n&&!cards.some(o=>o.slot===i));if(s>=0){c.slot=s;c.x=slots[s];c.y=106;api.tone(300+s*90,.06,.02);}else{c.x=c.home;c.y=210;}drag=-1;if(cards.every(c=>c.slot!==undefined)){phase=1;t=0;active=0;}},cancel(){if(drag>=0){cards[drag].x=cards[drag].home;cards[drag].y=210;}drag=-1;},update(dt){if(phase===1){t+=dt;active=Math.min(3,Math.floor(t/.72));if(t>3.1){phase=2;api.done();}}},debug(){return {phase,placed:cards.filter(c=>c.slot!==undefined).length,active};}};

}
});
})();
