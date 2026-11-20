(()=>{TinyV6.register(28,{"id":"cookie","title":"One second too long","description":"Dip the biscuit, then lift it toward your mouth.","hint":"Hold the biscuit in the tea until it softens, then lift it up toward the mouth on the right.","verdict":"Tea with a surprise at the bottom.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let x=112,y=115,soak=0,sink=0,wobble=0,fragment=null;
function biscuit(cx,cy,small=false){ctx.save();ctx.translate(cx,cy);ctx.rotate(Math.sin(time*3)*.025);if(small){path([[-21,-30],[19,-30],[22,-12],[11,-6],[3,-12],[-5,-7],[-17,-12]],'#cc9b53','#edc582');}else{for(let n=0;n<16;n++){let a=n*Math.PI/8;ellipse(Math.cos(a)*26,Math.sin(a)*31,7,7,'#ad793f')}ellipse(0,0,29,34,'#dfb66e');ellipse(0,0,24,29,'#ca974f');for(let r=0;r<4;r++)for(let c=0;c<4;c++){ellipse(-15+c*10,-20+r*13,1.5,1.5,'#986b37')}if(soak>0){ctx.save();ctx.globalAlpha*=soak*.6;path([[-25,2],[-17,5],[-7,1],[7,4],[25,0],[26,20],[13,31],[-13,31],[-26,20]],'#6d492f');ctx.restore()}}ctx.restore()}
return {draw(){room('kitchen');ellipse(274,235,120,14,'#13212a');ellipse(274,228,104,14,'#8fa3a6');ellipse(274,226,82,9,'#bac7c0');curve([347,143,411,121,411,218,347,205],'#c8d1c6',14);curve([351,146,393,136,393,204,351,202],'#506a74',5);round(191,131,166,92,22,'#9fb8b6');ellipse(274,130,83,29,'#d4ded2');ellipse(274,131,72,21,'#573c2d');ellipse(274,128,62,16,'#745238');curve([217,125,242,112,278,112,308,119],'#b18a5b',2);
 // A small profile gives the lift a visible destination.
 ellipse(423,66,24,31,'#d2a07f');path([[404,48],[394,62],[405,67],[401,78],[417,86],[432,82]],'#d2a07f');line(399,72,412,73,'#784947',3);ellipse(408,54,2,2,'#263642');
 if(phase===0)biscuit(x,y);else{biscuit(x,y,true);if(fragment){ctx.save();ctx.translate(fragment.x,fragment.y);ctx.rotate(fragment.angle);ctx.beginPath();ctx.rect(-35,-3,70,50);ctx.clip();ctx.globalAlpha=Math.max(0,1-sink);biscuit(0,0);ctx.restore()}}
 // Near rim masks the submerged part, preserving the dunk silhouette.
 path([[191,139],[210,154],[247,162],[298,162],[337,152],[357,139],[355,202],[344,217],[204,217],[193,201]],'#9fb8b6');curve([199,145,229,169,320,166,349,146],'#e1e8da',3);curve([207,169,204,188,211,204,218,208],'#c8d8ca',3);
 if(soak>0){for(let n=0;n<3;n++){let r=7+(time*18+n*15)%35;ctx.strokeStyle='#ba9567';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(274,133,r,r*.22,0,0,Math.PI*2);ctx.stroke()}}if(phase===1){for(let n=0;n<4;n++)ellipse(264+n*7,133+Math.sin(time*3+n)*3,1.5,1,'#d1ad7b')}
 if(!drag&&phase===0){text('A quick dunk. Or not.',240,27,11,'#bbc9c0')}else text(phase===1?'The tea has claimed the rest.':soak>=1?'Soft enough. Lift it toward your mouth.':'Just a little longer...',240,27,11,'#c8cfbb');},
 down(p){if(phase===0&&near(p,x,y,49))drag={ox:x-p.x,oy:y-p.y}},
 move(p){if(drag){x=clamp(p.x+drag.ox,45,410);y=clamp(p.y+drag.oy,58,180);if(soak>=1&&y<99&&x>185&&phase===0){phase=1;fragment={x,y:y+9,vy:0,angle:0};drag=null;api.tone(220,.12,.02);api.say('The soft half never made it to your mouth.');}}},
 up(){if(!drag)return;drag=null;if(phase===0){x=112;y=115;soak=0}},
 cancel(){if(!drag)return;drag=null;if(phase===0){x=112;y=115;soak=0}},
 update(dt){time+=dt;if(phase===0&&drag&&near({x,y},274,128,38)){soak=Math.min(1,soak+dt*.5);wobble+=dt;}
 if(phase===1&&fragment){fragment.vy+=dt*190;fragment.y+=fragment.vy*dt;fragment.x=lerp(fragment.x,274,Math.min(1,dt*2));fragment.angle+=dt*.6;if(fragment.y>=129){fragment.y=129;sink=Math.min(1.1,sink+dt*.85);if(sink>1)done()}}},
 debug(){return{phase,soak,sink,liftRequired:true,fragment:fragment?{...fragment}:null}}};
}});})();
