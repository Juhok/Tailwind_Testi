/* Tiny Triggers v11: a pure, save-independent branching holiday journey.
 * Completion and visits are inputs, never mutable global game state. */
"use strict";

const TinyJourney = (() => {
  const themes = [
    ["trigger-forest", "Trigger Forest", "A picnic, a promise, and the first wrong turn.", "forest", "#91b685"],
    ["trigger-rainforest", "Trigger Rainforest", "Every little routine has grown a little wild.", "rainforest", "#79bca4"],
    ["clatter-highlands", "Clatter Highlands", "Paper trails, kitchen paths, and rocky little comforts.", "mountain", "#b3a7cf"],
    ["neon-crossroads", "Neon Crossroads", "Games, gadgets, and one more stop at the shops.", "city", "#a7bce0"],
    ["detour-dunes", "Detour Dunes", "Surely the next road will get you there.", "desert", "#dab487"],
    ["restless-coast", "Restless Coast", "You can almost hear the sea over the interruptions.", "coast", "#94bec8"],
    ["last-straw-lagoon", "Last Straw Lagoon", "One last wait. One last tiny thing. Then the hammock.", "beach", "#e1c990"],
  ];

  function create(catalogue, options = {}) {
    const chapters = Array.isArray(catalogue) ? catalogue : catalogue?.chapters;
    if (!Array.isArray(chapters) || !chapters.length) throw new Error("Journey needs at least one chapter");
    const titleFor = Array.isArray(options)
      ? (index) => options[index]?.[0]
      : typeof options.sceneTitle === "function" ? options.sceneTitle : () => undefined;
    const nodes = [], edges = [], worlds = [], nodeById = new Map(), sceneNodes = new Map();
    const incoming = new Map(), outgoing = new Map();
    let predecessor = null;

    function addNode(node) {
      if (nodeById.has(node.id)) throw new Error(`Duplicate journey node ${node.id}`);
      nodes.push(node); nodeById.set(node.id, node);
      incoming.set(node.id, []); outgoing.set(node.id, []);
      if (node.type === "scene") {
        if (!Number.isInteger(node.sceneIndex) || node.sceneIndex < 0 || sceneNodes.has(node.sceneIndex)) {
          throw new Error(`Invalid or repeated scene ${node.sceneIndex}`);
        }
        sceneNodes.set(node.sceneIndex, node);
      }
      return node.id;
    }
    function connect(from, to) {
      if (from === null) return;
      edges.push(Object.freeze({ from, to }));
      incoming.get(to).push(from); outgoing.get(from).push(to);
    }
    function addScene(sceneIndex, world, chapter, route, x, y) {
      return addNode({ id: `scene-${sceneIndex}`, type: "scene", sceneIndex, world, chapter,
        title: titleFor(sceneIndex) || `Scene ${sceneIndex + 1}`, route, x, y });
    }

    for (let first = 0; first < chapters.length; first += 5) {
      const index = worlds.length;
      const [id, title, subtitle, theme, color] = themes[index % themes.length];
      const world = { index, id, title, subtitle, theme, color, width: 720, height: 0,
        chapters: [], chapterLayouts: [], entry: null, passage: `passage-${index}` };
      worlds.push(world);
      let top = 30;
      for (let chapter = first; chapter < Math.min(first + 5, chapters.length); chapter++) {
        const definition = chapters[chapter];
        if (!Array.isArray(definition.indices) || !definition.indices.length) {
          throw new Error(`Journey chapter ${chapter} has no scenes`);
        }
        world.chapters.push(chapter);
        // The three two-scene chapters put one scene on each route. A
        // mandatory lead-in there would otherwise leave an empty shortcut.
        const leadIn = definition.indices.length > 2 || chapter === 0;
        let entry = predecessor;
        if (leadIn) {
          const mandatory = addScene(definition.indices[0], index, chapter, "main", 360, top + 110);
          if (!world.entry) world.entry = mandatory;
          connect(predecessor, mandatory); entry = mandatory;
        }
        const junction = addNode({ id: `junction-${chapter}`, type: "waypoint", kind: "junction",
          world: index, chapter, route: "main", title: "Choose a route", x: 360, y: top + 230 });
        if (!world.entry) world.entry = junction;
        connect(entry, junction);
        const remainder = definition.indices.slice(leadIn ? 1 : 0), halfway = Math.ceil(remainder.length / 2);
        const routes = [remainder.slice(0, halfway), remainder.slice(halfway)];
        const ends = [];
        routes.forEach((indices, side) => {
          const route = side ? "right" : "left", x = side ? 510 : 210;
          let previous = junction;
          if (!indices.length) {
            // Some existing chapters contain just two scenes. Their other
            // branch is a real, visitable scenic trail, not a duplicate scene.
            const detour = addNode({ id: `trail-${chapter}-${route}`, type: "waypoint", kind: "trail",
              world: index, chapter, route, title: "Scenic trail", x, y: top + 350 });
            connect(previous, detour); previous = detour;
          }
          indices.forEach((sceneIndex, step) => {
            const next = addScene(sceneIndex, index, chapter, route, x, top + 350 + step * 120);
            connect(previous, next); previous = next;
          });
          ends.push(previous);
        });
        const bottom = top + 470 + (Math.max(1, ...routes.map(route => route.length)) - 1) * 120;
        const exit = addNode({ id: `exit-${chapter}`, type: "waypoint", kind: "exit", world: index,
          chapter, route: "main", title: "Onward to the holiday", x: 360, y: bottom });
        // This is an OR merge: either completed branch opens the road onward.
        ends.forEach(end => connect(end, exit));
        world.chapterLayouts.push({ chapter, title: definition.title || `Chapter ${chapter + 1}`, top, bottom });
        predecessor = exit;
        top = bottom + 100;
      }
      const finalWorld = first + 5 >= chapters.length;
      const passage = addNode({ id: world.passage, type: "passage", world: index,
        chapter: world.chapters[world.chapters.length - 1], route: "main",
        title: finalWorld ? "Passage to the peaceful beach" : "Discover the next world",
        nextWorld: finalWorld ? null : index + 1, x: 360, y: top + 40 });
      connect(predecessor, passage); predecessor = passage;
      if (finalWorld) {
        const retreat = addNode({ id: "retreat", type: "retreat", world: index,
          chapter: world.chapters[world.chapters.length - 1], route: "main",
          title: "The Peaceful Retreat", x: 360, y: top + 160 });
        connect(passage, retreat); world.retreat = retreat;
      }
      world.height = top + (finalWorld ? 320 : 180);
    }

    function inputSet(value) {
      return value instanceof Set ? value : new Set(Array.isArray(value) ? value : []);
    }

    function status(completed = new Set(), visited = new Set()) {
      const done = inputSet(completed), visits = inputSet(visited);
      const cleared = new Set(), available = new Set(), reachable = new Set();
      const activated = new Set(), validVisited = new Set(), revealedWorlds = new Set([0]);
      // Keep imported optional completions visible, without letting a future
      // scene bypass its locked junction, chapter, or unrevealed world.
      for (const index of done) if (sceneNodes.has(index)) cleared.add(sceneNodes.get(index).id);
      // Nodes are inserted in topological order. Only cleared AND reachable
      // predecessors can unlock their successors. Invalid stored visits never
      // supply evidence for their own prerequisites.
      for (const node of nodes) {
        const parents = incoming.get(node.id);
        const canReach = revealedWorlds.has(node.world) && (!parents.length || parents.some(id => activated.has(id)));
        if (!canReach) continue;
        reachable.add(node.id); available.add(node.id);
        const complete = node.type === "scene" ? done.has(node.sceneIndex) : visits.has(node.id);
        if (!complete) continue;
        cleared.add(node.id); activated.add(node.id);
        if (node.type !== "scene") validVisited.add(node.id);
        if (node.type === "passage" && node.nextWorld !== null) revealedWorlds.add(node.nextWorld);
      }
      return { available, cleared, reachable, revealedWorlds, validVisited,
        arrived: activated.has("retreat") };
    }

    function migrate(completed = new Set()) {
      const done = inputSet(completed), visited = new Set();
      // Old linear saves have no waypoint history. Walk only roads supported
      // by their actual completed scenes. Arrival stays a deliberate new act.
      for (let pass = 0; pass <= nodes.length; pass++) {
        const snapshot = status(done, visited);
        const candidates = nodes.filter(node => node.type !== "scene" && node.type !== "retreat"
          && snapshot.available.has(node.id) && !visited.has(node.id));
        if (!candidates.length) break;
        candidates.forEach(node => visited.add(node.id));
      }
      return visited;
    }

    function visit(id, completed, visited = new Set()) {
      const snapshot = status(completed, visited), result = new Set(snapshot.validVisited);
      if (nodeById.get(id)?.type !== "scene" && snapshot.available.has(id)) result.add(id);
      return result;
    }

    for (const node of nodes) Object.freeze(node);
    for (const world of worlds) {
      world.chapterLayouts.forEach(Object.freeze);
      Object.freeze(world.chapterLayouts); Object.freeze(world.chapters); Object.freeze(world);
    }
    return Object.freeze({ nodes: Object.freeze(nodes), edges: Object.freeze(edges),
      worlds: Object.freeze(worlds), nodeById, sceneNodes, status, migrate, visit,
      start: worlds[0].entry, retreat: "retreat",
      successors: (id) => [...(outgoing.get(id) || [])],
      predecessors: (id) => [...(incoming.get(id) || [])] });
  }
  return Object.freeze({ create });
})();

if (typeof globalThis !== "undefined") globalThis.TinyJourney = TinyJourney;
if (typeof module !== "undefined" && module.exports) module.exports = TinyJourney;
