"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";

export default function DailyTrends({ light }) {
  return (
    <section className={`max-w-[900px] mx-auto px-8 py-16 font-inter ${
      light ? "text-[#0B1525]" : "text-white"
    }`}>

      <h2 className={`${light ? "text-[#0B1525]" : "text-white/40"} text-xs font-semibold tracking-wider uppercase mb-6`}>
        Quick Updates
      </h2>

      <div className="space-y-4">

        {/* Poverty Card */}
        <Card
          className={
            light
              ? "bg-white border-gray-200 hover:border-amber-200/60 hover:bg-[#fbfbfb] transition-all duration-300 text-[#0B1525]"
              : "bg-[#0A0E1A] border-white/8 hover:border-amber-400/30 hover:bg-[#0E1629] transition-all duration-300 text-white"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Extreme poverty keeps falling
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className={`${light ? "text-[#475569]" : "text-white/70"} mb-2 text-sm leading-relaxed`}>
              The share of the world in extreme poverty has dropped from 38% in 1990 to under 10% today.
            </p>
          </CardContent>

          <CardFooter>
            <p className={`${light ? "text-[#9CA3AF]" : "text-white/30"} text-[11px]`}>Source: World Bank</p>
          </CardFooter>
        </Card>

        {/* Child Mortality Card */}
        <Card
          className={
            light
              ? "bg-white border-gray-200 hover:border-emerald-200/60 hover:bg-[#fbfbfb] transition-all duration-300 text-[#0B1525]"
              : "bg-[#0A0E1A] border-white/8 hover:border-emerald-400/30 hover:bg-[#0E1629] transition-all duration-300 text-white"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Child mortality keeps falling
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className={`${light ? "text-[#475569]" : "text-white/70"} mb-2 text-sm leading-relaxed`}>
              The global under‑five death rate has more than halved since 1990.
            </p>
          </CardContent>

          <CardFooter>
            <p className={`${light ? "text-[#9CA3AF]" : "text-white/30"} text-[11px]`}>Source: UN IGME</p>
          </CardFooter>
        </Card>

      </div>
    </section>
  );
}
