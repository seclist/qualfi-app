"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASING, playSensoryFeedback } from "@/lib/design-system";

/**
 * Mobile One-Handed Thumb-Zone Action Bar:
 * - 62%+ of global traffic is mobile.
 * - Anchors primary conversion actions in the bottom resting arc of the thumb.
 * - Appears after the user scrolls past the hero to maintain persistent conversion opportunity.
 */
export function ThumbZoneBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px (past hero)
      if (window.scrollY > 420) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASING.naturalOut }}
          className="fixed bottom-4 inset-x-4 z-40 sm:hidden"
        >
          <div className="flex items-center justify-between rounded-full border border-[#231d17]/15 bg-[#231d17] p-2.5 shadow-2xl backdrop-blur-lg text-[#f4efe6]">
            <div className="pl-4">
              <span className="block text-[11px] font-bold text-[#e8a87c] uppercase tracking-wider">
                Coach Maya Funnel
              </span>
              <span className="block text-xs font-serif italic text-white/80">
                60s Diagnostic Live
              </span>
            </div>

            <motion.a
              href="#demo"
              onClick={() => playSensoryFeedback("tap")}
              whileTap={{ scale: 0.95 }}
              className="rounded-full bg-[#d9532f] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b83e1d] transition-colors"
            >
              Test On Phone ➔
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
