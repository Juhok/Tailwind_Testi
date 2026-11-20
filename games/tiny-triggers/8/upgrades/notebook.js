(() => {
'use strict';
TinyV6.register(74, {
id: "notebook",
title: "Spiral confetti",
description: "Spiral notebook: tear out a page, leaving paper fringe around the spiral.",
hint: "Pull the page off the spiral",
verdict: "A notebook with a paper moustache.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let drag=false,phase=0,pull=0,ox=0,oy=0,t=0,settle=0;
function paper(x,y,w,h,color){ctx.save();ctx.translate(x,y);poly([[0,0],[w-10,0],[w,10],[w,h],[0,h]],color);poly([[w-10,0],[w-10,10],[w,10]],'#c3c9bd');for(let j=22;j<h-8;j+=15)line(9,j,w-9,j,'#98b8bc',.6);line(29,9,29,h-8,'#d29b96',.8);ctx.restore();}
function coils(){for(let i=0;i<10;i++){let y=62+i*16;ellipse(150,y,4,3,'#29383d');curve([[151,y],[130,y-11],[128,y+8],[144,y+5]],'#172b33',5);curve([[151,y-2],[132,y-12],[130,y+5],[143,y+4]],'#b4c2c7',2);}}
function fringe(){for(let i=0;i<10;i++){if(phase===0&&(pull<=0||i/10>pull))continue;let y=62+i*16;poly([[151,y-6],[168+(i%3)*4,y-7],[162,y-2],[172-(i%4)*2,y+2],[160,y+6],[153,y+5]],'#dddcc9');line(157,y-4,159,y+4,'#b0b5a7',.6);}}
return {
 draw(){wood();shadow(240,239,125,13);round(128,34,229,202,7,'#101f27');round(132,31,221,199,5,'#426677');rect(147,43,201,181,'#a9b2ad');for(let i=0;i<4;i++)line(152,222-i*2,347,222-i*2,'#e4e2cf',1);paper(151,43,191,173,'#e5e3cf');
 if(phase===0){ctx.save();ctx.translate(151+ox,43+oy);ctx.rotate(-pull*.12);shadow(100,174,98,6);paper(0,0,191,173,'#f0edd8');if(pull>0){poly([[171,0],[191,0],[191,26],[180,16]],'#c7ccb9');curve([[181,4],[171,10],[174,19],[190,26]],'#fff7df',1.2);}text('Saturday',100,34,11,'#567478');line(46,60,139,62,'#63797c',1);line(46,75,157,76,'#63797c',1);line(46,90,126,90,'#63797c',1);ctx.restore();}
 else {let x=mix(151+ox,277,settle),y=mix(43+oy,67,settle);ctx.save();ctx.translate(x,y);ctx.rotate(mix(-.12,.08,settle));shadow(90,176,88,8);paper(0,0,191,173,'#eee9d4');for(let i=0;i<10;i++)poly([[0,10+i*14],[5,13+i*14],[0,17+i*14]],'#34454c');text('Saturday',100,34,11,'#567478');line(46,60,139,62,'#63797c',1);line(46,75,157,76,'#63797c',1);line(46,90,126,90,'#63797c',1);ctx.restore();}
 fringe();coils();if(phase===2)text('Every loop kept a little souvenir.',235,255,10,'#d7ded3');
 },
 down(p){if(phase===0&&hit(p,255,124,206,176)){drag=true;this.start=p;this.base={x:ox,y:oy};}},
 move(p){if(!drag)return;ox=clamp(p.x-this.start.x,0,140);oy=clamp(p.y-this.start.y,-25,80);pull=clamp(ox/92,0,1);},
 up(){if(!drag)return;drag=false;if(pull>=.98){phase=1;api.tone(260,.08,.015);}else{ox=oy=pull=0;api.say('The whole page. The spiral keeps its fringe.');}},
 cancel(){if(drag){drag=false;ox=oy=pull=0;}},
 update(dt){t+=dt;if(phase===1){settle=Math.min(1,settle+dt*1.5);if(settle===1){phase=2;api.done();}}},
 debug(){return {phase,pull,fringe:phase?10:Math.floor(pull*10),drag};}
};

}
});
})();
