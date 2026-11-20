(() => {
 'use strict';
 TinyV7.register({id:'wiper-setting',title:'The Wrong Wiper Setting',chapter:'road',description:'A few drops on the windshield. Turn on the front wipers.',hint:'Grab the wiper stalk to the right of the steering wheel and pull it left toward the wheel, then release it.',verdict:'The front gets a shower. The dry rear gets a solo.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,clamp,hit}=api;
  let phase=0,t=0,age=0,drag=false,pull=0,spray=0,rearAngle=0,rearCycles=0,noiseClock=0,finished=false,canceled=0;
  const droplets=[];
  const knob=p=>hit(p,374-pull*54,205+pull*8,75,44);
  function drop(n){const sx=n%2?145:294,tx=80+(n*41)%303;droplets.push({x:sx,y:145,vx:(tx-sx)*.8,vy:-85-(n%5)*10,life:2.2,seed:n});}
  function mirror(){
   line(364,14,364,31,'#162a3a',9);round(304,29,140,67,10,'#142b3c','#7f9194');round(311,35,126,54,6,'#a8bdbe');
   ctx.save();ctx.beginPath();ctx.roundRect(311,35,126,54,6);ctx.clip();rect(311,35,126,54,'#b6c8c2');rect(311,58,126,31,'#788b8c');poly([[358,59],[383,59],[406,89],[334,89]],'#526977');line(371,61,370,68,'#d6d4bb',2);line(370,74,369,87,'#d6d4bb',2);
   poly([[311,55],[328,44],[343,57]],'#77958d');poly([[410,57],[427,41],[437,57]],'#7b998f');
   ctx.save();ctx.translate(372,89);ctx.rotate(phase>0?rearAngle:0);line(0,0,-35,-16,'#283d49',2.5);line(-40,-19,-10,-6,'#172d3b',3.5);ctx.restore();
   ctx.restore();text('REAR · DRY',374,43,6.5,'#334f5e');
   if(phase>0){text('SKRREE',374,79,8,'#f3deb0');for(let i=0;i<2;i++){line(435+i*5,61+i*4,439+i*5,57+i*4,'#e6c19a',1.5);}}
  }
  function draw(){
   rect(0,0,480,270,'#182b3b');
   // Looking out of a car, not down at an isolated switch.
   const sky=ctx.createLinearGradient(0,12,0,149);sky.addColorStop(0,'#627c8d');sky.addColorStop(1,'#c1c7b5');rect(26,12,428,143,sky);
   poly([[25,104],[74,69],[104,88],[166,58],[217,97],[257,69],[302,107],[360,78],[454,104],[454,156],[25,156]],'#647f82');
   rect(26,103,428,51,'#86948a');poly([[202,105],[272,105],[360,155],[127,155]],'#647780');line(239,108,239,115,'#d0cdb2',2);line(240,126,241,145,'#dad5b6',4);
   for(let i=0;i<9;i++){const x=36+i*51;line(x,111,x-5,143,'#566f72',2);line(x,111,x+20,114,'#637b79',1);}
   // Droplets already on the front are what prompted the gesture.
   for(const [x,y] of [[69,46],[132,75],[234,47],[286,104],[402,120],[188,111]]){ellipse(x,y,1.8,4,'#dde8da85');line(x,y+3,x-1,y+8,'#e2ebdd70',1);}
   ctx.save();ctx.beginPath();ctx.rect(28,14,424,139);ctx.clip();
   if(spray>0){for(let j=0;j<2;j++){const sx=j?294:145;for(let n=0;n<6;n++){ctx.beginPath();ctx.moveTo(sx,148);ctx.quadraticCurveTo(sx+(n-2.5)*15,72,sx+(n-2.5)*24,56+Math.sin(age*10+n)*7);ctx.strokeStyle=`rgba(190,225,227,${spray*.43})`;ctx.lineWidth=1.2;ctx.stroke();}}}
   for(const d of droplets){ellipse(d.x,d.y,1.5,3,'#cae5dfc0');line(d.x,d.y,d.x-1,d.y+6,'#aecfd491',1);}
   if(age>1.5){rect(28,14,424,139,'#bad7d411');for(let n=0;n<17;n++){const wx=60+n*21,wy=40+(n*17)%88;ellipse(wx,wy,2,4,'#c4ded18c');line(wx,wy+3,wx-2,Math.min(152,wy+18),'#d5e6d660',1.4);}}
   ctx.restore();
   poly([[0,0],[24,0],[52,155],[0,177]],'#203746');poly([[456,0],[480,0],[480,177],[428,155]],'#203746');line(26,6,51,149,'#779095',3);line(454,6,429,149,'#779095',3);
   // Front wipers remain parked throughout the mistake.
   line(134,151,218,144,'#203844',3);line(205,145,275,141,'#172f3b',4);line(300,151,371,143,'#203844',3);line(364,144,419,141,'#172f3b',4);
   mirror();
   poly([[0,154],[480,154],[480,270],[0,270]],'#314b5c');poly([[0,155],[480,155],[480,173],[0,181]],'#637b83');
   round(104,169,157,52,18,'#132d40');for(const x of [141,218]){ellipse(x,194,22,22,'#718b8c');ellipse(x,194,18,18,'#1e3c50');for(let i=0;i<7;i++){const a=2.6+i*.65;line(x+Math.cos(a)*14,194+Math.sin(a)*14,x+Math.cos(a)*17,194+Math.sin(a)*17,'#a4b7a9',1);}line(x,194,x-10,185,'#e9b68f',1.5);}text('0',141,201,9,'#dce1bd');text('N',218,201,8,'#a9c7b4');
   // Oversized steering wheel and a pullable stalk on its right.
   ellipse(184,244,78,65,'#172f41');ellipse(184,244,61,49,'#455e6e');ellipse(184,244,48,39,'#233c50');line(130,225,172,242,'#7b9298',9);line(238,225,196,242,'#7b9298',9);line(184,252,184,292,'#7b9298',13);round(158,226,52,36,10,'#405b6e');poly([[180,238],[189,238],[192,247],[183,254],[176,247]],'#a8b7ab');
   const kx=374-pull*54,ky=205+pull*8;line(244,220,kx-21,ky,'#182f40',13);line(244,217,kx-21,ky-3,'#708791',4);ctx.save();ctx.translate(kx,ky);ctx.rotate(-.12+pull*.08);round(-32,-16,64,32,9,'#183447','#79929a');line(-17,-8,-7,-10,'#d2dbbc',1);line(-7,-10,5,-5,'#d2dbbc',1);line(-15,-6,4,-6,'#d2dbbc',1);line(-5,-6,0,-12,'#d2dbbc',1);text('WIPER',7,9,7,'#d5ddc4');for(let n=0;n<3;n++)line(19+n*4,-11,19+n*4,11,'#5b7785',1);ctx.restore();
   if(drag){poly([[452,266],[411,238],[kx+8,ky+15],[kx+2,ky+7],[kx+6,ky-7],[kx+19,ky-5],[435,221],[480,245]],'#cba68b');round(kx+1,ky-8,16,9,4,'#e4c7a5');}
   if(phase===0)text('FRONT WIPERS, PLEASE.',364,248,9,'#cad4bd');
   else {text('FRONT: SOAKED',363,240,9,'#d3dfcb');text('REAR: STILL DRY',363,256,9,'#e8c19b');}
  }
  return{draw,down(p){if(phase===0&&knob(p))drag=true;},move(p){if(drag)pull=clamp((374-p.x)/54,0,1);},up(){if(!drag)return;drag=false;if(pull>.8){phase=1;age=0;noiseClock=0;api.say('Washer fluid in front. Dry scraping behind.');}else{pull=0;canceled++;}},cancel(){if(drag){canceled++;drag=false;pull=0;}},update(dt){t+=dt;if(phase>0){age+=dt;pull=Math.max(0,pull-dt*6);spray=age<1.9?Math.min(1,age*5):Math.max(0,1-(age-1.9)*3);rearAngle=Math.sin(age*5)*.7;rearCycles=Math.floor(age*5/(Math.PI*2));if(spray>0&&Math.floor((age-dt)*50)!==Math.floor(age*50))drop(Math.floor(age*50));noiseClock-=dt;if(noiseClock<=0&&!finished){api.tone(940+Math.sin(age*4)*240,.09,.012);api.tone(155,.07,.009);noiseClock=.55;}if(age>3.5&&!finished){finished=true;phase=2;api.done();}}for(const d of droplets){d.life-=dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=78*dt;d.vx*=Math.max(0,1-dt*1.1);}for(let i=droplets.length-1;i>=0;i--)if(droplets[i].life<=0||droplets[i].y>153)droplets.splice(i,1);},debug(){return{phase,pull,drag,spray,drops:droplets.length,rearCycles,rearAngle,frontWipersMoving:false,rearGlassWet:false,canceled,finished};}};
 }
 });
})();
