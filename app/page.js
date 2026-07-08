"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DailyTrends from "@/components/DailyTrends";
import TodayVsTrend from "@/components/TodayVsTrend";
import TrendCard from "@/components/TrendCard";
import NewsletterPreview from "@/components/NewsletterPreview";
import Footer from "@/components/Footer";
import AskAboutData from "@/components/ui/AskAboutData";
import Reveal from "@/components/ui/Reveal";

export default function Page() {
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/brief")
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then(setBrief)
      .catch(() => setError("Could not load today's brief. Try refreshing."));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <HeroSection />
      <DailyTrends />
      <TodayVsTrend />

      {error && (
        <p className="state max-w-5xl mx-auto px-6">{error}</p>
      )}

      {brief && (
        <section id="trends" className="max-w-2xl mx-auto px-6 py-14 border-b border-line">
          <Reveal>
            <h2 className="section-label">Explore all trends</h2>
          </Reveal>
          <div className="mb-10">
            {brief.trends.map((t, i) => (
              <Reveal key={t.id} delay={i * 50}>
                <TrendCard trend={t} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <NewsletterPreview brief={brief} />
          </Reveal>
        </section>
      )}

      <AskAboutData />
      <Footer />
    </div>
  );
}
