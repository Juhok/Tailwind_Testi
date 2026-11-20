(()=>{
"use strict";
TinyV6.register(63,{"id": "soap", "title": "Wrapper reunited", "description": "Soap: press the wet bar into its paper wrapper.", "hint": "Press wet soap into paper", "verdict": "A packaging reunion nobody needed.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let sx=128,sy=133,stain=0,press=0;
function wrapper(){path([[264,99],[304,108],[350,97],[402,111],[393,152],[405,211],[349,201],[290,214],[257,197],[269,154]],'#c4b18e','#e1cc9e');path([[264,99],[283,124],[277,185],[257,197],[269,154]],'#9f947c');path([[402,111],[383,125],[389,192],[405,211],[393,152]],'#e1c99e');line(282,125,382,125,'#ad9772',1);line(278,192,390,192,'#a18d71',1);text('BOTANICAL',332,133,10,'#756e5b');text('SOAP',332,176,19,'#7b785c');curve([[289,182],[296,165],[302,151],[309,144]],'#73866a',2);path([[298,169],[287,160],[291,175]],'#84956e');if(stain>0){ellipse(332,159,65*stain,42*stain,'#6a776a66');for(let n=0;n<10;n++)ellipse(288+n*10,173+Math.sin(n*2)*23,8*stain,5*stain,'#71807135');}}
function soap(){ctx.save();ctx.translate(sx,sy);ctx.scale(1+press*.04,1-press*.06);shadow(0,36,55,11);round(-53,-25,106,61,18,'#7f9c89');round(-53,-32,106,59,18,grad(-50,-30,100,60,'#d1ddae','#96b79a'),'#c9dfbb');round(-35,-21,70,35,11,'#abc5a2','#dce6bc');text('SOAP',0,1,14,'#6c8e7e');curve([[-43,-13],[-46,-28],[-26,-29],[-13,-29]],'#ecedcf',3);for(let n=0;n<7;n++){const x=-36+n*12,y=16+Math.sin(n*2)*9;ellipse(x,y,2+(n%2),3,'#cde5d6');ellipse(x-1,y-1,1,1,'#f5f3df');}if(stain>.3){path([[-51,12],[-35,10],[-27,22],[-39,29],[-51,22]],'#b3a889');path([[41,-21],[51,-15],[45,5],[35,-2]],'#c5b493');}ctx.restore();}
return{draw(){desk('#2c4650');for(let y=0;y<270;y+=65)line(0,y,480,y,'#aac2ba12',2);ellipse(126,170,77,34,'#789fa7');ellipse(126,165,69,28,'#bdd3ca');ellipse(126,165,60,21,'#527f91');for(let i=0;i<4;i++)line(82,154+i*7,169,154+i*7,'#a8c8bd',3);wrapper();soap();},down(p){if(!done&&phase===0&&near(p,sx,sy,62))drag=p;},move(p){if(drag){sx=p.x;sy=p.y;}},up(p){if(!drag)return;if(near(p,332,155,53)){sx=332;sy=155;phase=1;api.tone(340,.1);}else{sx=128;sy=133;}drag=null;},cancel(){if(drag===null)return;drag=null;sx=128;sy=133;},update(dt){time+=dt;if(phase){stain=Math.min(1,stain+dt*.8);press=Math.sin(Math.min(1,stain*2)*Math.PI)*.7;if(stain===1)finish();}},debug(){return{phase,stain,done};}};

}});
})();
