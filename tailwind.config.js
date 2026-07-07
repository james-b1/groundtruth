/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        cardForeground: "var(--card-foreground)",

        primary: "var(--primary)",
        primaryForeground: "var(--primary-foreground)",

        secondary: "var(--secondary)",
        secondaryForeground: "var(--secondary-foreground)",

        muted: "var(--muted)",
        mutedForeground: "var(--muted-foreground)",

        accent: "var(--accent)",
        accentForeground: "var(--accent-foreground)",

        border: "var(--border)",
        input: "var(--input-background)",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
