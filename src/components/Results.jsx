import { formatCurrency } from '../utils/calculations';

const SCENARIO1_COLOR = '#39f';
const SCENARIO2_COLOR = '#f59e0b';

function MetricCard({ label, value, highlight, accentColor }) {
  const style = highlight && accentColor ? { borderLeftColor: accentColor } : {};
  return (
    <div
      className={`metric-card${highlight ? ' metric-card--highlight' : ''}`}
      style={style}
    >
      <div
        className="metric-value"
        style={highlight && accentColor ? { color: accentColor } : {}}
      >
        {value}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

function ScenarioMetrics({ roi, paybackPeriod, totalNetProfit, monthlyNetProfit, accentColor }) {
  const paybackDisplay =
    paybackPeriod === null ? 'Never' : `${paybackPeriod} month${paybackPeriod !== 1 ? 's' : ''}`;
  const roiDisplay = `${roi.toFixed(1)}%`;

  return (
    <div className="metrics-grid">
      <MetricCard label="Return on Investment" value={roiDisplay} highlight accentColor={accentColor} />
      <MetricCard label="Payback Period" value={paybackDisplay} />
      <MetricCard label="Total Net Profit" value={formatCurrency(totalNetProfit)} />
      <MetricCard label="Monthly Net Profit" value={formatCurrency(monthlyNetProfit)} />
    </div>
  );
}

function Results({
  roi, paybackPeriod, totalNetProfit, monthlyNetProfit,
  comparisonMode,
  roi2, paybackPeriod2, totalNetProfit2, monthlyNetProfit2,
  disabled,
}) {
  if (disabled) {
    return (
      <div className="card results-disabled">
        <h2 className="card-title">Results</h2>
        <div className="results-disabled-message">
          Fix the errors in the form to see your results.
        </div>
      </div>
    );
  }

  if (comparisonMode) {
    return (
      <div className="card">
        <h2 className="card-title">Results</h2>
        <div className="comparison-results">
          <div className="comparison-column">
            <div className="comparison-column-header" style={{ color: SCENARIO1_COLOR }}>
              Scenario 1
            </div>
            <ScenarioMetrics
              roi={roi}
              paybackPeriod={paybackPeriod}
              totalNetProfit={totalNetProfit}
              monthlyNetProfit={monthlyNetProfit}
              accentColor={SCENARIO1_COLOR}
            />
          </div>
          <div className="comparison-divider" />
          <div className="comparison-column">
            <div className="comparison-column-header" style={{ color: SCENARIO2_COLOR }}>
              Scenario 2
            </div>
            <ScenarioMetrics
              roi={roi2}
              paybackPeriod={paybackPeriod2}
              totalNetProfit={totalNetProfit2}
              monthlyNetProfit={monthlyNetProfit2}
              accentColor={SCENARIO2_COLOR}
            />
          </div>
        </div>
      </div>
    );
  }

  const paybackDisplay =
    paybackPeriod === null ? 'Never' : `${paybackPeriod} month${paybackPeriod !== 1 ? 's' : ''}`;
  const roiDisplay = `${roi.toFixed(1)}%`;

  return (
    <div className="card">
      <h2 className="card-title">Results</h2>
      <div className="metrics-grid">
        <MetricCard label="Return on Investment" value={roiDisplay} highlight accentColor={SCENARIO1_COLOR} />
        <MetricCard label="Payback Period" value={paybackDisplay} />
        <MetricCard label="Total Net Profit" value={formatCurrency(totalNetProfit)} />
        <MetricCard label="Monthly Net Profit" value={formatCurrency(monthlyNetProfit)} />
      </div>
    </div>
  );
}

export default Results;
