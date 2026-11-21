(function(){
"use strict";
TinyV9.register({"id":"caps-lock","title":"Caps Lock at Login","chapter":"digital","description":"Type the password carefully. Every single letter.","hint":"Hold the keyboard to type the fictional password, press SIGN IN, then use the eye icon to inspect the rejected entry.","verdict":"Perfect accuracy. Precisely the wrong case.",create(api){
const {ctx}=api;
const C={ink:'#13232d',paper:'#e5dcc0',mint:'#8fcbb5',gold:'#e5b96e',red:'#d97f77',blue:'#7cacc5'};
const clamp=api.clamp,hit=api.hit; const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
function panel(x,y,w,h,c='#263f4b'){api.round(x,y,w,h,7,c,'#617c82');api.line(x+6,y+2,x+w-7,y+2,'#a0bab333',1)}
function label(s,x,y,size=10,c=C.paper){api.text(s,x,y,size,c)}
function button(s,x,y,w=96,c='#477d7a'){api.round(x-w/2,y-15,w,30,5,'#162932');api.round(x-w/2,y-18,w,28,5,c,'#9fb9a0');label(s,x,y,10)}
function person(x,y,scale=1,color='#83aeb4',pose=0){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);api.ellipse(1,5,12,4,'#101c2580');api.line(-4,-13,-6+Math.sin(pose)*5,2,'#293b51',6);api.line(4,-13,6-Math.sin(pose)*5,2,'#293b51',6);api.round(-9,-35,18,24,5,color);api.line(-9,-29,-13-Math.sin(pose)*4,-15,'#c39b7d',5);api.line(9,-29,13+Math.sin(pose)*4,-15,'#c39b7d',5);api.ellipse(0,-44,8,10,'#d4ae8d');api.ellipse(0,-49,8,6,'#4c3d39');api.line(2,-43,5,-43,'#513e36',1);ctx.restore()}
function room(kind='desk'){api.bg(kind);api.line(0,154,480,154,'#77918b',2);for(let x=15;x<480;x+=74)api.line(x,171,x+28,269,'#78908713',1)}
function sparkle(x,y,r=6,c=C.gold){api.line(x-r,y,x+r,y,c,1.5);api.line(x,y-r,x,y+r,c,1.5)}

const sample='PixelMoonRiver42!',entered=[...sample].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join('');
let phase='typing',typed=0,hold=false,t=0,pressed=null,wait=0,revealed=false;
function eye(x,y){ctx.strokeStyle='#a8c0ad';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-12,y);ctx.quadraticCurveTo(x,y-12,x+12,y);ctx.quadraticCurveTo(x,y+12,x-12,y);ctx.stroke();api.ellipse(x,y,4,4,'#a8c0ad')}
return{draw(){room();api.round(35,14,410,168,9,'#344f59','#839e94');api.round(45,24,390,147,5,'#1d3745');label('NIGHT DESK',240,48,17,C.paper);label('PLAYER ACCOUNT',240,64,8,'#8fab9f');api.round(88,78,304,37,5,'#102b38','#668b87');
if(revealed)api.text(entered,103,101,14,'#e5b88c','left');else for(let i=0;i<Math.floor(typed);i++)api.ellipse(108+i*12,97,3,3,'#d2d8b8');eye(372,97);
if(phase==='error'||phase==='reveal'||phase==='done')label('Incorrect password.',240,131,11,C.red);else if(phase==='checking')label('CHECKING...',240,131,10,C.paper);else label('Type carefully...',240,131,9,'#8eaaa0');
if(!revealed&&phase!=='error')button('SIGN IN',240,151,116,phase==='ready'?'#638b7c':'#405f68');else if(revealed){label('CAPS LOCK REVERSED THE CASE',240,156,10,C.gold)}
api.rect(215,182,49,15,'#80978d');api.round(186,196,108,7,3,'#a7b6a1');
api.poly([[59,211],[414,211],[438,265],[36,265]],'#415e65');for(let r=0;r<4;r++)for(let k=0;k<13;k++){const xx=76+k*25-r*4,yy=218+r*10;api.round(xx,yy,20,7,1,hold&&(Math.floor(t*18)+k+r)%11===0?'#e0c789':'#809e97');if(r<3)label('QWERTYUIOPASDF'[k],xx+10,yy+6,4,'#294b4e')}
api.round(43,238,34,17,2,revealed?'#c6ab6e':'#718d85');label('CAPS',60,249,6,'#284c4b');api.ellipse(67,241,1.5,1.5,revealed?'#ffe3a2':'#b8cb97');api.round(154,252,157,7,2,'#9bb4a5');if(phase==='typing')label('HOLD THE KEYBOARD TO TYPE',240,205,8,C.gold);
},down(p){if(phase==='typing'&&hit(p,239,239,399,56))hold=true;else if(phase==='ready'&&hit(p,240,148,135,37))pressed='login';else if(phase==='error'&&hit(p,372,97,47,47))pressed='reveal'},move(p){if(hold&&!hit(p,239,239,410,69))hold=false},up(p){hold=false;if(pressed==='login'&&hit(p,240,148,135,37)){phase='checking';wait=0;api.tone(430,.08,.015)}if(pressed==='reveal'&&hit(p,372,97,47,47)){revealed=true;phase='reveal';wait=0;api.say('Caps Lock. Every letter in the opposite case.')}pressed=null},cancel(){hold=false;pressed=null},update(dt){t+=dt;if(hold&&phase==='typing'){typed=Math.min(sample.length,typed+dt*7);if(Math.floor(t*14)!==Math.floor((t-dt)*14))api.tone(170,.02,.006);if(typed===sample.length){phase='ready';hold=false}}if(phase==='checking'){wait+=dt;if(wait>.7){phase='error';api.say('Incorrect password. Use the eye to see why.');api.tone(150,.13,.018)}}if(phase==='reveal'){wait+=dt;if(wait>1){phase='done';api.done()}}},debug(){return{phase,typed:Math.floor(typed),revealed,capsLock:true,fictional:true,caseReversed:entered!==sample,hold}}};

}});})();
