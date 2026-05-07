const COLOR_OPTIONS = [
  {
    name: "Red",
    value: "red",
    classes: "bg-red-500 border-red-300 text-white",
  },
  {
    name: "Blue",
    value: "blue",
    classes: "bg-blue-500 border-blue-300 text-white",
  },
  {
    name: "Green",
    value: "green",
    classes: "bg-green-500 border-green-300 text-white",
  },
  {
    name: "Yellow",
    value: "yellow",
    classes: "bg-yellow-400 border-yellow-200 text-slate-950",
  },
  {
    name: "Purple",
    value: "purple",
    classes: "bg-purple-500 border-purple-300 text-white",
  },
  {
    name: "Orange",
    value: "orange",
    classes: "bg-orange-500 border-orange-300 text-white",
  },
];

const DEFAULT_PLAYERS = [
  { id: "player-1", name: "Player 1", color: "red", score: 0 },
  { id: "player-2", name: "Player 2", color: "blue", score: 0 },
];

export { COLOR_OPTIONS, DEFAULT_PLAYERS };