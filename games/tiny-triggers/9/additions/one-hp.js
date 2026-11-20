(function(){
"use strict";
TinyV9.register({"id":"one-hp","title":"One HP Too Many","chapter":"games","description":"Strike, then ready the finishing blow.","hint":"Press ATTACK twice. Hold the final attack while its cooldown refills. Your enemy needs one hit, too.","verdict":"One point. An entire tragedy.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

let phase='fight',hp=31,playerHp=6,cooldown=1,t=0,impact=0,enemyAttack=0,held=false,defeat=0,strikes=0;
function sword(x,y,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);api.poly([[-3,4],[-4,-37],[0,-50],[4,-37],[3,4]],'#d2e5d5');api.line(0,-42,0,4,'#77959e',1);api.line(-10,4,10,4,C.gold,4);api.line(0,5,0,18,'#815940',6);ctx.restore()}
return{draw(){
api.rect(0,0,480,270,'#182530');for(let y=18;y<174;y+=31){for(let x=-28+(y%2)*30;x<480;x+=62){api.round(x,y,59,28,2,'#293a45','#364d55')}}
api.poly([[0,173],[480,173],[480,270],[0,270]],'#394044');for(let x=-200;x<700;x+=70)api.line(240,170,x,270,'#5a5b53',1);for(let y=187;y<270;y+=21)api.line(0,y,480,y,'#55584e',1);
for(const x of [42,438]){api.rect(x-5,78,10,49,'#725241');api.poly([[x-12,82],[x-7,56],[x,68],[x+5,44],[x+14,78],[x+7,90]],'#e6a85d');api.ellipse(x,78,6,10,'#f1d78e')}
const px=139-(phase==='lost'?ease(defeat)*23:0),py=191+(phase==='lost'?ease(defeat)*12:0);
ctx.save();ctx.translate(px,py);if(phase==='lost')ctx.rotate(-ease(defeat)*1.3);person(0,0,1.3,'#739cb4');api.poly([[-13,-44],[0,-53],[13,-44],[10,-19],[-10,-19]],'#527b97');api.round(-14,-70,28,14,3,'#91aeba');api.line(-10,-64,10,-64,'#223945',3);sword(25,-20,impact*.9);ctx.restore();
const ex=339-Math.sin(enemyAttack*Math.PI)*85;
person(ex,188,1.6,'#934e5c',enemyAttack*7);api.poly([[ex-20,116],[ex-12,85],[ex-3,107],[ex+9,84],[ex+21,116]],'#866e85');api.ellipse(ex-5,117,3,2,'#f2c47e');api.ellipse(ex+7,117,3,2,'#f2c47e');sword(ex-28,161,-.5-enemyAttack*2);
panel(71,29,140,38);label('YOU',140,43,8);api.rect(83,51,116,6,'#122931');api.rect(83,51,116*playerHp/6,6,'#8bc9ac');label(playerHp+' HP',140,72,9);
panel(270,29,141,38);label('BOSS',340,43,8);api.rect(282,51,116,6,'#122931');api.rect(282,51,Math.max(3,116*hp/31),6,'#d77971');label(hp+' HP',340,72,11,hp===1?C.gold:C.paper);
if(phase==='lost'){panel(150,96,180,39,'#4d3541');label('DEFEATED',240,121,19,C.red)}
else{button(cooldown<1?'RECHARGING':'ATTACK',240,233,128,cooldown<1?'#40535d':'#537b72');api.rect(181,243,118,5,'#13252d');api.rect(181,243,118*cooldown,5,C.gold);if(hp===1)label('ONE MORE HIT...',240,211,10,C.gold)}
if(impact>.1){label('-15',337,94-impact*15,18,C.gold)}
},down(p){if(phase==='fight'&&hit(p,240,232,150,52)){held=true;if(cooldown>=1){hp=Math.max(1,hp-15);strikes++;impact=1;cooldown=0;api.tone(140,.13,.025);if(hp===1){phase='last';enemyAttack=0;api.say('One HP left. Your attack is nearly ready.')}}}},move(){},up(){held=false},cancel(){held=false},update(dt){t+=dt;impact=Math.max(0,impact-dt*2.5);if(phase==='fight')cooldown=Math.min(1,cooldown+dt*1.15);if(phase==='last'){cooldown=Math.min(.97,cooldown+dt*.36);if(cooldown>.84){enemyAttack+=dt*2.8;if(enemyAttack>=1){phase='lost';playerHp=0;api.tone(75,.4,.035);api.say('Your attack was 97% ready.')}}}if(phase==='lost'){defeat+=dt;if(defeat>1.1)api.done()}},debug(){return{phase,hp,playerHp,cooldown,strikes,held,enemyAttack}}};

}});})();
