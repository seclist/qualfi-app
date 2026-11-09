"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const AWAY_TITLE = "👀 Don't leave your bio link cold · qualfi";

export function SiteQolEnhancements() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    let originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (document.title !== AWAY_TITLE) {
          originalTitle = document.title;
        }
        document.title = AWAY_TITLE;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[#d9532f]"
    />
  );
}
