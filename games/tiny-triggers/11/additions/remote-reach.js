(function(){
"use strict";
TinyV9.register({"id":"remote-reach","title":"The Remote Just Out of Reach","chapter":"objects","description":"There it is. You can almost touch it.","hint":"Drag your hand down behind the sofa to look underneath. Reach right toward the remote until your fingertips touch it.","verdict":"Successfully located. Less successfully retrieved.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='look',hand={x:114,y:151},remote=263,view=0,drag=false,t=0,slide=0,touched=false;
function remoteArt(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(-.13);api.ellipse(1,4,39,7,'#10252c');api.round(-35,-9,70,18,5,'#324f5e','#6b8b8a');api.ellipse(-25,0,4,4,'#cb877b');for(let i=0;i<4;i++)for(let j=0;j<2;j++)api.round(-13+i*11,-6+j*7,7,4,1,'#a8b99f');api.line(-30,-7,29,-7,'#859f9555',1);ctx.restore()}
return{draw(){room();api.rect(0,150,480,120,'#7a6c55');for(let i=0;i<8;i++)api.line(0,164+i*17,480,164+i*17,'#a08e6944',1);api.poly([[0,244],[299,244],[325,270],[0,270]],'#637d74');for(let i=0;i<8;i++)api.line(8+i*35,245,15+i*35,268,'#92ac8f',1);
api.rect(160,190-view*17,294,45+view*17,'#192c30');api.rect(187,206,251,29,'#223337');remoteArt(remote,218);
ctx.save();ctx.translate(0,-view*18);api.ellipse(303,223,148,12,'#15272d66');api.round(168,35,269,125,22,'#527b79','#86a69a');api.round(178,46,118,91,16,'#6d9690');api.round(303,46,124,91,16,'#648e87');api.line(189,55,285,55,'#a0b4a35c',1);api.line(314,55,417,55,'#a0b4a35c',1);api.round(169,135,266,51,13,'#789b88');api.line(301,142,301,181,'#486f69',2);api.round(150,124,39,70,14,'#8ca58a');api.round(417,123,39,70,14,'#8ca58a');api.round(160,186,287,28,8,'#52766b');api.line(170,191,436,191,'#8fa48c',2);api.line(177,212,174,235,'#605a48',9);api.line(435,212,439,235,'#605a48',9);ctx.restore();
// Reaching hand is drawn above the gap; the finger, not a magnet, contacts the remote.
ctx.save();ctx.translate(hand.x,hand.y);api.poly([[-112,39],[-112,7],[-45,-3],[-24,2],[-23,28],[-53,34]],'#d2ab86');api.round(-45,-7,40,35,10,'#d2ab86');api.round(-15,-8,23,9,4,'#ddb996');api.round(-17,3,19,8,4,'#d7b18c');api.round(-22,14,17,8,4,'#d7b18c');api.round(-40,-20,19,22,7,'#d7b18c');api.line(-11,-5,3,-5,'#ecd0ac',1);api.line(-38,16,-23,19,'#b48c70',1);ctx.restore();
if(phase==='look'){label('LOOK BEHIND THE SOFA',245,254,10,C.gold);api.line(111,188,111,204,'#b7c8a0',2);api.poly([[105,199],[117,199],[111,208]],'#b7c8a0')}else if(phase==='found'){sparkle(remote-25,217,4,C.gold);label('FINGERTIPS AWAY...',245,255,10,C.gold)}else label('NOW IT IS EVEN FARTHER UNDER.',245,255,10,C.gold);
},down(p){if((phase==='look'||phase==='found')&&hit(p,hand.x-20,hand.y+8,108,76))drag=true},move(p){if(drag){hand.x=clamp(p.x,103,235);hand.y=clamp(p.y,144,219);if(phase==='look')view=clamp((hand.y-151)/62,0,1);else if(hand.x>224&&hand.y>204){touched=true;phase='sliding';slide=0;drag=false;hand={x:230,y:215};api.tone(240,.07,.018);api.say('Your fingertip nudged it farther underneath.')}}},up(){if(drag&&phase==='look'){if(view>.8){phase='found';view=1;hand={x:173,y:212};api.say('There is the remote. Reach toward it.')}else{view=0;hand={x:114,y:151}}}drag=false},cancel(){drag=false;if(phase==='look'){view=0;hand={x:114,y:151}}},update(dt){t+=dt;if(phase==='sliding'){slide+=dt;remote=263+112*ease(slide/.8);if(slide>1.5){phase='done';api.done()}}},debug(){return{phase,hand:{...hand},remote,view,touched,drag}}};

}});})();
