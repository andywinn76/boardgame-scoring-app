import { COLOR_OPTIONS } from "../data/colors.js";

export default function ColorSwatches({ player, usedColors, onSelectColor }) {
  return (
    <div className="flex flex-wrap justify-between gap-2">
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
              isSelected
                ? "border-white ring-2 ring-cyan-300"
                : "border-slate-700"
            } ${isUsed ? "cursor-not-allowed opacity-25 grayscale" : ""}`}
          />
        );
      })}
    </div>
  );
}
