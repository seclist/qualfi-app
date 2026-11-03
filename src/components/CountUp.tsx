"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatComma?: boolean;
  className?: string;
}

export function CountUp({
  end,
  duration = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatComma = false,
  className = "",
}: CountUpProps) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const startVal = 0;

          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (end - startVal) * ease;
            setVal(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setVal(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  const displayVal = formatComma
    ? formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : formatted;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
}
