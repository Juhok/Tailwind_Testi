"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const TinyJourney = require("../../games/tiny-triggers/11/journey.js");
const gameDirectory = path.resolve(__dirname, "../../games/tiny-triggers/11");

// Load the actual catalogue/registrations without canvas, timers, or the game
// shell. Scene implementations are registered, never instantiated or mocked.
function actualCatalogue() {
  const context = vm.createContext({});
  const run = file => vm.runInContext(fs.readFileSync(path.join(gameDirectory, file), "utf8"), context, { filename: file });
  const scripts = [...fs.readFileSync(path.join(gameDirectory, "index.html"), "utf8")
    .matchAll(/src="([^"]+\.js)"/g)].map(match => match[1]);
  run("catalog.js");
  vm.runInContext(`const TinyV5 = { entries: [], register(def) {
    this.entries.push(def); NEW_TASKS.push({id:def.id,title:def.title,translation:def.description,
      steps:[{cue:def.hint}],verdict:def.verdict,custom:def,fixtures:[],pieces:[]});
  }};`, context);
  for (const file of scripts.filter(file => file.startsWith("scenes/"))) run(file);
  run("upgrades.js");
  for (const file of scripts.filter(file => file.startsWith("upgrades/"))) run(file);
  run("additions.js");
  for (const file of scripts.filter(file => file.startsWith("additions/"))) run(file);
  run("chapters.js");
  const gameSource = fs.readFileSync(path.join(gameDirectory, "game.js"), "utf8");
  vm.runInContext(gameSource.slice(gameSource.indexOf("const scenes ="), gameSource.indexOf("const SCENE_COUNT")), context);
  return JSON.parse(vm.runInContext("JSON.stringify({chapters:TinyChapters.create(scenes,TASKS).chapters,scenes})", context));
}

const { chapters, scenes } = actualCatalogue();
const journey = TinyJourney.create(chapters, { sceneTitle: index => scenes[index][0] });
assert.equal(chapters.length, 35);
assert.equal(journey.worlds.length, 7);
assert.equal(journey.sceneNodes.size, 199);
assert.equal(journey.nodeById.size, journey.nodes.length);
assert.equal(journey.start, "scene-0");
assert.equal(journey.nodeById.get(journey.start).title, "Peel by peel");
const chapterScenes = chapters.flatMap(chapter => chapter.indices).sort((a, b) => a - b);
assert.deepEqual([...journey.sceneNodes.keys()].sort((a, b) => a - b), chapterScenes);
assert.equal(new Set(journey.edges.map(edge => `${edge.from}>${edge.to}`)).size, journey.edges.length);
for (const edge of journey.edges) {
  assert(journey.nodeById.has(edge.from)); assert(journey.nodeById.has(edge.to));
}
for (const world of journey.worlds) {
  assert.equal(world.chapters.length, 5);
  assert.equal(world.chapterLayouts.length, 5);
  for (const layout of world.chapterLayouts) assert.equal(layout.title, chapters[layout.chapter].title);
  const localNodes = journey.nodes.filter(node => node.world === world.index);
  for (const node of localNodes) {
    assert(node.x >= 0 && node.x <= world.width);
    assert(node.y >= 0 && node.y < world.height);
    if (node.type === "scene") assert.equal(node.title, scenes[node.sceneIndex][0]);
  }
  for (let i = 0; i < localNodes.length; i++) for (let j = i + 1; j < localNodes.length; j++) {
    const a = localNodes[i], b = localNodes[j];
    assert(Math.hypot(a.x - b.x, a.y - b.y) * 280 / world.width >= 44,
      `44px touch targets must not overlap on a 280px map: ${a.id}/${b.id}`);
  }
}
for (let chapter = 0; chapter < chapters.length; chapter++) {
  const routeNodes = journey.nodes.filter(node => node.chapter === chapter && node.type === "scene");
  assert(routeNodes.some(node => node.route === "left"), `Chapter ${chapter} has left gameplay`);
  assert(routeNodes.some(node => node.route === "right"), `Chapter ${chapter} has right gameplay`);
  if (chapters[chapter].indices.length === 2) assert(!routeNodes.some(node => node.route === "main"));
}

// A fresh game has exactly one playable scene, and forged visit IDs cannot
// jump over the banana, locked junctions, world passages, or retreat gate.
let snapshot = journey.status(new Set(), new Set());
assert.deepEqual([...snapshot.available], [journey.start]);
assert.deepEqual([...snapshot.revealedWorlds], [0]);
assert.equal(snapshot.arrived, false);
const everyVisit = new Set(journey.nodes.filter(node => node.type !== "scene").map(node => node.id));
snapshot = journey.status(new Set([198]), everyVisit);
assert.deepEqual([...snapshot.available], [journey.start]);
assert(snapshot.cleared.has("scene-198"), "An imported completion is not erased");
assert(!snapshot.available.has("scene-198"), "But an imported future completion is not a teleport");
assert.equal(snapshot.validVisited.size, 0);
assert.equal(snapshot.arrived, false);
assert.equal(journey.visit("retreat", new Set(), everyVisit).size, 0);

// The first chapter actually branches. Either route opens the shared exit;
// the other remains playable after moving on and is not marked completed.
for (const side of ["left", "right"]) {
  const done = new Set([0]);
  let visited = journey.visit("junction-0", done);
  const selected = journey.nodes.find(node => node.chapter === 0 && node.route === side && node.type === "scene");
  const alternate = journey.nodes.find(node => node.chapter === 0 && node.route !== side && node.route !== "main" && node.type === "scene");
  assert(journey.status(done, visited).available.has(selected.id));
  assert(journey.status(done, visited).available.has(alternate.id));
  done.add(selected.sceneIndex);
  assert(journey.status(done, visited).available.has("exit-0"));
  visited = journey.visit("exit-0", done, visited);
  snapshot = journey.status(done, visited);
  assert(snapshot.available.has(journey.sceneNodes.get(chapters[1].indices[0]).id));
  assert(snapshot.available.has(alternate.id));
  assert(!snapshot.cleared.has(alternate.id));
  done.add(alternate.sceneIndex);
  assert(journey.status(done, visited).cleared.has(alternate.id));
}

// Completing only the far end of a multi-scene branch must not let legacy
// or developer-replay data unlock the merge ahead of the branch's first step.
const mini = TinyJourney.create([{ title: "Long branch", indices: [0, 1, 2, 3, 4, 5, 6] }]);
snapshot = mini.status(new Set([0, 3, 6]), new Set(["junction-0", "exit-0", "passage-0", "retreat"]));
assert(snapshot.available.has("scene-1") && snapshot.available.has("scene-4"));
assert(!snapshot.available.has("scene-2") && !snapshot.available.has("scene-5"));
assert(!snapshot.available.has("exit-0"));
assert.equal(snapshot.arrived, false);

// A player can finish a complete journey using either route policy, without
// clearing every scene. Every world edge still needs its explicit passage.
function playJourney(routeFor) {
  const completed = new Set();
  let visited = new Set(), passages = 0;
  for (let turn = 0; turn < journey.nodes.length * 2; turn++) {
    const before = journey.status(completed, visited);
    if (before.arrived) return { completed, visited, passages };
    const next = journey.nodes.find(node => before.available.has(node.id) && !before.cleared.has(node.id)
      && (node.route === "main" || node.route === routeFor(node.chapter)));
    assert(next, "A chosen route must never deadlock");
    if (next.type === "scene") completed.add(next.sceneIndex);
    else {
      if (next.type === "passage") {
        passages++;
        if (next.nextWorld !== null) {
          assert(!before.revealedWorlds.has(next.nextWorld), "Next world stays hidden until crossing");
          assert(!before.available.has(journey.worlds[next.nextWorld].entry));
        } else assert(!before.available.has("retreat"));
      }
      visited = journey.visit(next.id, completed, visited);
      if (next.type === "passage" && next.nextWorld !== null) {
        assert(journey.status(completed, visited).revealedWorlds.has(next.nextWorld));
      }
    }
  }
  assert.fail("Journey did not finish");
}
for (const policy of [() => "left", () => "right", chapter => chapter % 2 ? "right" : "left"]) {
  const result = playJourney(policy);
  assert.equal(result.passages, 7);
  assert(result.completed.size < 199, "Optional branches do not become mandatory");
  assert.equal(journey.status(result.completed, result.visited).revealedWorlds.size, 7);
  assert(journey.status(result.completed, result.visited).arrived);
  // Optional roads remain reachable after the holiday, including their later
  // nodes when the first optional scene is played.
  const remaining = journey.nodes.filter(node => node.type === "scene" && !result.completed.has(node.sceneIndex));
  assert(remaining.length > 0);
  for (const node of remaining) {
    assert(journey.status(result.completed, result.visited).available.has(node.id));
    result.completed.add(node.sceneIndex);
  }
  assert.equal(result.completed.size, 199);
}

// Migration preserves sparse and full old progress, crosses only justified
// waypoints, reveals reached worlds, and never silently claims the holiday.
assert.equal(journey.migrate(new Set()).size, 0);
const sparse = new Set([0, 198]);
const sparseVisited = journey.migrate(sparse);
assert.deepEqual([...sparseVisited], ["junction-0"]);
assert(!journey.status(sparse, sparseVisited).available.has("scene-198"));
assert.deepEqual([...sparse].sort((a, b) => a - b), [0, 198], "Migration does not mutate old completion data");
const full = new Set(chapterScenes), fullVisited = journey.migrate(full);
snapshot = journey.status(full, fullVisited);
assert.equal(snapshot.revealedWorlds.size, 7);
assert(snapshot.available.has("retreat"));
assert(!fullVisited.has("retreat"));
assert(!snapshot.arrived);
assert(journey.status(full, journey.visit("retreat", full, fullVisited)).arrived);
for (const length of [1, 3, 12, 28, 83, 108, 128, 134, 180, 198]) {
  const completed = new Set(chapters.flatMap(chapter => chapter.indices).slice(0, length));
  const visited = journey.migrate(completed);
  const state = journey.status(completed, visited);
  assert(state.available.size > 0);
  assert(!state.arrived);
  assert(journey.nodes.some(node => state.available.has(node.id) && !state.cleared.has(node.id)),
    `Legacy prefix ${length} retains a playable frontier`);
  assert.equal(state.cleared.size, completed.size + visited.size);
}

assert.throws(() => TinyJourney.create([]), /chapter/);
assert.throws(() => TinyJourney.create([{ indices: [] }]), /no scenes/);
assert.throws(() => TinyJourney.create([{ indices: [0, 0, 1] }]), /Duplicate|repeated/);
const classic = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(gameDirectory, "journey.js"), "utf8"), classic);
assert.equal(vm.runInContext("typeof globalThis.TinyJourney.create", classic), "function");

console.log("PASS 199-scene/35-chapter/7-world graph, both routes, optional replay, passage gates, no deadlocks, forged visits, sparse/full migration, retreat arrival, classic-script export");
