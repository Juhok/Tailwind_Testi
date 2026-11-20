(() => {
  'use strict';
  TinyV5.register({
    id: 'oversized-puzzle',
    title: 'The Almost-Perfect Puzzle Piece',
    chapter: 'games',
    description: 'Place the last piece, then press it into its perfectly matching picture.',
    hint: 'Drag the loose lighthouse piece into the empty gap. Release, then hold your finger on it to force it down.',
    verdict: 'The picture fits. The laws of geometry disagree.',
    create(api) {
      const { ctx, rect, round, ellipse, line, poly, text, clamp } = api;
      const board = { x: 30, y: 40, w: 288, h: 192 };
      const target = { x: 210, y: 136 }, origin = { x: 396, y: 143 };
      const physicalScale = 1.09;
      const neighbors = [2, 5, 7, 10];
      let phase = 0, time = 0, pieceX = origin.x, pieceY = origin.y;
      let dragging = false, grabX = 0, grabY = 0, pressing = false;
      let pressure = 0, neighborLift = 0, settle = 0, finished = false, pictureAligned = false;
      let placementPulse = 0;

      function flags(row, col) {
        const right = (r, c) => (r + c) % 2 ? -1 : 1;
        const bottom = (r, c) => (r + c) % 2 ? 1 : -1;
        return [row ? -bottom(row - 1, col) : 0, col < 3 ? right(row, col) : 0,
          row < 2 ? bottom(row, col) : 0, col ? -right(row, col - 1) : 0];
      }

      function edge(x1, y1, x2, y2, bump, scale) {
        const dx = x2 - x1, dy = y2 - y1, length = Math.hypot(dx, dy);
        const nx = dy / length, ny = -dx / length;
        const point = (u, v) => [x1 + dx * u + nx * v * scale, y1 + dy * u + ny * v * scale];
        if (!bump) { ctx.lineTo(x2, y2); return; }
        ctx.lineTo(...point(.34, 0));
        ctx.bezierCurveTo(...point(.43, 0), ...point(.42, bump * 4), ...point(.38, bump * 8));
        ctx.bezierCurveTo(...point(.32, bump * 18), ...point(.68, bump * 18), ...point(.62, bump * 8));
        ctx.bezierCurveTo(...point(.58, bump * 4), ...point(.57, 0), ...point(.66, 0));
        ctx.lineTo(x2, y2);
      }

      function shape(row, col, scale = 1) {
        const x = 36 * scale, y = 32 * scale, f = flags(row, col);
        ctx.beginPath(); ctx.moveTo(-x, -y);
        edge(-x, -y, x, -y, f[0], scale);
        edge(x, -y, x, y, f[1], scale);
        edge(x, y, -x, y, f[2], scale);
        edge(-x, y, -x, -y, f[3], scale);
        ctx.closePath();
      }

      // Every piece samples this same unscaled painting. The final piece's
      // cardboard grows, not its illustration, so the lighthouse aligns exactly.
      function picture() {
        const sky = ctx.createLinearGradient(0, 40, 0, 151);
        sky.addColorStop(0, '#b8b7ca'); sky.addColorStop(.6, '#efc4ac'); sky.addColorStop(1, '#efceaa');
        rect(24, 34, 300, 205, sky);
        ellipse(86, 84, 19, 19, '#fff0bb');
        round(119, 62, 56, 7, 4, '#f5dfc4a0');
        round(110, 69, 38, 5, 3, '#f5dfc480');
        round(242, 55, 47, 6, 3, '#d9c6c3');
        poly([[24, 127], [63, 106], [87, 122], [121, 112], [170, 135], [324, 133], [324, 163], [24, 163]], '#809eaa');
        poly([[24, 142], [66, 120], [107, 144], [143, 126], [177, 145], [324, 147], [324, 166], [24, 166]], '#638e9d');
        rect(24, 146, 300, 94, '#448c9b');
        for (let n = 0; n < 15; n++) {
          const x = 38 + n * 19 % 257, y = 153 + n * 17 % 72;
          line(x, y, x + 16 + n % 3 * 7, y, n % 2 ? '#83bdba' : '#286f85', 1.3);
        }
        poly([[141, 204], [174, 181], [199, 173], [239, 176], [269, 192], [290, 217], [324, 230], [324, 240], [102, 240]], '#3e6d67');
        poly([[141, 204], [174, 181], [199, 173], [239, 176], [267, 193], [231, 196], [191, 192]], '#89a174');
        poly([[164, 211], [194, 186], [219, 184], [213, 194], [193, 212], [189, 239], [171, 239]], '#c8bc95');
        // The uninterrupted tower is an especially clear alignment reference.
        poly([[201, 81], [219, 81], [227, 180], [193, 180]], '#fbecd1');
        poly([[212, 82], [219, 81], [227, 180], [212, 180]], '#d7c8b4');
        poly([[199, 111], [221, 111], [223, 137], [197, 137]], '#c27460');
        poly([[212, 111], [221, 111], [223, 137], [212, 137]], '#a85d56');
        round(205, 151, 10, 28, 4, '#476777');
        rect(205, 96, 9, 9, '#446776');
        rect(205, 141, 9, 8, '#446776');
        round(198, 76, 24, 9, 2, '#5d7180');
        rect(199, 65, 22, 14, '#4f6874');
        rect(202, 67, 6, 10, '#ffe6a4'); rect(212, 67, 6, 10, '#ffe6a4');
        poly([[194, 65], [210, 53], [226, 65]], '#ad645b');
        line(210, 48, 210, 54, '#5f6872', 1.5);
        line(193, 83, 227, 83, '#5a7280', 2);
        for (const x of [194, 202, 218, 226]) line(x, 78, x, 84, '#5a7280', 1);
        poly([[277, 150], [277, 129], [262, 150]], '#fae4bb');
        line(277, 127, 277, 157, '#445e70', 1.5);
        poly([[260, 154], [286, 154], [280, 160], [265, 160]], '#9d6157');
        line(270, 164, 286, 164, '#a2c7bc', 1.3);
        for (let n = 0; n < 6; n++) {
          const x = 248 + n * 11, y = 204 + n % 2 * 9;
          line(x, y + 7, x - 2, y, '#c3b782', 1.4);
          line(x, y + 6, x + 3, y + 1, '#c3b782', 1.4);
        }
        line(118, 91, 123, 88, '#71828d', 1.3); line(123, 88, 128, 91, '#71828d', 1.3);
        line(134, 83, 138, 81, '#71828d', 1.2); line(138, 81, 142, 83, '#71828d', 1.2);
      }

      function boardPiece(index, lift = 0) {
        const row = Math.floor(index / 4), col = index % 4;
        const cx = board.x + col * 72 + 36, cy = board.y + row * 64 + 32;
        let dx = 0, dy = 0, angle = 0;
        if (lift) {
          dx = (index === 5 ? -4 : index === 7 ? 4 : 0) * lift;
          dy = -(index === 10 ? 12 : index === 2 ? 9 : 8) * lift;
          angle = (index === 5 ? -.09 : index === 7 ? .09 : index === 2 ? -.025 : .045) * lift;
          ctx.save(); ctx.translate(cx + dx + 3, cy + 8 * lift); ctx.rotate(angle);
          shape(row, col); ctx.fillStyle = '#08142199'; ctx.shadowColor = '#06111ce0'; ctx.shadowBlur = 9 * lift; ctx.fill(); ctx.restore();
        }
        ctx.save(); ctx.translate(cx + dx, cy + dy + lift * 6); ctx.rotate(angle);
        shape(row, col); ctx.fillStyle = '#685b48'; ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(angle);
        shape(row, col); ctx.save(); ctx.clip(); ctx.translate(-cx, -cy); picture(); ctx.restore();
        ctx.strokeStyle = lift ? '#f9e1b3' : '#253e526b'; ctx.lineWidth = lift ? 1.4 : 1.1; ctx.stroke();
        ctx.restore();
      }

      function lastPiece() {
        const force = phase === 2 ? pressure : phase >= 3 ? 1 : 0;
        const tilt = phase === 0 && !dragging ? -.07 : phase === 2 ? Math.sin(time * 16) * .045 * (1 - pressure) : 0;
        const raised = phase === 0 ? 6 : (1 - force) * 5;
        ctx.save(); ctx.translate(pieceX + 3, pieceY + raised + 4); ctx.rotate(tilt);
        shape(1, 2, physicalScale); ctx.fillStyle = '#07132190'; ctx.shadowColor = '#081320b0'; ctx.shadowBlur = 7; ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(pieceX, pieceY + raised); ctx.rotate(tilt);
        shape(1, 2, physicalScale); ctx.fillStyle = '#6e5e48'; ctx.fill(); ctx.restore();
        ctx.save(); ctx.translate(pieceX, pieceY); ctx.rotate(tilt);
        shape(1, 2, physicalScale); ctx.save(); ctx.clip();
        ctx.translate(-target.x, -target.y); picture(); ctx.restore();
        ctx.strokeStyle = phase === 0 ? '#f3dbaf' : phase >= 3 ? '#efe0b9' : '#e5b27b';
        ctx.lineWidth = phase === 0 ? 1.5 : 2;
        ctx.stroke(); ctx.restore();
        if ((phase === 1 || phase === 2) && pressure < .7) {
          // Four tiny contact glints show cardboard meeting cardboard.
          const pulse = .55 + Math.sin(time * 4) * .15;
          ctx.globalAlpha = pulse;
          for (const [x, y, dir] of [[171, 115, -1], [249, 156, 1]]) {
            line(x, y, x + dir * 6, y - 5, '#f3b278', 1.5);
            line(x + dir * 2, y + 6, x + dir * 9, y + 6, '#f3b278', 1.5);
          }
          ctx.globalAlpha = 1;
        }
      }

      return {
        down(p) {
          if (phase === 0 && Math.hypot(p.x - pieceX, p.y - pieceY) < 53) {
            dragging = true; grabX = p.x - pieceX; grabY = p.y - pieceY; api.tone(510, .04, .015);
          } else if ((phase === 1 || phase === 2) && Math.hypot(p.x - target.x, p.y - target.y) < 49) {
            pressing = true; phase = 2;
            api.say('The picture lines up. The edges do not. Keep pressing.');
          }
        },
        move(p) {
          if (phase === 0 && dragging) {
            pieceX = clamp(p.x - grabX, 43, 435); pieceY = clamp(p.y - grabY, 53, 211);
          } else if (phase === 2 && pressing && Math.hypot(p.x - target.x, p.y - target.y) > 65) pressing = false;
        },
        up() {
          if (phase === 0 && dragging) {
            if (Math.hypot(pieceX - target.x, pieceY - target.y) < 32) {
              pieceX = target.x; pieceY = target.y; phase = 1; pictureAligned = true; placementPulse = .6;
              api.say('Exactly the right picture. Just a little too much piece. Press it down.');
              api.tone(275, .1, .025);
            } else { pieceX = origin.x; pieceY = origin.y; api.say('The lighthouse belongs in the one remaining gap.'); }
          }
          dragging = false; pressing = false;
        },
        cancel() {
          dragging = pressing = false;
          if (phase === 0) { pieceX = origin.x; pieceY = origin.y; }
        },
        update(dt) {
          time += dt; placementPulse = Math.max(0, placementPulse - dt);
          if (phase === 2) {
            pressure = clamp(pressure + dt * (pressing ? .5 : -.8), 0, 1);
            neighborLift = clamp((pressure - .46) / .54, 0, 1);
            if (pressure === 0 && !pressing) phase = 1;
            if (pressure >= 1) {
              phase = 3; neighborLift = 1; pressing = false;
              api.say('It is down. Everything around it is up.'); api.tone(160, .16, .035);
            }
          } else if (phase === 3) {
            settle += dt;
            if (settle >= .6 && !finished) { phase = 4; finished = true; api.done(); }
          }
        },
        draw() {
          rect(0, 0, 480, 270, '#243441');
          for (let x = 0; x < 480; x += 69) {
            rect(x, 0, 67, 270, x % 2 ? '#293b49' : '#2c3e4b');
            line(x + 5, 0, x + 5, 270, '#7f8a8820', 1);
          }
          round(20, 34, 309, 207, 7, '#0d1d2a80');
          round(23, 32, 302, 207, 5, '#92765b');
          round(27, 36, 294, 199, 2, '#493f39');
          // The only opening is an actual puzzle silhouette, not a rectangular slot.
          ctx.save(); ctx.translate(target.x, target.y); shape(1, 2);
          ctx.fillStyle = '#172b3b'; ctx.fill(); ctx.strokeStyle = '#0a1c28'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
          for (let index = 0; index < 12; index++) {
            if (index !== 6 && !(neighborLift > 0 && neighbors.includes(index))) boardPiece(index);
          }
          if (phase === 0) {
            ctx.save(); ctx.translate(target.x, target.y); shape(1, 2);
            ctx.strokeStyle = '#9ca8a182'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]); ctx.stroke(); ctx.restore();
          }
          lastPiece();
          if (neighborLift > 0) for (const index of neighbors) boardPiece(index, neighborLift);
          if (phase === 0 && !dragging) {
            ctx.save(); ctx.setLineDash([3, 6]); line(350, 136, 274, 136, '#c9d4be80', 1.5); ctx.restore();
            line(280, 131, 273, 136, '#c9d4be', 1.5); line(280, 141, 273, 136, '#c9d4be', 1.5);
          }
          // The abandoned box carries a tiny version of the finished picture.
          round(350, 205, 108, 40, 4, '#101e2c90');
          round(347, 201, 108, 40, 4, '#829189');
          round(351, 205, 100, 31, 2, '#d6ccad');
          rect(356, 210, 26, 21, '#67929c'); rect(356, 210, 26, 9, '#ebc7a5');
          poly([[365, 229], [369, 213], [373, 213], [377, 229]], '#f8e6bf');
          poly([[367, 214], [371, 210], [375, 214]], '#ad6e5b');
          text('SEA LIGHT', 416, 219, 8, '#3c555e');
          text('12 pieces', 416, 230, 7, '#586b70');
          text(phase === 0 ? 'ONE TO GO' : phase < 3 ? 'SO CLOSE' : 'TA-DA…?', 396, 63, 11, '#e8d4ad');
          if (phase === 1 || phase === 2) {
            // A small fingertip pictogram makes the second gesture discoverable.
            round(383, 91, 16, 36, 8, '#d7c3a2');
            round(376, 111, 30, 23, 9, '#d7c3a2');
            round(399, 108, 8, 20, 4, '#c9b18f');
            line(382, 115, 382, 123, '#a58b6e', 1.2);
            line(389, 118, 389, 126, '#a58b6e', 1.2);
            line(396, 118, 396, 126, '#a58b6e', 1.2);
            line(385, 106, 396, 106, '#b29a7c', 1);
            line(391, 141, 391, 151, '#e9cf9b', 2);
            line(386, 147, 391, 153, '#e9cf9b', 2); line(396, 147, 391, 153, '#e9cf9b', 2);
            text('PRESS & HOLD', 394, 174, 9, '#e9d8b6');
            round(357, 183, 76, 5, 2, '#172a37');
            if (pressure > 0) round(357, 183, Math.max(2, 76 * pressure), 5, 2, '#e9b47a');
          }
          if (phase >= 3) {
            for (const [x, y] of [[166, 102], [259, 103], [170, 177], [258, 177]]) {
              line(x, y, x + (x < 210 ? -6 : 6), y - 7, '#efcc8a', 1.5);
            }
            text('IT WENT IN.', 396, 116, 10, '#e8d4ad');
            text('They came up.', 396, 134, 9, '#b9c6bf');
          }
          if (placementPulse > 0) {
            ctx.save(); ctx.globalAlpha = placementPulse * .5;
            ctx.translate(target.x, target.y); shape(1, 2, physicalScale + .03);
            ctx.strokeStyle = '#ffe5af'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
          }
          text(phase === 0 ? 'The last little piece.' : phase < 3 ? 'Perfect picture. Imperfect fit.' : 'One piece down. Four pieces up.', 175, 257, 10, '#e0d1b6');
        },
        debug() {
          return {
            phase, dragging, pressing, pressure, pictureAligned,
            physicalScale, gapScale: 1, artworkScale: 1,
            piece: { x: pieceX, y: pieceY },
            neighborLift, liftedNeighbors: neighborLift > 0 ? neighbors.length : 0,
            finished,
          };
        },
      };
    },
  });
})();
