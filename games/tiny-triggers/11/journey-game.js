/* The journey changes navigation, never the 199 scene identities or gestures. */
function setupJourney() {
  const dialog = document.querySelector('#world-dialog');
  const state = restoredJourney && typeof restoredJourney === 'object' ? restoredJourney : {};
  let visited = Array.isArray(state.visited)
    ? new Set(state.visited.filter(id => journey.nodeById.has(id) && journey.nodeById.get(id).type !== 'scene'))
    : journey.migrate(completed);
  let currentNode = journey.nodeById.has(state.current) ? state.current : journey.sceneNodes.get(index)?.id;
  let world = Number.isInteger(state.world) ? state.world : journey.nodeById.get(currentNode)?.world || 0;
  let busy = false;
  const validStatus = () => journey.status(completed, visited);
  // Validate navigation independently of raw localStorage. Corrupt waypoints
  // cannot unlock an otherwise unreachable road or a future world.
  let initial = validStatus();
  visited = new Set([...visited].filter(id => initial.cleared.has(id)));
  if (!initial.available.has(currentNode)) {
    currentNode = [...initial.available].find(id => journey.nodeById.get(id).type === 'scene' && !completed.has(journey.nodeById.get(id).sceneIndex))
      || journey.sceneNodes.get(0).id;
  }
  if (!initial.revealedWorlds.has(world)) world = journey.nodeById.get(currentNode).world;

  function render() {
    map.render({ completed, visited, currentNode, world });
  }
  function synchronize() {
    active = !document.querySelector('dialog[open]');
    if (audio) {
      if (!active || document.hidden) audio.suspend().catch(() => {});
      else audio.resume().catch(() => {});
    }
  }
  function open() {
    if (transition || busy) return;
    if (workshop?.pointer !== undefined || workshop?.gesture) {
      const pointer = workshop.pointer ?? workshop.gesture?.pointer;
      taskCancel();
      if (pointer !== undefined && canvas.hasPointerCapture(pointer)) canvas.releasePointerCapture(pointer);
    }
    if (drag?.origin) Object.assign(drag.o, drag.origin);
    drag = null;
    tutorial?.dismiss();
    render();
    if (!dialog.open) dialog.showModal();
    synchronize();
  }
  function holiday() {
    document.querySelector('#holiday-summary').textContent =
      `Seven worlds behind you. ${completed.size} of ${SCENE_COUNT} tiny crimes visited. The other roads will still be there after your holiday.`;
    document.querySelector('#ending').showModal();
    synchronize();
  }
  async function choose(id) {
    if (busy || !validStatus().available.has(id)) return;
    const node = journey.nodeById.get(id);
    busy = true;
    document.querySelector('#world-close').disabled = true;
    try {
      await map.travel(currentNode, id);
      currentNode = id;
      world = node.world;
      if (node.type === 'scene') {
        save();
        dialog.close();
        synchronize();
        beginTransition(node.sceneIndex);
      } else {
        visited.add(id);
        if (node.type === 'passage') {
          const revealed = validStatus().revealedWorlds;
          if (revealed.has(node.world + 1)) world = node.world + 1;
          document.querySelector('#journey-status').textContent = world > node.world
            ? `A new world is revealed: ${journey.worlds[world].title}. Your holiday is a little closer.`
            : 'The Quiet Shore is just ahead. Choose the beach retreat.';
        } else {
          document.querySelector('#journey-status').textContent = node.type === 'retreat'
            ? 'You made it. The hammock is waiting.' : 'A new stretch of road is open. Choose where to go next.';
        }
        save();
        render();
        if (node.type === 'retreat') {
          dialog.close();
          holiday();
        }
      }
    } finally {
      busy = false;
      document.querySelector('#world-close').disabled = false;
    }
  }
  const map = TinyWorldMap.create({
    container: document.querySelector('#world-map'), journey,
    onChoose: choose,
    onWorld(next) {
      if (busy || !validStatus().revealedWorlds.has(next)) return;
      world = next; save(); render();
    },
  });
  document.querySelector('#world-open').onclick = open;
  document.querySelector('#world-close').onclick = () => { if (!busy) dialog.close(); };
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', synchronize);
  document.querySelector('#ending').addEventListener('close', synchronize);
  return {
    open, render, choose,
    canPlay(i) { return validStatus().available.has(journey.sceneNodes.get(i)?.id); },
    sceneWon(i) {
      const node = journey.sceneNodes.get(i);
      if (node && validStatus().available.has(node.id)) { currentNode = node.id; world = node.world; }
    },
    snapshot() { return { visited: [...visited], current: currentNode, world }; },
    status: validStatus,
  };
}
