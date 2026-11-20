(()=>{
"use strict";
TinyV6.register(51,{"id": "pencap", "title": "Before the click", "description": "Pen cap: push it almost shut, stopping just before it clicks.", "hint": "Stop just before the click", "verdict": "Secure enough. Probably not.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let x=371,target=371,settle=0,warning=0;
return{draw(){desk('#35424b');ctx.save();ctx.translate(232,151);ctx.rotate(-.035);round(-171,-64,337,130,6,'#172d38','#607b82');line(-157,50,150,50,'#7a969b',1);ctx.restore();shadow(165,164,109,12);round(61,127,169,31,8,grad(65,126,0,33,'#799a9d','#264c62'),'#abc4bd');round(61,128,21,29,8,'#456c7d');for(let n=0;n<3;n++)line(87+n*6,130,87+n*6,155,'#315565',1);rect(218,127,13,31,'#ceb881');rect(230,132,15,22,'#718c95');path([[245,132],[269,144],[245,154]],'#b6c8c4','#d7dfc8');line(260,144,270,144,'#243947',2);shadow(x,163,49,12);round(x-43,124,90,36,9,grad(x-45,124,0,38,'#8aa5a5','#355d70'),'#a5c2bb');ellipse(x-42,142,3,15,'#1c394a');line(x-29,129,x+30,129,'#d7e1ce',2);round(x+3,115,38,5,2,'#d5c495');curve([[x+3,118],[x-6,118],[x-6,122],[x-4,127]],'#d5c495',3);line(236,174,236,186,'#b8aa7e',1);line(230,184,242,184,'#b8aa7e',1);if(warning>0)text('That would click.',240,222,11,'#dcc5a4');},down(p){if(!done&&hit(p,x,142,103,57))drag=p;},move(p){if(drag)x=target=clamp(p.x,255,385);},up(){if(!drag)return;if(x>=274&&x<=288){target=280;phase=1;api.tone(350,.1);}else{target=371;warning=x<274?1.5:0;}drag=null;},cancel(){if(drag===null)return;drag=null;target=371;},update(dt){time+=dt;warning=Math.max(0,warning-dt);if(!drag)x+=(target-x)*Math.min(1,dt*12);if(phase&&Math.abs(x-280)<.4){settle+=dt;if(settle>.45)finish();}},debug(){return{phase,x,gap:x-43-231,done};}};

}});
})();
