/* First-visit help shares the Gentle Hint feedback and visual guidance.
 * It never sends input, completes a scene, or changes a player's save. */
'use strict';
globalThis.TinyTutorial = (() => {
  const KEY = 'tinyTriggers.v11.tutorialSeen';
  const INTRO = 'Hold the banana’s dark bottom tip with your mouse or finger, drag it upward along the arrow, then release. Need a nudge later? Try “A gentle hint”. Finish a scene to choose your next road.';

  function create({ getIndex, getFinished = () => false, say }) {
    let active = false;
    let shownThisPage = false;
    const button = document.querySelector('#tutorial-dismiss');
    if (button) button.hidden = true;

    function needsIntro() {
      if (shownThisPage) return false;
      try { return localStorage.getItem(KEY) !== 'true'; }
      catch { return true; }
    }

    function hide(clearText) {
      const wasActive = active;
      active = false;
      if (button) button.hidden = true;
      // Do not erase a verdict or scene feedback that replaced this message.
      if (clearText && wasActive && document.querySelector('#feedback')?.textContent === INTRO)
        say('');
      return wasActive;
    }

    function start() {
      if (!needsIntro() || getIndex() !== 0 || getFinished()) return false;
      active = true;
      shownThisPage = true;
      say(INTRO);
      if (button) button.hidden = false;
      // Store only when the introduction is actually displayed. Storage may
      // be unavailable; the in-memory flag still prevents Retry repetition.
      try { localStorage.setItem(KEY, 'true'); } catch {}
      return true;
    }

    const dismiss = () => hide(true);
    button?.addEventListener('click', dismiss);
    return Object.freeze({
      needsIntro,
      start,
      dismiss,
      beforeLoad: () => hide(false),
      onWin: () => hide(false),
      isActive: () => active,
      shouldGuide: () => active && getIndex() === 0 && !getFinished(),
    });
  }

  return Object.freeze({ create });
})();
