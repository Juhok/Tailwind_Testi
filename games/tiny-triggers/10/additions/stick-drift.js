(() => {
  TinyV7.register({id:'stick-drift',title:'Stick Drift',chapter:'games',description:'Move the stick. Then try standing still.',hint:'Drag the left stick upward and release. Hold it just below its center until the character stops, then let go.',verdict:'Hands off. Character on.',create(api){
    const {ctx,rect,round,ellipse,line,poly,text,clamp,near}=api;
    let phase=0,t=0,held=false,sy=0,walk=0,x=145,still=0,drift=0,finished=false,pushed=false;
    function avatar(){const step=Math.sin(walk*13)*3;ellipse(x,130,10,3,'#132028');rect(x-6,111,12,14,'#f2be6a');rect(x-5,103,10,9,'#efd3ab');rect(x-6,102,12,4,'#5c3745');rect(x-5,124,4,6+step,'#7390b4');rect(x+1,124,4,6-step,'#7390b4');rect(x+6,113,4,9,'#efd3ab');}
    return {draw(){
      api.bg('desk');rect(0,155,480,115,'#292b3b');line(0,155,480,155,'#555164',3);
      ellipse(240,252,151,13,'#171a27');round(63,13,354,148,9,'#111725','#697488');round(73,22,334,128,4,'#233b51');
      ctx.save();ctx.beginPath();ctx.rect(74,23,332,126);ctx.clip();
      const sky=ctx.createLinearGradient(0,24,0,132);sky.addColorStop(0,'#172b46');sky.addColorStop(1,'#657d8b');ctx.fillStyle=sky;ctx.fillRect(74,23,332,126);
      rect(285,36,28,28,'#edd9ab');rect(278,36,9,18,'#526b83');poly([[74,111],[121,67],[173,107],[217,60],[274,111],[336,73],[407,111]],'#334d62');
      for(let i=0;i<9;i++){rect(82+i*39,125,34,24,'#566953');rect(82+i*39,125,34,5,'#97b782');}
      rect(325,111,3,26,'#ddd8bb');poly([[328,111],[351,115],[328,123]],'#e5a77f');
      line(142,135,337,135,'#c6ca9a',1);avatar();ctx.restore();
      round(82,29,123,19,4,'#172232');text(phase===0?'MOVE THE STICK':held&&Math.abs(sy-12)<8?'STANDING STILL':phase===1||phase>=3?'NO INPUT · WALKING':'HOLD TO COUNTER',144,42,8,'#d7e4de');
      rect(221,161,38,10,'#626d7e');poly([[195,177],[285,177],[267,168],[213,168]],'#343f50');
      ctx.save();ctx.translate(240,211);ctx.beginPath();ctx.moveTo(-70,-30);ctx.bezierCurveTo(-106,-39,-131,30,-111,38);ctx.bezierCurveTo(-96,45,-86,20,-65,14);ctx.lineTo(64,14);ctx.bezierCurveTo(87,20,96,45,111,38);ctx.bezierCurveTo(131,30,105,-39,70,-30);ctx.closePath();ctx.fillStyle='#9aa4ba';ctx.fill();ctx.strokeStyle='#d9e0ec';ctx.lineWidth=2;ctx.stroke();ctx.restore();
      round(213,184,54,29,5,'#58647b','#c4ccdc');line(239,190,239,208,'#77869c',1);
      ellipse(183,211,28,24,'#49566f');ellipse(183,211+sy*.6,20,17,'#25364b');ellipse(183,207+sy*.6,16,12,'#5d7492');ellipse(183,206+sy*.6,11,8,'#718ba5');
      ellipse(274,222,16,13,'#26384d');rect(148,186,7,18,'#39475f');rect(142,192,19,6,'#39475f');
      [['#a0c5bb',321,191],['#d8a1b1',334,203],['#e3c786',307,203],['#a8b6df',321,216]].forEach(([c,a,b])=>ellipse(a,b,5,5,c));
      text('DRIFT',249,235,7,'#41495f');
      if(held){ellipse(180,224+sy*.6,15,10,'#cf9f8b');line(165,239,176,230+sy*.6,'#b07f73',17);ellipse(181,220+sy*.6,11,8,'#ebbaa2');}
      text(phase===0?'Push up, then release':phase===1?'A little backward should cancel it…':phase===2?'Finally still. You can let go now.':'It has places to be.',240,265,10,'#d7cbbd');
    },down(p){if(near(p,183,211,34)&&phase<3){held=true;pushed=false;sy=clamp((p.y-211)*1.6,-27,27);}},move(p){if(held){sy=clamp(p.y-211,-27,27);if(sy<-14)pushed=true;}},up(){if(!held)return;held=false;if(phase===0&&pushed){phase=1;api.say('The stick returned. The character did not.');}else if(phase===2){phase=3;drift=0;api.say('There it goes again.');}sy=0;},cancel(){held=false;sy=0;if(phase===2){phase=1;still=0;}},update(dt){t+=dt;const speed=phase===0?(held?-sy*.7:0):held?(12-sy)*.8:12;walk+=Math.abs(speed)*dt*.08;x=clamp(x+speed*dt,100,392);if(phase===1&&held&&Math.abs(sy-12)<7){still+=dt;if(still>.8){phase=2;api.tone(440,.1);}}else if(phase===1)still=0;if(phase===3){drift+=dt;if(drift>2&&!finished){finished=true;api.done();}}},debug(){return {phase,held,stick:sy,characterX:x,counterHeld:still,wandering:phase===3,finished};}};
  }});
})();
