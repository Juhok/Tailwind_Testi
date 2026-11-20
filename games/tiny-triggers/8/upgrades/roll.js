(()=>{TinyV6.register(1,{"id":"roll","title":"Against the wall","description":"Turn the roll so its loose end hangs behind it, then hang it.","hint":"Turn the roll: paper behind, not in front \u2192 Hang the roll with the paper at the wall","verdict":"Under. Not over. You have chosen a side.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let x=128,y=136,turn=0,targetTurn=0,settle=0;
function roll(cx,cy){
 const back=turn>.5, paperX=cx-36+turn*6;
 if(back){path([[paperX,cy-22],[paperX+49,cy-26],[paperX+49,cy+70],[paperX+42,cy+78],[paperX+7,cy+73],[paperX,cy+79]],'#d1d4ca','#a2aaa5');for(let k=0;k<3;k++)line(paperX+3,cy+10+k*23,paperX+46,cy+12+k*23,'#aeb5ac',1);}
 let g=ctx.createLinearGradient(cx-44,cy-36,cx+24,cy+37);g.addColorStop(0,'#fff8df');g.addColorStop(.5,'#e6e5d6');g.addColorStop(1,'#a9b2aa');
 round(cx-42,cy-36,75,73,8,g);ellipse(cx+33,cy,22,36,'#f1eddd');ellipse(cx+33,cy,16,29,'#d0d2c6');ellipse(cx+33,cy,8,15,'#847867');ellipse(cx+33,cy,4,10,'#343a3a');
 for(let n=0;n<5;n++)curve([cx-37,cy-26+n*12,cx-20,cy-31+n*12,cx+5,cy-28+n*12,cx+24,cy-24+n*12],'#c8cbbf',1);
 if(!back){let lift=turn*125;path([[cx-40,cy-2],[cx+10,cy+1],[cx+12,cy+78-lift],[cx+3,cy+74-lift],[cx-4,cy+79-lift],[cx-40,cy+74-lift]],'#fff9e9','#c8cec4');line(cx-35,cy+42-lift*.6,cx+7,cy+44-lift*.6,'#b7bfb3',1);}
}
return {draw(){room('bath');for(let xx=0;xx<480;xx+=80){line(xx,0,xx,208,'#425260',1)}for(let yy=35;yy<210;yy+=58)line(0,yy,480,yy,'#425260',1);
 ellipse(337,219,79,11,'#16212b');metal(302,76,18,58);metal(399,76,18,58);ellipse(311,92,5,8,'#3c5664');ellipse(408,92,5,8,'#3c5664');metal(304,105,101,11);
 if(phase<2){ellipse(129,226,65,10,'#131f29');roll(x,y);}else roll(351,115+Math.sin(settle*20)*Math.exp(-settle*5)*3);
 if(phase===0)text('Turn the loose end toward the wall',235,25,10,'#a6b9bb');else if(phase===1)text('Hang it on the holder',235,25,10,'#a6b9bb');},
 down(p){if(completed)return;if(phase===0&&hit(p,x-12,y+38,110,122))drag={kind:'turn',start:p};else if(phase===1&&near(p,x,y,75))drag={kind:'hang',ox:x-p.x,oy:y-p.y};},
 move(p){if(!drag)return;if(drag.kind==='turn'){targetTurn=clamp((drag.start.y-p.y)/83,0,1)}else{x=clamp(p.x+drag.ox,50,430);y=clamp(p.y+drag.oy,65,211)}},
 up(){if(!drag)return;if(drag.kind==='turn'){if(targetTurn>.8){phase=1;targetTurn=1;api.tone(480)}else targetTurn=0;}else if(near({x,y},351,115,52)){phase=2;settle=0}else{x=128;y=136}drag=null},cancel(){if(!drag)return;drag=null;if(phase===0)targetTurn=0;else if(phase===1){x=128;y=136}},
 update(dt){time+=dt;turn=lerp(turn,targetTurn,Math.min(1,dt*13));if(phase===2){settle+=dt;if(settle>.7)done()}},debug(){return {phase,behind:turn>.8,hung:phase===2}}};
}});})();
