(function(){
"use strict";
TinyV9.register({"id":"glasses-smear","title":"The Expanding Fingerprint","chapter":"wardrobe","description":"Give that fingerprint a quick wipe.","hint":"Drag the cloth over the marked left lens, then rub back and forth. Release the cloth to inspect your work.","verdict":"A fingerprint with ambitious expansion plans.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='spot',cloth={x:391,y:214},drag=false,last=null,wiped=0,haze=0,t=0,settle=0;
function lens(cx,dirty){ctx.save();ctx.beginPath();ctx.ellipse(cx,145,66,42,0,0,Math.PI*2);ctx.clip();api.rect(cx-68,100,136,90,'#83b5bf20');api.poly([[cx-55,111],[cx-29,108],[cx+24,180],[cx+1,183]],'#d9ead93a');for(let y=110;y<185;y+=10)api.line(cx-65,y,cx+65,y,'#63877e30',1);
if(dirty){if(haze<.15){ctx.save();ctx.translate(cx+2,143);ctx.rotate(-.24);for(let i=0;i<6;i++){ctx.strokeStyle='#d8ddbe66';ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,0,3+i*2.2,5+i*2.5,0,.3,Math.PI*1.8);ctx.stroke()}ctx.restore()}if(haze>0){api.ellipse(cx,145,66*haze,42*haze,'#d9ddba66');ctx.globalAlpha=haze*.8;for(let i=0;i<9;i++){ctx.strokeStyle=i%2?'#eee5be99':'#a7ba9966';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx-8+i*4,145,9+i*8,5+i*5,-.14,.1,Math.PI*1.9);ctx.stroke()}api.poly([[cx-70,128],[cx+35,106],[cx+65,132],[cx-45,177]],'#d6dcba35');ctx.globalAlpha=1}}
ctx.restore();ctx.strokeStyle='#33494d';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(cx,145,69,45,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#92a699';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx-1,143,68,44,0,Math.PI,Math.PI*1.8);ctx.stroke()}
return{draw(){room();api.rect(0,84,480,186,'#86745b');for(let y=91;y<270;y+=27){api.line(0,y,480,y,'#a694703b',1);api.line(40,y+11,146,y+12,'#5c635644',1)}api.poly([[101,98],[283,71],[339,180],[148,215]],'#c2c4a3');for(let i=0;i<10;i++)api.line(121+i*14,96-i*2,163+i*15,204-i*2,'#8c9f8b',1);for(let i=0;i<8;i++)api.line(117+i*6,104+i*13,285+i*5,80+i*13,'#8c9f8b',1);
api.ellipse(242,193,165,17,'#223c3b66');api.line(105,138,77,75,'#30494d',7);api.line(77,75,98,54,'#30494d',7);api.line(376,138,415,77,'#30494d',7);api.line(415,77,404,55,'#30494d',7);api.line(108,137,79,77,'#849e94',2);api.line(375,136,414,78,'#849e94',2);
lens(170,true);lens(310,false);ctx.strokeStyle='#33494d';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(238,139);ctx.quadraticCurveTo(240,128,243,139);ctx.stroke();api.ellipse(229,154,4,7,'#a7b8a280');api.ellipse(251,154,4,7,'#a7b8a280');
ctx.save();ctx.translate(cloth.x,cloth.y);if(drag)ctx.rotate(-.12);api.poly([[-43,-21],[24,-29],[43,15],[-25,29]],'#8fa4b0');api.poly([[-43,-21],[-9,-10],[43,15],[-25,29]],'#a9bcc0');api.poly([[-9,-10],[13,-16],[43,15]],'#788e9e');for(let i=0;i<6;i++)api.line(-30+i*10,-20,-19+i*9,22,'#d1d9cd33',1);api.line(-36,-16,-24,24,'#ced7c655',1);if(drag){api.ellipse(19,-17,14,6,'#d4ad88');api.line(25,-18,53,-32,'#d4ad88',15)}ctx.restore();
label(phase==='done'?'NOW THE ENTIRE LENS IS GREASY.':'JUST ONE LITTLE FINGERPRINT.',240,253,10,C.gold);
},down(p){if((phase==='spot'||phase==='wiping')&&hit(p,cloth.x,cloth.y,98,76)){drag=true;last={...cloth};phase='wiping'}},move(p){if(drag){const on=(q)=>((q.x-170)/65)**2+((q.y-145)/43)**2<1;cloth={x:clamp(p.x,38,440),y:clamp(p.y,37,236)};if(on(cloth)&&on(last)){wiped+=Math.hypot(cloth.x-last.x,cloth.y-last.y);haze=clamp(wiped/160,0,1)}last={...cloth}}},up(){if(drag){cloth={x:391,y:214};if(haze>.94){haze=1;phase='settling';settle=0;api.say('It is definitely larger now.');api.tone(330,.12,.016)}}drag=false},cancel(){drag=false;cloth={x:391,y:214}},update(dt){t+=dt;if(phase==='settling'){settle+=dt;if(settle>.7){phase='done';api.done()}}},debug(){return{phase,haze,wiped,drag,otherLensClear:true}}};

}});})();
