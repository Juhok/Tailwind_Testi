(() => {
'use strict';
TinyV6.register(77, {
id: "envelope",
title: "Sealed too soon",
description: "Envelope: close and seal it before putting the letter inside.",
hint: "Fold the empty envelope’s top flap down → Smooth the flap from left to right",
verdict: "The letter can admire it from outside.",
create(api) {
const {ctx,rect,round,ellipse,line,poly,text,clamp,hit,near}=api;
const mix=(a,b,t)=>a+(b-a)*t;
function gradient(x,y,w,h,a,b){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function curve(points,color,width=2){ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function wood(){rect(0,0,480,270,'#263740');for(let i=0;i<6;i++){rect(0,i*50,480,48,i%2?'#2b3b43':'#2e3e46');for(let j=0;j<3;j++)curve([[0,i*50+10+j*13],[140,i*50+15+j*13],[270,i*50+5+j*13],[480,i*50+13+j*13]],'#8398901d',1);} }
function shadow(x,y,rx,ry){ellipse(x,y,rx,ry,'#07161e60');}
function specks(x,y,w,h,n,color){for(let i=0;i<n;i++){const a=(Math.sin(i*41.73+7)*12537)%1,b=(Math.sin(i*17.31+9)*5461)%1;ellipse(x+Math.abs(a)*w,y+Math.abs(b)*h,.65+(i%3)*.5,.7,color);}}

let phase=0,mode='',fold=0,target=0,seal=0,t=0,doneT=0,sx=0,sy=0;
function flap(){let tip=mix(52,199,fold),shade=fold<.45?'#c7aa79':'#deca9c';poly([[163,126],[396,126],[280,tip]],gradient(163,Math.min(tip,126),233,74,shade,'#ad8e60'));line(164,126,395,126,'#947e5e',1);if(fold<.45){line(174,121,280,64,'#e4d7af',3);line(280,64,385,121,'#e4d7af',3);}else {line(171,130,280,192,'#f1e0b5',1);line(280,192,389,130,'#b29469',1);if(phase===1){ctx.globalAlpha=.35+Math.sin(t*3)*.12;line(184,140,280,195,'#f2d99f',2);line(280,195,376,140,'#f2d99f',2);ctx.globalAlpha=1;}}}
return {draw(){wood();shadow(282,231,128,13);ctx.save();ctx.translate(38,97);ctx.rotate(-.09);shadow(53,134,55,7);poly([[0,0],[91,0],[108,16],[108,136],[0,136]],'#ece6d1');poly([[91,0],[91,17],[108,16]],'#bfc5b4');text('Dear friend,',52,25,8,'#526e72');for(let i=0;i<6;i++)line(15,42+i*10,90-(i%3)*8,42+i*10,'#7a9190',1);curve([[48,111],[26,91],[37,82],[48,94]],'#ad6f67',2);curve([[48,94],[59,82],[70,91],[48,111]],'#ad6f67',2);ctx.restore();
 if(fold<.5)flap();round(162,125,235,104,3,'#8f7959');rect(165,128,229,96,gradient(165,128,229,96,'#d8bd89','#b39161'));poly([[165,128],[280,189],[394,128],[394,219],[165,219]],'#a58b60');poly([[165,128],[279,190],[165,223]],'#d2ba8b');poly([[394,128],[279,190],[394,223]],'#bea376');poly([[165,223],[280,159],[394,223]],gradient(165,159,229,64,'#dfc99b','#c4a575'));line(165,222,280,159,'#edd6a8',1);line(280,159,394,222,'#aa8e64',1);if(fold>=.5)flap();
 if(mode==='seal'){let x=mix(199,362,seal);ellipse(x,152,16,9,'#f4dfaa44');line(189,151,x,151,'#ffefbf60',2);}
 if(phase>=2){line(175,132,280,194,'#e9d5ad',.6);line(280,194,386,132,'#b19366',.6);text('SEALED',280,208,8,'#8b7353');}
 if(phase===1)text('Smooth the flap from left to right.',279,250,9,'#d4d9c5');if(phase===3)text('The letter is still outside.',239,255,10,'#d7ded3');
 },
 down(p){if(phase===0&&hit(p,280,87,210,85)){mode='fold';sy=p.y;}else if(phase===1&&hit(p,216,156,95,62)){mode='seal';sx=p.x;seal=0;}},
 move(p){if(mode==='fold')target=clamp((p.y-sy)/94,0,1);if(mode==='seal')seal=clamp((p.x-sx)/150,0,1);},
 up(){if(mode==='fold'){if(target>.86){phase=1;target=1;api.tone(330,.05,.012);}else target=0;}else if(mode==='seal'){if(seal>.9){phase=2;seal=1;api.tone(210,.08,.015);}else seal=0;}mode='';},
 cancel(){if(mode==='fold')target=0;if(mode==='seal')seal=0;mode='';},
 update(dt){t+=dt;fold+=(target-fold)*Math.min(1,dt*14);if(phase===2){doneT+=dt;if(doneT>.65){phase=3;api.done();}}},
 debug(){return {phase,fold,seal,letterInside:false};}
};

}
});
})();
