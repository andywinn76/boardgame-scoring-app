function getColorClasses(color) {
  return (
    COLOR_OPTIONS.find((option) => option.value === color)?.classes ??
    COLOR_OPTIONS[0].classes
  );
}

function getLeaderTextClass(color) {
  return (
    COLOR_OPTIONS.find((option) => option.value === color)?.leaderText ??
    COLOR_OPTIONS[0].leaderText
  );
}

const COLOR_OPTIONS = [
  {
    name: "Red",
    value: "red",
    classes: "bg-red-500 border-red-300 text-white",
    leaderText: "text-red-400",
  },
  {
    name: "Blue",
    value: "blue",
    classes: "bg-blue-500 border-blue-300 text-white",
    leaderText: "text-blue-400",
  },
  {
    name: "Green",
    value: "green",
    classes: "bg-green-500 border-green-300 text-white",
    leaderText: "text-green-400",
  },
  {
    name: "Yellow",
    value: "yellow",
    classes: "bg-yellow-400 border-yellow-200 text-slate-950",
    leaderText: "text-yellow-300",
  },
  {
    name: "Purple",
    value: "purple",
    classes: "bg-purple-500 border-purple-300 text-white",
    leaderText: "text-purple-400",
  },
  {
    name: "Orange",
    value: "orange",
    classes: "bg-orange-500 border-orange-300 text-white",
    leaderText: "text-orange-400",
  },
];

export { COLOR_OPTIONS, getColorClasses, getLeaderTextClass };
