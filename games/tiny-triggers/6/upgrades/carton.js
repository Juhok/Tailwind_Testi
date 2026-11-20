(()=>{TinyV6.register(25,{"id":"carton","title":"The other spout","description":"Milk carton: tear open the pouring spout from the wrong side.","hint":"Open the sealed side","verdict":"Now it pours in several directions.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let tear=0,target=0,relax=0;
return {draw(){room('kitchen');ellipse(242,239,92,13,'#11212c');path([[166,97],[277,97],[321,120],[321,228],[166,228]],'#e6e4d2','#8da5ac',2);path([[277,97],[321,120],[321,228],[277,228]],'#7d9eae');path([[166,97],[197,57],[264,57],[277,97]],'#d8dfd2','#a0b3b1');path([[264,57],[306,76],[321,120],[277,97]],'#aec2bd');line(197,57,264,57,'#f3edce',8);line(198,54,264,54,'#7b969b',1);
 rect(169,118,106,84,'#5f8da1');path([[169,178],[192,171],[216,178],[243,171],[275,180],[275,202],[169,202]],'#87afa8');text('FRESH',222,141,12,'#eff2df');text('MILK',222,161,22,'#fff6da');text('1 L',222,218,10,'#567381');text('OPEN',288,112,8,'#375565');path([[296,102],[304,104],[298,110]],'#375565');
 if(tear>0){let fx=197-tear*84,fy=57-tear*10;path([[198,57],[176,92],[196,87],[202,78],[208,85],[217,70],[218,57]],'#304853');path([[197,57],[176,92],[fx-9,fy+28],[fx,fy]],'#f0ead2','#c0c7b8');path([[197,57],[fx,fy],[fx+12,fy-11],[214,53]],'#c1cdbf');for(let n=0;n<7;n++)line(177+n*5,85-(n%3)*7,173+n*5,95-(n%3)*6,'#eceddc',2);curve([fx+4,fy+3,fx+24,fy+6,177,66,197,57],'#fff9df',2)}
 text(phase===0?'The sealed side. Pull there.':'Several spouts. None of them good.',240,26,11,'#c4d0c4');if(phase===1){for(let n=0;n<4;n++){let yy=104+((relax*65+n*22)%98);ellipse(170-n*2,yy,1.7,3,'#eee8d2')}ellipse(161,234,20,4,'#b9c9bd')}
 },down(p){if(!completed&&hit(p,190,75,64,66))drag={x:p.x,y:p.y}},move(p){if(drag)target=clamp((drag.x-p.x+(.3*(drag.y-p.y)))/76,0,1)},up(){if(!drag)return;drag=null;if(target>.85){target=1;phase=1}else target=0},cancel(){if(!drag)return;drag=null;target=0},update(dt){time+=dt;tear=lerp(tear,target,Math.min(1,dt*12));if(phase===1){relax+=dt;if(relax>.8)done()}},debug(){return{phase,tear}}};
}});})();
