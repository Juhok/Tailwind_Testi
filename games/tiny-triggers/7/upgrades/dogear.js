(()=>{TinyV6.register(73,{"id":"dogear","title":"Bookmark ignored","description":"Book: fold a large dog-ear in the page even though a bookmark is beside it.","hint":"Fold a large page corner","verdict":"The bookmark watched the whole thing.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let fold=0,ft=0,settle=0;
return {draw(){room();ellipse(219,240,157,10,'#14222b');path([[80,62],[209,70],[339,60],[345,228],[210,241],[77,228]],'#6f6258','#ac9474',2);path([[87,68],[210,76],[333,67],[339,220],[210,233],[83,220]],'#bab6a0');for(let n=0;n<4;n++){curve([85,218+n*3,133,211+n*3,187,223+n*3,210,228+n*2],'#ded8bd',1);curve([211,228+n*2,248,219+n*3,298,216+n*3,337,218+n*3],'#ded8bd',1)}
 path([[89,64],[148,62],[210,75],[210,224],[151,212],[84,215]],'#e7e2c8','#b7b69f');path([[210,75],[271,61],[333,65],[337,216],[276,214],[210,224]],'#f2ebd1','#b7b69f');curve([210,75,206,109,207,190,210,224],'#9a9f8b',3);text('CHAPTER VII',151,89,9,'#758074');for(let n=0;n<12;n++){let yy=105+n*8;line(103,yy,193-(n%4)*8,yy+2,'#9ba08b',1);line(225,yy,320-(n%5)*7,yy-2,'#9ba08b',1)}text('42',151,205,8,'#8c9683');text('43',277,205,8,'#8c9683');
 let d=fold*86;if(d>1){path([[333-d,65],[333,65],[333,65+d]],'#c5c7b0');path([[333-d+2,67],[335,67+d],[333-d+3,70+d]],'#b4b79f');path([[333-d,65],[333,65+d],[333-d,65+d]],'#fff4d6','#c5c6ac',1);line(333-d,65,333,65+d,'#8d9d8d',1);curve([333-d,65+d,333-d+15,64+d,327,71+d,333,65+d],'#ded8b9',1)}
 path([[379,85],[411,85],[411,212],[395,201],[379,212]],'#6b9b96','#a9c0a8');line(383,92,407,92,'#cbd4b6',1);ellipse(395,96,3,3,'#d4d7b9');curve([395,96,427,71,412,49,395,55],'#c3be9e',2);for(let n=0;n<4;n++)line(395+n*2,55,392+n*3,69,'#d4cda8',1);
 text(phase===1?'The bookmark watched everything.':'Fold a generous corner.',240,24,11,'#cad1bf');},
 down(p){if(phase===0&&near(p,328,74,35))drag={x:p.x,y:p.y}},move(p){if(drag){ft=clamp(((drag.x-p.x)+(p.y-drag.y))/150,0,1)}},up(){if(!drag)return;drag=null;if(ft>.82){ft=1;phase=1}else ft=0},cancel(){if(!drag)return;drag=null;ft=0},update(dt){time+=dt;fold=lerp(fold,ft,Math.min(1,dt*10));if(phase===1){settle+=dt;if(settle>.65)done()}},debug(){return{phase,fold,bookmarkUnused:true}}};
}});})();
