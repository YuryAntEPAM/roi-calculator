import { useState, useEffect } from 'react';
import { FALLBACK_RATES } from '../utils/currencies';

/**
 * useExchangeRates
 *
 * Fetches latest USD-based exchange rates from frankfurter.app (free, no API key).
 * Returns { rates, loading, error }.
 *
 * - rates:   object keyed by currency code, e.g. { EUR: 0.92, GBP: 0.79, ... }
 *            Always includes USD: 1. Falls back to FALLBACK_RATES on error only
 *            if the user has chosen to proceed (error is shown to them first).
 * - loading: true while the request is in flight
 * - error:   string message if the fetch failed, null otherwise
 */
export function useExchangeRates() {
  const [rates, setRates] = useState({ ...FALLBACK_RATES });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      try {
        // Fetch rates for all supported currencies relative to USD
        const res = await fetch(
          'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,CHF,JPY,CAD,AUD,CNY'
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setRates({ USD: 1, ...data.rates });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            'Could not fetch live exchange rates. Showing approximate rates instead.'
          );
          // Keep the fallback rates already in state
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRates();
    return () => { cancelled = true; };
  }, []);

  return { rates, loading, error };
}
