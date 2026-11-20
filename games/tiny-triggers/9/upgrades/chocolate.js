(() => {
'use strict';
TinyV6.register(2, {
id: "chocolate",
title: "Off the grid",
description: "Snap across a chocolate square instead of along the grooves.",
hint: "Bend the lower-right square away from the grooves",
verdict: "There were lines. You chose not to use them.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,t=0,pull=0,target=0,drag=false,start=null,finish=false;
const crack=[[284,128],[297,138],[294,149],[311,158],[306,171],[324,181],[323,198],[344,209]];
function slab(piece=false){
 ctx.save();if(piece){ctx.translate(pull*54,pull*35);ctx.translate(322,182);ctx.rotate(pull*.19);ctx.translate(-322,-182);}
 ctx.beginPath();const pts=piece?[...crack,[344,128]]:[[121,57],[344,57],...crack.slice().reverse(),[121,209]];
 // Clip the diagonal corner away only once it bends.
 if(piece){ctx.moveTo(...crack[0]);crack.slice(1).forEach(p=>ctx.lineTo(...p));ctx.lineTo(344,128);ctx.closePath();}
 else {ctx.rect(121,57,223,152);}
 ctx.save();ctx.clip();
 round(119,62,228,151,6,'#21141c');round(121,57,223,152,5,gradient(121,57,220,152,'#9a6548','#513324'));
 for(let r=0;r<3;r++)for(let c=0;c<4;c++){let x=126+c*54,y=62+r*48;round(x,y,47,40,3,'#3d251e');poly([[x+2,y+2],[x+45,y+2],[x+39,y+8],[x+8,y+8]],'#c28c63');poly([[x+45,y+2],[x+45,y+38],[x+39,y+31],[x+39,y+8]],'#462a21');round(x+7,y+7,33,26,3,gradient(x,y,35,25,'#a56e4d','#75472f'));curve([[x+15,y+21],[x+19,y+13],[x+28,y+26],[x+32,y+17]],'#c9926455',1.3);}
 ctx.restore();ctx.restore();
}
return {draw(){wood();shadow(242,219,139,16);
 poly([[92,44],[352,42],[365,66],[351,225],[102,226],[88,203]],'#859b9d');poly([[94,47],[118,60],[118,209],[101,223]],'#d2d9cc');poly([[350,45],[344,60],[344,212],[357,218]],'#b9c9c3');
 slab();if(pull>0){ctx.save();ctx.beginPath();ctx.moveTo(...crack[0]);crack.slice(1).forEach(p=>ctx.lineTo(...p));ctx.lineTo(344,128);ctx.closePath();ctx.fillStyle='#34454b';ctx.fill();ctx.restore();slab(true);curve(crack.length===8?[crack[0],crack[1],crack[2],crack[3],crack[4],crack[5],crack[6]]:[], '#d09b6b',1);for(let n=0;n<9;n++){let q=clamp((t-.05-n*.02)*3,0,1);ellipse(309+n*5+Math.sin(n)*q*17,180+q*38,1+n%2,1.4,'#ad7752');}}
 if(!phase){ellipse(324,184,17,13,'#edc29b12');line(317,183,331,183,'#e2b487',2);}text(phase===2?'Not a single groove respected.':'',240,246,10,'#c6bcb0');},
 down(p){if(!phase&&near(p,321,182,43)){drag=true;start=p;}},move(p){if(drag){target=clamp((p.x-start.x+p.y-start.y)/95,0,1);}},up(){if(drag){drag=false;if(target>.65){phase=1;target=1;t=0;api.tone(170,.08,.035);}else target=0;}},cancel(){if(drag){drag=false;target=0;}},update(dt){pull+= (target-pull)*Math.min(1,dt*14);if(phase===1){t+=dt;if(t>.75){phase=2;finish=true;api.done();}}},debug(){return {phase,pull,finish};}};

}
});
})();
