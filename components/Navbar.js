"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-[#0A0E1A] border-b border-white/8">
      <div className="max-w-[1440px] mx-auto px-8 h-14 flex items-center justify-between font-inter">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-400 flex items-center justify-center">
            <TrendingUp
              className="w-3.5 h-3.5 text-[#0A0E1A]"
              strokeWidth={2.5}
            />
          </div>

          <span className="text-white font-semibold text-[15px] tracking-tight">
            GroundTruth
          </span>
        </Link>

        {/* CTA */}
        <a
          href="#"
          className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 border border-white/10 transition-colors"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
