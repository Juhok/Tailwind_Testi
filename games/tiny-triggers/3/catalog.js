/* English translation and playable specification of the Finnish additions.
   Every entry describes physical props and gestures, not menu-button puzzles. */
const prop = (id, art, x, y, opts = {}) => ({ id, art, x, y, ...opts });
const step = (id, x, y, mode, cue, fx = {}) => ({
  id,
  to: [x, y],
  mode,
  cue,
  fx,
});
const task = (id, title, translation, fixtures, pieces, steps, verdict) => ({
  id,
  title,
  translation,
  fixtures,
  pieces,
  steps,
  verdict,
});
const F = (art, x, y, opts = {}) => prop("", art, x, y, opts);
const NEW_TASKS = [
  task(
    "butter",
    "Excavation rights",
    "Butter: dig a hole in the middle instead of shaving off an even slice.",
    [F("butter", 260, 158), F("plate", 260, 208)],
    [prop("knife", "knife", 105, 112)],
    [
      step("knife", 260, 155, "scrub", "Dig into the middle", {
        spawn: [F("crater", 260, 158)],
        reset: true,
      }),
    ],
    "A butter quarry. How practical.",
  ),
  task(
    "books",
    "Shelf confidence",
    "Bookshelf: leave one book upside down and another sticking out.",
    [
      F("shelf", 245, 180),
      F("book", 180, 143),
      F("book", 220, 143, { color: "#a48ab2" }),
    ],
    [
      prop("flip", "book", 265, 143, { color: "#b8a56f" }),
      prop("out", "book", 308, 143, { color: "#8fb3b2" }),
    ],
    [
      step("flip", 265, 195, "twist", "Turn one book over", {
        angle: Math.PI,
        reset: true,
      }),
      step("out", 350, 168, "drag", "Leave its neighbour sticking out"),
    ],
    "A shelf with two opinions.",
  ),
  task(
    "socks",
    "Pairing is subjective",
    "Socks: deliberately match the wrong pairs.",
    [F("basket", 350, 180)],
    [
      prop("a", "sock", 108, 115, { color: "#d6908d" }),
      prop("b", "sock", 195, 180, { color: "#7aa5d1" }),
      prop("c", "sock", 195, 100, { color: "#d6908d" }),
      prop("d", "sock", 108, 195, { color: "#7aa5d1" }),
    ],
    [
      step("a", 325, 155, "drag", "Choose a sock"),
      step("b", 365, 155, "drag", "Find its wrong partner"),
    ],
    "Close enough. From different feet.",
  ),
  task(
    "usb",
    "Third time never",
    "USB connector: try it upside down, flip it, then try it the wrong way again.",
    [F("usbport", 330, 140)],
    [prop("plug", "usb", 130, 140)],
    [
      step("plug", 293, 140, "drag", "Try the connector", {
        reset: true,
        spawn: [F("cross", 330, 140)],
      }),
      step("plug", 130, 195, "twist", "Flip it over", {
        angle: Math.PI,
        reset: true,
      }),
      step("plug", 293, 140, "drag", "Try again", { reset: true }),
    ],
    "Both sides were wrong. Obviously.",
  ),
  task(
    "sticker",
    "Proof of purchase",
    "Price sticker: peel it off while leaving a small paper strip in the middle.",
    [F("jar", 245, 155), F("sticker", 245, 145)],
    [
      prop("left", "paper", 225, 145, { scale: 0.45 }),
      prop("right", "paper", 266, 145, { scale: 0.45 }),
    ],
    [
      step("left", 132, 105, "tear", "Peel from the left", {
        spawn: [F("residue", 243, 145)],
      }),
      step("right", 360, 110, "tear", "Peel from the right", { clear: [1] }),
    ],
    "The price is gone. The evidence remains.",
  ),
  task(
    "crumb",
    "A clean sweep, almost",
    "Dust pile: sweep everything away except one tiny crumb.",
    [
      F("dust", 210, 165),
      F("dust", 275, 175),
      F("crumb", 245, 153),
      F("dustpan", 368, 187),
    ],
    [prop("broom", "broom", 90, 152)],
    [
      step("broom", 360, 180, "sweep", "Sweep the large pile", {
        clear: [0],
        reset: true,
      }),
      step("broom", 360, 195, "sweep", "Sweep the rest, mostly", {
        clear: [1],
        reset: true,
      }),
    ],
    "One crumb. A whole unfinished job.",
  ),
  task(
    "cake",
    "The first piece",
    "Cake: cut the first piece out of the middle.",
    [F("cake", 250, 156)],
    [
      prop("knife", "knife", 100, 100),
      prop("slice", "cakepiece", 250, 156, { hidden: true }),
    ],
    [
      step("knife", 290, 150, "cut", "Cut a square from the center", {
        spawn: [F("crater", 250, 150)],
        reveal: "slice",
        hide: true,
      }),
      step("slice", 370, 195, "drag", "Take the middle piece"),
    ],
    "Every edge piece is now a problem.",
  ),
  task(
    "carton",
    "The other spout",
    "Milk carton: tear open the pouring spout from the wrong side.",
    [F("carton", 245, 163)],
    [prop("flap", "flap", 222, 111)],
    [
      step("flap", 155, 75, "tear", "Open the sealed side", {
        spawn: [F("ragged", 222, 110)],
      }),
    ],
    "Now it pours in several directions.",
  ),
  task(
    "sandwich",
    "Coverage optional",
    "Sandwich: place the cheese so that the center stays bare and the edges overhang.",
    [F("bread", 245, 160)],
    [prop("left", "cheese", 110, 103), prop("right", "cheese", 370, 103)],
    [
      step("left", 192, 160, "drag", "Cheese on one edge"),
      step("right", 298, 160, "drag", "Cheese on the other edge"),
    ],
    "The bread in the middle is on its own.",
  ),
  task(
    "spaghetti",
    "Short pasta, long argument",
    "Spaghetti: snap the dry strands just before putting them in the pot.",
    [F("pot", 340, 177)],
    [prop("pasta", "spaghetti", 150, 125)],
    [
      step("pasta", 150, 185, "bend", "Snap the bundle", {
        art: "brokenpasta",
        reset: true,
      }),
      step("pasta", 340, 145, "drag", "Into the pot", { angle: 0.7 }),
    ],
    "It fits. That is not the point.",
  ),
  task(
    "cookie",
    "One second too long",
    "Cookie: dunk it in tea until the last piece breaks off and sinks.",
    [F("cup", 280, 175, { fill: 0.7 })],
    [prop("cookie", "cookie", 110, 105)],
    [
      step("cookie", 280, 149, "soak", "Hold it in the tea", {
        art: "crumb",
        sink: true,
        spawn: [F("ripples", 280, 155)],
      }),
    ],
    "Tea with a surprise at the bottom.",
  ),
  task(
    "icecream",
    "Living on the edge",
    "Ice cream: press the scoop crookedly onto the edge of the cone.",
    [F("cone", 260, 183)],
    [prop("scoop", "scoop", 115, 100)],
    [
      step("scoop", 292, 130, "press", "Press the scoop onto the rim", {
        angle: 0.4,
      }),
    ],
    "Structurally questionable. Delicious.",
  ),
  task(
    "yogurt",
    "Lid confetti",
    "Yogurt pot: tear the lid into narrow strips, leaving some attached to the rim.",
    [F("yogurt", 245, 171), F("residue", 245, 129)],
    [
      prop("a", "foil", 213, 130),
      prop("b", "foil", 239, 130),
      prop("c", "foil", 266, 130),
    ],
    [
      step("a", 135, 75, "tear", "Tear one narrow strip"),
      step("b", 230, 65, "tear", "Another narrow strip"),
      step("c", 352, 85, "tear", "Leave the rim attached"),
    ],
    "A spoon obstacle course.",
  ),
  task(
    "ketchup",
    "Shake? Never",
    "Ketchup: squeeze the watery first squirt straight onto the fries.",
    [F("fries", 270, 183)],
    [prop("bottle", "ketchup", 120, 105)],
    [
      step("bottle", 255, 105, "pour", "Hold and squeeze, unshaken", {
        angle: 2.2,
        spawn: [F("puddle", 270, 185, { color: "#bc775c" })],
        reset: true,
      }),
    ],
    "Tomato-flavoured water. The premium topping.",
  ),
  task(
    "straw",
    "The disappearing straw",
    "Straw: push it so far into the juice carton that it falls completely inside.",
    [F("juice", 260, 172)],
    [prop("straw", "straw", 268, 86)],
    [
      step("straw", 268, 192, "push", "Push past the little hole", {
        hide: true,
      }),
    ],
    "Your drink now contains its own equipment.",
  ),
  task(
    "ice",
    "The chosen cube",
    "Ice tray: release every cube except the one you are trying to get.",
    [
      F("tray", 240, 160),
      F("ice", 240, 158, { color: "#d8b56c" }),
      F("bowl", 385, 190),
    ],
    [
      prop("a", "ice", 175, 158),
      prop("b", "ice", 207, 158),
      prop("c", "ice", 273, 158),
      prop("d", "ice", 305, 158),
    ],
    [
      step("a", 355, 165, "drag", "Free a cube"),
      step("b", 390, 165, "drag", "Not the chosen one"),
      step("c", 375, 191, "drag", "Another wrong cube"),
      step("d", 405, 191, "drag", "Leave the gold-marked cube"),
    ],
    "The one you wanted has chosen to stay.",
  ),
  task(
    "cupboard",
    "Order matters",
    "Cupboard doors: close them in the wrong order so one remains ajar.",
    [F("cupboard", 245, 152)],
    [prop("right", "door", 347, 147), prop("left", "door", 140, 147)],
    [
      step("right", 277, 147, "drag", "Close the overlapping door first", {
        scale: 0.9,
      }),
      step("left", 211, 147, "drag", "Now close the other one", {
        angle: -0.18,
      }),
    ],
    "They disagree on who goes first.",
  ),
  task(
    "pump",
    "Wall care routine",
    "Pump bottle: turn the nozzle to point straight at the wall.",
    [F("wall", 325, 143), F("bottle", 240, 179)],
    [prop("nozzle", "nozzle", 240, 122, { angle: Math.PI })],
    [
      step("nozzle", 305, 122, "twist", "Turn the nozzle toward the wall", {
        angle: 0,
        reset: true,
      }),
    ],
    "Moisturised plaster. Excellent.",
  ),
  task(
    "toothpaste",
    "Middle management",
    "Toothpaste: squeeze the middle of the tube and leave the cap crooked.",
    [F("brush", 355, 195)],
    [prop("tube", "tube", 205, 151), prop("cap", "cap", 110, 193)],
    [
      step("tube", 230, 151, "squeeze", "Squeeze from the middle", {
        art: "pinchedtube",
        reset: true,
        spawn: [F("paste", 265, 150)],
      }),
      step("cap", 260, 144, "drag", "Put the cap back, almost", { angle: 0.4 }),
    ],
    "A tube with a waist and a bad hat.",
  ),
  task(
    "towel",
    "Beside the dotted line",
    "Paper towel: tear a sheet just beside the perforation.",
    [F("paperroll", 193, 110), F("perforation", 245, 167)],
    [prop("sheet", "paper", 245, 192)],
    [
      step("sheet", 345, 215, "tear", "Tear beside the perforation", {
        spawn: [F("ragged", 245, 170)],
      }),
    ],
    "The dotted line was only a suggestion.",
  ),
  task(
    "watering",
    "Missed the saucer",
    "Watering can: pour the final splash just outside the plant saucer.",
    [F("plant", 255, 168), F("plate", 255, 220)],
    [prop("can", "watering", 105, 108)],
    [
      step("can", 345, 148, "pour", "Aim the last splash beside the pot", {
        angle: 0.65,
        spawn: [F("puddle", 350, 225)],
        reset: true,
      }),
    ],
    "The table was thirsty too.",
  ),
  task(
    "laundry",
    "One sleeve short",
    "Laundry: turn one shirt sleeve inside out just before folding.",
    [F("shirt", 250, 155)],
    [prop("sleeve", "sleeve", 174, 139), prop("fold", "fabric", 288, 193)],
    [
      step("sleeve", 237, 146, "pull", "Pull the sleeve inside", {
        scaleX: 0.4,
        clear: [0],
        spawn: [F("shirtin", 250, 155)],
      }),
      step("fold", 227, 165, "drag", "Fold with the sleeve still inside", {
        spawn: [F("foldedshirt", 250, 164)],
        hide: true,
      }),
    ],
    "A small surprise for tomorrow.",
  ),
  task(
    "laces",
    "Unequal partnership",
    "Shoelaces: tie a bow with one enormous loop and one tiny loop.",
    [F("shoe", 245, 177)],
    [prop("loop", "loop", 222, 145), prop("tiny", "loop", 265, 145)],
    [
      step("loop", 145, 110, "pull", "Pull one loop much larger", {
        scale: 1.8,
      }),
      step("tiny", 259, 160, "pull", "Tuck the other loop small", {
        scale: 0.4,
      }),
    ],
    "One loop for each level of enthusiasm.",
  ),
  task(
    "zip",
    "Fabric snack",
    "Zipper: zip it up while catching a small piece of fabric in it.",
    [F("jacket", 245, 157), F("fabric", 247, 104, { scale: 0.4 })],
    [prop("zip", "zipper", 245, 211)],
    [
      step("zip", 245, 111, "pull", "Zip up into the loose fabric", {
        spawn: [F("ragged", 245, 105)],
      }),
    ],
    "The zipper has eaten.",
  ),
  task(
    "blinds",
    "One dissenting slat",
    "Blinds: turn one slat in the opposite direction to all the others.",
    [F("window", 245, 145)],
    [prop("slat", "slat", 245, 145)],
    [
      step("slat", 245, 182, "twist", "Turn just this slat", {
        angle: 0.16,
        reset: true,
        color: "#c2d4e0",
      }),
    ],
    "Sunlight with a personal grudge.",
  ),
  task(
    "film",
    "Dead center",
    "Screen protector: smooth away every air bubble except one exactly in the center.",
    [F("phone", 245, 145), F("bubble", 245, 145)],
    [
      prop("a", "bubble", 220, 100),
      prop("b", "bubble", 269, 113),
      prop("c", "bubble", 218, 185),
      prop("d", "bubble", 273, 185),
    ],
    [
      step("a", 180, 75, "smooth", "Smooth a bubble to the edge", {
        hide: true,
      }),
      step("b", 306, 82, "smooth", "Another bubble out", { hide: true }),
      step("c", 181, 210, "smooth", "Almost flawless", { hide: true }),
      step("d", 307, 210, "smooth", "Leave the very center alone", {
        hide: true,
      }),
    ],
    "Your thumb will find it forever.",
  ),
  task(
    "battery",
    "Positive thinking",
    "Batteries: insert the last battery backwards and close the cover.",
    [F("remote", 260, 150), F("battery", 244, 145, { scale: 0.6 })],
    [prop("cell", "battery", 110, 115), prop("lid", "cover", 365, 130)],
    [
      step("cell", 110, 175, "twist", "Turn the last battery around", {
        angle: Math.PI,
        reset: true,
      }),
      step("cell", 275, 145, "drag", "Insert it backwards", { scale: 0.6 }),
      step("lid", 260, 150, "drag", "Close the cover"),
    ],
    "All charged up. Going nowhere.",
  ),
  task(
    "headphones",
    "Tethered listening",
    "Headphones: thread the cable around a chair leg before lifting the headphones.",
    [F("chairleg", 245, 164)],
    [prop("plug", "plug", 140, 185), prop("phones", "headphones", 115, 100)],
    [
      step("plug", 320, 185, "route", "Loop the cable around the chair leg", {
        route: [
          [190, 110],
          [285, 110],
          [320, 185],
        ],
        spawn: [F("cordloop", 245, 169)],
      }),
      step("phones", 170, 60, "pull", "Lift the headphones"),
    ],
    "The chair is coming with you.",
  ),
  task(
    "mousecord",
    "Out of reach",
    "Mouse cable: pull it so tight that the mouse cannot reach the screen edge.",
    [F("monitor", 330, 111), F("cableanchor", 130, 190)],
    [prop("mouse", "mouse", 230, 190)],
    [
      step("mouse", 335, 190, "pull", "Stretch the cable toward the edge", {
        spawn: [F("tautcord", 230, 190)],
      }),
    ],
    "The last few pixels are a luxury.",
  ),
  task(
    "printer",
    "Landscape surprise",
    "Printer paper: put one sideways sheet into the stack.",
    [F("printer", 268, 158), F("paper", 268, 137)],
    [prop("sheet", "paper", 110, 135)],
    [
      step("sheet", 110, 195, "twist", "Turn one sheet sideways", {
        angle: Math.PI / 2,
        reset: true,
      }),
      step("sheet", 268, 132, "drag", "Into the paper stack"),
    ],
    "The printer will have opinions.",
  ),
  task(
    "stapler",
    "Wrong corner, missing page",
    "Stapler: staple the wrong corner of the stack and leave one sheet out.",
    [F("papers", 240, 155)],
    [prop("sheet", "paper", 240, 155), prop("stapler", "stapler", 105, 100)],
    [
      step("sheet", 360, 178, "drag", "Leave one sheet aside"),
      step("stapler", 280, 198, "press", "Staple the bottom-right corner", {
        spawn: [F("staple", 280, 198)],
        reset: true,
      }),
    ],
    "Almost a complete document.",
  ),
  task(
    "wrapping",
    "A centimetre short",
    "Wrapping paper: cut a piece just a centimetre too short.",
    [F("gift", 260, 155), F("wrapping", 240, 190)],
    [prop("scissors", "scissors", 115, 110)],
    [
      step("scissors", 310, 205, "cut", "Cut just before the far edge", {
        spawn: [F("gap", 320, 160)],
        reset: true,
      }),
    ],
    "There is always the other side. Also short.",
  ),
  task(
    "tape",
    "Where did it go?",
    "Tape roll: press the loose end perfectly flat so it cannot be found again.",
    [F("taperoll", 245, 153)],
    [prop("end", "tape", 302, 149)],
    [step("end", 273, 150, "smooth", "Flatten the loose end", { hide: true })],
    "Future you will enjoy this.",
  ),
  task(
    "pencap",
    "Before the click",
    "Pen cap: push it almost shut, stopping just before it clicks.",
    [F("pen", 270, 155)],
    [prop("cap", "pencap", 130, 155)],
    [step("cap", 186, 155, "push", "Stop just before the click")],
    "Secure enough. Probably not.",
  ),
  task(
    "dishes",
    "Some of the dishes",
    "Put only some of the dirty dishes into the dishwasher.",
    [F("dishwasher", 340, 150)],
    [
      prop("a", "dirtyplate", 105, 115),
      prop("b", "dirtyplate", 175, 175),
      prop("c", "dirtyplate", 90, 210),
      prop("door", "cover", 355, 225, { scale: 0.7 }),
    ],
    [
      step("a", 320, 140, "drag", "Load one plate", { scale: 0.7 }),
      step("b", 355, 150, "drag", "Load another", { scale: 0.7 }),
      step("door", 340, 172, "push", "Close it. Leave the last plate out", {
        art: "dishwasherdoor",
        scale: 1,
      }),
    ],
    "A partial solution to a full sink.",
  ),
  task(
    "fuel",
    "Half a tank of effort",
    "Fill the car with only half a tank of fuel.",
    [F("car", 300, 158), F("gauge", 245, 78)],
    [prop("nozzle", "fuelnozzle", 95, 138)],
    [
      step(
        "nozzle",
        334,
        148,
        "fuel",
        "Hold the nozzle until the gauge reaches half",
        { spawn: [F("halfgauge", 245, 78)], reset: true },
      ),
    ],
    "Enough to put the problem off.",
  ),
  task(
    "coffee",
    "To the very brim",
    "Coffee cup: fill it so full that moving it always spills a little.",
    [F("cup", 260, 172)],
    [
      prop("pot", "coffeepot", 110, 105),
      prop("cup", "cup", 260, 172, { hidden: true }),
    ],
    [
      step("pot", 235, 103, "pour", "Fill right to the brim", {
        clear: [0],
        reveal: "cup",
        hide: true,
      }),
      step("cup", 350, 172, "drag", "Move the overflowing cup", {
        spawn: [F("puddle", 300, 213, { color: "#906440" })],
      }),
    ],
    "The saucer is now part of the drink.",
  ),
  task(
    "filleddonut",
    "Filling first",
    "Filled doughnut: squeeze out the filling before taking the first bite.",
    [F("plate", 260, 211)],
    [prop("donut", "donut", 245, 151)],
    [
      step("donut", 265, 151, "squeeze", "Squeeze before biting", {
        scaleY: 0.65,
        reset: true,
        spawn: [F("jam", 296, 190)],
      }),
    ],
    "The filling has left the building.",
  ),
  task(
    "mandarin",
    "One thread each",
    "Mandarin: leave one white thread on every segment.",
    [F("plate", 245, 207)],
    [
      prop("a", "segment", 167, 152),
      prop("b", "segment", 219, 152),
      prop("c", "segment", 271, 152),
      prop("d", "segment", 323, 152),
    ],
    [
      step("a", 167, 95, "peel", "Remove most of the pith", {
        reset: true,
        mark: "thread",
      }),
      step("b", 219, 95, "peel", "Leave one white thread", {
        reset: true,
        mark: "thread",
      }),
      step("c", 271, 95, "peel", "One on this segment too", {
        reset: true,
        mark: "thread",
      }),
      step("d", 323, 95, "peel", "A thread on every segment", {
        reset: true,
        mark: "thread",
      }),
    ],
    "Individually wrapped in tiny annoyances.",
  ),
  task(
    "cucumber",
    "No consistent thickness",
    "Cucumber: alternate paper-thin and enormous slices.",
    [F("cucumber", 250, 167)],
    [prop("knife", "knife", 113, 90)],
    [
      step("knife", 185, 175, "cut", "A paper-thin slice", {
        spawn: [F("cucumberslice", 177, 198, { scaleX: 0.2 })],
        reset: true,
      }),
      step("knife", 245, 175, "cut", "An enormous slice", {
        spawn: [F("cucumberslice", 224, 198, { scaleX: 1.3 })],
        reset: true,
      }),
      step("knife", 256, 175, "cut", "Thin again", {
        spawn: [F("cucumberslice", 260, 198, { scaleX: 0.2 })],
        reset: true,
      }),
      step("knife", 315, 175, "cut", "And absurdly thick", {
        spawn: [F("cucumberslice", 310, 198, { scaleX: 1.3 })],
        reset: true,
      }),
    ],
    "A salad with pacing problems.",
  ),
  task(
    "toast",
    "Jam, then cold butter",
    "Toast: spread jam first, then try spreading cold butter on top.",
    [F("bread", 250, 165)],
    [
      prop("jam", "knife", 103, 100, { color: "#c65f79" }),
      prop("butter", "butterknife", 365, 100),
    ],
    [
      step("jam", 250, 165, "scrub", "Jam goes first", {
        spawn: [F("jam", 250, 165)],
        reset: true,
      }),
      step("butter", 250, 165, "scrub", "Spread cold butter on the jam", {
        spawn: [F("tornbread", 250, 165)],
        reset: true,
      }),
    ],
    "Marbled with regret.",
  ),
  task(
    "cheesepack",
    "No longer resealable",
    "Cheese pack: tear the resealable seam so it no longer works.",
    [F("cheesepack", 245, 158)],
    [prop("seam", "seam", 245, 111)],
    [
      step("seam", 355, 76, "tear", "Tear across the reusable seal", {
        spawn: [F("ragged", 245, 112)],
      }),
    ],
    "Resealable was a temporary feature.",
  ),
  task(
    "crisps",
    "Crumbs on top",
    "Crisp bag: open it from the bottom and pour the crumbs on top.",
    [F("bowl", 330, 197)],
    [prop("bag", "crisps", 170, 137), prop("seam", "seam", 170, 191)],
    [
      step("seam", 95, 217, "tear", "Open the bottom seam", {
        spawn: [F("ragged", 170, 191)],
      }),
      step("bag", 310, 115, "pour", "Pour crumbs on top", {
        angle: 2.6,
        spawn: [F("dust", 330, 181)],
        reset: true,
      }),
    ],
    "The smallest crisps get priority.",
  ),
  task(
    "teabag",
    "Tag included",
    "Teabag: let go of the string so the paper tag sinks into the cup too.",
    [F("cup", 280, 177, { fill: 0.7 }), F("teabag", 280, 165)],
    [prop("tag", "tag", 205, 105)],
    [
      step("tag", 280, 151, "drag", "Let the tag fall in", {
        sink: true,
        spawn: [F("ripples", 280, 155)],
      }),
    ],
    "Now with extra paper flavour.",
  ),
  task(
    "shakers",
    "Labels are suggestions",
    "Salt and pepper: fill the shakers with the opposite contents from their labels.",
    [
      F("shaker", 210, 178, { label: "S" }),
      F("shaker", 325, 178, { label: "P" }),
    ],
    [prop("pepper", "pepper", 110, 100), prop("salt", "salt", 375, 100)],
    [
      step("pepper", 210, 115, "pour", "Pepper into S", {
        spawn: [F("pepperfill", 210, 180)],
        reset: true,
      }),
      step("salt", 325, 115, "pour", "Salt into P", {
        spawn: [F("saltfill", 325, 180)],
        reset: true,
      }),
    ],
    "Seasoning is now a guessing game.",
  ),
  task(
    "soap",
    "Wrapper reunited",
    "Soap: press the wet bar into its paper wrapper.",
    [F("wrapper", 270, 172)],
    [prop("soap", "soap", 115, 108)],
    [
      step("soap", 270, 172, "press", "Press wet soap into paper", {
        spawn: [F("stuckpaper", 270, 173)],
      }),
    ],
    "A packaging reunion nobody needed.",
  ),
  task(
    "curtain",
    "Outside the tub",
    "Shower curtain: close it on the outside of the bathtub.",
    [F("bathtub", 245, 190), F("rail", 245, 60)],
    [prop("curtain", "curtain", 110, 141)],
    [
      step("curtain", 248, 172, "pull", "Pull the curtain outside the rim", {
        scaleX: 2.2,
      }),
    ],
    "A shower for the whole bathroom.",
  ),
  task(
    "sponge",
    "Let it soak",
    "Dish sponge: leave it floating in dirty water after washing.",
    [F("sink", 260, 175)],
    [prop("sponge", "sponge", 110, 102)],
    [
      step("sponge", 260, 177, "drag", "Leave the sponge in dirty water", {
        float: true,
      }),
    ],
    "Freshly cleaned. Immediately reconsidered.",
  ),
  task(
    "floor",
    "Final footsteps",
    "Floor cleaning: mop the floor, then walk across the wet area.",
    [F("tiles", 260, 175)],
    [prop("mop", "mop", 90, 105), prop("feet", "feet", 100, 220)],
    [
      step("mop", 360, 180, "sweep", "Mop the whole patch", {
        spawn: [F("wetfloor", 260, 175)],
        reset: true,
      }),
      step("feet", 352, 145, "walk", "Walk across the wet floor", {
        spawn: [F("footprints", 260, 180)],
      }),
    ],
    "Signed by the cleaner.",
  ),
  task(
    "bin",
    "Beside the bag",
    "Bin bag: drop rubbish between the bag and the bin.",
    [F("bin", 260, 174)],
    [prop("rubbish", "crumpled", 110, 100)],
    [
      step("rubbish", 294, 145, "drag", "Drop it beside the liner", {
        scale: 0.55,
        sink: true,
      }),
    ],
    "In the bin. Technically.",
  ),
  task(
    "hanger",
    "Through the neck",
    "Hanger: stretch the shirt neckline to push the hanger through it.",
    [F("shirt", 260, 171)],
    [prop("hanger", "hanger", 115, 100)],
    [
      step("hanger", 260, 132, "push", "Push through the neck opening", {
        spawn: [F("stretchedneck", 260, 129)],
      }),
    ],
    "A little more room to breathe.",
  ),
  task(
    "glove",
    "Missing little finger",
    "Glove: push its little finger inside the rest of the glove.",
    [F("glove", 260, 166)],
    [prop("finger", "finger", 295, 119)],
    [
      step("finger", 264, 163, "push", "Tuck the little finger inside", {
        hide: true,
        spawn: [F("crater", 287, 139, { scale: 0.35 })],
      }),
    ],
    "Four fingers ready. One hiding.",
  ),
  task(
    "cushion",
    "Zip side forward",
    "Sofa cushion: put it down with the zipper clearly facing forward.",
    [F("sofa", 260, 182)],
    [prop("cushion", "cushion", 120, 105)],
    [
      step("cushion", 120, 170, "twist", "Turn the zip to the front", {
        mark: "zip",
        reset: true,
      }),
      step("cushion", 260, 157, "drag", "Place it zip-side forward"),
    ],
    "The least comfortable side gets the spotlight.",
  ),
  task(
    "candle",
    "A wax tunnel",
    "Candle: extinguish it just as a deep hollow forms in the middle.",
    [F("candle", 250, 176)],
    [prop("snuffer", "snuffer", 110, 102)],
    [
      step("snuffer", 250, 117, "wait", "Wait for the central wax tunnel", {
        spawn: [F("crater", 250, 130, { scale: 0.6 })],
        reset: true,
      }),
      step("snuffer", 250, 130, "press", "Snuff the flame", {
        clear: [0],
        spawn: [F("candleout", 250, 176)],
        reset: true,
      }),
    ],
    "A candle with a very narrow ambition.",
  ),
  task(
    "suitcase",
    "Sleeve included outside",
    "Suitcase: close it with a shirt sleeve hanging outside.",
    [F("suitcase", 245, 174)],
    [
      prop("shirt", "foldedshirt", 245, 160),
      prop("sleeve", "sleeve", 300, 163),
      prop("lid", "suitcaselid", 245, 81),
    ],
    [
      step("sleeve", 358, 180, "pull", "Leave a sleeve hanging out"),
      step("lid", 245, 173, "push", "Close over the sleeve"),
    ],
    "Your luggage is waving goodbye.",
  ),
  task(
    "dogear",
    "Bookmark ignored",
    "Book: fold a large dog-ear in the page even though a bookmark is beside it.",
    [F("openbook", 245, 162), F("bookmark", 375, 161)],
    [prop("corner", "pagecorner", 309, 108)],
    [
      step("corner", 268, 152, "fold", "Fold a large page corner", {
        angle: Math.PI,
        art: "foldedcorner",
      }),
    ],
    "The bookmark watched the whole thing.",
  ),
  task(
    "notebook",
    "Spiral confetti",
    "Spiral notebook: tear out a page, leaving paper fringe around the spiral.",
    [F("notebook", 245, 160)],
    [prop("page", "paper", 255, 160)],
    [
      step("page", 368, 113, "tear", "Pull the page off the spiral", {
        spawn: [F("fringe", 202, 158)],
      }),
    ],
    "A notebook with a paper moustache.",
  ),
  task(
    "pencil",
    "A perfect point, briefly",
    "Pencil: sharpen a perfect tip and immediately snap it against the paper.",
    [F("sharpener", 190, 119), F("paper", 330, 185)],
    [prop("pencil", "pencil", 100, 95)],
    [
      step("pencil", 190, 115, "twist", "Sharpen the point", {
        mark: "sharp",
        reset: true,
      }),
      step("pencil", 330, 166, "press", "Press it into the paper", {
        mark: "broken",
        spawn: [F("lead", 330, 181)],
      }),
    ],
    "Perfection was nice while it lasted.",
  ),
  task(
    "plaster",
    "Sticky sides together",
    "Plaster: fold the adhesive sides together and press them firmly.",
    [F("plaster", 245, 158)],
    [prop("flap", "plasterhalf", 209, 158)],
    [
      step("flap", 271, 158, "fold", "Fold sticky sides together", {
        angle: Math.PI,
        clear: [0],
      }),
      step("flap", 270, 164, "press", "Press it firmly", { scaleX: 0.65 }),
    ],
    "A bandage for itself.",
  ),
  task(
    "envelope",
    "Sealed too soon",
    "Envelope: close and seal it before putting the letter inside.",
    [F("envelope", 245, 174), F("letter", 370, 153)],
    [prop("flap", "envelopeflap", 245, 119)],
    [
      step("flap", 245, 169, "fold", "Close the empty envelope", {
        angle: Math.PI,
      }),
      step("flap", 245, 177, "press", "Seal it before adding the letter", {
        spawn: [F("seal", 245, 177)],
      }),
    ],
    "The letter can admire it from outside.",
  ),
  task(
    "cards",
    "One face up",
    "Card deck: shuffle one face-up card among the face-down cards.",
    [F("deck", 270, 168)],
    [prop("card", "playingcard", 110, 113)],
    [
      step("card", 110, 175, "twist", "Turn one card face up", {
        mark: "face",
        reset: true,
      }),
      step("card", 270, 158, "drag", "Slide it into the deck", { angle: 0.16 }),
    ],
    "A very small spoiler.",
  ),
  task(
    "chess",
    "Black on the right",
    "Chessboard: turn it so the bottom-right square is black.",
    [],
    [prop("board", "chessboard", 245, 154)],
    [
      step("board", 315, 195, "twist", "Turn the board a quarter turn", {
        angle: Math.PI / 2,
        reset: true,
      }),
    ],
    "White on the right? Not tonight.",
  ),
  task(
    "boardgame",
    "One piece in the lid",
    "Board game: pack everything away, but leave one piece caught under the lid.",
    [F("gamebox", 250, 177)],
    [
      prop("a", "pawn", 130, 110),
      prop("b", "pawn", 360, 110),
      prop("lid", "boxlid", 245, 79),
    ],
    [
      step("a", 245, 175, "drag", "Put the first piece inside"),
      step("b", 333, 166, "drag", "Leave one on the rim"),
      step("lid", 250, 166, "push", "Close the lid over it", { angle: -0.08 }),
    ],
    "It almost stacks neatly.",
  ),
  task(
    "cube",
    "One last turn",
    "Rubik’s cube: solve it, then turn one face once.",
    [F("cube", 245, 165, { mark: "mixed" })],
    [prop("face", "cubeface", 245, 133)],
    [
      step("face", 302, 133, "twist", "Finish the solve", {
        reset: true,
        clear: [0],
        spawn: [F("cube", 245, 165)],
      }),
      step("face", 302, 133, "twist", "Now turn one face again", {
        reset: true,
        mark: "mixed",
        spawn: [F("cubestripe", 245, 164)],
      }),
    ],
    "Solved, in the past tense.",
  ),
  task(
    "domino",
    "A gap in the plan",
    "Domino row: pull one tile just too far away, then start the chain.",
    [F("dominorow", 240, 180)],
    [prop("gap", "domino", 300, 175), prop("first", "domino", 115, 175)],
    [
      step("gap", 345, 175, "drag", "Move one tile out of reach"),
      step("first", 140, 192, "push", "Start the chain", {
        angle: 1.1,
        hide: true,
        clear: [0],
        spawn: [F("fallenrow", 210, 192)],
      }),
    ],
    "A chain reaction with a disappointing ending.",
  ),
];
const REVISED_TASKS = {
  0: task(
    "banana",
    "Peel by peel",
    "Banana: peel it from the middle or tear the peel into small pieces.",
    [F("banana", 245, 151)],
    [
      prop("a", "peelflake", 227, 125),
      prop("b", "peelflake", 249, 150),
      prop("c", "peelflake", 237, 176),
      prop("d", "peelflake", 259, 198),
    ],
    [
      step("a", 150, 93, "tear", "Tear a little piece from the middle", {
        spawn: [F("bananaflesh", 227, 125)],
      }),
      step("b", 337, 126, "tear", "Another tiny piece", {
        spawn: [F("bananaflesh", 249, 150)],
      }),
      step("c", 155, 203, "tear", "Leave no satisfying strip", {
        spawn: [F("bananaflesh", 237, 176)],
      }),
      step("d", 350, 214, "tear", "One last little scrap", {
        spawn: [F("bananaflesh", 259, 198)],
      }),
    ],
    "Peeled in the least efficient way possible.",
  ),
  2: task(
    "chocolate",
    "Off the grid",
    "Chocolate bar: break a piece beside the scored squares.",
    [F("chocolate", 245, 152)],
    [prop("piece", "chocolatechunk", 285, 164)],
    [
      step("piece", 350, 201, "bend", "Break beside the scored line", {
        spawn: [F("chocolatebreak", 281, 161)],
      }),
    ],
    "The squares were only a recommendation.",
  ),
  5: task(
    "burger",
    "Bottom goes on top",
    "Burger: pull out the bottom bun and put it on top of the entire stack.",
    [F("burger", 245, 155)],
    [prop("bun", "bun", 245, 205)],
    [
      step("bun", 355, 205, "pull", "Pull out the bottom bun"),
      step("bun", 245, 96, "drag", "Put it on top of everything"),
    ],
    "A top-heavy interpretation of lunch.",
  ),
};
