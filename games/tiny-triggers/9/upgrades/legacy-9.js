(()=>{
"use strict";
TinyV6.register(9,{"id": "legacy-9", "title": "One small renovation", "description": "Turn just the center floor tile a quarter turn.", "hint": "Pull its top-right corner down to rotate the tile.", "verdict": "Now you will always notice it.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let angle=0,target=0,lift=0;
function tile(x,y,a,moving){ctx.save();ctx.translate(x,y-moving*5);ctx.rotate(a);shadow(3,7,38,36);round(-36,-36,72,72,3,grad(-36,-36,72,72,'#e4ddd0','#b1b7b1'),'#798b89');round(-31,-31,62,62,2,'#b8c4bd');ctx.save();ctx.beginPath();ctx.rect(-30,-30,60,60);ctx.clip();curve([[-42,25],[-16,27],[-20,-24],[32,-27]],'#436e76',17);curve([[-42,25],[-16,27],[-20,-24],[32,-27]],'#d8e0c8',5);path([[-14,25],[-3,9],[9,22],[20,29]],'#698f86');for(let i=0;i<3;i++)ellipse(17+i*5,-3+i*8,2.4,2.4,'#b78650');ctx.restore();line(-31,-32,29,-32,'#faf2d8',2);line(-32,-30,-32,28,'#d7e2d8',1);ctx.restore();}
return{draw(){desk('#243a3e');round(99,2,280,264,7,'#3e514e');for(let r=0;r<3;r++)for(let c=0;c<3;c++)if(r!==1||c!==1)tile(159+c*80,53+r*80,0,0);tile(239,133,angle,lift);if(!done){ellipse(272,99,5,5,'#d8b676');ellipse(272,99,11,11,'#e7c77c18');}for(let i=0;i<8;i++){ellipse(84+i*2,224+(i%3)*4,1,1,'#a29c7c');}},down(p){if(near(p,239,133,55)&&!done){drag=p;lift=1;}},move(p){if(drag)target=clamp((p.y-drag.y)/77,0,1)*Math.PI/2;},up(){if(drag&&target>1.15){target=Math.PI/2;phase=1;api.tone(360,.1);}else target=0;drag=null;},cancel(){if(drag===null)return;drag=null;target=0;},update(dt){time+=dt;angle+=(target-angle)*Math.min(1,dt*12);lift+=(Number(!!drag)-lift)*Math.min(1,dt*10);if(phase===1&&Math.abs(angle-Math.PI/2)<.005&&lift<.02)finish();},debug(){return{phase,angle,lift,done};}};

}});
})();
