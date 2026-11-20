(()=>{
"use strict";
TinyV6.register(57,{"id": "cucumber", "title": "No consistent thickness", "description": "Cucumber: alternate paper-thin and enormous slices.", "hint": "A paper-thin slice \u2192 An enormous slice \u2192 Thin again \u2192 And absurdly thick", "verdict": "A salad with pacing problems.",create(api){
const {ctx,rect,round,ellipse,line,poly,text,clamp,near,hit}=api;
const path=(points,fill,stroke,width=2)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
const curve=(points,color,width=2)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i+=3)ctx.bezierCurveTo(...points[i],...points[i+1],...points[i+2]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();};
const grad=(x,y,w,h,a,b)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,a);g.addColorStop(1,b);return g;};
const desk=(color='#293b46')=>{rect(0,0,480,270,color);for(let i=0;i<6;i++){line(0,30+i*48,480,30+i*48,'#ffffff08',2);for(let j=0;j<3;j++)curve([[0,i*48+10+j*8],[130,i*48+14+j*8],[360,i*48+5+j*8],[480,i*48+11+j*8]],'#ffffff05',1);}};
const shadow=(x,y,rx,ry)=>ellipse(x,y,rx,ry,'#09172265');
let phase=0,time=0,drag=null,done=false;
const finish=()=>{if(!done){done=true;api.done();}};
let edge=151,slices=[],kx=388,ky=82,start=null,settle=0,wrong=0;
function face(x,y,rx,ry){ellipse(x,y,rx,ry,'#355c42');ellipse(x-1,y,rx-3,ry-3,'#afc993');ellipse(x-1,y,rx-6,ry-6,'#d1dfac');for(let i=0;i<8;i++){const a=i*Math.PI/4;ellipse(x-1+Math.cos(a)*(rx-9),y+Math.sin(a)*(ry-11),1.5,3,'#8dac75');}}
function knife(){ctx.save();ctx.translate(kx,ky);ctx.rotate(.12);path([[-4,-9],[12,-9],[15,62],[-9,76]],grad(-7,-6,20,70,'#d8e5d7','#8ca8ad'),'#d4ded0');round(-4,-48,18,42,5,'#7c5d48','#b49570');ellipse(5,-34,2,2,'#c9c6ab');ellipse(5,-20,2,2,'#c9c6ab');ctx.restore();}
return{draw(){desk('#344346');round(52,55,377,184,16,'#8d7251');round(58,59,365,174,13,'#b49465');for(let y=71;y<230;y+=23)curve([[64,y],[159,y-5],[287,y+6],[420,y]],'#e0ba7d44',1);shadow(254,164,112,13);round(edge,102,361-edge,58,26,grad(edge,102,0,58,'#95ae62','#305d44'));ellipse(356,131,15,28,'#426b45');for(let i=0;i<5;i++)curve([[edge+4,109+i*9],[edge+60,104+i*10],[309,113+i*8],[357,108+i*9]],'#a3b87555',1);face(edge,131,13,29);slices.forEach((s,i)=>{const x=112+i*71,y=208-s.bounce;round(x-s.width*.35,187-s.bounce,s.width*.7,38,5,'#4c7448');face(x+s.width*.35,y,11,20);line(x-s.width*.35,189-s.bounce,x+s.width*.35,189-s.bounce,'#b5cf96',2);});knife();if(wrong>0)text(phase%2?'Much thicker.':'Almost paper-thin.',239,35,11,'#d3c59e');},down(p){if(!done&&phase<4){drag=p;start=p;kx=p.x;ky=p.y-35;}},move(p){if(drag){kx=p.x;ky=p.y-35;}},up(p){if(!drag)return;const width=(start.x+p.x)/2-edge,thin=phase%2===0,valid=thin?width>=4&&width<=15:width>=34&&width<=65;if(start.y<112&&p.y>157&&Math.abs(start.x-p.x)<23&&valid){slices.push({width,bounce:12});edge+=width;phase++;api.tone(thin?580:310,.1);wrong=0;}else wrong=1.5;kx=388;ky=82;drag=start=null;},cancel(){if(drag===null)return;drag=start=null;kx=388;ky=82;},update(dt){time+=dt;wrong=Math.max(0,wrong-dt);slices.forEach(s=>s.bounce*=Math.max(0,1-dt*8));if(phase===4){settle+=dt;if(settle>.6)finish();}},debug(){return{phase,edge,widths:slices.map(s=>s.width),done};}};

}});
})();
