(()=>{
"use strict";
TinyV6.register(78,{"id": "cards", "title": "One face up", "description": "Card deck: shuffle one face-up card among the face-down cards.", "hint": "Turn one card face up \u2192 Slide it into the deck", "verdict": "A very small spoiler.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let x=352,y=142,flip=0,ft=0,shuffle=0,sy=0,sx=0;
function heart(x,y,s){ctx.beginPath();ctx.moveTo(x,y+s*.8);ctx.bezierCurveTo(x-s*1.4,y-s*.2,x-s*.8,y-s,x,y-s*.35);ctx.bezierCurveTo(x+s*.8,y-s,x+s*1.4,y-s*.2,x,y+s*.8);ctx.fillStyle='#b5666a';ctx.fill();}
function card(x,y,a,face,scale=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.scale(scale,1);shadow(3,57,38,7);round(-37,-53,74,106,5,'#e1dec9','#a9b8ae');if(face){text('A',-24,-32,16,'#aa555d');text('A',24,44,16,'#aa555d');heart(0,0,19);heart(-24,-19,6);heart(24,25,6);}else{round(-31,-47,62,94,3,'#547887','#93aba7');for(let row=0;row<7;row++)for(let col=0;col<4;col++){const xx=-24+col*16,yy=-38+row*13;path([[xx,yy-4],[xx+5,yy],[xx,yy+4],[xx-5,yy]],'#a3bbb1');}round(-25,-40,50,80,2,null,'#c3d0b7');}ctx.restore();}
return{draw(){desk('#2a4449');round(41,30,398,215,20,'#345a5d','#698682');for(let i=5;i>=0;i--)card(150+i*2+shuffle*(i-2)*30,144+i*.7,shuffle*(i-2)*.08,false);if(phase<2)card(x,y,0,flip>Math.PI/2,Math.max(.06,Math.abs(Math.cos(flip))));else{card(150+shuffle*17,143,-shuffle*.08,true);card(150+shuffle*75,146,shuffle*.13,false);}line(63,226,417,226,'#859781',1);},down(p){if(done)return;if(near(p,x,y,66)){drag=p;sx=p.x;}},move(p){if(!drag)return;if(phase===0)ft=clamp((sx-p.x)/65,0,1)*Math.PI;else{x=p.x;y=p.y;}},up(p){if(!drag)return;if(phase===0){if(ft>2.5){ft=Math.PI;phase=1;api.tone(430,.08);}else ft=0;}else if(phase===1){if(near(p,160,144,57)){phase=2;}else{x=352;y=142;}}drag=null;},cancel(){if(drag===null)return;drag=null;if(!phase)ft=0;else{x=352;y=142;}},update(dt){time+=dt;flip+=(ft-flip)*Math.min(1,dt*14);if(phase===2){shuffle=Math.min(1,shuffle+dt*1.1);if(shuffle===1)finish();}},debug(){return{phase,flip,shuffle,done};}};

}});
})();
