(() => {
TinyV7.register({id:'trouser-leg',title:'The Twisted Trouser Leg',chapter:'home',description:'Pull on your trousers. Both legs, ideally.',hint:'Drag the waistband upward. Pull it back down when the foot gets stuck. Pull the twisted right cuff outward to straighten it, then pull the waistband up again.',verdict:'Dressed. Only twice as much dressing required.',create(api){
 const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
 let phase=0,lift=0,untwist=0,drag=null,t=0,settle=0,finished=false;
 const top=()=>179-lift*114, length=()=>69+lift*91;
 function pants(){const y=top(),len=length(),twist=(phase<3?1-untwist:0)*lift;const rEnd=y+len-twist*62;
   ellipse(240,250,98,8,'#222431');
   poly([[178,y],[302,y],[308,y+30],[293,y+len],[251,y+len],[246,y+49],[232,y+49],[226,y+len],[184,y+len],[174,y+30]],'#466b85');
   poly([[184,y+19],[229,y+18],[224,y+len],[190,y+len]],'#5e88a0');
   // A twisted leg narrows and bunches around the trapped foot.
   poly([[248,y+24],[301,y+20],[phase<3?283:295,y+len*.55],[291,rEnd],[252,rEnd],[phase<3?264:252,y+len*.55]],'#527b95');
   if(twist>.05){poly([[248,rEnd-1],[292,rEnd-1],[294,y+len+2],[249,y+len+2]],'#303344'); // empty cloth below the bunched knee
     poly([[253,rEnd],[283,rEnd],[291,y+len],[251,y+len]],'#36536c');
     for(let i=0;i<5;i++){let cy=rEnd-30+i*8;line(251+(i%2)*5,cy,292-(i%2)*7,cy+8,'#a0acb2',2);line(253+(i%2)*5,cy+3,290-(i%2)*7,cy+11,'#2f4b65',2);}
     ellipse(279,rEnd-8,16,9,'#7d9aab');ellipse(281,rEnd-10,12,6,'#91a8b4');line(268,rEnd-3,289,rEnd-5,'#41617a',2);
   }
   if(phase===2){const cx=276+untwist*32,cy=y+len-20;ctx.save();ctx.translate(cx,cy);ctx.rotate((1-untwist)*-.8);round(-21,-25,42,47,4,'#57809a','#a0b4bf');for(let i=0;i<4;i++)line(-19,-18+i*10,17,-8+i*10,'#2d4a62',2);ctx.restore();}
   round(174,y,132,18,3,'#35566f','#8fa6b4');rect(179,y+5,122,3,'#b5a57d');round(233,y+3,14,10,2,'#c6c5ae');rect(237,y+5,6,6,'#4e5662');
   for(const xx of [187,219,261,288])rect(xx,y+1,4,17,'#436c85');
   line(241,y+19,241,y+44,'#b2a690',1);line(244,y+19,244,y+41,'#27465f',1);
   ctx.beginPath();ctx.moveTo(181,y+20);ctx.quadraticCurveTo(184,y+40,210,y+39);ctx.strokeStyle='#a7b2b2';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.moveTo(298,y+20);ctx.quadraticCurveTo(293,y+38,271,y+39);ctx.stroke();
   line(187,y+len-6,223,y+len-6,'#9dacb3',2);if(twist<.1)line(253,y+len-6,289,y+len-6,'#9dacb3',2);
 }
 return {draw(){api.bg('bedroom');rect(0,185,480,85,'#55464b');for(let x=0;x<480;x+=58)line(x,185,x-20,270,'#705854',1);
   round(18,23,103,147,6,'#a9b2b6','#d7c5b6');rect(25,30,89,133,'#70838d');poly([[30,34],[62,34],[109,110],[109,148]],'#8298a2');rect(35,46,33,75,'#68747f');
   round(355,93,105,91,5,'#796456');rect(360,100,95,35,'#8a7360');rect(360,140,95,35,'#8a7360');ellipse(406,118,5,3,'#c0aa83');ellipse(406,158,5,3,'#c0aa83');rect(346,184,7,20,'#665347');rect(448,184,7,20,'#665347');
   poly([[178,0],[302,0],[310,50],[292,69],[187,69],[170,50]],'#a6a49a');poly([[178,0],[191,0],[190,60],[180,52]],'#c7bdb0');line(184,58,296,58,'#7d817c',2);round(184,61,48,166,15,'#d4ac93');round(249,61,47,166,15,'#d4ac93');
   round(183,215,51,19,6,'#b7d1cf');if(!(phase<2&&lift>.5))round(248,215,50,19,6,'#b7d1cf');rect(185,216,46,4,'#698f99');if(!(phase<2&&lift>.5))rect(251,216,44,4,'#698f99');ellipse(205,235,27,9,'#cbdcd3');if(!(phase<2&&lift>.5))ellipse(274,235,27,9,'#cbdcd3');
   pants();
   if(drag?.kind==='waist'){for(const x of [173,309]){ellipse(x,top()+6,13,9,'#e3b69e');line(x-2,top()+3,x-1,top()+12,'#ba8f7e',1);}}
   if(phase===1){round(324,48,131,34,5,'#242b3c','#aa8490');text('ONE FOOT THROUGH.',390,62,8,'#d3dfdc');text('ONE FOOT… NOT.',390,74,8,'#ebaca0');line(326,84,297,143,'#cb9b8f',2);}
   text(phase===0?'Pull up by the waistband':phase===1?'Stuck. Pull them back down.':phase===2?'Pull the twisted cuff outward':phase===3?'Straight at last. Try again.':'Two feet. Two exits.',240,265,10,'#e5d3c3');
 },down(p){if((phase===0||phase===1||phase===3)&&hit(p,240,top()+9,164,40))drag={kind:'waist',y:p.y,start:lift};if(phase===2&&hit(p,276,227,75,65))drag={kind:'cuff',x:p.x,start:untwist};},move(p){if(drag?.kind==='waist')lift=clamp(drag.start+(drag.y-p.y)/114,0,1);if(drag?.kind==='cuff')untwist=clamp(drag.start+(p.x-drag.x)/62,0,1);},up(){if(!drag)return;if(drag.kind==='waist'){if(phase===0&&lift>.88){lift=1;phase=1;api.say('Your right foot has found a dead end.');api.tone(240,.1);}else if(phase===1&&lift<.15){lift=0;phase=2;}else if(phase===3&&lift>.88){lift=1;phase=4;settle=0;}else lift=phase===1?1:0;}else if(untwist>.85){untwist=1;phase=3;api.tone(520,.1);}else untwist=0;drag=null;},cancel(){if(drag){if(drag.kind==='waist')lift=drag.start;else untwist=drag.start;}drag=null;},update(dt){t+=dt;if(phase===4){settle+=dt;if(settle>.6&&!finished){finished=true;api.done();}}},debug(){return {phase,lift,untwist,stuck:phase===1,finished};}};
}});
})();
