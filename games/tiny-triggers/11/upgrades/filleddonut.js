(()=>{TinyV6.register(55,{"id":"filleddonut","title":"Filling first","description":"Filled doughnut: squeeze out the filling before taking the first bite.","hint":"Squeeze before biting","verdict":"The filling has left the building.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let pressure=0,pt=0,jam=0,trail=0,finishT=0;
return {draw(){room('kitchen');ellipse(242,231,164,16,'#13222a');ellipse(242,217,161,20,'#a3b8b5');ellipse(242,212,143,14,'#d3dcc8');let h=57-pressure*18,w=91+pressure*16,cy=157+pressure*11;let g=ctx.createLinearGradient(0,cy-h,0,cy+h);g.addColorStop(0,'#f2cb7d');g.addColorStop(.5,'#c99047');g.addColorStop(1,'#986332');ellipse(213,cy,w,h,g);ellipse(213,cy-h*.19,w*.91,h*.72,'#e1b260');curve([213-w*.78,cy-h*.25,193,cy-h*.93,245,cy-h*.85,213+w*.77,cy-h*.22],'#f5d492',4);curve([213-w*.83,cy+12,184,cy+28,250,cy+28,213+w*.83,cy+9],'#f6d599',3);
 for(let n=0;n<78;n++){let xx=148+n*31%135,yy=123+n*17%48+pressure*14;if(((xx-213)/80)**2+((yy-cy)/(h*.8))**2<1)rect(xx,yy,1.7+(n%2),1.3,'#f7e5b6')}
 ellipse(213+w-5,cy+3,7,9,'#7d4930');if(jam>0){let endX=306+jam*62,endY=165+jam*36;curve([213+w-4,cy+4,321,cy-8,342,180,endX,endY],'#993b45',10+jam*5);curve([213+w-3,cy+1,324,cy-12,344,176,endX,endY-2],'#d26262',3);ellipse(352,211,jam*38,jam*10,'#a14349');ellipse(348,208,jam*25,jam*5,'#bb5654');ellipse(338,205,jam*8,jam*2,'#e58972')}
 if(drag){curve([173,95+pressure*34,189,111+pressure*25,228,111+pressure*25,245,95+pressure*34],'#bdccbd',2)}text(phase===1?'All filling. No first bite.':'Press the top. Let the jam escape.',240,28,11,'#c8cfbc');},
 down(p){if(!completed&&hit(p,213,121,163,69))drag={y:p.y}},move(p){if(drag){pt=clamp((p.y-drag.y)/48,0,1)}},up(){if(!drag)return;drag=null;if(pt>.88&&jam>.8){phase=1;pt=.28}else pt=0},cancel(){if(!drag)return;drag=null;pt=0},update(dt){time+=dt;pressure=lerp(pressure,pt,Math.min(1,dt*12));if(drag&&pressure>.25)jam=Math.min(pressure,jam+dt*1.4);if(phase===1){finishT+=dt;jam=Math.min(1,jam+dt*.6);if(finishT>.7)done()}},debug(){return{guideComplete:completed,phase,pressure,jam}}};
}});})();
