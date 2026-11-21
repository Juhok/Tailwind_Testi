(() => {
'use strict';
TinyV6.register(32, {
id: "straw",
title: "The disappearing straw",
description: "Straw: push it so far into the juice carton that it falls completely inside.",
hint: "Push past the little hole",
verdict: "Your drink now contains its own equipment.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,sy=0,progress=0,target=0,t=0;
return {draw(){wood();shadow(267,237,92,13);let wob=phase?Math.sin(t*23)*Math.exp(-t*4)*.018:0;ctx.save();ctx.translate(265,232);ctx.rotate(wob);ctx.translate(-265,-232);poly([[188,112],[289,112],[289,234],[188,234]],gradient(188,112,100,120,'#c6d19d','#849c71'));poly([[289,112],[337,92],[337,214],[289,234]],'#5d806d');poly([[188,112],[238,91],[337,92],[289,112]],'#dee0b5');poly([[194,108],[242,97],[324,97],[286,108]],'#bdc994');line(290,118,290,227,'#deebbc',1);round(200,128,77,82,5,'#e8dfaf');text('JUICE',239,149,17,'#42665b');ellipse(239,177,23,22,'#df9852');ellipse(239,176,19,18,'#f1bd6b');for(let n=0;n<8;n++){let a=n*Math.PI/4;line(239+Math.cos(a)*3,176+Math.sin(a)*3,239+Math.cos(a)*15,176+Math.sin(a)*15,'#fff0b7',1.5);}curve([[239,155],[238,145],[249,150],[254,154]],'#537d4e',3);text('200 ml',239,222,9,'#416655');for(let n=0;n<5;n++)line(304+n*4,151,304+n*4,188,'#cbd7aa77',n%2?1:2);ellipse(251,105,10,4,'#60817b');ellipse(251,105,6,2.5,'#203d45');
 // Straw is clipped by the carton top, so the inserted length disappears inside.
 ctx.save();ctx.beginPath();ctx.rect(0,0,480,105);ctx.clip();let y=10+progress*105;round(246,y,10,112,4,'#eee9c9');ctx.save();ctx.beginPath();ctx.rect(246,y,10,112);ctx.clip();for(let n=0;n<14;n++)poly([[244,y+n*13],[258,y+n*13+8],[258,y+n*13+12],[244,y+n*13+4]],'#cb736c');ctx.restore();line(248,y+4,248,y+105,'#fffbe1',1);ellipse(251,y,5,2,'#9c9a8a');ctx.restore();ctx.restore();if(phase===2){ellipse(250,105,14,5,'#a6c5ac22');text('The straw is part of the drink now.',240,259,10,'#ccd4be');}},
 down(p){if(!phase&&hit(p,251,56+progress*45,48,112)){drag=true;sy=p.y;target=progress;}},move(p){if(drag)target=clamp((p.y-sy)/100,0,.98);},up(){if(drag){drag=false;if(target>.86){phase=1;target=1.1;t=0;api.tone(210,.12,.02);}else target=0;}},cancel(){if(drag){drag=false;target=0;}},update(dt){progress+=(target-progress)*Math.min(1,dt*(phase?5:17));if(phase===1&&(t+=dt)>1.1){phase=2;api.done();}},debug(){return {phase,progress,visibleLength:Math.max(0,95-progress*105)};}};

}
});
})();
