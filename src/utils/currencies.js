/**
 * currencies.js
 *
 * Currency definitions and conversion helpers.
 * USD is always the internal base currency.
 * All user-visible values are stored in USD and converted on display.
 */

export const CURRENCIES = [
  { code: 'USD', symbol: '$',  label: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€',  label: 'EUR — Euro' },
  { code: 'GBP', symbol: '£',  label: 'GBP — British Pound' },
  { code: 'CHF', symbol: 'Fr', label: 'CHF — Swiss Franc' },
  { code: 'JPY', symbol: '¥',  label: 'JPY — Japanese Yen' },
  { code: 'CAD', symbol: 'C$', label: 'CAD — Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar' },
  { code: 'CNY', symbol: '¥',  label: 'CNY — Chinese Yuan' },
];

/** Fallback rates relative to 1 USD, used when the API is unavailable. */
export const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.90,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
};

/** Returns the symbol for a given currency code. */
export function getSymbol(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

/**
 * Convert a USD value to the target currency using the provided rates map.
 * Rounds to the nearest integer (JPY has no cents; others are close enough).
 */
export function convertFromUSD(usdValue, targetCode, rates) {
  const rate = rates[targetCode] ?? FALLBACK_RATES[targetCode] ?? 1;
  return Math.round(usdValue * rate);
}

/**
 * Convert a value in the given currency back to USD.
 * Used when the user edits an input while a non-USD currency is active.
 */
export function convertToUSD(value, fromCode, rates) {
  const rate = rates[fromCode] ?? FALLBACK_RATES[fromCode] ?? 1;
  if (rate === 0) return value;
  return value / rate;
}
