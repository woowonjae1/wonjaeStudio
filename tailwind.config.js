/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map to our new CSS variables
        background: "var(--bg-base)",
        foreground: "var(--text-base)",
        card: {
          DEFAULT: "var(--bg-elevated)",
          foreground: "var(--text-base)",
        },
        popover: {
          DEFAULT: "var(--bg-elevated-highlight)",
          foreground: "var(--text-base)",
        },
        primary: {
          DEFAULT: "var(--spotify-green)",
          foreground: "var(--text-black)",
        },
        secondary: {
          DEFAULT: "var(--bg-elevated-highlight)",
          foreground: "var(--text-base)",
        },
        muted: {
          DEFAULT: "var(--bg-elevated-press)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          foreground: "var(--text-black)",
        },
        destructive: {
          DEFAULT: "var(--status-error)",
          foreground: "#ffffff",
        },
        border: "var(--border-subtle)",
        input: "var(--bg-elevated-press)",
        ring: "var(--spotify-green)",

        // Custom names
        spotify: {
          green: "var(--spotify-green)",
          dark: "var(--spotify-green-dark)",
          hover: "var(--spotify-green-hover)",
        },
        apple: {
          gray: "var(--bg-elevated-base)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-text)"],
        display: ["var(--font-display)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
