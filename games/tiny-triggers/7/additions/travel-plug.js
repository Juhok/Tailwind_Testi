(() => {
 'use strict';
 TinyV7.register({id:'travel-plug',title:'The Wrong Travel Plug',chapter:'home',description:'Hotel room. One percent battery. Plug in your charger.',hint:'Drag the charger from the suitcase to the wall socket. After it bounces back, use the curved-arrow Turn button and try the socket again. Try three orientations.',verdict:'You packed everything except the right shape.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
  let phase=0,t=0,age=0,x=132,y=201,fromX=x,fromY=y,angle=0,turn=0,drag=false,press=false,attempts=0,orientations=new Set(),bounce=false,finished=false,canceled=0;
  const socket=p=>hit(p,349,111,83,88),rotate=p=>hit(p,254,228,96,33);
  function reject(){attempts++;orientations.add(turn%4);fromX=x;fromY=y;bounce=true;age=0;drag=false;phase=1;api.tone(190,.06,.018);api.say(orientations.size<3?'The pins do not match. Turn the plug and try again.':'Three orientations. The same wrong plug.');}
  function plug(){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ellipse(0,7,24,26,'#10223360');round(-24,-26,48,51,9,'#b9bcb0','#e4ddc3');round(-18,-21,36,41,7,'#d7d5c2');ellipse(-10,-4,4,4,'#607987');ellipse(10,-4,4,4,'#607987');ellipse(-10,-7,3.5,3.5,'#e8ead9');ellipse(10,-7,3.5,3.5,'#e8ead9');line(-10,-7,-10,1,'#adbcbb',3);line(10,-7,10,1,'#adbcbb',3);round(-5,24,10,9,2,'#81979b');line(-11,14,11,14,'#a4afa4',1);ctx.restore();}
  function draw(){
   rect(0,0,480,270,'#253747');rect(0,0,480,171,'#3e4c59');for(let n=0;n<8;n++)line(n*64,0,n*64,171,'#485762',1);rect(0,171,480,7,'#172b3b');rect(0,178,480,92,'#686050');
   // Hotel headboard, bed edge, travel case, passport and ticket.
   round(12,27,182,125,9,'#64534c');for(let n=0;n<6;n++)line(21+n*31,35,21+n*31,143,'#806958',1);round(6,124,196,50,12,'#b7b8a6');round(26,104,74,33,10,'#d7d3ba');line(33,130,90,130,'#a8b1a4',1.5);rect(8,157,188,16,'#83958e');
   ellipse(123,250,96,11,'#26323970');round(31,137,156,108,10,'#263c50','#7c8d90');round(38,145,142,92,8,'#738582');round(45,152,128,77,5,'#3a5361');
   round(29,73,154,67,10,'#5b6f79','#98a6a2');round(38,81,136,50,6,'#344e61');for(let n=0;n<6;n++)line(43,87+n*7,168,87+n*7,'#58717a',1);round(87,64,39,10,3,'#233d50');
   poly([[46,168],[80,162],[95,184],[84,221],[48,218]],'#8b9181');line(48,179,80,173,'#c0ba9c',2);line(47,191,84,187,'#c0ba9c',2);
   ctx.save();ctx.translate(212,197);ctx.rotate(-.13);round(-21,-27,43,60,3,'#6c5360');text('PASSPORT',0,-12,5.5,'#d3bd8e');ellipse(0,7,10,10,'#aa956c');line(-8,7,8,7,'#6c5360',1);line(0,-1,0,15,'#6c5360',1);ctx.restore();
   poly([[174,211],[199,207],[205,253],[180,257]],'#c9c7ad');for(let n=0;n<9;n++)line(183+n%3*3,232+Math.floor(n/3)*6,184+n%3*3,236+Math.floor(n/3)*6,'#465965',1);
   // UK-style rectangular slots, clearly different from the charger's round pins.
   round(306,51,89,115,7,'#71858a');round(302,47,89,115,7,'#c2c8b9','#e4dfc5');for(const yy of [60,150]){ellipse(346,yy,3,3,'#8c9f9d');line(344,yy,348,yy,'#e1dfc7',1);}
   round(315,72,63,65,4,'#a6b4ac');rect(342,82,8,17,'#263e50');rect(326,110,17,8,'#263e50');rect(350,110,17,8,'#263e50');rect(342,83,2,14,'#536c75');rect(327,111,14,2,'#536c75');rect(351,111,14,2,'#536c75');
   // Phone is already connected to the cable, but its power source never fits.
   ctx.save();ctx.translate(425,203);ctx.rotate(.08);round(-24,-46,48,91,7,'#1b3044','#879a9a');round(-20,-38,40,75,3,'#435a68');round(-9,-17,18,10,2,'#142e42','#bd9f82');rect(9,-14,2,4,'#bd9f82');rect(-6,-14,2,4,'#da8d7b');text('1%',0,12,18,'#edb39a');text('Not charging',0,27,5,'#d3d9c2');round(-5,44,10,9,2,'#adc0b8');ctx.restore();
   ctx.beginPath();ctx.moveTo(421,254);ctx.bezierCurveTo(382,285,317,182,x-Math.sin(angle)*30,y+Math.cos(angle)*30);ctx.strokeStyle='#1d3347';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#9aadaa';ctx.lineWidth=2.5;ctx.stroke();
   plug();
   if(bounce&&age<.26){for(let n=0;n<3;n++){const a=-1.2+n*.6;line(350+Math.cos(a)*31,108+Math.sin(a)*31,350+Math.cos(a)*40,108+Math.sin(a)*40,'#ecc38b',2);}}
   if(phase>=1&&!finished){round(207,211,94,33,5,press?'#7d9897':'#abc0af');ctx.beginPath();ctx.arc(225,227,8,-2.4,1.7);ctx.strokeStyle='#2e4b5d';ctx.lineWidth=1.8;ctx.stroke();poly([[219,235],[227,235],[222,229]],'#2e4b5d');text('Turn',264,232,11,'#2e4b5d');}
   if(finished)text('STILL 1%. STILL NOT CHARGING.',272,258,8.5,'#ead5af');
  }
  return{draw,down(p){if(bounce||finished)return;if(hit(p,x,y,69,73)){drag=true;fromX=x;fromY=y;}else if(phase>=1&&rotate(p))press=true;},move(p){if(drag){x=clamp(p.x,29,451);y=clamp(p.y,30,237);}if(press&&!rotate(p)){press=false;canceled++;}},up(p){if(drag){drag=false;if(socket(p))reject();else{x=fromX;y=fromY;canceled++;}}if(press&&rotate(p)){turn++;press=false;}press=false;},cancel(){if(!drag&&!press)return;canceled++;if(drag){x=fromX;y=fromY;}drag=false;press=false;},update(dt){t+=dt;angle+=(turn*Math.PI/2-angle)*Math.min(1,dt*11);if(bounce){age+=dt;const q=clamp(age/.52,0,1),ease=1-Math.pow(1-q,3);x=fromX+(260-fromX)*ease;y=fromY+(166-fromY)*ease;if(q===1){bounce=false;if(orientations.size>=3){phase=2;age=0;}}}else if(phase===2&&!finished){age+=dt;if(age>.65){finished=true;api.done();}}},debug(){return{phase,x,y,turn,angle,attempts,orientations:[...orientations],bounce,drag,press,canceled,charging:false,battery:1,finished};}};
 }
 });
})();
