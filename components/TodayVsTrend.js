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
      metricColor: "#34D399",
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
      metricColor: "#34D399",
    },
  },
];

export default function TodayVsTrend({ light }) {
  const sectionClass = light ? "py-14" : "py-14 bg-[#080D1A]";
  const headerClass = light
    ? "text-[#6B7280] text-xs font-semibold tracking-wider uppercase mb-6"
    : "text-white/40 text-xs font-semibold tracking-wider uppercase mb-6";

  return (
    <section className={sectionClass}>
      <div className="max-w-[1440px] mx-auto px-8">

        {/* Header */}
        <h2 className={headerClass}>
          Today vs. The Trend
        </h2>

        <div className="space-y-4">
            {pairs.map((pair, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_40px_1fr] rounded-2xl overflow-hidden border transition-all duration-300 ${
                light
                  ? "border-gray-200 hover:border-emerald-200/40"
                  : "border-white/5 hover:border-emerald-400/20"
              }`}
              style={{
                boxShadow: light ? "0 4px 20px rgba(9,10,11,0.06)" : "0 4px 20px rgba(0,0,0,0.3)",
                backgroundColor: light ? "#ffffff" : "rgba(255,255,255,0.03)",
              }}
            >
              {/* News side */}
              <div
                className="px-7 py-6"
                style={{ backgroundColor: light ? "#fbfbfb" : "rgba(254,252,247,0.06)" }}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.6875rem",
                    color: "#FBBF24",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {pair.news.label}
                </p>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: light ? "#0B1525" : "rgba(255,255,255,0.95)",
                    lineHeight: 1.45,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {pair.news.headline}
                </p>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.8125rem",
                    color: light ? "rgba(11,21,37,0.7)" : "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {pair.news.detail}
                </p>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.6875rem",
                    color: light ? "rgba(11,21,37,0.5)" : "rgba(255,255,255,0.25)",
                    marginTop: "1rem",
                  }}
                >
                  {pair.news.source}
                </p>
              </div>

              {/* Arrow divider */}
              <div
                className="flex items-center justify-center"
                style={{ backgroundColor: light ? "#fafafa" : "rgba(255,255,255,0.04)" }}
              >
                <ArrowRight className={`w-4 h-4 ${light ? "text-[#9CA3AF]" : "text-white/30"}`} />
              </div>

              {/* Trend side */}
              <div
                className="px-7 py-6"
                style={{ backgroundColor: light ? "#ffffff" : "rgba(246,253,249,0.06)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.6875rem",
                      color: "#34D399",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {pair.trend.label}
                  </p>

                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.6875rem",
                      color: pair.trend.metricColor,
                    }}
                  >
                    {pair.trend.metric}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: light ? "#0B1525" : "rgba(255,255,255,0.95)",
                    lineHeight: 1.45,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {pair.trend.headline}
                </p>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.8125rem",
                    color: light ? "rgba(11,21,37,0.7)" : "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {pair.trend.detail}
                </p>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.6875rem",
                    color: light ? "rgba(11,21,37,0.5)" : "rgba(255,255,255,0.25)",
                    marginTop: "1rem",
                  }}
                >
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
