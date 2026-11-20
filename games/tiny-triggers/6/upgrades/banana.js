(()=>{
"use strict";
TinyV6.register(0,{"id": "banana", "title": "Peel by peel", "description": "Peel the banana upward from its blossom end, leaving the stem alone.", "hint": "Pull the dark bottom tip up toward the stem", "verdict": "One long peel. The other end.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let peel=0,target=0,settle=0;
function banana(){
 shadow(248,224,102,17);
 ctx.beginPath();ctx.moveTo(289,50);ctx.bezierCurveTo(295,126,245,207,168,209);ctx.bezierCurveTo(213,235,313,202,322,113);ctx.bezierCurveTo(326,84,307,60,289,50);ctx.fillStyle=grad(176,72,130,150,'#ffe99a','#d8a62f');ctx.fill();ctx.strokeStyle='#ae8229';ctx.lineWidth=3;ctx.stroke();
 curve([[295,65],[309,137],[259,204],[181,212]],'#fff2ad',5);
 for(let n=1;n<11;n++){const u=n/12,v=1-u;ellipse(174*v*v*v+3*250*v*v*u+3*311*v*u*u+304*u*u*u,208*v*v*v+3*215*v*v*u+3*143*v*u*u+70*u*u*u,1.2,1.8,'#b48b37');}
 path([[285,56],[280,31],[294,26],[305,58]],'#93723b','#645031');line(285,33,292,52,'#c7a468',3);
 // Cream flesh is exposed progressively along the inner banana curve.
 if(peel>.02){ctx.save();ctx.beginPath();ctx.rect(110,220-peel*175,240,190);ctx.clip();curve([[174,208],[241,207],[292,153],[296,73]],'#f7ebbb',24);curve([[176,203],[234,196],[282,146],[292,79]],'#fff6d1',7);ctx.restore();}
 const x=169+peel*7,y=210-peel*160;
 if(peel>.01){curve([[173,209],[123-peel*25,209-peel*95],[111,163-peel*72],[x,y]],'#b58b2e',23);curve([[172,206],[125-peel*25,205-peel*95],[111,160-peel*72],[x,y]],'#ffe27a',17);curve([[172,203],[128-peel*25,203-peel*95],[115,158-peel*72],[x,y]],'#fff1aa',4);}
 ellipse(x,y,10,7,'#6c4a2e');line(x-6,y-3,x+4,y-2,'#927148',2);
 if(!done){ellipse(x,y,16+Math.sin(time*3)*2,12,'#f6dfa51a');}
}
return{draw(){desk('#263d40');round(87,28,284,214,19,'#1f3035','#425857');line(110,232,351,232,'#64736a',2);banana();},down(p){if(near(p,169+peel*7,210-peel*160,30)){drag=p;target=peel;}},move(p){if(drag)target=clamp((210-p.y)/160,0,1);},up(){if(drag&&target>.88){target=1;phase=1;api.tone(480,.12);}else target=0;drag=null;},cancel(){if(drag===null)return;drag=null;target=0;},update(dt){time+=dt;peel+=(target-peel)*Math.min(1,dt*14);if(phase===1&&peel>.985){settle+=dt;if(settle>.35)finish();}},debug(){return{phase,peel,done};}};

}});
})();
