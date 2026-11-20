(function(){
"use strict";
TinyV9.register({"id":"black-sweets","title":"Only the Black Sweets Left","chapter":"snacks","description":"Share the sweets. Save the red one for yourself.","hint":"Slide the bag into the middle of the table, then drag your hand toward the last red sweet.","verdict":"A generous selection of one colour.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='share',bag={x:103,y:149},hand={x:94,y:226},drag=null,t=0,take=0,red=true,friend=0;
function sweet(x,y,c){api.ellipse(x,y+4,10,4,'#182c3077');api.round(x-8,y-7,16,13,5,c,'#65766a');api.line(x-4,y-4,x+2,y-4,'#e2e5c555',2)}
function palm(x,y,reverse=false){ctx.save();ctx.translate(x,y);if(reverse)ctx.rotate(Math.PI);api.poly([[-16,48],[19,48],[14,8],[-13,8]],reverse?'#c58f75':'#d7b08c');api.round(-17,-6,34,27,10,reverse?'#c58f75':'#d7b08c');for(let i=0;i<4;i++)api.round(-16+i*8,-22-(i===1?4:0),7,25,4,reverse?'#c58f75':'#d7b08c');api.round(-25,0,13,24,5,reverse?'#c58f75':'#d7b08c');for(let i=0;i<3;i++)api.line(-11+i*8,-13,-7+i*8,-13,'#aa8067',1);ctx.restore()}
return{draw(){room('kitchen');api.rect(0,90,480,180,'#71654f');for(let i=0;i<7;i++)api.line(0,104+i*25,480,104+i*25,'#92816344',1);api.ellipse(251,196,95,18,'#333c3480');
ctx.save();ctx.translate(bag.x,bag.y);api.poly([[-49,-69],[37,-68],[45,38],[27,50],[-40,46]],'#9b765b');api.poly([[-49,-69],[-33,-77],[42,-75],[37,-68]],'#d9c799');api.poly([[-49,-69],[-37,-61],[32,-62],[37,-68]],'#283a34');api.poly([[-39,-55],[32,-54],[36,31],[-33,36]],'#d0af76');for(let i=0;i<10;i++)api.line(-36+i*7,-70,-36+i*7,-63,'#a89064',1);api.round(-31,-44,61,24,4,'#804e57');label('SWEET MIX',0,-28,9);api.ellipse(0,7,25,23,'#c5c3a273');for(let i=0;i<8;i++)sweet(-14+(i%3)*13,-6+Math.floor(i/3)*13,phase==='share'?['#d58476','#c6ab67','#677e6a'][i%3]:'#2d3433');api.line(-42,-46,-34,33,'#e2c994',2);api.line(34,-48,39,29,'#715941',2);ctx.restore();
if(phase!=='share'){for(const [x,y]of [[209,190],[235,203],[264,211],[296,202],[319,183],[333,212]])sweet(x,y,'#2c3334');if(red)sweet(280,170,'#db756b');if(phase==='reach')sparkle(280,151,5,C.gold);}
if(phase!=='share')palm(hand.x,hand.y);
if(phase==='taken'||phase==='done'){const u=ease(Math.min(1,take/.65));const fx=396-(396-280)*(1-u),fy=68+(170-68)*(1-u);palm(fx,fy,true);sweet(fx,fy+9,'#db756b');label('THANKS!',412,94,10,C.gold);label('ONLY BLACK SWEETS LEFT',240,254,11,C.paper)}
else{api.round(369,19,65,40,11,'#b88d77');api.line(394,48,370,103,'#c58f75',21);label('YOUR FRIEND',402,16,8,C.paper)}
if(phase==='share')label('SLIDE THE BAG OVER',240,250,10,C.gold);else if(phase==='reach')label('THE LAST RED ONE...',137,250,10,C.gold);
},down(p){if(phase==='share'&&hit(p,bag.x,bag.y,104,140))drag='bag';else if(phase==='reach'&&hit(p,hand.x,hand.y,72,80))drag='hand'},move(p){if(drag==='bag'){bag.x=clamp(p.x,75,230);bag.y=clamp(p.y,110,185)}if(drag==='hand'){hand.x=clamp(p.x,50,315);hand.y=clamp(p.y,145,233);if(hand.x>231&&Math.abs(hand.y-170)<35){phase='taken';red=false;take=0;drag=null;api.tone(740,.09,.018);api.say('Your friend got the last red sweet.')}}},up(){if(drag==='bag'){if(bag.x>181){phase='reach';bag={x:159,y:143};api.say('Reach for your favourite colour.')}else bag={x:103,y:149}}if(drag==='hand')hand={x:94,y:226};drag=null},cancel(){if(drag==='bag')bag={x:103,y:149};if(drag==='hand')hand={x:94,y:226};drag=null},update(dt){t+=dt;if(phase==='taken'){take+=dt;if(take>1.7){phase='done';api.done()}}},debug(){return{phase,red,blackSweets:6,drag,hand:{...hand}}}};

}});})();
