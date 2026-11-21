(()=>{
"use strict";
TinyV6.register(18,{"id": "butter", "title": "Excavation rights", "description": "Butter: dig a hole in the middle instead of shaving off an even slice.", "hint": "Dig into the middle", "verdict": "A butter quarry. How practical.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let kx=362,ky=100,amount=0,target=0,contact=false,settle=0;
function knife(){ctx.save();ctx.translate(kx,ky);ctx.rotate(-.5+amount*.65);shadow(26,11,70,9);round(20,-8,85,16,7,'#805c47','#ad8767');for(let x=40;x<95;x+=25)ellipse(x,0,2,2,'#c7c7aa');ctx.beginPath();ctx.moveTo(25,-8);ctx.lineTo(-42,-10);ctx.bezierCurveTo(-73,-10,-69,12,-40,13);ctx.lineTo(25,7);ctx.closePath();ctx.fillStyle=grad(-60,-10,70,20,'#edf0e5','#8faaaa');ctx.fill();line(-45,-7,16,-6,'#fff8dd',2);if(amount>.05){ellipse(-36,-9,24*amount,11*amount,'#f6d575');curve([[-51,-10],[-56,-28],[-19,-23],[-19,-9]],'#fff0ab',5*amount);}ctx.restore();}
return{draw(){desk('#30434a');shadow(226,213,139,18);round(80,71,285,145,26,'#6d8989');round(87,69,271,137,24,'#d4dfd4');round(101,83,244,106,17,'#8ca7a5');path([[129,103],[303,103],[320,175],[129,175]],'#c3a151');path([[129,103],[303,103],[286,77],[146,77]],'#fff0ad');round(125,95,185,69,7,grad(120,90,190,80,'#fce8a0','#e2bf62'));line(135,102,293,102,'#fff3b7',3);for(let i=0;i<6;i++)line(142+i*26,151,147+i*26,155,'#d4b25e',1);if(amount>.01){ellipse(220,126,35*amount,22*amount,'#ba9140');ellipse(219,131,29*amount,16*amount,'#d6ae51');curve([[189,123],[196,101],[247,104],[253,126]],'#fff1ae',4*amount);for(let n=0;n<6;n++)ellipse(190+n*12,153+Math.sin(n)*4,3*amount,2*amount,'#ffe497');}knife();},down(p){if(!done&&near(p,kx,ky,60))drag=p;},move(p){if(drag){kx=p.x;ky=p.y;if(near(p,240,127,42)){contact=true;}if(contact)target=clamp((p.y-121)/58,0,1);}},up(){if(drag&&contact&&target>.8){target=1;phase=1;kx=307;ky=96;api.tone(330,.1);}else if(!phase){target=0;contact=false;kx=362;ky=100;}drag=null;},cancel(){if(drag===null)return;drag=null;target=0;contact=false;kx=362;ky=100;},update(dt){time+=dt;amount+=(target-amount)*Math.min(1,dt*12);if(phase&&amount>.98){settle+=dt;if(settle>.5)finish();}},debug(){return{guide:{knife:[kx,ky]},phase,amount,contact,done};}};

}});
})();
