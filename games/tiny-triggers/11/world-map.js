/* Original vector pixel scenery. No external images, fonts, requests or game assets. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const palettes = [
    { land:'#294d3b', light:'#356045', dark:'#1a3b32', water:'#245a66', tree:'#4d8860', leaf:'#81a768', sky:'#a9c7a6', kind:'forest' },
    { land:'#194b43', light:'#215f50', dark:'#123b39', water:'#337a82', tree:'#3e8d64', leaf:'#8bb764', sky:'#9cc8b0', kind:'rainforest' },
    { land:'#545c3b', light:'#697145', dark:'#3d4f35', water:'#3e7077', tree:'#a9a566', leaf:'#d5b877', sky:'#d7c48e', kind:'orchard' },
    { land:'#414957', light:'#53606c', dark:'#303d4d', water:'#436a83', tree:'#648680', leaf:'#b1beb3', sky:'#c1d4d7', kind:'mountains' },
    { land:'#272d46', light:'#343853', dark:'#1d243d', water:'#333c70', tree:'#695d86', leaf:'#a88dba', sky:'#b9a7d1', kind:'city' },
    { land:'#4b5850', light:'#5f7260', dark:'#354c49', water:'#427d89', tree:'#71957b', leaf:'#b5bd8a', sky:'#bdcfa9', kind:'coast' },
    { land:'#558276', light:'#759686', dark:'#376e6d', water:'#318e9b', tree:'#5b9b71', leaf:'#b4c77d', sky:'#d9d8a3', kind:'island' },
  ];
  const desert = { land:'#817055', light:'#9a8560', dark:'#635a46', water:'#687f7a', tree:'#869263', leaf:'#b5b47c', sky:'#e3cca0', kind:'desert' };
  const paletteFor = world => ({forest:palettes[0],rainforest:palettes[1],mountain:palettes[3],city:palettes[4],desert,coast:palettes[5],beach:palettes[6]})[world.theme] || palettes[world.index%palettes.length];
  const nodeKind = node => node.kind === 'junction' ? 'junction' : node.type;
  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 126" aria-hidden="true">${body}</svg>`;
  function postcard(arrived) {
    return svg(`<rect width="260" height="126" fill="#203f57"/><rect y="57" width="260" height="69" fill="#348e99"/><rect y="78" width="260" height="48" fill="#62a2a2"/><path d="M0 99H80V86H147V77H211V89H260V126H0Z" fill="#e3c887"/><rect x="190" y="19" width="23" height="23" fill="#f2d89c"/><path d="M16 68H86V61H78V32H32V61H16Z" fill="#d1cdb1"/><path d="M22 31H87L55 12Z" fill="#9eaa94"/><rect x="43" y="41" width="22" height="27" fill="#477575"/><path d="M21 77H91M17 82H94" stroke="#e8dbb4" stroke-width="5"/><path d="M133 96L129 42M220 100L229 40" stroke="#7e7151" stroke-width="7"/><path d="M129 42L109 33L89 39L119 42L99 51L113 51L130 46L141 26L156 27L143 38L160 44L144 47L131 44M229 40L211 23L195 24L215 37L192 36L207 45L227 45L245 27L258 31L239 41L259 51L244 53L228 45" fill="#527f55"/><path d="M131 71Q173 116 224 71L220 82Q175 126 134 81Z" fill="${arrived ? '#edbd85' : '#dfd8b8'}"/><path d="M135 77Q176 109 220 77" fill="none" stroke="#b4946e" stroke-width="2"/><path d="M10 94H38M91 71H117M171 64H201M232 71H255" stroke="#afd9ca" stroke-width="2"/>${arrived ? '<path d="M161 88L190 86L198 91L176 98L158 95Z" fill="#ebaf80"/><rect x="152" y="83" width="12" height="11" fill="#e8cba2"/><rect x="177" y="87" width="16" height="9" fill="#597387"/>' : ''}`);
  }
  function tree(x,y,p,kind,seed=0) {
    const scale = .75 + (seed % 4) * .12;
    let crown;
    if (kind === 'desert') crown = `<path d="M-7 5V-54H-3V-62H6V-54H10V-21H21V-40H29V-17H25V-10H10V5ZM-7 -13H-23V-19H-28V-41H-19V-24H-7Z" fill="${p.tree}"/><path d="M-1 -50V0M-22 -36V-20M25 -34V-17" stroke="${p.leaf}" stroke-width="3"/>`;
    else if (kind === 'rainforest' || kind === 'island' || kind === 'coast') crown = `<path d="M0 -39L-19 -57L-40 -52L-15 -43L-40 -36L-27 -30L-4 -35L8 -60L25 -65L17 -49L38 -42L26 -34L4 -40Z" fill="${p.tree}"/><path d="M-1 -41L-15 -48L-26 -46M3 -43L15 -54" stroke="${p.leaf}" stroke-width="4"/>`;
    else if (kind==='orchard') crown=`<path d="M-25 -22V-48H-17V-61H11V-55H27V-29H18V-17H-16V-22Z" fill="${p.tree}"/><path d="M-17 -45V-53H5V-47H17V-40H4V-33H-12V-38H-22V-45Z" fill="${p.leaf}"/><rect x="-15" y="-31" width="6" height="6" fill="#cb9363"/><rect x="12" y="-43" width="6" height="6" fill="#cb9363"/>`;
    else crown=`<path d="M0 -70L-20 -44H-12L-28 -23H-17L-34 -5H34L17 -23H28L12 -44H20Z" fill="${p.tree}"/><path d="M0 -66L-14 -46H-6L-20 -27H-9L-23 -12H-8L8 -27L0 -27L10 -46H3Z" fill="${p.leaf}" opacity=".65"/>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-24 4H24V10H-24Z" fill="#0b272c" opacity=".35"/><rect x="-4" y="-39" width="8" height="45" fill="#716647"/>${crown}</g>`;
  }
  function house(x,y,p,city=false,seed=0) {
    const h=city ? 45+(seed%3)*19 : 32;
    return `<g transform="translate(${x} ${y})"><rect x="-29" y="-5" width="65" height="12" fill="#10242d" opacity=".3"/><path d="M-25 -${h}H25V0H-25Z" fill="${city?'#526077':'#a6a387'}"/><path d="M-30 -${h}L0 -${h+22}L30 -${h}Z" fill="${city?'#a48192':'#7d6d60'}"/><rect x="-6" y="-20" width="12" height="20" fill="#304b51"/><path d="M-18 -${h-8}H-8V-${h-20}H-18ZM8 -${h-8}H18V-${h-20}H8Z" fill="${city?'#e5c880':'#d9d4a0'}"/>${city?`<path d="M-18 -27H-8V-18H-18ZM8 -27H18V-18H8Z" fill="#92bbbd"/>`:''}<rect x="-29" y="0" width="58" height="4" fill="${p.dark}"/></g>`;
  }
  function edgePoints(a,b) {
    if (a.x===b.x) return [[a.x,a.y],[b.x,b.y]];
    const mid = Math.round((a.y+b.y)/2);
    return [[a.x,a.y],[a.x,mid],[b.x,mid],[b.x,b.y]];
  }
  function roadPath(points) { return points.map((point,index)=>`${index?'L':'M'}${point[0]} ${point[1]}`).join(' '); }
  function nameFor(node) { return node.title || (node.type==='scene' ? `Scene ${Number(node.sceneIndex)+1}` : node.type ==='junction'?'Choose your route':node.type==='passage'?'Passage to the next world':node.type==='retreat'?'The Quiet Shore':'A moment to breathe'); }
  function create(options) {
    const {container,journey} = options;
    if (!container || !journey) throw new Error('TinyWorldMap needs a container and a journey.');
    const allNodes = journey.nodes;
    const byId = journey.nodeById || new Map(allNodes.map(n=>[n.id,n]));
    let state=null, status=null, worldIndex=0, selected=null, busy=false, destroyed=false, frame=0, travelResolve=null, renderVersion=0;
    let land, scroller, traveler, details, action, live;
    const getNode=id=>byId instanceof Map?byId.get(id):byId[id];
    const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const worldFor=index=>journey.worlds.find(w=>(w.index ?? journey.worlds.indexOf(w))===index) || journey.worlds[index];
    const nodeOpen=node=>status.available.has(node.id);
    const setPosition=(x,y)=>{
      const world=worldFor(worldIndex);
      if (!traveler || !world) return;
      traveler.style.left=`${x/(world.width||720)*100}%`;
      traveler.style.top=`${y/world.height*100}%`;
    };
    const revealTraveler=()=>{
      if (!traveler || !scroller) return;
      const top=traveler.offsetTop;
      scroller.scrollTop=Math.max(0,top-scroller.clientHeight*.45);
    };
    function nodeSymbol(n) {
      if (n.type==='scene') return status.cleared.has(n.id)?'✓':String(Number(n.sceneIndex)+1);
      return nodeKind(n)==='junction'?'↔':n.type==='passage'?'⇣':n.type==='retreat'?'☀':'◆';
    }
    function art(world,nodes,p) {
      const width=world.width||720,height=world.height;
      const chapters=world.chapterLayouts||[];
      let markup=`<rect width="${width}" height="${height}" fill="${p.land}"/><defs><pattern id="wm-grass-${worldIndex}" patternUnits="userSpaceOnUse" width="52" height="46"><path d="M9 18H16M38 35H43M26 6H31" stroke="${p.light}" stroke-width="3"/></pattern></defs><rect width="${width}" height="${height}" fill="url(#wm-grass-${worldIndex})"/>`;
      // A continuous stream runs beside the route, not over the selectable roads.
      const waterRight=p.kind==='rainforest'||p.kind==='coast'||p.kind==='island';
      markup+=`<path d="M${waterRight?width:0} 0H${waterRight?width-44:53}V140H${waterRight?width-77:30}V330H${waterRight?width-46:70}V590H${waterRight?width-66:46}V${height}H${waterRight?width:0}Z" fill="${p.water}"/>`;
      for(let y=25;y<height;y+=135) markup+=`<path class="wm-water" d="M${waterRight?width-33:8} ${y}h20m-13 9h12" stroke="#a4d3cb" stroke-width="3" opacity=".55"/>`;
      chapters.forEach((layout,i)=>{
        const top=layout.top,bottom=layout.bottom;
        markup+=`<path d="M94 ${top+45}H170V${top+70}H210V${top+109}H112V${top+132}H62V${top+72}H94ZM562 ${bottom-110}H624V${bottom-80}H655V${bottom-10}H548V${bottom-43}H520V${bottom-83}H562Z" fill="${p.light}" opacity=".55"/>`;
        if(p.kind==='mountains') markup+=`<path d="M16 ${top+222}L94 ${top+92}L169 ${top+222}ZM552 ${top+230}L624 ${top+84}L709 ${top+230}Z" fill="#717c80"/><path d="M67 ${top+138}L94 ${top+92}L121 ${top+138}L104 ${top+130}L94 ${top+143}L82 ${top+130}Z" fill="#e0dfcb"/>`;
        if(p.kind==='city') {
          markup+=`<path d="M100 ${top+74}V${bottom-36}M620 ${top+74}V${bottom-36}" stroke="#172536" stroke-width="54"/><path d="M100 ${top+74}V${bottom-36}M620 ${top+74}V${bottom-36}" stroke="#687780" stroke-width="2" stroke-dasharray="14 20"/>`;
          [top+180,top+300,bottom-80].forEach((y,j)=>{markup+=house(45,y,p,true,i+j)+house(673,y+36,p,true,i+j+1);});
        } else {
          for(let j=0;j<4;j++) {
            let y=top+170+j*Math.max(86,(bottom-top-220)/4);
            markup+=tree(100+(j%2)*33,y,p,p.kind,i+j)+tree(600+(j%2)*35,y+35,p,p.kind,i+j+2);
          }
          if(i%2===0 && p.kind!=='island') markup+=house(590,top+158,p,false,i);
        }
        // Picnic bench and quiet signposts make the waypoints feel like places.
        markup+=`<g transform="translate(414 ${bottom-28})"><path d="M0 0H43V6H0Z" fill="#bc9f6e"/><path d="M6 6V18M36 6V18" stroke="#826e51" stroke-width="5"/><path d="M8 -16H36V-7H8Z" fill="#ae956d"/><path d="M15 -7V0M30 -7V0" stroke="#826e51" stroke-width="4"/></g>`;
      });
      journey.edges.forEach(edge=>{
        const a=getNode(edge.from),b=getNode(edge.to);
        if (!a||!b||a.world!==worldIndex||b.world!==worldIndex) return;
        const active=status.cleared.has(a.id) && (status.cleared.has(b.id)||status.available.has(b.id));
        const walked=status.cleared.has(a.id)&&status.cleared.has(b.id);
        const d=roadPath(edgePoints(a,b));
        markup+=`<path d="${d}" fill="none" stroke="${active?'#263e31':'#203a39'}" stroke-width="24" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${active?(walked?'#b4bd8f':'#d7c18c'):'#6c7f70'}" stroke-width="17" stroke-linejoin="round" opacity="${active?1:.52}"/><path d="${d}" fill="none" stroke="${active?'#f3ddab':'#92a28d'}" stroke-width="2" stroke-dasharray="5 15" stroke-linejoin="round" opacity=".6"/>`;
      });
      nodes.filter(n=>nodeKind(n)==='junction').forEach(n=>{markup+=`<g transform="translate(${n.x+50} ${n.y})"><path d="M0 -21V15" stroke="#a68b5f" stroke-width="5"/><path d="M-20 -29H19L26 -21L19 -13H-20Z" fill="#d5bd86"/><path d="M-11 -21H12M6 -25L12 -21L6 -17" stroke="#5c654d" stroke-width="3" fill="none"/></g>`;});
      nodes.filter(n=>n.type==='passage').forEach(n=>{markup+=`<g transform="translate(${n.x} ${n.y})"><path d="M-48 15V-35H-37V-53H37V-35H48V15H28V-29H-28V15Z" fill="#8f9f8a"/><path d="M-43 -34H-30M30 -34H43M-42 -12H-31M31 -12H43" stroke="#b6c0a2" stroke-width="4"/><path d="M-31 -54H31" stroke="#d1c8a6" stroke-width="5"/><path class="wm-pennant" d="M-38 -57V-85H-7L-16 -73H-38" fill="#e0b276"/></g>`;});
      if(worldIndex===journey.worlds.length-1) {
        const retreat=nodes.find(n=>n.type==='retreat');
        if(retreat) markup+=`<g transform="translate(65 ${retreat.y-80}) scale(1.3)">${postcard(status.arrived).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g>`;
      }
      const unreached=chapters.filter(layout=>!nodes.some(n=>n.chapter===layout.chapter && status.available.has(n.id)));
      unreached.forEach(layout=>{markup+=`<g class="wm-fog" opacity=".2" fill="#afc3c0"><path d="M0 ${layout.top+80}H120V${layout.top+115}H220V${layout.top+130}H450V${layout.top+100}H${width}V${layout.bottom-15}H0Z"/><path d="M0 ${layout.top+165}H140V${layout.top+183}H510V${layout.top+160}H${width}V${layout.top+210}H0Z"/></g>`;});
      return `<svg class="wm-art" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="crispEdges">${markup}</svg>`;
    }
    function updateDetails(announce=false) {
      const node=getNode(selected);
      if(!node||!details)return;
      const done=status.cleared.has(node.id), open=nodeOpen(node), kind=nodeKind(node);
      const atVisitedJunction=kind==='junction'&&done&&node.id===state.currentNode;
      const category=node.type==='scene'?`Scene ${Number(node.sceneIndex)+1}${node.route==='left'?' · west road':node.route==='right'?' · east road':''}`:kind==='junction'?'Two roads. Your choice.':node.type==='passage'?'Beyond the edge of the map':node.type==='retreat'?'Your holiday destination':'A small pause on the road';
      const note=!open?'Complete the connected road to reach this place.':node.type==='scene'?(done?'A familiar annoyance. You can revisit it, or keep heading toward the beach.':'A little everyday annoyance stands between you and your holiday. Complete it to open the next stretch.'):kind==='junction'?'Choose either road. They meet again at the next waypoint; the other route remains available to explore.':node.type==='passage'?(node.world===journey.worlds.length-1?'The last passage leads to the peaceful beach retreat.':'Travel through this passage to reveal the next world. Your earlier routes stay open.'):node.type==='retreat'?(status.arrived?'You made it. The sea is quiet, the hammock fits, and nothing needs fixing.':'A temple beside the beach. An empty hammock. At last, a place where nothing goes wrong.'):'Take a breath. Your next chapter begins just beyond this waypoint.';
      details.querySelector('.wm-destination').textContent=category;
      details.querySelector('.wm-location').textContent=nameFor(node);
      details.querySelector('.wm-node-note').textContent=note;
      action.disabled=!open||busy||atVisitedJunction;
      action.textContent=busy?'On the road…':atVisitedJunction?'Select a road':node.type==='scene'?(done?'Travel & replay':'Travel & play'):node.type==='retreat'?(status.arrived?'Return to the hammock':'Finally, relax'):kind==='junction'?'Visit the junction':node.type==='passage'?'Cross the passage':'Continue the journey';
      container.querySelectorAll('.wm-node').forEach(button=>{
        const active=button.dataset.node===selected;
        button.classList.toggle('is-selected',active);
        button.setAttribute('aria-pressed',String(active));
      });
      if(announce)live.textContent=`${nameFor(node)}. ${done?'Completed.':open?'Ready to visit.':'Not yet reachable.'}`;
    }
    function select(id) { selected=id; updateDetails(true); }
    function render(next) {
      if(destroyed)return;
      const oldWorld=worldIndex,oldScroll=scroller?.scrollTop||0,previousCurrent=state?.currentNode,wasHidden=!scroller?.clientHeight;
      const thisRender=++renderVersion;
      state={...next,completed:next.completed instanceof Set?next.completed:new Set(next.completed||[]),visited:next.visited instanceof Set?next.visited:new Set(next.visited||[])};
      status=journey.status(state.completed,state.visited);
      const current=getNode(state.currentNode);
      worldIndex=Number.isInteger(next.world)?next.world:(current?.world||0);
      if(!status.revealedWorlds.has(worldIndex))worldIndex=0;
      const world=worldFor(worldIndex),p=paletteFor(world),nodes=allNodes.filter(n=>n.world===worldIndex);
      if(next.selectedNode && getNode(next.selectedNode)?.world===worldIndex)selected=next.selectedNode;
      else if(getNode(selected)?.world!==worldIndex || !nodeOpen(getNode(selected))) selected=current?.world===worldIndex?current.id:(nodes.find(nodeOpen)?.id||nodes[0]?.id);
      if(current && selected===current.id && status.cleared.has(current.id)) {
        const onward=journey.successors(current.id).map(getNode).filter(n=>n.world===worldIndex&&status.available.has(n.id)&&!status.cleared.has(n.id));
        if(onward.length===1)selected=onward[0].id;
      }
      container.innerHTML=`<section class="wm${busy?' is-traveling':''}" style="--map-accent:${p.sky}" aria-label="Holiday journey map"><div class="wm-header"><p class="wm-kicker">The long way to a quiet holiday</p><h2 class="wm-heading">${escape(world.title)}</h2><p class="wm-subtitle">${escape(world.subtitle || 'A beach, a temple, and one perfectly peaceful hammock. Just a few little things to do first.')}</p></div><nav class="wm-worlds" aria-label="Revealed worlds">${journey.worlds.map((w,i)=>`<button type="button" class="wm-world-tab" data-world="${i}" aria-current="${i===worldIndex}" ${status.revealedWorlds.has(i)?'':'disabled'}><strong>${status.revealedWorlds.has(i)?`World ${i+1}`:'◇ Undiscovered'}</strong><span>${escape(status.revealedWorlds.has(i)?w.title:'Beyond the passage')}</span></button>`).join('')}</nav><div class="wm-body"><div class="wm-map-shell"><div class="wm-map-toolbar"><span>World ${worldIndex+1} / ${journey.worlds.length} · ${nodes.filter(n=>n.type==='scene'&&status.cleared.has(n.id)).length} / ${nodes.filter(n=>n.type==='scene').length} scenes complete</span><button type="button" class="wm-locate">Find my traveler</button></div><div class="wm-scroller" tabindex="0" aria-label="Scrollable world map"><div class="wm-land">${art(world,nodes,p)}${(world.chapterLayouts||[]).map(layout=>`<div class="wm-chapter" style="top:${layout.top/world.height*100}%"><span>${escape(layout.title || journey.chapters?.[layout.chapter]?.title || `Chapter ${layout.chapter+1}`)}</span><em>Follow either road</em></div>`).join('')}${nodes.map(n=>`<button type="button" class="wm-node${status.available.has(n.id)?' is-available':''}${status.cleared.has(n.id)?' is-cleared':''}${n.id===state.currentNode?' is-current':''}" data-node="${escape(n.id)}" data-kind="${escape(nodeKind(n))}" style="left:${n.x/(world.width||720)*100}%;top:${n.y/world.height*100}%" aria-label="${escape(nameFor(n))}${status.cleared.has(n.id)?', completed':status.available.has(n.id)?', available':', locked'}" title="${escape(nameFor(n))}" ${status.available.has(n.id)?'':'disabled'}><span class="wm-node-dot"><span>${nodeSymbol(n)}</span></span></button>`).join('')}<div class="wm-traveler" aria-hidden="true"><svg viewBox="0 0 37 44" shape-rendering="crispEdges"><ellipse cx="18" cy="42" rx="13" ry="2" fill="#152d2d" opacity=".4"/><path d="M10 29H17V40H11V42H5V38H10ZM20 29H27V40H31V43H23V40H20Z" fill="#273c54"/><path d="M9 15H28V31H9Z" fill="#d6ac6f"/><path d="M10 17H26V29H10Z" fill="#d8bd87"/><path d="M11 3H27V16H11Z" fill="#e7cba2"/><path d="M7 7V2H13V0H26V3H30V8H7Z" fill="#8eab8e"/><path d="M6 8H31V11H6Z" fill="#c5c598"/><rect x="25" y="11" width="3" height="3" fill="#35454b"/><path d="M7 18H10V31H6V25H4V20H7Z" fill="#edcca0"/><g class="wm-suitcase"><path d="M27 25V21H33V25" fill="none" stroke="#856f50" stroke-width="2"/><rect x="26" y="25" width="11" height="13" fill="#bd805f"/><path d="M29 25V38M34 25V38" stroke="#edb77c" stroke-width="2"/></g></svg></div></div></div></div><aside class="wm-sidebar" aria-label="Selected destination"><p class="wm-destination"></p><h3 class="wm-location"></h3><p class="wm-node-note"></p><button type="button" class="wm-play"></button><div class="wm-route-note"><strong>Every road leads a little closer.</strong><br>Pick a numbered scene, then travel. At a junction, either branch reaches the next chapter. You can come back for the other path.</div><div class="wm-holiday">${postcard(status.arrived)}</div><p class="wm-postcard-caption">${status.arrived?'Postcard from your holiday. You finally made it.':'Your destination: the Quiet Shore. No errands. No queue. Just the hammock.'}</p></aside></div><div class="wm-legend" aria-label="Map legend"><span><i class="wm-key available"></i>Ready to visit</span><span><i class="wm-key cleared"></i>Completed</span><span><i class="wm-key"></i>Not yet reachable</span><span><i class="wm-key passage"></i>Waypoint / passage</span></div><p class="wm-status" role="status" aria-live="polite"></p></section>`;
      land=container.querySelector('.wm-land');scroller=container.querySelector('.wm-scroller');traveler=container.querySelector('.wm-traveler');details=container.querySelector('.wm-sidebar');action=container.querySelector('.wm-play');live=container.querySelector('.wm-status');
      const position=current?.world===worldIndex?current:(nodes.find(n=>n.id===world.entry)||nodes[0]);
      if(position)setPosition(position.x,position.y);
      container.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>select(button.dataset.node)));
      container.querySelectorAll('[data-world]').forEach(button=>button.addEventListener('click',()=>{
        if(busy)return;
        const index=Number(button.dataset.world);
        render({...state,world:index,selectedNode:null});
        options.onWorld?.(index);
      }));
      container.querySelector('.wm-locate').addEventListener('click',()=>{
        if(current && current.world!==worldIndex){render({...state,world:current.world,selectedNode:current.id});options.onWorld?.(current.world);}
        else{if(current)select(current.id);revealTraveler();}
      });
      action.addEventListener('click',async()=>{
        if(busy||!selected||!status.available.has(selected))return;
        busy=true;updateDetails();
        try{await options.onChoose(selected);}
        catch(error){if(live)live.textContent='The road is not ready yet. Try another connected destination.';console.error(error);}
        finally{busy=false;container.querySelector('.wm')?.classList.remove('is-traveling');updateDetails();}
      });
      scroller.addEventListener('keydown',event=>{
        if(!event.target.matches('.wm-node')||!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(event.key))return;
        const origin=getNode(event.target.dataset.node),direction=event.key;
        const candidates=nodes.filter(n=>n.id!==origin.id&&nodeOpen(n)&&((direction==='ArrowDown'&&n.y>origin.y)||(direction==='ArrowUp'&&n.y<origin.y)||(direction==='ArrowLeft'&&n.x<origin.x)||(direction==='ArrowRight'&&n.x>origin.x))).sort((a,b)=>{
          const score=n=>Math.hypot(n.x-origin.x,n.y-origin.y)+(direction==='ArrowLeft'||direction==='ArrowRight'?Math.abs(n.y-origin.y)*2:Math.abs(n.x-origin.x));
          return score(a)-score(b);
        });
        if(candidates[0]){event.preventDefault();container.querySelector(`[data-node="${candidates[0].id}"]`).focus();select(candidates[0].id);}
      });
      updateDetails();
      if(oldWorld===worldIndex)scroller.scrollTop=oldScroll;
      else revealTraveler();
      // A host can render before showModal(). Wait one frame for actual geometry
      // before centering a restored traveler far down this tall scrollable map.
      if(!next._keepScroll && (wasHidden||previousCurrent!==state.currentNode||oldWorld!==worldIndex||oldScroll===0)) {
        revealTraveler();
        requestAnimationFrame(()=>{if(!destroyed&&thisRender===renderVersion)revealTraveler();});
      }
    }
    function findPath(from,to) {
      if(!from||!to)return [];
      if(from===to)return [from];
      const adjacency=new Map();
      journey.edges.forEach(({from:a,to:b})=>{if(!adjacency.has(a))adjacency.set(a,[]);if(!adjacency.has(b))adjacency.set(b,[]);adjacency.get(a).push(b);adjacency.get(b).push(a);});
      const seen=new Set([from]), queue=[[from]];
      while(queue.length){const path=queue.shift(),last=path[path.length-1];for(const id of adjacency.get(last)||[]){if(seen.has(id)||!status.available.has(id)||(!status.cleared.has(id)&&id!==to))continue;const extended=[...path,id];if(id===to)return extended;seen.add(id);queue.push(extended);}}
      return [];
    }
    function travel(fromId,toId) {
      const from=getNode(fromId),to=getNode(toId);
      if(destroyed||!to||!status?.available.has(toId))return Promise.resolve(false);
      const path=findPath(fromId,toId);
      if(!path.length || !from || from.world!==worldIndex || to.world!==worldIndex){return Promise.resolve(false);}
      if(reduce()||path.length===1){setPosition(to.x,to.y);return Promise.resolve(true);}
      const points=[];
      for(let i=1;i<path.length;i++){const a=getNode(path[i-1]),b=getNode(path[i]);if(a.world!==worldIndex||b.world!==worldIndex)continue;const segment=edgePoints(a,b);points.push(...(points.length?segment.slice(1):segment));}
      if(points.length<2)return Promise.resolve(false);
      const segments=[];let total=0;
      for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);segments.push({a,b,length,start:total});total+=length;}
      const duration=Math.min(2400,Math.max(650,total*2.4));
      container.querySelector('.wm')?.classList.add('is-traveling');traveler.classList.add('is-walking');
      live.textContent=`Traveling to ${nameFor(to)}…`;
      return new Promise(resolve=>{
        travelResolve=resolve;const start=performance.now();
        function tick(now){
          if(destroyed){resolve(false);return;}
          const progress=Math.min(1,(now-start)/duration),distance=progress*total;
          const seg=segments.find(s=>distance<=s.start+s.length)||segments[segments.length-1],portion=seg.length?Math.min(1,(distance-seg.start)/seg.length):1;
          setPosition(seg.a[0]+(seg.b[0]-seg.a[0])*portion,seg.a[1]+(seg.b[1]-seg.a[1])*portion);
          const top=traveler.offsetTop;
          if(top<scroller.scrollTop+55||top>scroller.scrollTop+scroller.clientHeight-65)scroller.scrollTop=Math.max(0,top-scroller.clientHeight*.5);
          if(progress<1)frame=requestAnimationFrame(tick);
          else{traveler.classList.remove('is-walking');container.querySelector('.wm')?.classList.remove('is-traveling');live.textContent=`Arrived at ${nameFor(to)}.`;travelResolve=null;resolve(true);}
        }
        frame=requestAnimationFrame(tick);
      });
    }
    function destroy(){destroyed=true;cancelAnimationFrame(frame);travelResolve?.(false);travelResolve=null;container.innerHTML='';}
    return {render,travel,destroy,select,get selectedNode(){return selected;}};
  }
  window.TinyWorldMap=Object.freeze({create});
})();
