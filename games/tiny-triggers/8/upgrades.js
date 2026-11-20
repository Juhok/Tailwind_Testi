/* V6 replaces earlier scenes in place: stable identities, chapter order and saves. */
const TinyV6 = (() => {
  const entries = new Map();
  function register(index, def) {
    if (!Number.isInteger(index) || index < 0 || index >= 83 || entries.has(index)) throw new Error(`Invalid/repeated v6 scene ${index}`);
    const replacement = {
      id: def.id, title: def.title, translation: def.description,
      steps: [{cue: def.hint}], verdict: def.verdict, custom: def,
      fixtures: [], pieces: [],
    };
    if (index < 18) REVISED_TASKS[index] = replacement;
    else {
      if (NEW_TASKS[index - 18]?.id !== def.id) throw new Error(`V6 identity mismatch ${index}: ${def.id}`);
      NEW_TASKS[index - 18] = replacement;
    }
    entries.set(index, def);
  }
  return { register, entries };
})();
