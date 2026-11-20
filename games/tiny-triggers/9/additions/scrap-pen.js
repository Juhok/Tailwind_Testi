(function(){
"use strict";
TinyV9.register({"id":"scrap-pen","title":"The Pen That Only Works on Scrap Paper","chapter":"objects","description":"Write something nice on the card.","hint":"Pick up the pen and try writing on the card. Test it on the scrap paper, then try the card again.","verdict":"The pen has chosen its audience.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='card',pen={x:271,y:235},drag=false,last=null,cardTravel=0,scrapTravel=0,returnTravel=0,ink=[],t=0,settle=0;
const onCard=p=>p.x>68&&p.x<232&&p.y>110&&p.y<205,onScrap=p=>p.x>300&&p.x<434&&p.y>90&&p.y<203;
return{draw(){room();api.rect(0,61,480,209,'#786950');for(let y=72;y<270;y+=27)api.line(0,y,480,y,'#b59b6d2e',1);
api.poly([[56,77],[242,66],[252,219],[67,228]],'#38483e66');api.poly([[51,69],[237,61],[246,213],[62,221]],'#e1d5ad');api.poly([[51,69],[63,76],[72,216],[62,221]],'#c5bb92');api.line(64,77,73,211,'#b7ae89',1);label('HAPPY BIRTHDAY',153,100,12,'#956d65');for(const [x,y]of [[86,90],[215,87],[88,194],[219,190]]){api.line(x,y+5,x-3,y+16,'#7d9271',1);for(let i=0;i<5;i++){const a=i*Math.PI*.4;api.ellipse(x+Math.cos(a)*4,y+Math.sin(a)*4,3,3,'#bd8f81')}api.ellipse(x,y,2,2,'#d0ad69')}
for(let i=0;i<3;i++)api.line(104,137+i*20,210,137+i*20,'#b7b48d55',1);
api.poly([[294,83],[440,90],[435,209],[300,202]],'#c8ceb3');api.poly([[422,89],[440,90],[439,107]],'#a7b69c');for(let y=110;y<200;y+=15)api.line(307,y,430,y+5,'#8ca89e66',1);api.line(320,95,318,199,'#b58e8755',1);label('SCRAP',369,102,8,'#667e72');
if(ink.length>1){ctx.strokeStyle='#385575';ctx.lineWidth=1.8;ctx.lineCap='round';ctx.beginPath();ink.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke()}
api.ellipse(398,243,40,8,'#253b3a55');api.round(375,231,48,11,5,'#3d596a');api.line(381,233,413,233,'#8da99f',1);api.rect(416,232,6,9,'#bcc4a6');
ctx.save();ctx.translate(pen.x,pen.y);ctx.rotate(.55);api.poly([[-2,0],[2,0],[4,-12],[-4,-12]],'#c4c9ab');api.line(0,0,0,3,'#263b52',2);api.round(-5,-81,10,70,3,'#41617b');api.rect(-5,-34,10,11,'#a7b9ad');api.round(-4,-89,8,11,3,'#789789');api.line(-2,-79,-2,-39,'#92b6b0',1);api.line(5,-77,7,-58,'#b6c5ae',2);if(drag){api.ellipse(10,-39,13,7,'#d1a986');api.line(15,-42,38,-55,'#d1a986',17);api.ellipse(-2,-41,8,5,'#dabb96')}ctx.restore();
label(phase==='card'?'WRITE ON THE CARD':phase==='scrap'?'TEST IT ON THE SCRAP':phase==='return'?'IT WORKS! TRY THE CARD AGAIN.':'STILL NOTHING ON THE CARD.',240,258,10,C.gold);
},down(p){if(phase!=='settling'&&phase!=='done'&&hit(p,pen.x+21,pen.y-35,65,105)){drag=true;last={...pen}}},move(p){if(drag){pen={x:clamp(p.x,35,442),y:clamp(p.y,78,239)};const d=Math.hypot(pen.x-last.x,pen.y-last.y);if(phase==='card'&&onCard(pen)&&onCard(last)){cardTravel+=d;if(cardTravel>85){phase='scrap';api.say('No ink. Try the scrap paper.')}}else if(phase==='scrap'&&onScrap(pen)&&onScrap(last)){scrapTravel+=d;ink.push({...pen});if(scrapTravel>105){phase='return';api.say('Perfect ink on scrap. Back to the card.')}}else if(phase==='return'){if(onScrap(pen)&&onScrap(last))ink.push({...pen});if(onCard(pen)&&onCard(last))returnTravel+=d}last={...pen}}},up(){if(drag&&phase==='return'&&returnTravel>90){phase='settling';settle=0;pen={x:271,y:235};api.say('The scrap is covered. The card is untouched.');api.tone(330,.09,.015)}drag=false},cancel(){drag=false},update(dt){t+=dt;if(phase==='settling'){settle+=dt;if(settle>.8){phase='done';api.done()}}},debug(){return{phase,cardTravel,scrapTravel,returnTravel,inkPoints:ink.length,cardInk:0,drag}}};

}});})();
