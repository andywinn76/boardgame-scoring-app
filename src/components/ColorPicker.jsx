import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { normalizeHex } from "../data/colors.js";
import { BsPaintBucket } from "react-icons/bs";
import { MdOutlineTextFields } from "react-icons/md";

/**
 * Reusable color picker.
 *
 * Clicking the icon opens a portal-rendered popover containing a
 * react-colorful HexColorPicker plus a hex text input. The popover
 * closes on outside click or Escape.
 *
 * Props:
 * - value: current hex color (e.g. "#ef4444")
 * - onChange: (hex) => void, called as the user picks a new color
 * - label: optional small caption above the swatch
 * - disallowedColors: array of hex values to reject (useful for
 *                    enforcing unique colors across players)
 * - ariaLabel: accessibility label for the trigger button
 * - size: "sm" | "md" | "lg"
 * - variant: "circle" (default) | "letter" | "paint-bucket" | "text-icon"
 * - letter: character to display when variant="letter" (default "T")
 */
export default function ColorPicker({
  value,
  onChange,
  label,
  disallowedColors = [],
  ariaLabel,
  size = "md",
  variant = "circle",
  letter = "T",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [conflict, setConflict] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const normalizedValue = normalizeHex(value);
  const normalizedDisallowed = disallowedColors.map(normalizeHex);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  const letterSizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  }[size];

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!isOpen) return;

    function handleOutside(event) {
      const target = event.target;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  function openPicker() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 224;
      const popoverHeight = 260;

      // Prefer below the icon; flip above if no room.
      let top = rect.bottom + 8;
      if (top + popoverHeight > window.innerHeight) {
        top = Math.max(8, rect.top - popoverHeight - 8);
      }

      // Center horizontally on the icon, clamp to viewport.
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      left = Math.max(
        8,
        Math.min(left, window.innerWidth - popoverWidth - 8),
      );

      setPosition({ top, left });
    }
    setIsOpen(true);
  }

  function handleColorChange(nextColor) {
    const normalized = normalizeHex(nextColor);
    if (normalized === normalizedValue) return;
    if (normalizedDisallowed.includes(normalized)) {
      setConflict(true);
      return;
    }
    setConflict(false);
    onChange(normalized);
  }

  function renderTrigger() {
    const base = `${sizeClasses} relative flex cursor-pointer items-center justify-center transition-transform active:scale-95`;
    const aria = ariaLabel ?? label ?? "Choose color";

    if (variant === "letter") {
      return (
        <button
          ref={buttonRef}
          type="button"
          onClick={openPicker}
          className={base}
          aria-label={aria}
        >
          <span
            className={`${letterSizeClasses} font-black leading-none`}
            style={{
              color: normalizedValue,
              WebkitTextStroke: "1px black",
              filter: "drop-shadow(0 0 2px white)",
            }}
          >
            {letter}
          </span>
        </button>
      );
    }

    if (variant === "paint-bucket") {
      return (
        <button
          ref={buttonRef}
          type="button"
          onClick={openPicker}
          className={base}
          aria-label={aria}
        >
          <BsPaintBucket
            size="70%"
            color="black"
            style={{ filter: "drop-shadow(0 0 2px white)" }}
          />
        </button>
      );
    }

    if (variant === "text-icon") {
      return (
        <button
          ref={buttonRef}
          type="button"
          onClick={openPicker}
          className={base}
          aria-label={aria}
        >
          <MdOutlineTextFields
            size="70%"
            color="black"
            style={{ filter: "drop-shadow(0 0 2px white)" }}
          />
        </button>
      );
    }

    // default: "circle"
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={openPicker}
        className={`${sizeClasses} inline-block cursor-pointer rounded-full border-2 border-black shadow-inner transition-transform active:scale-95`}
        style={{ backgroundColor: normalizedValue }}
        aria-label={aria}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>
      )}

      {renderTrigger()}

      {conflict && (
        <span className="mt-0.5 text-[10px] font-semibold text-red-300">
          Select another color
        </span>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl"
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: 224,
              zIndex: 50,
            }}
          >
            <HexColorPicker
              color={normalizedValue}
              onChange={handleColorChange}
              style={{ width: "100%", height: 160 }}
            />

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">#</span>
              <HexColorInput
                color={normalizedValue}
                onChange={handleColorChange}
                prefixed={false}
                className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm uppercase text-slate-100 outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-auto rounded-md bg-cyan-500 px-3 py-1 text-xs font-black text-slate-950"
              >
                Done
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
