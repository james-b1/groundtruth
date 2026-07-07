import { TrendingUp } from "lucide-react";

const navLinks = ["Today", "Topics", "Discover"];

export function Navbar() {
  return (
    <header className="bg-[#0A0E1A] border-b border-white/8">
      <div className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-[#0A0E1A]" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
            }}
          >
          GroundTruth
          </span>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.55)",
              }}
              className="px-4 py-1.5 rounded-md hover:text-white hover:bg-white/8 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "0.8125rem",
          }}
          className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/16 border border-white/10 transition-colors"
        >
          Data Tracker
        </a>
      </div>
    </header>
  );
}
