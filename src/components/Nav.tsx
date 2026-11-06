"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { INSTAGRAM_URL } from "@/lib/constants";
import {
  BlurCrossfadeIcon,
  listContainerVariants,
  listRowVariants,
  SHARED_LAYOUT_TRANSITION,
  TriggerPopover,
} from "@/lib/wabi-motion";
import { IconArrowRight, IconInstagram } from "./icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { id: "top", code: "01", href: "/#top", label: "Overview" },
  { id: "demo", code: "02", href: "/#demo", label: "Live Demo" },
  { id: "claim", code: "03", href: "/#claim", label: "Enquire" },
] as const;

const SECTION_IDS = ["claim", "demo", "top"] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    let rafId = 0;

    const updateScrollState = () => {
      rafId = 0;
      const nextScrolled = window.scrollY > 16;
      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

      const midpoint = window.innerHeight * 0.38;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= midpoint) {
          setActiveSection((prev) => (prev === id ? prev : id));
          break;
        }
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div
        className={`mx-auto flex h-13 sm:h-14 max-w-6xl items-center justify-between rounded-full border px-2.5 pl-4 sm:px-3 sm:pl-5 transition-all duration-300 ${
          scrolled || open
            ? "glass shadow-[0_14px_44px_-12px_rgba(43,38,35,0.14)] dark:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.75)]"
            : "glass md:border-transparent md:bg-transparent md:backdrop-blur-none"
        }`}
      >
        <Link
          href="/#top"
          aria-label="Qualfi home"
          id="nav-logo"
          className="group flex items-center gap-3 active:scale-[0.97] transition-transform"
        >
          <Logo />
        </Link>

        {/* Rule 20: Shared layoutId pill switcher across navigation states */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 rounded-full border border-line bg-surface/80 p-1 backdrop-blur-md md:flex"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                /* Rule 4: Scale interactive elements to 0.97 on press */
                className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 active:scale-[0.97] ${
                  isActive ? "text-fg" : "text-muted hover:text-fg"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="qualfi-nav-active-pill"
                    transition={SHARED_LAYOUT_TRANSITION}
                    className=" -z-10 absolute inset-0 rounded-full bg-brand-cyan/15 ring-1 ring-brand-cyan/35 shadow-2xs"
                  />
                )}
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "scale-100 bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan)]"
                      : "scale-0 bg-transparent w-0 -mr-1.5"
                  }`}
                />
                <span
                  className={`font-mono text-[10.5px] font-bold transition-colors ${
                    isActive ? "text-brand-cyan" : "text-muted-soft"
                  }`}
                >
                  {link.code}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {/* Mobile Quick CTA Pill */}
          <Link
            href="/#claim"
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold active:scale-[0.97] md:hidden"
          >
            <span>Enquire</span>
            <IconArrowRight className="h-3 w-3" />
          </Link>

          <Link
            id="nav-cta"
            href="/#claim"
            className="btn-primary group relative hidden items-center gap-2 rounded-full py-1.5 pl-4 pr-2.5 text-[13px] font-semibold active:scale-[0.97] md:inline-flex"
          >
            <span>Enquire</span>
            <span className="relative grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-black/15 dark:bg-black/25 transition-transform duration-200 group-hover:scale-105">
              <IconArrowRight className="h-3 w-3 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4 group-hover:opacity-0" />
              <IconArrowRight className="absolute h-3 w-3 -translate-x-4 opacity-0 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
          </Link>

          <button
            id="nav-menu-toggle"
            type="button"
            className="btn-ghost grid h-10 w-10 place-items-center rounded-full md:hidden cursor-pointer active:scale-[0.97]"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {/* Rule 18: Crossfade icons and apply a blur effect */}
            <BlurCrossfadeIcon iconKey={open ? "close" : "menu"}>
              {open ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 8h16M4 16h16" />
                </svg>
              )}
            </BlurCrossfadeIcon>
          </button>
        </div>
      </div>

      {/* Rules 2, 10, 11, 12, 15: Dropdown timed 150-250ms (200ms enter / 160ms exit), starts at 0.95 scale, enters from & exits to top-right trigger */}
      <TriggerPopover
        open={open}
        origin="top right"
        className="glass mx-auto mt-2 max-w-6xl rounded-3xl border p-4 shadow-2xl md:hidden"
      >
        {/* Rule 3: Stagger list rows by 30ms */}
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-1"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <motion.div key={link.id} variants={listRowVariants}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition active:scale-[0.97] ${
                    isActive
                      ? "bg-brand-cyan/15 text-fg ring-1 ring-brand-cyan/30"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                  onClick={() => {
                    setActiveSection(link.id);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-3">
                    {isActive ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan)]" />
                    ) : null}
                    <span className="font-mono text-xs font-bold text-brand-cyan">{link.code}</span>
                    <span>{link.label}</span>
                  </span>
                  <IconArrowRight className="h-4 w-4 text-muted-soft" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 px-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan active:scale-[0.97]"
          >
            <IconInstagram className="h-3.5 w-3.5" />
            <span>@qualfiapp</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Theme</span>
            <ThemeToggle id="nav-mobile-theme-toggle" />
          </div>
        </div>

        <Link
          href="/#claim"
          className="btn-primary mt-3 flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-center text-sm font-semibold active:scale-[0.97]"
          onClick={() => setOpen(false)}
        >
          <span>Unlock £99 Early Access</span>
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </TriggerPopover>
    </header>
  );
}
