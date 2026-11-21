(function(){
"use strict";
TinyV9.register({"id":"sports-recording","title":"The Recorded Sports Overrun","chapter":"tv","description":"Open the film you recorded last night.","hint":"Select THE LAST ORBIT, then drag the playback timeline toward the end to skip the sports overrun.","verdict":"Ninety minutes of not your film.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='library',minute=0,drag=false,t=0,end=0,pressed=false;
return{draw(){room();api.round(29,14,421,190,10,'#364e57','#8fa69a');api.round(40,25,399,166,5,'#152f3b');
if(phase==='library'){label('YOUR RECORDINGS',238,47,13,C.paper);api.round(65,63,140,110,6,'#4a6077');api.ellipse(136,103,27,27,'#97b7a8');api.ellipse(125,95,8,7,'#638c85');api.poly([[80,139],[97,126],[113,144],[160,130],[195,153],[195,164],[80,164]],'#253c4c');for(const [x,y]of [[79,82],[109,74],[179,87],[190,116]])sparkle(x,y,2,C.paper);label('THE LAST ORBIT',135,160,10);label('THE LAST ORBIT',313,92,15,C.gold);label('SCHEDULED FILM',313,113,9);label('90 MINUTES',313,130,9);api.poly([[300,146],[300,170],[322,158]],'#a9c5a6')}
else if(phase==='ended'){label('RECORDING ENDED',240,94,20,C.gold);label('The film never began.',240,126,12,C.paper);label('90:00 / 90:00',240,156,11,'#8caba4')}
else{api.rect(47,32,385,151,'#4e7d5e');for(let i=0;i<8;i++)api.rect(48+i*48,33,24,149,'#5b886429');api.rect(60,63,360,108,'#688e66');api.line(60,63,420,63,'#bac9a3',1);api.line(60,171,420,171,'#bac9a3',1);api.line(60,63,60,171,'#bac9a3',1);api.line(420,63,420,171,'#bac9a3',1);api.line(240,63,240,171,'#bac9a3',1);ctx.strokeStyle='#bac9a3';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(240,116,32,28,0,0,Math.PI*2);ctx.stroke();api.rect(61,91,30,49,'#ffffff10');api.line(91,91,91,140,'#bac9a3',1);api.line(390,91,390,140,'#bac9a3',1);for(let i=0;i<8;i++){const px=94+i*37+Math.sin(t*2+i)*14,py=115+(i%3-1)*28;person(px,py,.39,i%2?'#c98c78':'#a4c0b2',t*7)}api.ellipse(232+Math.sin(t*1.8)*58,138+Math.cos(t*2)*13,3,3,'#ebdfb7');api.round(58,37,137,19,3,'#243e47');label('HOME 2 : 2 AWAY',126,50,9);api.round(322,37,100,19,3,'#243e47');label('EXTRA TIME',372,50,9,C.gold);label('SPORTS OVERRUN',240,181,8,C.paper);}
api.rect(209,204,60,14,'#779289');api.round(172,216,135,8,3,'#a4b6a0');
api.round(49,231,382,29,5,'#233e49','#5c7a7a');api.rect(69,243,340,4,'#66847f');api.rect(69,243,340*minute/90,4,C.gold);api.ellipse(69+340*minute/90,245,6,8,'#d6d5ac');label(phase==='library'?'SELECT RECORDING':Math.floor(minute)+':00 / 90:00',240,231,8,C.paper);
},down(p){if(phase==='library'&&hit(p,239,117,365,124))pressed=true;else if(phase==='sports'&&hit(p,239,246,372,34))drag=true},move(p){if(drag)minute=clamp((p.x-69)/340*90,0,90)},up(){if(pressed){phase='sports';api.say('This is not the film. Try skipping forward.');api.tone(550,.08,.015)}if(drag&&minute>88){minute=90;phase='ended';end=0;api.say('The recording stops before the film starts.')}pressed=false;drag=false},cancel(){pressed=false;drag=false},update(dt){t+=dt;if(phase==='sports'&&!drag)minute=Math.min(87,minute+dt*.025);if(phase==='ended'){end+=dt;if(end>1.1)api.done()}},debug(){return{phase,minute,filmSeen:false,sports:phase==='sports',drag}}};

}});})();
