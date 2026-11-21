(()=>{
"use strict";
TinyV6.register(27,{"id": "spaghetti", "title": "Short pasta, long argument", "description": "Spaghetti: snap the dry strands just before putting them in the pot.", "hint": "Snap the bundle \u2192 Into the pot", "verdict": "It fits. That is not the point.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let bend=0,bt=0,bx=160,by=126,split=0,fall=0,boil=0;
function pasta(){ctx.save();ctx.translate(bx,by+fall*65);ctx.globalAlpha=1-fall*.85;for(let i=0;i<13;i++){const y=(i-6)*2.7;if(phase===0){curve([[-88,y],[-38,y-4],[32,y-bend*49],[88-bend*28,y+bend*65]],i%3?'#e9c16e':'#fff0a6',2);}else{line(-79,y+split*5,-5,y-split*18,'#f2d68b',2);line(10,y+split*12,78,y-split*8,'#dfb661',2);}}if(phase===0){round(-38,-22,65,45,3,'#7b899155');line(-33,-19,24,-19,'#c2c1aa',1);}ctx.restore();}
return{draw(){desk('#2c3a42');round(277,186,165,37,8,'#172934','#56727a');ellipse(359,203,57,12,'#bc825d');round(294,118,130,79,12,grad(293,120,125,70,'#b6c6c6','#5c7986'),'#d0d7ca');ellipse(359,119,65,24,'#e5e5cc');ellipse(359,121,59,19,'#456f7e');ellipse(359,121,54,15,'#6e9ba0');curve([[293,139],[267,130],[266,166],[294,163]],'#bbc8bf',8);curve([[424,139],[450,130],[452,166],[425,163]],'#bbc8bf',8);line(305,146,305,181,'#d9ded1',4);for(let i=0;i<7;i++){const x=319+i*13,y=120+Math.sin(time*3+i)*5;ellipse(x,y,2+Math.sin(time*4+i)*.6,1.5,'#bbd5ca');}for(let i=0;i<3;i++)curve([[331+i*26,93],[321+i*26+Math.sin(time+i)*4,78],[347+i*24,70],[336+i*24,49]],'#c9d9d336',3);if(fall<1)pasta();if(fall>0)for(let i=0;i<9;i++){const x=330+i*7;line(x,122,x+3,127+Math.sin(time*2+i)*3,'#e6ce8b',2);}if(phase===0)text('SNAP',160,214,10,'#a9bbb8');},down(p){if(done)return;if(phase===0&&near(p,240,126,42))drag=p;else if(phase===1&&near(p,bx,by,86))drag=p;},move(p){if(!drag)return;if(phase===0)bt=clamp((p.y-126)/65,0,1);else{bx=p.x;by=p.y;}},up(p){if(!drag)return;if(phase===0&&bt>.8){phase=1;split=1;api.tone(560,.07);}else if(phase===1&&near(p,359,116,66)){phase=2;bx=359;by=84;api.tone(360,.1);}else if(phase===0)bt=0;else{bx=160;by=126;}drag=null;},cancel(){if(drag===null)return;drag=null;if(phase===0)bt=0;else{bx=160;by=126;}},update(dt){time+=dt;bend+=(bt-bend)*Math.min(1,dt*14);if(phase===2){fall=Math.min(1,fall+dt*1.5);boil+=dt;if(boil>1)finish();}},debug(){return{guide:{bundle:[bx,by]},phase,bend,fall,done};}};

}});
})();
