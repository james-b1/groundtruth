import "./globals.css";
import "./fonts.css";
import "./theme.css";


export const metadata = {
  title: "Progress Pulse",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
