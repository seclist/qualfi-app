"use client";

import React from "react";

interface RealisticPhoneProps {
  children: React.ReactNode;
  theme?: "light" | "dark";
  className?: string;
  screenClassName?: string;
  urlBar?: string;
  showHomeIndicator?: boolean;
}

/**
 * Realistic iPhone 16 Pro Hardware Mockup:
 * - Grade-5 natural / black titanium finish with micro-blasted matte bezel
 * - World's thinnest uniform border (~1.5mm display bezel)
 * - Proportional Apple Dynamic Island with front camera specular sapphire lens & sensor
 * - Precision hardware buttons: Action Button, Volume Rocker, Power Button, Camera Control
 * - Real iOS status bar (9:41, 5G, Wi-Fi, battery level) and home swipe pill
 */
export function RealisticPhone({
  children,
  theme = "light",
  className = "",
  screenClassName = "h-[640px] sm:h-[680px]",
  urlBar,
  showHomeIndicator = true,
}: RealisticPhoneProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* Hardware Buttons - Left Edge */}
      {/* Action Button (iPhone 16 Pro) */}
      <div className="absolute -left-[3px] top-[96px] h-7 w-[3px] rounded-l-sm bg-[#3a3b42] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      {/* Volume Up */}
      <div className="absolute -left-[3px] top-[138px] h-12 w-[3px] rounded-l-sm bg-[#3a3b42] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      {/* Volume Down */}
      <div className="absolute -left-[3px] top-[198px] h-12 w-[3px] rounded-l-sm bg-[#3a3b42] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />

      {/* Hardware Buttons - Right Edge */}
      {/* Side / Power Button */}
      <div className="absolute -right-[3px] top-[145px] h-16 w-[3px] rounded-r-sm bg-[#3a3b42] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
      {/* iPhone 16 Pro Camera Control Button (Flush Capacitive Sapphire Glass) */}
      <div className="absolute -right-[2.5px] top-[255px] h-14 w-[2.5px] rounded-r-[1px] bg-[#2d2e35] border-y border-l border-[#444650]/80 shadow-xs" />

      {/* Titanium Outer Chassis (iPhone 16 Pro Contoured Grade-5 Titanium) */}
      <div className="relative rounded-[50px] bg-gradient-to-b from-[#2e2f36] via-[#1c1d22] to-[#121316] p-[3.5px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.38),0_12px_24px_-8px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_1px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
        
        {/* Subtle Top Antenna Band */}
        <div className="absolute left-[34px] top-0 h-[2px] w-2 bg-[#42444e]/50 pointer-events-none" />
        <div className="absolute right-[34px] top-0 h-[2px] w-2 bg-[#42444e]/50 pointer-events-none" />

        {/* Razor-Thin Black Display Bezel (1.5mm iPhone 16 Pro Border) */}
        <div className="relative rounded-[47px] bg-black p-[2.5px] shadow-[inset_0_0_3px_rgba(0,0,0,0.95)]">
          
          {/* Micro Ear Speaker Slit at top edge */}
          <div className="absolute left-1/2 -top-[1px] h-[1.5px] w-12 -translate-x-1/2 rounded-full bg-[#18191e] z-50 pointer-events-none" />

          {/* OLED Display Surface */}
          <div
            className={`relative flex w-full flex-col overflow-hidden rounded-[45px] ${screenClassName} ${
              isDark ? "bg-[#0b141a] text-[#e9edef]" : "bg-[#faf7f2] text-[#121316]"
            }`}
          >
            {/* Screen Glass Glare Sheen */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/[0.035] to-transparent" />

            {/* iOS Status Bar + Dynamic Island */}
            <div className="relative z-40 flex h-10 w-full items-center justify-between px-6 pt-1 text-[11px] font-semibold">
              {/* iOS Clock */}
              <span className={`tracking-tight font-medium ${isDark ? "text-white" : "text-[#121316]"}`}>
                9:41
              </span>

              {/* iPhone 16 Pro Dynamic Island */}
              <div className="absolute left-1/2 top-2 h-[21px] w-[82px] -translate-x-1/2 rounded-full bg-black shadow-inner flex items-center justify-between px-2.5">
                {/* Front TrueDepth Camera with Sapphire Lens Reflection */}
                <div className="relative h-2.5 w-2.5 rounded-full bg-[#0a1120] ring-1 ring-[#1b263b] flex items-center justify-center">
                  <div className="h-1 w-1 rounded-full bg-[#203254]" />
                  <div className="absolute top-0.5 right-0.5 h-0.5 w-0.5 rounded-full bg-white/70" />
                </div>
                {/* Ambient Sensor */}
                <div className="h-1.5 w-1.5 rounded-full bg-[#070b10] ring-[0.5px] ring-white/10" />
              </div>

              {/* iOS Status Indicators: Cellular, 5G / Wi-Fi, Battery */}
              <div className={`flex items-center gap-1.5 ${isDark ? "text-white" : "text-[#121316]"}`}>
                {/* 4-Bar Signal Indicator */}
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <span className="w-[2px] h-[3px] bg-current rounded-[0.5px]" />
                  <span className="w-[2px] h-[5px] bg-current rounded-[0.5px]" />
                  <span className="w-[2px] h-[7.5px] bg-current rounded-[0.5px]" />
                  <span className="w-[2px] h-[10px] bg-current rounded-[0.5px]" />
                </div>

                {/* Wi-Fi Icon */}
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.78 0 7.21 1.54 9.69 4.02L12 19.33 2.31 11.52C4.79 9.04 8.22 7.5 12 7.5z" />
                </svg>

                {/* Battery Pill */}
                <div className="flex items-center gap-[1px]">
                  <div className="h-2.5 w-5 rounded-[3px] border border-current p-[1px] flex items-center">
                    <div className="h-full w-[85%] rounded-[1.5px] bg-current" />
                  </div>
                  <div className="h-1.5 w-[1px] rounded-r-[0.5px] bg-current opacity-70" />
                </div>
              </div>
            </div>

            {/* In-App Browser Address Pill */}
            {urlBar && (
              <div className="relative z-30 mx-4 mt-1 mb-1.5 flex items-center justify-between rounded-full bg-stone-200/60 px-3 py-1 text-[10.5px] text-stone-600 backdrop-blur-xs border border-black/5">
                <span className="flex items-center gap-1.5">
                  <svg className="h-2.5 w-2.5 text-stone-500 fill-current" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <span className="font-medium text-[#121316]">{urlBar}</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">AA</span>
              </div>
            )}

            {/* Display Body */}
            <div className="relative z-20 flex-1 flex flex-col overflow-hidden px-4 pb-2">
              {children}
            </div>

            {/* iOS Home Swipe Bar */}
            {showHomeIndicator && (
              <div className="relative z-30 flex h-4 w-full items-center justify-center pb-1">
                <div
                  className={`h-1 w-28 rounded-full ${
                    isDark ? "bg-white/30" : "bg-stone-400/40"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
