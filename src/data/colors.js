/**
 * Player color presets used as defaults for slots 1-6.
 * Each entry is a { bg, text } hex pairing tuned for good contrast.
 *
 * If more than 6 players are supported in the future, slots beyond
 * the preset list cycle back to the start via getPresetForIndex.
 */
const PLAYER_COLOR_PRESETS = [
  { name: "Red", bg: "#ff0000", text: "#ffffff" },
  { name: "Blue", bg: "#002cff", text: "#ffffff" },
  { name: "Green", bg: "#00ff0b", text: "#ffffff" },
  { name: "Yellow", bg: "#fff400", text: "#0f172a" },
  { name: "Purple", bg: "#c300ff", text: "#ffffff" },
  { name: "Orange", bg: "#ff8800", text: "#ffffff" },
];

/**
 * Returns the preset for a given slot index (wraps if index exceeds presets).
 */
function getPresetForIndex(index) {
  return PLAYER_COLOR_PRESETS[index % PLAYER_COLOR_PRESETS.length];
}

/**
 * Legacy map from old swatch color names to the new hex values.
 * Used to migrate previously persisted player data in localStorage.
 */
const LEGACY_COLOR_NAME_TO_HEX = {
  red: { bg: "#ef4444", text: "#ffffff" },
  blue: { bg: "#3b82f6", text: "#ffffff" },
  green: { bg: "#22c55e", text: "#ffffff" },
  yellow: { bg: "#facc15", text: "#0f172a" },
  purple: { bg: "#a855f7", text: "#ffffff" },
  orange: { bg: "#f97316", text: "#ffffff" },
};

/**
 * Normalize a hex color to a lowercase 7-char form so #FFF / #ffffff /
 * #FFFFFF can be compared safely (uniqueness checks, etc.).
 */
function normalizeHex(hex) {
  if (typeof hex !== "string") return hex;
  let value = hex.trim().toLowerCase();
  if (!value.startsWith("#")) value = `#${value}`;
  // expand shorthand (#abc -> #aabbcc)
  if (/^#[0-9a-f]{3}$/.test(value)) {
    value = `#${value
      .slice(1)
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return value;
}

export {
  PLAYER_COLOR_PRESETS,
  getPresetForIndex,
  LEGACY_COLOR_NAME_TO_HEX,
  normalizeHex,
};
