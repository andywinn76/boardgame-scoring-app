export default function ScoreButton({ label, onClick, compact = false, dense = false }) {
  const sizeClasses = dense
    ? "h-8 w-12 text-base rounded-xl"
    : compact
      ? "h-11 w-14 text-lg rounded-2xl"
      : "h-14 w-16 text-xl rounded-2xl";

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} bg-black/30 font-black shadow-lg backdrop-blur transition-transform active:scale-95`}
    >
      {label}
    </button>
  );
}