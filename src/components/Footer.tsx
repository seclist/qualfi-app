import Link from "next/link";
import { IconArrowRight, IconInstagram } from "./icons";
import { Logo } from "./Logo";

const sectionLinks = [
  { code: "01", href: "/#top", label: "Overview" },
  { code: "02", href: "/#demo", label: "Live Demo" },
  { code: "03", href: "/#claim", label: "Enquire" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface/40 backdrop-blur-md">
      {/* Luminous top hairline */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-brand-cyan/40 to-transparent" />

      {/* Subtle ambient under-glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(ellipse_50%_80%_at_50%_100%,rgba(0,210,220,0.09),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Top Row: Brand + Capsule Links + Instagram Pill */}
        <div className="flex flex-col justify-between gap-5 sm:gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <Link href="/#top" aria-label="Qualfi home" className="w-fit transition-opacity hover:opacity-85">
              <Logo />
            </Link>
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <p className="text-[13px] text-muted">
              Anyone can build a page —{" "}
              <span className="serif text-shimmer text-[15px] font-normal italic">
                we build the logic.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 sm:justify-start sm:gap-3">
            {/* Sleek Glass Capsule for Section Links */}
            <nav
              aria-label="Footer navigation"
              className="flex w-full items-center justify-between gap-1 rounded-full border border-line bg-surface-2/60 p-1 sm:w-auto sm:inline-flex"
            >
              {sectionLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-1 text-xs font-medium text-muted transition-all duration-200 hover:bg-surface hover:text-fg"
                >
                  <span className="font-mono text-[10px] font-bold text-brand-cyan/75 transition-colors group-hover:text-brand-cyan">
                    {l.code}
                  </span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </nav>

            {/* Interactive @qualfiapp Pill */}
            <a
              href="https://instagram.com/qualfiapp"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 py-1.5 pl-3 pr-2.5 text-xs font-semibold text-brand-cyan transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/55 hover:bg-brand-cyan/15 hover:shadow-[0_8px_24px_-8px_var(--brand-cyan-glow)]"
            >
              <IconInstagram className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>@qualfiapp</span>
              <IconArrowRight className="h-3 w-3 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Smooth Scroll-to-Top Button */}
            <Link
              href="/#top"
              aria-label="Back to top"
              title="Back to top"
              className="group grid h-8 w-8 place-items-center rounded-full border border-line bg-surface-2/60 font-mono text-xs text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/40 hover:text-brand-cyan"
            >
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            </Link>
          </div>
        </div>

        <div className="hairline my-6" />

        {/* Bottom Row: Legal & Live Telemetry */}
        <div className="flex flex-col gap-3 text-xs text-muted-soft sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span>© 2026 Qualfi</span>
            <span className="h-3 w-px bg-line" />
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors duration-200 hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[10.5px]">
            <span className="inline-flex items-center gap-1.5 text-brand-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
              COHORT 01 · £99 EARLY ACCESS
            </span>
            <span className="hidden text-line-strong sm:inline">·</span>
            <span>MADE IN THE UK · GDPR COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
