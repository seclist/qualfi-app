"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
  type Variants,
} from "framer-motion";
import { type ReactNode, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * WABI SABI · 20 DETERMINISTIC UI ANIMATION LAWS
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Apply ease-out for all entrances: [0.22, 1, 0.36, 1]
 *  2. Time dropdowns to last between 150 and 250ms: 200ms enter / 160ms exit
 *  3. Stagger list rows by 30ms: 0.03s
 *  4. Scale interactive elements to 0.97 on press: 0.97
 *  5. Stretch moving knobs by 12 percent: scaleX(1.12)
 *  6. Stagger items as details settle: 0.045s
 *  7. Use arcs for object movement to create natural paths
 *  8. Pulse elements to confirm success
 *  9. Use ease-in-out for general moves: [0.65, 0, 0.35, 1]
 * 10. Start popovers at a 0.95 scale
 * 11. Make elements enter from the trigger (transformOrigin)
 * 12. Make elements exit to the trigger (transformOrigin)
 * 13. Ensure there is no bounce on everyday UI components
 * 14. Do not tween while an item is held (0ms transition while dragging/holding)
 * 15. Make exits 20 percent shorter than entrances (T_exit = T_enter * 0.8)
 * 16. Overlap old and new states during transitions (CSS grid stack + popLayout)
 * 17. Use masks for reveals and colour transitions (clip-path)
 * 18. Crossfade icons and apply a blur effect
 * 19. Allow elements to rubber band past their bounds
 * 20. Reuse the same layoutId across states
 * ───────────────────────────────────────────────────────────────────────────── */

/** Rule 1 & Rule 13: Critically damped ease-out for all entrances (zero bounce). */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Rule 9 & Rule 13: Smooth ease-in-out for general moves & shared layoutId glides (zero bounce). */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Rule 15: Make exits 20% shorter than entrances. */
export const exitDuration = (enterSec: number): number =>
  Number((enterSec * 0.8).toFixed(3));

/** Rule 2 & Rule 15: Dropdowns last 150–250ms (200ms enter, 160ms exit). */
export const DROPDOWN_ENTER_SEC = 0.2;
export const DROPDOWN_EXIT_SEC = exitDuration(DROPDOWN_ENTER_SEC); // 0.16s (160ms)

/** Rule 3: Stagger list rows by exactly 30ms. */
export const LIST_STAGGER_SEC = 0.03;

/** Rule 6: Stagger items as details settle. */
export const SETTLE_STAGGER_SEC = 0.045;

/** Rule 4: Scale interactive elements to 0.97 on press. */
export const PRESS_SCALE = 0.97;

/** Rule 5: Stretch moving knobs by 12 percent. */
export const KNOB_STRETCH_X = 1.12;
export const KNOB_STRETCH_Y = 0.92;

/** Rule 10: Start popovers at a 0.95 scale. */
export const POPOVER_SCALE = 0.95;

/** Rule 9, 13, 20: Shared layoutId transition using ease-in-out with zero bounce. */
export const SHARED_LAYOUT_TRANSITION: Transition = {
  type: "tween",
  ease: EASE_IN_OUT,
  duration: 0.28,
};

/** Rule 1, 3, 15: Staggered list container (30ms per row). */
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: EASE_OUT,
      duration: 0.22,
      staggerChildren: LIST_STAGGER_SEC,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: EASE_OUT,
      duration: exitDuration(0.22),
    },
  },
};

export const listRowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: EASE_OUT,
      duration: 0.24,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      ease: EASE_OUT,
      duration: exitDuration(0.24),
    },
  },
};

/** Rule 1, 6, 15: Details settling stagger variants. */
export const settleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ease: EASE_OUT,
      duration: 0.3,
      delayChildren: 0.04,
      staggerChildren: SETTLE_STAGGER_SEC,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: EASE_OUT,
      duration: exitDuration(0.3),
    },
  },
};

export const settleItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: EASE_OUT,
      duration: 0.32,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      ease: EASE_OUT,
      duration: exitDuration(0.32),
    },
  },
};

/**
 * Rule 18 & Rule 15: Crossfade icons and apply a blur effect.
 * Entrance uses ease-out (200ms); exit is 20% shorter (160ms).
 */
export function BlurCrossfadeIcon({
  iconKey,
  children,
  className = "inline-grid place-items-center",
}: {
  iconKey: string | number | boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(iconKey)}
          initial={{ opacity: 0, filter: "blur(4px)", scale: 0.88 }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            transition: { ease: EASE_OUT, duration: 0.2 },
          }}
          exit={{
            opacity: 0,
            filter: "blur(4px)",
            scale: 0.88,
            transition: { ease: EASE_OUT, duration: exitDuration(0.2) },
          }}
          className="inline-flex items-center justify-center"
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Rules 1, 15, 16: Overlap old and new states during transitions.
 * Both outgoing and incoming states occupy the same grid cell so they overlap seamlessly,
 * with exit 20% shorter than entrance and ease-out on entrance.
 */
export function OverlapTransitionStage({
  activeKey,
  stateKey,
  children,
  className = "",
  enterDuration = 0.32,
}: {
  activeKey?: string | number;
  stateKey?: string | number;
  children: ReactNode;
  className?: string;
  enterDuration?: number;
}) {
  const resolvedKey = activeKey ?? stateKey ?? "stage";
  return (
    <div className={`grid grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1 ${className}`}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={String(resolvedKey)}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              ease: EASE_OUT,
              duration: enterDuration,
            },
          }}
          exit={{
            opacity: 0,
            y: -8,
            transition: {
              ease: EASE_OUT,
              duration: exitDuration(enterDuration),
            },
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Rules 1, 2, 10, 11, 12, 13, 15:
 * Dropdown / Popover that starts at 0.95 scale, enters from the trigger (transformOrigin),
 * exits back to the trigger 20% faster (200ms in / 160ms out), with zero bounce.
 */
export function TriggerPopover({
  open,
  origin = "top right",
  children,
  className = "",
}: {
  open: boolean;
  origin?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          style={{ transformOrigin: origin }}
          initial={{ opacity: 0, scale: POPOVER_SCALE, y: -4 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              ease: EASE_OUT,
              duration: DROPDOWN_ENTER_SEC, // 200ms (150–250ms rule)
            },
          }}
          exit={{
            opacity: 0,
            scale: POPOVER_SCALE,
            y: -4,
            transition: {
              ease: EASE_OUT,
              duration: DROPDOWN_EXIT_SEC, // 160ms (20% shorter rule)
            },
          }}
          className={className}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Rules 14 & 19: Rubber-band container that allows pulling past bounds with elastic resistance,
 * does NOT tween while held/dragged (1:1 direct manipulation), and glides back with ease-in-out on release.
 */
export function RubberBandSurface({
  children,
  className = "",
  maxPullPx = 18,
}: {
  children: ReactNode;
  className?: string;
  maxPullPx?: number;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  const rubberBand = (delta: number) => {
    const sign = Math.sign(delta);
    const abs = Math.abs(delta);
    return sign * Math.min(maxPullPx, Math.pow(abs, 0.7) * 0.35);
  };

  return (
    <div
      onPointerDown={(e) => {
        // Don't hijack interactive child controls
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "BUTTON" || tag === "A") return;
        setHeld(true);
        setStart({ x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e) => {
        if (!held || !start) return;
        setOffset({
          x: rubberBand(e.clientX - start.x),
          y: rubberBand(e.clientY - start.y),
        });
      }}
      onPointerUp={() => {
        setHeld(false);
        setStart(null);
        setOffset({ x: 0, y: 0 });
      }}
      onPointerCancel={() => {
        setHeld(false);
        setStart(null);
        setOffset({ x: 0, y: 0 });
      }}
      onPointerLeave={() => {
        if (held) {
          setHeld(false);
          setStart(null);
          setOffset({ x: 0, y: 0 });
        }
      }}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        // Rule 14: Do not tween while held; Rule 9: ease-in-out move on release
        transition: held
          ? "none"
          : "transform 320ms cubic-bezier(0.65, 0, 0.35, 1)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/** Wabi Sabi tactile washi paper & stoneware grain overlay. */
export function WabiSabiGrain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.032] dark:opacity-[0.042] mix-blend-multiply dark:mix-blend-soft-light"
    >
      <filter id="wabi-sabi-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#wabi-sabi-noise)" />
    </svg>
  );
}
