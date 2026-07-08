"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl text-ink hover:text-accent transition-colors duration-200"
        >
          Groundtruth
        </Link>
        <a
          href="#ask"
          className="btn-press border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-white"
        >
          Ask the data
        </a>
      </div>
    </header>
  );
}
