(()=>{TinyV6.register(61,{"id":"teabag","title":"Tag included","description":"Teabag: let go of the string so the paper tag sinks into the cup too.","hint":"Let the tag fall in","verdict":"Now with extra paper flavour.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let x=376,y=113,drop=0,v=0,wet=0,angle=0,ripple=0;
function tag(){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=1-wet*.7;path([[-18,-24],[12,-24],[21,-15],[21,25],[-18,25]],wet>.2?'#bdad7d':'#e8d9a4','#9e9671');line(-18,-16,21,-16,'#789c88',3);text('TEA',1,4,10,'#537666');ellipse(0,-18,2,2,'#809277');ctx.restore()}
return {draw(){room('kitchen');ellipse(238,234,119,12,'#14232b');ellipse(239,225,102,17,'#a2b7b2');curve([162,143,112,129,113,212,165,203],'#d1dacb',14);curve([159,146,125,141,128,199,165,199],'#486571',5);round(162,123,154,100,20,'#b7ccbf');ellipse(239,126,78,27,'#e0e6d1');ellipse(239,126,68,21,'#7a553a');ellipse(234,123,57,15,'#88613f');
 ctx.save();ctx.globalAlpha=.5;path([[208,117],[221,111],[242,119],[239,140],[210,141]],'#ad9b71','#e4cc9e');for(let n=0;n<15;n++)rect(214+n*7%22,120+n*11%16,1,1,'#66583d');ctx.restore();
 curve([225,116,260,89+drop*26,298,100+drop*35,x,y-18],'#e4dbc0',1.7);tag();
 if(phase===1){for(let n=0;n<3;n++){let r=(ripple*23+n*17)%55;ctx.strokeStyle='#d0ad7c';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(239,127,r,r*.25,0,0,Math.PI*2);ctx.stroke()}}
 path([[162,135],[181,148],[219,155],[259,155],[299,145],[316,135],[314,205],[300,220],[177,220],[164,204]],'#b7ccbf');curve([170,142,210,165,276,162,309,143],'#e3ead6',3);for(let n=0;n<3;n++){curve([195+n*31,205,185+n*31,185,203+n*31,185,202+n*31,173],'#7fa391',2);ellipse(193+n*31,189,6,3,'#86a994');ellipse(202+n*31,180,5,3,'#86a994')}
 text(phase===1?'Tag included. String too.':'Drop the paper tag into the tea.',240,27,11,'#c9cfbd');},
 down(p){if(phase===0&&near(p,x,y,39))drag={ox:x-p.x,oy:y-p.y}},move(p){if(drag){x=clamp(p.x+drag.ox,65,424);y=clamp(p.y+drag.oy,55,192);angle=(x-376)*.002}},up(){if(!drag)return;drag=null;if(hit({x,y},239,111,119,80)){phase=1;v=0;api.tone(440,.1)}else{x=376;y=113;angle=0}},cancel(){if(!drag)return;drag=null;x=376;y=113;angle=0},update(dt){time+=dt;if(phase===1){drop=Math.min(1,drop+dt*.65);v+=dt*80;y=Math.min(150,y+v*dt);x=lerp(x,239,Math.min(1,dt*3));angle+=dt*.42;wet=Math.min(1,wet+dt*.8);ripple+=dt;if(drop===1)done()}},debug(){return{phase,drop,wet}}};
}});})();
