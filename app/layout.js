import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal"],
});

export const metadata = {
  title: "Groundtruth",
  description: "Daily sourced briefing on trends that are improving.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased tabular-nums">
        {children}
      </body>
    </html>
  );
}
