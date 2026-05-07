import { useEffect, useMemo, useState } from "react";
import SetupTab from "./components/SetupTab";
import ScoreTab from "./components/ScoreTab";
import ConfirmModal from "./components/ConfirmModal";
import { getColorClasses } from "./data/colors.js";
import { DEFAULT_PLAYERS } from "./data/data.js";
import { COLOR_OPTIONS, getLeaderTextClass } from "./data/colors.js";

const STORAGE_KEY = "boardgame-score-pad-v1";

function getFirstUnusedColor(players) {
  return (
    COLOR_OPTIONS.find(
      (color) => !players.some((player) => player.color === color.value),
    ) ?? COLOR_OPTIONS[0]
  );
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
  const [showSetupResetConfirm, setShowSetupResetConfirm] = useState(false);

  const players = appState.players;
  const activeTab = appState.activeTab;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const leader = useMemo(() => {
    // Hide leader if everyone is exactly zero
    if (players.every((p) => p.score === 0)) {
      return null;
    }

    const topScore = Math.max(...players.map((p) => p.score));

    const leaders = players.filter((p) => p.score === topScore);

    // Hide leader if tied for highest score
    if (leaders.length !== 1) {
      return null;
    }

    return leaders[0];
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
        player.id === playerId ? { ...player, ...updates } : player,
      ),
    }));
  }

  function adjustScore(playerId, amount) {
    setAppState((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId
          ? { ...player, score: player.score + amount }
          : player,
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

  function resetSetup() {
    setAppState({
      activeTab: "setup",
      players: DEFAULT_PLAYERS.map((player) => ({ ...player })),
    });
    setShowSetupResetConfirm(false);
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-full max-w-md flex-col p-3">
        <header className="shrink-0 rounded-3xl border border-slate-800 bg-slate-900 p-3 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/icons/icon-192x192.png"
                alt="EZScorepad logo"
                className="h-12 w-12 rounded-2xl"
              />

              <div>
                <h1 className="text-lg font-black leading-tight">EZScorepad</h1>

                <p className="text-xs uppercase text-slate-400">
                  {players.length} players
                  {leader && (
                    <>
                      {" · leader: "}
                      <span className={getLeaderTextClass(leader.color)}>
                        {leader.name}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex rounded-2xl bg-slate-950 p-1 text-sm font-bold">
              <button
                onClick={() => setActiveTab("score")}
                className={`rounded-xl px-3 py-2 ${
                  activeTab === "score"
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                Score
              </button>

              <button
                onClick={() => setActiveTab("setup")}
                className={`rounded-xl px-3 py-2 ${
                  activeTab === "setup"
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300"
                }`}
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
            onUpdatePlayer={updatePlayer}
            onAskReset={() => setShowResetConfirm(true)}
          />
        ) : (
          <SetupTab
            players={players}
            onSetPlayerCount={setPlayerCount}
            onUpdatePlayer={updatePlayer}
            onAskResetSetup={() => setShowSetupResetConfirm(true)}
          />
        )}
      </div>

      {showResetConfirm && (
        <ConfirmModal
          title="Reset Scores?"
          message="Reset all scores to zero."
          confirmLabel="Reset"
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={resetScores}
        />
      )}

      {showSetupResetConfirm && (
        <ConfirmModal
          title="Reset Setup?"
          message="Reset to two players and default colors."
          confirmLabel="Reset"
          onCancel={() => setShowSetupResetConfirm(false)}
          onConfirm={resetSetup}
        />
      )}
    </main>
  );
}
