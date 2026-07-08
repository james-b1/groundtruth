"use client";

import { ArrowRight } from "lucide-react";

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
      metricColor: "#059669",
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
      metricColor: "#059669",
    },
  },
];

export default function TodayVsTrend() {
  return (
    <section className="py-14 bg-background">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Header */}
        <h2 className="font-inter font-semibold text-[0.9375rem] text-foreground mb-6 tracking-tight">
          Today vs. The Trend
        </h2>

        <div className="space-y-3">
          {pairs.map((pair, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_36px_1fr] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* News side */}
              <div className="px-7 py-6" style={{ backgroundColor: "#FEFCF7" }}>
                <p className="font-inter font-medium text-[0.6875rem] text-[#B45309] uppercase tracking-[0.07em] mb-3">
                  {pair.news.label}
                </p>

                <p className="font-inter font-semibold text-[0.9375rem] text-[#111827] leading-[1.45] tracking-tight mb-2">
                  {pair.news.headline}
                </p>

                <p className="font-inter text-[0.8125rem] text-[#6B7280] leading-[1.65]">
                  {pair.news.detail}
                </p>

                <p className="font-inter text-[0.6875rem] text-[#D1D5DB] mt-4">
                  {pair.news.source}
                </p>
              </div>

              {/* Arrow divider */}
              <div className="flex items-center justify-center bg-accent">
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              </div>

              {/* Trend side */}
              <div className="px-7 py-6" style={{ backgroundColor: "#F6FDF9" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-inter font-medium text-[0.6875rem] text-[#065F46] uppercase tracking-[0.07em]">
                    {pair.trend.label}
                  </p>

                  <span
                    className="font-inter font-semibold text-[0.6875rem]"
                    style={{ color: pair.trend.metricColor }}
                  >
                    {pair.trend.metric}
                  </span>
                </div>

                <p className="font-inter font-semibold text-[0.9375rem] text-[#111827] leading-[1.45] tracking-tight mb-2">
                  {pair.trend.headline}
                </p>

                <p className="font-inter text-[0.8125rem] text-[#6B7280] leading-[1.65]">
                  {pair.trend.detail}
                </p>

                <p className="font-inter text-[0.6875rem] text-[#D1D5DB] mt-4">
                  {pair.trend.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
