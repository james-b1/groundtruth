/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        line: "var(--color-line)",
        accent: "var(--color-accent)",
        "accent-deep": "var(--color-accent-deep)",
        "accent-soft": "var(--color-accent-soft)",
        warn: "var(--color-warn)",
        "warn-soft": "var(--color-warn-soft)",
        muted: "var(--color-muted)",
        paper: "var(--color-paper)",
        "paper-warm": "var(--color-paper-warm)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
      },
    },
  },
  plugins: [],
};
