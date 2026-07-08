"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

const updates = [
  {
    title: "Extreme poverty keeps falling",
    body: "The share of the world in extreme poverty has dropped from 38% in 1990 to under 10% today.",
    source: "World Bank",
  },
  {
    title: "Child mortality keeps falling",
    body: "The global under-five death rate has more than halved since 1990.",
    source: "UN IGME",
  },
];

export default function DailyTrends() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14 border-b border-line">
      <Reveal>
        <h2 className="section-label">Quick updates</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-4">
        {updates.map((item, i) => (
          <Reveal key={item.title} delay={i * 60}>
            <Card>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-soft leading-relaxed">{item.body}</p>
              </CardContent>
              <CardFooter>Source: {item.source}</CardFooter>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
