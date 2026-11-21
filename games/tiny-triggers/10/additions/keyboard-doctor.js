(function(){
"use strict";
TinyV9.register({"id":"keyboard-doctor","title":"The Keyboard Consultation","chapter":"clinic","description":"Explain what brought you in today.","hint":"Hold your seated character to explain your symptoms. Release to pause, and see whether the typing stops.","verdict":"Your symptoms have been entered into the keyboard.","exclusiveAudio":true,create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='explain',talk=false,spoken=0,t=0,paused=0,keystrokes=0,tick=0;
return{draw(){room();api.rect(0,0,480,168,'#526f6d');api.round(22,25,72,82,3,'#c4cdb0');label('A',58,45,18,'#415e55');label('N  E',58,64,12,'#415e55');label('F P T O',58,80,8,'#415e55');label('L C D Z P',58,94,6,'#415e55');api.round(181,20,103,46,3,'#889f8a');api.round(188,27,89,32,2,'#d1d1b2');label('MEDICAL OFFICE',232,42,8,'#5d7062');label('09:20 CONSULTATION',232,54,5,'#5d7062');
api.round(67,137,84,77,16,'#748f88');api.round(60,187,98,17,7,'#9fb39b');api.line(73,205,68,245,'#9aa999',5);api.line(145,205,150,245,'#9aa999',5);
api.ellipse(108,119,16,20,'#d8b192');api.ellipse(108,107,16,10,'#5b4641');api.line(109,119,114,119,'#6c4f40',2);api.ellipse(115,130,talk?4:3,talk?1+Math.abs(Math.sin(t*10))*3:1,'#825d4d');api.round(89,143,39,47,11,C.blue);api.line(94,189,83,236,'#354e62',10);api.line(120,189,134,236,'#354e62',10);api.line(90,154,80,183,'#d8b192',7);api.line(126,154,146,175,'#d8b192',7);
api.round(322,124,63,86,12,'#81968b');api.ellipse(350,104,15,19,'#ba9278');api.ellipse(351,93,15,11,'#5f5e53');api.line(351,107,360,109,'#334c4d',2);api.line(352,106,352,113,'#3d5554',1);api.line(360,108,360,115,'#3d5554',1);api.round(328,128,45,57,10,'#d5dcc0');api.poly([[340,130],[347,146],[353,130]],'#8caaa4');api.line(339,145,337,165,'#344f57',2);api.ellipse(337,166,4,4,'#577d82');api.line(330,143,317+Math.sin(t*19)*2,178,'#d5dcc0',11);api.line(370,143,359+Math.sin(t*23)*2,177,'#d5dcc0',11);
api.poly([[215,176],[446,176],[469,209],[191,209]],'#a19676');api.rect(197,210,266,11,'#807d64');api.line(211,221,208,260,'#697367',6);api.line(447,221,451,260,'#697367',6);
api.round(380,79,73,80,5,'#263f49','#91a59b');api.rect(387,86,59,64,'#5c837b');for(let i=0;i<9;i++)api.line(392,94+i*5,396+((i+Math.floor(t*4))%7)*6,94+i*5,'#a3c0a2',1);api.line(414,159,414,175,'#829b95',6);api.round(395,173,41,6,2,'#acb79e');
api.poly([[294,179],[373,179],[385,198],[285,198]],'#465d64');for(let r=0;r<3;r++)for(let k=0;k<10;k++)api.rect(296+k*7-r*3,181+r*5,5,3,(k+Math.floor(t*17))%7===0?'#dbc995':'#8caaa0');api.ellipse(316,179+Math.sin(t*18)*1.2,10,4,'#c7a086');api.ellipse(357,180+Math.sin(t*23)*1.2,10,4,'#c7a086');
if(talk){api.round(105,47,184,39,7,'#d4d5b4');api.poly([[121,84],[134,84],[118,100]],'#d4d5b4');label(spoken<1?'I have been feeling...':'...and it started last week.',198,70,10,'#405d54')}
else if(phase==='pause'||phase==='done'){api.round(133,87,131,29,10,'#c0c9ad');api.ellipse(127,121,4,4,'#c0c9ad');api.ellipse(121,129,2,2,'#c0c9ad');label('Are they listening?',199,105,8,'#435d56')}
label('TIK TIK TIK',356,243,10,C.gold);if(phase==='explain'&&!talk)label('HOLD TO EXPLAIN',99,259,9,C.gold);
},down(p){if(phase==='explain'&&hit(p,108,156,93,116))talk=true},move(){},up(){if(talk&&spoken>=1.8){phase='pause';paused=0;api.say('You stop talking. The keyboard does not.')}talk=false},cancel(){talk=false},update(dt){t+=dt;tick+=dt;if(tick>.16){tick=0;keystrokes++;api.tone(180+keystrokes%4*17,.025,.009)}if(talk)spoken+=dt;if(phase==='pause'){paused+=dt;if(paused>2.3){phase='done';api.done()}}},debug(){return{phase,talk,spoken,keystrokes,lookedUp:false,paused}}};

}});})();
