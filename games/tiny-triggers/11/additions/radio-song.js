(function(){
"use strict";
TinyV9.register({"id":"radio-song","title":"The Song on Every Station","chapter":"tv","description":"Find a station playing literally anything else.","hint":"Drag the tuning knob clockwise to the next frequency. Let it tune, then turn it once more.","verdict":"Now available on every frequency.","exclusiveAudio":true,create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='playing',station=0,drag=false,start=0,turn=0,t=0,staticTime=0,playTime=0,noteTime=0,note=0;
const names=['MORNING FM','FRESH FM','CITY RADIO'],freq=['92.4','98.8','104.6'],melody=[392,440,392,330,392,440,523,440];
return{draw(){room();api.rect(0,0,480,147,'#2d4348');for(let x=15;x<480;x+=45)api.line(x,0,x,145,'#58706b22',2);api.ellipse(242,238,203,17,'#11252d');
api.line(363,71,424,19,'#99b3b0',4);api.ellipse(425,18,4,4,'#b8c4b7');api.round(59,53,362,184,15,'#5a4138','#a58362');for(let x=69;x<410;x+=13)api.line(x,62,x+4,227,'#9a735029',1);api.round(69,66,342,155,10,'#987b53');api.round(78,75,147,135,7,'#39484b','#d0b488');
for(let yy=84;yy<203;yy+=6)for(let xx=86;xx<219;xx+=7)api.ellipse(xx,yy,1.6,1.6,'#182b34');api.ellipse(151,144,48,48,'#c1b18311');api.ellipse(151,144,21,21,'#0a253233');
api.round(238,75,162,61,5,'#20363b');api.round(242,80,154,51,4,'#79a390');label(freq[station]+' MHz',319,101,17,'#243f3c');label(phase==='tuning'?'SEARCHING...':names[station],319,120,8,'#2b4c41');
api.rect(240,145,157,16,'#574f3e');for(let i=0;i<22;i++)api.line(245+i*7,148,245+i*7,151+(i%5===0?7:3),'#d7c896',1);api.line(254+station*58,145,254+station*58,160,'#e39d73',2);
api.ellipse(273,189,17,17,'#283c41');api.ellipse(271,187,14,14,'#bac2a7');api.line(271,178,276,186,'#4c6262',2);label('VOL',272,216,7,'#413e32');
api.ellipse(358,191,28,27,'#4d4c3d');api.ellipse(356,187,27,27,'#d0c8a0');api.ellipse(356,187,23,23,'#9fa88d');for(let i=0;i<24;i++){const a=i*Math.PI/12;api.line(356+Math.cos(a)*21,187+Math.sin(a)*21,356+Math.cos(a)*25,187+Math.sin(a)*25,'#e2d5a9',1)}
const a=-1.3+station*.8+turn;api.line(356+Math.cos(a)*12,187+Math.sin(a)*12,356+Math.cos(a)*21,187+Math.sin(a)*21,'#3b5454',3);label('TUNING',356,222,8,'#413e32');
if(phase!=='tuning'){const y=33+Math.sin(t*3)*2;label(station===2?'THE CHORUS. OF COURSE.':'"AGAIN, AGAIN, AGAIN..."',230,y,12,C.gold);for(let i=0;i<4;i++){const x=102+i*27;api.line(x,249,x,249-Math.abs(Math.sin(t*7+i))*8,'#a3c5a6',3)}}else label('KSHHH...',230,33,11,C.paper);
},down(p){if(phase==='playing'&&hit(p,356,187,74,74)){drag=true;start=p.x;turn=0}},move(p){if(drag)turn=clamp((p.x-start)/65,-.4,1.3)},up(){if(drag&&turn>.6&&station<2){station++;phase='tuning';staticTime=0;playTime=0;note=station===2?4:0;api.tone(170,.1,.01);api.say('Different station. Same song.')}drag=false;turn=0},cancel(){drag=false;turn=0},update(dt){t+=dt;if(phase==='tuning'){staticTime+=dt;if(staticTime>.7){phase='playing';noteTime=0}}else{playTime+=dt;noteTime-=dt;if(noteTime<=0){noteTime=.27;api.tone(melody[note++%8],.19,.028);if(station===2)api.tone(melody[(note+3)%8]/2,.2,.015)}if(station===2&&playTime>1.9)api.done()}},debug(){return{phase,station,frequency:freq[station],song:'Again again again',chorus:station===2,drag}}};

}});})();
