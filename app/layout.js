import "./globals.css";
import "./fonts.css";
import "./theme.css";


export const metadata = {
  title: "Groundtruth",
  description: "Daily sourced briefing on trends that are improving.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

