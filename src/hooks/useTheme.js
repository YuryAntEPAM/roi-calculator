import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roi-calculator-theme';

/**
 * useTheme — manages light/dark theme.
 *
 * - Reads the saved preference from localStorage on first load.
 * - Falls back to the OS preference (prefers-color-scheme) if nothing is saved.
 * - Writes `data-theme="dark"` (or removes it) on <html> so CSS variables switch.
 * - Persists the choice to localStorage on every toggle.
 *
 * Returns [isDark, toggleTheme].
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return saved === 'dark';
    // Fall back to OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return [isDark, toggleTheme];
}
