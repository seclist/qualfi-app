"use client";

import { useId } from "react";

export type DividerVariant = "demo-to-funnel" | "hero-to-demo" | "funnel-to-footer" | "custom";

export interface TopographicSectionDividerProps {
  variant?: DividerVariant;
  topColor?: string;
  bottomColor?: string;
  className?: string;
  id?: string;
}

/**
 * ============================================================================
 * TOPOGRAPHIC SECTION DIVIDER
 * ----------------------------------------------------------------------------
 * Minimalist, single-line curved section transition inspired by the Hero
 * contour lines. The background colors of the adjacent sections follow the
 * exact C-infinity smooth cubic Bezier curve with a single crisp 1.5px stroke.
 * ============================================================================
 */
export function TopographicSectionDivider({
  variant = "demo-to-funnel",
  topColor,
  bottomColor,
  className = "",
  id,
}: TopographicSectionDividerProps) {
  const uniqueId = useId().replace(/:/g, "");

  const resolvedTop =
    topColor ??
    (variant === "hero-to-demo"
      ? "#faf7f2"
      : variant === "demo-to-funnel"
      ? "#ffffff"
      : "#faf7f2");

  const resolvedBottom =
    bottomColor ??
    (variant === "hero-to-demo"
      ? "#ffffff"
      : variant === "demo-to-funnel"
      ? "#faf7f2"
      : "#faf7f2");

  const isDemoToFunnel = variant === "demo-to-funnel";
  const isHeroToDemo = variant === "hero-to-demo";

  // Single C-infinity smooth cubic Bezier curve (zero kinks, natural flow)
  const seamPath = isDemoToFunnel
    ? "M 0 52 C 480 8, 960 96, 1440 52"
    : isHeroToDemo
    ? "M 0 58 C 480 102, 960 14, 1440 58"
    : "M 0 55 C 480 95, 960 15, 1440 55";

  // Exact upper section fill following the curve
  const topFillPath = isDemoToFunnel
    ? "M 0 0 L 1440 0 L 1440 52 C 960 96, 480 8, 0 52 Z"
    : isHeroToDemo
    ? "M 0 0 L 1440 0 L 1440 58 C 960 14, 480 102, 0 58 Z"
    : "M 0 0 L 1440 0 L 1440 55 C 960 15, 480 95, 0 55 Z";

  // Exact lower section fill following the curve
  const bottomFillPath = isDemoToFunnel
    ? "M 0 52 C 480 8, 960 96, 1440 52 L 1440 110 L 0 110 Z"
    : isHeroToDemo
    ? "M 0 58 C 480 102, 960 14, 1440 58 L 1440 110 L 0 110 Z"
    : "M 0 55 C 480 95, 960 15, 1440 55 L 1440 110 L 0 110 Z";

  const seamGradId = `seam-grad-${uniqueId}`;

  return (
    <div
      id={id}
      className={`relative w-full overflow-hidden select-none pointer-events-none leading-none -my-px ${className}`}
      style={{ height: "clamp(48px, 5.5vw, 84px)" }}
      aria-hidden="true"
    >
      <svg
        className="block h-full w-full"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={seamGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d9532f" stopOpacity="0.22" />
            <stop offset="25%" stopColor="#d9532f" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#d9532f" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#b5654a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#d9532f" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* Upper section background color following the curve */}
        <path d={topFillPath} fill={resolvedTop} />

        {/* Lower section background color following the curve */}
        <path d={bottomFillPath} fill={resolvedBottom} />

        {/* Single crisp contour line along the exact merge boundary */}
        <path
          d={seamPath}
          fill="none"
          stroke={`url(#${seamGradId})`}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
