import { useEffect, useState } from 'react';

/**
 * Hook pour gerer le theme clair / sombre :
 * - Sauvegarde la preference dans localStorage
 * - Applique la classe 'dark' sur l'element <html> pour activer Tailwind dark:
 * - Au premier chargement, respecte la preference systeme (prefers-color-scheme)
 */

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'skillforge.theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Fallback : preference systeme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Applique immediatement au chargement
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggle };
}

/**
 * Application initiale du theme — appelee tres tot dans main.tsx
 * pour eviter le flash blanc en arrivant sur le site en mode sombre.
 */
export function initThemeEarly() {
  if (typeof window === 'undefined') return;
  applyTheme(getInitialTheme());
}
