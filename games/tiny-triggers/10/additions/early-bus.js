(function(){
"use strict";
TinyV9.register({"id":"early-bus","title":"One Minute Early","chapter":"commute","description":"Reach the stop before the scheduled departure.","hint":"Drag yourself to the bus-stop pole. The timetable says 09:00; your watch says 08:59.","verdict":"Early is a relative term.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='approach',x=48,drag=false,t=0,bus=278,elapsed=0;
function busArt(x){ctx.save();ctx.translate(x,162);api.ellipse(3,23,91,9,'#263c4280');api.round(-86,-45,172,68,8,'#a5ad83');api.rect(-83,0,166,13,'#d1bb74');api.round(-77,-37,112,30,3,'#405e6c');for(let i=0;i<4;i++){api.ellipse(-62+i*25,-20,5,6,'#ae9e84');api.line(-49+i*25,-36,-49+i*25,-7,'#b5c3ad',3)}api.round(42,-37,34,55,2,'#44606b');api.line(58,-35,58,16,'#b5c3ad',2);api.line(45,-7,73,-7,'#b5c3ad',2);api.rect(-75,-42,38,6,'#253c44');label('24',-57,-36,6,C.gold);for(const xx of [-54,56]){api.ellipse(xx,22,13,13,'#26343b');api.ellipse(xx,22,7,7,'#9ba59c');api.ellipse(xx,22,2,2,'#4f6d71')}api.rect(77,4,7,7,'#f1d69a');api.rect(-85,3,5,8,'#ce776b');label('CITY BUS',-22,11,9,'#556b60');ctx.restore()}
return{draw(){api.rect(0,0,480,270,'#507078');api.rect(0,140,480,130,'#637474');for(let i=0;i<7;i++){const xx=i*78;api.rect(xx,37+(i%3)*16,67,107,'#607c7c');api.rect(xx+5,32+(i%3)*16,58,7,'#7a9288');for(let r=0;r<3;r++)for(let c=0;c<3;c++)api.rect(xx+9+c*17,52+(i%3)*16+r*24,9,13,'#a3b6a0')}
api.rect(0,149,480,47,'#354b53');for(let xx=0;xx<480;xx+=67)api.rect(xx,178,33,3,'#c6c6a2');api.rect(0,197,480,6,'#c2c6aa');api.rect(0,203,480,67,'#8b9077');for(let xx=0;xx<480;xx+=45)api.line(xx,205,xx-9,270,'#6b7c6c',1);
api.line(209,77,209,239,'#b4bca4',7);api.round(185,53,49,39,5,'#4b7877','#bfd1b3');api.round(194,64,30,16,3,'#d7d8b4');api.rect(199,68,20,5,'#658b87');api.ellipse(201,82,3,3,'#d7d8b4');api.ellipse(219,82,3,3,'#d7d8b4');
api.round(237,17,216,47,4,'#203a41');label(phase==='done'?'Next bus: 20 min.':'Route 24  Departure 09:00',345,36,10,C.gold);label('CURRENT TIME 08:59',345,54,9,C.paper);
if(bus<590)busArt(bus);person(x,242,1.12,C.blue,drag?t*10:0);api.round(19,21,114,40,5,'#c3c9ad');label('YOUR WATCH',76,36,8,'#4f6860');label('08:59',76,53,15,'#4f6860');
if(phase==='done'){label('ONE MINUTE EARLY.',302,238,13,'#354e4a');api.line(300,211,345,211,'#b1b9a0',2);api.line(350,217,410,217,'#b1b9a0',2)}
},down(p){if(phase==='approach'&&hit(p,x,208,67,96))drag=true},move(p){if(drag)x=clamp(p.x,40,188)},up(){if(drag&&x>172){x=188;phase='departing';elapsed=0;api.say('But the timetable says nine.')}drag=false},cancel(){drag=false},update(dt){t+=dt;if(phase==='departing'){elapsed+=dt;bus+=dt*(65+elapsed*43);if(bus>588){phase='done';api.tone(240,.18,.018);api.done()}}},debug(){return{phase,x,bus,now:'08:59',scheduled:'09:00',nextMinutes:phase==='done'?20:0}}};

}});})();
