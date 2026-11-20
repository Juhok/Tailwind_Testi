(() => {
 'use strict';
 TinyV7.register({id:'afk-teammate',title:'The AFK Teammate',chapter:'games',description:'Start the five-player match and lead your team out.',hint:'Press Start Match, then drag the gold captain from the blue starting area to the glowing rally circle on the right. Watch the fifth teammate.',verdict:'Fifteen minutes. A flawless defense of the spawn point.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
  const origin=[[104,162],[77,139],[77,185],[109,208]],dest=[[310,150],[335,181],[287,195],[356,146]],afk=[84,98],colors=['#dfb777','#8fafbd','#a4aa86','#b392aa'];
  let phase=0,t=0,age=0,clock=0,progress=0,drag=false,dx=104,dy=162,press=false,finished=false,canceled=0;
  const start=p=>hit(p,240,214,180,36),rally=p=>hit(p,323,164,110,100);
  function pawn(x,y,color,index,moving=false){
   const step=moving?Math.sin(t*14+index)*3:0;ellipse(x,y+13,12,4,'#132a385e');
   poly([[x-8,y-5],[x-14,y+8],[x-2,y+9],[x+8,y+3]],'#53667a');rect(x-5,y+4,4,11+step*.4,'#bcc5b5');rect(x+2,y+4,4,11-step*.4,'#8ca7a8');round(x-8,y-10,16,17,4,color);line(x-10,y-5,x-12+step,y+3,'#c5c6ae',4);line(x+10,y-5,x+12-step,y+2,'#c5c6ae',4);
   round(x-8,y-24,16,15,4,color);round(x-5,y-18,10,7,2,'#dec6a4');rect(x+2,y-17,2,2,'#364c5c');poly([[x-8,y-19],[x-7,y-28],[x+6,y-29],[x+9,y-19]],color);line(x+10,y-2,x+18,y-17,'#dbe2c3',2);line(x+12,y-4,x+17,y-2,'#a38e71',2);
   if(index===0){poly([[x-6,y-31],[x-5,y-39],[x,y-35],[x+5,y-39],[x+6,y-31]],'#edcb7c');}
   round(x-7,y+18,14,12,3,'#294454');text(String(index+1),x,y+27,8,'#dbe2c6');
  }
  function world(){
   rect(0,0,480,270,'#233b4a');rect(14,47,452,195,'#4b6a67');
   for(let n=0;n<42;n++){const x=19+(n*73)%441,y=53+(n*31)%181;rect(x,y,4+(n%3),2,'#658078');line(x,y,x-1,y-4,'#3c5c5a',1);}
   poly([[122,142],[204,117],[269,151],[408,135],[427,198],[275,208],[211,172],[143,214]],'#8d9681');
   for(let n=0;n<17;n++){const x=150+n*16,y=160+Math.sin(n*.8)*22;poly([[x-5,y-3],[x+7,y-4],[x+8,y+3],[x-4,y+4]],'#b0b29b');}
   round(35,65,112,169,9,'#416b7b','#7fa8ac');round(41,71,100,157,7,'#507f88');text('STARTING AREA',91,225,7,'#c0d7c8');
   for(const [x,y] of [[30,57],[145,57],[30,233],[145,233],[433,72],[433,228]]){rect(x-8,y-7,17,13,'#9a9c8d');rect(x-6,y-16,13,10,'#bdbaa1');rect(x-7,y+3,15,8,'#5d7775');}
   // Banners frame two ends of a tiny multiplayer arena.
   line(23,57,23,110,'#c4b795',3);poly([[25,58],[56,58],[52,76],[25,76]],'#83b3bd');poly([[36,61],[43,67],[36,73],[30,67]],'#c7dec9');
   line(441,75,441,126,'#b7a98c',3);poly([[439,76],[410,76],[415,95],[439,95]],'#b68185');poly([[427,79],[433,85],[427,91],[421,85]],'#e1b39c');
   for(const [x,y] of [[196,71],[217,79],[388,221],[404,213]]){ellipse(x,y+7,17,5,'#203e4060');poly([[x-12,y+5],[x-7,y-10],[x+5,y-15],[x+14,y-4],[x+9,y+9]],'#748c83');poly([[x-7,y-10],[x+5,y-15],[x+1,y+2],[x-12,y+5]],'#91a092');}
   if(phase===1){ctx.beginPath();ctx.ellipse(323,165,39+Math.sin(t*4)*2,28,0,0,Math.PI*2);ctx.strokeStyle='#d8c182';ctx.lineWidth=2;ctx.stroke();line(323,141,323,176,'#edd5a1',2);poly([[323,141],[342,146],[323,152]],'#edcf8d');text('RALLY',323,205,9,'#eee0b5');}
   if(phase>=2){for(let i=0;i<8;i++){const f=i/8;ellipse(126+f*184,177+Math.sin(f*4)*18,2.5,1.5,'#536e6a');}}
   for(let i=0;i<4;i++){
    let px=origin[i][0]+(dest[i][0]-origin[i][0])*progress,py=origin[i][1]+(dest[i][1]-origin[i][1])*progress;
    if(i===0&&drag){px=dx;py=dy;}
    if(phase>=3){px+=Math.sin(t*2.5+i)*3;py+=Math.cos(t*2.2+i)*2;}
    pawn(px,py,colors[i],i,phase===2||phase>=3);
   }
   // The absent player's entire body is intentionally independent of time.
   pawn(afk[0],afk[1],'#8c9b9b',4,false);
   if(phase>=3){text('z',107,76-Math.sin(t*1.6)*3,10,'#d4d5bc');text('Z',117,62-Math.sin(t*1.6)*4,12,'#d4d5bc');}
   if(phase===4){round(42,127,93,24,4,'#203b4df0','#a4b8b0');text('STILL HERE',89,143,9,'#dfc995');}
   if(phase>=3){round(277,215,112,18,4,'#294955');text('4 / 5 AT OBJECTIVE',333,228,7,'#ded6ac');}
  }
  function draw(){
   world();
   round(10,8,460,32,6,'#152e40');text('BLUE TEAM',70,29,10,'#b9d4ce');for(let i=0;i<5;i++){round(123+i*20,18,14,14,3,i<4?colors[i]:'#819598');text(String(i+1),130+i*20,29,7,'#203c4b');}
   const mm=String(Math.floor(clock/60)).padStart(2,'0'),ss=String(Math.floor(clock%60)).padStart(2,'0');text(mm+':'+ss,298,29,17,'#ebdbaf');
   if(phase===3){poly([[345,17],[353,24],[345,31]],'#c8c9a9');poly([[356,17],[364,24],[356,31]],'#c8c9a9');}text('5 PLAYERS',420,29,8,'#a8c7c2');
   if(phase===0){round(151,71,278,151,8,'#172f42ed','#95aaa7');text('CAPTURE THE FLAG',290,97,15,'#dfd5ab');text('Your five-player team is ready.',289,121,10,'#bfd4c9');
    for(let i=0;i<5;i++){round(177+i*44,137,30,27,4,i<4?colors[i]:'#91a3a1');text(String(i+1),192+i*44,155,11,'#294253');}round(150,196+(press?2:0),180,36,5,'#bec6a5');text('Start Match',240,219+(press?2:0),12,'#284253');
   }
   text(phase===1?'DRAG THE GOLD CAPTAIN TO THE RALLY FLAG':phase===4?'FIFTEEN MINUTES. NOT A SINGLE STEP.':phase===3?'TIME PASSES. SOMEONE DOES NOT.':'A WHOLE TEAM. MORE OR LESS.',240,260,9,'#c0cfbb');
  }
  return{draw,down(p){if(phase===0&&start(p))press=true;else if(phase===1&&hit(p,104,153,60,69)){drag=true;dx=104;dy=162;}},move(p){if(press&&!start(p)){press=false;canceled++;}if(drag){dx=clamp(p.x,30,450);dy=clamp(p.y,68,224);}},up(p){if(press&&start(p)){phase=1;age=0;api.say('Lead your team out. Grab the gold captain.');}press=false;if(drag){drag=false;if(rally(p)){phase=2;age=0;api.tone(610,.08,.02);}else{dx=104;dy=162;canceled++;}}},cancel(){if(drag||press)canceled++;drag=false;press=false;dx=104;dy=162;},update(dt){t+=dt;if(phase===2){age+=dt;progress=clamp(age/2.3,0,1);clock=30*progress;if(progress===1){phase=3;age=0;}}else if(phase===3){age+=dt;clock=30+870*clamp(age/5,0,1);if(age>=5){clock=900;phase=4;age=0;api.say('Fifteen minutes later, player five is still in the exact same spot.');}}else if(phase===4&&!finished){age+=dt;if(age>1){finished=true;api.done();}}},debug(){return{phase,clock,progress,drag,press,canceled,afkPosition:[...afk],players:5,playersDeparted:progress===1?4:0,finished};}};
 }
 });
})();
