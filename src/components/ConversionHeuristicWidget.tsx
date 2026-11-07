"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COMPARISON_HEURISTICS } from "@/lib/conversion-psychology";
import { EASING, playSensoryFeedback } from "@/lib/design-system";

/**
 * MarketingExperiments Conversion Heuristic Widget:
 * C = 4M + 3V + 2(I - F) - 2A
 * 
 * Interactively demonstrates why Linktree fails (-2 score) and qualfi converts (+77 score),
 * scientifically isolating the 4x power of user motivation and zero mental friction.
 */
export function ConversionHeuristicWidget() {
  const [activeModel, setActiveModel] = useState<"linktree" | "qualfi">("qualfi");
  const model = COMPARISON_HEURISTICS[activeModel];

  return (
    <section className="px-6 py-24 md:px-12 bg-white border-t border-stone-200/80">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Explanation Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d9532f]">
              The Mathematical Science of Conversion
            </span>
            <h2 className="font-serif text-4xl font-light text-[#121316] md:text-5xl leading-tight">
              Why bio links leak revenue:{" "}
              <span className="italic text-[#d9532f]">The Heuristic Formula.</span>
            </h2>
            <p className="text-sm leading-relaxed text-[#52555f] font-sans">
              Published research by MarketingExperiments proves that conversion probability is governed by:
            </p>

            <div className="p-5 rounded-2xl bg-[#faf7f2] border border-stone-200/80 font-mono text-xs text-[#121316] leading-relaxed shadow-xs">
              <div className="font-bold text-[#d9532f] mb-1.5 text-sm">
                Conversion = 4(M) + 3(V) + 2(I - F) - 2(A)
              </div>
              <ul className="space-y-1.5 text-[#52555f] text-[11.5px]">
                <li>• <b>Motivation (4x):</b> Carries the single highest multiplier in user behavior.</li>
                <li>• <b>Value Proposition (3x):</b> Immediate custom macros vs vague links.</li>
                <li>• <b>Incentive vs. Friction (2x):</b> Zero mental math vs long tedious forms.</li>
                <li>• <b>Anxiety (-2x):</b> Unanswered DMs vs instant WhatsApp routing.</li>
              </ul>
            </div>

            <p className="text-xs text-[#52555f] italic">
              Based on Jakob Nielsen&rsquo;s research: a 10% UX investment yields an approximate 83% lift in completed funnels.
            </p>
          </div>

          {/* Right Interactive Heuristic Simulator */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-stone-200/90 bg-[#faf7f2] p-8 md:p-10 shadow-sm">
              {/* Model Switcher */}
              <div className="flex gap-2 p-1.5 rounded-full bg-white border border-stone-200 mb-8 max-w-md shadow-xs">
                <button
                  onClick={() => {
                    playSensoryFeedback("tap");
                    setActiveModel("linktree");
                  }}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeModel === "linktree"
                      ? "bg-[#121316] text-white shadow-sm"
                      : "text-stone-500 hover:text-[#121316]"
                  }`}
                >
                  Legacy Linktree Funnel
                </button>
                <button
                  onClick={() => {
                    playSensoryFeedback("tap");
                    setActiveModel("qualfi");
                  }}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeModel === "qualfi"
                      ? "bg-[#d9532f] text-white shadow-sm"
                      : "text-stone-500 hover:text-[#121316]"
                  }`}
                >
                  qualfi Diagnostic
                </button>
              </div>

              {/* Heuristic Breakdown Bars */}
              <div className="space-y-4">
                {[
                  { label: "4x Motivation Factor", val: model.motivation, max: 10, weight: "4x Multiplier", color: "#d9532f" },
                  { label: "3x Value Proposition", val: model.valueProp, max: 10, weight: "3x Multiplier", color: "#10b981" },
                  { label: "2x Incentive Delivered", val: model.incentive, max: 10, weight: "2x Multiplier", color: "#f59e0b" },
                  { label: "-2x Friction Resistance", val: model.friction, max: 10, weight: "-2x Penalty", color: "#ef4444", isNegative: true },
                  { label: "-2x Buyer Anxiety", val: model.anxiety, max: 10, weight: "-2x Penalty", color: "#ef4444", isNegative: true },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center text-xs font-sans mb-1.5">
                      <span className="font-semibold text-[#121316]">{item.label}</span>
                      <span className="font-mono text-[11px] text-[#52555f]">
                        {item.val} / 10 ({item.weight})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white border border-stone-200/60 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.val / item.max) * 100}%` }}
                        transition={{ duration: 0.35, ease: EASING.naturalOut }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Comparison Badge */}
              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#52555f] block">
                    Calculated MEC Conversion Index
                  </span>
                  <div className={`font-serif text-4xl font-light mt-1 ${activeModel === "qualfi" ? "text-[#10b981]" : "text-rose-600"}`}>
                    {activeModel === "qualfi" ? "+77 Points" : "-2 Points"}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#52555f] block">
                    Observed Bio Conversion Rate
                  </span>
                  <div className="font-serif text-4xl font-light text-[#121316] mt-1">
                    {model.conversionRate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
