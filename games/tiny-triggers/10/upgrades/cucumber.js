(()=>{
'use strict';
TinyV6.register(57,{id:'cucumber',title:'No consistent thickness',description:'Cucumber: alternate paper-thin and enormous slices.',hint:'Drag the knife down through the left end for a thin slice, then farther right for a thick one. Repeat.',verdict:'A salad with pacing problems.',create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near}=api;
const gradient=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const curve=(p,color,width=2)=>{ctx.beginPath();ctx.moveTo(...p[0]);ctx.bezierCurveTo(...p[1],...p[2],...p[3]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
let phase=0,edge=151,slices=[],kx=388,ky=82,drag=null,cut=null,settle=0,wrong=0,done=false;
const target=()=>edge+(phase%2?47:10);
function face(x,y,rx,ry){ellipse(x,y,rx,ry,'#446f42');ellipse(x-1,y,rx-2,ry-2,'#b4d59b');ellipse(x-1,y,rx-5,ry-5,'#d8e7b7');for(let i=0;i<8;i++){const a=i*Math.PI/4;ellipse(x-1+Math.cos(a)*(rx-7),y+Math.sin(a)*(ry-9),1.3,2.6,'#8eaf78');}}
function knife(){ctx.save();ctx.translate(kx,ky);ctx.beginPath();ctx.moveTo(-5,-9);ctx.lineTo(12,-9);ctx.lineTo(14,63);ctx.lineTo(-9,76);ctx.closePath();ctx.fillStyle=gradient(-7,-6,20,70,'#e4ece5','#8ca8ad');ctx.fill();ctx.strokeStyle='#e3ebe2';ctx.stroke();round(-4,-48,18,42,5,'#74523d','#b49570');ellipse(5,-34,2,2,'#c9c6ab');ellipse(5,-20,2,2,'#c9c6ab');ctx.restore();}
function sample(p){
 kx=clamp(p.x,60,420);ky=clamp(p.y-35,8,180);
 // Choose the cut where the blade meets the cucumber, NOT where a player
 // originally picked the knife up. Both direct strokes and tool drags work.
 if(p.y<=130&&p.x>=edge-12&&p.x<=Math.min(361,edge+88)){
  if(!cut)cut={x:p.x,y:p.y};
  else{cut.x=p.x;cut.y=Math.min(cut.y,p.y);}
 }
}
return{
 draw(){
  rect(0,0,480,270,'#344346');for(let y=15;y<270;y+=45)line(0,y,480,y,'#ffffff07',1);
  round(52,55,377,184,16,'#8d7251');round(58,59,365,174,13,'#b49465');
  for(let y=71;y<230;y+=23)curve([[64,y],[159,y-5],[287,y+6],[420,y]],'#e0ba7d44',1);
  ellipse(256,164,113,12,'#152b2855');
  // One uncut vegetable at the start: continuous tapered skin, not a dark
  // ellipse at the right or a separate slice already lying at the left.
  ctx.beginPath();ctx.moveTo(edge+8,104);ctx.bezierCurveTo(edge+52,98,316,101,347,108);ctx.bezierCurveTo(370,111,376,145,349,156);ctx.bezierCurveTo(317,162,edge+47,163,edge+8,157);ctx.bezierCurveTo(edge-8,151,edge-8,113,edge+8,104);ctx.closePath();
  const skin=gradient(edge,101,0,61,'#73934a','#254f36');ctx.fillStyle=skin;ctx.fill();
  ctx.save();ctx.clip();
  for(let i=0;i<5;i++)curve([[edge,108+i*10],[edge+65,103+i*10],[313,111+i*9],[361,114+i*8]],i===0?'#b0c67b88':'#a5bd7150',1.5);
  for(let i=0;i<42;i++){const px=edge+9+(i*37%(Math.max(20,350-edge))),py=110+(i*19%40);ellipse(px,py,1.2,.8,'#b3c78055');}
  ctx.restore();
  curve([[359,128],[363,127],[366,129],[367,132]],'#42613a',3);
  if(slices.length)face(edge+2,131,10,27);
  slices.forEach((s,i)=>{const x=110+i*74,y=209-s.bounce;round(x-s.width*.35,y-20,s.width*.7,39,5,'#4c7448');face(x+s.width*.35,y,11,20);line(x-s.width*.35,y-19,x+s.width*.35,y-19,'#b5cf96',2);});
  if(cut&&drag){ctx.save();ctx.setLineDash([3,4]);line(cut.x,103,cut.x,159,'#e8edbd99',1);ctx.restore();}
  knife();
  text(done?'':wrong>0?(phase%2?'A much bigger piece this time.':'A little closer to the end.'):(phase%2?'Now a ridiculously thick slice.':'Start with a thin slice.'),239,34,10,'#d3d3b0');
 },
 down(p){if(done||phase>=4)return;drag={start:p,last:p};cut=null;sample(p);},
 move(p){if(!drag)return;drag.last=p;sample(p);},
 up(p){if(!drag)return;const end=p||drag.last,width=cut?cut.x-edge:0,thin=phase%2===0;
  const crossed=cut&&end.y>=151&&end.y-cut.y>=32&&Math.abs(end.x-cut.x)<54;
  const valid=thin?width>=-5&&width<=25:width>=27&&width<=82;
  if(crossed&&valid){const actual=thin?clamp(width,5,14):clamp(width,36,59);slices.push({width:actual,bounce:12});edge+=actual;phase++;api.tone(thin?580:310,.1);wrong=0;}else wrong=1.8;
  kx=388;ky=82;drag=cut=null;
 },
 cancel(){if(!drag)return;drag=cut=null;kx=388;ky=82;},
 update(dt){wrong=Math.max(0,wrong-dt);slices.forEach(s=>s.bounce*=Math.max(0,1-dt*8));if(phase===4&&!done){settle+=dt;if(settle>.6){done=true;api.done();}}},
 guidance(){if(done)return null;if(phase===4)return{kind:'wait',label:'Let the slices settle'};return{kind:'drag',from:[kx,ky-25],via:[[target(),83]],to:[target(),176],label:phase%2?'Cut a big thick piece':'Cut close to the left end'};},
 debug(){return{phase,edge,widths:slices.map(s=>s.width),done,cut:cut?{...cut}:null,knife:[kx,ky]};}
};
}});})();
