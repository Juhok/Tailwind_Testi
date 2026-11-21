(function () {
  'use strict';
  TinyV8.register({
    id: 'tight-parking', title: 'Perfect Parking, Impossible Exit', chapter: 'road',
    description: 'A space for your car. Almost a space for you.',
    hint: 'Drag the bronze car left along the driving lane, then up into the empty bay. After the view zooms in, pull the left door handle outward. Drag the driver down through the narrow gap past the dirty car.',
    verdict: 'The car fits. Your clean trousers were the clearance fee.',
    create(api) {
      const {ctx} = api;
      let phase = 'parking', x = 350, y = 225, activeDrag = null, origin = null;
      let time = 0, transition = 0, open = 0, squeeze = 0, stain = 0, bump = 0;
      let parkingAttempts = 0, parked = false, doorBlocked = false, finished = false, zoom=1, heading=-Math.PI/2;
      const screen=p=>({x:240+(p.x-240)*zoom,y:135+(p.y-135)*zoom});
      const world=p=>({x:240+(p.x-240)/zoom,y:135+(p.y-135)/zoom});
      const handle=()=>({x:221-Math.sin(open*.24)*28,y:84+Math.cos(open*.24)*28});
      const driverPos=()=>({x:224-9*Math.min(1,squeeze*3),y:123+54*squeeze});
      const clamp = api.clamp;

      function topCar(cx, cy, color, dirty, small = false) {
        ctx.save(); ctx.translate(cx, cy); if(small){ctx.rotate(heading);}
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
        if(!parked){ctx.setLineDash([4,5]);api.line(248,208,248,111,'#b8d0ba',1.5);ctx.setLineDash([]);
        api.poly([[242,119],[248,109],[254,119]],'#b8d0ba');
        api.round(221,77,55,28,4,'#56765f66');api.text('FREE',248,94,9,'#d2dcb9');}
        api.line(45,223,112,223,'#95a292',3);api.poly([[45,223],[56,217],[56,229]],'#95a292');
        topCar(x,y,'#c89763',false,true);
        if(phase==='parking') {api.round(13,172,166,24,4,'#253b46');api.text('ONE LAST SPACE',96,188,9,'#cbd5bb');}
        if(parked){topDoor();if(['squeeze','smudge','done'].includes(phase))driver();}
      }

      function topDoor(){
        // The driver's door hinges at the front and stops against the dirty neighbour.
        const hx=221,hy=84,angle=open*.24;
        api.poly([[221,84],[227,84],[227,120],[221,120]],'#192f39');
        ctx.save();ctx.translate(hx,hy);ctx.rotate(angle);
        api.round(-2,0,5,35,1,'#c89763','#ecd0a1');
        api.rect(-1,5,3,18,'#95afb1');api.rect(-3,27,3,5,'#e5d5b4');
        ctx.restore();
        // Visible mirror on the adjacent car and the paint at the contact point.
        api.round(211,113,4,9,1,'#6e8d98');
        if(doorBlocked){api.line(210,113,207,109,'#efd29a',1);api.line(209,117,205,119,'#efd29a',1);}
      }
      function driver(){
        const p=driverPos();ctx.save();ctx.translate(p.x,p.y);
        api.ellipse(0,3,6,11,'#16252d66');
        // Pale trouser legs trail the shoulders in the same overhead projection.
        api.round(-5,-1,4,12,1,'#e3dabc');api.round(1,-1,4,12,1,'#eee4c6');
        api.round(-6,9,5,3,1,'#263b46');api.round(1,9,5,3,1,'#263b46');
        api.round(-6,-9,12,10,2,'#7ba094');api.line(-6,-7,-7,1,'#cfa180',2);api.line(6,-7,6,1,'#cfa180',2);
        api.ellipse(0,-11,4.5,5,'#695044');api.ellipse(0,-9,3.2,2,'#d7ac87');
        if(stain){ctx.globalAlpha=stain;api.poly([[-5,1],[-2,2],[-3,5],[-1,8],[-5,8]],'#785c3d');api.line(-5,2,-3,7,'#9f8255',1);}
        ctx.restore();
      }
      return {
        draw() {
          ctx.save();ctx.translate(240,135);ctx.scale(zoom,zoom);ctx.translate(-240,-135);overview();ctx.restore();
          if(parked){
            const captions={parked:'PERFECTLY PARKED.',door:'NOW, THE DOOR.',thunk:'THUNK. THAT IS IT.',squeeze:'SURELY YOU CAN FIT.',smudge:'THEY WERE CLEAN.',done:'THEY WERE CLEAN.'};
            api.round(247,15,217,28,4,'#253b46');api.text(captions[phase],355,33,10,'#e0d2b0');
            if(phase==='done'||phase==='smudge'){
              const d=screen(driverPos());ctx.setLineDash([3,4]);api.line(d.x-3,d.y+7,d.x-56,d.y+30,'#e1cfaa',1);ctx.setLineDash([]);
              api.round(d.x-147,d.y+24,89,24,3,'#253b46');api.text('FRESH MUD.',d.x-102,d.y+40,9,'#e0d2b0');
            }
          }
        },
        down(p) {
          p=world(p);
          if(phase==='parking'&&api.hit(p,x,y,64,96)) {
            activeDrag='car';origin={x:p.x-x,y:p.y-y,startX:x,startY:y};
          } else if(phase==='door'&&api.hit(p,handle().x,handle().y,23,30)) {
            activeDrag='door';origin={x:p.x,open};
          } else if(phase==='squeeze'&&api.hit(p,driverPos().x,driverPos().y-1,22,31)) {
            activeDrag='driver';origin={x:p.x,y:p.y};
          }
        },
        move(p) {
          p=world(p);
          if(activeDrag==='car') {
            const xx=clamp(p.x-origin.x,226,402), yy=clamp(p.y-origin.y,99,225);
            // Passing the neighbouring cars requires lining up in the driving lane first.
            if(y<185&&Math.abs(xx-248)>14) { y=Math.max(y,185); }
            const dx=xx-x,dy=yy-y;if(Math.hypot(dx,dy)>.2)heading=Math.atan2(dx,-dy);
            x=xx;
            y=Math.abs(x-248)<=14?yy:Math.max(yy,211);
          } else if(activeDrag==='door') {
            open=clamp((origin.x-p.x)/20,0,1);
            if(open>.96)bump=.12;
          } else if(activeDrag==='driver') {
            const across=clamp((origin.x-p.x)/9,0,1), down=clamp((p.y-origin.y)/54,0,1);
            squeeze=Math.min(across,down);
            stain=clamp((squeeze-.32)/.36,0,1);
          }
        },
        up() {
          if(activeDrag==='car') {
            parkingAttempts++;
            if(Math.abs(x-248)<=14&&y<=112) {x=248;y=102;heading=0;parked=true;phase='parked';transition=0;api.tone(340,.13,.018);}
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
          time+=dt;if(parked)zoom=Math.min(1.85,zoom+dt*1.2);bump=Math.max(0,bump-dt);
          if(phase==='parked'||phase==='thunk'||phase==='smudge') {
            transition+=dt;
            if(phase==='parked'&&transition>.8){phase='door';api.say('Try the door handle.');}
            else if(phase==='thunk'&&transition>.8){phase='squeeze';api.say('Squeeze downward through the narrow gap beside the dirty car.');}
            else if(phase==='smudge'&&transition>.85){phase='done';finished=true;api.done();}
          }
        },
        guidance(){
          if(phase==='done')return null;
          if(['parked','thunk','smudge'].includes(phase))return{kind:'wait',label:phase==='parked'?'Looking at the door…':phase==='thunk'?'The door cannot open wider…':'The mud transferred…'};
          if(phase==='parking')return{kind:'drag',from:[x,y],to:[248,102],via:[[248,Math.max(211,y)]],label:'Line up, then park'};
          if(phase==='door'){const h=screen(handle());return{kind:'drag',from:[h.x,h.y],to:[h.x-37,h.y],label:'Pull the door outward'};}
          const d=screen(driverPos());return{kind:'drag',from:[d.x,d.y],to:[d.x-19,d.y+101],label:'Squeeze down the gap'};
        },
        debug(){return{phase,x,y,activeDrag,parkingAttempts,parked,doorOpening:open,doorBlocked,squeeze,stain,cleanTrousers:stain===0,finished,projection:'top-down',zoom,handle:screen(handle()),driver:screen(driverPos()),doorAngle:open*.24};}
      };
    }
  });
})();
