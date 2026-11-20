(function(){
"use strict";
TinyV9.register({"id":"waiting-room","title":"Rush to Wait","chapter":"waiting","description":"Make your appointment. Then take a seat.","hint":"Drag yourself to reception before taking the blue chair. Your appointment is at ten.","verdict":"Perfectly punctual. Unlike your appointment.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='rush',x=175,y=242,drag=false,t=0,minutes=0,wait=0;
return{draw(){room();api.rect(0,0,480,171,'#58706c');api.rect(0,171,480,5,'#afbaa0');
api.round(24,31,124,104,4,'#879b8b');api.rect(31,38,110,79,'#263e48');person(86,123,.9,'#aab5a1');api.rect(24,104,124,29,'#aab394');label('RECEPTION',86,121,10,'#354f48');api.rect(32,136,110,35,'#617b73');
api.round(172,62,91,123,3,'#9baa91');api.round(178,68,79,117,2,'#647f76');api.round(190,81,54,19,2,'#c2c9a8');label('CONSULTING',217,93,7,'#3b5e52');api.line(241,133,249,133,'#c6c8a4',3);
api.round(287,17,170,41,4,'#233b42');label('NOW CALLING',372,31,8,'#aac4ae');label('042',372,50,17,C.gold);
api.ellipse(216,28,22,22,'#d4d6b5');for(let i=0;i<12;i++){const a=i*Math.PI/6;api.ellipse(216+Math.sin(a)*18,28-Math.cos(a)*18,1,1,'#64796c')}const a=minutes/60*Math.PI*2;api.line(216,28,216+Math.sin(a)*17,28-Math.cos(a)*17,'#4e655e',2);const b=(10+minutes/60)/12*Math.PI*2;api.line(216,28,216+Math.sin(b)*11,28-Math.cos(b)*11,'#4e655e',3);
for(let i=0;i<3;i++){const cx=302+i*60;api.round(cx-22,133,43,49,7,i===0?'#769daf':'#81988a');api.round(cx-25,181,49,13,5,i===0?'#8eafbc':'#a1b398');api.line(cx-17,192,cx-19,222,'#a2afa4',5);api.line(cx+17,192,cx+19,222,'#a2afa4',5)}
person(422,221,1.2,'#ae9d82');api.round(407,178,32,12,2,'#d2c5a1');api.line(411,182,434,182,'#9b997e',1);
if(phase==='waiting'||phase==='done'){api.ellipse(302,122,13,17,'#d3ad8d');api.ellipse(301,112,14,9,'#5a4840');api.round(284,140,36,46,9,C.blue);api.line(289,184,281,217,'#354a60',9);api.line(314,184,321,217,'#354a60',9);api.line(283,151,279,181,'#d3ad8d',6);api.line(321,151,325,181,'#d3ad8d',6)}else person(x,y,1.25,C.blue,drag?t*12:0);
api.round(20,190,128,61,4,'#d2ceb0');label('APPOINTMENT 10:00',84,206,8,'#52655d');label('YOUR NUMBER: 043',84,222,8,'#52655d');label(phase==='rush'?'09:59':phase==='seat'?'10:00':'10:'+String(Math.floor(minutes)).padStart(2,'0'),84,242,14,'#816957');
if(phase==='done'){label('40 MINUTES LATER',337,249,12,C.gold)}else if(phase==='seat'){label('TAKE A SEAT',302,112,8,C.gold)}
},down(p){if((phase==='rush'||phase==='seat')&&hit(p,x,y-35,68,102))drag=true},move(p){if(drag){x=clamp(p.x,40,350);y=clamp(p.y+35,170,238)}},up(){if(drag){if(phase==='rush'&&x>61&&x<154&&y<205){phase='seat';x=165;y=230;api.say('Just in time. Please take a seat.')}else if(phase==='seat'&&Math.abs(x-302)<40){phase='waiting';wait=0;api.say('Your number is 043. The clock starts waiting with you.')}else{if(phase==='rush'){x=175;y=242}else{x=165;y=230}}}drag=false},cancel(){drag=false;if(phase==='rush'){x=175;y=242}else if(phase==='seat'){x=165;y=230}},update(dt){t+=dt;if(phase==='waiting'){wait+=dt;minutes=Math.min(40,wait*6);if(minutes===40){phase='done';api.done()}}},debug(){return{phase,minutes,called:42,yourNumber:43,drag}}};

}});})();
