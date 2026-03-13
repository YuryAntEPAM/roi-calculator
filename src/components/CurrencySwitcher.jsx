import { CURRENCIES } from '../utils/currencies';

/**
 * CurrencySwitcher
 *
 * Props:
 *   selectedCode  — currently active currency code, e.g. 'USD'
 *   onChange      — called with the new code when the user picks one
 *   loading       — true while rates are being fetched (disables the select)
 *   error         — error string if fetch failed, null otherwise
 */
function CurrencySwitcher({ selectedCode, onChange, loading, error }) {
  return (
    <div className="currency-switcher">
      <div className="currency-switcher-row">
        <label className="form-label currency-switcher-label" htmlFor="currency-select">
          Currency
        </label>
        <select
          id="currency-select"
          className="form-input form-select currency-select"
          value={selectedCode}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="currency-status currency-status--loading">
          Loading live exchange rates…
        </p>
      )}

      {!loading && error && (
        <p className="currency-status currency-status--error">
          {error}
        </p>
      )}
    </div>
  );
}

export default CurrencySwitcher;
