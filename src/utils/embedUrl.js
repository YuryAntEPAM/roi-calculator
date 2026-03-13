/**
 * embedUrl.js — helpers for the embeddable widget feature.
 *
 * buildEmbedUrl(values, comparisonMode, values2)
 *   Builds a URL encoding all form state: Scenario 1 values, comparison
 *   mode flag, Scenario 2 values, and embed=1 (hides header in iframe).
 *
 * buildIframeSnippet(values, comparisonMode, values2)
 *   Returns the full <iframe> HTML string ready to copy/paste.
 *
 * readParamsFromURL()
 *   Reads query parameters from the current URL and returns
 *   { values, comparisonMode, values2 } or null if nothing is present.
 *
 * isEmbedMode()
 *   Returns true when the page is loaded with ?embed=1.
 */

export function buildEmbedUrl(values, comparisonMode = false, values2 = null, isDark = false) {
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams({
    embed: '1',
    theme: isDark ? 'dark' : 'light',
    // Scenario 1
    initialInvestment: String(values.initialInvestment),
    monthlyRevenue: String(values.monthlyRevenue),
    monthlyCosts: String(values.monthlyCosts),
    period: String(values.period),
  });

  // Comparison mode + Scenario 2
  if (comparisonMode && values2) {
    params.set('comparison', '1');
    params.set('initialInvestment2', String(values2.initialInvestment));
    params.set('monthlyRevenue2', String(values2.monthlyRevenue));
    params.set('monthlyCosts2', String(values2.monthlyCosts));
  }

  return `${base}?${params.toString()}`;
}

export function buildIframeSnippet(values, comparisonMode = false, values2 = null, isDark = false) {
  const url = buildEmbedUrl(values, comparisonMode, values2, isDark);
  return `<iframe\n  src="${url}"\n  width="100%"\n  height="700"\n  style="border:none;border-radius:4px;"\n  title="ROI Calculator"\n  loading="lazy"\n></iframe>`;
}

export function readParamsFromURL() {
  const params = new URLSearchParams(window.location.search);

  // Only apply if at least one known param is present
  if (!params.has('initialInvestment') && !params.has('monthlyRevenue')) {
    return null;
  }

  const values = {
    initialInvestment: Number(params.get('initialInvestment')),
    monthlyRevenue: Number(params.get('monthlyRevenue')),
    monthlyCosts: Number(params.get('monthlyCosts')),
    period: Number(params.get('period')),
  };

  // Guard: discard if any Scenario 1 value is not a finite number
  for (const val of Object.values(values)) {
    if (!Number.isFinite(val)) return null;
  }

  // Guard: period must be one of the allowed dropdown values
  if (![12, 24, 36].includes(values.period)) return null;

  // Comparison mode
  const comparisonMode = params.get('comparison') === '1';
  let values2 = null;

  if (comparisonMode && params.has('initialInvestment2')) {
    const s2 = {
      initialInvestment: Number(params.get('initialInvestment2')),
      monthlyRevenue: Number(params.get('monthlyRevenue2')),
      monthlyCosts: Number(params.get('monthlyCosts2')),
    };
    // Only use Scenario 2 if all values are valid numbers
    const allValid = Object.values(s2).every(Number.isFinite);
    if (allValid) values2 = s2;
  }

  return { values, comparisonMode, values2 };
}

export function isEmbedMode() {
  return new URLSearchParams(window.location.search).get('embed') === '1';
}
