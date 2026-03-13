import { useState, useEffect } from 'react';

const STORAGE_KEY = 'roi-calculator-theme';

/**
 * useTheme — manages light/dark theme.
 *
 * Priority order for the initial value:
 *   1. ?theme=dark|light in the URL  (embed iframe use-case)
 *   2. Saved preference in localStorage
 *   3. OS preference (prefers-color-scheme)
 *
 * Applies data-theme="dark" on <html> synchronously inside the useState
 * initialiser so there is never a flash of the wrong theme, even in iframes.
 *
 * Returns [isDark, toggleTheme].
 */
export function useTheme() {
  const [isDark] = useState(() => {
    // 1. URL param — used by the embed iframe
    const urlParam = new URLSearchParams(window.location.search).get('theme');
    let dark;
    if (urlParam === 'dark') {
      dark = true;
    } else if (urlParam === 'light') {
      dark = false;
    } else {
      // 2. localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        dark = saved === 'dark';
      } else {
        // 3. OS preference
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }

    // Apply synchronously — before the first paint — so there's no flash
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    return dark;
  });

  // Keep a separate piece of state that can be toggled
  const [isDarkToggle, setIsDarkToggle] = useState(isDark);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkToggle) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, isDarkToggle ? 'dark' : 'light');
  }, [isDarkToggle]);

  function toggleTheme() {
    setIsDarkToggle((prev) => !prev);
  }

  return [isDarkToggle, toggleTheme];
}
