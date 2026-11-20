(()=>{
"use strict";
TinyV6.register(3,{"id": "legacy-3", "title": "A fair share", "description": "Draw two unfair cuts.", "hint": "Draw two lines across the pizza in any direction. Avoid the center so the portions are unequal.", "verdict": "Somebody gets the tiny slice. Somebody remembers.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let cuts=[],start=null,end=null,cutAnim=0,separate=0,invalid=0;
const cx=238,cy=136,R=95;
function pizza(){
 shadow(cx,244,119,13);ellipse(cx,140,119,113,'#694936');ellipse(cx,136,117,110,'#b18b5c');ellipse(cx,136,109,103,'#d5af79');
 ctx.save();if(cuts.length===2){ctx.translate(-separate*2,0);}ellipse(cx,cy+5,R,R,'#9e562c');ellipse(cx,cy,R,R,'#d7994f');ellipse(cx,cy,R-7,R-7,grad(150,50,175,170,'#ffe294','#e4ae54'));ellipse(cx,cy,R-16,R-16,'#b34f32');ellipse(cx,cy,R-19,R-19,grad(170,50,150,150,'#f9d985','#ecba56'));
 for(let i=0;i<14;i++){const a=i*2.4,r=20+((i*21)%50),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;ellipse(x,y,10,10,'#a84331');ellipse(x-1,y-2,8,8,'#ce5d39');for(let j=0;j<4;j++)ellipse(x+Math.cos(j*2)*5,y+Math.sin(j*2)*5,1,1,'#f3ad6b');}
 for(let i=0;i<22;i++){const a=i*2.8,r=18+(i*17)%57,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;line(x-3,y,x+3,y+2,'#527344',3);}
 for(let i=0;i<32;i++){const a=i*Math.PI/16;ellipse(cx+Math.cos(a)*88,cy+Math.sin(a)*88,2,1.4,'#a76c3f');}
 cuts.forEach((c,i)=>{const k=i===cuts.length-1?cutAnim:1;line(c[0][0],c[0][1],c[0][0]+(c[1][0]-c[0][0])*k,c[0][1]+(c[1][1]-c[0][1])*k,'#8f4b2f',4+separate*3);line(c[0][0]+2,c[0][1]+2,c[0][0]+(c[1][0]-c[0][0])*k+2,c[0][1]+(c[1][1]-c[0][1])*k+2,'#ffe7a3',1);});ctx.restore();
}
function chord(a,b){const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy);if(l<100)return null;const ux=dx/l,uy=dy/l,proj=(cx-a.x)*ux+(cy-a.y)*uy,px=a.x+proj*ux,py=a.y+proj*uy,d=Math.hypot(px-cx,py-cy);if(d>82||d<18||proj<25||proj>l-25)return null;const h=Math.sqrt(R*R-d*d);return [[px-ux*h,py-uy*h],[px+ux*h,py+uy*h]];}
function acceptable(c){if(!cuts.length)return true;const b=cuts[0],dist=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]);if(Math.min(dist(c[0],b[0])+dist(c[1],b[1]),dist(c[0],b[1])+dist(c[1],b[0]))<24)return false;const areas=[0,0,0,0],side=(p,l)=>(l[1][0]-l[0][0])*(p[1]-l[0][1])-(l[1][1]-l[0][1])*(p[0]-l[0][0])>0;for(let x=cx-R;x<cx+R;x+=3)for(let y=cy-R;y<cy+R;y+=3)if(Math.hypot(x-cx,y-cy)<R)areas[(side([x,y],b)?1:0)+(side([x,y],c)?2:0)]++;const live=areas.filter(n=>n>10);return Math.max(...live)/Math.min(...live)>1.45;}
return{draw(){desk('#324149');pizza();if(start&&end){line(start.x,start.y,end.x,end.y,'#eee7caa0',2);ellipse(end.x,end.y,15,15,'#657c85');ellipse(end.x,end.y,11,11,'#d5e0dc');line(end.x,end.y,end.x+24,end.y-29,'#26363c',8);line(end.x,end.y,end.x+22,end.y-26,'#b68051',4);}else{ellipse(390,126,19,19,'#8a9c9d');ellipse(390,126,15,15,'#d8dfd8');line(390,126,414,83,'#1a2930',12);line(392,122,416,84,'#8b5b3f',7);}if(invalid>0)text('Too fair. Try off-center.',238,257,11,'#f4d19a');},down(p){if(!done&&cuts.length<2){start=p;end=p;drag=p;}},move(p){if(drag)end=p;},up(p){if(!drag)return;const c=chord(start,p);if(c&&acceptable(c)){invalid=0;cuts.push(c);phase=cuts.length;cutAnim=0;api.tone(360,.09);}else invalid=1.5;drag=start=end=null;},cancel(){if(drag===null)return;drag=start=end=null;},update(dt){time+=dt;invalid=Math.max(0,invalid-dt);cutAnim=Math.min(1,cutAnim+dt*3);if(cuts.length===2&&cutAnim===1){separate=Math.min(1,separate+dt*2);if(separate===1)finish();}},debug(){return{phase,cuts:cuts.length,separate,done};}};

}});
})();
