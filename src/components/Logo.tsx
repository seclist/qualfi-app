type LogoMarkProps = {
  className?: string;
  title?: string;
};

/** Vector recreation of the Qualfi hexagon "Q" mark. */
export function LogoMark({ className = "h-7 w-7", title = "Qualfi" }: LogoMarkProps) {
  return (
    <svg viewBox="145 95 245 305" className={className} role="img" aria-label={title}>
      <path
        fill="#0B86B4"
        d="M248 100 L248 158 L198 188 L198 262 L248 292 L248 350 L150 293 L150 157 Z"
      />
      <path fill="#00D2DC" d="M275 112 L315 135 L315 172 L275 149 Z" />
      <path
        fill="#00D2DC"
        d="M255 166 L343 215 L343 290 L303 313 L385 372 L350 396 L283 349 L255 365 L255 312 L295 289 L295 235 L255 212 Z"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7" />
      <span className="text-[17px] font-semibold tracking-tight text-fg">Qualfi</span>
    </span>
  );
}
