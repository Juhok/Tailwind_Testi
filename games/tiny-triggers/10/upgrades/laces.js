(()=>{TinyV6.register(40,{"id":"laces","title":"Unequal partnership","description":"Shoelaces: tie a bow with one enormous loop and one tiny loop.","hint":"Pull one loop much larger \u2192 Tuck the other loop small","verdict":"One loop for each level of enthusiasm.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let big=0,small=0,bt=0,st=0,knot=0;
function lace(points){curve(points,'#283b45',7);curve(points,'#d8d2b4',4);curve(points.map((v,i)=>i%2?v-1:v),'#f4e9ca',1)}
return {draw(){room();ellipse(245,232,118,17,'#14212a');path([[170,216],[160,179],[173,91],[197,61],[241,49],[280,62],[306,95],[322,178],[309,217],[276,236],[209,236]],'#d3d5c4','#536d76',3);path([[174,205],[173,166],[184,100],[204,77],[241,65],[275,77],[295,105],[310,166],[307,205],[272,224],[210,224]],'#789997','#aac0af',2);ellipse(241,196,58,27,'#a6b9a6');curve([187,191,205,170,276,169,296,191],'#d1d3bd',2);round(212,80,59,96,13,'#576f73','#a2b8a5');round(220,83,42,20,4,'#a2b4a1');text('TINY',241,93,9,'#3e5c64');
 for(let n=0;n<4;n++){let yy=112+n*18;ellipse(205-n*2,yy,5,5,'#304a56');ellipse(277+n*2,yy,5,5,'#304a56');lace([205-n*2,yy,224,yy+8,258,yy+9,279+n*2,yy+17]);lace([277+n*2,yy,262,yy+9,223,yy+10,203-n*2,yy+17])}
 let lx=190-big*95,ly=128-big*47,rx=291-small*40,ry=128+small*23;lace([240,171,lx-31,ly-42,lx-45,ly+30,240,171]);lace([240,171,rx+31,ry-42,rx+45,ry+30,240,171]);lace([239,171,216-big*12,183,213-big*19,198,194-big*20,207]);lace([242,171,273,188,282,184,298,201]);line(192-big*20,207,185-big*20,215,'#a4b9b4',5);line(298,201,304,209,'#a4b9b4',5);
 ellipse(240,171+Math.sin(knot*22)*Math.exp(-knot*6)*2,11,7,'#cdc8ac');line(234,168,245,175,'#f5e6c4',2);
 text(phase===0?'Make one loop enormous.':phase===1?'Now make the other one tiny.':'Unequal, but technically tied.',240,27,11,'#c8cebd');},
 down(p){if(completed)return;if(phase===0&&near(p,190,128,50))drag={kind:'big',x:p.x};else if(phase===1&&near(p,291,128,50))drag={kind:'small',x:p.x}},move(p){if(!drag)return;if(drag.kind==='big')bt=clamp((drag.x-p.x)/84,0,1);else st=clamp((drag.x-p.x)/44,0,1)},up(){if(!drag)return;if(drag.kind==='big'){if(bt>.85){bt=1;phase=1}else bt=0}else{if(st>.8){st=1;phase=2}else st=0}drag=null},cancel(){if(!drag)return;if(drag.kind==='big')bt=0;else st=0;drag=null},update(dt){time+=dt;big=lerp(big,bt,Math.min(1,dt*12));small=lerp(small,st,Math.min(1,dt*12));if(phase===2){knot+=dt;if(knot>.7)done()}},debug(){return{guideComplete:completed,phase,big,small}}};
}});})();
