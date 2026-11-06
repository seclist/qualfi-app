"use client";

import { useRef, useSyncExternalStore } from "react";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from "@/lib/constants";
import { BlurCrossfadeIcon } from "@/lib/wabi-motion";
import { IconMoon, IconSun } from "./icons";

interface ThemeToggleProps {
  className?: string;
  id?: string;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  const root = document.documentElement;
  const isDark = root.classList.contains("dark") || root.getAttribute("data-theme") === "dark";
  return isDark ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "dark";
}

export function ThemeToggle({
  className = "",
  id = "nav-theme-toggle",
}: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerSnapshot);
  const btnRef = useRef<HTMLButtonElement>(null);

  const applyTheme = (nextTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.setAttribute("data-theme", nextTheme);
    root.style.colorScheme = nextTheme;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage access errors in restricted browsing modes
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

  const toggle = () => {
    const nextTheme: "light" | "dark" = getThemeSnapshot() === "dark" ? "light" : "dark";

    // Rule 17: Use masks for reveals and colour transitions
    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof docWithVT.startViewTransition === "function" && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = docWithVT.startViewTransition(() => {
        applyTheme(nextTheme);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 380,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {});
    } else {
      applyTheme(nextTheme);
    }
  };

  const nextLabel = theme === "dark" ? "light" : "dark";

  return (
    <button
      ref={btnRef}
      id={id}
      type="button"
      onClick={toggle}
      /* Rule 4: Scale interactive elements to 0.97 on press */
      className={`btn-ghost grid h-9 w-9 cursor-pointer place-items-center rounded-full text-fg transition-transform duration-150 active:scale-[0.97] ${className}`}
      aria-label={`Switch to ${nextLabel} mode`}
      title={`Switch to ${nextLabel} mode`}
    >
      {/* Rule 18: Crossfade icons and apply a blur effect */}
      <BlurCrossfadeIcon iconKey={theme}>
        {theme === "dark" ? (
          <IconSun className="h-4 w-4 text-[#D4AC66]" />
        ) : (
          <IconMoon className="h-4 w-4 text-[#6E655E]" />
        )}
      </BlurCrossfadeIcon>
    </button>
  );
}
