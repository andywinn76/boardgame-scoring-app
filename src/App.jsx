import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "boardgame-score-pad-v1";

const COLOR_OPTIONS = [
  { name: "Red", value: "red", classes: "bg-red-500 border-red-300 text-white" },
  { name: "Blue", value: "blue", classes: "bg-blue-500 border-blue-300 text-white" },
  { name: "Green", value: "green", classes: "bg-green-500 border-green-300 text-white" },
  { name: "Yellow", value: "yellow", classes: "bg-yellow-400 border-yellow-200 text-slate-950" },
  { name: "Purple", value: "purple", classes: "bg-purple-500 border-purple-300 text-white" },
  { name: "Orange", value: "orange", classes: "bg-orange-500 border-orange-300 text-white" },
];

const DEFAULT_PLAYERS = [
  { id: "player-1", name: "Player 1", color: "red", score: 0 },
  { id: "player-2", name: "Player 2", color: "blue", score: 0 },
];

function getColorClasses(color) {
  return COLOR_OPTIONS.find((option) => option.value === color)?.classes ?? COLOR_OPTIONS[0].classes;
}

function getFirstUnusedColor(players) {
  return COLOR_OPTIONS.find(
    (color) => !players.some((player) => player.color === color.value)
  ) ?? COLOR_OPTIONS[0];
}

function makePlayer(index, existingPlayers = []) {
  const color = getFirstUnusedColor(existingPlayers);

  return {
    id: crypto.randomUUID(),
    name: `Player ${index + 1}`,
    color: color.value,
    score: 0,
  };
}

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Fall back to defaults if saved data is broken or unavailable.
  }

  return {
    activeTab: "score",
    players: DEFAULT_PLAYERS,
  };
}

export default function App() {
  const [appState, setAppState] = useState(getInitialState);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const players = appState.players;
  const activeTab = appState.activeTab;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const leader = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score)[0];
  }, [players]);

  function setActiveTab(activeTab) {
    setAppState((current) => ({ ...current, activeTab }));
  }

  function setPlayerCount(count) {
    setAppState((current) => {
      const nextPlayers = [...current.players];

      while (nextPlayers.length < count) {
        nextPlayers.push(makePlayer(nextPlayers.length, nextPlayers));
      }

      return {
        ...current,
        players: nextPlayers.slice(0, count),
      };
    });
  }

  function updatePlayer(playerId, updates) {
    setAppState((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      ),
    }));
  }

  function adjustScore(playerId, amount) {
    setAppState((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId ? { ...player, score: player.score + amount } : player
      ),
    }));
  }

  function resetScores() {
    setAppState((current) => ({
      ...current,
      players: current.players.map((player) => ({ ...player, score: 0 })),
    }));
    setShowResetConfirm(false);
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-full max-w-md flex-col p-3">
        <header className="shrink-0 rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-black leading-tight">Score Pad</h1>
              <p className="text-xs text-slate-400 uppercase">
                {players.length} players · leader: {leader?.name ?? "—"}
              </p>
            </div>

            <div className="flex rounded-2xl bg-slate-950 p-1 text-sm font-bold">
              <button
                onClick={() => setActiveTab("score")}
                className={`rounded-xl px-3 py-2 ${activeTab === "score" ? "bg-cyan-400 text-slate-950" : "text-slate-300"}`}
              >
                Score
              </button>
              <button
                onClick={() => setActiveTab("setup")}
                className={`rounded-xl px-3 py-2 ${activeTab === "setup" ? "bg-cyan-400 text-slate-950" : "text-slate-300"}`}
              >
                Setup
              </button>
            </div>
          </div>
        </header>

        {activeTab === "score" ? (
          <ScoreTab
            players={players}
            onAdjustScore={adjustScore}
            onAskReset={() => setShowResetConfirm(true)}
          />
        ) : (
          <SetupTab players={players} onSetPlayerCount={setPlayerCount} onUpdatePlayer={updatePlayer} />
        )}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <h2 className="text-xl font-black">Reset all scores?</h2>
            <p className="mt-2 text-sm text-slate-300">
              This will set every player back to zero. Player names and colors will stay the same.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-2xl bg-slate-700 px-4 py-3 font-bold text-slate-100"
              >
                Cancel
              </button>
              <button onClick={resetScores} className="rounded-2xl bg-red-500 px-4 py-3 font-bold text-white">
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ColorSwatches({ player, usedColors, onSelectColor }) {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {COLOR_OPTIONS.map((color) => {
        const isSelected = player.color === color.value;
        const isUsed = usedColors.includes(color.value) && !isSelected;

        return (
          <button
            key={color.value}
            type="button"
            disabled={isUsed}
            onClick={() => onSelectColor(color.value)}
            title={isUsed ? `${color.name} is already in use` : color.name}
            aria-label={`Choose ${color.name}`}
            className={`h-10 w-10 rounded-full border-4 transition-transform active:scale-95 ${color.classes} ${
              isSelected ? "border-white ring-2 ring-cyan-300" : "border-slate-700"
            } ${isUsed ? "cursor-not-allowed opacity-25 grayscale" : ""}`}
          />
        );
      })}
    </div>
  );
}

function ScoreTab({ players, onAdjustScore, onAskReset }) {
  const allZero = players.every((p) => p.score === 0);
  const compactMode = players.length >= 3;
  const denseMode = players.length >= 5;
  return (
    <section className={`mt-3 flex min-h-0 flex-1 flex-col ${denseMode ? "gap-1.5" : "gap-3"}`}>
      <div className={`grid min-h-0 flex-1 grid-cols-1 ${denseMode ? "gap-1.5" : "gap-3"}`}>
        {players.map((player) => (
          <article
            key={player.id}
            className={`grid min-h-0 grid-cols-[auto_1fr_auto] items-center border-2 shadow-xl ${denseMode ? "gap-1.5 rounded-2xl p-1.5" : compactMode ? "gap-2 rounded-3xl p-2" : "gap-3 rounded-3xl p-3"} ${getColorClasses(player.color)}`}
          >
            <div className={`grid ${denseMode ? "gap-1" : "gap-2"}`}>
              <ScoreButton compact={compactMode} dense={denseMode} label="-1" onClick={() => onAdjustScore(player.id, -1)} />
              <ScoreButton compact={compactMode} dense={denseMode} label="-5" onClick={() => onAdjustScore(player.id, -5)} />
            </div>

            <div className="min-w-0 text-center">
              <p className={`${denseMode ? "text-xs" : compactMode ? "text-sm" : "text-base"} uppercase truncate font-black leading-tight`}>{player.name}</p>
              <p className={`${denseMode ? "text-4xl" : compactMode ? "text-5xl" : "text-6xl"} uppercase font-black leading-none tracking-tight`}>{player.score}</p>
            </div>

            <div className={`grid ${denseMode ? "gap-1" : "gap-2"}`}>
              <ScoreButton compact={compactMode} dense={denseMode} label="+1" onClick={() => onAdjustScore(player.id, 1)} />
              <ScoreButton compact={compactMode} dense={denseMode} label="+5" onClick={() => onAdjustScore(player.id, 5)} />
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={onAskReset}
        disabled={allZero}
        className={`shrink-0 rounded-3xl border px-4 ${denseMode ? "py-1.5 text-sm" : "py-3 text-base"} font-black ${allZero ? "border-slate-700 bg-slate-800 text-slate-500" : "border-red-400/40 bg-red-500/20 text-red-100"}`}
      >
        Reset scores
      </button>
    </section>
  );
}

function ScoreButton({ label, onClick, compact = false, dense = false }) {
  const sizeClasses = dense ? "h-8 w-12 text-base rounded-xl" : compact ? "h-11 w-14 text-lg rounded-2xl" : "h-14 w-16 text-xl rounded-2xl";

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} bg-black/30 font-black shadow-lg backdrop-blur transition-transform active:scale-95`} 
    >
      {label}
    </button>
  );
}

function SetupTab({ players, onSetPlayerCount, onUpdatePlayer }) {
  const usedColors = players.map((p) => p.color);

  return (
    <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Setup</h2>
          <p className="text-xs text-slate-400">Names, colors, and number of players.</p>
        </div>

        <select
          value={players.length}
          onChange={(event) => onSetPlayerCount(Number(event.target.value))}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 font-bold outline-none"
        >
          {[2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} players
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid min-h-0 flex-1 gap-3 overflow-y-auto pr-1 pb-2">
        {players.map((player, index) => (
          <div key={player.id} className="rounded-2xl bg-slate-950 p-3">
            <input
              value={player.name}
              onFocus={(event) => event.target.select()}
              onChange={(event) => onUpdatePlayer(player.id, { name: event.target.value })}
              className="w-full bg-transparent text-sm font-bold uppercase tracking-wide text-slate-400 outline-none placeholder:text-slate-600 focus:text-cyan-300"
              placeholder={`Player ${index + 1}`}
              aria-label={`Player ${index + 1} name`}
            />

            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              {/* <p className="min-w-0 truncate text-2xl font-black">{player.name || `Player ${index + 1}`}</p> */}

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
