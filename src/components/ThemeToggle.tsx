"use client";

import { useSyncExternalStore } from "react";
import { IconMoon, IconSun } from "./icons";

interface ThemeToggleProps {
  className?: string;
  id?: string;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("qualfi-theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("qualfi-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  const isDark =
    document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark";
  return isDark ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

export function ThemeToggle({
  className = "",
  id = "nav-theme-toggle",
}: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);

  const toggle = () => {
    const isDark = getThemeSnapshot() === "dark";
    const nextTheme: "light" | "dark" = isDark ? "light" : "dark";

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
      try {
        localStorage.setItem("qualfi-theme", "dark");
      } catch {}
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
      try {
        localStorage.setItem("qualfi-theme", "light");
      } catch {}
    }

    window.dispatchEvent(new Event("qualfi-theme-change"));
  };

  return (
    <button
      id={id}
      type="button"
      onClick={toggle}
      className={`btn-ghost grid h-9 w-9 cursor-pointer place-items-center rounded-full text-fg transition-all hover:scale-105 active:scale-95 ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <IconSun className="h-4 w-4 text-amber-300 transition-transform duration-300 rotate-0" />
      ) : (
        <IconMoon className="h-4 w-4 text-slate-700 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
