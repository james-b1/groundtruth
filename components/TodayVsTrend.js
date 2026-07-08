"use client";

import Reveal from "@/components/ui/Reveal";

export default function TodayVsTrend({ brief }) {
  const contrast = brief?.contrast;
  if (!contrast?.headline || !contrast?.trend) return null;

  const { headline, trend } = contrast;

  return (
    <section className="max-w-5xl mx-auto px-6 py-14 border-b border-line">
      <Reveal>
        <h2 className="section-label">Today vs. the trend</h2>
      </Reveal>
      <Reveal>
        <div className="grid md:grid-cols-2 border border-line bg-white panel-hover">
          <div className="p-6 border-b md:border-b-0 md:border-r border-line bg-paper-warm">
            <p className="text-[0.65rem] uppercase tracking-wider text-warn font-medium mb-2">
              In the news
            </p>
            <p className="font-medium text-ink leading-snug">{headline.text}</p>
            {headline.note ? (
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{headline.note}</p>
            ) : null}
            <p className="mt-4 text-xs text-muted">
              <a
                href={headline.source.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                {headline.source.name} ↗
              </a>
            </p>
          </div>
          <div className="p-6">
            <p className="text-[0.65rem] uppercase tracking-wider text-accent font-medium mb-2">
              The long-term trend
            </p>
            <p className="text-sm text-ink-soft leading-relaxed">{trend.text}</p>
            <p className="mt-4 text-xs text-muted">
              <a
                href={trend.source.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                Source: {trend.source.name} ↗
              </a>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
