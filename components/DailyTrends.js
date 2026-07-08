"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

export default function DailyTrends({ brief }) {
  if (!brief?.trends?.length) return null;

  // Lead with the freshly-refreshed live figures; fall back to the first few
  // curated trends if nothing is live yet.
  const live = brief.trends.filter((t) => t.live);
  const items = (live.length ? live : brief.trends).slice(0, 3);

  return (
    <section className="max-w-5xl mx-auto px-6 py-14 border-b border-line">
      <Reveal>
        <h2 className="section-label">Quick updates</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t, i) => (
          <Reveal key={t.id} delay={i * 60}>
            <Card>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="text-xl font-semibold text-accent tabular-nums">{t.metric}</span>{" "}
                  <span className="text-sm text-ink-soft">{t.metricLabel}</span>
                </p>
              </CardContent>
              <CardFooter>
                {t.live && t.valueYear ? `Updated ${t.valueYear} · ` : ""}Source: {t.source.name}
              </CardFooter>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
