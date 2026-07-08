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


function formatDate(iso) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatAsOf(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

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
      .catch(() =>
        setError("Could not load today's brief. Try refreshing.")
      );
  }, []);

  return (
    <div
      className="min-h-screen bg-[#080D1A] text-white"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* 🔹 Top Navigation */}
      <Navbar />

      {/* 🔹 Hero Section */}
      <HeroSection />

      {/* Sections under the hero use a light background (extends to footer) */}
      <div className="site-light bg-[#f6f7f8] text-[#0B1525]">
        <DailyTrends light />

        <TodayVsTrend light />

        {/* 🔹 API-driven Trend Cards + Newsletter */}
        {brief && (
          <section id="trends" className="max-w-[900px] mx-auto px-8 py-16">
            <h2 className="text-[#6B7280] text-xs font-semibold tracking-wider uppercase mb-6">
              Explore All Trends
            </h2>

            <div className="space-y-4 mb-10">
              {brief.trends.map((t) => (
                <TrendCard key={t.id} trend={t} light />
              ))}
            </div>

            <NewsletterPreview brief={brief} />
          </section>
        )}

        <AskAboutData />

        {/* 🔹 Footer */}
        <Footer light />
      </div>
    </div>
  );
}
