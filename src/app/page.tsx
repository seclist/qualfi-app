"use client";

import { useEffect, useState } from "react";
import { DesktopLandingPage } from "@/components/desktop/DesktopLandingPage";
import { MobileLandingPage } from "@/components/mobile/MobileLandingPage";

/**
 * ============================================================================
 * QUALFI HYBRID RESPONSIVE ARCHITECTURE
 * ----------------------------------------------------------------------------
 * STRICT RULE ADHERENCE:
 * - Desktop View (md: breakpoint and above, >=768px):
 *   100% UNTOUCHED original desktop website design, realistic dual iPhone mockups,
 *   exact desktop animations, typography, and layout.
 *
 * - Mobile View (below md: breakpoint, <768px):
 *   Comprehensive overhaul implementing all 40 industry-backed and science-backed
 *   mobile visual & animation principles (one-handed navigation, 48x48dp tap targets,
 *   16px+ typography, visible search, dark mode, haptics, pull-to-refresh,
 *   subdued skeleton loading, swipe gestures with exit velocity, etc.).
 * ============================================================================
 */
export default function Page() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Graceful hash-link redirection for mobile devices
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (window.location.hash === "#demo") {
        document.getElementById("mobile-demo")?.scrollIntoView({ behavior: "smooth" });
      } else if (
        window.location.hash === "#funnel" ||
        window.location.hash === "#mobile-funnel" ||
        window.location.hash === "#enquire" ||
        window.location.hash === "#build" ||
        window.location.hash === "#mobile-build" ||
        window.location.hash === "#mobile-enquire"
      ) {
        (
          document.getElementById("mobile-funnel") ||
          document.getElementById("mobile-build") ||
          document.getElementById("mobile-enquire")
        )?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <>
      {/* 100% Preserved Desktop Website (Hidden on mobile breakpoints, aria-hidden when inactive) */}
      <div
        className="hidden md:block"
        aria-hidden={isMobile === true ? "true" : undefined}
      >
        <DesktopLandingPage />
      </div>

      {/* Comprehensive 40-Principle Mobile Experience (Exclusively on mobile breakpoints, aria-hidden when inactive) */}
      <div
        className="block md:hidden"
        aria-hidden={isMobile === false ? "true" : undefined}
      >
        <MobileLandingPage />
      </div>
    </>
  );
}
