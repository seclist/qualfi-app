"use client";

import { type CSSProperties, useRef, useState } from "react";

export interface SliderProps {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

/**
 * Wabi Sabi Interactive Range Slider
 * - Rule 5: Stretch moving knobs by 12% (`scaleX: 1.12, scaleY: 0.92`) while held/moving.
 * - Rule 14: Do not tween while an item is held (`transition: "none"` during active drag).
 * - Rule 19: Allow elements to rubber band past their bounds when pulled past min/max.
 */
export function Slider({
  id,
  label,
  unit,
  min,
  max,
  value,
  onChange,
  className = "bg-surface-2/40 p-4",
}: SliderProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const [isHeld, setIsHeld] = useState(false);
  const [rubberOffset, setRubberOffset] = useState(0);
  const trackRef = useRef<HTMLInputElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLInputElement>) => {
    if (!isHeld || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    if (e.clientX < rect.left) {
      const over = rect.left - e.clientX;
      setRubberOffset(-Math.log1p(over * 0.35) * 7);
    } else if (e.clientX > rect.right) {
      const over = e.clientX - rect.right;
      setRubberOffset(Math.log1p(over * 0.35) * 7);
    } else if (rubberOffset !== 0) {
      setRubberOffset(0);
    }
  };

  const releaseHold = () => {
    setIsHeld(false);
    setRubberOffset(0);
  };

  return (
    <div
      className={`rounded-2xl border border-line ${className}`}
      style={{
        transform: `translate3d(${rubberOffset}px, 0, 0)`,
        /* Rule 14: Do not tween while held; Rule 9: ease-in-out return on release */
        transition: isHeld
          ? "none"
          : "transform 0.26s cubic-bezier(0.65, 0, 0.35, 1), border-color 0.22s ease",
      }}
    >
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        <span
          className="inline-flex items-baseline rounded-lg px-1.5 py-0.5 font-mono text-lg font-bold tabular-nums text-fg"
          style={{
            /* Rule 5: Stretch moving readout/knob companion by 12% on drag */
            transform: isHeld ? "scaleX(1.12) scaleY(0.92)" : "scaleX(1) scaleY(1)",
            transition: isHeld
              ? "none"
              : "transform 0.18s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {value}
          <span className="ml-1 text-xs font-normal text-muted">{unit}</span>
        </span>
      </div>
      <input
        ref={trackRef}
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onPointerDown={() => setIsHeld(true)}
        onPointerMove={handlePointerMove}
        onPointerUp={releaseHold}
        onPointerCancel={releaseHold}
        onBlur={releaseHold}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3"
        style={
          {
            "--pct": `${pct}%`,
            transition: isHeld ? "none" : "background 0.2s cubic-bezier(0.65, 0, 0.35, 1)",
          } as CSSProperties
        }
      />
    </div>
  );
}
