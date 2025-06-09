import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#4A5568',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#F28C28'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A5568'
        },
        primary: {
          DEFAULT: '#F28C28',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F5F6F7',
          foreground: '#4A5568'
        },
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#64748B'
        },
        accent: {
          DEFAULT: '#FFF3E6',
          foreground: '#F28C28'
        },
        destructive: {
          DEFAULT: '#FEE2E2',
          foreground: '#DC2626'
        },
        border: '#F28C28',
        input: '#F5F6F7',
        ring: '#F28C28',
        chart: {
          '1': '#F28C28',
          '2': '#FFA500',
          '3': '#FFB833',
          '4': '#FFC966',
          '5': '#FFDAA0'
        },
        sidebar: {
          DEFAULT: '#FFFFFF',
          foreground: '#4A5568',
          primary: '#F28C28',
          'primary-foreground': '#FFFFFF',
          accent: '#FFF3E6',
          'accent-foreground': '#F28C28',
          border: '#FFE5CC',
          ring: '#F28C28'
        }
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
