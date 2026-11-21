(()=>{TinyV6.register(13,{"id":"legacy-13","title":"A sensible volume","description":"Set the volume to 49 or 51.","hint":"Drag near the middle to 49 or 51. The slider still skips zero and every multiple of five.","verdict":"A perfectly unreasonable volume.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let value=1,shown=1,pulse=0,finishTime=0;
function speaker(x){round(x,56,85,157,7,'#5b453c','#9c7d67');round(x+7,63,71,143,4,'#212b30');ellipse(x+42,90,14,14,'#516069');ellipse(x+42,90,7,7,'#1a242b');let beat=Math.sin(time*5)*value/100;ellipse(x+42,157,30+beat,34+beat,'#6e7775');ellipse(x+42,157,25+beat,29+beat,'#323d43');ellipse(x+42,157,12+beat,14+beat,'#7f8983');curve([x+18,142,x+18,128,x+30,126,x+37,126],'#b4b8a7',1);for(let n=0;n<6;n++)line(x+12,197-n*3,x+71,197-n*3,'#27353c',1)}
return {draw(){room();speaker(33);speaker(362);ellipse(240,234,110,10,'#12202b');round(137,72,205,153,9,'#7f969f','#b3c4c6');round(151,86,177,58,6,'#172932');text(Math.round(shown)+'%',240,111,28,'#b6d9bb');text('VOLUME',240,133,9,'#71989b');
 for(let n=0;n<20;n++){let h=3+(Math.sin(time*4+n*.6)+1)*9*value/100;rect(157+n*8,205-h,5,h,n<10?'#76b29d':'#cdb77d')}
 line(164,172,315,172,'#1e3544',8);for(let n=0;n<=10;n++)line(165+n*15,159,165+n*15,163,'#546f7d',1);line(240,154,240,162,'#e8c682',2);text('50',240,151,8,'#e9cb8c');let hx=165+value*1.5;metal(hx-8,163,16,22);line(hx-3,169,hx-3,179,'#435c6c',1);line(hx+3,169,hx+3,179,'#435c6c',1);
 if(pulse>0){ctx.globalAlpha=pulse;line(238,145,242,157,'#d78373',2);line(242,145,238,157,'#d78373',2);ctx.globalAlpha=1}
 text(phase===1?'So close to a round number.':'One notch either side of fifty.',240,27,11,'#b4c5c1');},
 down(p){if(!completed&&hit(p,240,173,180,44))drag={}},move(p){if(drag){let raw=clamp(Math.round((p.x-165)/1.5),1,99);if(raw%5===0){pulse=1;raw=raw===50?(p.x<240?49:51):raw+1}value=raw}},up(){drag=null;if(value===49||value===51){phase=1;finishTime=0}},cancel(){if(!drag)return;drag=null;value=1;phase=0},update(dt){time+=dt;pulse=Math.max(0,pulse-dt*2);shown=lerp(shown,value,Math.min(1,dt*14));if(phase===1){finishTime+=dt;if(finishTime>.5)done()}},debug(){return {guideComplete:completed,phase,value}}};
}});})();
