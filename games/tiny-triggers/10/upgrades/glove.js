(()=>{
"use strict";
TinyV6.register(69,{"id": "glove", "title": "Missing little finger", "description": "Glove: push its little finger inside the rest of the glove.", "hint": "Tuck the little finger inside", "verdict": "Four fingers ready. One hiding.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let tuck=0,tt=0,settle=0;
function knit(){shadow(240,231,89,17);for(const f of [[194,65,24,109],[225,42,25,132],[257,53,25,121]]){round(...f,12,grad(f[0],f[1],25,110,'#cbb17b','#998054'),'#dfc28a');line(f[0]+7,f[1]+16,f[0]+7,f[1]+83,'#e1c79055',1);}ctx.save();ctx.translate(177,148);ctx.rotate(-.6);round(-18,-46,29,80,14,'#b79d6c','#d4ba82');line(-8,-34,-8,17,'#e0c78d',1);ctx.restore();const py=91+tuck*57,px=294-tuck*10;round(px-8,py,26,77-tuck*52,12,grad(px,py,25,80,'#c8ad76','#9e8459'),'#d9bb84');round(182,128,119,101,27,grad(180,120,125,110,'#c6ab75','#a08859'),'#d0b57b');round(189,214,105,30,4,'#8a7854','#bdab77');for(let x=195;x<292;x+=8)line(x,217,x,241,'#d2ba80',2);for(let y=144;y<207;y+=11)for(let x=196;x<289;x+=13){line(x,y,x+4,y+3,'#ead29b40',1);line(x+4,y+3,x+8,y,'#ead29b40',1);}curve([[200,128],[207,151],[205,177],[199,195]],'#8c744e',1);curve([[273,130],[269,159],[279,173],[274,199]],'#8c744e',1);if(tuck>.1){ellipse(287,145,11,8*tuck,'#5e593f');curve([[277,145],[279,135],[298,135],[298,145]],'#e0c187',4);path([[279,148],[285,157],[290,147]],'#8c7e57');}}
return{draw(){desk('#33424d');round(75,28,329,225,18,'#425766','#70838a');for(let x=83;x<399;x+=9)line(x,36,x,246,'#9ea7a414',1);knit();},down(p){if(!done&&near(p,306,113,30))drag=p;},move(p){if(drag)tt=clamp((p.y-113)/59,0,1);},up(){if(drag&&tt>.8){tt=1;phase=1;api.tone(350,.1);}else tt=0;drag=null;},cancel(){if(drag===null)return;drag=null;tt=0;},update(dt){time+=dt;tuck+=(tt-tuck)*Math.min(1,dt*12);if(phase&&tuck>.985){settle+=dt;if(settle>.4)finish();}},debug(){return{phase,tuck,done};}};

}});
})();
