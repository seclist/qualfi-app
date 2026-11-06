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

const COMMA_RE = /\B(?=(\d{3})+(?!\d))/g;

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
    if (!el || hasAnimated.current) return;

    let rafId = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        const startTime = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - (1 - progress) ** 3;
          setVal(end * ease);

          if (progress < 1) {
            rafId = requestAnimationFrame(step);
          } else {
            setVal(end);
          }
        };

        rafId = requestAnimationFrame(step);
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [end, duration]);

  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  const displayVal = formatComma ? formatted.replace(COMMA_RE, ",") : formatted;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
}
