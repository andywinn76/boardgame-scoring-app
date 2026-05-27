import { getPresetForIndex } from "./colors.js";

const DEFAULT_PLAYERS = [
  {
    id: "player-1",
    name: "Player 1",
    bgColor: getPresetForIndex(0).bg,
    textColor: getPresetForIndex(0).text,
    score: 0,
  },
  {
    id: "player-2",
    name: "Player 2",
    bgColor: getPresetForIndex(1).bg,
    textColor: getPresetForIndex(1).text,
    score: 0,
  },
];

export { DEFAULT_PLAYERS };
