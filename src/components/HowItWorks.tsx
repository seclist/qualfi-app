"use client";

import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { EASING } from "@/lib/design-system";

const STEPS = [
  {
    time: "0s",
    title: "They tap your bio link",
    text: "Your branded diagnostic opens instead of a list of links.",
  },
  {
    time: "0 to 60s",
    title: "They answer four questions",
    text: "Goal, bodyweight and age, training days, and their biggest obstacle.",
  },
  {
    time: "60s",
    title: "They unlock their numbers",
    text: "A name and WhatsApp number reveals their calories, macros, and training split.",
  },
  {
    time: "+2s",
    title: "You get the lead",
    text: "It lands on your WhatsApp scored 0 to 100, while they are still on their phone.",
  },
] as const;

/**
 * The funnel arc as a timeline: a single hairline with four markers,
 * running left to right on desktop and top to bottom on mobile.
 */
export function HowItWorks({ index = "01" }: { index?: string }) {
  return (
    <section className="bg-white px-5 pt-12 pb-2 md:px-12 md:pt-24 md:pb-0">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <SectionEyebrow index={index}>How it works</SectionEyebrow>
          <h2 className="mt-4 font-serif text-3xl font-light leading-[1.05] text-[#121316] md:text-5xl">
            From bio tap to WhatsApp lead{" "}
            <span className="italic text-[#d9532f]">in about a minute.</span>
          </h2>
        </div>

        <ol className="relative mt-9 grid md:mt-14 md:grid-cols-4 md:gap-10">
          {/* Timeline rule */}
          <span
            aria-hidden="true"
            className="absolute bottom-10 left-[5px] top-2 w-px bg-stone-200 md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto"
          />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASING.naturalOut }}
              className="relative pb-8 pl-8 md:pb-0 md:pl-0 md:pt-9"
            >
              {/* Timeline marker (the final one is filled: the lead has arrived) */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-2 h-[11px] w-[11px] rounded-full border-2 border-[#d9532f] md:top-0 ${
                  i === STEPS.length - 1 ? "bg-[#d9532f]" : "bg-white"
                }`}
              />

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-light italic leading-none text-[#d9532f]">
                  0{i + 1}
                </span>
                <span className="font-mono text-[11px] font-semibold tracking-wide text-[#52555f]">
                  {step.time}
                </span>
              </div>
              <h3 className="mt-2.5 text-base font-bold text-[#121316]">{step.title}</h3>
              <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-[#52555f]">
                {step.text}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
