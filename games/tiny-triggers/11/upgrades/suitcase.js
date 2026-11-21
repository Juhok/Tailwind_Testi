(()=>{
"use strict";
TinyV6.register(72,{"id": "suitcase", "title": "Sleeve included outside", "description": "Suitcase: close it with a shirt sleeve hanging outside.", "hint": "Leave a sleeve hanging out \u2192 Close over the sleeve", "verdict": "Your luggage is waving goodbye.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let cuffX=285,cuffY=166,fold=0,ft=0,settle=0;
function sleeve(){path([[249,149],[280,147],[cuffX+11,cuffY-13],[cuffX+15,cuffY+17],[277,187],[248,176]],'#8aaeb7','#bfd3ce');line(270,156,cuffX+9,cuffY-8,'#c6d7cf',2);line(cuffX-2,cuffY-12,cuffX+4,cuffY+15,'#527e92',3);ellipse(cuffX+7,cuffY+6,2,2,'#e0e0be');}
function lid(){const y=33+fold*204;path([[121,y],[359,y],[364,135],[116,135]],fold<.5?grad(120,30,0,110,'#66828d','#3c596a'):grad(120,140,240,90,'#7c8e99','#435b70'),'#a9b4b0',3);if(fold<.48){const h=135-y;path([[134,y+10],[346,y+10],[350,126],[130,126]],'#344c60','#7f989d');for(let i=0;i<8;i++)line(138+i*27,y+14,138+i*27,124,'#aec1b519',1);line(133,y+h*.6,349,y+h*.6,'#98aaa6',2);}else if(fold>.55){for(let i=0;i<5;i++){const xx=151+i*43;line(xx,146,xx,y-10,'#a1b0ac',4);line(xx+4,146,xx+4,y-10,'#3b5368',2);}round(211,y-4,58,13,5,'#273c4d','#a2b2af');}line(120,135,360,135,'#d2c5a2',2);}
return{draw(){desk('#303d48');shadow(240,248,138,15);round(111,128,258,117,15,'#334c61','#96a7a8');round(122,138,236,94,10,'#263e50');round(133,150,86,64,7,'#c6b99a');for(let i=0;i<4;i++)line(138,159+i*12,211,159+i*12,'#a18e74',1);round(218,147,112,71,5,'#7c9fa8');line(247,149,243,218,'#507d91',2);for(let i=0;i<4;i++)ellipse(245,157+i*16,1.5,1.5,'#d9ddd0');sleeve();path([[124,229],[356,229],[356,236],[124,236]],'#a89a7d');lid();round(110,219,14,23,4,'#213849');round(356,219,14,23,4,'#213849');},down(p){if(done)return;if(phase===0&&near(p,cuffX,cuffY,38))drag='sleeve';else if(phase===1&&hit(p,240,65,220,75))drag='lid';},move(p){if(drag==='sleeve'){cuffX=clamp(p.x,270,398);cuffY=clamp(p.y,145,206);}else if(drag==='lid')ft=clamp((p.y-55)/142,0,1);},up(){if(drag==='sleeve'){if(cuffX>365){cuffX=382;cuffY=184;phase=1;}else{cuffX=285;cuffY=166;}}else if(drag==='lid'){if(ft>.8){ft=1;phase=2;api.tone(260,.12);}else ft=0;}drag=null;},cancel(){if(drag===null)return;if(drag==='sleeve'){cuffX=285;cuffY=166;}else ft=0;drag=null;},update(dt){time+=dt;fold+=(ft-fold)*Math.min(1,dt*10);if(phase===2&&fold>.985){settle+=dt;if(settle>.4)finish();}},debug(){return{guide:{cuff:[cuffX,cuffY]},phase,fold,cuffX,done};}};

}});
})();
