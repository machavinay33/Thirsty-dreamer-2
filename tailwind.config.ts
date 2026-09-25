import type { Config } from 'tailwindcss';

// All colours come from CSS variables defined in src/app/globals.css (design tokens).
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: token('espresso'),
        roast: token('roast'),
        walnut: token('walnut'),
        tobacco: token('tobacco'),
        cream: token('cream'),
        olive: token('olive'),
        copper: token('copper'),
        vermouth: token('vermouth'),
        alert: token('alert'),
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: { label: '0.18em' },
    },
  },
  plugins: [],
};

export default config;
