(() => {
 'use strict';
 TinyV7.register({id:'light-switch',title:'The Unreliable Light Switch',chapter:'home',description:'Turn on the light. It only needs a little encouragement.',hint:'Drag the switch upward and release. After the flash, hold it halfway between ON and OFF until the room lights up, then let go.',verdict:'A perfectly functional finger-powered lamp.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
  let phase=0,t=0,age=0,drag=false,pos=158,held=0,litOnce=false,brightness=0,finished=false,canceled=0;
  const target=p=>hit(p,108,139,74,93),sweet=()=>Math.abs(pos-136)<10;
  function draw(){
   rect(0,0,480,270,'#172638');
   const wall=ctx.createLinearGradient(0,0,0,220);wall.addColorStop(0,'#293b4b');wall.addColorStop(1,'#3b4954');rect(180,0,300,223,wall);
   for(let i=0;i<5;i++)line(184+i*64,0,184+i*64,220,'#46535c',1);rect(180,219,300,8,'#69747a');rect(180,227,300,43,'#5a5a57');
   for(let i=0;i<7;i++)line(180+i*50,228,140+i*65,270,'#41494b',1);line(180,247,480,247,'#41494b',1);
   // Reading chair, bookshelf and picture remain visible in the dark.
   round(281,161,116,70,16,'#6a6d71');round(295,173,90,45,9,'#8a8580');round(275,194,22,44,8,'#565f68');round(382,194,22,44,8,'#565f68');round(294,217,90,20,5,'#777a79');rect(292,237,8,15,'#3d4349');rect(382,237,8,15,'#3d4349');poly([[303,181],[328,178],[338,204],[310,209]],'#b19b7d');line(308,185,326,182,'#d2bc95',1);
   round(423,116,50,118,2,'#5e594f');rect(428,122,40,106,'#293b49');for(let row=0;row<3;row++){for(let n=0;n<4;n++){const x=431+n*8,y=128+row*31;rect(x,y+(n%2)*4,6,23-(n%2)*4,['#718d8a','#ad9177','#867c8b','#bdad84'][n]);line(x+1,y+5,x+5,y+5,'#d3c4a1',1);}rect(427,153+row*31,42,4,'#827664');}
   round(207,88,45,57,3,'#96816a');rect(211,92,37,49,'#b4ada0');poly([[211,128],[224,106],[237,129],[248,119],[248,141],[211,141]],'#6c847c');ellipse(237,103,5,5,'#ded0a4');
   if(brightness>0){const glow=ctx.createRadialGradient(344,88,5,344,124,170);glow.addColorStop(0,`rgba(255,226,158,${brightness*.55})`);glow.addColorStop(1,'rgba(255,223,145,0)');rect(182,0,298,270,glow);}
   // Pendant bulb with a visible filament and glow.
   line(344,0,344,47,'#101d2b',4);round(335,44,18,20,3,'#7b8c8d');for(let i=0;i<3;i++)line(335,49+i*4,353,49+i*4,'#3f5665',1.5);
   ellipse(344,77,16,20,brightness>.3?'#f5de9d':'#7c8c8b');ellipse(344,76,12,16,brightness>.3?'#fff0b3':'#a7b3a6');line(338,68,341,86,brightness>.3?'#d6a255':'#607980',1);line(350,68,347,86,brightness>.3?'#d6a255':'#607980',1);line(341,86,347,86,'#9b906c',1.5);
   if(brightness<.9)rect(180,0,300,270,`rgba(7,19,34,${.53*(1-brightness)})`);
   // Oversized close-up switch, with tactile bevels and screws.
   rect(0,0,180,270,'#26394a');rect(176,0,5,270,'#111f30');round(48,65,121,160,9,'#17283a');round(43,59,121,160,9,'#9ca9a5','#c3c9b6');round(50,66,107,145,7,'#b8beb0');
   for(const y of [77,199]){ellipse(104,y,4,4,'#738b91');line(101,y,107,y,'#d2d6c2',1);}
   text('ON',107,98,9,'#536d77');text('OFF',107,184,9,'#536d77');round(78,107,57,65,5,'#415d6d');
   const lift=(158-pos)/42;poly([[82,110],[131,110],[131,167-lift*5],[82,167+lift*2]],'#738c94');
   round(83,111+lift*4,47,51-lift*4,4,drag?'#d6d9bb':'#c5cbb8');line(85,pos,127,pos,'#7d9696',2);round(98,pos-3,17,6,2,sweet()&&phase>=2?'#e1c98e':'#a3b4a5');
   if(drag){ctx.beginPath();ctx.moveTo(166,257);ctx.bezierCurveTo(155,218,142,pos+5,119,pos+4);ctx.lineTo(112,pos+4);ctx.bezierCurveTo(101,pos+2,103,pos-9,116,pos-8);ctx.bezierCurveTo(144,pos-10,166,207,183,252);ctx.closePath();ctx.fillStyle='#d8b093';ctx.fill();round(107,pos-6,13,6,3,'#ead1ae');line(144,pos+34,152,pos+31,'#b28c79',1);}
   if(phase===2||phase===3){text(sweet()&&drag?'THERE. HOLD IT…':'A LITTLE NUDGE?',104,239,8.5,'#d8c7a1');}
   if(phase===4)text('FINGER REMOVED. LIGHT REMOVED.',325,257,8,'#c7c5b2');
  }
  return{draw,down(p){if((phase===0||phase===2||phase===3)&&target(p)){drag=true;held=0;}},move(p){if(drag)pos=clamp(p.y,112,163);},up(){if(!drag)return;drag=false;if(phase===0&&pos<133){phase=1;age=0;pos=116;api.tone(560,.045,.012);}else if((phase===2||phase===3)&&litOnce&&held>.45){phase=4;age=0;pos=116;brightness=0;api.say('It works beautifully, as long as your finger lives there.');}else{pos=phase===0?158:116;held=0;litOnce=false;if(phase===3)phase=2;}},cancel(){if(!drag)return;canceled++;drag=false;held=0;litOnce=false;brightness=0;pos=phase===0?158:116;if(phase===3)phase=2;},update(dt){t+=dt;if(phase===1){age+=dt;brightness=age<.3?1:Math.max(0,1-(age-.3)*8);if(age>.7){phase=2;brightness=0;api.say('Try holding the switch halfway.');}}else if(phase===2||phase===3){if(drag&&sweet()){held+=dt;brightness=Math.min(1,brightness+dt*7);if(held>.45){litOnce=true;phase=3;}}else{brightness=Math.max(0,brightness-dt*10);held=0;}}else if(phase===4&&!finished){age+=dt;if(age>.7){finished=true;api.done();}}},debug(){return{phase,pos,drag,held,litOnce,brightness,canceled,finished};}};
 }
 });
})();
