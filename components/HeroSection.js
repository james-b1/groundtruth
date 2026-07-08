"use client";

import { GlobeVisualization } from "./GlobeVisualization";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">{today}</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08] text-ink">
            The world is more than today&rsquo;s headlines.
          </h1>
          <p className="mt-5 max-w-md text-ink-soft leading-relaxed">
            Long-term global progress from verified datasets so you stay informed
            without the anxiety.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#trends"
              className="btn-press bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-accent-deep"
            >
              Read today&rsquo;s trends
            </a>
            <a
              href="#ask"
              className="border-b border-line pb-0.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Ask a question
            </a>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="w-full max-w-[420px] mx-auto lg:max-w-none border border-line bg-white p-4 panel-hover">
            <GlobeVisualization />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
