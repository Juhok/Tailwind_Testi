/* Read-only visual guides for the retained, individually authored scenes.
 * Coordinates come from debug snapshots; this catalog never changes gameplay.
 * Scenes with their own guidance() take precedence over these entries.
 */
(()=>{
'use strict';
const catalog=globalThis.TinyGuideCatalog=globalThis.TinyGuideCatalog||{};
const drag=(from,to,label,extra={})=>({kind:'drag',from,to,label,...extra});
const hold=(at,label,holdSeconds=3)=>({kind:'hold',at,label,holdSeconds});
const wait=(label='Watch what happens')=>({kind:'wait',label});
const point=(s,key,fallback)=>s.guide?.[key]||fallback;
const add=(id,fn)=>{catalog[id]=s=>s.done||s.finish||s.guideComplete?null:fn(s);};
const one=(id,from,to,label,extra)=>add(id,s=>s.phase?wait():drag(from,to,label,extra));

add('battery',s=>s.phase===0?drag([point(s,'cell',[98,120])[0],point(s,'cell',[98,120])[1]-34],[98,172],'Turn the last battery upside down'):s.phase===1?drag(point(s,'cell',[98,120]),[281,145],'Insert the reversed battery'):s.phase===2?drag(point(s,'cover',[398,144]),[251,145],'Close the battery cover'):s.phase===3?wait():null);
add('bin',s=>s.phase?wait():drag(point(s,'trash',[96,151]),[367,111],'Drop it beside the liner'));
one('blinds',[239,125],[239,185],'Turn this slat the other way');
add('boardgame',s=>s.phase===0?drag(point(s,'pink',[80,155]),[237,154],'Put the pink piece in the box'):s.phase===1?drag(point(s,'gold',[105,212]),[382,198],'Leave the last piece on the rim'):s.phase===2?drag(point(s,'lid',[284,53]),[284,154],'Close the lid over the piece'):s.phase===3?wait():null);
add('books',s=>s.phase===0?drag([194,95],[194,187],'Turn this book upside down'):s.phase===1?drag([254,143],[293,177],'Pull this book out a little'):wait());
add('burger',s=>s.phase===0?drag([s.bx,s.by],[240,55],'Put the bottom bun straight on top',{via:[[340,142]]}):s.phase===1?wait():null);
add('butter',s=>s.phase?wait():drag(point(s,'knife',[362,100]),[246,184],'Scoop a hole in the butter',{via:[[240,126],[240,151]]}));
add('cake',s=>{if(s.phase>4)return wait();if(s.phase===4)return drag(point(s,'piece',[230,123]),[403,185],'Lift the middle slice onto the plate');const part=s.guide?.segments.find(c=>!c.cut);return part?drag(part.from,part.to,'Cut around the middle square'):wait();});
add('candle',s=>s.phase>=2?null:s.phase?wait():s.tunnel<.98?wait('Let the candle form a deep tunnel'):drag(point(s,'snuffer',[389,115]),[240,109],'Snuff the candle now'));
add('cards',s=>s.phase===0?drag(point(s,'card',[352,142]),[280,142],'Flip this card face up'):s.phase===1?drag(point(s,'card',[352,142]),[160,144],'Shuffle it into the face-down deck'):wait());
one('cheesepack',[346,72],[205,145],'Rip through the resealable seam');
add('chess',s=>s.settle||s.phase?wait():drag([336,40],[334,230],'Turn the board one quarter',{via:[[365,88],[370,134],[354,183]]}));
add('coffee',s=>s.phase===0?drag(point(s,'pot',[112,134]),[207,79],'Keep pouring until the cup is full',{hold:true,holdSeconds:2}):s.phase===1?drag(point(s,'cup',[260,163]),[366,163],'Move the full cup to the right'):wait());
add('cookie',s=>s.phase?wait('The softened half is sinking'):s.soak>=1?drag(point(s,'biscuit',[274,128]),[310,82],'Keep holding; lift the biscuit out'):drag(point(s,'biscuit',[112,115]),[274,128],'Hold it in the tea until it softens',{hold:true,holdSeconds:2.4,release:false}));
add('crisps',s=>s.phase===0?drag([99,210],[202,210],'Open the bottom seam'):s.phase===1?drag(point(s,'bag',[142,132]),[323,84],'Hold the open bag over the bowl',{hold:true,holdSeconds:1.8}):wait());
add('crumb',s=>s.phase===0?drag(point(s,'broom',[370,145]),[130,145],'Sweep toward the dustpan',{via:[[270,145],[220,145]]}):s.phase===1?wait():null);
add('cube',s=>s.phase>=2||s.anim?wait():drag([295,108],[s.phase?385:205,108],s.phase?'Turn the solved face once more':'Turn the top row to solve it'));
add('cupboard',s=>s.phase===0?drag([111,151],[250,151],'Close the left door first'):s.phase===1?drag([369,151],[230,151],'Now close the overlapping right door'):wait());
one('curtain',[143,124],[393,188],'Pull the curtain outside the bath',{via:[[270,155]]});
add('dishes',s=>{if(s.phase>=3)return wait();if(s.loaded>=2)return drag([334,237],[334,90],'Close the partly filled dishwasher');const plate=s.guide?.plates.find(p=>p.index<2&&!p.loaded);return plate?drag(plate.from,[plate.index?348:292,135],'Put this dish in the rack'):wait();});
one('dogear',[328,74],[245,157],'Fold the page corner inward');
add('domino',s=>s.phase===0?drag([s.moved,184],[264,184],'Make a slightly larger gap'):s.phase===1?drag([72,184],[93,190],'Push the first domino'):wait());
add('envelope',s=>s.phase===0?drag([280,76],[280,179],'Close the envelope without the letter'):s.phase===1?drag([205,153],[367,153],'Seal across the flap'):s.phase===2?wait():null);
add('filleddonut',s=>s.phase?wait():drag([213,121],[213,170],'Squeeze and hold the doughnut',{hold:true,holdSeconds:1.4}));
add('film',s=>{const p=s.guide?.bubbles[0];return p?drag(p,[p[0]<240?174:307,p[1]],'Smooth this bubble to the edge'):wait('Leave the center bubble alone');});
add('floor',s=>s.phase===0?drag(point(s,'mop',[74,202]),[173,181],'Mop the whole wet rectangle',{via:[[173,116],[244,116],[315,116],[315,181],[244,181]]}):s.phase===1?drag(point(s,'feet',[62,69]),[380,187],'Walk across the clean wet floor',{via:[[150,140],[185,150],[223,158],[260,164],[299,173],[338,179]]}):wait());
add('fuel',s=>s.phase===0?drag(point(s,'nozzle',[143,139]),[322,174],'Put the nozzle in the car'):s.phase===1?hold(point(s,'nozzle',[322,174]),'Hold until the tank is half full',2):s.phase===2?wait():null);
one('glove',[306,113],[281,177],'Push the little finger into the glove');
add('hanger',s=>s.phase===0?drag(point(s,'hanger',[103,123]),[305,137],'Push the hanger through the neck',{via:[[305,72],[305,106]]}):s.phase===1?drag(point(s,'hanger',[305,72]),[305,137],'Keep stretching the neck over it'):s.phase===2?wait():null);
add('headphones',s=>s.phase===0?drag(point(s,'cord',[192,201]),[300,170],'Loop the cable around the chair leg',{via:[[240,227],[315,219]]}):s.phase===1?drag(point(s,'phones',[123,132]),[123,50],'Lift the headphones'):wait());
add('ice',s=>{if(s.phase===5&&s.attempted)return wait();const cubes=s.guide?.cubes||[];const stuck=cubes.find(c=>c.stuck);if(!s.attempted&&stuck)return drag(stuck.from,[stuck.from[0],stuck.from[1]-65],'Try to lift this stubborn cube');const c=cubes.find(c=>!c.stuck&&!c.free);return c?drag(c.from,[389,143],'Lift this cube into the glass'):wait();});
add('icecream',s=>s.phase===0?drag([s.x,s.y],[328,105],'Set the scoop on the cone edge'):s.phase===1?wait():null);
add('ketchup',s=>s.phase?wait():drag(point(s,'bottle',[382,116]),[212,88],'Hold the bottle upside down over the fries',{hold:true,holdSeconds:3}));
add('laces',s=>s.phase===0?drag([190,128],[99,85],'Pull out one enormous loop'):s.phase===1?drag([291,128],[244,150],'Leave the other loop tiny'):wait());
add('laundry',s=>s.phase===0?drag([336,112],[248,134],'Tuck one sleeve inside out'):s.phase===1?drag([239,212],[239,118],'Fold the shirt now'):wait());
add('legacy-10',s=>s.phase?wait('It will only reach ninety-nine'):drag([105+s.progress*2.68,139],[376,139],'Push the progress bar to the end'));
add('legacy-11',s=>{if(s.phase)return s.phase===1?wait('Watch the countdown'):null;const slots=s.guide?.slots||[],cards=s.guide?.cards||[];const slot=slots.find(o=>!o.occupied),card=cards.find(c=>!c.placed&&c.value===slot?.value);return card&&slot?drag(card.from,slot.to,'Put this number in its matching slot'):wait();});
add('legacy-12',s=>s.phase?wait():drag([s.px,s.py],[119,174],'Place the piece in the lower-left gap'));
add('legacy-13',s=>s.phase?wait():drag([165+s.value*1.5,173],[238.5,173],'Set the volume almost to fifty'));
add('legacy-14',s=>s.phase===0?drag([273+s.open,130],[281,130],'Push the drawer almost closed'):s.phase===1?wait():null);
add('legacy-15',s=>{if(s.phase>=4)return wait('The opposite corner pops loose');const c=s.guide?.corners.find(c=>!c.set);return c?drag(c.from,c.to,'Stretch this corner onto the mattress'):wait();});
add('legacy-16',s=>s.flying||s.delivered>=3?wait():drag(point(s,'bubble',[140,76]),[366,138],'Deliver one last thing'));
add('legacy-17',s=>s.phase>=2?s.phase===2?wait():null:drag([282,188],[282,s.pulled?94:243],s.pulled?'Push the door inward':'Pull the inviting handle toward you'));
// Select a valid unfair second cut even when the first cut was drawn in a
// different direction. This reproduces the same geometric constraints read-only.
function pizzaCut(s){
 const cx=238,cy=136,R=95,b=s.guide?.lines?.[0];
 if(!b)return drag([128,110],[348,110],'Cut above the center of the pizza');
 const dist=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1]);
 const side=(p,l)=>(l[1][0]-l[0][0])*(p[1]-l[0][1])-(l[1][1]-l[0][1])*(p[0]-l[0][0])>0;
 for(const d of [46,26,70,-38,-65])for(let a=0;a<Math.PI;a+=Math.PI/12){
  const u=[Math.cos(a),Math.sin(a)],p=[cx-u[1]*d,cy+u[0]*d],h=Math.sqrt(R*R-d*d),c=[[p[0]-u[0]*h,p[1]-u[1]*h],[p[0]+u[0]*h,p[1]+u[1]*h]];
  if(Math.min(dist(c[0],b[0])+dist(c[1],b[1]),dist(c[0],b[1])+dist(c[1],b[0]))<24)continue;
  const areas=[0,0,0,0];for(let x=cx-R;x<cx+R;x+=3)for(let y=cy-R;y<cy+R;y+=3)if(Math.hypot(x-cx,y-cy)<R)areas[(side([x,y],b)?1:0)+(side([x,y],c)?2:0)]++;
  const live=areas.filter(n=>n>10);if(Math.max(...live)/Math.min(...live)>1.45)return drag([p[0]-u[0]*110,p[1]-u[1]*110],[p[0]+u[0]*110,p[1]+u[1]*110],'Make another unequal cut');
 }
 return wait();
}
add('legacy-3',s=>s.cuts>=2?wait():pizzaCut(s));
add('legacy-6',s=>{const p=s.guide?.pastries.find(p=>!p.bit&&!p.returning);return p?drag(p.from,[393,137],'Take one bite from this doughnut'):wait();});
add('legacy-8',s=>s.phase===0?drag([305,198],[305,220],'Nudge the picture a little crooked'):s.phase===1?wait():null);
one('legacy-9',[272,99],[272,184],'Turn the last tile a quarter');
add('mousecord',s=>s.phase?wait():drag(point(s,'mouse',[s.mx,218]),[418,215],'Try to reach the far edge'));
one('notebook',[330,85],[435,125],'Tear the page from the spiral');
add('pencap',s=>s.phase?wait():drag([s.x,142],[280,142],'Stop just before the cap clicks'));
add('pencil',s=>s.phase===0?drag(point(s,'grip',[315,86]),[207,115],'Hold the pencil in the sharpener',{hold:true,holdSeconds:1.5}):s.phase===1?drag(point(s,'grip',[350,72]),[362,184],'Press the perfect point into the paper'):wait());
add('plaster',s=>s.phase===0?drag([166,140],[325,140],'Fold the sticky sides together'):s.phase===1?drag([298,120],[298,160],'Press and hold the folded plaster',{hold:true,holdSeconds:1}):wait());
add('printer',s=>s.phase===0?drag([point(s,'paper',[95,123])[0]+32,point(s,'paper',[95,123])[1]-45],[127,165],'Turn one sheet sideways'):s.phase===1?drag(point(s,'paper',[95,123]),[282,97],'Put the sideways sheet in the tray'):s.phase===2?wait():null);
add('pump',s=>s.phase===0?drag([250+Math.cos(s.angle)*60,78+Math.sin(s.angle)*18],[319,76],'Turn the nozzle toward the wall',{via:[[246,105]]}):s.phase===1?wait():null);
add('sandwich',s=>{if(s.phase)return s.phase===1?wait():null;const c=s.guide?.slices.find(c=>!c.placed);return c?drag(c.from,c.to,'Leave the bread bare in the middle'):wait();});
add('shakers',s=>{if(s.phase)return s.phase===1?wait():null;const b=s.guide?.bags.find(b=>b.fill<1);return b?drag(b.from,b.to,'Hold the seasoning over the wrong label',{hold:true,holdSeconds:1.8}):wait();});
add('soap',s=>s.phase?wait():drag(point(s,'soap',[128,133]),[332,155],'Put the wet soap onto its wrapper'));
add('socks',s=>{if(s.phase>=2)return s.phase===2?wait():null;const p=s.guide?.socks.find(p=>!p.paired);return p?drag(p.from,p.to,'Make an intentionally mismatched pair'):wait();});
add('spaghetti',s=>s.phase===0?drag([240,126],[215,199],'Bend the dry spaghetti until it snaps'):s.phase===1?drag(point(s,'bundle',[160,126]),[359,116],'Drop the broken spaghetti in the pot'):wait());
add('sponge',s=>s.phase===0?drag(point(s,'sponge',[240,185]),[350,98],'Scrub the plate with the sponge',{via:[[381,83],[350,83],[410,83],[350,98],[410,98]]}):s.phase===1?drag(point(s,'sponge',[350,98]),[240,185],'Leave the sponge floating in the dirty water'):s.phase===2?wait():null);
add('stapler',s=>s.phase===0?drag(point(s,'paper',[195,153]),[383,160],'Leave one page outside the stack'):s.phase===1?drag(point(s,'tool',[369,66]),[261,207],'Staple the wrong corner'):wait());
add('sticker',s=>s.phase===0?drag([185,145],[80,100],'Peel the left half away'):s.phase===1?drag([295,145],[400,100],'Peel the other half, leaving the middle'):wait());
add('straw',s=>s.phase===0?drag([251,56+s.progress*45],[251,160+s.progress*45],'Push the straw all the way inside'):s.phase===1?wait():null);
add('suitcase',s=>s.phase===0?drag(point(s,'cuff',[285,166]),[382,184],'Leave the sleeve outside the suitcase'):s.phase===1?drag([240,55],[240,204],'Close the lid over the sleeve'):wait());
one('tape',[378,88],[293,150],'Press the tape end flat onto the roll');
add('teabag',s=>s.phase?wait():drag(point(s,'tag',[376,113]),[239,93],'Drop the paper tag into the tea'));
add('toothpaste',s=>s.phase===0?drag([216,145],[216,200],'Squeeze the tube in its middle'):s.phase===1?drag(point(s,'cap',[392,184]),[340,144],'Put the cap back crooked'):wait());
one('towel',[266,111],[270,216],'Tear beside the perforation');
add('watering',s=>s.phase===0?drag(point(s,'can',[98,164]),[210,105],'Water the plant, leaving one splash',{hold:true,holdSeconds:1.1}):s.phase===1?drag(point(s,'can',[210,105]),[305,106],'Pour the last splash past the saucer'):s.phase===2?wait():null);
add('wrapping',s=>s.phase?wait():drag(point(s,'scissors',[332,72]),[332,223],'Cut the paper just too short'));
add('yogurt',s=>s.phase>=3?wait():drag([207+s.phase*26,123],[207+s.phase*26,30],'Peel another narrow strip'));
add('zip',s=>s.phase===0?drag([241,s.slider+8],[241,92],'Pull the zipper up into the lining'):s.phase===1?wait():null);
})();
