(function () {
  'use strict';
  TinyV5.register({
    id: 'code-unformatter',
    title: 'The Code Unformatter',
    chapter: 'digital',
    description: 'Give this tidy little function a quick format.',
    hint: 'Press the mint Format button at the top right of the editor.',
    verdict: 'Your whitespace has been given creative freedom.',
    create(api) {
      const { ctx } = api;
      const colors = { ink: '#e5e9ed', keyword: '#c1a7ff', name: '#83d8e8', brace: '#f2c780' };
      // Text, original column/row, destination column/row, syntax color.
      // Each existing token travels to its new position: no replacement frame.
      const source = [
        ['function', 0, 0, 0, 0, 'keyword'], ['tidy', 9, 0, 10, 0, 'name'],
        ['(items)', 13, 0, 16, 0, 'ink'], ['{', 21, 0, 26, 0, 'brace'],
        ['const', 2, 1, 9, 1, 'keyword'], ['ready', 8, 1, 15, 1, 'ink'],
        ['=', 14, 1, 22, 1, 'ink'], ['[', 16, 1, 3, 2, 'brace'],
        [']', 17, 1, 25, 3, 'brace'], [';', 18, 1, 29, 3, 'ink'],
        ['for', 2, 2, 0, 4, 'keyword'], ['(const', 6, 2, 5, 4, 'keyword'],
        ['item', 13, 2, 13, 4, 'ink'], ['of', 18, 2, 19, 4, 'keyword'],
        ['items)', 21, 2, 23, 4, 'ink'], ['{', 28, 2, 32, 4, 'brace'],
        ['ready', 4, 3, 7, 5, 'ink'], ['.', 9, 3, 14, 5, 'ink'],
        ['push', 10, 3, 17, 5, 'name'], ['(item)', 14, 3, 22, 5, 'ink'],
        [';', 20, 3, 30, 5, 'ink'], ['}', 2, 4, 29, 6, 'brace'],
        ['return', 2, 5, 2, 7, 'keyword'], ['ready', 9, 5, 15, 7, 'ink'],
        [';', 14, 5, 23, 7, 'ink'], ['}', 0, 6, 13, 8, 'brace'],
      ];
      let phase = 'ready', elapsed = 0, pressed = false, hover = false, nextSound = 0;
      const button = (p) => api.hit(p, 374, 49, 112, 34);
      const ease = (v) => v * v * (3 - 2 * v);
      function tokenProgress(index) {
        if (phase === 'ready') return 0;
        if (phase === 'done') return 1;
        return ease(api.clamp((elapsed - 0.16 - (index % 7) * 0.09) / 1.15, 0, 1));
      }
      function begin() {
        phase = 'formatting'; elapsed = 0; nextSound = 0.28;
        api.say('Tidying your code…');
        api.tone(620, 0.06, 0.015);
      }
      function label(s, x, y, size, color, align) {
        ctx.font = `${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = color; ctx.fillText(s, x, y);
      }
      return {
        draw() {
          api.bg('desk');
          api.round(31, 29, 428, 225, 12, '#0b141b');
          api.round(25, 20, 428, 229, 11, '#182431', '#4a5b6b');
          ctx.save();
          ctx.beginPath(); ctx.rect(26, 70, 426, 158); ctx.clip();
          api.rect(26, 70, 426, 158, '#14202b');
          api.rect(26, 70, 43, 158, '#111b24');
          api.line(69, 70, 69, 228, '#293847', 1);
          api.rect(72, 85, 365, 15, '#1c2c3b');
          for (let row = 0; row < 9; row++) {
            label(String(row + 1), 56, 97 + row * 14.8, 10, '#607387', 'right');
          }
          // The original straight guides make the final wandering indents obvious.
          ctx.setLineDash([2, 4]);
          api.line(92.7, 102, 92.7, 166, '#2d4050', 1);
          api.line(105.4, 131, 105.4, 151, '#2d4050', 1);
          ctx.setLineDash([]);
          source.forEach((token, i) => {
            const t = tokenProgress(i);
            const x = 80 + 6.35 * (token[1] + (token[3] - token[1]) * t);
            const y = 97 + 14.8 * (token[2] + (token[4] - token[2]) * t);
            const bounce = phase === 'formatting' ? Math.sin(t * Math.PI) * Math.sin(i * 2.1 + elapsed * 9) * 3 : 0;
            if (phase === 'formatting' && t > 0 && t < 1 && token[5] === 'brace') {
              api.round(x - 3, y - 11 + bounce, 13, 16, 3, '#455242');
            }
            label(token[0], x, y + bounce, 10.6, colors[token[5]]);
          });
          api.round(441, 80, 3, 136, 1, '#283745');
          api.round(441, 80, 3, 81, 1, '#546575');
          if (phase === 'formatting') {
            const scanY = 79 + (elapsed / 2.15) * 145;
            api.rect(70, scanY, 368, 1, '#81baa455');
          }
          ctx.restore();
          // File tab, simple code-file icon, and intentionally friendly action.
          api.round(39, 32, 22, 28, 3, '#344857');
          api.line(45, 42, 42, 46, '#8ad7c3', 1.5);
          api.line(42, 46, 45, 50, '#8ad7c3', 1.5);
          api.line(55, 42, 58, 46, '#8ad7c3', 1.5);
          api.line(58, 46, 55, 50, '#8ad7c3', 1.5);
          label('tidy.js', 72, 44, 12, '#ebeeea');
          label(phase === 'ready' ? 'All changes saved' : 'Auto-save enabled', 72, 59, 8.6, '#8398a6');
          const buttonColor = phase === 'formatting' ? '#365b58' : pressed ? '#76bca5' : hover && phase === 'ready' ? '#b6f0d3' : '#99dfbf';
          api.round(318, 32 + (pressed ? 1 : 0), 112, 34, 6, buttonColor);
          if (phase === 'formatting') {
            label('Formatting', 374, 53, 10.3, '#c8f1df', 'center');
          } else {
            // Four staggered lines as a visible formatting icon.
            for (let line = 0; line < 4; line++) api.line(330 + (line % 2) * 4, 42 + line * 4, 343, 42 + line * 4, '#234c42', 1.5);
            label('Format', 381, 53 + (pressed ? 1 : 0), 12, '#153e33', 'center');
          }
          api.line(26, 70, 452, 70, '#3b4b59', 1);
          api.line(26, 228, 452, 228, '#3b4b59', 1);
          api.ellipse(41, 238, 3, 3, phase === 'formatting' ? '#f2c780' : '#99dfbf');
          label(phase === 'ready' ? 'Ready to format' : phase === 'formatting' ? 'Aligning whitespace…' : 'Formatting complete.', 51, 241.5, 9.8, phase === 'done' ? '#b8ecd1' : '#a5bac5');
          label('JS', 431, 241.5, 9, '#70899a', 'right');
          if (phase === 'formatting') api.rect(26, 247, 426 * api.clamp(elapsed / 2.15, 0, 1), 2, '#99dfbf');
        },
        down(p) { if (phase === 'ready') pressed = button(p); },
        move(p) { hover = button(p); if (pressed && !hover) pressed = false; },
        up(p) { const activate = pressed && button(p); pressed = false; if (activate && phase === 'ready') begin(); },
        cancel() { pressed = false; },
        update(dt) {
          if (phase !== 'formatting') return;
          elapsed += dt;
          if (elapsed >= nextSound && elapsed < 1.8) {
            api.tone(360 + (Math.floor(elapsed * 10) % 4) * 70, 0.035, 0.009);
            nextSound += 0.3;
          }
          if (elapsed >= 2.15) {
            phase = 'done'; api.say('Formatting complete.'); api.tone(740, 0.1, 0.016); api.done();
          }
        },
        debug() {
          return {
            phase, elapsed, pressed,
            tokenProgress: tokenProgress(8),
            arraySplit: tokenProgress(8) > 0.1,
            braceDisplacement: 27 * 6.35 * tokenProgress(21),
            indentOffsets: [2 + 7 * tokenProgress(4), 2 - 2 * tokenProgress(10), 4 + 3 * tokenProgress(16)],
            message: phase === 'done' ? 'Formatting complete.' : '',
            ruined: phase === 'done',
          };
        },
      };
    },
  });
})();
