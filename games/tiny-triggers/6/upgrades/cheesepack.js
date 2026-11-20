(() => {
'use strict';
TinyV6.register(59, {
id: "cheesepack",
title: "No longer resealable",
description: "Cheese pack: tear the resealable seam so it no longer works.",
hint: "Tear across the reusable seal",
verdict: "Resealable was a temporary feature.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,drag=false,pull=0,target=0,sx=0,sy=0,t=0;
function jagged(x1,x2,y){let pts=[];for(let x=x1;x<=x2;x+=8)pts.push([x,y+(Math.floor((x-x1)/8)%2?3:-2)]);return pts;}
return {draw(){wood();shadow(241,235,128,10);poly([[123,52],[358,52],[366,230],[117,230]],'#b9c7b333');poly([[131,59],[351,59],[357,221],[126,221]],'#d1ddc52b');for(let i=0;i<5;i++){let x=149+i*3,y=114-i*5;round(x,y,161,102,3,gradient(x,y,170,100,'#f0c96b','#c99043'));line(x+2,y+2,x+157,y+2,'#ffdfa1',1);for(let n=0;n<8;n++){let px=x+17+(n*29%137),py=y+16+(n*19%71);ellipse(px,py,4+n%3,3+n%2,'#b5803f77');curve([[px-3,py],[px-2,py+5],[px+3,py+5],[px+5,py]],'#ffe49a77',1);}}
 // Back film and still-working portion of zipper remain fixed.
 let cut=356-pull*218;rect(128,76,Math.max(1,cut-128),11,'#84a59b');line(130,79,Math.max(130,cut),79,'#e6e5c6',1);line(130,84,Math.max(130,cut),84,'#4d7779',1);for(let x=130;x<cut;x+=7)line(x,76,x,87,'#d4debb55',1);
 if(pull>0){let edge=jagged(cut,358,91);poly([[cut,91],...edge,[360,110],[cut,101]],'#d7e0c57a');let off=pull*48;ctx.save();ctx.translate(-pull*26,off);ctx.rotate(pull*.09);poly([[cut,53],[358,53],[361,86],...jagged(cut,361,86).reverse()], '#d2dbc0a8');rect(cut,75,358-cut,10,'#7e9e93');line(cut,79,357,79,'#f1e9c9',1);ctx.restore();}else{poly([[128,53],[356,53],[358,76],[128,76]],'#cbd8c178');line(132,59,352,59,'#e2e8d18c',2);for(let i=0;i<5;i++)line(334+i*4,58,334+i*4,71,'#637f795c');}
 poly([[129,99],[140,97],[153,216],[139,216]],'#f5f2d52e');poly([[333,104],[346,104],[351,216],[338,216]],'#edf1db22');line(121,225,363,225,'#c3d1b96b',3);round(186,190,112,25,4,'#e9dfb4dd');text('CHEESE',242,208,15,'#6f704b');if(phase===2)text('Once resealable.',241,259,11,'#d1d3bb');},
 down(p){if(!phase&&near(p,346,72,33)){drag=true;sx=p.x;sy=p.y;}},move(p){if(drag)target=clamp((sx-p.x+(p.y-sy)*.75)/175,0,1);},up(){if(drag){drag=false;if(target>.8){target=1;phase=1;t=0;api.tone(180,.1,.02);}else target=0;}},cancel(){if(drag){drag=false;target=0;}},update(dt){pull+=(target-pull)*Math.min(1,dt*14);if(phase===1&&(t+=dt)>.65){phase=2;api.done();}},debug(){return {phase,pull,seamIntact:phase===0&&pull<.03};}};

}
});
})();
