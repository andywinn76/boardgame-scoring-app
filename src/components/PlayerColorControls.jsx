import ColorPicker from "./ColorPicker";
import { normalizeHex } from "../data/colors.js";

/**
 * Pair of color pickers (Background + Text) bound to a single player.
 *
 * Designed to be reusable: drop it inside a SetupTab card, a ScoreTab
 * card, or any other place that needs per-player color editing.
 *
 * Props:
 * - player: the player object (must have bgColor, textColor)
 * - allPlayers: optional full list of players. Used to enforce unique
 *               background colors across players. If omitted, no
 *               uniqueness check is performed.
 * - onUpdate: (updates) => void. Called with partial updates, e.g.
 *             { bgColor: "#abc123" } — exactly matches the existing
 *             updatePlayer signature in App.jsx so it can be wired up
 *             with `(updates) => onUpdatePlayer(player.id, updates)`.
 * - size: forwarded to ColorPicker
 */
export default function PlayerColorControls({
  player,
  allPlayers = null,
  onUpdate,
  size = "md",
}) {
  // Background colors used by OTHER players, for uniqueness enforcement.
  const disallowedBg = allPlayers
    ? allPlayers
        .filter((other) => other.id !== player.id)
        .map((other) => normalizeHex(other.bgColor))
    : [];

  return (
    <div className="flex items-center justify-center gap-6">
      <ColorPicker
        value={player.bgColor}
        onChange={(bgColor) => onUpdate({ bgColor })}
        disallowedColors={disallowedBg}
        ariaLabel={`Background color for ${player.name}`}
        size={size}
        variant="paint-bucket"
      />

      <ColorPicker
        value={player.textColor}
        onChange={(textColor) => onUpdate({ textColor })}
        ariaLabel={`Text color for ${player.name}`}
        size={size}
        variant="text-icon"
      />
    </div>
  );
}
