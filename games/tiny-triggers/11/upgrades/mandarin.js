(() => {
'use strict';
TinyV6.register(56, {
id: "mandarin",
title: "One thread each",
description: "Mandarin: leave one white thread on every segment.",
hint: "Remove most of the pith → Leave one white thread → One on this segment too → A thread on every segment",
verdict: "Individually wrapped in tiny annoyances.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

function wholeMandarin(){
 shadow(65,58,34,5);
 const g=ctx.createRadialGradient(51,25,3,66,34,39);g.addColorStop(0,'#ffc463');g.addColorStop(.58,'#ef9a37');g.addColorStop(1,'#b95b24');
 ctx.save();ctx.beginPath();ctx.moveTo(64,12);ctx.bezierCurveTo(83,8,99,19,99,36);ctx.bezierCurveTo(99,53,84,60,65,59);ctx.bezierCurveTo(45,60,31,50,31,35);ctx.bezierCurveTo(31,20,47,9,64,12);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.clip();
 specks(32,15,65,44,115,'#9b4d243d');specks(37,19,45,30,60,'#ffe49e65');
 curve([[39,34],[38,22],[46,17],[55,16]],'#ffdf9588',2);ctx.restore();
 ellipse(65,14,7,2.6,'#bc6b29');
 poly([[65,10],[68,12],[73,12],[70,15],[70,17],[66,16],[62,18],[62,15],[58,13],[63,13]],'#6b793d');
 line(66,13,68,7,'#8c6d37',2);
 ctx.save();ctx.translate(78,11);ctx.rotate(-.2);ellipse(0,0,12,4.4,'#739852');line(-10,0,10,0,'#c0ba73',1);ctx.restore();
}
const parts=[90,190,290,390].map(x=>({x,clean:false,amount:0,target:0}));let phase=0,drag=-1,sy=0,t=0;
function fruit(c,i){ctx.save();ctx.translate(c.x,143);ctx.rotate((i%2?1:-1)*.13);shadow(0,55,37,8);ctx.beginPath();ctx.moveTo(-21,-50);ctx.bezierCurveTo(17,-55,43,-19,33,15);ctx.bezierCurveTo(23,60,-13,66,-30,29);ctx.bezierCurveTo(-41,2,-34,-27,-21,-50);ctx.closePath();ctx.fillStyle=gradient(-33,-50,67,112,'#f3b65b','#cf743d');ctx.fill();ctx.strokeStyle='#efd0a0';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.clip();for(let n=0;n<15;n++){let y=-43+n*7;curve([[-24,y],[-4,y+11],[16,y+4],[31,y+19]],n%2?'#f8cb7a88':'#b8643d66',1.3);}specks(-30,-45,60,95,50,'#fff0bc55');ctx.restore();curve([[-8,-46],[-20,-15],[14,13],[2,48]],'#f3e7be',2.2);
 for(let n=0;n<4;n++){let move=c.amount*62;curve([[-21+n*10,-42-move],[-33+n*13,-14-move],[25-n*12,12-move],[19-n*10,41-move]],'#eee1b5'+(c.clean?'00':'cc'),1.6);}if(c.clean){for(let n=0;n<3;n++)curve([[-23+n*10,76],[-38+n*12,63],[-23+n*15,88],[-9+n*9,73]],'#d9d7b5',1.3);}ctx.restore();}
return {draw(){wood();round(34,61,413,181,18,'#627c7e');round(39,64,403,172,15,'#879d94');for(let i=0;i<4;i++)fruit(parts[i],i);wholeMandarin();if(phase===2)text('One little thread. On every piece.',240,261,10,'#d6d4bb');},
 down(p){if(phase)return;drag=parts.findIndex(c=>!c.clean&&hit(p,c.x,132,76,112));if(drag>=0)sy=p.y;},move(p){if(drag>=0)parts[drag].target=clamp((sy-p.y)/72,0,1);},up(){if(drag>=0){let c=parts[drag];if(c.target>.65){c.clean=true;c.target=1;api.tone(420+drag*60,.06,.02);}else c.target=0;drag=-1;if(parts.every(c=>c.clean)){phase=1;t=0;}}},cancel(){if(drag>=0)parts[drag].target=0;drag=-1;},update(dt){parts.forEach(c=>c.amount+=(c.target-c.amount)*Math.min(1,dt*13));if(phase===1&&(t+=dt)>.55){phase=2;api.done();}},guidance(){if(phase===2)return null;if(phase===1)return {kind:'wait',label:'Leaving one thread on each segment'};const next=drag>=0?parts[drag]:parts.find(c=>!c.clean);return {kind:'drag',from:[next.x,132-next.amount*72],to:[next.x,55],label:'Peel away most of the white pith'};},debug(){return {phase,cleaned:parts.filter(c=>c.clean).length,threads:parts.map(c=>c.clean?1:5)};}};

}
});
})();
