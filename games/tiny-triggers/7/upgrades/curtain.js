(()=>{TinyV6.register(64,{"id":"curtain","title":"Outside the tub","description":"Shower curtain: close it on the outside of the bathtub.","hint":"Pull the curtain outside the rim","verdict":"A shower for the whole bathroom.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let spread=0,target=0,outside=0,ot=0,settle=0;
return {draw(){room('bath');for(let xx=0;xx<480;xx+=60)line(xx,0,xx,211,'#3e5260',1);for(let yy=31;yy<212;yy+=45)line(0,yy,480,yy,'#3e5260',1);
 metal(72,38,343,7);metal(388,55,7,93);curve([392,66,389,48,369,48,363,65],'#bdd1cd',6);ellipse(362,70,17,6,'#c3d3cd');for(let n=0;n<5;n++){let yy=82+(time*37+n*14)%80;line(350+n*6,yy,348+n*6,yy+7,'#8bb8c1',1)}
 ellipse(252,171,160,30,'#d8e1cf');ellipse(252,167,145,21,'#65818b');path([[92,173],[106,216],[143,230],[359,230],[395,211],[411,173]],'#afc6be','#dde3d1');curve([114,183,148,210,350,216,391,183],'#d2dece',3);metal(133,225,12,13);metal(358,225,12,13);
 let width=61+spread*253,bottom=177+outside*62;path([[83,52],[83+width,52],[88+width,bottom],[76,bottom-3]],'#81a9a3','#b3c9b6');
 for(let n=0;n<11;n++){let xx=84+n*width/11;let g=ctx.createLinearGradient(xx,0,xx+width/11,0);g.addColorStop(0,'#406c6e55');g.addColorStop(.5,'#dae0bd18');g.addColorStop(1,'#3c666b66');path([[xx,55],[xx+width/11,55],[xx+width/11+5,bottom],[xx-5,bottom]],g);curve([xx+5,58,xx-4,111,xx+11,bottom-33,xx+2,bottom-4],'#cee0c040',1)}
 for(let n=0;n<9;n++){let xx=90+n*(width-14)/8;ctx.strokeStyle='#d4ddd0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(xx,47,4,9,0,0,Math.PI*2);ctx.stroke()}
 for(let yy=83;yy<bottom-10;yy+=35)for(let xx=98;xx<83+width-8;xx+=31){curve([xx,yy,xx-6,yy-8,xx+11,yy-14,xx+4,yy-19],'#c5d6b6',2)}
 if(phase===1){ellipse(260,248,90*settle,5,'#739aa4');for(let n=0;n<4;n++){let yy=bottom+(time*50+n*5)%13;ellipse(204+n*35,yy,1,3,'#a6c3c3')}}text(phase===1?'The bathroom gets a shower too.':'Pull it closed, outside the tub.',240,21,11,'#c5d0c0');},
 down(p){if(!completed&&hit(p,143,124,54,143))drag={x:p.x,y:p.y}},move(p){if(drag){target=clamp((p.x-drag.x)/235,0,1);ot=clamp((p.y-drag.y)/53,0,1)}},up(){if(!drag)return;drag=null;if(target>.88&&ot>.75){target=1;ot=1;phase=1}else{target=0;ot=0}},cancel(){if(!drag)return;drag=null;target=0;ot=0},update(dt){time+=dt;spread=lerp(spread,target,Math.min(1,dt*11));outside=lerp(outside,ot,Math.min(1,dt*11));if(phase===1){settle=Math.min(1,settle+dt*.9);if(settle===1)done()}},debug(){return{phase,spread,outside}}};
}});})();
