(()=>{
"use strict";
TinyV6.register(21,{"id": "usb", "title": "Third time never", "description": "USB connector: try it upside down, flip it, then try it the wrong way again.", "hint": "Try the connector \u2192 Flip it over \u2192 Try again", "verdict": "Both sides were wrong. Obviously.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let x=332,y=141,tx=x,rotation=0,rt=0,recoil=0,flash=0,sy=0;
function plug(){curve([[x+51,y],[x+100,y+8],[397,246],[478,232]],'#14262e',12);curve([[x+51,y-2],[x+100,y+6],[397,244],[478,230]],'#6b8388',4);ctx.save();ctx.translate(x,y);ctx.scale(1,Math.cos(rotation));round(-18,-22,79,44,8,grad(-20,-24,75,50,'#56727b','#263d49'),'#79969b');line(42,-17,42,17,'#18333e',2);for(let k=0;k<3;k++)line(49+k*4,-13,49+k*4,13,'#839292',1);// The sleeve runs left from the handle. The dark USB aperture is on
// its narrow leading END face, never drawn across the long metal side.
path([[-59,-19],[-16,-17],[-16,17],[-59,20]],grad(-60,-20,45,40,'#e5ebe5','#829b9e'),'#d2dfda');
path([[-70,-14],[-59,-19],[-59,20],[-70,14]],'#cbd9d4','#e5eeea',1.5);
path([[-67,-10],[-61,-13],[-61,14],[-67,10]],'#172f3b');
path([[-67,4],[-61,5],[-61,12],[-67,9]],'#b3c5c2');
for(let k=0;k<3;k++)line(-66,5+k*2,-62,6+k*2,'#d4b575',1);
line(-55,-15,-22,-13,'#f6f6e9',2);
line(-10,-8,15,-8,'#9fbdbb',2);line(2,-14,2,4,'#9fbdbb',2);ellipse(2,7,3,3,'#9fbdbb');ctx.restore();}
return{draw(){desk('#293b48');shadow(129,230,86,13);round(55,35,121,190,13,grad(55,40,120,190,'#647d88','#273e4d'),'#8fa1a4');round(66,45,98,170,9,'#3d5462');for(let n=0;n<6;n++)line(77,63+n*7,152,63+n*7,'#203845',2);round(126,116,51,49,5,'#122733','#84969b');rect(136,129,34,25,'#060f19');rect(137,142,29,8,'#53656a');for(let n=0;n<4;n++)rect(140+n*7,143,3,5,'#d3b876');ellipse(89,188,4,4,'#91b9a8');plug();if(flash>0)for(let n=-1;n<=1;n++)line(182,122+n*20,191,118+n*23,'#e4ae74',2);if(phase===1)text('Turn the connector over',330,79,11,'#cddbd4');},down(p){if(near(p,x,y,63)&&recoil===0&&!done){drag=p;sy=p.y;}},move(p){if(!drag)return;if(phase===1&&Math.abs(p.y-sy)>18){rt=clamp(Math.abs(p.y-sy)/65,0,1)*Math.PI;}else{x=clamp(p.x,229,369);y=clamp(p.y,114,164);}},up(p){if(!drag)return;if(phase===1&&rt>2.5){rt=Math.PI;phase=2;x=332;y=141;api.tone(470,.1);}else if((phase===0||phase===2)&&x<250&&Math.abs(y-141)<25){phase=phase===0?1:3;recoil=1;flash=.8;tx=332;api.tone(170,.1);}else{tx=332;rt=phase>=2?Math.PI:0;}drag=null;},cancel(){if(drag===null)return;drag=null;x=tx=332;y=141;rt=phase>=2?Math.PI:0;},update(dt){time+=dt;rotation+=(rt-rotation)*Math.min(1,dt*14);if(!drag){x+=(tx-x)*Math.min(1,dt*14);y+=(141-y)*Math.min(1,dt*14);}recoil=Math.max(0,recoil-dt*1.5);flash=Math.max(0,flash-dt);if(phase===3&&recoil===0)finish();},guidance(){if(done)return null;if(recoil>0||phase===3)return{kind:'wait',label:'The connector will not fit'};return phase===1?{kind:'drag',from:[x,y],to:[x,y-70],label:'Turn the connector over'}:{kind:'drag',from:[x,y],to:[229,141],label:'Slide the metal end into the socket'};},debug(){return{phase,rotation,recoil,done,position:[x,y]};}};

}});
})();
