(()=>{TinyV6.register(37,{"id":"towel","title":"Beside the dotted line","description":"Paper towel: tear a sheet just beside the perforation.","hint":"Tear beside the perforation","verdict":"The dotted line was only a suggestion.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let tear=0,target=0,fall=0;
function sheet(x0,x1,offset=0){ctx.save();ctx.translate(offset,offset*.15);path([[x0,102],[x1,110],[x1,212],[x0,202]],'#e9eadb','#bdcabc');for(let yy=118;yy<199;yy+=17)for(let xx=x0+10;xx<x1-4;xx+=16){ellipse(xx,yy,1.5,2,'#ced5c6');ellipse(xx+4,yy+4,1,1,'#f8f5e4')}ctx.restore()}
return {draw(){room('kitchen');ellipse(154,233,67,11,'#16232b');metal(145,61,9,166);metal(112,222,76,10);let g=ctx.createLinearGradient(102,0,190,0);g.addColorStop(0,'#c0ccbc');g.addColorStop(.3,'#f5f1df');g.addColorStop(1,'#b6c3b3');round(102,79,88,133,6,g);ellipse(146,79,44,12,'#f7f0db');ellipse(146,79,15,6,'#b7a78a');ellipse(146,79,8,3,'#475b58');for(let n=0;n<5;n++)curve([104,88+n*25,130,97+n*25,164,96+n*25,185,87+n*25],'#d4dbc9',1);
 sheet(169,267);sheet(268,382,fall*35);for(let yy=115;yy<207;yy+=10)line(282+fall*35,yy+fall*5,282+fall*35,yy+5+fall*5,'#8faaa0',1);
 if(tear>0){let yy=102+tear*105;path([[266,102],[263,114],[268,125],[262,139],[267,153],[262,169],[266,184],[262,yy],[270+tear*20,yy+tear*8],[276+tear*12,106]],'#253b43');path([[270,104],[270+tear*44,96],[286+tear*44,132],[268,yy]],'#f9f4df','#c3d0bf');for(let n=0;n<7;n++){let yv=108+n*13;if(yv<yy)line(263,yv,270,yv+3,'#f7f1da',2)}}
 text(phase===1?'The perforation remains untouched.':'Tear just beside the dotted line.',240,27,11,'#c6cfbd');},
 down(p){if(!completed&&hit(p,266,111,50,45))drag={x:p.x,y:p.y}},move(p){if(drag){if(Math.abs(p.x-drag.x)<48)target=clamp((p.y-drag.y)/95,0,1)}},up(){if(!drag)return;drag=null;if(target>.88){target=1;phase=1}else target=0},cancel(){if(!drag)return;drag=null;target=0},update(dt){time+=dt;tear=lerp(tear,target,Math.min(1,dt*14));if(phase===1){fall=Math.min(1,fall+dt*1.6);if(fall>=1)done()}},debug(){return{guideComplete:completed,phase,tear,fall}}};
}});})();
