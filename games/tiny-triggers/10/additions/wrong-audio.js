(() => {
 'use strict';
 TinyV7.register({id:'wrong-audio',title:'The Wrong Audio Output',chapter:'digital',exclusiveAudio:true,
 description:'Put on your headphones and launch the game.',hint:'Drag the headphones from their stand onto the person, press Launch, then open the little AUDIO button on the game screen.',verdict:'The only thing making noise is the wrong choice.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
  let phase=0,t=0,age=0,drag=false,hx=419,hy=200,press='',wearing=false,finished=false,canceled=0;
  const launch=p=>hit(p,264,126,115,32),settings=p=>hit(p,341,63,56,27);
  function headphone(x,y,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.beginPath();ctx.ellipse(0,-3,23,29,0,Math.PI,Math.PI*2);ctx.strokeStyle='#192f44';ctx.lineWidth=10;ctx.stroke();ctx.beginPath();ctx.ellipse(0,-5,23,29,0,Math.PI,Math.PI*2);ctx.strokeStyle='#8cacae';ctx.lineWidth=5;ctx.stroke();round(-29,-10,13,29,5,'#749497','#c5d0bc');round(16,-10,13,29,5,'#749497','#c5d0bc');round(-25,-6,6,22,3,'#182d42');round(19,-6,6,22,3,'#182d42');ctx.restore();}
  function draw(){
   api.bg('desk');rect(0,0,480,187,'#1c2b3c');rect(0,178,480,9,'#4a5c66');
   // Secondary monitor: selected by the fictional game despite its unused state.
   round(395,54,73,64,5,'#526978','#84999d');round(400,59,63,53,2,'#101b2b');line(431,118,431,137,'#687e86',7);round(408,136,47,5,2,'#647b83');text('UNUSED',432,86,8,'#647d8a');
   for(let i=0;i<7;i++)ellipse(413+i*6,114,1,1,'#183044');ellipse(457,114,1.5,1,'#536d77');
   // Player, seen over the shoulder. Headphones visibly settle onto both ears.
   ellipse(75,249,60,13,'#101c2a');round(24,173,102,80,21,'#3b5164');poly([[35,197],[54,158],[94,158],[121,200],[121,253],[28,253]],'#9b7c74');round(63,136,23,33,5,'#c69e83');ellipse(75,115,27,35,'#d6b195');ellipse(48,120,5,9,'#d6b195');ellipse(102,120,5,9,'#d6b195');poly([[48,105],[50,82],[68,72],[90,78],[102,91],[102,106],[90,96],[65,91]],'#564b4b');
   if(wearing)headphone(75,116,1.14);
   line(108,190,164,213,'#b38e7c',15);round(153,206,29,13,6,'#d8b094');
   // Main game monitor and keyboard.
   round(140,25,244,163,7,'#5b7381','#a5b6b0');round(147,32,230,148,3,'#132c45');
   const sky=ctx.createLinearGradient(0,34,0,177);sky.addColorStop(0,'#294967');sky.addColorStop(1,'#897d7c');rect(151,36,222,139,sky);
   ellipse(196,72,13,13,'#d2c7a0');poly([[151,141],[195,98],[224,126],[264,85],[315,134],[351,103],[373,143],[373,175],[151,175]],'#355568');rect(151,154,222,21,'#5b7673');
   for(let i=0;i<12;i++){rect(154+i*19,157,15,3,'#809586');line(154+i*19,160,151+i*19,175,'#3b5b61');}
   const rx=phase>=2?194+Math.sin(t)*10:194;rect(rx,124,10,21,'#d5a675');rect(rx-3,118,16,9,'#c6bc99');rect(rx,145,4,10,'#dbe0c0');rect(rx+7,145,4,10,'#dbe0c0');
   if(phase>=2){for(let i=0;i<5;i++)rect(164+i*6,48+Math.sin(t*5+i)*5,3,14-Math.sin(t*5+i)*5,'#cbbd85');text('MUSIC',198,63,7,'#dfd1aa');}
   round(249,187,25,19,2,'#536d79');round(221,204,83,6,3,'#819495');poly([[174,216],[355,216],[374,241],[158,241]],'#708a94');for(let j=0;j<3;j++)for(let i=0;i<12;i++)rect(179+i*14-j*5,220+j*6,10,3,'#30495f');
   round(403,229,32,6,4,'#567281');line(419,232,419,193,'#6d8790',6);round(402,188,34,6,3,'#6d8790');
   if(!wearing)headphone(hx,hy);
   if(phase<2){round(194,109+(press==='launch'?2:0),140,36,5,wearing?'#b5bca0':'#536c79');text(wearing?'Launch game':'Headphones first',264,132+(press==='launch'?2:0),11,wearing?'#233b47':'#c0ceca');}
   if(phase===2){round(313,49+(press==='settings'?2:0),56,27,4,'#aec0ae');text('AUDIO',341,67+(press==='settings'?2:0),9,'#29404b');round(36,39,79,24,4,'#344a5b');text('NO SOUND',75,55,9,'#e7c2a8');}
   if(phase===3){
    round(153,43,218,127,5,'#13283df5','#9ab1ae');text('AUDIO OUTPUT',262,63,11,'#e5dfc8');
    round(163,77,198,39,4,'#5e746f','#d4c394');ellipse(174,93,4,4,'#e5cf9b');text('Monitor speakers',190,91,10,'#f0e4c8','left');text('SELECTED · unused screen',190,106,8,'#d3d8c4','left');
    round(163,125,198,33,4,'#263f53');ctx.beginPath();ctx.arc(174,141,4,0,Math.PI*2);ctx.strokeStyle='#95a9ad';ctx.lineWidth=1;ctx.stroke();text('Headphones',190,145,11,'#b5c9c5','left');
    // Little routing line points at the dormant second monitor, not the ears.
    line(375,95,391,95,'#d6b686',2);poly([[391,90],[398,95],[391,100]],'#d6b686');
   }
   text(phase===3?'THE GAME IS PLAYING. JUST NOT TO YOU.':phase===2?'THE MUSIC METER MOVES. YOUR EARS HEAR NOTHING.':'HEADPHONES ON. WORLD OFF.',246,260,8.5,'#b0beb9');
  }
  return {draw,down(p){if(phase===0&&hit(p,hx,hy,72,78)){drag=true;}else if(phase===1&&launch(p)){press='launch';}else if(phase===2&&settings(p)){press='settings';}},move(p){if(drag){hx=clamp(p.x,28,452);hy=clamp(p.y,40,240);}if(press&&!(press==='launch'?launch(p):settings(p))){press='';canceled++;}},up(p){if(drag){if(hit(p,75,116,82,97)){wearing=true;phase=1;}else{hx=419;hy=200;}drag=false;}if(press==='launch'&&launch(p)){phase=2;age=0;api.say('The game is running. Where is the sound?');}else if(press==='settings'&&settings(p)){phase=3;age=0;api.say('Monitor speakers are selected. Your headphones are not.');}press='';},cancel(){if(drag||press)canceled++;drag=false;press='';if(!wearing){hx=419;hy=200;}},update(dt){t+=dt;if(phase===3&&!finished){age+=dt;if(age>1){finished=true;api.done();}}},debug(){return {phase,wearing,drag,press,canceled,gameRunning:phase>=2,selectedDevice:phase===3?'monitor':'hidden',headphonesSilent:true,finished};}};
 }
 });
})();
