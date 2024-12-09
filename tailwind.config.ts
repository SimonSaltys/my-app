import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'old-growth-green': '#004C46',    // Primary color: Old Growth Green
        'chanterelle-gold': '#FFC72C',    // Primary color: Chanterelle Gold
        'sea-glass': '#00856A',           // Secondary color: Sea Glass
        'sunset-gold': '#F2A900',         // Secondary color: Sunset Gold
        'pacific-blue': '#98B8AD',        // Pacific Blue
        'dune-grass': '#D5CB9F',          // Dune Grass
        'northern-sky': '#CDDAD5',        // Northern Sky
        'sand': '#F5F3E7',                // Sand
        'mat-dark': '#212121',            // Mat Black
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
