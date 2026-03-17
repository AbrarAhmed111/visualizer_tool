/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stone: {
          dark: "#655858",
          light: "#9B9393",
        },
        "stone-bg": "#f5f5f5",
        "stone-heading": "#374151",
      },
    },
  },
  plugins: [],
};
