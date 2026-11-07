"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { EASING, playSensoryFeedback } from "@/lib/design-system";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  className?: string;
  fillClassName?: string;
  knobClassName?: string;
  knobSize?: number;
}

/**
 * Science-Backed Draggable Knob Component:
 * - Principle 5 (Target Scaling / Fitts's Law): Minimum 48px touch zone around handle.
 * - Principle 6 (Instant Feedback / Jakob Nielsen): Synchronous <50ms value dispatch.
 * - Principle 11 (Follow Through): Subtle spring settling upon pointer release.
 * - Principle 18 (Squash & Stretch / Disney): 12% horizontal elongation during active drag.
 * - Principle 30 (Speed Threshold / Doherty Threshold): Immediate tactile response.
 */
export function Knob({
  value,
  min,
  max,
  onChange,
  className = "",
  fillClassName = "bg-[#b5654a]",
  knobClassName = "bg-[#231d17]",
  knobSize = 32,
}: KnobProps) {
  const track = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => Math.max(0, v + knobSize / 2));
  const valueRef = useRef(value);
  const lastEmittedValue = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const updateSize = () => {
      const w = el.offsetWidth - knobSize;
      setWidth(w);
      x.set(((valueRef.current - min) / (max - min)) * w);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, max, knobSize, x]);

  // Sync position if external value changes without active drag
  useEffect(() => {
    if (width > 0) {
      const targetX = ((value - min) / (max - min)) * width;
      x.set(targetX);
    }
  }, [value, min, max, width, x]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!el || width <= 0) return;
    const rect = el.getBoundingClientRect();
    const clickX = e.clientX - rect.left - knobSize / 2;
    const clampedX = Math.max(0, Math.min(width, clickX));
    const t = clampedX / width;
    const computed = Math.round(min + t * (max - min));
    x.set(clampedX);
    lastEmittedValue.current = computed;
    onChange(computed);
    playSensoryFeedback("tap");
  };

  return (
    <div
      ref={track}
      onClick={handleTrackClick}
      className={`relative touch-none select-none py-3 cursor-pointer ${className}`}
      style={{ minHeight: 48 }} // Fitts's Law minimum 48px touch target
    >
      {/* Background Track Groove */}
      <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-[#231d17]/10" />

      {/* Active Fill Track */}
      <motion.div
        className={`absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full ${fillClassName}`}
        style={{ width: fill }}
      />

      {/* Interactive Handle with 48px target zone, Squash & Stretch and Spring Follow-Through */}
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label="Adjust value"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(e) => {
          let nextVal = value;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            nextVal = Math.min(max, value + 1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            nextVal = Math.max(min, value - 1);
          } else if (e.key === "PageUp") {
            nextVal = Math.min(max, value + 5);
          } else if (e.key === "PageDown") {
            nextVal = Math.max(min, value - 5);
          } else if (e.key === "Home") {
            nextVal = min;
          } else if (e.key === "End") {
            nextVal = max;
          } else {
            return;
          }
          e.preventDefault();
          lastEmittedValue.current = nextVal;
          onChange(nextVal);
          playSensoryFeedback("tap");
        }}
        drag="x"
        dragConstraints={{ left: 0, right: width }}
        dragElastic={0.16} // Rubber-banding past bounds
        dragMomentum={false}
        style={{
          x,
          width: knobSize,
          height: knobSize,
          top: "50%",
          marginTop: -knobSize / 2,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scaleY: 0.94, scaleX: 1.04 }} // Subtle press compression
        whileDrag={{
          scaleX: 1.12, // Exact 12% stretch during active drag (Principle 18)
          scaleY: 0.92,
          cursor: "grabbing",
        }}
        transition={{
          duration: 0.16,
          ease: EASING.naturalOut,
        }}
        onDragStart={() => playSensoryFeedback("tap")}
        onDrag={() => {
          const t = Math.max(0, Math.min(1, x.get() / (width || 1)));
          const computed = Math.round(min + t * (max - min));
          if (computed !== lastEmittedValue.current) {
            lastEmittedValue.current = computed;
            onChange(computed);
            // Subtle click every 2kg for tactile auditory feedback (Principle 6)
            if (computed % 2 === 0) {
              playSensoryFeedback("tap");
            }
          }
        }}
        className={`absolute left-0 cursor-grab rounded-full shadow-lg ring-4 ring-white/80 focus-visible:ring-4 focus-visible:ring-[#d9532f] outline-none ${knobClassName}`}
      >
        {/* Invisible 48px Fitts's Law Touch Target */}
        <span className="absolute -inset-2.5 rounded-full" />
      </motion.div>
    </div>
  );
}
