import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import DailyTrends from "@/components/DailyTrends";
import TodayVsTrend from "@/components/TodayVsTrend";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="bg-background text-foreground min-h-screen font-inter">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <HeroSection />

      {/* DAILY TRENDS */}
      <DailyTrends />

      {/* TODAY VS TREND */}
      <TodayVsTrend />

      {/* FOOTER */}
      <Footer />

    </main>
  );
}
