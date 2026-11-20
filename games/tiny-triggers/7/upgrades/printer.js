(() => {
'use strict';
TinyV6.register(47, {
id: "printer",
title: "Landscape surprise",
description: "Printer paper: put one sideways sheet into the stack.",
hint: "Turn one sheet sideways → Into the paper stack",
verdict: "The printer will have opinions.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,mode='',x=95,y=123,a=0,ta=0,sy=0,ox=0,oy=0,t=0;
function sheet(px,py,rot,main=false){ctx.save();ctx.translate(px,py);ctx.rotate(rot);round(-38+3,-54+4,76,108,2,'#132b3760');poly([[-38,-54],[27,-54],[38,-43],[38,54],[-38,54]],main?gradient(-38,-54,70,100,'#f3eed4','#c8d2c0'):'#aebfb3');if(main){poly([[27,-54],[27,-43],[38,-43]],'#9daea4');for(let i=0;i<7;i++)line(-26,-28+i*8,i===6?10:26,-28+i*8,'#6a8c8c77',2);rect(-26,-41,32,5,'#769694');}ctx.restore();}
return {draw(){wood();shadow(286,238,119,13);poly([[195,126],[215,44],[351,44],[365,126]],'#274551');poly([[208,123],[225,52],[343,52],[353,123]],'#597781');for(let n=0;n<5;n++)sheet(284+n,105+n*.9,0,false);sheet(x,y,a,true);round(179,124,206,107,13,gradient(179,124,200,110,'#a8b8ac','#617e83'));poly([[179,137],[194,116],[370,116],[385,137]],'#c0c9b4');round(194,150,174,34,6,'#304e5b');round(201,154,160,11,4,'#152f3d');for(let i=0;i<7;i++)round(211+i*22,159,14,7,2,'#69858a');round(197,197,173,13,4,'#294754');poly([[213,209],[351,209],[364,237],[199,237]],'#3f606c');line(203,232,358,232,'#a8b7a8',2);round(318,128,43,13,3,'#34505b');ellipse(325,134,2,2,phase===3?'#e2b76b':'#a6c0a7');line(334,134,355,134,'#9caf9d',1);for(let x of [188,378])line(x,157,x,215,'#d5dcc244',1);if(phase===3){text('Portrait stack. Landscape guest.',240,262,10,'#ced4bb');}},
 down(p){if(phase===0&&near(p,x+32,y-45,35)){mode='turn';sy=p.y;}else if(phase===1&&hit(p,x,y,130,100)){mode='move';ox=p.x-x;oy=p.y-y;}},move(p){if(mode==='turn')ta=clamp((p.y-sy)/80,0,1)*Math.PI/2;if(mode==='move'){x=p.x-ox;y=p.y-oy;}},up(){if(mode==='turn'){if(ta>1.2){ta=Math.PI/2;phase=1;api.tone(500,.05,.02);}else ta=0;}if(mode==='move'){if(near({x,y},282,97,52)){x=282;y=97;phase=2;t=0;api.tone(180,.1,.025);}else{x=95;y=123;}}mode='';},cancel(){if(mode==='turn')ta=0;if(mode==='move'){x=95;y=123;}mode='';},update(dt){a+=(ta-a)*Math.min(1,dt*15);if(phase===2){t+=dt;y=97+Math.min(8,t*11);x=282+Math.sin(t*25)*2*Math.exp(-t*2);if(t>1.2){x=282;phase=3;api.done();}}},debug(){return {phase,angle:a,sideways:a>1.4};}};

}
});
})();
