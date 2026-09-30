/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        accent: {
          DEFAULT: '#6366F1',
          light: '#F5F3FF',
        },
        surface: '#FFFFFF',
        background: '#F8FAFC',
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0',
          subtle: '#F1F5F9',
          strong: '#CBD5E1',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        status: {
          safe: '#16A34A',
          safeBg: '#F0FDF4',
          safeBorder: '#BBF7D0',
          moderate: '#F59E0B',
          moderateBg: '#FFFBEB',
          moderateBorder: '#FDE68A',
          ambitious: '#DC2626',
          ambitiousBg: '#FEF2F2',
          ambitiousBorder: '#FECACA',
        }
      },
      borderRadius: {
        'control': '10px',
        'input': '12px',
        'card': '18px',
        'section': '24px',
        'hero': '32px',
      },
      boxShadow: {
        'subtle': '0 4px 20px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 20px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 10px 30px rgba(15, 23, 42, 0.09)',
        'elevated': '0 12px 40px rgba(15, 23, 42, 0.08)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}

