(function(){'use strict';TinyV9.register({id:'shoe-stone',title:'The Stone in Your Shoe',chapter:'wardrobe',description:'It is tiny. It is impossible to ignore.',hint:'Drag the shoe forward to take a step. Lift the shoe off, turn it upside down by dragging its heel around, and shake it back and forth four times. Turn it upright again, then put it over the sock. Take three more steps.',verdict:'The stone has renewed its lease.',create(api){const{ctx}=api;let phase='walk',shoe={x:159,y:185},foot={x:159,y:185},drag=null,start=null,t=0,shakes=0,lastX=0,dir=0,steps=0,rot=0,pain=0,flipped=false,turnProgress=0,press=null;const off=()=>['flip','shake','turnback','replace'].includes(phase);function shoeArt(){ctx.save();ctx.translate(shoe.x,shoe.y);ctx.rotate(rot);api.ellipse(14,27,83,9,'#263b3d66');api.poly([[-61,19],[-63,-28],[-39,-35],[-16,-12],[35,-4],[76,8],[84,22],[78,31],[-58,31]],'#cbbea1');api.poly([[-61,14],[-57,-27],[-36,-29],[-12,-7],[43,0],[75,10],[76,21],[-53,22]],'#667d88');api.poly([[-52,-18],[-39,-24],[-18,-2],[-25,15],[-53,14]],'#8fa1a5');api.poly([[17,2],[48,5],[70,13],[69,20],[13,20]],'#78919a');api.ellipse(-43,-27,16,6,'#253e48');api.ellipse(-43,-28,13,4,'#192e36');api.line(-54,25,75,25,'#6f7d78',2);for(let i=0;i<17;i++)api.line(-51+i*7,28,-51+i*7,31,'#899181',1);for(let i=0;i<5;i++){api.line(-24+i*10,-9+i*2,-29+i*10,4+i*2,'#d9d4b9',2);api.ellipse(-25+i*10,-8+i*2,2,2,'#b4bcad');}api.line(-34,5,-12,16,'#d9d4b9',2);api.line(-34,5,-45,13,'#d9d4b9',2);api.poly([[-7,7],[0,8],[-7,13],[-16,12]],'#b9ba9f');if(off()){api.ellipse(-43,-28,8,3,'#47554d');}ctx.restore();}
return{draw(){api.rect(0,0,480,270,'#2c424d');api.rect(0,172,480,98,'#6c6f60');for(let i=0;i<9;i++)api.line(i*62,172,i*62-42,270,'#465657',1);api.line(0,228,480,228,'#465657',2);api.round(26,46,110,81,5,'#4a6066');api.poly([[38,112],[82,68],[124,112]],'#31464d');api.rect(53,128,5,43,'#809080');api.rect(114,128,5,43,'#809080');if(off()){api.poly([[foot.x-49,62],[foot.x-10,62],[foot.x-13,167],[foot.x+18,177],[foot.x+53,192],[foot.x+50,202],[foot.x-46,202]],'#d2c4a1');for(let i=0;i<8;i++)api.line(foot.x-44,132+i*7,foot.x-16,132+i*7,'#b1ac8d',1);api.poly([[foot.x-51,21],[foot.x-7,21],[foot.x-8,139],[foot.x-50,139]],'#4b687e');api.line(foot.x-45,133,foot.x-15,133,'#8ba0a4',3);}else{api.poly([[shoe.x-56,47],[shoe.x-19,47],[shoe.x-23,164],[shoe.x-55,164]],'#4d7187');api.line(shoe.x-51,157,shoe.x-24,157,'#a5b4b2',3);}shoeArt();if(phase==='shake'&&drag)for(let i=0;i<4;i++)api.rect(shoe.x+35+(i*11)%20,shoe.y+36+(i*17+t*60)%36,2,2,'#b5a57a');if(phase==='pain'||phase==='done'){const a=.65+Math.sin(t*8)*.25;ctx.save();ctx.globalAlpha=a;api.poly([[shoe.x+8,shoe.y+9],[shoe.x+14,shoe.y+2],[shoe.x+20,shoe.y+10],[shoe.x+15,shoe.y+15]],'#c7ba91');api.line(shoe.x+13,shoe.y-3,shoe.x+8,shoe.y-12,'#f6b07e',2);api.line(shoe.x+22,shoe.y+6,shoe.x+31,shoe.y+4,'#f6b07e',2);api.line(shoe.x+2,shoe.y+7,shoe.x-7,shoe.y+3,'#f6b07e',2);ctx.restore();api.text(phase==='done'?'There it is. Again.':'There it is.',277,58,12,'#efd9b1');}if(phase==='flip'||phase==='turnback'){api.text(phase==='flip'?'TURN THE SHOE UPSIDE DOWN':'TURN THE SHOE UPRIGHT',270,43,10,'#e4d5ae');ctx.save();ctx.strokeStyle='#d4c59b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(shoe.x,shoe.y,61,Math.PI*1.12,Math.PI*1.9);ctx.stroke();api.poly([[shoe.x+56,shoe.y-20],[shoe.x+49,shoe.y-24],[shoe.x+56,shoe.y-30]],'#d4c59b');ctx.restore();}if(phase==='shake')api.text('SHAKE IT OUT',300,43,10,'#e4d5ae');if(phase==='replace')api.text('Looks empty. Put it back on.',267,44,10,'#e4d5ae');if(phase==='steps'||phase==='done'){api.text(`STEPS   ${steps} / 3`,247,248,10,'#e7d5aa');for(let i=0;i<3;i++)api.ellipse(230+i*45,233,9,4,i<steps?'#e2c990':'#84917b');}},down(p){
 if(api.hit(p,shoe.x+6,shoe.y,175,100)&&phase!=='done'){
 drag=phase;start={...shoe};press={...p};lastX=p.x;dir=0;turnProgress=0;
 }
},move(p){
 if(!drag)return;
 if(drag==='flip'||drag==='turnback'){
 turnProgress=api.clamp((p.x-press.x)*(drag==='flip'?1:-1)/90,0,1);
 rot=drag==='flip'?turnProgress*Math.PI:Math.PI*(1-turnProgress);
 }else if(drag==='shake'){
 shoe.x=api.clamp(start.x+p.x-press.x,145,365);rot=Math.PI+Math.sin((shoe.x-250)/30)*.20;
 const d=p.x-lastX;if(Math.abs(d)>24){let nd=Math.sign(d);if(nd!==dir){shakes++;dir=nd;api.tone(360,.035,.008);}lastX=p.x;}
 }else shoe={x:api.clamp(start.x+p.x-press.x,80,380),y:api.clamp(start.y+p.y-press.y,80,211)};
},up(p){
 if(!drag)return;
 if(drag==='walk'){
 if(shoe.x-start.x>45){phase='pain';pain=1;api.say('Lift the shoe off your foot.');}else shoe={...start};
 }else if(drag==='pain'){
 // Vertical removal works even at the far-right edge: no extra rightward room required.
 if(shoe.y<start.y-42){phase='flip';foot={x:180,y:185};shoe={x:305,y:123};api.say('Turn the shoe upside down before shaking.');}else shoe={...start};
 }else if(drag==='flip'||drag==='turnback'){
 if(turnProgress>.86){flipped=drag==='flip';rot=flipped?Math.PI:0;phase=flipped?'shake':'replace';api.say(flipped?'Shake the upside-down shoe back and forth.':'Now put the upright shoe over your sock.');}
 else rot=drag==='flip'?0:Math.PI;
 }else if(drag==='shake'){
 rot=Math.PI;if(shakes>=4){phase='turnback';api.say('Looks empty. Turn it upright again.');}
 }else if(drag==='replace'){
 if(api.near(shoe,180,185,45)){shoe={x:180,y:185};phase='steps';}else shoe={...start};
 }else if(drag==='steps'){
 if(shoe.x-start.x>32){steps++;shoe={x:180,y:185};api.tone(180,.05,.01);if(steps===3){phase='done';api.done();}}else shoe={...start};
 }
 drag=null;
},cancel(){if(drag){shoe={...start};rot=flipped?Math.PI:0;}drag=null;},
guidance(){
 if(phase==='done')return null;
 if(phase==='flip')return{kind:'drag',from:[shoe.x-43,shoe.y-25],to:[shoe.x+47,shoe.y-25],via:[[shoe.x,shoe.y-68]],label:'Turn upside down'};
 if(phase==='turnback')return{kind:'drag',from:[shoe.x+43,shoe.y+25],to:[shoe.x-47,shoe.y+25],via:[[shoe.x,shoe.y+62]],label:'Turn upright'};
 if(phase==='shake')return{kind:'drag',from:[shoe.x,shoe.y],to:[shoe.x-60,shoe.y],via:[[shoe.x+40,shoe.y],[shoe.x-60,shoe.y],[shoe.x+40,shoe.y]],label:'Shake back and forth'};
 if(phase==='replace')return{kind:'drag',from:[shoe.x,shoe.y],to:[foot.x,foot.y],label:'Put the shoe on'};
 if(phase==='pain')return{kind:'drag',from:[shoe.x,shoe.y],to:[shoe.x,shoe.y-75],label:'Lift the shoe off'};
 return{kind:'drag',from:[shoe.x,shoe.y],to:[Math.min(460,shoe.x+75),shoe.y],label:'Take a step'};
},update(dt){t+=dt;},debug(){return{phase,shoe:{...shoe},shakes,steps,flipped,rotation:rot,turnProgress,stoneStillInside:true,message:phase==='done'?'There it is. Again.':'There it is.'};}};}});})();
