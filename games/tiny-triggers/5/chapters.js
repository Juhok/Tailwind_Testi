/* Volume 5: preserve the original 83-scene chapter order, then append new
   scene-owned vignettes. Loading presentation remains unchanged from v4. */
"use strict";

const TinyChapters = (() => {
  const groups = [
    ["first-crimes", "First little crimes", "Three familiar things. Three questionable choices.", "#e2bb6f", ["banana", "legacy:1", "chocolate"]],
    ["breakfast", "Breakfast, technically", "Start the day on the wrong side of the bowl.", "#e8c377", ["legacy:4", "butter", "toast", "yogurt", "carton", "legacy:7", "mandarin"]],
    ["lunch", "Lunch disagreements", "Nobody said the portions had to be fair.", "#d99481", ["legacy:3", "burger", "sandwich", "spaghetti", "ketchup", "cucumber", "cheesepack", "crisps", "shakers"]],
    ["sweet", "A questionable sweet tooth", "Save some for everyone. Sort of.", "#d59db7", ["legacy:6", "cake", "filleddonut", "icecream"]],
    ["tea", "Tea break trouble", "A little spill. A very long sigh.", "#b9a3d4", ["cookie", "coffee", "teabag", "straw", "ice"]],
    ["bathroom", "Bathroom habits", "Small rituals, slightly worse results.", "#8eb9d5", ["pump", "toothpaste", "soap", "curtain", "plaster"]],
    ["home", "Home, almost sweet home", "The sort of detail you can never unsee.", "#9dbb9a", ["legacy:8", "legacy:9", "legacy:14", "legacy:15", "cupboard", "blinds", "cushion", "candle", "books", "watering", "legacy:17"]],
    ["cleaning", "Cleaning up, mostly", "Leave just enough evidence.", "#8ac2b7", ["crumb", "towel", "dishes", "sponge", "floor", "bin", "sticker"]],
    ["dressing", "Dressed to mildly distress", "Almost ready to leave the house.", "#d4aa82", ["socks", "laundry", "laces", "zip", "hanger", "glove", "suitcase", "fuel"]],
    ["digital", "Digital discomfort", "Everything works. Almost.", "#8eaee0", ["usb", "film", "battery", "headphones", "mousecord", "legacy:13", "legacy:10", "legacy:11"]],
    ["desk", "Desk manners", "Paperwork with unnecessary consequences.", "#b3b4d3", ["printer", "stapler", "wrapping", "tape", "pencap", "dogear", "notebook", "pencil", "envelope", "legacy:16"]],
    ["games", "Play nicely. Or don't.", "One final piece out of place.", "#d8ba7b", ["legacy:12", "cards", "chess", "boardgame", "cube", "domino"]],
  ];

  for (const [key, title, description, color] of [
    ['home', 'Domestic plot twists', 'Small conveniences. Unexpected consequences.', '#b6b3db'],
    ['kitchen', 'Kitchen betrayals', 'Everything looked ready to eat.', '#dfad7e'],
    ['digital', 'It worked a moment ago', 'Technology has other plans.', '#8fc4d4'],
    ['games', 'One more game', 'Your reward is almost here.', '#d5adce'],
  ]) {
    const keys = TinyV5.entries.filter(s => s.chapter === key).map(s => s.id);
    if (keys.length) groups.push(['v5-' + key, title, description, color, keys]);
  }

  function create(scenes, tasks) {
    // Legacy aliases remain valid when an old scene gains a richer task engine.
    const byKey = new Map(scenes.map((_, index) => [`legacy:${index}`, index]));
    for (const [index, task] of tasks) byKey.set(task.id, index);
    const order = [];
    const sceneChapters = new Map();
    const chapters = groups.map(([id, title, description, color, keys], number) => {
      const chapter = { id, title, description, color, number, indices: [] };
      for (const key of keys) {
        const index = byKey.get(key);
        if (index === undefined) throw new Error(`Chapter ${id}: missing scene ${key}`);
        if (sceneChapters.has(index)) throw new Error(`Scene ${key} appears in two chapters`);
        chapter.indices.push(index);
        sceneChapters.set(index, chapter);
        order.push(index);
      }
      Object.freeze(chapter.indices);
      return Object.freeze(chapter);
    });
    if (order.length !== scenes.length) {
      const missing = scenes.map((_, i) => i).filter((i) => !sceneChapters.has(i));
      throw new Error(`Chapter catalogue does not cover ${missing.join(", ")}`);
    }
    const position = new Map(order.map((index, rank) => [index, rank]));
    const chapterFor = (index) => sceneChapters.get(index);
    const prefix = (completed) => {
      let n = 0;
      while (n < order.length && completed.has(order[n])) n++;
      return n;
    };
    const isUnlocked = (completed) => order.every((i) => completed.has(i));
    const isAvailable = (index, completed) => position.has(index) && (isUnlocked(completed) || position.get(index) <= prefix(completed));
    const normalizeProgress = (done, requestedIndex = order[0]) => {
      const valid = new Set(Array.isArray(done) ? done.filter((i) => position.has(i)) : []);
      const frontier = prefix(valid);
      const completed = new Set(order.slice(0, frontier));
      const index = isAvailable(requestedIndex, completed) ? requestedIndex : order[Math.min(frontier, order.length - 1)];
      return { completed, index, frontier };
    };

    function renderCollection(container, { completed, current, onChoose, unlocked = false }) {
      container.replaceChildren();
      if (!unlocked && !isUnlocked(completed)) {
        const note = document.createElement("p");
        note.className = "collection-locked";
        note.textContent = "Complete the journey to unlock the scene collection.";
        container.append(note);
        return false;
      }
      container.classList.add("chapter-collection");
      const nav = document.createElement("nav");
      nav.className = "chapter-nav";
      nav.setAttribute("aria-label", "Collection chapters");
      for (const chapter of chapters) {
        const link = document.createElement("a");
        link.href = `#collection-${chapter.id}`;
        link.textContent = `${String(chapter.number + 1).padStart(2, "0")} ${chapter.title}`;
        link.style.setProperty("--chapter-accent", chapter.color);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const section = container.querySelector(`#collection-${chapter.id}`);
          section?.scrollIntoView({ behavior: "auto", block: "start" });
          section?.querySelector("h3")?.focus({ preventScroll: true });
        });
        nav.append(link);
      }
      container.append(nav);
      for (const chapter of chapters) {
        const section = document.createElement("section");
        section.id = `collection-${chapter.id}`;
        section.className = "collection-chapter";
        section.style.setProperty("--chapter-accent", chapter.color);
        const heading = document.createElement("h3");
        heading.tabIndex = -1;
        heading.id = `${section.id}-heading`;
        heading.textContent = `${String(chapter.number + 1).padStart(2, "0")} · ${chapter.title}`;
        section.setAttribute("aria-labelledby", heading.id);
        const note = document.createElement("p");
        note.textContent = chapter.description;
        const grid = document.createElement("div");
        grid.className = "chapter-scenes";
        for (const index of chapter.indices) {
          const button = document.createElement("button");
          button.type = "button";
          button.dataset.scene = String(index);
          button.textContent = `${String(position.get(index) + 1).padStart(2, "0")} · ${scenes[index][0]}`;
          if (index === current) button.setAttribute("aria-current", "true");
          button.addEventListener("click", () => onChoose(index));
          grid.append(button);
        }
        section.append(heading, note, grid);
        container.append(section);
      }
      return true;
    }

    return Object.freeze({
      chapters: Object.freeze(chapters),
      order: Object.freeze(order),
      position,
      chapterFor,
      next: (index) => order[(position.get(index) + 1) % order.length],
      prefix,
      isUnlocked,
      isAvailable,
      normalizeProgress,
      renderCollection,
      label: (index) => {
        const chapter = chapterFor(index);
        return `${String(chapter.number + 1).padStart(2, "0")} · ${chapter.title}`;
      },
      sceneLabel: (index) => `${String(position.get(index) + 1).padStart(2, "0")} / ${order.length}`,
    });
  }
  return Object.freeze({ create });
})();

const TinyLoading = (() => {
  // Entire paragraphs are assigned at once. Their length, not a typewriter,
  // makes the deliberately brief transition end before a normal reading does.
  const tips = [
    "Before undertaking your next small act of questionable judgement, it may be helpful to familiarize yourself with the relationship between your hand, the input device in your hand, the pointer visible on the screen, and the object you hope to affect. These four things generally work best when used in roughly that order, although we have not appointed a committee to investigate every possible alternative. Having located the object, move the pointer until it overlaps the object, then press the primary button of your computer mouse. In other words, the useful advice buried in this paragraph is: click things with your mouse.",
    "A successful dragging operation begins with a modest but surprisingly important commitment. Having pressed down on an object, continue to hold the button while moving your hand in the direction you would like that object to travel. Releasing the button too early may bring the operation to an earlier conclusion than you had initially intended, which is technically an efficient result but not necessarily the desired one. When the object arrives somewhere appropriate, or appropriately inappropriate, release your finger. This concludes our comprehensive introduction to the subject. The entire tip is simply: hold the mouse button down while you drag.",
    "If the object you are looking for has become difficult to locate, consider directing your attention toward the part of the display on which the game is currently being shown. This is often a more productive location to inspect than the ceiling, a nearby bookshelf, or the inside of the refrigerator, although we cannot deny that those other places may contain interesting things of their own. Once you have returned your attention to the screen, inspect the objects that are visible there. With this fairly substantial amount of explanation now behind us, our recommendation can be summarized as follows: look at the screen.",
    "Sound is traditionally easier to hear when it has not been turned off. This relationship also applies to the little musical noises accompanying the current collection of activities. If you prefer silence, you may choose silence; if you prefer music, you may choose music. The control for making this choice is the control marked with a word referring to sound, which we consider a reasonably strong clue to its intended purpose. No advanced musical qualifications are needed, and no orchestra will arrive at your home to check your answer. The tip is: the sound button turns the sound on or off.",
    "When using a touchscreen, it is usually beneficial for at least one finger to make contact with the screen. Hovering thoughtfully above the glass may convey your intentions to nearby people, but the device itself can find this manner of communication somewhat difficult to interpret. Place your finger on the object you intend to move, then slide that finger along the screen while maintaining contact. Lift it when you would like to let go. There are many other things that fingers can do, but they fall outside the scope of this loading screen. Our advice is: touch the screen to use touch controls.",
    "Objects sometimes respond differently depending on where you put them. A cup on a table, for example, occupies a different position from the same cup somewhere else, even if the cup has not changed its opinion about anything. To explore this exciting principle, take an object that the game allows you to move and move it away from the place where it was previously resting. If you later decide that you would prefer another location, you may move it again. No geographical training is required for this exercise. The important lesson is: moving an object changes where it is.",
    "There may come a time when you wish to perform a small task again, perhaps because the result did not meet your expectations or perhaps because your expectations themselves were rather questionable. At such a time, direct your attention to the control whose label contains the word Retry. Unlike a decorative label on an unrelated item, this word has been selected to describe the function of the control beside it. Pressing it begins the current scene again, allowing another attempt at the same small decision. After considering all of these details, remember this practical advice: Retry retries the scene.",
    "An object which is being held and an object which has been released are not quite the same thing. The former continues to accompany the pointer, while the latter generally stops doing so and is left to contemplate its new surroundings. This distinction can be useful when carrying something toward a destination but becomes less useful if you continue holding it after you intended to finish. To end the holding part of the operation, stop holding the button. There is no additional form to submit and no appointment to arrange. The essential advice is: release the mouse button to let go.",
    "It is possible to complete more than one scene during a visit, provided that you continue from a completed scene into another one. The control intended to help with this transition is conveniently labelled with the word Next, a word commonly associated with the thing that comes after the current thing. Once your current tiny crime has reached its conclusion, this control becomes available for the purpose just described. Pressing it does not require permission from the objects you have inconvenienced. The entire procedural recommendation, stripped of its rather unnecessary introduction, is this: choose Next to go to the next scene.",
    "The pointer on your screen is capable of indicating a variety of different positions. This can be demonstrated by moving your mouse a short distance and observing that the pointer also moves a short distance, though not necessarily the identical distance when measured with a ruler. If the pointer is currently to one side of an object, moving the mouse toward that object will normally bring it closer. Repeating this process can help place the pointer directly over the object you intend to use. Our final, extremely advanced recommendation is: move the mouse to move the pointer.",
    "The button labelled with a request for a gentle hint has a particular interest in providing commentary about your current situation. Some of that commentary may be more helpful than other parts, depending on how many times you have already requested assistance and how generously you define the word helpful. If you would like to hear what the button has to say, activate it. If you would not like to hear what it has to say, you can leave it alone. Both approaches involve very little paperwork. The central point of this lengthy advisory notice is: press the hint button to request a hint.",
    "You may notice that the game contains several objects, a background, some controls, and a title describing the activity presently underway. These elements appear together on the display so that you can see them without having to visit separate rooms or consult a printed directory. When deciding what to do, begin by looking at the visible objects and consider which of them could plausibly be moved, pulled, poured, or otherwise inconvenienced. This does not guarantee excellent judgement, but excellent judgement is not the objective. Our carefully considered advice is: the things you can see on the screen are on the screen.",
  ];
  let visits = 0;
  let previousTip = -1;
  const tipFor = (target = 0) => {
    let choice = ((target * 5 + visits++) % tips.length + tips.length) % tips.length;
    // Chapter order is intentionally non-numeric. Different scene IDs can
    // otherwise select the same paragraph on successive visits (30 -> 25).
    if (choice === previousTip) choice = (choice + 1) % tips.length;
    previousTip = choice;
    return tips[choice];
  };

  function logoPosition(time, width = 480, height = 270) {
    const logoWidth = Math.min(100, width * 0.24);
    const logoHeight = logoWidth * 0.48;
    const pad = 4;
    const maxX = Math.max(1, width - logoWidth - pad * 2);
    const maxY = Math.max(1, height - logoHeight - pad * 2);
    const bounce = (value, range) => range - Math.abs(((value % (range * 2)) + range * 2) % (range * 2) - range);
    // The two reflections occur at different moments: close, never the corner.
    const rawX = maxX - 80 + time * 67;
    const rawY = maxY - 61 + time * 38;
    return {
      x: pad + bounce(rawX, maxX),
      y: pad + bounce(rawY, maxY),
      width: logoWidth,
      height: logoHeight,
      color: ["#8cd3bd", "#d9a6d0", "#e2c67f", "#8cb9df"][(Math.abs(Math.floor(rawX / maxX)) + Math.abs(Math.floor(rawY / maxY))) % 4],
    };
  }

  function drawDVD(ctx, time, width = 480, height = 270) {
    const p = logoPosition(time, width, height);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.width / 100, p.height / 48);
    ctx.fillStyle = p.color;
    // Italic custom vector letterforms, rather than a word in a bouncing box.
    ctx.save();
    ctx.transform(1, 0, -0.16, 1, 4, 0);
    const d = (x) => {
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x + 15, 0);
      ctx.bezierCurveTo(x + 34, 0, x + 34, 23, x + 15, 23);
      ctx.lineTo(x, 23); ctx.closePath();
      ctx.moveTo(x + 8, 6); ctx.lineTo(x + 8, 17); ctx.lineTo(x + 14, 17);
      ctx.bezierCurveTo(x + 23, 17, x + 23, 6, x + 14, 6);
      ctx.closePath(); ctx.fill("evenodd");
    };
    d(0);
    ctx.beginPath();
    ctx.moveTo(31, 0); ctx.lineTo(40, 0); ctx.lineTo(48, 15);
    ctx.lineTo(58, 0); ctx.lineTo(67, 0); ctx.lineTo(50, 24);
    ctx.lineTo(45, 24); ctx.closePath(); ctx.fill();
    d(67);
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(50, 30, 47, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(50, 30, 15, 1.4, 0, 0, Math.PI * 2); ctx.fill("evenodd");
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("V  I  D  E  O", 50, 47);
    ctx.restore();
    return p;
  }
  return Object.freeze({ tips: Object.freeze(tips), tipFor, logoPosition, drawDVD });
})();
