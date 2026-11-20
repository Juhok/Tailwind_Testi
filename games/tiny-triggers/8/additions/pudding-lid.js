(function () {
  'use strict';
  TinyV8.register({
    id: 'pudding-lid', title: 'The Mystery Hole in the Lid', chapter: 'kitchen',
    description: 'Unpack your pudding. Is that a hole in the foil?',
    hint: 'Lift the pudding out of the shopping bag onto the round mat. Drag the cup right to tilt its foil toward the lamp; hold it in the light briefly, then let go.',
    verdict: 'The shop? The bag? The pudding declines to comment.',
    create(api) {
      const { ctx } = api;
      const home = { x: 110, y: 153 }, table = { x: 247, y: 165 };
      let cup = { ...home }, phase = 'packed', drag = null, start = null;
      let t = 0, settling = 0, revealTime = 0, angle = 0, aim = 0, scale = .72, lightHold = 0, reveal = 0, distance = 0;
      const ease = n => n * n * (3 - 2 * n);
      const color = (a, b, n) => { const x = a.match(/\w\w/g).map(v => parseInt(v, 16)), y = b.match(/\w\w/g).map(v => parseInt(v, 16)); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * n)).join(',')})`; };
      function paperBag(front) {
        if (!front) {
          api.ellipse(105,219,66,12,'#111b23');
          api.poly([[43,135],[65,121],[153,121],[166,139],[158,225],[51,225]],'#8c7054');
          ctx.strokeStyle='#a48a65';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(76,133);ctx.bezierCurveTo(74,85,128,85,130,133);ctx.stroke();
          api.poly([[50,137],[64,127],[149,127],[159,138],[148,150],[61,151]],'#3f362d');
          // A receipt and an ordinary teaspoon offer no definitive explanation.
          api.poly([[63,127],[61,93],[84,90],[88,131]],'#d8d3b9');
          for(let i=0;i<5;i++)api.line(66,98+i*5,80,97+i*5,'#93988a',1);
          api.line(143,133,153,91,'#b2beb5',4);api.ellipse(154,87,5,9,'#adbdb7');api.ellipse(154,86,2.5,6,'#7d9796');
        } else {
          api.poly([[43,136],[63,147],[150,147],[166,137],[158,225],[51,225]],'#aa8b62');
          api.poly([[43,136],[63,147],[61,225],[51,225]],'#8e7251');
          api.poly([[150,147],[166,137],[158,225],[148,225]],'#80664b');
          api.line(65,151,145,151,'#c2a579',2);api.line(61,225,148,225,'#c1a276',2);
          for(let i=0;i<8;i++)api.line(68+i*10,155,70+i*10,215,'#a48760',.7);
          api.round(79,169,51,32,3,'#c2ab7d');api.text('CORNER',104,181,7,'#5c6549');api.text('MARKET',104,192,8,'#5c6549');
          api.line(70,139,70,157,'#8d7052',3);api.line(139,140,138,157,'#8d7052',3);
        }
      }
      function lamp() {
        api.ellipse(402,222,34,7,'#101c24');api.ellipse(401,216,29,7,'#607576');api.ellipse(401,213,27,5,'#8d9b8b');
        api.line(401,212,407,75,'#9aa592',7);api.line(402,209,408,76,'#586f72',2);
        api.line(407,76,363,48,'#a5ad97',7);api.ellipse(407,76,6,6,'#6c8684');
        api.poly([[347,30],[371,34],[384,62],[339,81],[330,59]],'#8caa9d');
        api.poly([[347,30],[354,37],[343,65],[330,59]],'#bad0b3');
        api.ellipse(361,69,24,9,'#233e43');
        ctx.save();ctx.translate(361,69);ctx.rotate(-.39);api.ellipse(0,0,21,6,'#e6ce8b');api.ellipse(0,-1,13,3,'#fff0b8');ctx.restore();
      }
      function cupArt() {
        ctx.save();ctx.translate(cup.x,cup.y);ctx.scale(scale,scale);ctx.rotate(angle);
        // The tub tilts as one object; the shiny lid remains attached.
        const g=ctx.createLinearGradient(-48,0,48,0);g.addColorStop(0,'#b9bb9e');g.addColorStop(.2,'#e4e2c2');g.addColorStop(.65,'#d4d3af');g.addColorStop(1,'#949e8c');
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-49,-25);ctx.lineTo(-36,47);ctx.quadraticCurveTo(0,59,36,47);ctx.lineTo(49,-25);ctx.closePath();ctx.fill();
        api.ellipse(0,46,36,9,'#9ba591');api.ellipse(0,44,34,7,'#bdc2a4');
        ctx.save();ctx.beginPath();ctx.moveTo(-45,-14);ctx.lineTo(45,-14);ctx.lineTo(37,38);ctx.quadraticCurveTo(0,49,-37,38);ctx.closePath();ctx.clip();
        api.rect(-48,-14,96,66,'#6c4440');api.rect(-48,-14,96,8,'#b68766');
        for(let i=0;i<8;i++)api.line(-41+i*12,-8,-46+i*12,42,'#744c44',1);
        api.text('CHOCO',0,7,13,'#f1dca9');api.text('PUDDING',0,19,8,'#dfc6a0');
        api.ellipse(0,33,16,5,'#3e2829');api.ellipse(0,29,13,6,'#9d6850');api.ellipse(-4,27,7,2,'#c8956b');
        api.text('150 g',29,36,5,'#d3b997');ctx.restore();
        api.line(-41,-8,-32,35,'#f0edcb77',2);api.line(42,-8,33,35,'#65664d66',2);
        api.ellipse(0,-25,51,20,'#788c89');api.ellipse(0,-28,51,19,'#d3d9bc');
        const foil=ctx.createLinearGradient(-45,-44,40,-11);foil.addColorStop(0,'#91a9a5');foil.addColorStop(.3,'#d4dfd0');foil.addColorStop(.45,'#f5efcb');foil.addColorStop(.58,'#bacdc2');foil.addColorStop(1,'#869e98');
        api.ellipse(0,-29,48,16,foil);
        ctx.save();ctx.beginPath();ctx.ellipse(0,-29,47,15,0,0,Math.PI*2);ctx.clip();
        for(let i=0;i<18;i++){const x=-46+i*5.4;api.line(x,-43,x+7,-16,i%3?'#e5e8d055':'#718e8655',.8);}
        ctx.globalAlpha=.3+Math.max(0,angle)*.4;api.poly([[-50,-30],[15,-48],[30,-43],[-35,-15]],'#fff5c3');ctx.globalAlpha=1;
        api.ellipse(-8,-30,21,8,'#6b4949');api.text('CHOCO',-8,-27,7,'#e8d9b1');
        // Small jagged puncture: this is damage, not an intentional pull tab.
        api.poly([[23,-34],[27,-34],[26,-31],[30,-29],[25,-27],[23,-29],[20,-30]],'#364640');
        api.line(23,-34,21,-29,'#f5edce',1);api.line(27,-33,30,-30,'#edf1dc',1);
        if(phase!=='packed'){
          ctx.globalAlpha=.2+reveal*.8;api.ellipse(27,-27,5+reveal*2,2.2,'#896247');api.ellipse(29,-29,2.4,1.4,'#c19a6d');ctx.globalAlpha=1;
          if(reveal<.4){const a=(Math.sin(t*3)+1)*.35;ctx.globalAlpha=a;api.line(26,-40,26,-36,'#fff6ce',1);api.line(32,-33,36,-33,'#fff6ce',1);ctx.globalAlpha=1;}
        }
        const shine=api.clamp(angle/.6,0,1);ctx.globalAlpha=shine*.65;api.poly([[10,-44],[19,-44],[48,-15],[40,-15]],'#fff2c5');ctx.restore();
        api.line(-36,-17,-15,-13,'#e5e9cd',1);api.poly([[42,-32],[56,-24],[50,-17],[41,-19]],'#a2b8ac');api.line(44,-27,52,-23,'#dce4ca',1);
        ctx.restore();
      }
      function closeup() {
        if(reveal<.02)return;
        const x=117,y=69,r=43;ctx.save();ctx.globalAlpha=reveal;
        const hx=cup.x+scale*(24*Math.cos(angle)+30*Math.sin(angle)), hy=cup.y+scale*(24*Math.sin(angle)-30*Math.cos(angle));
        api.line(hx,hy,159,80,'#cbd3b6',1);api.ellipse(hx,hy,5,3,'#e9d9aa88');
        api.ellipse(x+2,y+3,r+3,r+3,'#121d26aa');api.ellipse(x,y,r+2,r+2,'#d4cba8');
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();api.rect(x-r,y-r,r*2,r*2,'#c3d1c2');
        for(let i=0;i<17;i++)api.line(x-r+i*6,y-r,x-r+i*6+14,y+r,i%2?'#dae0c9':'#9fb6ad',1);
        api.poly([[x-12,y-10],[x+2,y-16],[x+7,y-7],[x+17,y-4],[x+11,y+7],[x+2,y+9],[x-7,y+13],[x-13,y+3]],'#263c37');
        // A raised sliver exposes the chocolate-coated underside of the foil.
        api.poly([[x-12,y-10],[x-26,y-23],[x-11,y-34],[x+2,y-16]],'#e5e4c7');
        api.poly([[x-11,y-10],[x-23,y-21],[x-13,y-28],[x+1,y-16]],'#956748');
        api.ellipse(x-14,y-20,7,4,'#6b4738');api.ellipse(x-15,y-22,4,1.8,'#c69864');
        api.poly([[x+8,y-7],[x+15,y-5],[x+24,y+3],[x+28,y+10],[x+22,y+18],[x+13,y+11],[x+7,y+4]],'#8e6043');
        api.ellipse(x+18,y+8,9,5,'#a6774f');api.ellipse(x+19,y+5,5,1.6,'#d1a677');api.ellipse(x+30,y+20,3,2,'#936141');
        api.line(x-12,y-10,x+2,y-16,'#f0ecd0',2);api.line(x+2,y+9,x+11,y+7,'#ebeed1',1);
        ctx.restore();
      }
      return {
        draw() {
          api.bg('kitchen');api.rect(0,0,480,137,'#253940');
          for(let y=16;y<132;y+=32){api.line(0,y,480,y,'#31474b',1);for(let x=(y%64?24:0);x<480;x+=64)api.line(x,y,x,y+32,'#30454a',1);}
          api.rect(0,139,480,131,'#725c48');api.rect(0,137,480,5,'#b09a70');
          for(let y=150;y<270;y+=25){api.line(0,y,480,y,'#594f42',1);for(let x=8;x<480;x+=79)api.line(x,y+8,x+48,y+9,'#826b5155',1);}
          // Warm light comes from the lamp and guides the inspection gesture.
          ctx.save();const beam=ctx.createLinearGradient(360,73,255,208);beam.addColorStop(0,'#ffe5a13d');beam.addColorStop(1,'#ffe2a006');api.poly([[342,73],[377,67],[325,213],[167,213]],beam);ctx.restore();
          api.ellipse(249,210,77,21,'#3d4e43');api.ellipse(249,207,75,20,'#879370');api.ellipse(249,206,70,17,'#657c62');
          for(let i=0;i<7;i++)api.line(195+i*16,199,199+i*16,214,'#8b9e78',1);
          lamp();paperBag(false);
          if(phase==='packed'&&!drag)cupArt();
          paperBag(true);
          if(phase!=='packed'||drag){api.ellipse(cup.x+8,cup.y+57*scale,47*scale,7,'#28362c88');cupArt();}
          if(phase==='packed'&&!drag){api.line(195,205,213,205,'#b3c39b',1);api.line(273,205,294,205,'#b3c39b',1);}
          closeup();
          if(phase==='inspect'&&!drag&&reveal<.1){api.text('A tiny puncture?',247,247,11,'#e6d6ad');}
          if(phase==='done'){api.text('SHOP? BAG? STILL A MYSTERY.',246,247,10,'#eddbad');}
        },
        down(p) {
          if(phase==='packed'&&api.hit(p,cup.x,cup.y-17,92,68)){drag='unpack';start={...p};distance=0;}
          else if(phase==='inspect'&&api.hit(p,cup.x,cup.y,143,154)){drag='tilt';start={...p};lightHold=0;}
        },
        move(p) {
          if(drag==='unpack'){cup.x=api.clamp(home.x+p.x-start.x,63,360);cup.y=api.clamp(home.y+p.y-start.y,71,204);distance=Math.hypot(p.x-start.x,p.y-start.y);}
          if(drag==='tilt')aim=api.clamp((p.x-start.x)/126,-.4,.66);
        },
        up() {
          if(drag==='unpack'){
            if(distance>70&&api.hit(cup,table.x,table.y,134,108)){phase='settling';settling=0;start={...cup};api.tone(390,.07,.014);}
            else cup={...home};
          } else if(drag==='tilt'){
            if(aim>.47&&lightHold>.55){phase='reveal';revealTime=0;aim=.58;api.say('Chocolate on the underside. When did that happen?');api.tone(660,.1,.015);}
            else{aim=0;lightHold=0;}
          }
          drag=null;
        },
        cancel() {
          if(drag==='unpack')cup={...home};
          if(drag==='tilt'){aim=0;angle=0;lightHold=0;reveal=0;}
          drag=null;
        },
        update(dt) {
          t+=dt;
          if(phase==='settling'){
            settling+=dt;const u=ease(api.clamp(settling/.65,0,1));cup.x=start.x+(table.x-start.x)*u;cup.y=start.y+(table.y-start.y)*u;scale=.72+.52*u;
            if(settling>=.65){phase='inspect';api.say('There is a tiny hole in the foil. Tilt it toward the lamp.');}
          }
          angle+=(aim-angle)*Math.min(1,dt*12);
          if(phase==='inspect'){
            if(drag==='tilt'&&aim>.47&&angle>.43)lightHold+=dt;else lightHold=Math.max(0,lightHold-dt*2);
            const target=api.clamp(lightHold/.7,0,.9);reveal+=(target-reveal)*Math.min(1,dt*9);
          }
          if(phase==='reveal'){
            revealTime+=dt;reveal=Math.min(1,reveal+dt*2);
            if(revealTime>1){phase='done';api.done();}
          }
        },
        debug(){return{phase,drag,cup:{...cup},angle,aim,scale,lightHold,reveal,unpacked:phase!=='packed',punctured:true,smearVisible:reveal>.7,foilStillAttached:true,cause:'unknown'};}
      };
    }
  });
})();
