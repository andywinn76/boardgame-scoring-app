import ScoreButton from "./ScoreButton";

export default function ScoreTab({
  players,
  tableMode = false,
  onAdjustScore,
  onAskReset,
  onUpdatePlayer,
}) {
  // Used to disable the reset button when nobody has scored yet.
  const allZero = players.every((p) => p.score === 0);

  // Compact modes help squeeze the UI down as player count increases.
  const compactMode = players.length >= 3;
  const denseMode = players.length >= 5;

  // Table mode is only intended for exactly 2 players.
  const isTableMode = players.length === 2 && tableMode;

  /**
   * TABLE MODE (or TWO PLAYER MODE) CARD
   *
   * Table mode assumes the PHONE is physically rotated sideways
   * and placed between two players.
   *
   * The cards remain stacked vertically in portrait mode,
   * but after physically rotating the phone they appear left/right.
   *
   * Important:
   * - The CARD itself is NOT rotated.
   * - Only the INNER CONTENT rotates.
   * - Using CSS Grid here was much more stable than flexbox.
   */
  function renderTableModeCard(player, index) {
    // Rotate each player's content toward them.
    const rotationClass = index === 0 ? "rotate-90" : "-rotate-90";

    return (
      <article
        key={player.id}
        className="relative min-h-0 overflow-hidden rounded-3xl border-2 border-black/20 shadow-xl"
        style={{
          backgroundColor: player.bgColor,
          color: player.textColor,
        }}
      >
        {/* 
          Rotated inner content container.

          This is absolutely positioned and centered so rotation
          does not affect outer layout flow.
        */}
        <div
          className={`absolute left-1/2 top-1/2 grid
            h-[calc(100vw-3rem)]
            max-h-[26rem]
            w-[clamp(10rem,calc((100dvh-15rem)/2),16rem)]
            -translate-x-1/2 -translate-y-1/2
            grid-rows-[auto_1fr_auto]
            place-items-center
            gap-2
            ${rotationClass}`}
        >
          {/* Player Name */}
          <input
            value={player.name}
            onFocus={(event) => event.target.select()}
            onChange={(event) =>
              onUpdatePlayer(player.id, { name: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") event.target.blur();
            }}
            className="w-full bg-transparent text-center text-xl mt-10 font-black uppercase leading-tight outline-none focus:text-cyan-300"
            placeholder={`Player ${index + 1}`}
            aria-label={`Player ${index + 1} name`}
          />

          {/* Score Display */}
          <input
            type="number"
            value={player.score}
            onFocus={(event) => event.target.select()}
            onChange={(event) =>
              onUpdatePlayer(player.id, {
                score: Number(event.target.value) || 0,
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") event.target.blur();
            }}
            className="w-full bg-transparent text-center text-6xl font-black leading-none tracking-tight outline-none"
            aria-label={`${player.name} score`}
          />

          {/* 
            Table mode uses ONE centered button row.

            Splitting negative/positive buttons left/right
            became visually confusing once rotated.
          */}
          <div className="grid w-full grid-cols-4 gap-2.5 mb-4">
            <ScoreButton
              label="-5"
              compact={true}
              onClick={() => onAdjustScore(player.id, -5)}
            />
            <ScoreButton
              label="-1"
              compact={true}  
              onClick={() => onAdjustScore(player.id, -1)}
            />
            <ScoreButton
              label="+1"
              compact={true}
              onClick={() => onAdjustScore(player.id, 1)}
            />
            <ScoreButton
              label="+5"
              compact={true}
              onClick={() => onAdjustScore(player.id, 5)}
            />
          </div>
        </div>
      </article>
    );
  }

  /**
   * NORMAL CARD
   *
   * Standard portrait score card layout.
   * This keeps the original flexbox layout and split button groups.
   */
  function renderNormalCard(player, index) {
    return (
      <article
        key={player.id}
        className={`flex min-h-0 flex-col border-2 border-black/20 shadow-xl ${
          denseMode
            ? "rounded-2xl p-1.5"
            : compactMode
              ? "rounded-3xl p-2"
              : "rounded-3xl p-3"
        }`}
        style={{
          backgroundColor: player.bgColor,
          color: player.textColor,
        }}
      >
        <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] text-center">
          {/* Player Name */}
          <input
            value={player.name}
            onFocus={(event) => event.target.select()}
            onChange={(event) =>
              onUpdatePlayer(player.id, { name: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") event.target.blur();
            }}
            className={`${
              denseMode ? "text-sm" : compactMode ? "text-lg" : "text-xl"
            } mt-4 w-full bg-transparent text-center font-black uppercase leading-tight outline-none focus:text-cyan-300`}
            placeholder={`Player ${index + 1}`}
            aria-label={`Player ${index + 1} name`}
          />

          {/* Score */}
          <div className="grid place-items-center">
            <input
              type="number"
              value={player.score}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                onUpdatePlayer(player.id, {
                  score: Number(event.target.value) || 0,
                })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") event.target.blur();
              }}
              className={`${
                denseMode ? "text-4xl" : compactMode ? "text-5xl" : "text-6xl"
              } w-full bg-transparent text-center font-black leading-none tracking-tight outline-none`}
              aria-label={`${player.name} score`}
            />
          </div>
        </div>

        {/* 
          Split negative/positive button groups work well
          in standard portrait orientation.
        */}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className={`flex ${denseMode ? "gap-1" : "gap-2"}`}>
            <ScoreButton
              compact={compactMode}
              dense={denseMode}
              label="-5"
              onClick={() => onAdjustScore(player.id, -5)}
            />
            <ScoreButton
              compact={compactMode}
              dense={denseMode}
              label="-1"
              onClick={() => onAdjustScore(player.id, -1)}
            />
          </div>

          <div className={`flex ${denseMode ? "gap-1" : "gap-2"}`}>
            <ScoreButton
              compact={compactMode}
              dense={denseMode}
              label="+1"
              onClick={() => onAdjustScore(player.id, 1)}
            />
            <ScoreButton
              compact={compactMode}
              dense={denseMode}
              label="+5"
              onClick={() => onAdjustScore(player.id, 5)}
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <section
      className={`mt-3 flex min-h-0 flex-1 flex-col ${
        denseMode ? "gap-1.5" : "gap-3"
      }`}
    >
      {/* 
        Main score card area.

        Table mode:
        - 2 stacked rows in portrait
        - becomes side-by-side after physically rotating the phone

        Normal mode:
        - standard stacked cards
      */}
      <div
        className={`grid min-h-0 flex-1 ${
          isTableMode
            ? "grid-cols-1 grid-rows-2 gap-3"
            : `grid-cols-1 ${denseMode ? "gap-1.5" : "gap-3"} ${
                players.length === 2
                  ? "content-start auto-rows-[minmax(0,30vh)]"
                  : ""
              }`
        }`}
      >
        {players.map((player, index) =>
          isTableMode
            ? renderTableModeCard(player, index)
            : renderNormalCard(player, index),
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onAskReset}
        disabled={allZero}
        className={`shrink-0 rounded-3xl border px-4 ${
          denseMode ? "py-1.5 text-sm" : "py-3 text-base"
        } font-black ${
          allZero
            ? "border-slate-700 bg-slate-800 text-slate-500"
            : "border-red-400/40 bg-red-500/20 text-red-100"
        }`}
      >
        Reset scores
      </button>
    </section>
  );
}