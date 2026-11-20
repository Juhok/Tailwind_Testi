(()=>{
"use strict";
TinyV6.register(48,{"id": "stapler", "title": "Wrong corner, missing page", "description": "Stapler: staple the wrong corner of the stack and leave one sheet out.", "hint": "Leave one sheet aside \u2192 Staple the bottom-right corner", "verdict": "Almost a complete document.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let sx=195,sy=153,tx=369,ty=66,press=0,clock=0;
function paper(x,y,w,h,top){shadow(x,y+h/2+6,w*.48,7);round(x-w/2,y-h/2,w,h,2,top?'#e9e3d0':'#b9c9c5','#91a6a8');line(x-w/2+17,y-h/2+23,x+w/2-20,y-h/2+23,'#718b91',4);for(let n=0;n<5;n++)line(x-w/2+17,y-h/2+40+n*12,x+w/2-20-(n%3)*13,y-h/2+40+n*12,'#a7b9b7',2);}
function stapler(){ctx.save();ctx.translate(tx,ty);ctx.rotate(-.17);shadow(0,17,43,10);round(-45,9,91,12,5,'#233c49','#8ca4a9');round(-35,4,69,8,2,'#b6c4ba');ctx.save();ctx.translate(-39,6);ctx.rotate(-.28*(1-press));round(0,-19,83,22,7,grad(0,-19,80,24,'#c69e8c','#925f5d'),'#d2b7a4');line(16,-15,67,-15,'#e1c2ab',3);ctx.restore();ellipse(-35,5,4,4,'#c7c4ae');ctx.restore();}
return{draw(){desk('#31434b');for(let n=3;n>=0;n--)paper(181+n*3,155+n*3,190,133,false);if(phase===0||drag==='paper')paper(sx,sy,173,126,true);else paper(sx,sy,123,143,true);if(phase===2){line(250,210,263,210,'#536d78',3);line(251,209,264,209,'#eef1d9',1);line(250,210,250,214,'#8fa5a6',2);line(264,209,264,213,'#8fa5a6',2);}stapler();},down(p){if(done)return;if(phase===0&&hit(p,sx,sy,175,125))drag='paper';else if(phase===1&&near(p,tx,ty,58))drag='tool';},move(p){if(drag==='paper'){sx=p.x;sy=p.y;}else if(drag==='tool'){tx=p.x;ty=p.y;}},up(p){if(drag==='paper'){if(p.x>320){sx=383;sy=160;phase=1;}else{sx=195;sy=153;}}else if(drag==='tool'){if(near(p,261,207,35)){tx=254;ty=197;phase=2;clock=0;api.tone(320,.08);}else{tx=369;ty=66;}}drag=null;},cancel(){if(drag===null)return;if(drag==='paper'){sx=195;sy=153;}else{tx=369;ty=66;}drag=null;},update(dt){time+=dt;if(phase===2){clock+=dt;press=clock<.3?clock/.3:Math.max(0,1-(clock-.3)/.4);if(clock>.7){tx+=(335-tx)*Math.min(1,dt*10);ty+=(58-ty)*Math.min(1,dt*10);}if(clock>1.1)finish();}},debug(){return{phase,press,separate:phase>0,done};}};

}});
})();
