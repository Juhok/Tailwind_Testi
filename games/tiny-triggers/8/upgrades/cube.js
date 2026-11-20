(()=>{
"use strict";
TinyV6.register(81,{"id": "cube", "title": "One last turn", "description": "Rubik\u2019s cube: solve it, then turn one face once.", "hint": "Finish the solve \u2192 Now turn one face again", "verdict": "Solved, in the past tense.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let angle=0,target=0,anim=false,rest=0,startX=0;
const project=([x,y,z])=>[240+(x-z)*52,151+(x+z)*26-y*55];
function rotate(p,a){return[p[0]*Math.cos(a)+p[2]*Math.sin(a),p[1],p[2]*Math.cos(a)-p[0]*Math.sin(a)];}
function faces(){const tiles=[];const colors=['#699daa','#d69561','#b56a72','#8cae79'];for(let side=0;side<4;side++)for(let row=0;row<3;row++)for(let col=0;col<3;col++){const a=row===0?angle:0,lo=-1+col*2/3,hi=lo+2/3,top=1-row*2/3,bot=top-2/3;let coords,normal;if(side===0){coords=[[lo,top,1],[hi,top,1],[hi,bot,1],[lo,bot,1]];normal=[0,0,1];}else if(side===1){coords=[[1,top,hi],[1,top,lo],[1,bot,lo],[1,bot,hi]];normal=[1,0,0];}else if(side===2){coords=[[hi,top,-1],[lo,top,-1],[lo,bot,-1],[hi,bot,-1]];normal=[0,0,-1];}else{coords=[[-1,top,lo],[-1,top,hi],[-1,bot,hi],[-1,bot,lo]];normal=[-1,0,0];}normal=rotate(normal,a);if(normal[0]+normal[2]<.01)continue;coords=coords.map(p=>rotate(p,a));let color=colors[side];if(row===0&&phase!==1)color=colors[(side+1)%4];tiles.push({coords,color,depth:coords.reduce((s,p)=>s+p[0]+p[2],0)});}
for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=-1+c*2/3,z=-1+r*2/3;const coords=[[x,1,z],[x+2/3,1,z],[x+2/3,1,z+2/3],[x,1,z+2/3]].map(p=>rotate(p,angle));tiles.push({coords,color:'#e3c879',depth:100});}tiles.sort((a,b)=>a.depth-b.depth);tiles.forEach(t=>{const pp=t.coords.map(project);path(pp,'#213541','#102a35',2);const mx=pp.reduce((s,p)=>s+p[0],0)/4,my=pp.reduce((s,p)=>s+p[1],0)/4;path(pp.map(p=>[mx+(p[0]-mx)*.89,my+(p[1]-my)*.89]),t.color);line(pp[0][0]+2,pp[0][1]+3,pp[1][0]-2,pp[1][1]+3,'#e5e4c633',1);});}
return{draw(){desk('#2c414c');round(68,219,344,17,8,'#1d323e');shadow(240,228,113,16);faces();if(phase===1&&!anim)text('Solved.',240,32,12,'#cbd7bd');},down(p){if(!done&&!anim&&hit(p,239,103,240,95)){drag=p;startX=p.x;}},move(p){if(drag)angle=clamp(Math.abs(p.x-startX)/85,0,1)*Math.PI/2;},up(){if(!drag)return;if(angle>1.2){target=Math.PI/2;anim=true;api.tone(440+phase*90,.1);}else target=0;drag=null;},cancel(){if(drag===null)return;drag=null;target=0;},update(dt){time+=dt;if(!drag)angle+=(target-angle)*Math.min(1,dt*12);if(anim&&Math.abs(angle-Math.PI/2)<.005){angle=target=0;anim=false;phase++;if(phase===2)rest=.01;}if(rest>0){rest+=dt;if(rest>.5)finish();}},debug(){return{phase,angle,anim,solved:phase===1,done};}};

}});
})();
