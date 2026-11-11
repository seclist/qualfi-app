"use client";

import { MotionConfig } from "framer-motion";

/**
 * Honours the visitor's OS-level "reduce motion" setting for every Framer Motion
 * animation on the site: movement and scaling are skipped, fades are kept.
 * (The CSS rule in globals.css only covers CSS animations and transitions.)
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
