(()=>{
"use strict";
TinyV6.register(39,{"id": "laundry", "title": "One sleeve short", "description": "Laundry: turn one shirt sleeve inside out just before folding.", "hint": "Pull the sleeve inside \u2192 Fold with the sleeve still inside", "verdict": "A small surprise for tomorrow.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let tuck=0,tt=0,fold=0,ft=0,settle=0;
const lerp=(a,b,t)=>a+(b-a)*t;
function shirt(){const left=lerp(129,179,fold),right=lerp(351-tuck*63,301,fold),bottom=lerp(223,181,fold);shadow(241,230-fold*40,100-fold*26,14);path([[190,64],[217,73],[264,73],[290,64],[right,97],[right-11,133],[292,115],[301,bottom],[177,bottom],[182,114],[left+14,137],[left,101]],grad(150,60,160,160,'#92b9b8','#4b8090'),'#b3cfbf');curve([[215,72],[218,93],[261,94],[266,72]],'#345f73',8);curve([[218,72],[222,86],[259,86],[262,72]],'#b7d0c3',3);line(188,119,185,bottom-10,'#346276',1);line(289,121,295,bottom-10,'#346276',1);line(183,bottom-8,295,bottom-8,'#accabd',2);if(fold<.9){line(left+5,107,left+18,130,'#b6d0c3',3);if(tuck>0){ellipse(right-12,114,10+tuck*6,16,'#315c6c');ellipse(right-10,113,8,12,'#6f9e9e');curve([[right-18,99],[right-45,123],[274,137],[276,159]],'#c3d4c5',3);}}if(fold>0){path([[179,181],[301,181],[295,181-fold*53],[185,181-fold*53]],'#79a7ab','#b0ccbf',2);curve([[186,176],[223,169],[257,182],[295,173]],'#5c8e99',2);}for(let n=0;n<3;n++)curve([[202+n*25,105],[197+n*25,132],[210+n*24,159],[204+n*24,177-fold*20]],'#476e8025',1);}
return{draw(){desk('#38434d');round(66,24,351,227,18,'#465660','#68787a');for(let n=0;n<14;n++)line(80+n*24,30,80+n*24,244,'#a4ada416',1);shirt();},down(p){if(done)return;if(phase===0&&near(p,336,112,35))drag='sleeve';else if(phase===1&&near(p,239,212,58))drag='fold';},move(p){if(drag==='sleeve')tt=clamp((336-p.x)/83,0,1);else if(drag==='fold')ft=clamp((212-p.y)/89,0,1);},up(){if(drag==='sleeve'){if(tt>.8){tt=1;phase=1;api.tone(430,.1);}else tt=0;}else if(drag==='fold'){if(ft>.8){ft=1;phase=2;}else ft=0;}drag=null;},cancel(){if(drag===null)return;drag=null;if(!phase)tt=0;else ft=0;},update(dt){time+=dt;tuck+=(tt-tuck)*Math.min(1,dt*14);fold+=(ft-fold)*Math.min(1,dt*14);if(phase===2&&fold>.985){settle+=dt;if(settle>.3)finish();}},debug(){return{phase,tuck,fold,done};}};

}});
})();
