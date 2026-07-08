"use client";

import Reveal from "@/components/ui/Reveal";

const pairs = [
  {
    news: {
      label: "In the news",
      headline: "Inflation worries return as prices rise again",
      detail:
        "Consumer prices rose 0.4% in June, reviving fears of a prolonged inflationary cycle.",
      source: "Associated Press",
    },
    trend: {
      label: "The long-term trend",
      headline: "Inflation is down significantly from the 2022 peak",
      detail:
        "CPI peaked at 9.1% in June 2022. It has since fallen to 3.3% — a clear downward trajectory over 24 months.",
      source: "U.S. Bureau of Labor Statistics",
      metric: "9.1% → 3.3%",
    },
  },
  {
    news: {
      label: "In the news",
      headline: "Tech layoffs hit record numbers in Q2 2025",
      detail:
        "Major firms cut over 120,000 jobs in the first half of 2025, the highest since the dot-com bust.",
      source: "Bloomberg",
    },
    trend: {
      label: "The long-term trend",
      headline: "Global employment is near a 30-year high",
      detail:
        "The ILO reports global employment-to-population ratios are at their highest since the 1990s, with 3.4 billion people in formal work.",
      source: "ILO World Employment Report 2024",
      metric: "3.4B in formal work",
    },
  },
];

export default function TodayVsTrend() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14 border-b border-line">
      <Reveal>
        <h2 className="section-label">Today vs. the trend</h2>
      </Reveal>
      <div className="space-y-4">
        {pairs.map((pair, i) => (
          <Reveal key={pair.news.headline} delay={i * 70}>
            <div className="grid md:grid-cols-2 border border-line bg-white panel-hover">
              <div className="p-6 border-b md:border-b-0 md:border-r border-line bg-paper-warm">
                <p className="text-[0.65rem] uppercase tracking-wider text-warn font-medium mb-2">
                  {pair.news.label}
                </p>
                <p className="font-medium text-ink leading-snug">{pair.news.headline}</p>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{pair.news.detail}</p>
                <p className="mt-4 text-xs text-muted">{pair.news.source}</p>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[0.65rem] uppercase tracking-wider text-accent font-medium">
                    {pair.trend.label}
                  </p>
                  <span className="text-xs font-semibold text-accent tabular-nums shrink-0">
                    {pair.trend.metric}
                  </span>
                </div>
                <p className="font-medium text-ink leading-snug">{pair.trend.headline}</p>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{pair.trend.detail}</p>
                <p className="mt-4 text-xs text-muted">{pair.trend.source}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
