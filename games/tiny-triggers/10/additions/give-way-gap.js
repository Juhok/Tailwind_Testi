(() => {
  TinyV8.register({
    id:'give-way-gap',title:'The Gap That Never Comes',chapter:'road',
    description:'Join the main road. There must be a gap eventually.',
    hint:'Drag the blue car toward the give-way line. Wait for an opening, then drag it forward again and release. Try the next opening too. When the road finally looks completely clear, make one more attempt.',
    verdict:'A gap big enough for everyone. Except you.',
    create(api){
      const {ctx,rect,round,ellipse,line,poly,text,clamp}=api;
      let phase=0,t=0,phaseTime=0,carY=224,nudge=0,drag=null,attempts=0,gapOpen=false,finished=false;
      let oppositeY=-35,oppositeX=240,oppositeAngle=Math.PI,oppositeProgress=0,oppositeTookGap=false;
      let nextWave=0,cutoffSpawned=false;
      const traffic=[];
      const palette=['#c99558','#7896aa','#bc6e67','#b6c1b6','#758d78','#b7a477'];
      function addCar(x,lane,speed,colorIndex=0){traffic.push({x,y:lane===0?99:139,dir:lane===0?1:-1,speed,color:palette[colorIndex%palette.length],seed:colorIndex});}
      addCar(14,0,115,0);addCar(193,0,115,1);addCar(369,0,115,3);addCar(98,1,105,2);addCar(271,1,105,4);addCar(449,1,105,5);
      function enter(p){phase=p;phaseTime=0;drag=null;gapOpen=false;nudge=0;carY=200;cutoffSpawned=false;}
      function beginCutoff(){attempts++;enter(attempts===1?2:4);addCar(-34,0,235,attempts);addCar(514,1,225,attempts+2);api.tone(230,.06,.018);api.say(attempts===1?'That gap was only visiting.':'Another opening. Another car.');}
      function drawCar(x,y,angle,color,player=false,blink=false){
        ctx.save();ctx.translate(x,y);ctx.rotate(angle);
        round(-14,-23,31,51,6,'#202b2f');
        for(const side of [-1,1]){round(side<0?-15:11,-15,4,11,1,'#161e23');round(side<0?-15:11,9,4,10,1,'#161e23');}
        round(-12,-24,24,49,5,color);line(-10,-21,9,-21,'#e0d8b3',1);
        poly([[-8,-10],[8,-10],[10,5],[-10,5]],'#293d48');poly([[-8,-9],[7,-9],[6,-4],[-7,-4]],'#6d909b');
        rect(-7,7,14,9,'#314651');line(-6,8,6,8,'#829598',1);line(-10,-4,-10,17,'#d1d1b4',.7);line(10,-4,10,17,'#526c72',.8);
        round(-9,-24,5,3,1,'#fff0b3');round(4,-24,5,3,1,'#fff0b3');
        round(-10,21,5,3,1,player?'#f09279':'#bf6f60');round(5,21,5,3,1,player?'#f09279':'#bf6f60');
        rect(-3,23,6,2,'#f3dfb5');rect(-3,-22,6,1,'#b9bfae');
        if(blink&&Math.sin(t*8)>0){rect(-12,-19,3,5,'#ffc46e');ellipse(-14,-17,3,2,'#d2a365');}
        ctx.restore();
      }
      function road(){
        rect(0,0,480,270,'#3d5350');
        for(let i=0;i<44;i++)rect((i*83)%480,(i*47)%270,3,2,'#49605a');
        rect(0,70,480,98,'#b3aea0');rect(193,0,95,270,'#b3aea0');
        rect(0,79,480,81,'#485259');rect(202,0,77,270,'#485259');
        for(let y=80;y<162;y+=8)line(0,y,480,y,'#4d585d',.5);
        for(let x=206;x<277;x+=8)line(x,0,x,270,'#4d585d',.5);
        line(0,80,198,80,'#e1d4b3',1);line(283,80,480,80,'#e1d4b3',1);line(0,159,198,159,'#e1d4b3',1);line(283,159,480,159,'#e1d4b3',1);
        for(let x=-12;x<480;x+=46)if(x<185||x>286)rect(x,118,23,2,'#d9cba6');
        for(let y=8;y<65;y+=27)rect(239,y,2,13,'#bfc1af');for(let y=189;y<252;y+=31)rect(239,y,2,13,'#bfc1af');
        for(let x=206;x<277;x+=13){rect(x,171,8,3,'#e4d9bb');rect(x,64,8,3,'#e4d9bb');}
        // Painted yield triangle is road signage, not a free-floating target.
        ctx.beginPath();ctx.moveTo(224,238);ctx.lineTo(256,238);ctx.lineTo(240,211);ctx.closePath();ctx.strokeStyle='#b7bcac';ctx.lineWidth=2;ctx.stroke();
        for(let x=0;x<190;x+=25){line(x,70,x,78,'#827f77',1);line(x,161,x,168,'#827f77',1);}for(let x=290;x<480;x+=25){line(x,70,x,78,'#827f77',1);line(x,161,x,168,'#827f77',1);}
        // The homes frame a recognisable four-way meeting with main-road priority.
        round(23,13,126,42,2,'#283a41');rect(20,8,126,39,'#ad8265');rect(17,6,132,6,'#5f4a48');
        for(let x=31;x<139;x+=28){rect(x,17,16,20,'#293d45');rect(x+2,19,12,15,'#d6b378');line(x+8,19,x+8,34,'#856a53',1);}
        rect(358,13,94,43,'#35454a');rect(352,7,97,41,'#7b8e7c');rect(351,5,100,6,'#526464');
        round(363,17,29,23,1,'#253a41');rect(398,17,37,14,'#cfbd8d');line(416,17,416,30,'#56635a',2);
        for(const [x,y] of [[33,206],[141,194],[366,219],[438,191]]){ellipse(x+4,y+5,17,14,'#2b3b3a');rect(x-2,y,4,14,'#77634c');ellipse(x,y-6,18,15,'#54735d');ellipse(x-7,y-11,10,9,'#63876a');rect(x-8,y-14,6,3,'#7d9674');}
        rect(296,180,3,35,'#536164');ellipse(301,215,9,3,'#304542');
        poly([[281,176],[315,176],[298,204]],'#ba625a');poly([[286,179],[310,179],[298,199]],'#eee3c8');
        text('GIVE',298,185,4,'#5e6460');text('WAY',298,191,4,'#5e6460');
        rect(178,42,3,23,'#64736d');poly([[168,40],[190,40],[179,57]],'#a7524e');poly([[172,43],[186,43],[179,53]],'#d2d4bd');
      }
      return {
        draw(){
          road();
          for(const c of traffic)drawCar(c.x,c.y,c.dir===1?Math.PI/2:-Math.PI/2,c.color);
          if(phase>=5)drawCar(oppositeX,oppositeY,oppositeAngle,'#cb776b',false,true);
          drawCar(240,carY-nudge,0,'#6fa4ac',true,phase>0);
          if(phase===0){line(240,188,240,176,'#e2c99a',2);poly([[240,174],[235,182],[245,182]],'#e2c99a');}
          if(gapOpen&&phase<6){
            // A restrained open-road shimmer is a visual cue; the opening waits for input.
            ctx.globalAlpha=.3+Math.sin(t*3)*.1;line(215,153,265,153,'#e3d7ac',1);ctx.globalAlpha=1;
          }
          if(drag&&phase!==0){rect(325,234,45,4,'#304044');rect(325,234,clamp(nudge/11,0,1)*45,4,'#d5b47c');}
          rect(0,252,480,18,'#27343b');
          const caption=phase===0?'Ease up to the give-way line':phase===1||phase===3?(gapOpen?'An opening. Try to move forward.':'Wait for a gap…'):phase===2||phase===4?'Not that gap.':phase===5?(gapOpen?'At last. A huge gap.':'The road is finally clearing…'):phase===6?'Oh. You were going first?':'Still at the give-way line.';
          text(caption,240,265,9,'#ede0be');
        },
        down(p){if(finished||![0,1,3,5].includes(phase)||Math.abs(p.x-240)>31||Math.abs(p.y-(carY-nudge))>35)return;drag={x:p.x,y:p.y,carY,nudge};},
        move(p){if(!drag)return;const pull=clamp(drag.y-p.y,0,60);if(phase===0)carY=224-clamp(pull,0,24);else nudge=clamp(pull*.35,0,11);},
        up(){
          if(!drag)return;
          const committed=phase===0?carY<=202:nudge>=8;
          drag=null;
          if(phase===0){if(committed){enter(1);api.say('Just wait for a little space.');}else carY=224;}
          else if(committed&&gapOpen){if(phase===5){attempts++;enter(6);oppositeProgress=0;api.say('A very generous gap. For the car opposite.');}else beginCutoff();}
          else {nudge=0;if(committed)api.say('The main road still has priority.');}
        },
        cancel(){if(drag){carY=drag.carY;nudge=drag.nudge;drag=null;}},
        update(dt){
          t+=dt;phaseTime+=dt;
          for(let i=traffic.length-1;i>=0;i--){const c=traffic[i];c.x+=c.dir*c.speed*dt;if(c.x>530||c.x< -50)traffic.splice(i,1);}
          if(phase===0||phase===7||phase===8){nextWave-=dt;if(nextWave<=0){addCar(-35,0,phase===0?115:150,Math.floor(t)%6);addCar(515,1,phase===0?105:145,Math.floor(t+2)%6);nextWave=1.65;}}
          if([1,3,5].includes(phase)){
            if(phaseTime>.75&&traffic.length===0&&(phase!==5||oppositeY>=38))gapOpen=true;
            if(phase===5)oppositeY=Math.min(38,oppositeY+dt*50);
          }
          if(phase===2||phase===4){
            if(!cutoffSpawned&&phaseTime>.75){addCar(-35,0,210,5);addCar(515,1,200,0);cutoffSpawned=true;}
            if(phaseTime>2.65){enter(phase===2?3:5);if(phase===5)api.say('Finally. A gap you could park a bus in.');}
          }
          if(phase===6){
            oppositeProgress=phaseTime;
            if(phaseTime<.75){oppositeX=240;oppositeY=38+phaseTime/.75*68;oppositeAngle=Math.PI;}
            else if(phaseTime<1.45){const u=(phaseTime-.75)/.7;oppositeX=207+Math.cos(u*Math.PI/2)*33;oppositeY=106+Math.sin(u*Math.PI/2)*33;oppositeAngle=Math.PI+u*Math.PI/2;oppositeTookGap=true;}
            else{oppositeX=207-(phaseTime-1.45)*195;oppositeY=139;oppositeAngle=Math.PI*1.5;}
            if(phaseTime>2.85){enter(7);nextWave=0;api.say('And now the traffic is back. Naturally.');}
          }
          if(phase===7&&phaseTime>1.75){phase=8;finished=true;api.done();}
        },
        debug(){return {phase,attempts,gapOpen,carY,nudge,traffic:traffic.length,opposite:{x:oppositeX,y:oppositeY,angle:oppositeAngle},oppositeProgress,oppositeTookGap,waiting:carY===200,finished};}
      };
    }
  });
})();
