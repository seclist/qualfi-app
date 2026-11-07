"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { playSensoryFeedback, triggerMobileHaptic } from "@/lib/design-system";

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
 * Science-Backed Draggable Knob / Slider Component:
 * - Full-Track Pointer Capture: Touching or dragging anywhere inside the 56px
 *   vertical hit zone immediately captures the finger and tracks smoothly.
 * - Zero Scroll Conflict: `touch-none` prevents mobile browsers from hijacking
 *   horizontal thumb movement as a vertical page scroll.
 * - Throttled Tactile Feedback: Fires subtle haptic/audio ticks without blocking
 *   the main UI thread.
 */
export function Knob({
  value,
  min,
  max,
  onChange,
  className = "",
  fillClassName = "bg-[#d9532f]",
  knobClassName = "bg-[#121316]",
  knobSize = 32,
}: KnobProps) {
  const track = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => Math.max(0, v + knobSize / 2));
  const valueRef = useRef(value);
  const lastEmittedValue = useRef(value);
  const lastHapticTime = useRef(0);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const updateSize = () => {
      const w = Math.max(0, el.offsetWidth - knobSize);
      setWidth(w);
      const clampedVal = Math.max(min, Math.min(max, valueRef.current));
      x.set(((clampedVal - min) / (max - min)) * w);
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, max, knobSize, x]);

  // Sync position when external value changes (e.g. via +/- stepper buttons)
  useEffect(() => {
    if (width > 0 && !isDragging) {
      const clampedVal = Math.max(min, Math.min(max, value));
      const targetX = ((clampedVal - min) / (max - min)) * width;
      x.set(targetX);
      lastEmittedValue.current = clampedVal;
    }
  }, [value, min, max, width, isDragging, x]);

  const updateFromClientX = (clientX: number, isInitialPress = false) => {
    const el = track.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const usableWidth = Math.max(1, rect.width - knobSize);
    const rawX = clientX - rect.left - knobSize / 2;
    const clampedX = Math.max(0, Math.min(usableWidth, rawX));
    const t = clampedX / usableWidth;
    const computed = Math.round(min + t * (max - min));

    x.set(clampedX);

    if (computed !== lastEmittedValue.current || isInitialPress) {
      lastEmittedValue.current = computed;
      onChange(computed);

      const now = performance.now();
      if (now - lastHapticTime.current > 55) {
        lastHapticTime.current = now;
        triggerMobileHaptic("light");
        if (isInitialPress || computed % 2 === 0) {
          playSensoryFeedback("tap");
        }
      }
    }
  };

  return (
    <div
      ref={track}
      role="slider"
      tabIndex={0}
      aria-label="Adjust value"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        e.preventDefault();
        e.stopPropagation();
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore if pointer capture is unsupported
        }
        setIsDragging(true);
        updateFromClientX(e.clientX, true);
      }}
      onPointerMove={(e) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        updateFromClientX(e.clientX, false);
      }}
      onPointerUp={(e) => {
        if (!isDragging) return;
        setIsDragging(false);
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
      }}
      onPointerCancel={(e) => {
        setIsDragging(false);
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
      }}
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
      className={`relative touch-none select-none py-4 cursor-pointer outline-none ${className}`}
      style={{ minHeight: 54 }}
    >
      {/* Background Track Groove (12px tall for clear visual & tactile target) */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-3 w-full -translate-y-1/2 rounded-full bg-[#231d17]/12" />

      {/* Active Fill Track */}
      <motion.div
        className={`pointer-events-none absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-full ${fillClassName}`}
        style={{ width: fill }}
      />

      {/* Interactive Handle */}
      <motion.div
        style={{
          x,
          width: knobSize,
          height: knobSize,
          top: "50%",
          marginTop: -knobSize / 2,
        }}
        animate={{
          scaleX: isDragging ? 1.12 : 1,
          scaleY: isDragging ? 0.94 : 1,
        }}
        transition={{ duration: 0.14 }}
        className={`pointer-events-none absolute left-0 flex items-center justify-center rounded-full shadow-lg ring-4 ring-white ${knobClassName}`}
      >
        {/* Subtle inner grip dot */}
        <span className="h-2 w-2 rounded-full bg-white/90" />
      </motion.div>
    </div>
  );
}
