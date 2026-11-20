(()=>{TinyV6.register(10,{"id":"legacy-10","title":"Nearly there","description":"Drag the loading slider to 99%. Leave it there.","hint":"Move the handle almost all the way right. It snaps to 99 near the end.","verdict":"Loading complete. Emotionally incomplete.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const lerp=(a,b,t)=>a+(b-a)*t;
function path(points,fill,stroke,width=2){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function curve(points,color,width=3){ctx.beginPath();ctx.moveTo(points[0],points[1]);ctx.bezierCurveTo(...points.slice(2));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
function room(kind='desk'){api.bg(kind);let g=ctx.createLinearGradient(0,0,0,270);g.addColorStop(0,'#101a28');g.addColorStop(1,'#344151');ctx.fillStyle=g;ctx.fillRect(0,0,480,270);rect(0,210,480,60,'#222e3a');line(0,210,480,210,'#53606c',2);}
function metal(x,y,w,h){let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#d2e0e5');g.addColorStop(.3,'#6a8796');g.addColorStop(.55,'#e6edf0');g.addColorStop(1,'#49616e');round(x,y,w,h,5,g,'#202e3c')}
let phase=0, time=0, drag=null, completed=false;const done=()=>{if(!completed){completed=true;api.done()}};

let progress=12,display=12,hold=0;
return {draw(){room();ellipse(242,243,191,12,'#111c27');round(63,32,354,170,9,'#8ca2ae','#bdcdce');round(70,39,340,154,5,'#101c2a');ellipse(240,36,2,2,'#314654');path([[63,201],[417,201],[453,236],[29,236]],'#8aa2af','#c4d2d2');path([[29,236],[453,236],[445,244],[38,244]],'#526c7c');for(let r=0;r<3;r++)for(let c=0;c<13;c++)round(74+c*25-r*3,206+r*7,20,5,1,'#334d5d');round(202,226,75,10,2,'#7894a3');
 text('Installing tiny improvements',240,63,13,'#dce9de');text(Math.round(display)+'%',240,105,26,'#e8ce85');round(103,133,274,12,5,'#31485b');round(105,135,Math.max(4,display*2.68),8,3,'#8bbbaa');
 ctx.save();ctx.beginPath();ctx.rect(106,135,display*2.65,8);ctx.clip();for(let n=0;n<23;n++)path([[80+n*17+(time*13%17),135],[88+n*17+(time*13%17),135],[83+n*17+(time*13%17),143],[75+n*17+(time*13%17),143]],'#b7d0b3');ctx.restore();
 let hx=105+progress*2.68;metal(hx-7,128,14,23);line(hx,134,hx,145,'#466679',2);
 ctx.strokeStyle='#a3bfbd';ctx.lineWidth=2;ctx.beginPath();ctx.arc(114,171,6,time*3,time*3+4.9);ctx.stroke();text(progress===99?'Finishing up. Any moment now.':'Please do not turn off your patience.',248,171,10,'#9fb8b8');
 if(phase===1){text('99',393,103,8,'#d7b77a');line(379,108,388,108,'#d7b77a',1)}},
 down(p){if(!completed&&hit(p,240,139,300,43))drag={};},move(p){if(drag){progress=clamp(Math.round((p.x-105)/2.68),1,99);hold=0}},up(){drag=null;if(progress===99)phase=1},cancel(){if(!drag)return;drag=null;progress=12;hold=0;phase=0},update(dt){time+=dt;display=lerp(display,progress,Math.min(1,dt*9));if(phase===1){hold+=dt;if(hold>1.1)done()}},debug(){return{phase,progress,display}}};
}});})();
