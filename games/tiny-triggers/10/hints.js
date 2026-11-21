/* Visual help only: never dispatches input or changes a scene's state. */
'use strict';
const TinyHints = (() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const valid = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
  function current(w) {
    if (!w?.instance) return null;
    const guide = w.instance.guidance ? w.instance.guidance() : globalThis.TinyGuideCatalog?.[w.def.id]?.(w.instance.debug());
    if (!guide || !['drag', 'tap', 'hold', 'wait'].includes(guide.kind)) return null;
    if (guide.kind === 'wait') return guide;
    if (guide.kind === 'drag' ? !valid(guide.from) || !valid(guide.to) : !valid(guide.at)) return null;
    return guide;
  }
  function draw(ctx, guide, time) {
    if (!guide) return;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pulse = reducedMotion.matches ? 1 : .5 + .5 * Math.sin(time * 4);
    const ring = (p, radius, fill = false) => {
      ctx.beginPath(); ctx.arc(p[0], p[1], radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#101a26'; ctx.lineWidth = 5; ctx.stroke();
      ctx.strokeStyle = '#fff3a6'; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = '#fff3a62b'; ctx.fill(); }
    };
    let anchor = [16, 20];
    if (guide.kind === 'drag') {
      const points = [guide.from, ...(guide.via || []).filter(valid), guide.to];
      const path = () => { ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); };
      path(); ctx.strokeStyle = '#101a26cc'; ctx.lineWidth = 5; ctx.stroke();
      ctx.setLineDash([5, 5]); path(); ctx.strokeStyle = '#fff3a6'; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      const a = points.at(-2), b = points.at(-1), angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
      ctx.beginPath(); ctx.moveTo(b[0] - 9 * Math.cos(angle - .5), b[1] - 9 * Math.sin(angle - .5));
      ctx.lineTo(...b); ctx.lineTo(b[0] - 9 * Math.cos(angle + .5), b[1] - 9 * Math.sin(angle + .5));
      ctx.strokeStyle = '#fff3a6'; ctx.lineWidth = 3; ctx.stroke();
      ring(guide.from, 9 + pulse * 2, true); ring(guide.to, 7);
      // Demonstrate the route without moving the real object or stealing input.
      const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
      let distance = (reducedMotion.matches ? .45 : (time % 2.4) / 2.4) * lengths.reduce((a, b) => a + b, 0);
      for (let i = 0; i < lengths.length; i++) {
        if (distance <= lengths[i] || i === lengths.length - 1) {
          const t = lengths[i] ? distance / lengths[i] : 0;
          const x = points[i][0] + (points[i + 1][0] - points[i][0]) * t;
          const y = points[i][1] + (points[i + 1][1] - points[i][1]) * t;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 14); ctx.lineTo(x + 7, y + 9); ctx.lineTo(x + 13, y + 8); ctx.closePath();
          ctx.fillStyle = '#fffbe5'; ctx.fill(); ctx.strokeStyle = '#172331'; ctx.lineWidth = 1.5; ctx.stroke(); break;
        }
        distance -= lengths[i];
      }
      anchor = guide.from;
    } else if (guide.kind !== 'wait') { ring(guide.at, 10 + pulse * 3, true); ring(guide.at, 3); anchor = guide.at; }
    const prefix = guide.kind === 'drag' ? (guide.hold ? 'Drag & hold' : 'Drag') : guide.kind === 'hold' ? 'Hold' : guide.kind === 'wait' ? 'Wait' : 'Tap / click';
    const label = guide.label ? `${prefix}: ${guide.label}` : prefix;
    ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const width = Math.min(350, ctx.measureText(label).width + 14);
    const x = clamp(anchor[0] + 16, 6, 474 - width), y = clamp(anchor[1] - 25, 8, 235);
    ctx.fillStyle = '#101a26ec'; ctx.fillRect(x, y, width, 20);
    ctx.fillStyle = '#fff3a6'; ctx.fillText(label, x + 7, y + 10, width - 14);
    ctx.restore();
  }
  return Object.freeze({ current, draw });
})();
