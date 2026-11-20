(() => {
 'use strict';
 TinyV7.register({id:'update-shutdown',title:'Update and Shut Down',chapter:'digital',description:'Your work is saved. Turn the computer off.',hint:'Close the saved document, open the power menu at the bottom-left of the monitor, then select Shut Down.',verdict:'Ninety-nine percent asleep.',
 create(api){
  const {ctx,rect,round,ellipse,line,poly,text,hit,clamp}=api;
  let phase=0,t=0,age=0,progress=0,press='',finished=false,canceled=0;
  const close=p=>hit(p,355,57,30,30),power=p=>hit(p,118,185,37,26),shutdown=p=>hit(p,178,143,145,31);
  function gear(x,y,r,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*Math.PI/4);round(-3,-r-3,6,8,1,'#aec4b6');ctx.restore();}ellipse(0,0,r,r,'#aec4b6');ellipse(0,0,r*.5,r*.5,'#254358');ctx.restore();}
  function draw(){
   api.bg('desk');rect(0,0,480,175,'#182636');
   // Night window, clock and an idle desk make the desire to shut down legible.
   round(9,21,66,104,3,'#5d6f7a');rect(14,26,56,94,'#102338');ellipse(50,46,12,12,'#d6ceb0');ellipse(55,43,11,11,'#102338');line(42,26,42,120,'#566b78',3);line(14,76,70,76,'#566b78',3);
   for(let i=0;i<4;i++){rect(15+i*13,94-(i%2)*12,11,27+(i%2)*12,'#284256');rect(18+i*13,99-(i%2)*12,3,4,'#9a9a7a');}
   round(408,126,63,34,5,'#384e60');round(413,131,53,24,2,'#132b3c');text('02:48',440,148,13,'#b5c1a5');
   ellipse(242,240,172,12,'#0d1928');round(84,19,312,187,9,'#5f7886','#a4b6b7');round(92,27,296,171,4,'#132536');
   const sky=ctx.createLinearGradient(0,32,0,195);sky.addColorStop(0,'#2d5267');sky.addColorStop(1,'#759192');rect(97,32,286,161,sky);
   poly([[97,151],[153,93],[204,151],[265,78],[323,135],[383,111],[383,194],[97,194]],'#3d6876');poly([[97,172],[186,143],[252,179],[333,142],[383,166],[383,194],[97,194]],'#4d7d82');
   rect(97,173,286,20,'#183043d9');text('02:48',354,187,8,'#d5dfcd');
   ctx.beginPath();ctx.arc(118,184,6,-1.1,Math.PI*2-2.05);ctx.strokeStyle='#e0ddbd';ctx.lineWidth=1.8;ctx.stroke();line(118,175,118,183,'#e0ddbd',2);
   round(226,206,28,22,2,'#536d7b');round(187,225,106,7,3,'#91a4a3');
   poly([[111,239],[332,239],[347,257],[93,257]],'#69848e');for(let j=0;j<2;j++)for(let i=0;i<14;i++)rect(116+i*15-j*6,242+j*7,11,4,'#2b455c');
   ellipse(385,248,20,11,'#0d1928');round(368,231,34,24,11,'#9cafaa');line(385,233,385,242,'#546e76',1.5);
   if(phase===0){round(117,43,254,120,5,'#d3d8c5');round(117,43,254,24,5,'#465f70');rect(117,60,254,7,'#465f70');text('FINAL_FINAL_v9.txt',132,59,10,'#dce2d0','left');line(350,52,359,61,'#e5c5ad',2);line(359,52,350,61,'#e5c5ad',2);
    text('All work saved.',244,89,12,'#3a5861');for(let i=0;i<4;i++)rect(141,101+i*11,176-i*13,3,'#8b9f9b');text('You can finally go to bed.',244,151,8,'#597076');
   }else if(phase===2){round(106,102,147,67,4,'#223b50','#89a3a5');text('POWER',180,119,9,'#b1c7bd');round(111,128+(press==='shutdown'?2:0),137,31,3,'#b0bca4');text('Shut Down',180,148+(press==='shutdown'?2:0),12,'#294550');}
   if(phase>=3){rect(97,32,286,161,'#24475c');gear(226,70,12,t*.7);gear(252,83,9,-t*.94);
    text('Installing updates.',240,112,14,'#e0e8d4');text('Do not turn off your computer.',240,131,10,'#c5d8cf');
    round(132,145,216,9,4,'#132f43');round(134,147,Math.max(2,212*progress/100),5,2,'#b3c8a7');text(Math.floor(progress)+'%',240,174,15,'#e5d9b3');
   }
   if(phase===1)text('Power menu',153,163,8,'#e2ddba');
   if(phase===4)text('STILL WORKING ON IT.',240,262,8,'#c0c7b5');
  }
  return {draw,down(p){if(phase===0&&close(p))press='close';else if(phase===1&&power(p))press='power';else if(phase===2&&shutdown(p))press='shutdown';},move(p){if(press&&!(press==='close'?close(p):press==='power'?power(p):shutdown(p))){press='';canceled++;}},up(p){if(press==='close'&&close(p)){phase=1;}else if(press==='power'&&power(p)){phase=2;}else if(press==='shutdown'&&shutdown(p)){phase=3;age=0;api.say('Installing updates. Do not turn off your computer.');}press='';},cancel(){if(press)canceled++;press='';},update(dt){t+=dt;if(phase===3){age+=dt;progress=Math.min(99,99*(1-Math.pow(1-clamp(age/4.5,0,1),1.8)));if(age>=4.5){progress=99;phase=4;age=0;}}else if(phase===4&&!finished){age+=dt;if(age>1.3){finished=true;api.done();}}},debug(){return{phase,progress,press,canceled,gearAngle:t*.7,updating:phase>=3,computerOn:true,finished};}};
 }
 });
})();
