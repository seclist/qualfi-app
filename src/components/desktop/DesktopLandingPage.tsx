"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Knob } from "@/components/Knob";
import { RealisticPhone } from "@/components/RealisticPhone";
import { HowItWorks } from "@/components/HowItWorks";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { WhatsAppPreviewModal } from "@/components/WhatsAppPreviewModal";
import { GetYourFunnel } from "@/components/GetYourFunnel";
import { TopographicSectionDivider } from "@/components/TopographicSectionDivider";
import {
  DAYS,
  GOALS,
  QUESTIONS,
  STRUGGLES,
  compute,
  useDiagnostic,
} from "@/lib/diagnostic";
import {
  EASING,
  playSensoryFeedback,
} from "@/lib/design-system";
import { downloadCustomBlueprintPdf } from "@/lib/generatePdf";

/**
 * ============================================================================
 * QUALFI DESKTOP WEBSITE ARCHITECTURE (100% PRESERVED & UNTOUCHED)
 * Strictly maintained: all desktop design, mockups, typography, and animations
 * are completely identical to the original specification.
 * ============================================================================
 */

/* Clean Minimalist Header */
function Header() {
  return (
    <header className="fixed left-1/2 top-4 z-50 flex w-[min(94vw,800px)] -translate-x-1/2 items-center justify-between rounded-full border border-stone-200/90 bg-white/90 px-6 py-3 shadow-[0_10px_35px_rgba(18,19,22,0.06)] backdrop-blur-xl">
      {/* Brand Logo */}
      <a
        href="#"
        onClick={() => playSensoryFeedback("tap")}
        className="font-sans font-black text-2xl tracking-tight text-[#121316] flex items-center gap-1.5"
      >
        <span>qualfi</span>
        <span className="h-2 w-2 rounded-full bg-[#d9532f]" />
      </a>

      {/* Nav Anchors */}
      <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8 text-xs font-semibold text-[#121316]/80">
        <a
          href="#demo"
          className="hover:text-[#d9532f] transition-colors"
          onClick={() => playSensoryFeedback("tap")}
        >
          Live Demo
        </a>
        <a
          href="#funnel"
          className="hover:text-[#d9532f] transition-colors"
          onClick={() => playSensoryFeedback("tap")}
        >
          Get Your Funnel
        </a>
      </nav>

      {/* CTA Button */}
      <div className="flex items-center">
        <motion.a
          href="#funnel"
          onClick={() => playSensoryFeedback("tap")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full bg-[#121316] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#d9532f] transition-all"
        >
          Get Your Funnel →
        </motion.a>
      </div>
    </header>
  );
}

/* Hero Section: Casual, Punchy Headline + iPhone 16 Pro Hardware Mockups */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f2] px-6 pb-20 pt-36 md:px-12 md:pt-40">
      {/* Precision Background Layer 1: Atmospheric Ambient Gradients */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,83,47,0.09),transparent_70%)] blur-2xl" />
        <div className="absolute top-1/2 left-4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,83,47,0.06),transparent_65%)] blur-3xl" />
        <div className="absolute top-1/3 right-4 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_65%)] blur-3xl" />
      </div>

      {/* Athletic Topographic Elevation Vector Contours (Lines & Dotted Lines) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full z-0 opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-80 160 C 260 80, 520 270, 860 180 C 1140 110, 1340 220, 1560 150"
          fill="none"
          stroke="#121316"
          strokeWidth="1"
          strokeDasharray="4 8"
          className="opacity-30"
        />
        <path
          d="M-80 320 C 320 200, 640 380, 980 270 C 1220 190, 1380 300, 1560 250"
          fill="none"
          stroke="#d9532f"
          strokeWidth="1.2"
          className="opacity-35"
        />
        <path
          d="M-80 470 C 240 370, 580 530, 890 430 C 1180 340, 1360 450, 1560 400"
          fill="none"
          stroke="#121316"
          strokeWidth="1"
          className="opacity-20"
        />
        <path
          d="M-80 630 C 360 530, 720 670, 1070 570 C 1290 500, 1440 590, 1560 540"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="opacity-30"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        {/* Casual Fitness Hook */}
        <h1 className="font-sans font-black text-4xl sm:text-6xl md:text-7xl text-[#121316] tracking-tight leading-[1.08] max-w-3xl">
          Make your bio do the{" "}
          <span className="text-[#d9532f] italic font-serif font-normal">
            heavy lifting.
          </span>
        </h1>

        {/* Spliced Down Subheadline without AI dashes */}
        <p className="mt-5 max-w-xl text-base sm:text-lg text-[#52555f] font-sans leading-relaxed">
          Dead Linktrees and DM me READY lose most of your warm traffic. qualfi gives your followers custom calories and macros in 60 seconds, then sends qualified buyers straight to your WhatsApp in 2 seconds.
        </p>

        {/* Primary CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <motion.a
            href="#demo"
            onClick={() => playSensoryFeedback("tap")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block rounded-full bg-[#121316] px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-[#d9532f] transition-all"
          >
            Try the live demo ↓
          </motion.a>
          <motion.a
            href="#funnel"
            onClick={() => playSensoryFeedback("tap")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block rounded-full border border-stone-300 bg-white px-7 py-4 text-sm font-bold text-[#121316] hover:border-stone-400 hover:bg-stone-50 transition-all shadow-xs"
          >
            Get your funnel →
          </motion.a>
        </div>

        {/* Offer terms at a glance */}
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs font-medium text-[#52555f]">
          {["£0 upfront", "Live in 72 hours", "No monthly fee"].map((term) => (
            <li key={term} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#d9532f]" />
              {term}
            </li>
          ))}
        </ul>

        {/* Realistic iPhone 16 Pro Dual Phone Showcase */}
        <div className="relative mt-14 sm:mt-18 w-full max-w-4xl flex items-center justify-center">
          {/* Dual Dynamic Stage Glow Behind Phones */}
          <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-[#d9532f]/12 blur-3xl pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-[#10b981]/12 blur-3xl pointer-events-none" />
          <div className="absolute -inset-6 sm:-inset-12 rounded-[100px] bg-gradient-to-r from-[#d9532f]/8 via-transparent to-[#10b981]/8 blur-3xl pointer-events-none" />

          {/* Floating Metric Badges around phones */}
          <div className="hidden lg:block absolute -left-8 top-28 z-30">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-4 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-[#121316]">
                Lead sent in 2 seconds
              </span>
            </motion.div>
          </div>

          <div className="hidden lg:block absolute -right-8 top-36 z-30">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-4 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#d9532f]" />
              <span className="text-xs font-bold text-[#121316]">
                94/100 Purchase Intent
              </span>
            </motion.div>
          </div>

          <div className="hidden lg:block absolute -left-10 bottom-24 z-30">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-4 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-[#121316]" />
              <span className="text-xs font-bold text-[#121316]">
                Calculates Custom Macros
              </span>
            </motion.div>
          </div>

          <div className="hidden lg:block absolute -right-10 bottom-28 z-30">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-4 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-[#121316]">
                Zero Cold DMs
              </span>
            </motion.div>
          </div>

          {/* Dual iPhone 16 Pro Mockups */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:-space-x-8">
            
            {/* Phone 1: Follower Diagnostic Result (Tilted Left) */}
            <motion.div
              whileHover={{ y: -8, rotate: -2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 w-[305px] sm:w-[330px] -rotate-2 sm:-rotate-5"
            >
              <RealisticPhone
                urlBar="qualfi.app/coachmaya"
                screenClassName="h-[640px] sm:h-[680px]"
              >
                <div className="flex h-full flex-col justify-between py-2">
                  {/* Coach Header */}
                  <div className="flex items-center justify-between border-b border-stone-200/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#d9532f] grid place-items-center font-serif font-bold text-white text-xs">
                        M
                      </div>
                      <div className="text-[11px] leading-tight text-left">
                        <b className="block text-[#121316]">Coach Maya</b>
                        <span className="text-stone-500">Macro Calculator</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#10b981]/15 px-2.5 py-0.5 text-[9.5px] font-bold text-[#047857]">
                      Complete
                    </span>
                  </div>

                  {/* Calculated Value Deliverable */}
                  <div className="space-y-4 text-center my-auto py-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#047857]">
                      Your Daily Fuel Target
                    </span>
                    <div className="font-serif text-5xl sm:text-6xl font-light text-[#121316] my-1">
                      2,420 <span className="text-lg italic text-[#d9532f]">kcal</span>
                    </div>

                    {/* 3 Macro Cards */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="rounded-2xl bg-[#f4d3c4] p-2.5">
                        <div className="font-serif text-base sm:text-lg font-bold text-[#121316]">140g</div>
                        <div className="text-[8.5px] uppercase font-bold text-stone-700">PROTEIN</div>
                      </div>
                      <div className="rounded-2xl bg-[#d8e5db] p-2.5">
                        <div className="font-serif text-base sm:text-lg font-bold text-[#121316]">323g</div>
                        <div className="text-[8.5px] uppercase font-bold text-stone-700">CARBS</div>
                      </div>
                      <div className="rounded-2xl bg-[#d9532f] p-2.5 text-white">
                        <div className="font-serif text-base sm:text-lg font-bold">63g</div>
                        <div className="text-[8.5px] uppercase font-bold text-white/90">FAT</div>
                      </div>
                    </div>

                    {/* Training Split */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-3 text-xs text-[#121316] shadow-2xs">
                      <span className="font-bold text-[#047857]">Optimal Split:</span> Push Pull Legs
                      <div className="text-[10.5px] text-stone-500 mt-0.5">4 focused sessions weekly</div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[10px] text-stone-600 font-medium">
                      <span>✓</span>
                      <span>Verified Nutrition Blueprint</span>
                    </div>
                  </div>

                  {/* Test Demo Anchor */}
                  <a
                    href="#demo"
                    onClick={() => playSensoryFeedback("tap")}
                    className="rounded-full bg-[#121316] py-3 text-center text-xs font-bold text-white hover:bg-[#d9532f] transition-colors shadow-sm"
                  >
                    Test the live demo below ↓
                  </a>
                </div>
              </RealisticPhone>
            </motion.div>

            {/* Phone 2: Authentic WhatsApp Chat Lead Dossier (Tilted Right) */}
            <motion.div
              whileHover={{ y: -8, rotate: 2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-20 w-[305px] sm:w-[330px] rotate-2 sm:rotate-5 sm:mt-12"
            >
              <RealisticPhone
                theme="dark"
                screenClassName="h-[640px] sm:h-[680px]"
              >
                <div className="relative flex h-full flex-col justify-between -mx-4 -my-2 font-sans bg-[#0b141a] text-[#e9edef] overflow-hidden">
                  
                  {/* WhatsApp Subtle Wallpaper Doodle Pattern Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06] z-0"
                    style={{
                      backgroundImage: `radial-gradient(#25d366 1px, transparent 1px), radial-gradient(#ffffff 0.75px, transparent 0.75px)`,
                      backgroundSize: `24px 24px, 12px 12px`,
                      backgroundPosition: `0 0, 6px 6px`,
                    }}
                  />

                  {/* Top iOS WhatsApp Navigation Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#202c33] bg-[#1f2c34] px-3.5 py-2.5 text-white shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#53bdeb] text-sm font-medium -mr-0.5">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                        <span className="text-[11px] font-semibold">4</span>
                      </div>
                      
                      {/* WhatsApp Profile Avatar */}
                      <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-[#00a884] to-[#25d366] grid place-items-center text-xs font-serif font-bold text-white shadow-xs">
                        <span>Q</span>
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#25d366] ring-1 ring-[#1f2c34]" />
                      </div>

                      <div className="text-[12px] leading-tight">
                        <b className="block text-[#e9edef] font-semibold tracking-tight">qualfi</b>
                        <span className="text-[10px] text-[#25d366] font-medium">online</span>
                      </div>
                    </div>

                    {/* WhatsApp Action Icons: Video Call & Audio Call */}
                    <div className="flex items-center gap-3.5 text-[#00a884]">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                      </svg>
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.43-3.9-6.8-6.8l2-1.58c.28-.28.37-.67.25-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                      </svg>
                    </div>
                  </div>

                  {/* WhatsApp Chat Conversation Feed */}
                  <div className="relative z-10 flex-1 px-3 py-3 flex flex-col justify-end space-y-3 overflow-y-auto">
                    {/* Date Pill */}
                    <div className="mx-auto rounded-md bg-[#182229] px-2.5 py-0.5 text-[9.5px] font-semibold text-[#8696a0] shadow-2xs">
                      TODAY
                    </div>

                    {/* Encryption Notice */}
                    <div className="mx-auto max-w-[270px] rounded-lg bg-[#182229]/90 px-3 py-1.5 text-center text-[9px] leading-tight text-[#ffd279]/85 border border-[#ffd279]/10 shadow-2xs">
                      Messages are end-to-end encrypted. No one outside of this chat can read them.
                    </div>

                    {/* Genuine WhatsApp Incoming Lead Alert Text Message */}
                    <div className="relative max-w-[285px] rounded-2xl rounded-tl-xs bg-[#202c33] p-3.5 text-xs text-[#e9edef] shadow-sm space-y-2.5 my-auto">
                      {/* Sender Tag */}
                      <div className="text-[11px] font-semibold text-[#25d366] flex items-center justify-between">
                        <span>~ qualfi</span>
                        <span className="text-[9.5px] text-[#8696a0] font-normal font-sans">under 2s</span>
                      </div>

                      {/* Genuine WhatsApp Message Body */}
                      <div className="text-[11.5px] leading-relaxed text-[#d1d7db] font-sans space-y-2">
                        <div>
                          <span className="font-bold text-white">NEW LEAD DISPATCH</span>
                        </div>

                        <div className="space-y-0.5">
                          <div><span className="font-semibold text-white">Name:</span> Alex Morgan</div>
                          <div><span className="font-semibold text-white">Phone:</span> <span className="text-[#53bdeb] underline font-mono">+44 7911 123456</span></div>
                          <div><span className="font-semibold text-white">Goal:</span> Build lasting strength</div>
                          <div><span className="font-semibold text-white">Current Weight:</span> 78 kg (4 days/wk)</div>
                          <div><span className="font-semibold text-white">Struggle:</span> Progress plateau</div>
                        </div>

                        <div className="space-y-0.5 pt-0.5">
                          <div className="font-semibold text-white">Calculated Blueprint:</div>
                          <div>• 2,420 kcal daily target</div>
                          <div>• 140g Protein · 323g Carbs · 63g Fat</div>
                          <div>• Optimal Split: Push Pull Legs</div>
                        </div>

                        <div className="pt-0.5">
                          <span className="font-bold text-[#25d366]">Intent Score: 94/100 (Hot Buyer)</span>
                        </div>
                      </div>

                      {/* Bottom Timestamp & Delivery Status */}
                      <div className="flex items-center justify-end gap-1 text-[9.5px] text-[#8696a0] pt-0.5">
                        <span>9:41 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Authentic WhatsApp iOS Input Bar */}
                  <div className="relative z-10 flex items-center gap-2 bg-[#1f2c34] px-3 py-2 border-t border-[#202c33]">
                    {/* Plus Icon */}
                    <span aria-hidden="true" className="text-[#00a884] text-xl font-bold px-1">
                      +
                    </span>

                    {/* Pill Text Field */}
                    <div className="flex-1 flex items-center justify-between rounded-full bg-[#2a3942] px-3.5 py-1.5 text-xs text-[#8696a0]">
                      <span className="text-stone-300">Message</span>
                      <svg className="h-4 w-4 fill-[#8696a0]" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                      </svg>
                    </div>

                    {/* Camera and Microphone Icons */}
                    <div className="flex items-center gap-2 text-[#00a884]">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                      </svg>
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
                      </svg>
                    </div>
                  </div>

                </div>
              </RealisticPhone>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* Compact PebbleOption for Struggle and Goal Selection (No Overflow) */
function PebbleOption<T extends string | number>({
  options,
  onPick,
  compact = false,
}: {
  options: readonly { id: T; label: string; note?: string }[];
  onPick: (id: T) => void;
  compact?: boolean;
}) {
  const [hover, setHover] = useState<T | null>(null);

  return (
    <ul className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2.5"} onMouseLeave={() => setHover(null)}>
      {options.map((o) => {
        const isHovered = hover === o.id;
        return (
          <motion.li key={String(o.id)}>
            <motion.button
              onHoverStart={() => setHover(o.id)}
              onFocus={() => setHover(o.id)}
              onBlur={() => setHover(null)}
              onClick={() => {
                playSensoryFeedback("tap");
                onPick(o.id);
              }}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASING.naturalOut }}
              className={`group relative flex w-full items-center justify-between gap-2.5 rounded-2xl border border-stone-200/90 bg-white text-left shadow-xs transition-all ${
                compact ? "p-3 min-h-[48px]" : "p-3.5 min-h-[58px]"
              }`}
            >
              {isHovered && (
                <motion.span
                  layoutId="pebble-highlight"
                  className="absolute inset-0 rounded-2xl bg-[#d9532f] shadow-sm"
                  transition={{ duration: 0.22, ease: EASING.naturalInOut }}
                />
              )}

              <div className="relative z-10 flex-1 pr-1">
                <span
                  className={`font-serif leading-tight transition-colors block ${
                    compact ? "text-sm font-medium" : "text-base font-normal"
                  } ${isHovered ? "text-white" : "text-[#121316]"}`}
                >
                  {o.label}
                </span>
                {o.note && (
                  <span
                    className={`mt-0.5 text-[10.5px] leading-tight transition-colors block ${
                      isHovered ? "text-white/85" : "text-[#52555f]"
                    }`}
                  >
                    {o.note}
                  </span>
                )}
              </div>
            </motion.button>
          </motion.li>
        );
      })}
    </ul>
  );
}

/**
 * Interactive Phone Demo:
 * - iPhone 16 Pro hardware frame
 * - Step 0: Goal
 * - Step 1: Improved Weight & Age controls (Large comfortable stepper buttons)
 * - Step 2: Redesigned Training Days Selector with live split preview
 * - Step 3: Primary Struggle with compact cards (fits screen comfortably, zero overflow)
 * - Step 4: Contact Gate
 * - Step 5: Deliverables + Swooping WhatsApp alert (NO preview button)
 */
function Demo() {
  const d = useDiagnostic();
  const r = d.result || (d.step >= 5 ? compute(d.answers) : null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Split descriptions for Step 2
  const splitDetails: Record<number, { title: string; desc: string }> = {
    2: { title: "Full Body Protocol", desc: "Two intense full body sessions with 72h systemic recovery." },
    3: { title: "Push Pull Legs Split", desc: "Classic hypertrophy rotation targeting each movement pattern." },
    4: { title: "Upper / Lower Split", desc: "Ideal balance of muscle stimulation and 48h recovery between lifts." },
    5: { title: "Push Pull Legs Upper Lower", desc: "High frequency athletic split for dedicated trainees." },
    6: { title: "Push Pull Legs Split x2", desc: "Maximum weekly volume for advanced lifters." },
  };

  // Signature WhatsApp incoming lead alert chime
  useEffect(() => {
    if (r) {
      const timer = setTimeout(() => {
        playSensoryFeedback("whatsapp");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [r]);

  // Step 4 Contact Details -> Calculation shimmer -> Step 5 (Results)
  const handleUnlockPlan = () => {
    setIsCalculating(true);
    playSensoryFeedback("tap");
    setTimeout(() => {
      d.next(); // Advances to Step 5 (Results)
      setIsCalculating(false);
    }, 450);
  };

  return (
    <section id="demo" className="relative overflow-hidden bg-white px-6 py-24 md:px-12">
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12">
        {/* Left Narrative */}
        <div className="lg:col-span-5 space-y-6">
          <SectionEyebrow index="02">Interactive Phone Demo</SectionEyebrow>
          <h2 className="font-serif text-5xl font-light leading-[0.98] text-[#121316] md:text-6xl">
            Be the follower. <span className="italic text-[#d9532f]">Feel the 60 seconds.</span>
          </h2>
          <p className="text-base leading-relaxed text-[#52555f] font-sans">
            Tap through the live iPhone below. Answer the questions, unlock custom numbers, and watch the verified lead
            instantly swoop into the WhatsApp alert.
          </p>

          <div className="space-y-3 pt-2">
            {[
              "Calibrated to your coaching methodology and style",
              "Calculates precise calories, macros, and workout splits",
              "Collects contact info before delivering the full plan",
              "Sends verified leads straight to your WhatsApp in seconds",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-[#121316]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981]/15 text-xs font-bold text-[#047857]">
                  ✓
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right iPhone 16 Pro Mockup + Draggable WhatsApp Lead Card */}
        <div ref={dragConstraintsRef} className="relative lg:col-span-7 flex justify-center items-center min-h-[720px]">
          {/* Stage: a gridded porcelain panel that anchors the phone */}
          <div
            aria-hidden="true"
            className="bg-grid-pattern pointer-events-none absolute inset-x-0 inset-y-8 rounded-[44px] border border-stone-200/70 bg-[#faf7f2] lg:inset-x-8"
          />
          <div className="relative z-10 w-full max-w-[340px]">
            <RealisticPhone
              urlBar="qualfi.app/coachmaya"
              screenClassName="h-[640px] sm:h-[680px]"
            >
              <div className="flex h-full flex-col justify-between py-1">
                {/* Coach Profile Header */}
                <div className="mb-3 flex items-center justify-between border-b border-stone-200/80 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#d9532f] text-xs font-serif font-bold text-white">
                      M
                    </div>
                    <div className="text-xs leading-tight">
                      <b className="font-serif text-sm">Coach Maya</b>
                      <br />
                      <span className="text-[#52555f]">Macro Diagnostic</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#10b981]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#047857]">
                    LIVE
                  </span>
                </div>

                {/* Progress Indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#52555f] mb-1.5">
                    <span>Step {Math.min(d.step + 1, 5)} of 5</span>
                    <span>
                      {d.step === 0
                        ? "20%"
                        : d.step === 1
                        ? "40%"
                        : d.step === 2
                        ? "60%"
                        : d.step === 3
                        ? "80%"
                        : "100%"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full bg-stone-200 overflow-hidden"
                      >
                        <span
                          className="block h-full rounded-full bg-[#d9532f] transition-all duration-300"
                          style={{ width: d.step >= i ? "100%" : "0%" }}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="popLayout" initial={false}>
                  {isCalculating ? (
                    <motion.div
                      key="calculating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="h-12 w-12 rounded-full border-3 border-[#d9532f] border-t-transparent animate-spin" />
                      <p className="font-serif text-lg italic text-[#121316]">
                        Calculating your daily targets…
                      </p>
                      <p className="text-xs text-[#52555f]">
                        Personalizing your nutrition breakdown
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={d.step}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
                      transition={{ duration: 0.24, ease: EASING.naturalOut }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      {d.step < 5 ? (
                        <div>
                          <h3 className="font-serif text-xl sm:text-2xl font-light text-[#121316] mb-3">
                            {QUESTIONS[d.step]}
                          </h3>

                          {/* Step 0: Goal Options */}
                          {d.step === 0 && (
                            <PebbleOption options={GOALS} onPick={(id) => d.pick("goal", id)} />
                          )}

                          {/* Step 1: Improved Bodyweight & Age Controls */}
                          {d.step === 1 && (
                            <div className="space-y-4 pt-1">
                              {/* Bodyweight Card */}
                              <div className="rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs">
                                <div className="flex items-baseline justify-between mb-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    Current Bodyweight
                                  </span>
                                  <div className="font-serif text-3xl font-light text-[#121316]">
                                    {d.answers.weight}
                                    <span className="text-lg italic text-[#d9532f] font-serif ml-1">kg</span>
                                  </div>
                                </div>

                                <Knob
                                  value={d.answers.weight}
                                  min={45}
                                  max={140}
                                  onChange={d.setWeight}
                                  className="mt-2"
                                  fillClassName="bg-[#d9532f]"
                                  knobClassName="rounded-full bg-[#121316] shadow-lg ring-4 ring-white"
                                />
                              </div>

                              {/* Improved Age Selector Card */}
                              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xs">
                                <div>
                                  <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    Age
                                  </span>
                                  <div className="flex items-baseline gap-1 mt-0.5">
                                    <span className="font-serif text-3xl font-light text-[#121316]">
                                      {d.answers.age || 28}
                                    </span>
                                    <span className="text-xs text-stone-500 font-sans">years old</span>
                                  </div>
                                </div>

                                {/* Comfortable Tactile Stepper Buttons */}
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playSensoryFeedback("tap");
                                      d.setAge(Math.max(18, (d.answers.age || 28) - 1));
                                    }}
                                    className="h-10 w-10 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#d9532f] hover:text-white flex items-center justify-center font-bold text-lg text-[#121316] transition-colors active:scale-95 shadow-xs"
                                    aria-label="Decrease age"
                                  >
                                    −
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      playSensoryFeedback("tap");
                                      d.setAge(Math.min(75, (d.answers.age || 28) + 1));
                                    }}
                                    className="h-10 w-10 rounded-full border border-stone-200 bg-stone-50 hover:bg-[#d9532f] hover:text-white flex items-center justify-center font-bold text-lg text-[#121316] transition-colors active:scale-95 shadow-xs"
                                    aria-label="Increase age"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <motion.button
                                onClick={() => {
                                  playSensoryFeedback("tap");
                                  d.next();
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full rounded-full bg-[#121316] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#d9532f] transition-all min-h-[44px]"
                              >
                                CONTINUE →
                              </motion.button>
                            </div>
                          )}

                          {/* Step 2: Redesigned Training Days Selector */}
                          {d.step === 2 && (
                            <div className="space-y-4 pt-1">
                              {/* 5-Pill Selector Row */}
                              <div className="grid grid-cols-5 gap-1.5">
                                {DAYS.map((day) => {
                                  const isSelected = (d.answers.days ?? 4) === day;
                                  return (
                                    <motion.button
                                      key={day}
                                      onClick={() => {
                                        playSensoryFeedback("tap");
                                        d.setDays(day);
                                      }}
                                      whileTap={{ scale: 0.94 }}
                                      className={`rounded-2xl border py-2 text-center transition-all min-h-[50px] flex flex-col items-center justify-center shadow-xs ${
                                        isSelected
                                          ? "border-[#d9532f] bg-[#d9532f] text-white"
                                          : "border-stone-200 bg-white text-[#121316] hover:border-stone-300"
                                      }`}
                                    >
                                      <span className="font-serif text-xl font-normal leading-none">{day}</span>
                                      <span className={`text-[9px] uppercase font-sans mt-0.5 ${isSelected ? "text-white/80" : "text-stone-400"}`}>
                                        days
                                      </span>
                                    </motion.button>
                                  );
                                })}
                              </div>

                              {/* Interactive Split Recommendation Preview */}
                              <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-3.5 text-left space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#047857] block">
                                  Recommended Split
                                </span>
                                <div className="font-serif text-base font-normal text-[#121316]">
                                  {splitDetails[d.answers.days ?? 4]?.title}
                                </div>
                                <p className="text-[11px] text-[#52555f] leading-relaxed">
                                  {splitDetails[d.answers.days ?? 4]?.desc}
                                </p>
                              </div>

                              <motion.button
                                onClick={() => {
                                  playSensoryFeedback("tap");
                                  d.next();
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                className="w-full rounded-full bg-[#121316] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#d9532f] transition-all min-h-[44px]"
                              >
                                CONTINUE →
                              </motion.button>
                            </div>
                          )}

                          {/* Step 3: Compact Primary Struggle (No Falling off Screen) */}
                          {d.step === 3 && (
                            <PebbleOption
                              compact
                              options={STRUGGLES}
                              onPick={(id) => {
                                playSensoryFeedback("tap");
                                d.pick("struggle", id);
                              }}
                            />
                          )}

                          {/* Step 4: Contact details to unlock plan */}
                          {d.step === 4 && (
                            <div className="space-y-3 pt-1">
                              <p className="text-xs text-[#52555f] font-sans leading-relaxed">
                                Submit your details to unlock your custom calorie targets, macros, and workout split.
                              </p>

                              <div className="space-y-2.5">
                                <div>
                                  <label htmlFor="demo-name" className="block text-[10px] font-bold uppercase tracking-wider text-[#121316]/70 mb-1">
                                    Your Name
                                  </label>
                                  <input
                                    id="demo-name"
                                    type="text"
                                    autoComplete="off"
                                    value={d.answers.name || ""}
                                    onChange={(e) => d.setContact(e.target.value, d.answers.contact || "")}
                                    placeholder="Alex Morgan"
                                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-[#121316] outline-none transition-colors focus:border-[#d9532f] focus:ring-1 focus:ring-[#d9532f] min-h-[44px]"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="demo-contact" className="block text-[10px] font-bold uppercase tracking-wider text-[#121316]/70 mb-1">
                                    WhatsApp or Instagram
                                  </label>
                                  <input
                                    id="demo-contact"
                                    type="text"
                                    autoComplete="off"
                                    value={d.answers.contact || ""}
                                    onChange={(e) => d.setContact(d.answers.name || "", e.target.value)}
                                    placeholder="+44 7911 123456 or @alexfit"
                                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-[#121316] outline-none transition-colors focus:border-[#d9532f] focus:ring-1 focus:ring-[#d9532f] min-h-[44px]"
                                  />
                                </div>

                                <motion.button
                                  onClick={handleUnlockPlan}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="mt-2 w-full rounded-full bg-[#d9532f] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(217,83,47,0.3)] hover:bg-[#b83e1d] transition-colors min-h-[44px]"
                                >
                                  Unlock My Nutrition Blueprint →
                                </motion.button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Step 5: Results Display inside Phone */
                        r && (
                          <div className="space-y-3.5 text-center my-auto">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#047857] font-bold">
                                Your Custom Fuel Target
                              </span>
                              <div className="font-serif text-4xl sm:text-5xl font-light text-[#121316] mt-1">
                                {r.calories}
                                <span className="text-base italic text-[#d9532f]"> kcal</span>
                              </div>
                            </div>

                            {/* Macro Stones */}
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                ["Protein", `${r.protein}g`, "#f4d3c4"],
                                ["Carbs", `${r.carbs}g`, "#d8e5db"],
                                ["Fat", `${r.fat}g`, "#d9532f"],
                              ].map(([k, v, color]) => (
                                <div
                                  key={k}
                                  className="rounded-2xl p-2 text-[#121316]"
                                  style={{ background: color }}
                                >
                                  <div className={`font-serif text-lg font-bold ${k === "Fat" ? "text-white" : "text-[#121316]"}`}>
                                    {v}
                                  </div>
                                  <div className={`text-[8.5px] uppercase tracking-wider font-semibold ${k === "Fat" ? "text-white/80" : "opacity-75"}`}>
                                    {k}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-white p-2.5 text-xs space-y-0.5">
                              <div><span className="text-[#047857] font-bold">Training Split:</span> {r.split}</div>
                              <div className="text-[11px] text-stone-500">Focus: {r.struggleLabel}</div>
                            </div>

                            {/* Download Custom Blueprint PDF Button */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                playSensoryFeedback("success");
                                downloadCustomBlueprintPdf(r, d.answers);
                              }}
                              className="w-full rounded-2xl bg-[#121316] py-2.5 px-3 text-center text-xs font-bold text-white hover:bg-[#d9532f] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                            >
                              <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              <span>Download PDF Blueprint</span>
                            </motion.button>

                            <button
                              onClick={() => {
                                playSensoryFeedback("tap");
                                d.reset();
                              }}
                              className="text-xs text-[#52555f] underline underline-offset-4 hover:text-[#d9532f] transition-colors"
                            >
                              Restart Diagnostic ↺
                            </button>
                          </div>
                        )
                      )}

                      {/* Back button */}
                      {d.step > 0 && d.step < 5 && (
                        <button
                          onClick={() => {
                            playSensoryFeedback("tap");
                            d.back();
                          }}
                          className="mt-3 text-xs text-[#52555f] underline underline-offset-4 text-left"
                        >
                          ← Back
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RealisticPhone>
          </div>

          {/* Fluidly Draggable WhatsApp Notification Card (20 Motion Principles) */}
          <AnimatePresence>
            {r && (
              <motion.div
                key="swooping-lead"
                drag
                dragConstraints={dragConstraintsRef}
                dragElastic={0.25}
                dragMomentum={true}
                dragTransition={{ bounceStiffness: 320, bounceDamping: 24, power: 0.18 }}
                whileDrag={{
                  scale: 1.05,
                  rotate: 1.5,
                  cursor: "grabbing",
                  boxShadow: "0 35px 75px -10px rgba(0,0,0,0.38)",
                }}
                whileHover={{ scale: 1.02, cursor: "grab" }}
                onDragStart={() => {
                  isDraggingRef.current = true;
                  playSensoryFeedback("tap");
                }}
                onDragEnd={() => {
                  setTimeout(() => {
                    isDraggingRef.current = false;
                  }, 120);
                  playSensoryFeedback("tap");
                }}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    playSensoryFeedback("tap");
                    setShowChatModal(true);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Open the full WhatsApp lead alert"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowChatModal(true);
                  }
                }}
                className="absolute -bottom-4 right-2 w-[min(90vw,340px)] rounded-3xl border border-stone-200/90 bg-white/95 p-4 shadow-[0_25px_60px_rgba(18,19,22,0.18)] md:-right-8 md:bottom-10 z-30 select-none touch-none hover:shadow-2xl backdrop-blur-md transition-shadow"
                initial={{ opacity: 0, scale: 0.94, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease: EASING.naturalInOut, delay: 0.2 }}
              >
                <div>
                  {/* Subtle Grab Handle */}
                  <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-stone-300/80" />

                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#10b981] text-white font-bold shadow-sm text-sm">
                      ✓
                    </span>
                    <div className="text-xs leading-tight">
                      <b className="text-sm text-[#121316]">WhatsApp · qualfi</b>
                      <br />
                      <span className="font-semibold text-[#047857]">
                        {r.hot ? `Hot Lead · ${r.score}/100 · ${r.ping}s` : `Warm Lead · ${r.score}/100`}
                      </span>
                    </div>
                  </div>

                  {/* Clean WhatsApp Message Preview Payload */}
                  <div className="mt-3 rounded-2xl bg-[#0b141a] p-3 text-left font-sans text-xs text-[#e9edef] border border-white/5 shadow-inner space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#25d366] font-mono border-b border-white/10 pb-1">
                      <span className="font-bold">INCOMING LEAD ALERT</span>
                      <span className="text-stone-400 font-sans">under 2s</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Prospect:</span>{" "}
                      <b className="text-white">{r.name}</b> ·{" "}
                      <span className="text-[#25d366] font-mono">{r.contact}</span>
                    </div>
                    <div className="text-[11px] text-stone-300">
                      Goal: {r.goalLabel} ({d.answers.weight}kg, {d.answers.days} days weekly)
                    </div>
                    <div className="text-[10.5px] text-[#ffd279]">
                      Focus: {r.struggleLabel}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-stone-400">
                      <span>Delivered in 1.4s</span>
                      <span className="text-[#53bdeb]">✓✓</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* High-Fidelity WhatsApp Chat Preview Modal */}
      {r && (
        <WhatsAppPreviewModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          data={{
            name: r.name,
            contact: r.contact,
            goalLabel: r.goalLabel,
            struggleLabel: r.struggleLabel,
            age: d.answers.age || 28,
            weight: d.answers.weight,
            days: d.answers.days ?? 4,
            calories: r.calories,
            protein: r.protein,
            carbs: r.carbs,
            fat: r.fat,
            split: r.split,
            score: r.score,
            hot: r.hot,
            ping: r.ping,
          }}
        />
      )}
    </section>
  );
}

/* Get Your Funnel Section */
function FunnelSection() {
  return <GetYourFunnel />;
}

/* Minimalist Footer */
function Footer() {
  return (
    <footer className="overflow-hidden px-6 pt-20 pb-12 md:px-12 bg-[#faf7f2]">
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between gap-6 text-sm">
        <p className="max-w-xs text-[#52555f] font-sans">
          Custom diagnostic tools for coaches who want qualified clients instead of cold DMs.
        </p>
        <ul className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs uppercase tracking-wider font-semibold text-[#121316]/80">
          <li>
            <a href="#demo" className="hover:text-[#d9532f] transition-colors">
              Live Demo
            </a>
          </li>
          <li>
            <a href="#funnel" className="hover:text-[#d9532f] transition-colors">
              Get Your Funnel
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/qualfiapp/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d9532f] transition-colors"
            >
              Instagram (@qualfiapp)
            </a>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-[#d9532f] transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-[#d9532f] transition-colors">
              Terms of Service
            </Link>
          </li>
        </ul>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-stone-200/90 pt-5 text-xs text-[#52555f]">
        <span>© 2026 qualfi</span>
        <span className="font-serif italic">Built for coaches, live in 72 hours.</span>
      </div>

      <motion.p
        initial={{ y: "40%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASING.naturalOut }}
        className="font-serif mt-12 -mb-[0.2em] text-[28vw] font-light italic leading-none tracking-[-0.05em] text-[#d9532f] select-none pointer-events-none"
      >
        qualfi
      </motion.p>
    </footer>
  );
}

/**
 * DesktopLandingPage: Complete desktop layout with unchanged styling,
 * mockups, layout, and animations.
 */
export function DesktopLandingPage() {
  return (
    <div className="relative">
      <Header />
      <main id="main-content">
        <Hero />
        <TopographicSectionDivider
          variant="hero-to-demo"
          topColor="#faf7f2"
          bottomColor="#ffffff"
        />
        <HowItWorks index="01" />
        <Demo />
        <TopographicSectionDivider
          variant="demo-to-funnel"
          topColor="#ffffff"
          bottomColor="#faf7f2"
        />
        <FunnelSection />
        <TopographicSectionDivider
          variant="funnel-to-footer"
          topColor="#faf7f2"
          bottomColor="#faf7f2"
        />
      </main>
      <Footer />
    </div>
  );
}
