import "./globals.css";

export const metadata = {
  title: "Groundtruth — what's getting better",
  description: "A calm daily briefing on what's improving in the world, backed by real data.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
