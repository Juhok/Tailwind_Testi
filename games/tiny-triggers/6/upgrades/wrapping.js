(()=>{TinyV6.register(49,{"id":"wrapping","title":"A centimetre short","description":"Wrapping paper: cut a piece just a centimetre too short.","hint":"Cut just before the far edge","verdict":"There is always the other side. Also short.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let cut=0,target=0,fold=0,sx=332,sy=72;
function scissors(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(time*17)*(drag?.2:0));line(-3,-8,-15,-38,'#a8bec1',5);line(3,-8,15,-38,'#d5ded5',5);line(-4,-7,8,17,'#6e979d',5);line(4,-7,-8,17,'#88afb0',5);ellipse(-10,23,10,14,'#6e979d');ellipse(-10,23,5,8,'#223743');ellipse(10,23,10,14,'#88afb0');ellipse(10,23,5,8,'#223743');ellipse(0,-5,4,4,'#e4e4d2');ctx.restore()}
return {draw(){room();ellipse(244,239,157,12,'#13212a');path([[92,87],[387,87],[393,225],[88,225]],'#728f8c','#bac6ae');for(let yy=103;yy<221;yy+=24)for(let xx=109;xx<380;xx+=27){path([[xx,yy-4],[xx+4,yy],[xx,yy+4],[xx-4,yy]],'#a9b99b')}
 for(let yy=94;yy<221;yy+=10)line(351,yy,351,yy+5,'#e1d9ad',1);if(cut>0)line(332,87,332,87+cut*138,'#203844',2);if(fold>0){path([[334+fold*24,87+fold*8],[388+fold*28,87+fold*8],[395+fold*28,225],[334+fold*24,225]],'#577774')}
 path([[151,126],[295,126],[322,148],[322,213],[151,213]],'#ba976b','#dfc49c',2);path([[151,126],[178,107],[321,107],[295,126]],'#d0af7d');path([[295,126],[321,107],[322,213],[295,213]],'#a8855c');line(224,108,224,126,'#ab885e',1);text('GIFT',221,172,15,'#866944');
 if(fold>0){path([[151,126],[151+fold*66,126],[151+fold*66,213],[151,213]],'#8aa29a','#b5c5af');path([[295,126],[295-fold*61,126],[295-fold*61,213],[295,213]],'#748f89','#b5c5af');for(let n=0;n<4;n++){let xx=161+n*14;if(xx<151+fold*66)path([[xx,148],[xx+4,153],[xx,158],[xx-4,153]],'#c1cbae')}if(fold>.95){line(219,185,232,185,'#e5c497',1);line(219,181,219,189,'#e5c497',1);line(232,181,232,189,'#e5c497',1)}}
 scissors(phase===0?sx:397,phase===0?sy:61);text(phase===1?'Just one centimetre short.':'Cut beside the guide. A little too soon.',240,26,10,'#c8cfbc');},
 down(p){if(!completed&&near(p,sx,sy,43))drag={y:p.y}},move(p){if(drag){sy=clamp(p.y,72,223);target=clamp((sy-72)/145,0,1);sx=clamp(p.x,322,340)}},up(){if(!drag)return;drag=null;if(target>.9){target=1;phase=1}else{target=0;sy=72;sx=332}},cancel(){if(!drag)return;drag=null;target=0;sx=332;sy=72},update(dt){time+=dt;cut=lerp(cut,target,Math.min(1,dt*20));if(phase===1){fold=Math.min(1,fold+dt*.9);if(fold===1)done()}},debug(){return{phase,cut,fold,gap:fold===1}}};
}});})();
