(() => {
  TinyV8.register({
    id: 'nugget-bag', title: 'The Mostly Empty Nugget Bag', chapter: 'kitchen',
    description: 'Empty the family bag onto the baking tray.',
    hint: 'Pull the top-right corner up and right to tear the seal. Drag the bag right over the tray to turn it upside down, then release. When the nuggets stop falling, grab the bag and shake it left and right several times before releasing.',
    verdict: 'Family size. If your family is four very small birds.',
    create(api) {
      const {ctx, rect, round, ellipse, line, poly, text, clamp} = api;
      const home = {x: 141, y: 143, a: 0};
      let pose = {...home}, phase = 0, time = 0, drag = null, tear = 0, tilt = 0;
      let pourTime = 0, released = 0, landed = 0, finishTime = 0, finished = false;
      let swings = 0, shakeDistance = 0, lastDirection = 0, turnX = 0, crinkle = 0;
      let stripX = 0, stripY = 0, stripAngle = 0, crumbLanded = false;
      const pieces = [];
      function local(x, y) { return {x: pose.x + x * Math.cos(pose.a) - y * Math.sin(pose.a), y: pose.y + x * Math.sin(pose.a) + y * Math.cos(pose.a)}; }
      function bagHit(p) {
        const dx = p.x - pose.x, dy = p.y - pose.y;
        return Math.abs(dx*Math.cos(pose.a)+dy*Math.sin(pose.a)) < 57 && Math.abs(-dx*Math.sin(pose.a)+dy*Math.cos(pose.a)) < 82;
      }
      function nugget(x,y,size,rotation,seed,crumb=false) {
        ctx.save(); ctx.translate(x,y); ctx.rotate(rotation);
        if (crumb) { poly([[-2,-2],[2,-1],[1,2],[-2,1]], '#d5a35d'); rect(-1,-2,2,1,'#f5ca7c'); ctx.restore(); return; }
        ctx.scale(size,size);
        ctx.beginPath();ctx.moveTo(-11,-7);ctx.lineTo(-5,-11);ctx.lineTo(4,-10);ctx.lineTo(11,-5);ctx.lineTo(13,1);ctx.lineTo(7,8);ctx.lineTo(-3,10);ctx.lineTo(-12,5);ctx.closePath();
        ctx.fillStyle='#a97539';ctx.fill();ctx.strokeStyle='#6d4a2c';ctx.lineWidth=1.3;ctx.stroke();
        poly([[-10,-6],[-4,-9],[4,-8],[10,-4],[10,2],[5,6],[-4,7],[-10,3]],'#dab168');
        for(let n=0;n<20;n++) {const px=((n*17+seed*7)%19)-9,py=((n*13+seed*3)%13)-6;rect(px,py,n%3?1.5:2.3,n%2?1.5:2,n%3?'#bb884b':'#f3cd83');}
        line(-7,-6,2,-7,'#f3d495',1.5);ctx.restore();
      }
      function mouth() { const p=local(0,-72); return p; }
      function releasePiece(crumb=false) {
        const p=mouth(), n=released;
        pieces.push({x:p.x,y:p.y,ox:p.x,oy:p.y,tx:crumb?355:[300,326,354,382][n],ty:crumb?215:[209,222,200,218][n],age:0,duration:crumb?.72:.54+n*.05,rotation:crumb?0:n*.8,landed:false,crumb,bounce:0});
        if(!crumb)released++;
      }
      function tray() {
        ellipse(330,242,115,10,'#252b31');
        poly([[231,173],[430,173],[457,240],[207,240]],'#b1bdc4');
        poly([[231,176],[429,176],[448,234],[215,234]],'#414d59');
        poly([[242,181],[420,181],[439,230],[224,230]],'#82919a');
        poly([[245,183],[418,183],[435,228],[229,228]],'#9fa9a8');
        for(let i=0;i<8;i++){line(246+i*23,185,238+i*26,226,i%2?'#aab3b1':'#929e9f',1);line(237,190+i*5,423+i*2,190+i*5,'#a8b2b0',.6);}
        line(231,174,429,174,'#d2dcda',2);line(208,240,456,240,'#6a7783',3);
        line(215,234,447,234,'#d5ddda',1.5);line(212,237,224,211,'#c2ccca',2);
        round(213,225,7,9,2,'#333d48');round(442,225,7,9,2,'#333d48');
      }
      function bag() {
        ctx.save(); ctx.translate(pose.x,pose.y);ctx.rotate(pose.a);
        const squeeze = drag&&phase===3?Math.sin(crinkle)*2:0;
        ctx.beginPath();ctx.moveTo(-47,-72);ctx.lineTo(47,-72);ctx.lineTo(51-squeeze,-48);ctx.lineTo(46,70);ctx.lineTo(34,78);ctx.lineTo(-38,77);ctx.lineTo(-49+squeeze,63);ctx.lineTo(-51,-43);ctx.closePath();
        const g=ctx.createLinearGradient(-52,0,52,0);g.addColorStop(0,'#983e43');g.addColorStop(.17,'#c9574e');g.addColorStop(.5,'#d66853');g.addColorStop(.84,'#ba4945');g.addColorStop(1,'#85343b');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#ec9c75';ctx.lineWidth=1;ctx.stroke();
        poly([[-47,-59],[-35,-45],[-39,55],[-46,68]],'#a64743');poly([[46,-57],[35,-42],[38,60],[46,69]],'#9e4141');
        line(-44,-62,-43,62,'#f59b72',1);line(43,-62,42,61,'#793a40',1.5);
        for(let i=0;i<4;i++){line(-43,65+i*2,42,66+i*2,'#8c3e3d',1);}
        poly([[-39,-46],[37,-46],[39,-25],[-38,-25]],'#e8bf76');
        text('FAMILY BAG',0,-32,11,'#693c3c');
        text('CHICKEN',0,-7,12,'#fff1c5');text('NUGGETS',0,9,13,'#fff1c5');
        ellipse(0,37,32,18,'#e9d7a6');ellipse(0,36,27,13,'#f3e4bd');
        for(let i=0;i<7;i++)nugget(-18+(i%3)*17,29+Math.floor(i/3)*8,.59,i*.65,i);
        text('SERVING SUGGESTION',0,61,4.7,'#f4bb8e');
        line(-40,-19,-32,-13,'#efa37b',1);line(31,18,40,26,'#863b3c',1);line(-43,48,-35,54,'#ee9471',1);
        if(phase===0){
          poly([[-47,-78],[47,-78],[50,-68],[-48,-68]],'#c77b55');
          for(let i=-44;i<46;i+=4)line(i,-76,i,-70,'#f0b77e',1);
          if(tear>0){poly([[47-tear*80,-72],[49,-72],[49+tear*38,-75-tear*23],[43-tear*80,-78]],'#f1bc89');}
          poly([[45,-69],[51,-73],[44,-78]],'#f8d091');
        }else{
          poly([[-47,-72],[-38,-75],[-28,-70],[-17,-74],[-6,-70],[4,-75],[15,-71],[27,-75],[38,-70],[47,-74],[45,-65],[-46,-65]],'#f0c995');
          ellipse(0,-69,39,7,'#362e33');ellipse(0,-71,37,3,'#775450');
          line(-40,-73,-27,-72,'#f6d6ac',1.5);line(19,-73,37,-72,'#f6d6ac',1.5);
        }
        ctx.restore();
      }
      return {
        draw() {
          api.bg('kitchen');rect(0,0,480,151,'#293e46');
          for(let y=15;y<150;y+=34){line(0,y,480,y,'#3d5358',1);for(let x=(y%2)*44;x<480;x+=86)line(x,y,x,y+34,'#3d5358',1);}
          round(23,18,68,111,3,'#1d2c35','#56666b');round(28,24,58,84,2,'#344a51');
          line(62,113,80,113,'#b1beb8',3);rect(33,30,48,3,'#486268');
          round(360,32,80,70,3,'#22343c','#56676c');round(366,38,68,48,2,'#1a2932');
          for(let i=0;i<3;i++){ellipse(376+i*24,93,3,3,'#bdb9a3');line(376+i*24,90,376+i*24,92,'#36434c',1);}
          rect(0,150,480,120,'#685c56');rect(0,150,480,5,'#988577');
          for(let i=0;i<7;i++)line(i*77,156,i*77+31,270,'#78675c',1);
          ellipse(pose.x,235,54,8,'#3f3938');tray();
          if(phase>0){ctx.save();ctx.translate(stripX,stripY);ctx.rotate(stripAngle);poly([[-44,-3],[-30,-5],[-12,-2],[5,-5],[20,-2],[43,-4],[45,4],[-44,4]],'#cf8059');for(let i=-40;i<42;i+=5)line(i,-1,i,3,'#f2b47c',1);ctx.restore();}
          for(const p of pieces)if(p.landed){ellipse(p.tx,p.ty+3,p.crumb?3:12,p.crumb?1:4,'#626f70');nugget(p.x,p.y,p.crumb?1:.9,p.rotation,Math.round(p.tx),p.crumb);}
          bag();
          for(const p of pieces)if(!p.landed){ellipse(p.tx,p.ty+3,p.crumb?2:8,2,'#788582');nugget(p.x,p.y,p.crumb?1:.9,p.rotation,Math.round(p.tx),p.crumb);}
          if(phase===0){line(191,55,219,34,'#e7c38b',1.5);poly([[219,34],[211,37],[216,44]],'#e7c38b');}
          if(phase===1&&!drag){const bx=221,by=139;ctx.strokeStyle='#e8c38d';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx,by,25,-2,-.05);ctx.stroke();poly([[246,139],[238,135],[239,143]],'#e8c38d');}
          if(phase===3){line(147,54,174,54,'#e7c38b',1.5);poly([[146,54],[152,50],[152,58]],'#e7c38b');line(266,54,292,54,'#e7c38b',1.5);poly([[293,54],[287,50],[287,58]],'#e7c38b');}
          rect(0,251,480,19,'#27333c');
          text(phase===0?'Pull the sealed corner':phase===1?'Tip the open bag over the tray':phase===2?'Any more in there?':phase===3?'Give it a hopeful shake':phase===4?'One final contribution…':'Family bag. Four nuggets. One crumb.',240,264,9,'#efe0bf');
        },
        down(p) {
          if(finished||phase===2||phase===4||phase===5)return;
          if(phase===0){if(Math.hypot(p.x-187,p.y-69)<29)drag={x:p.x,y:p.y,pose:{...pose},phase};}
          else if(bagHit(p)){drag={x:p.x,y:p.y,pose:{...pose},phase,swings,shakeDistance};turnX=p.x;lastDirection=0;}
        },
        move(p) {
          if(!drag)return;
          const dx=p.x-drag.x,dy=p.y-drag.y;
          if(phase===0)tear=clamp((dx-dy*.65)/85,0,1);
          if(phase===1){tilt=clamp(dx/103,0,1);pose.x=home.x+tilt*81;pose.y=home.y-tilt*35;pose.a=tilt*1.95;}
          if(phase===3){pose.x=clamp(drag.pose.x+dx,180,261);pose.y=clamp(drag.pose.y+dy*.25,88,123);pose.a=1.95+clamp(dx/180,-.2,.2);crinkle=dx*.12;const delta=p.x-turnX;if(Math.abs(delta)>22){const direction=Math.sign(delta);if(direction!==lastDirection){swings++;lastDirection=direction;}shakeDistance+=Math.abs(delta);turnX=p.x;}}
        },
        up() {
          if(!drag)return;
          if(phase===0){if(tear>.9){phase=1;stripX=196;stripY=64;stripAngle=-.45;api.tone(380,.08,.022);api.say('A whole family bag. Plenty of room on that tray.');}tear=0;}
          else if(phase===1){if(tilt>.88){phase=2;pose={x:222,y:108,a:1.95};pourTime=0;api.say('Here comes dinner.');}else{pose={...home};tilt=0;}}
          else if(phase===3){pose={x:222,y:108,a:1.95};if(swings>=3&&shakeDistance>130){phase=4;finishTime=0;releasePiece(true);api.say('There. That was the rest.');}else{swings=drag.swings;shakeDistance=drag.shakeDistance;}}
          drag=null;
        },
        cancel() {if(!drag)return;pose={...drag.pose};tear=0;tilt=phase===1?0:tilt;if(phase===3){swings=drag.swings;shakeDistance=drag.shakeDistance;}drag=null;},
        update(dt) {
          time+=dt;
          if(phase>0&&stripY<232){stripY=Math.min(232,stripY+dt*100);stripX-=dt*30;stripAngle+=dt*1.7;if(stripY===232)stripAngle=.13;}
          if(phase===2){pourTime+=dt;while(released<4&&pourTime>.22+released*.23)releasePiece();if(landed===4&&pourTime>1.8){phase=3;api.say('Four nuggets. Surely there is something caught in the bottom.');}}
          for(const p of pieces){
            if(!p.landed){p.age+=dt;const u=clamp(p.age/p.duration,0,1);p.x=p.ox+(p.tx-p.ox)*u;p.y=p.oy+(p.ty-p.oy)*u*u;p.rotation+=dt*(p.crumb?2:3.8);if(u===1){p.landed=true;p.bounce=.18;if(p.crumb)crumbLanded=true;else landed++;api.tone(p.crumb?900:330+landed*50,.045,p.crumb?.006:.012);}}
            else if(p.bounce>0){p.bounce-=dt;p.y=p.ty-Math.sin(clamp(p.bounce/.18,0,1)*Math.PI)*(p.crumb?2:5);}
          }
          if(phase===4){finishTime+=dt;if(crumbLanded&&finishTime>1.45){phase=5;finished=true;api.done();}}
        },
        debug() {return {phase,tear,tilt,bag:{...pose},nuggetsReleased:released,nuggetsLanded:landed,falling:pieces.filter(p=>!p.landed).length,swings,shakeDistance,crumbReleased:pieces.some(p=>p.crumb),crumbLanded,finished};}
      };
    }
  });
})();
