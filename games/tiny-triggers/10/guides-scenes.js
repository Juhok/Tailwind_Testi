/* Current-state visual hints for the retained 25 authored scenes.
 * Read-only: these functions inspect public scene snapshots, never dispatch input.
 * The off-center card owns a richer instance.guidance() implementation.
 */
(() => {
  'use strict';
  const catalog = globalThis.TinyGuideCatalog ||= {};
  const drag = (from, to, label, extra = {}) => ({ kind: 'drag', from, to, label, ...extra });
  const tap = (at, label) => ({ kind: 'tap', at, label });
  const hold = (at, label) => ({ kind: 'hold', at, label });
  const wait = label => ({ kind: 'wait', label });
  const point = p => [p.x, p.y];
  const done = s => s.finished || s.completed || ['done', 'complete'].includes(s.phase);
  const add = (id, guide) => { catalog[id] = s => done(s) ? null : guide(s); };

  add('curtain-clip', s => {
    if (s.phase !== 'open') return wait('The last clip is slipping');
    if (!s.leftClosed) return drag([s.leftEdge - 16, 145], [225, 145], 'Pull the left curtain to the middle');
    return drag([s.rightEdge + 16, 145], [255, 145], 'Bring the right curtain to meet it');
  });
  add('vacuum-rug', s => s.phase === 0
    ? drag(point(s.robot), [391, 181], 'Guide the vacuum across the whole rug')
    : s.phase === 2 ? drag(point(s.robot), [224, 181], 'Guide its next pass over the folded corner')
      : wait(s.phase === 1 ? 'The vacuum is taking another lap' : 'The wheels are still trying'));
  add('code-unformatter', s => s.phase === 'ready' ? tap([374, 49], 'Press Format') : wait('Formatting is in progress'));
  add('toilet-hunt', s => {
    if (s.phase === 'search') {
      // A full circular stroke also works after a player stopped partway round.
      const route = Array.from({ length: 16 }, (_, i) => {
        const a = (i + 1) * Math.PI / 8;
        return [240 + 62 * Math.cos(a), 108 + 62 * Math.sin(a)];
      });
      return drag([302, 108], route.at(-1), 'Rotate the roll to find the loose end', { via: route.slice(0, -1) });
    }
    if (s.phase === 'ready') return drag([240, Math.min(238, 182 + s.paperLength - 2)], [240, 255], 'Pull the loose paper downward');
    return wait('The loose end is disappearing');
  });
  add('armor-paywall', s => s.phase === 0 ? hold([414, 224], 'Attack until the sentinel falls')
    : s.phase === 2 ? drag(point(s.armor), [116, 156], 'Equip the armor on your knight') : wait('Your reward is arriving'));
  add('duvet-corner', s => {
    if (s.phase === 'insert') return drag([240, 241 - s.insertion * 94], [240, 120], 'Push the duvet into its cover');
    if (s.phase === 'shake') return drag([240, 211], [180, 211], 'Shake the open hem back and forth', { via: [[300, 211], [180, 211], [300, 211]] });
    if (s.phase === 'fix') return drag([267 + 76 * s.fix, 147 + 64 * s.fix], [343, 211], 'Move the bunched duvet into the empty corner');
    return wait('Watch the opposite corner');
  });
  add('pull-tab', s => {
    if (s.phase === 'flat') return drag([245, 123 - s.liftProgress * 41], [245, 77], 'Lift the ring first');
    if (s.phase === 'lifted' || s.phase === 'tension') return drag([s.ringX, s.ringY], [323, 82], 'Pull the lifted ring to the right');
    return wait('The tab is breaking away');
  });
  add('oversized-puzzle', s => s.phase === 0 ? drag(point(s.piece), [210, 136], 'Put the last piece over the gap')
    : s.phase === 1 || s.phase === 2 ? hold([210, 136], 'Keep pressing the piece down') : wait('The surrounding pieces are lifting'));
  add('cheese-fingers', s => {
    if (s.phase === 'snack') return drag(s.puff ? point(s.puff) : [72, 74], [231, 68], 'Bring a cheese puff to your mouth');
    if (s.phase === 'mouse') return drag(point(s.mouse), [s.mouse.x > 389 ? 365 : 414, 185], 'Slide the mouse across its pad');
    if (s.phase === 'keyboard' || s.phase === 'pressed') return tap([211, 216], 'Press and release the spacebar');
    return wait(s.phase === 'chewing' ? 'Finish the snack' : 'The sticky key is slowly rising');
  });
  add('forgotten-milk', s => {
    if (s.phase === 'unpack') {
      const items = s.guideItems || [
        { id: 'bread', from: [205, 97], to: [33, 163] },
        { id: 'cereal', from: [245, 99], to: [79, 166] },
        { id: 'greens', from: [279, 97], to: [125, 167] },
        { id: 'coffee', from: [234, 132], to: [173, 170] }
      ];
      const item = items.find(i => !s.unpacked.includes(i.id));
      return item ? drag(item.from, item.to, 'Unpack this item onto the counter') : wait('The empty bag is settling');
    }
    if (s.phase === 'coffee') return drag(s.coffee ? point(s.coffee) : [173, 177], [235, 188], 'Set the coffee on the mat');
    if (s.phase === 'mug') return drag(s.mug ? point(s.mug) : [75, 69], [284, 197], 'Bring your mug down');
    if (s.phase === 'fridge') {
      const width = 128 - s.doorOpen * 116;
      const handle = 335 + width - Math.max(5, width * .12);
      return drag([handle, 124], [handle - (1 - s.doorOpen) * 104 - 3, 124], 'Pull open the fridge door');
    }
    return wait('Check the milk shelf');
  });
  add('never-loot', s => s.phase === 0 ? hold([420, 225], 'Keep fighting for the rare drop')
    : s.phase === 2 ? drag(point(s.item), [104, 140], 'Try equipping the rare item') : wait('Inspect the drop'));
  add('peel-here', s => ['ready', 'loose', 'peeling'].includes(s.phase)
    ? drag(point(s.handle), [425, 215], 'Peel the marked tab down and right') : wait('Only the outer film is coming away'));
  add('collapsing-bag', s => s.phase === 'ready' ? drag([s.paperX, s.paperY], [283, 110], 'Drop the rubbish inside the lined bin') : wait('The bag rim is slipping'));
  add('wet-sock', s => s.phase === 'walking' ? drag(point(s.foot), [302, 163], 'Take a step onto the kitchen tile') : wait('The water is soaking through'));
  add('fabric-zipper', s => s.phase === 0 ? drag(point(s.pull), [240, 112], 'Zip the jacket up')
    : s.phase === 2 || s.phase === 3 ? drag(point(s.pull), [240, 210], 'Pull back down and keep pressure on it', { hold: true }) : wait('The lining is catching'));
  add('microwave-ice', s => {
    if (s.phase === 'ready') return tap([338, 160], 'Start heating the meal');
    if (s.phase === 'hot') return drag([287, 120], [189, 120], 'Pull open the microwave door');
    if (s.phase === 'plate') return drag([181, 155], [270, 202], 'Take out the hot plate');
    if (s.phase === 'cut') return drag(point(s.knife), [270, 195], 'Cut down through the middle');
    return wait(s.phase === 'heating' ? 'The plate is heating' : 'Look inside the meal');
  });
  add('water-sleeve', s => {
    if (s.phase === 'wash') return drag([s.handsX, s.handsY], [230, 149], 'Rub both hands under the water', {
      via: [[230, 149], [251, 149], [209, 149], [251, 149], [209, 149]], hold: true
    });
    if (s.phase === 'washed') return drag([s.handsX, s.handsY], [353, 91], 'Lift your wet hands toward your face');
    return wait('The last drop is running down your wrist');
  });
  add('cold-butter', s => s.phase === 0 ? drag(point(s.knife), [212, 131], 'Put the knife against the butter')
    : s.phase === 1 || s.phase === 2 ? drag(point(s.knife), [s.knife.x + (1 - s.strain) * 110 + 5, s.knife.y], 'Push right and hold against the butter', { hold: true }) : wait('The bread is giving way'));
  add('earbud', s => {
    if (s.phase === 'fitting') {
      const side = !s.inserted.left ? 'left' : 'right';
      const from = s.dragging === side && s.pointer ? point(s.pointer) : side === 'left' ? [219, 222] : [265, 222];
      return drag(from, side === 'left' ? [184, 108] : [299, 108], `Put the ${side} earbud in`);
    }
    return s.phase === 'ready' ? tap([76, 215], 'Press Play') : wait(s.phase === 'warning' ? 'Listen to the right earbud’s warning' : 'Listen to both earbuds');
  });
  add('printed-period', s => s.phase === 'idle' ? tap([70, 143], 'Print the document')
    : s.phase === 'first-ready' ? drag([s.sheetX, s.sheetY], [171, 211], 'Take the first sheet out of the tray') : wait('The printer is still working'));
  add('cookie-switch', s => s.phase === 0 ? tap([164, 208], 'Choose Reject All')
    : s.phase === 2 && s.held ? tap([164, 208], 'Release the button') : wait('The buttons are changing places'));
  add('short-cable', s => {
    if (s.phase === 'plug') return drag([s.plugX, s.plugY], [s.phonePort.x, s.phonePort.y + 8], 'Plug the cable into the phone');
    const torsoX = (253 + s.settled * 63 + s.lean * 28 + 278 + s.settled * 54) / 2;
    if (s.phase === 'settle') return drag([torsoX, 156], [torsoX + (1 - s.settled) * 62 + 3, 156], 'Move back onto the sofa');
    if (s.phase === 'lean') return drag([torsoX, 156], [torsoX + (1 - s.lean) * 34 + 3, 156], 'Lean back that final little bit');
    return wait('The connector is pulling free');
  });
  add('elevator', s => s.phase === 'ready' ? tap([432, 178], 'Press Close Doors') : wait('Watch the doorway'));
  add('controller', s => s.phase === 0 ? hold([339, 218], 'Attack until one hit remains')
    : s.phase === 1 ? tap([339, 218], 'Try the final attack') : wait('The controller has stopped responding'));
})();
