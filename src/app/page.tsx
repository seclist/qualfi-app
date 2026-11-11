"use client";

import { useEffect, useSyncExternalStore } from "react";
import { DesktopLandingPage } from "@/components/desktop/DesktopLandingPage";
import { MobileLandingPage } from "@/components/mobile/MobileLandingPage";

/**
 * ============================================================================
 * QUALFI HYBRID RESPONSIVE ARCHITECTURE
 * ----------------------------------------------------------------------------
 * - Desktop View (md: breakpoint and above, >=768px): DesktopLandingPage
 * - Mobile View (below md: breakpoint, <768px): MobileLandingPage
 *
 * The server renders both trees (CSS picks the visible one, so there is no
 * layout flash). Once the browser knows its viewport, the inactive tree is
 * unmounted so its listeners, animations, and duplicate anchors are gone.
 * ============================================================================
 */

// Matches Tailwind's `md` breakpoint (48rem) exactly
const DESKTOP_QUERY = "(min-width: 48rem)";

function subscribeToViewport(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getIsMobile = (): boolean | null => !window.matchMedia(DESKTOP_QUERY).matches;
const getIsMobileOnServer = (): boolean | null => null;

// Desktop anchors and legacy aliases -> the section that exists in the mobile tree
const MOBILE_HASH_TARGETS: Record<string, string> = {
  "#demo": "mobile-demo",
  "#mobile-demo": "mobile-demo",
  "#funnel": "mobile-funnel",
  "#mobile-funnel": "mobile-funnel",
  "#pricing": "mobile-funnel",
  "#mobile-pricing": "mobile-funnel",
  "#enquire": "mobile-funnel",
  "#mobile-enquire": "mobile-funnel",
  "#build": "mobile-funnel",
  "#mobile-build": "mobile-funnel",
};

export default function Page() {
  const isMobile = useSyncExternalStore(
    subscribeToViewport,
    getIsMobile,
    getIsMobileOnServer
  );

  // Deep links (e.g. /#funnel from the 404 or legal pages) land on the right mobile section
  useEffect(() => {
    if (!isMobile) return;
    const targetId = MOBILE_HASH_TARGETS[window.location.hash];
    if (!targetId) return;
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }, [isMobile]);

  return (
    <>
      {isMobile !== true && (
        <div className="hidden md:block">
          <DesktopLandingPage />
        </div>
      )}

      {isMobile !== false && (
        <div className="block md:hidden">
          <MobileLandingPage />
        </div>
      )}
    </>
  );
}
