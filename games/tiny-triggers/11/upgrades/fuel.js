(() => {
'use strict';
TinyV6.register(53, {
id: "fuel",
title: "Half a tank of effort",
description: "Fill the car with only half a tank of fuel.",
hint: "Drag the nozzle into the car → Hold its trigger → Release at half a tank",
verdict: "Enough to put the problem off.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,mode='',nx=143,ny=139,tx=143,ty=139,fuel=0,t=0,ox=0,oy=0;
function nozzle(){ctx.save();ctx.translate(nx,ny);line(6,-17,33,-27,'#c5cebd',8);line(33,-27,42,-19,'#c5cebd',8);round(-15,-23,28,51,7,'#233a43');round(-11,-19,22,38,5,'#86aaa0');round(-6,-9,12,22,3,'#2d4b55');line(-1,-6,4,10,'#cad4ba',3);line(-10,26,-4,35,'#152f3b',9);ctx.restore();}
return {draw(){rect(0,0,480,270,'#304853');rect(0,217,480,53,'#46575a');for(let x=0;x<480;x+=60)rect(x,248,29,3,'#c8ba8d55');poly([[242,216],[253,147],[286,139],[322,86],[416,86],[454,143],[480,149],[480,215]],gradient(260,90,200,120,'#b6b5a1','#617b80'));poly([[296,136],[330,96],[407,96],[438,136]],'#3d616d');poly([[331,99],[345,99],[316,134],[301,134]],'#c4d7c243');line(373,98,373,136,'#a5b6ad',4);round(254,150,217,60,9,'#8c9c96');line(264,160,463,160,'#dce0c355',2);round(397,153,23,4,2,'#3d5c65');for(let x of [287,441]){ellipse(x,217,25,26,'#1c303a');ellipse(x,217,15,16,'#a0b0a8');ellipse(x,217,7,8,'#4b6874');}round(346,143,24,26,5,'#36545e');ellipse(358,155,8,8,'#162f3c');poly([[370,141],[382,138],[382,164],[370,168]],'#bec2ac');
 shadow(94,233,65,8);round(44,43,95,188,11,gradient(45,43,95,180,'#a1b7a7','#5b8584'));round(52,52,79,85,5,'#263f4b');text('FUEL',91,71,12,'#d7d6b7');ctx.beginPath();ctx.arc(91,115,31,Math.PI,Math.PI*2);ctx.strokeStyle='#a9baa6';ctx.lineWidth=2;ctx.stroke();for(let i=0;i<5;i++){let a=Math.PI+i*Math.PI/4;line(91+Math.cos(a)*25,115+Math.sin(a)*25,91+Math.cos(a)*31,115+Math.sin(a)*31,'#e1d6b3',2);}let angle=Math.PI+fuel/100*Math.PI;line(91,115,91+Math.cos(angle)*25,115+Math.sin(angle)*25,'#e6b57b',3);ellipse(91,115,3,3,'#dde0bd');text(Math.round(fuel)+'%',92,158,19,'#e9dfb6');round(59,180,66,27,4,'#3b626b');text('STOP AT ½',92,197,8,'#c4d0b8');
 curve([[139,85],[194,61],[201,232],[175,237]],'#122a36',9);curve([[175,237],[131,255],[nx-29,ny+41],[nx-6,ny+33]],'#122a36',9);curve([[140,85],[195,62],[202,233],[175,237]],'#57777a',2);nozzle();if(phase===3)text('Half a tank. Full confidence.',253,261,10,'#d5d2b8');},
 down(p){if(phase===0&&near(p,nx,ny,38)){mode='drag';ox=p.x-nx;oy=p.y-ny;}else if(phase===1&&near(p,nx,ny,44))mode='fill';},move(p){if(mode==='drag'){tx=clamp(p.x-ox,67,374);ty=clamp(p.y-oy,70,210);}},up(){if(mode==='drag'){if(near({x:tx,y:ty},322,174,48)){phase=1;tx=322;ty=174;}else{tx=143;ty=139;}}else if(mode==='fill'&&fuel>=49){phase=2;t=0;tx=143;ty=139;api.tone(350,.1,.02);}mode='';},cancel(){if(mode==='drag'){tx=143;ty=139;}mode='';},update(dt){nx+=(tx-nx)*Math.min(1,dt*18);ny+=(ty-ny)*Math.min(1,dt*18);if(mode==='fill')fuel=Math.min(50,fuel+32*dt);if(phase===2&&(t+=dt)>.85){phase=3;api.done();}},debug(){return {guide:{nozzle:[nx,ny]},phase,fuel,filling:mode==='fill'};}};

}
});
})();
