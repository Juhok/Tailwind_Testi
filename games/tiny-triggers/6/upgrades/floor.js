(()=>{
"use strict";
TinyV6.register(66,{"id": "floor", "title": "Final footsteps", "description": "Floor cleaning: mop the floor, then walk across the wet area.", "hint": "Mop the whole patch \u2192 Walk across the wet floor", "verdict": "Signed by the cleaner.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
const zones=[[173,116],[244,116],[315,116],[173,181],[244,181],[315,181]];let clean=new Set(),mx=74,my=202,fx=62,fy=69,prints=[],last=null,settle=0;
function print(x,y,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);round(-8,-17,16,23,7,'#75634caa');round(-7,9,14,10,3,'#75634caa');for(let k=0;k<3;k++)line(-5,-11+k*6,5,-11+k*6,'#b0a37c55',2);ctx.restore();}
function shoes(){for(let i=0;i<2;i++){ctx.save();ctx.translate(fx+i*22,fy+i*8);ctx.rotate(.22);shadow(2,11,12,23);round(-9,-22,20,47,9,'#223641','#92a4a3');round(-6,-18,15,33,7,'#526f7c');for(let k=0;k<4;k++)line(-5,-4+k*4,6,-7+k*4,'#d1d3bd',1);ctx.restore();}}
function mop(){line(mx,my-7,mx+43,my-108,'#b0bcb5',7);line(mx+1,my-9,mx+45,my-107,'#dce0cb',2);round(mx+37,my-123,15,37,5,'#567c89');round(mx-34,my-9,70,18,4,'#719ba3');for(let k=0;k<15;k++)curve([[mx-31+k*4,my+3],[mx-40+k*4,my+12],[mx-25+k*4,my+20],[mx-35+k*5,my+23]],'#bdc9b7',3);}
return{draw(){rect(0,0,480,270,'#57666b');for(let r=0;r<4;r++)for(let c=0;c<6;c++){rect(c*82+2,r*70+2,79,67,(r+c)%2?'#667477':'#5f7075');line(c*82+6,r*70+6,c*82+76,r*70+6,'#b2b6a11c',1);}zones.forEach(([x,y],i)=>{if(clean.has(i)){ellipse(x,y,42,37,'#8bb4b34a');line(x-25,y-12,x+24,y-15,'#d5ddd13b',2);line(x-22,y+12,x+18,y+11,'#d5ddd128',1);}else for(let j=0;j<5;j++)ellipse(x-19+j*9,y+Math.sin(j*2)*11,5,2,'#887451');});prints.forEach((p,i)=>print(p.x,p.y,i%2?.22:-.12));shoes();mop();},down(p){if(done)return;if(phase===0&&near(p,mx,my,48))drag='mop';else if(phase===1&&near(p,fx,fy,45)){drag='walk';last=p;}},move(p){if(drag==='mop'){mx=p.x;my=p.y;zones.forEach(([x,y],i)=>{if(near(p,x,y,39))clean.add(i);});}else if(drag==='walk'){fx=p.x;fy=p.y;if(last&&Math.hypot(p.x-last.x,p.y-last.y)>22&&p.x>137&&p.x<359&&p.y>80&&p.y<222){if(prints.length<16)prints.push({x:p.x+(prints.length%2?8:-8),y:p.y});last=p;}}},up(p){if(drag==='mop'&&clean.size===6){phase=1;mx=73;my=220;api.tone(440,.1);}else if(drag==='walk'){if(prints.length>=4&&p.x>350){phase=2;}else{fx=62;fy=69;}}drag=null;},cancel(){if(drag===null)return;if(drag==='mop'){mx=74;my=202;}else{fx=62;fy=69;}drag=null;},update(dt){time+=dt;if(phase===2){settle+=dt;if(settle>.4)finish();}},debug(){return{phase,cleaned:clean.size,prints:prints.length,done};}};

}});
})();
