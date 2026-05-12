import ColorSwatches from "./ColorSwatches";

export default function SetupTab({
  players,
  tableMode = false,
  onToggleTableMode,
  onSetPlayerCount,
  onUpdatePlayer,
  onAskResetSetup,
}) {
  const usedColors = players.map((p) => p.color);
  const canUseTableMode = players.length === 2;

  return (
    <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-black">Setup</h2>

        <select
          value={players.length}
          onChange={(event) => onSetPlayerCount(Number(event.target.value))}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 font-bold outline-none"
        >
          {[2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} players
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onAskResetSetup}
          className="rounded-2xl border border-red-400/40 bg-red-500/20 px-4 py-2 font-black text-red-100"
        >
          Reset
        </button>
      </div>

      {canUseTableMode && (
        <button
          type="button"
          onClick={onToggleTableMode}
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-black ${
            tableMode
              ? "border-cyan-300 bg-cyan-400 text-slate-950"
              : "border-slate-700 bg-slate-950 text-slate-300"
          }`}
        >
          Table Mode: {tableMode ? "On" : "Off"}
        </button>
      )}

      <div className="mt-4 grid min-h-0 gap-3 overflow-y-auto pr-1 pb-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="max-h-30 rounded-2xl bg-slate-950 p-3"
          >
            <input
              value={player.name}
              onFocus={(event) => event.target.select()}
              onChange={(event) =>
                onUpdatePlayer(player.id, { name: event.target.value })
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") event.target.blur();
              }}
              className="w-full bg-transparent text-center text-xl font-bold uppercase tracking-wide text-slate-400 outline-none placeholder:text-slate-600 focus:text-cyan-300"
              placeholder={`Player ${index + 1}`}
              aria-label={`Player ${index + 1} name`}
            />

            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <ColorSwatches
                player={player}
                usedColors={usedColors}
                onSelectColor={(color) => onUpdatePlayer(player.id, { color })}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}