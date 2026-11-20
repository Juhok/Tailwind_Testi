(()=>{
"use strict";
TinyV6.register(42,{"id": "blinds", "title": "One dissenting slat", "description": "Blinds: turn one slat in the opposite direction to all the others.", "hint": "Turn just this slat", "verdict": "Sunlight with a personal grudge.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let turn=0,tt=0,settle=0;
return{draw(){rect(0,0,480,270,'#263d49');rect(0,225,480,45,'#48565b');round(91,19,297,218,5,'#637e88');round(100,27,279,199,3,'#cebfa2');rect(111,37,257,179,grad(111,37,0,170,'#799ba5','#dbbb82'));ellipse(322,72,24,24,'#f7d89a');for(let i=0;i<6;i++){const x=111+i*45,y=157+(i%3)*12;rect(x,y,38,Math.min(61,216-y),'#476b76');for(let r=0;r<3;r++)for(let c=0;c<3;c++)rect(x+7+c*9,y+9+r*12,4,5,'#9bada3');}rect(232,38,7,178,'#9fa68f');for(let i=0;i<7;i++){const y=53+i*24,v=i===3?turn:0,hh=18*(Math.abs(Math.cos(v*Math.PI)));shadow(239,y+10,125,7);round(112,y-hh/2,255,Math.max(2,hh),2,v>.5?'#8a9b99':grad(110,y-10,0,20,'#e1ddc5','#9caca7'));line(114,y-hh/2,365,y-hh/2,v>.5?'#6b8188':'#f5e8c8',2);if(i===3&&v>.05){poly([[112,y-10],[367,y-10],[453,247],[366,247]],'#efd598'+Math.round(v*35).toString(16).padStart(2,'0'));}}for(const x of [154,324]){line(x,40,x,210,'#8f9d93',2);for(let i=0;i<7;i++)line(x-2,51+i*24,x+2,55+i*24,'#e6e0c4',2);}round(106,32,266,13,4,'#d5d5bd');round(105,211,270,12,3,'#b7c1af');line(376,44,376,189,'#ced0b8',2);round(372,186,8,22,3,'#d2c6a2');ellipse(239,125,5,3,done?'#8a9b99':'#ccb17b');},down(p){if(!done&&hit(p,239,125,250,27))drag=p;},move(p){if(drag)tt=clamp((p.y-drag.y)/55,0,1);},up(){if(drag&&tt>.8){tt=1;phase=1;api.tone(420,.12);}else tt=0;drag=null;},cancel(){if(drag===null)return;drag=null;tt=0;},update(dt){time+=dt;turn+=(tt-turn)*Math.min(1,dt*12);if(phase&&turn>.985){settle+=dt;if(settle>.35)finish();}},debug(){return{phase,turn,done};}};

}});
})();
