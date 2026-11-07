"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToolTheme, useEnquiry } from "@/lib/diagnostic";
import { EASING, playSensoryFeedback } from "@/lib/design-system";

export interface StudioThemeConfig {
  id: ToolTheme;
  name: string;
  paletteName: string;
  accent: string;
  accentBg: string;
  glow: string;
  border: string;
  phoneBg: string;
  phoneSurface: string;
  phoneText: string;
  phoneSub: string;
  tagBg: string;
  tagText: string;
  pillBorder: string;
  pillActiveBg: string;
}

export const STUDIO_THEMES: StudioThemeConfig[] = [
  {
    id: "terracotta",
    name: "Terracotta Stone",
    paletteName: "Raw Clay & Stone",
    accent: "#d9532f",
    accentBg: "bg-[#d9532f]",
    glow: "rgba(217, 83, 47, 0.22)",
    border: "border-[#d9532f]/40",
    phoneBg: "bg-[#faf7f2]",
    phoneSurface: "bg-white",
    phoneText: "text-[#121316]",
    phoneSub: "text-[#52555f]",
    tagBg: "bg-[#d9532f]/10",
    tagText: "text-[#d9532f]",
    pillBorder: "border-[#d9532f]/30",
    pillActiveBg: "bg-[#d9532f]",
  },
  {
    id: "lime",
    name: "Titanium Lime",
    paletteName: "Acid Lime & Obsidian",
    accent: "#cbfb45",
    accentBg: "bg-[#cbfb45]",
    glow: "rgba(203, 251, 69, 0.22)",
    border: "border-[#cbfb45]/40",
    phoneBg: "bg-[#0d120f]",
    phoneSurface: "bg-[#16201a]",
    phoneText: "text-[#f2fdf4]",
    phoneSub: "text-[#86958b]",
    tagBg: "bg-[#cbfb45]/15",
    tagText: "text-[#cbfb45]",
    pillBorder: "border-[#cbfb45]/30",
    pillActiveBg: "bg-[#cbfb45]",
  },
  {
    id: "mint",
    name: "Obsidian Mint",
    paletteName: "Clinical Mint & Slate",
    accent: "#34d399",
    accentBg: "bg-[#34d399]",
    glow: "rgba(52, 211, 153, 0.22)",
    border: "border-[#34d399]/40",
    phoneBg: "bg-[#0b1219]",
    phoneSurface: "bg-[#13202c]",
    phoneText: "text-[#f0fdf9]",
    phoneSub: "text-[#809ba8]",
    tagBg: "bg-[#34d399]/15",
    tagText: "text-[#34d399]",
    pillBorder: "border-[#34d399]/30",
    pillActiveBg: "bg-[#34d399]",
  },
  {
    id: "sand",
    name: "Desert Clay",
    paletteName: "Kiln Terracotta & Sand",
    accent: "#e07a5f",
    accentBg: "bg-[#e07a5f]",
    glow: "rgba(224, 122, 95, 0.22)",
    border: "border-[#e07a5f]/40",
    phoneBg: "bg-[#fcf8f2]",
    phoneSurface: "bg-white",
    phoneText: "text-[#1d1613]",
    phoneSub: "text-[#665a54]",
    tagBg: "bg-[#e07a5f]/12",
    tagText: "text-[#e07a5f]",
    pillBorder: "border-[#e07a5f]/30",
    pillActiveBg: "bg-[#e07a5f]",
  },
];

export const FOCUS_LIST = [
  {
    id: "Hypertrophy & Strength",
    label: "Hypertrophy & Strength",
    icon: "01",
    calories: "2,480",
    protein: "180g",
    carbs: "260g",
    fat: "80g",
    split: "Upper / Lower Split (4 Days)",
  },
  {
    id: "Fat Loss & Body Recomp",
    label: "Fat Loss & Body Recomp",
    icon: "02",
    calories: "2,120",
    protein: "190g",
    carbs: "190g",
    fat: "65g",
    split: "Push Pull Legs Split (5 Days)",
  },
  {
    id: "Hyrox & Hybrid Athlete",
    label: "Hyrox & Hybrid Athlete",
    icon: "03",
    calories: "2,750",
    protein: "175g",
    carbs: "320g",
    fat: "85g",
    split: "Hybrid Strength & Engine (5 Days)",
  },
  {
    id: "Executive Longevity",
    label: "Executive Longevity",
    icon: "04",
    calories: "2,250",
    protein: "160g",
    carbs: "220g",
    fat: "75g",
    split: "Full Body Density Protocol (3 Days)",
  },
  {
    id: "Metabolic Adherence",
    label: "Metabolic Adherence",
    icon: "05",
    calories: "1,980",
    protein: "165g",
    carbs: "180g",
    fat: "60g",
    split: "Progressive Overload Split (4 Days)",
  },
];

export const DELIVERABLE_MODULES = [
  {
    id: "Daily Caloric Target (BMR/TDEE)",
    title: "Daily Caloric Target",
    desc: "Mifflin-St Jeor equation calibrated with custom surplus or deficit",
    badge: "CALORIES",
  },
  {
    id: "Macronutrient Split (P/C/F grams)",
    title: "Macronutrient Breakdown",
    desc: "Target grams for Protein, Carbs, and Fats based on bodyweight",
    badge: "MACROS",
  },
  {
    id: "Optimal Training Split",
    title: "Optimal Training Protocol",
    desc: "Push Pull Legs, Upper/Lower, or Full Body matched to schedule",
    badge: "SPLIT",
  },
  {
    id: "0 to 100 Intent Scoring",
    title: "0 to 100 Lead Intent Scoring",
    desc: "Algorithmic scoring separating cold traffic from hot buyers",
    badge: "QUALIFY",
  },
  {
    id: "<2s Encrypted WhatsApp Routing",
    title: "<2s WhatsApp Lead Dispatch",
    desc: "Encrypted dispatch directly to coach phone while prospect is looking",
    badge: "SPEED",
  },
  {
    id: "Downloadable Custom PDF Blueprint",
    title: "Custom PDF Blueprint",
    desc: "Branded downloadable nutrition and training guide with coach comments",
    badge: "PDF ASSET",
  },
];

export function BuildYoursStudio() {
  const f = useEnquiry();
  const [activeStepTab, setActiveStepTab] = useState<"coach" | "specialty" | "theme" | "deliverables">("coach");

  const currentTheme = useMemo(() => {
    return STUDIO_THEMES.find((t) => t.id === f.values.theme) || STUDIO_THEMES[0];
  }, [f.values.theme]);

  const currentFocus = useMemo(() => {
    return FOCUS_LIST.find((fc) => fc.id === f.values.focus) || FOCUS_LIST[0];
  }, [f.values.focus]);

  const cleanHandle = useMemo(() => {
    const raw = f.values.handle.trim();
    if (!raw) return "coachmaya";
    return raw.replace(/^@+/, "");
  }, [f.values.handle]);

  const coachName = f.values.name.trim() || "Maya Lin";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSensoryFeedback("success");
    f.submit(e);
  };

  const ticketCode = useMemo(() => {
    const slug = cleanHandle.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase() || "QUALFI";
    return `SPEC-${slug}-2026`;
  }, [cleanHandle]);

  const whatsAppHref = useMemo(() => {
    const phone = "447911123456";
    const msg = `Hey qualfi team, I just configured my bio funnel!\n\nSpec Ticket: ${ticketCode}\nCoach: ${coachName} (@${cleanHandle})\nSpecialty: ${f.values.focus}\nTheme: ${currentTheme.name}\nWhatsApp: ${f.values.whatsapp || "Not provided"}\nActive Modules: ${f.values.deliverables.length}\n\nLet's get this live in 72 hours.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }, [ticketCode, coachName, cleanHandle, f.values.focus, currentTheme.name, f.values.whatsapp, f.values.deliverables.length]);

  return (
    <section id="build" className="relative overflow-hidden bg-[#121316] px-6 py-24 text-white md:px-12 md:py-32">
      {/* Anchor alias for legacy and mobile hash links */}
      <div id="enquire" className="absolute -top-10 left-0 h-0 w-0 pointer-events-none" />
      <div id="mobile-build" className="absolute -top-10 left-0 h-0 w-0 pointer-events-none" />
      <div id="mobile-enquire" className="absolute -top-10 left-0 h-0 w-0 pointer-events-none" />

      {/* Dynamic Ambient Glow matching selected theme */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[550px] w-[550px] rounded-full blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: currentTheme.glow }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[550px] w-[550px] rounded-full blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: currentTheme.glow }}
      />

      {/* Precision Background Topographic Lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="studio-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#studio-grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-stone-300">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentTheme.accent }} />
            <span>Interactive Funnel Studio</span>
            <span className="text-white/40">/</span>
            <span className="text-stone-400">72 Hour Delivery</span>
          </div>

          <h2 className="mt-5 font-serif text-4xl font-light tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.02]">
            Build your bespoke <span className="italic font-normal" style={{ color: currentTheme.accent }}>bio funnel.</span>
          </h2>

          <p className="mt-4 max-w-2xl text-base sm:text-lg text-stone-300 font-sans leading-relaxed">
            Select your methodology, visual signature, and client deliverables. Watch your custom qualfi bio funnel calibrate in real time in the hardware preview.
          </p>
        </div>

        {/* Studio Grid: Configurator (Left) + Live Phone Preview (Right) */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* LEFT COLUMN: Controls & Configurator (7 Columns) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Coach Identity & Handle */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#121316]" style={{ backgroundColor: currentTheme.accent }}>
                    1
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Coach Credentials & Bio Route
                  </h3>
                </div>
                <span className="text-xs font-mono text-stone-400">qualfi.com/@{cleanHandle}</span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Coach Name
                  </label>
                  <input
                    value={f.values.name}
                    onChange={f.set("name")}
                    placeholder="Maya Lin"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white focus:bg-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">@</span>
                    <input
                      value={f.values.handle.replace(/^@/, "")}
                      onChange={(e) => f.setField("handle", e.target.value)}
                      placeholder="mayafit"
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-8 pr-4 py-3 text-base text-white outline-none transition-colors focus:border-white focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    WhatsApp or Mobile for <span style={{ color: currentTheme.accent }}>&lt;2s Lead Alerts</span>
                  </label>
                  <input
                    value={f.values.whatsapp}
                    onChange={f.set("whatsapp")}
                    placeholder="+44 7911 123456"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-white focus:bg-white/10"
                  />
                  <p className="mt-1.5 text-xs text-stone-400">
                    High intent leads trigger an encrypted notification straight to this number within 2 seconds of completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Coaching Specialty / Focus (Interactive Chips) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#121316]" style={{ backgroundColor: currentTheme.accent }}>
                  2
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Coaching Focus & Split Formula
                  </h3>
                  <p className="text-xs text-stone-400">Calibrates the underlying diagnostic questions and macro calculations</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {FOCUS_LIST.map((fc) => {
                  const isSelected = f.values.focus === fc.id;
                  return (
                    <motion.button
                      key={fc.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        playSensoryFeedback("tap");
                        f.setField("focus", fc.id);
                      }}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold transition-all border ${
                        isSelected
                          ? `border-transparent text-[#121316] shadow-lg`
                          : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20 hover:bg-white/10"
                      }`}
                      style={{
                        backgroundColor: isSelected ? currentTheme.accent : undefined,
                      }}
                    >
                      <span>{fc.icon}</span>
                      <span>{fc.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Brand Visual Signature (Color Palette) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#121316]" style={{ backgroundColor: currentTheme.accent }}>
                  3
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Visual Brand Signature
                  </h3>
                  <p className="text-xs text-stone-400">Select the palette calibrated to your fitness brand aesthetic</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {STUDIO_THEMES.map((theme) => {
                  const isSelected = f.values.theme === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playSensoryFeedback("tap");
                        f.setField("theme", theme.id);
                      }}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                        isSelected
                          ? "border-white bg-white/10 shadow-lg ring-1 ring-white/20"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-7 w-7 rounded-full shadow-inner flex items-center justify-center text-xs font-bold text-[#121316]"
                          style={{ backgroundColor: theme.accent }}
                        >
                          {isSelected && "✓"}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-white">{theme.name}</span>
                          <span className="block text-xs text-stone-400">{theme.paletteName}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <span className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: theme.accent }} />
                        <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: theme.id === "terracotta" || theme.id === "sand" ? "#faf7f2" : "#0d120f" }} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Deliverables Engine (Modular Feature Toggles) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-[#121316]" style={{ backgroundColor: currentTheme.accent }}>
                    4
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Client Deliverable Modules
                    </h3>
                    <p className="text-xs text-stone-400">What prospects calculate and unlock in exchange for their contact info</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-semibold text-stone-300">
                  {f.values.deliverables.length} Active
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {DELIVERABLE_MODULES.map((item) => {
                  const isChecked = f.values.deliverables.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playSensoryFeedback("tap");
                        f.toggleDeliverable(item.id);
                      }}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isChecked
                          ? "border-white/30 bg-white/10 shadow-sm"
                          : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-90"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: isChecked ? currentTheme.accent : "#8c8e96" }}>
                          {item.badge}
                        </span>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] font-bold transition-all ${
                            isChecked
                              ? "border-transparent text-[#121316]"
                              : "border-white/20 bg-transparent text-transparent"
                          }`}
                          style={{ backgroundColor: isChecked ? currentTheme.accent : undefined }}
                        >
                          ✓
                        </div>
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-white">{item.title}</h4>
                      <p className="mt-1 text-xs text-stone-400 leading-normal">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Submit Experience & Progressive Multiphase Assembly */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {f.state === "idle" && (
                  <motion.form
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-3"
                  >
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="group flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full py-4 px-8 text-base font-bold text-[#121316] shadow-2xl transition-all"
                      style={{ backgroundColor: currentTheme.accent }}
                    >
                      <span>Build My Custom Bio Funnel</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </motion.button>
                    <p className="text-center text-xs text-stone-400">
                      Bespoke prototype ready in 72 hours. Zero upfront commitment.
                    </p>
                  </motion.form>
                )}

                {f.state === "sending" && (
                  <motion.div
                    key="sending"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="rounded-3xl border border-white/20 bg-white/5 p-8 text-center space-y-5"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                      <span className="relative flex h-5 w-5">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                          style={{ backgroundColor: currentTheme.accent }}
                        />
                        <span
                          className="relative inline-flex h-5 w-5 rounded-full"
                          style={{ backgroundColor: currentTheme.accent }}
                        />
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-white tracking-tight">
                        {f.phase === 1 && `Calibrating Biometrics for @${cleanHandle}`}
                        {f.phase === 2 && "Configuring <2s Encrypted WhatsApp Dispatch"}
                        {f.phase >= 3 && "Synthesizing Custom Branded PDF Blueprint"}
                      </h4>
                      <p className="mt-1 text-xs text-stone-400 font-mono">
                        {f.phase === 1 && "Aligning Mifflin-St Jeor TDEE formulas and macro ratios..."}
                        {f.phase === 2 && `Linking verified webhook endpoint to ${f.values.whatsapp || "mobile"}...`}
                        {f.phase >= 3 && `Embedding ${currentTheme.name} typography and vector layout...`}
                      </p>
                    </div>

                    {/* Progressive Animation Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: currentTheme.accent,
                          width: f.phase === 1 ? "35%" : f.phase === 2 ? "72%" : "96%",
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {f.state === "sent" && (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASING.naturalOut }}
                    className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/[0.03] p-8 space-y-6 backdrop-blur-md shadow-2xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-[#121316]"
                          style={{ backgroundColor: currentTheme.accent }}
                        >
                          ✓
                        </div>
                        <div>
                          <span className="text-xs font-mono font-semibold text-stone-400">SPECIFICATION TICKET VERIFIED</span>
                          <h4 className="text-xl font-bold text-white">{ticketCode}</h4>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                        Prototype Ready in 72h
                      </span>
                    </div>

                    <div className="grid gap-3 text-xs sm:grid-cols-2">
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="block text-stone-400 font-mono">COACH IDENTITY</span>
                        <span className="text-sm font-bold text-white">{coachName} (@{cleanHandle})</span>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="block text-stone-400 font-mono">BIO LINK DESTINATION</span>
                        <span className="text-sm font-bold text-white">qualfi.com/@{cleanHandle}</span>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="block text-stone-400 font-mono">METHODOLOGY</span>
                        <span className="text-sm font-bold text-white">{f.values.focus}</span>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="block text-stone-400 font-mono">ACTIVE MODULES</span>
                        <span className="text-sm font-bold text-white">{f.values.deliverables.length} Deliverable Features</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <a
                        href={whatsAppHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playSensoryFeedback("tap")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 px-6 text-sm font-bold text-[#121316] shadow-xl hover:opacity-95 transition-opacity"
                        style={{ backgroundColor: currentTheme.accent }}
                      >
                        <span>Dispatch Spec to qualfi Engineers via WhatsApp</span>
                        <span>→</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          playSensoryFeedback("tap");
                          f.reset();
                        }}
                        className="rounded-full border border-white/20 bg-white/5 py-3.5 px-6 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                      >
                        Edit Configuration ↺
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Interactive iPhone Hardware Preview (5 Columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative mx-auto max-w-[340px]">
              {/* Dynamic Aura behind phone */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-[60px] blur-3xl opacity-40 transition-colors duration-500"
                style={{ backgroundColor: currentTheme.accent }}
              />

              {/* iPhone 16 Pro Hardware Shell */}
              <div className="relative rounded-[50px] border-[10px] border-[#222428] bg-[#000000] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                {/* Dynamic Island Pill */}
                <div className="absolute left-1/2 top-5 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-[#000000] shadow-sm flex items-center justify-between px-2.5">
                  <div className="h-2 w-2 rounded-full bg-[#111111]" />
                  <div className="h-2 w-2 rounded-full bg-[#0d1c24]" />
                </div>

                {/* Speaker Micro Slit */}
                <div className="absolute left-1/2 top-3 z-30 h-1 w-12 -translate-x-1/2 rounded-full bg-[#1e2022]" />

                {/* Inner Screen */}
                <div className={`relative overflow-hidden rounded-[38px] ${currentTheme.phoneBg} min-h-[580px] p-4 pt-10 flex flex-col justify-between transition-colors duration-300`}>
                  {/* Glass Sheen */}
                  <div className="pointer-events-none absolute -left-20 top-0 h-full w-48 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                  {/* Top Safari Mockup Bar */}
                  <div className="relative z-10 mb-4 rounded-full border border-black/5 bg-black/5 px-3 py-1.5 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3 w-3 text-stone-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-[11px] font-medium font-mono ${currentTheme.phoneText} truncate max-w-[160px]`}>
                        qualfi.com/@{cleanHandle}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold">AA</span>
                  </div>

                  {/* Coach Identity Header inside Phone */}
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-[#121316] shadow-sm"
                          style={{ backgroundColor: currentTheme.accent }}
                        >
                          {coachName.charAt(0) || "Q"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-black tracking-tight ${currentTheme.phoneText}`}>
                              {coachName}
                            </span>
                            <svg className="h-3.5 w-3.5 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className={`block text-[11px] font-medium ${currentTheme.phoneSub}`}>
                            {f.values.focus}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        LIVE
                      </span>
                    </div>

                    {/* Progress Bar in Phone */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold tracking-wider text-stone-400">
                        <span>CALIBRATED BLUEPRINT</span>
                        <span>100%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                        <div className="h-full rounded-full" style={{ backgroundColor: currentTheme.accent, width: "100%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Calculated Deliverables Preview Inside Phone */}
                  <div className="relative z-10 my-4 space-y-3">
                    {/* Calorie Card */}
                    <div className={`rounded-2xl ${currentTheme.phoneSurface} p-3.5 shadow-sm border border-black/5`}>
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        Daily Caloric Intake
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className={`text-2xl font-black ${currentTheme.phoneText}`}>
                          {currentFocus.calories}
                        </span>
                        <span className="text-xs font-semibold text-stone-400">kcal / day</span>
                      </div>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`rounded-xl ${currentTheme.phoneSurface} p-2 text-center border border-black/5`}>
                        <span className="block text-[9px] font-mono text-stone-400">PROTEIN</span>
                        <span className={`text-xs font-bold ${currentTheme.phoneText}`}>{currentFocus.protein}</span>
                      </div>
                      <div className={`rounded-xl ${currentTheme.phoneSurface} p-2 text-center border border-black/5`}>
                        <span className="block text-[9px] font-mono text-stone-400">CARBS</span>
                        <span className={`text-xs font-bold ${currentTheme.phoneText}`}>{currentFocus.carbs}</span>
                      </div>
                      <div className={`rounded-xl ${currentTheme.phoneSurface} p-2 text-center border border-black/5`}>
                        <span className="block text-[9px] font-mono text-stone-400">FATS</span>
                        <span className={`text-xs font-bold ${currentTheme.phoneText}`}>{currentFocus.fat}</span>
                      </div>
                    </div>

                    {/* Training Split Card */}
                    <div className={`rounded-xl ${currentTheme.phoneSurface} p-3 border border-black/5 flex items-center justify-between`}>
                      <div>
                        <span className="block text-[9px] font-mono text-stone-400">RECOMMENDED PROTOCOL</span>
                        <span className={`text-xs font-bold ${currentTheme.phoneText}`}>
                          {currentFocus.split}
                        </span>
                      </div>
                      <span className="text-sm">{currentFocus.icon}</span>
                    </div>

                    {/* Algorithmic Score Badge */}
                    <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 border border-emerald-500/20">
                      <span className="text-[11px] font-bold text-emerald-600">Lead Purchase Intent</span>
                      <span className="text-xs font-mono font-black text-emerald-600">94 / 100</span>
                    </div>
                  </div>

                  {/* Unlock Button Inside Phone */}
                  <div className="relative z-10 pt-2">
                    <button
                      type="button"
                      onClick={() => playSensoryFeedback("tap")}
                      className="w-full rounded-full py-3 px-4 text-xs font-bold text-[#121316] shadow-md transition-all active:scale-95"
                      style={{ backgroundColor: currentTheme.accent }}
                    >
                      Receive Blueprint on WhatsApp →
                    </button>
                    <span className="mt-1.5 block text-center text-[9px] text-stone-400">
                      Dispatches lead to coach in &lt;2s
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badges outside phone */}
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -left-6 top-24 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#121316]/95 px-3.5 py-1.5 shadow-xl backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold text-white">&lt;2s WhatsApp Dispatch</span>
              </motion.div>

              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -right-6 bottom-24 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#121316]/95 px-3.5 py-1.5 shadow-xl backdrop-blur-md"
              >
                <span className="h-2 w-2 rounded-full bg-[#d9532f]" />
                <span className="text-[11px] font-bold text-white">+420% vs Dead Linktrees</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
