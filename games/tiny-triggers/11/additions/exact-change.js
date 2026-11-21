(() => {
TinyV7.register({id:'exact-change',title:'Exact Change, Eventually',chapter:'shopping',description:'Join the checkout. There is only one customer ahead.',hint:'Drag your shopping bag onto the end of the conveyor beside the divider. Wait as the customer slowly counts nine tiny coins, then searches another pocket for the missing one.',verdict:'One coin short. One pocket to go. Probably.',create(api){
 const {ctx,rect,round,ellipse,line,poly,text,clamp,near}=api;
 let phase=0,t=0,clock=0,coins=0,countAgain=0,bagX=414,bagY=224,drag=null,pocket=0,finished=false;
 const coinAt=i=>({x:198+i%3*27,y:163+Math.floor(i/3)*21});
 function coin(x,y,edge=false){ellipse(x,y+2,8,5,'#927050');ellipse(x,y,8,5,'#d4b987');ellipse(x,y-1,5,3,'#e0c99a');if(!edge)text('10',x,y+2,5,'#826242');}
 function bag(x,y){ellipse(x,y+20,35,7,'#263340');poly([[x-29,y-18],[x+25,y-18],[x+32,y+23],[x-32,y+23]],'#a98a66');poly([[x+19,y-18],[x+25,y-18],[x+32,y+23],[x+21,y+23]],'#896a4f');rect(x-21,y-27,14,23,'#b4c5b3');poly([[x-17,y-27],[x-12,y-32],[x-7,y-27]],'#dfdfc4');round(x-1,y-33,12,25,5,'#c9ae77');line(x+1,y-28,x+10,y-24,'#e3cd9e',2);line(x-13,y-18,x-11,y-39,'#d3b38d',3);line(x-11,y-39,x+12,y-39,'#d3b38d',3);line(x+12,y-39,x+16,y-18,'#d3b38d',3);text('YOUR BAG',x,y+10,7,'#55483f');}
 return {draw(){rect(0,0,480,270,'#354452');for(let y=21;y<135;y+=26)line(0,y,480,y,'#4a5661');
   // Patient customer and an exceptionally well-equipped coat.
   round(46,93,107,124,24,'#8a7d83');poly([[52,95],[89,124],[95,95]],'#b1a3a1');poly([[101,95],[108,123],[147,97]],'#b1a3a1');line(98,103,98,212,'#5d5c67',2);for(let i=0;i<4;i++)ellipse(103,126+i*19,2,2,'#b6aaa4');round(57,144,30,28,3,'#726773');line(60,146,83,146,'#c1adaa',2);round(117,144,27,28,3,'#726773');line(119,146,141,146,'#c1adaa',2);
   ellipse(99,64,29,35,'#d1b09b');poly([[72,58],[74,31],[92,25],[119,32],[126,58],[119,45],[100,40],[82,45]],'#c2beb4');ellipse(89,66,10,8,'#b5c4c3');ellipse(111,66,10,8,'#b5c4c3');line(99,65,102,65,'#65707a',2);line(78,64,72,60,'#65707a',2);line(121,64,126,60,'#65707a',2);line(91,87,108,88,'#a27d70',1);
   // Cashier and fixed register.
   round(363,83,74,61,17,'#709c9a');ellipse(399,65,20,24,'#b28c79');poly([[378,62],[380,43],[398,36],[417,43],[420,65],[411,52],[388,49]],'#544550');round(336,83,102,49,5,'#25333f','#93a5ad');round(343,91,88,31,3,'#91aa9d');text('TOTAL  €1.00',387,105,9,'#294b43');text(phase<2?`PAID   €0.${coins}0`:'SHORT  €0.10',387,117,8,phase<2?'#37564b':'#773e44');
   poly([[157,133],[469,133],[480,231],[148,231]],'#9c9b91');poly([[148,231],[480,231],[480,250],[148,250]],'#5e6974');round(302,141,164,81,4,'#283541');for(let x=310;x<461;x+=10)line(x,145,x+3,218,'#3c4b56',1);line(308,177,463,177,'#b6bdb4',7);text('NEXT CUSTOMER',385,189,7,'#9ba9ac');
   for(let i=0;i<coins;i++){const c=coinAt(i);coin(c.x,c.y);if(phase===2&&Math.floor(countAgain*4)===i){ellipse(c.x,c.y,11,7,'rgba(235,212,153,.3)');}}
   let hx=128,hy=153;
   if(phase===1){const step=clock%1.03,idx=Math.min(8,Math.floor(clock/1.03)),c=coinAt(idx);const u=step<.64?step/.64:(1.03-step)/.39;const e=clamp(u,0,1);hx=127+(c.x-127)*e;hy=154+(c.y-154)*e-Math.sin(e*Math.PI)*23;line(145,115,hx,hy,'#8a7d83',17);if(step<.64)coin(hx,hy+2,true);}
   if(phase===2&&countAgain<2.5){const idx=Math.min(8,Math.floor(countAgain*3.6)),c=coinAt(idx);hx=c.x;hy=c.y-8;line(144,115,hx,hy,'#8a7d83',17);}
   if(phase===3){hx=71+Math.sin(pocket*16)*5;hy=154+Math.cos(pocket*12)*4;line(147,115,hx,hy,'#8a7d83',17);if(pocket>.6){poly([[111,177],[123,175],[127,198],[115,201]],'#d0c5ab');line(115,184,124,183,'#999b91',1);}if(pocket>1.5){ellipse(120,211,9,4,'#a7a4a1');line(114,210,125,212,'#797c83',1);}}
   round(hx-10,hy-6,21,15,7,'#d6b49c');line(hx+1,hy-4,hx+7,hy+2,'#b08c7a',1);
   bag(bagX,bagY);
   if(phase===3){round(16,223,125,22,4,'#293442','#b69d8d');text('Another pocket…',78,238,9,'#e4c6b2');}
   if(phase===0){poly([[409,180],[402,190],[416,190]],'#ccd6c4');}
   rect(0,254,480,16,'#293440');text(phase===0?'Put your bag behind the divider':phase===1?'One… two… three…':phase===2?'Let’s count those again.':'Nine ten-cent coins. A one-euro total.',240,266,9,'#e0d4c1');
 },down(p){if(phase===0&&near(p,bagX,bagY,46))drag={x:p.x,y:p.y,ox:bagX,oy:bagY};},move(p){if(drag){bagX=clamp(drag.ox+p.x-drag.x,190,440);bagY=clamp(drag.oy+p.y-drag.y,155,225);}},up(){if(!drag)return;drag=null;if(bagX>315&&bagY<209){bagX=406;bagY=206;phase=1;clock=0;api.say('Just one person. This should be quick.');}else{bagX=414;bagY=224;}},cancel(){if(drag){bagX=drag.ox;bagY=drag.oy;}drag=null;},update(dt){t+=dt;if(phase===1){clock+=dt;const n=Math.min(9,Math.max(0,Math.floor((clock+.39)/1.03)));if(n>coins){coins=n;api.tone(700+n*24,.04,.012);}if(clock>9*1.03){phase=2;countAgain=0;}}else if(phase===2){countAgain+=dt;if(countAgain>2.7){phase=3;pocket=0;api.say('One tiny coin short. Check the other pocket.');}}else if(phase===3){pocket+=dt;if(pocket>2&&!finished){finished=true;api.done();}}},debug(){return {phase,coins,totalCents:100,paidCents:coins*10,shortCents:phase>=2?100-coins*10:0,pocketSearch:phase===3,finished};}};
}});
})();
