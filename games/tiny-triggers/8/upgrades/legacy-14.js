(() => {
'use strict';
TinyV6.register(14, {
id: "legacy-14",
title: "Shut enough",
description: "Slide the drawer almost closed. Leave a little gap.",
hint: "Side view: push the drawer handle left toward the cabinet. It stops just short of flush.",
verdict: "That is going to bother someone all afternoon.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,open=133,target=133,drag=false,sx=0,base=0,t=0;
function grain(x,y,w,h,c){for(let n=0;n<7;n++)curve([[x,y+5+n*h/8],[x+w*.3,y+n*h/8-3],[x+w*.7,y+n*h/8+10],[x+w,y+5+n*h/8]],c,1);}
return {draw(){rect(0,0,480,270,'#273d47');rect(0,224,480,46,'#3c535a');for(let x=-50;x<500;x+=76)line(x,224,x+54,270,'#6b837745',1);shadow(236,237,170,12);
 poly([[68,59],[116,39],[289,39],[252,61]],'#c7a67c');rect(68,61,184,164,gradient(68,60,184,150,'#9e7958','#65503e'));grain(75,76,165,125,'#c29b7433');rect(81,79,153,126,'#403e34');rect(88,85,143,115,'#1a2b2c');line(92,183,246,183,'#7b8d87',4);line(97,181,247,181,'#c3c9af',1);
 // drawer box extends out of cabinet toward the right
 let front=246+open;poly([[104+open,94],[front,94],[front+30,81],[135+open,81]],'#342f29');poly([[104+open,94],[front,94],[front,176],[104+open,176]],'#bd9b6d');grain(108+open,104,open>40?128:130,63,'#775d3c55');poly([[104+open,94],[135+open,81],[135+open,162],[104+open,176]],'#d4b582');
 round(154+open,95,42,37,5,'#97a29b');curve([[158+open,112],[169+open,100],[177+open,126],[189+open,109]],'#d4d5bd',3);round(196+open,105,31,25,4,'#6c8789');
 rect(front,78,22,130,gradient(front,78,22,0,'#c59e70','#96704e'));poly([[front,78],[front+29,65],[front+29,195],[front+22,208],[front+22,78]],'#a28159');line(front+3,84,front+3,201,'#ead1a0',2);rect(front+21,123,12,8,'#555b55');round(front+28,110,10,36,4,'#b8c1ad');line(front+31,114,front+31,138,'#eff0d4',2);
 // cabinet foreground hides the retracted box
 rect(68,61,183,164,gradient(68,61,183,150,'#aa835e','#77573e'));rect(82,82,153,113,'#8b6c4e');rect(88,88,141,101,'#987553');grain(92,93,133,89,'#c4a57b44');line(82,82,235,82,'#604c3d',2);line(235,82,235,195,'#c8a578',2);rect(68,61,183,15,'#b6946a');rect(68,202,183,23,'#8c6e50');rect(77,224,21,14,'#594d3b');rect(223,224,20,14,'#594d3b');
 if(phase===2){line(253,212,253,221,'#dec183',2);line(264,212,264,221,'#dec183',2);line(253,217,264,217,'#dec183',1);text('Just that little bit.',329,247,10,'#d4cfb5');}},
 down(p){if(!phase&&hit(p,246+open+27,137,67,140)){drag=true;sx=p.x;base=target;}},move(p){if(drag)target=clamp(base+p.x-sx,11,145);},up(){if(drag){drag=false;if(target<22){target=11;phase=1;t=0;api.tone(170,.07,.02);}}},cancel(){if(drag){drag=false;target=133;}},update(dt){open+=(target-open)*Math.min(1,dt*17);if(phase===1&&(t+=dt)>.55){phase=2;api.done();}},debug(){return {phase,open};}};

}
});
})();
