(function () {
  'use strict';
  TinyV8.register({
    id: 'tight-parking', title: 'Perfect Parking, Impossible Exit', chapter: 'road',
    description: 'A space for your car. Almost a space for you.',
    hint: 'Drag the bronze car left along the driving lane, then up into the empty bay. Pull the door handle left. Drag the driver down and left through the narrow gap.',
    verdict: 'The car fits. Your clean trousers were the clearance fee.',
    create(api) {
      const {ctx} = api;
      let phase = 'parking', x = 350, y = 225, activeDrag = null, origin = null;
      let time = 0, transition = 0, open = 0, squeeze = 0, stain = 0, bump = 0;
      let parkingAttempts = 0, parked = false, doorBlocked = false, finished = false;
      const clamp = api.clamp;

      function topCar(cx, cy, color, dirty, small = false) {
        ctx.save(); ctx.translate(cx, cy); if(small) ctx.scale(.88,.88);
        api.round(-31,-51,66,108,10,'#14212a88');
        for(const yy of [-33,27]) {api.round(-30,yy,7,17,2,'#101923');api.round(24,yy,7,17,2,'#101923');}
        api.round(-27,-52,54,103,8,color);
        api.round(-24,-49,48,29,6,color);
        api.line(-20,-47,20,-47,'#e6dcba80',2);
        api.poly([[-22,-22],[22,-22],[20,27],[-20,27]],'#263e4a');
        api.poly([[-20,-19],[20,-19],[17,-8],[-17,-8]],'#9db6bb');
        api.round(-16,-6,32,23,3,color);
        api.line(-13,-4,12,-4,'#dfd1aa66',2);
        api.rect(-22,-12,4,25,'#6d929e');api.rect(18,-12,4,25,'#6d929e');
        api.poly([[-17,20],[17,20],[20,26],[-20,26]],'#6d929e');
        api.rect(-24,-49,9,4,'#e4dbaa');api.rect(15,-49,9,4,'#e4dbaa');
        api.rect(-24,44,8,4,'#bb6656');api.rect(16,44,8,4,'#bb6656');
        api.rect(-10,47,20,3,'#c0c5b5');
        if(dirty) for(let i=0;i<22;i++) {
          const side=i%2?-1:1, xx=side*(20+(i*7)%5), yy=-39+(i*17)%81;
          api.ellipse(xx,yy,3+(i%3),2+(i%4),'#726855');
          api.rect(xx-2,yy,3,1,'#a29673');
        }
        ctx.restore();
      }

      function overview() {
        api.rect(0,0,480,270,'#283d48');
        api.rect(0,0,480,27,'#466257');
        for(let i=0;i<24;i++){api.rect(i*23,8+(i%3)*4,12,3,'#66846b');}
        api.rect(0,27,480,8,'#a8b09b');
        api.rect(0,35,480,235,'#3e4e56');
        for(let i=0;i<60;i++)api.rect((i*83)%480,40+(i*37)%229,2,1,i%2?'#6e797740':'#26384166');
        for(const xx of [73,144,214,282,353,424])api.rect(xx,44,3,118,'#b5b8a1');
        for(let xx=75;xx<425;xx+=70)api.rect(xx,44,65,3,'#b5b8a1');
        for(let xx=89;xx<420;xx+=70)api.round(xx,51,39,7,2,'#7b8177');
        topCar(108,102,'#9eaa7b',false);
        topCar(186,102,'#7597a6',true);
        topCar(320,102,'#b8817b',false);
        topCar(392,102,'#94acaa',false);
        ctx.setLineDash([4,5]);api.line(248,208,248,111,'#b8d0ba',1.5);ctx.setLineDash([]);
        api.poly([[242,119],[248,109],[254,119]],'#b8d0ba');
        api.round(221,77,55,28,4,'#56765f66');api.text('FREE',248,94,9,'#d2dcb9');
        api.line(45,223,112,223,'#95a292',3);api.poly([[45,223],[56,217],[56,229]],'#95a292');
        topCar(x,y,'#c89763',false,true);
        if(phase==='parking') {api.round(13,172,166,24,4,'#253b46');api.text('ONE LAST SPACE',96,188,9,'#cbd5bb');}
        if(parked) {api.round(151,205,178,28,4,'#253b46');api.text('PERFECTLY PARKED.',240,223,10,'#cbd5bb');}
      }

      function driver() {
        const px=356-94*squeeze, py=218+12*squeeze;
        const compress=1-Math.sin(squeeze*Math.PI)*.3;
        ctx.save();ctx.translate(px,py);ctx.scale(compress,1);
        api.ellipse(0,9,20,5,'#13232b66');
        api.round(-15,-37,13,42,3,'#dfd8b8');api.round(2,-37,13,42,3,'#eae3c4');
        api.line(-6,-28,-6,1,'#b1ad97',1);api.line(8,-28,8,1,'#c1baa0',1);
        api.line(-13,-31,-5,-31,'#aaa68f',1);api.line(5,-31,13,-31,'#bbb39a',1);
        api.round(-17,1,17,8,3,'#41505a');api.round(2,1,17,8,3,'#41505a');
        api.round(-19,-65,38,32,5,'#7ba094');
        api.line(0,-61,0,-35,'#43685f',2);
        api.round(-23,-60,7,26,3,'#8dad9c');api.round(16,-60,7,26,3,'#8dad9c');
        api.ellipse(-19,-31,4,5,'#dcaf8d');api.ellipse(19,-31,4,5,'#dcaf8d');
        api.round(-9,-79,18,18,5,'#dcb18d');api.ellipse(0,-78,11,9,'#5c4b41');
        api.rect(-9,-80,18,7,'#695247');
        if(stain>0) {
          ctx.globalAlpha=stain;
          api.poly([[-16,-26],[-9,-28],[-5,-23],[-8,-19],[-5,-14],[-12,-12],[-16,-17]],'#776348');
          api.line(-14,-25,-8,-16,'#9b8360',2);api.rect(-12,-12,3,4,'#887354');
        }
        ctx.restore();
      }

      function closeup() {
        api.rect(0,0,480,270,'#2a3e49');
        api.rect(0,0,480,56,'#536a68');
        for(let xx=0;xx<480;xx+=45)api.rect(xx,10,21,3,'#789181');
        api.rect(0,57,480,7,'#a1a994');api.rect(0,64,480,206,'#47575b');
        for(let i=0;i<38;i++)api.rect((i*71)%480,82+(i*43)%188,3,1,'#263e4777');
        // The dirty neighbour is viewed from the side, close enough to brush.
        api.round(-63,77,309,158,19,'#172b3488');
        api.round(-69,64,315,156,18,'#7395a0');
        api.poly([[-20,64],[166,64],[216,104],[-30,104]],'#2c4652');
        api.poly([[1,70],[157,70],[194,98],[0,98]],'#8ca6ab');
        api.line(75,70,75,98,'#4f6a73',4);
        api.line(-5,110,233,110,'#bdd0c477',3);
        api.line(185,113,185,199,'#516f78',2);
        api.round(151,123,25,5,2,'#c1cbc0');
        api.ellipse(43,220,31,32,'#182832');api.ellipse(43,220,18,19,'#74858a');api.ellipse(43,220,7,8,'#b7c2b9');
        api.rect(-10,203,210,8,'#526b73');
        for(let i=0;i<35;i++) {
          const xx=10+(i*53)%230, yy=147+(i*19)%55;
          api.ellipse(xx,yy,4+i%7,2+i%5,'#776d58');
          if(i%3===0)api.line(xx,yy,xx+5,yy+12,'#9e9271',2);
        }
        api.line(242,117,242,199,'#b3b9a077',2);
        api.line(239,112,252,116,'#39545f',5);
        api.round(246,109,16,12,4,'#648793','#a3b6af');
        api.line(260,112,260,119,'#b5c6c1',2);
        // Bronze car and the black opening behind its driver's door.
        api.round(325,73,227,151,16,'#ad7d50');
        api.poly([[326,77],[480,77],[480,119],[314,119]],'#8a673f');
        api.round(327,119,122,89,8,'#1c3039');
        api.round(339,145,76,51,8,'#3c4b49');
        api.ellipse(451,220,30,32,'#192934');api.ellipse(451,220,17,19,'#758485');
        const edge=330-open*69;
        ctx.save();
        api.poly([[edge,82],[439,94],[439,204],[edge+4,211]],'#c5925c');
        api.poly([[edge+8,87],[428,99],[428,135],[edge+9,136]],'#2f4b57');
        api.poly([[edge+14,93],[421,102],[421,128],[edge+14,129]],'#88a6ad');
        api.line(edge+10,143,429,143,'#e1c392',3);
        api.line(edge+5,148,edge+7,202,'#e2ba8077',2);
        api.round(edge+17,154,28,6,2,'#e4d9b4');
        api.line(edge+17,161,edge+43,161,'#7b5a40',2);
        if(bump>0) {api.line(edge-7,185,edge-17,180,'#e5c57d',2);api.line(edge-8,196,edge-21,198,'#e5c57d',2);}
        ctx.restore();
        // Driver emerges only after the door has hit its maximum opening.
        if(phase==='squeeze'||phase==='smudge'||phase==='done') driver();
        if(phase==='door') {
          api.round(263,20,198,27,5,'#263c46');api.text('NOW, THE DOOR.',362,38,9,'#e0d2b0');
          ctx.setLineDash([3,4]);api.line(350,163,283,163,'#e7d2a1',1.5);ctx.setLineDash([]);
          api.poly([[283,163],[290,159],[290,167]],'#e7d2a1');
        } else if(phase==='thunk') {
          api.round(271,20,177,27,5,'#263c46');api.text('THUNK. THAT IS IT.',359,38,9,'#e0d2b0');
        } else if(phase==='squeeze') {
          api.round(266,20,201,27,5,'#263c46');api.text('SURELY YOU CAN FIT.',366,38,9,'#e0d2b0');
          ctx.setLineDash([3,4]);api.line(311,224,264,238,'#e2cfa4',1.5);ctx.setLineDash([]);
          api.poly([[264,238],[269,231],[272,239]],'#e2cfa4');
        }
        if(phase==='done'||phase==='smudge') {
          api.round(276,20,184,27,5,'#263c46');api.text('THEY WERE CLEAN.',368,38,9,'#e0d2b0');
          // A magnified view makes the transfer onto pale trousers unambiguous.
          ctx.save();ctx.beginPath();ctx.arc(124,204,42,0,Math.PI*2);ctx.clip();
          api.rect(80,160,88,88,'#e3dcbd');api.line(124,160,124,247,'#b9b297',2);
          api.poly([[88,161],[113,161],[109,185],[91,182]],'#d1caad');
          api.line(91,182,109,185,'#a9a48c',1.5);
          ctx.globalAlpha=stain;
          api.poly([[93,192],[113,188],[129,198],[118,203],[130,216],[111,229],[92,220]],'#796448');
          api.line(99,196,118,219,'#a48a62',5);api.line(91,203,106,223,'#917754',3);
          api.rect(128,224,5,7,'#8a7151');ctx.restore();
          ctx.strokeStyle='#c2cbb6';ctx.lineWidth=3;ctx.beginPath();ctx.arc(124,204,42,0,Math.PI*2);ctx.stroke();
          ctx.setLineDash([3,4]);api.line(169,203,246,208,'#c2cbb6',1);ctx.setLineDash([]);
        }
      }

      return {
        draw() {
          if(phase==='parking'||phase==='parked')overview();else closeup();
          if(phase==='parked')api.rect(0,0,480,270,'rgba(14,25,33,'+Math.min(.94,transition*1.5)+')');
        },
        down(p) {
          if(phase==='parking'&&api.hit(p,x,y,64,96)) {
            activeDrag='car';origin={x:p.x-x,y:p.y-y,startX:x,startY:y};
          } else if(phase==='door'&&api.hit(p,358-open*69,160,65,45)) {
            activeDrag='door';origin={x:p.x,open};
          } else if(phase==='squeeze'&&api.hit(p,356-94*squeeze,181+12*squeeze,54,92)) {
            activeDrag='driver';origin={x:p.x,y:p.y};
          }
        },
        move(p) {
          if(activeDrag==='car') {
            const xx=clamp(p.x-origin.x,226,402), yy=clamp(p.y-origin.y,99,225);
            // Passing the neighbouring cars requires lining up in the driving lane first.
            if(y<185&&Math.abs(xx-248)>14) { y=Math.max(y,185); }
            x=xx;
            y=Math.abs(x-248)<=14?yy:Math.max(yy,211);
          } else if(activeDrag==='door') {
            open=clamp((origin.x-p.x)/68,0,1);
            if(open>.96)bump=.12;
          } else if(activeDrag==='driver') {
            const across=clamp((origin.x-p.x)/94,0,1), down=clamp((p.y-origin.y)/30,0,1);
            squeeze=Math.min(across,down);
            stain=clamp((squeeze-.76)/.24,0,1);
          }
        },
        up() {
          if(activeDrag==='car') {
            parkingAttempts++;
            if(Math.abs(x-248)<=14&&y<=112) {x=248;y=102;parked=true;phase='parked';transition=0;api.tone(340,.13,.018);}
          } else if(activeDrag==='door') {
            if(open>.8) {open=1;doorBlocked=true;phase='thunk';transition=0;bump=.45;api.tone(105,.09,.025);}
            else open=0;
          } else if(activeDrag==='driver') {
            if(squeeze>.85) {squeeze=1;stain=1;phase='smudge';transition=0;api.tone(150,.12,.018);}
            else {squeeze=0;stain=0;}
          }
          activeDrag=null;
        },
        cancel() {
          if(activeDrag==='car') {x=origin.startX;y=origin.startY;}
          if(activeDrag==='door')open=0;
          if(activeDrag==='driver'){squeeze=0;stain=0;}
          activeDrag=null;
        },
        update(dt) {
          time+=dt;bump=Math.max(0,bump-dt);
          if(phase==='parked'||phase==='thunk'||phase==='smudge') {
            transition+=dt;
            if(phase==='parked'&&transition>.65){phase='door';api.say('Try the door handle.');}
            else if(phase==='thunk'&&transition>.8){phase='squeeze';api.say('Squeeze down and left through the gap.');}
            else if(phase==='smudge'&&transition>.85){phase='done';finished=true;api.done();}
          }
        },
        debug(){return{phase,x,y,activeDrag,parkingAttempts,parked,doorOpening:open,doorBlocked,squeeze,stain,cleanTrousers:stain===0,finished};}
      };
    }
  });
})();
