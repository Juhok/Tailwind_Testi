(function(){
"use strict";
TinyV9.register({"id":"wasp-door","title":"The Wasp Beside the Open Door","chapter":"uninvited","description":"Open the door. Let nature do the rest.","hint":"Drag the brass handle left until the door stands wide open. Watch the wasp choose the adjacent glass, again and again.","verdict":"An enormous exit. A very small plan.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='closed',open=0,drag=false,t=0,bumps=0,flight=0,bx=325,by=119,flash=0;
function wasp(x,y){ctx.save();ctx.translate(x,y);api.ellipse(-3,-7,8,4,'#d3e6dba0');api.ellipse(7,-7,8,4,'#d3e6dba0');api.ellipse(0,0,12,6,'#e1bb56');for(let i=-7;i<9;i+=6)api.rect(i,-5,3,10,'#39403a');api.ellipse(-13,-1,5,5,'#333d37');api.ellipse(-15,-2,1.5,1.5,C.paper);api.line(-16,-5,-21,-9,'#293b37',1);api.line(-3,4,-8,10,'#293b37',1);api.line(4,4,9,10,'#293b37',1);ctx.restore()}
return{draw(){room();api.rect(0,0,480,219,'#475954');for(let x=0;x<480;x+=53)api.line(x,0,x,219,'#56645a',1);api.round(67,20,337,210,3,'#b4b798');api.rect(76,28,318,194,'#263c42');
api.rect(83,35,307,180,'#b6c4a1');api.rect(83,151,307,64,'#65866b');api.poly([[83,144],[168,85],[240,140],[327,97],[389,136],[389,164],[83,164]],'#77977b');api.ellipse(128,61,18,18,'#ead5a0');for(let i=0;i<9;i++){api.line(96+i*32,172,101+i*32,145,'#496b50',3);api.ellipse(98+i*32,145,7,5,'#b8b873')}
api.rect(274,28,12,194,'#abb59f');api.rect(286,35,101,179,'#a9c2b44d');api.poly([[295,43],[308,43],[375,172],[362,172]],'#e6edc74d');api.poly([[326,41],[330,41],[380,142],[376,142]],'#e6edc766');api.line(286,35,386,214,'#dce6c155',1);
const edge=268-open*147;api.poly([[80,29],[edge,29+open*31],[edge,222-open*20],[80,222]],'#846b4c');api.poly([[89,40],[edge-9,40+open*31],[edge-9,124],[89,123]],'#a7bcad');api.poly([[91,46],[edge-13,49+open*30],[edge-13,121],[91,117]],'#819d94');api.poly([[91,138],[edge-11,138],[edge-11,207-open*17],[91,209]],'#6b5943');api.line(95,146,edge-16,147,'#a48b61',2);api.ellipse(edge-17,144,4,6,'#b5a26b');api.line(edge-17,145,edge-34,145,'#e4cb83',4);
api.rect(73,222,324,8,'#776e53');api.poly([[84,230],[282,230],[242,270],[30,270]],'#c1c19b22');
wasp(bx,by);if(flash>0){ctx.globalAlpha=flash;sparkle(369,by,12,C.gold);ctx.globalAlpha=1;label('TIK!',349,by-17,9,C.gold)}
if(phase==='closed')label('PULL OPEN',183,248,10,C.gold);else{label('OPEN DOOR',179,249,9,C.mint);label('CLOSED GLASS',337,249,9,C.gold)}
},down(p){if(phase==='closed'&&hit(p,244,145,64,62))drag=true},move(p){if(drag)open=clamp((244-p.x)/135,0,1)},up(){if(drag&&open>.82){open=1;phase='buzzing';api.say('Plenty of room. The wasp has other ideas.')}else if(drag)open=0;drag=false},cancel(){if(drag)open=0;drag=false},update(dt){t+=dt;flash=Math.max(0,flash-dt*2);if(phase==='closed'){bx=330+Math.sin(t*1.5)*28;by=111+Math.cos(t*2)*29}else{const old=Math.floor(flight);flight+=dt*.9;const u=flight%1;bx=317+53*Math.sin(u*Math.PI);by=110+Math.sin(flight*2.8)*41;if(old!==Math.floor(flight)){bumps++;flash=1;api.tone(880,.04,.012)}if(bumps>=4&&phase!=='done'){phase='done';api.done()}}},debug(){return{phase,open,bumps,glassClosed:true,doorClear:open===1,wasp:{x:bx,y:by}}}};

}});})();
