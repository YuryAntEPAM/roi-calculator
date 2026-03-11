import { formatCurrency } from '../utils/calculations';

function MetricCard({ label, value, highlight }) {
  return (
    <div className={`metric-card${highlight ? ' metric-card--highlight' : ''}`}>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

function Results({ roi, paybackPeriod, totalNetProfit, monthlyNetProfit }) {
  const paybackDisplay =
    paybackPeriod === null ? 'Never' : `${paybackPeriod} month${paybackPeriod !== 1 ? 's' : ''}`;

  const roiDisplay = `${roi.toFixed(1)}%`;

  return (
    <div className="card">
      <h2 className="card-title">Results</h2>
      <div className="metrics-grid">
        <MetricCard label="Return on Investment" value={roiDisplay} highlight />
        <MetricCard label="Payback Period" value={paybackDisplay} />
        <MetricCard label="Total Net Profit" value={formatCurrency(totalNetProfit)} />
        <MetricCard label="Monthly Net Profit" value={formatCurrency(monthlyNetProfit)} />
      </div>
    </div>
  );
}

export default Results;
