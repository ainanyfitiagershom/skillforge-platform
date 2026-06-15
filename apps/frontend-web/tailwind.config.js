/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'Inter Tight',
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'ui-monospace',
          'monospace',
        ],
      },
      colors: {
        // Palette SkillForge Premium (toutes les couleurs viennent de variables CSS
        // pour que le toggle light/dark soit instantane)
        background: {
          DEFAULT: 'var(--background)',
          soft: 'var(--background-soft)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          soft: 'var(--foreground-soft)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          soft: 'var(--muted-soft)',
          foreground: 'var(--muted)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          strong: 'var(--accent-strong)',
          soft: 'var(--accent-soft)',
          foreground: 'var(--accent-foreground)',
        },
        cta: {
          DEFAULT: 'var(--cta)',
          foreground: 'var(--cta-foreground)',
          hover: 'var(--cta-hover)',
        },
        // Aliases pour compat avec composants existants (Button, Card, Badge...)
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
        input: 'var(--surface)',
        ring: 'var(--accent)',
        danger: {
          DEFAULT: 'var(--danger)',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.04em',
      },
      fontSize: {
        // Tailles "hero" premium
        'display-sm': ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display': ['3.5rem', { lineHeight: '1.02', letterSpacing: '-0.045em', fontWeight: '600' }],
        'display-lg': ['4.5rem', { lineHeight: '0.98', letterSpacing: '-0.05em', fontWeight: '600' }],
        'display-xl': ['5.5rem', { lineHeight: '0.96', letterSpacing: '-0.055em', fontWeight: '700' }],
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, var(--accent-strong) 0%, var(--accent) 50%, #38bdf8 100%)',
        'text-accent-gradient':
          'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
      },
    },
  },
  plugins: [],
};
