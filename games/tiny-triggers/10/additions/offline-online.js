(() => {
  'use strict';
  TinyV7.register({
    id:'offline-online', title:'Online Required for Offline Mode', chapter:'digital',
    description:'Start your quiet, offline adventure.',
    hint:'Click Play Offline on the laptop, then let it check whether you are allowed to be offline.',
    verdict:'Offline, subject to online approval.',
    create(api){
      const {ctx,rect,round,ellipse,line,poly,text,hit}=api;
      let phase=0,t=0,age=0,press=false,finished=false,canceled=0;
      const target=p=>hit(p,240,136,176,37);
      function landscape(){
        const g=ctx.createLinearGradient(0,38,0,190);g.addColorStop(0,'#152d49');g.addColorStop(1,'#88727b');rect(81,34,318,158,g);
        ellipse(337,70,19,19,'#e1cda3');
        poly([[81,150],[134,69],[186,149],[225,97],[286,152],[339,94],[399,160],[399,192],[81,192]],'#263f52');
        poly([[81,175],[157,129],[227,179],[315,129],[399,168],[399,192],[81,192]],'#3d5c62');
        poly([[208,192],[233,160],[249,160],[282,192]],'#cab28c');
        for(let i=0;i<18;i++){const x=90+i*17;const y=170+(i%3)*6;line(x,y,x,y-10,'#274c47',2);poly([[x-5,y-4],[x,y-17],[x+5,y-4]],'#446b60');}
        // Lone little traveler beneath the network-dependent wilderness.
        rect(234,165,7,14,'#c19b74');ellipse(238,161,4,4,'#e5c29a');rect(241,168,5,9,'#7e8a72');
      }
      function draw(){
        api.bg('desk');
        rect(0,0,480,164,'#1a2535');for(let i=0;i<6;i++)rect(i*88,0,2,164,'#243141');
        round(17,70,45,84,5,'#3c4549');rect(22,80,35,3,'#b29572');rect(22,89,35,3,'#b29572');
        ellipse(37,65,25,6,'#56645f');poly([[20,62],[13,32],[31,49],[36,16],[45,45],[59,30],[53,62]],'#638477');
        ellipse(426,189,21,6,'#101a25');round(407,150,31,34,6,'#bd8c74');ctx.beginPath();ctx.arc(440,166,9,-1.6,1.6);ctx.strokeStyle='#bd8c74';ctx.lineWidth=5;ctx.stroke();ellipse(423,151,13,4,'#503e38');
        ellipse(240,235,184,10,'#0c1825a0');round(69,20,342,184,10,'#586b7a','#9babae');round(76,27,328,171,6,'#101b2c');landscape();ellipse(240,24,1.4,1.4,'#c3c4b1');
        poly([[69,204],[411,204],[440,232],[40,232]],'#899b9e');poly([[40,232],[440,232],[428,239],[52,239]],'#475c69');
        for(let y=0;y<3;y++)for(let x=0;x<18;x++)round(91+x*16-y*5,208+y*6,12,4,1,'#354b5d');round(210,226,60,6,2,'#677e87');
        ctx.save();ctx.beginPath();ctx.rect(81,34,318,158);ctx.clip();
        if(phase===0){
          round(136,46,208,127,7,'#122538d9','#779598');text('THE QUIET TRAIL',240,69,17,'#f1d5a1');text('A single-player adventure',240,89,9,'#c1d4cd');
          round(152,118+(press?2:0),176,37,5,press?'#688c84':'#a2b7a3','#e1d4ab');text('Play Offline',240,141+(press?2:0),13,'#1f3b44');
        } else if(phase===1){
          round(131,71,218,83,7,'#142738ed','#74949a');
          for(let i=0;i<10;i++){const a=i/10*Math.PI*2+t*5;ellipse(240+Math.cos(a)*13,101+Math.sin(a)*13,2.5,2.5,`rgba(202,218,201,${(i+1)/10})`);}
          text('Preparing offline mode…',240,135,11,'#dce1cf');
        } else {
          round(91,45,298,135,7,'#122333f5','#ba8982');
          ellipse(112,65,7,7,'#bd817a');line(109,62,115,68,'#f6e6d0',1.8);line(115,62,109,68,'#f6e6d0',1.8);
          text('OFFLINE MODE',240,68,12,'#efc3a7');
          text('An internet connection is required',240,94,11,'#e4e5d8');text('to access offline mode.',240,111,11,'#e4e5d8');
          round(135,133,95,30,4,'#a7b99e');text('Retry',182,152,12,'#203845');round(250,133,95,30,4,'#3f5364','#829397');text('Quit',297,152,12,'#d9dfce');
        }
        ctx.restore();
        // A visibly unplugged network lead is a visual joke, not a real networking action.
        ctx.beginPath();ctx.moveTo(70,170);ctx.bezierCurveTo(29,170,29,219,16,219);ctx.strokeStyle='#789496';ctx.lineWidth=4;ctx.stroke();round(5,216,15,8,2,'#cad1bf');rect(3,218,4,4,'#a0b5b3');
        text(phase===2?'OFFLINE. ONLINE ONLY.':'YOUR TIME. YOUR LAPTOP.',240,258,9,'#a9b5b4');
      }
      return {draw,down(p){if(phase===0&&target(p))press=true;},move(p){if(press&&!target(p)){press=false;canceled++;}},up(p){if(press&&target(p)&&phase===0){phase=1;age=0;api.tone(420,.08,.018);}press=false;},cancel(){if(press)canceled++;press=false;},update(dt){t+=dt;if(phase===1){age+=dt;if(age>1.7){phase=2;age=0;api.say('An internet connection is required to access offline mode.');}}else if(phase===2&&!finished){age+=dt;if(age>.9){finished=true;api.done();}}},debug(){return{phase,press,canceled,spinner:phase===1,errorVisible:phase===2,options:phase===2?['Retry','Quit']:[],finished};}};
    }
  });
})();
