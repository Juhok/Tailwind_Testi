(()=>{
"use strict";
TinyV6.register(12,{"id": "legacy-12", "title": "Close enough", "description": "Try the last puzzle piece. Then leave it slightly misaligned.", "hint": "Drag the loose piece to the bottom-left gap. It almost fits.", "verdict": "It looked so promising.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let px=389,py=178,tx=389,ty=178,angle=0,wobble=0;
function piece(x,y){ctx.beginPath();ctx.moveTo(x-40,y-34);ctx.lineTo(x-13,y-34);ctx.bezierCurveTo(x-20,y-55,x+20,y-55,x+13,y-34);ctx.lineTo(x+40,y-34);ctx.lineTo(x+40,y-9);ctx.bezierCurveTo(x+59,y-16,x+59,y+18,x+40,y+11);ctx.lineTo(x+40,y+34);ctx.lineTo(x-40,y+34);ctx.closePath();}
function landscape(){rect(78,48,246,160,grad(80,50,0,150,'#668b9a','#d8b688'));ellipse(264,79,18,18,'#f5d6a0');path([[78,141],[135,69],[193,141],[236,87],[324,143],[324,174],[78,174]],'#526779');path([[111,99],[135,69],[158,100],[144,95],[137,101],[128,94]],'#e3e4d7');path([[218,109],[236,87],[259,109],[244,104],[238,111],[228,105]],'#dfe5d8');rect(78,145,246,63,'#6e9a9f');for(let i=0;i<8;i++)line(82+i*7,151+i*7,304-i*13,151+i*7,'#bad0bd',1);path([[78,160],[117,150],[160,172],[197,208],[78,208]],'#415e59');for(let n=0;n<7;n++){const x=83+n*12,y=169+n*3;line(x,y,x,y-25,'#2b4748',3);path([[x-8,y-6],[x,y-30],[x+8,y-6]],'#36534f');}}
return{draw(){desk('#3e4146');round(65,35,272,188,6,'#a9855c');round(71,41,260,176,4,'#d5bd8c');landscape();line(160,48,160,208,'#536672',1);line(242,48,242,208,'#536672',1);line(78,128,324,128,'#536672',1);for(const x of [160,242]){curve([[x,75],[x+18,69],[x+18,106],[x,100]],'#536672',1);curve([[x,155],[x-18,149],[x-18,187],[x,181]],'#536672',1);}piece(119,174);ctx.fillStyle='#273c43';ctx.fill();ctx.strokeStyle='#d5b883';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(px,py);ctx.rotate(angle);shadow(2,7,43,36);piece(0,0);ctx.fillStyle='#d2bc92';ctx.fill();ctx.save();ctx.clip();ctx.translate(-119,-174);landscape();ctx.restore();piece(0,0);ctx.strokeStyle='#e0cfaa';ctx.lineWidth=2;ctx.stroke();ctx.restore();},down(p){if(!done&&near(p,px,py,57)){drag=p;}},move(p){if(drag){px=tx=p.x;py=ty=p.y;}},up(p){if(!drag)return;if(near(p,119,174,58)){tx=128;ty=179;phase=1;wobble=1;api.tone(290,.13);}else{tx=389;ty=178;}drag=null;},cancel(){if(drag===null)return;drag=null;tx=389;ty=178;},update(dt){time+=dt;if(!drag){px+=(tx-px)*Math.min(1,dt*10);py+=(ty-py)*Math.min(1,dt*10);}if(phase){wobble=Math.max(0,wobble-dt);angle=.035+Math.sin(wobble*25)*wobble*.03;if(wobble===0&&Math.hypot(px-tx,py-ty)<1)finish();}},debug(){return{phase,px,py,done};}};

}});
})();
