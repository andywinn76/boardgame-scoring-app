import ScoreButton from "./ScoreButton";
import { getColorClasses } from "../data/colors.js";

export default function ScoreTab({
  players,
  tableMode = false,
  onToggleTableMode,
  onAdjustScore,
  onAskReset,
  onUpdatePlayer,
}) {
  const allZero = players.every((p) => p.score === 0);
  const compactMode = players.length >= 3;
  const denseMode = players.length >= 5;
  const isTableMode = players.length === 2 && tableMode;

  return (
    <section
      className={`mt-3 flex min-h-0 flex-1 flex-col ${
        denseMode ? "gap-1.5" : "gap-3"
      }`}
    >
      {players.length === 2 && !isTableMode && (
        <button
          type="button"
          onClick={onToggleTableMode}
          className="shrink-0 rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-base font-black text-slate-300"
        >
          Table Mode: Off
        </button>
      )}

      <div
        className={`grid min-h-0 flex-1 grid-cols-1 ${
          denseMode ? "gap-1.5" : "gap-3"
        } ${
          players.length === 2
            ? isTableMode
              ? "auto-rows-[minmax(0,50vh)]"
              : "content-start auto-rows-[minmax(0,30vh)]"
            : ""
        }`}
      >
        {players.map((player, index) => (
          <article
            key={player.id}
            className={`flex min-h-0 flex-col overflow-hidden border-2 shadow-xl ${
              denseMode
                ? "rounded-2xl p-1.5"
                : compactMode
                  ? "rounded-3xl p-2"
                  : "rounded-3xl p-3"
            } ${getColorClasses(player.color)}`}
          >
            <div
              className={`mx-auto flex min-h-0 flex-1 flex-col ${
                isTableMode
                  ? index === 0
                    ? "w-[50vh] rotate-90"
                    : "w-[50vh] -rotate-90"
                  : "w-full"
              }`}
            >
              <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] text-center">
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
                      denseMode
                        ? "text-4xl"
                        : compactMode
                          ? "text-5xl"
                          : "text-6xl"
                    } w-full bg-transparent text-center font-black leading-none tracking-tight outline-none`}
                    aria-label={`${player.name} score`}
                  />
                </div>
              </div>

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
            </div>
          </article>
        ))}
      </div>

      {!isTableMode && (
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
      )}
    </section>
  );
}
