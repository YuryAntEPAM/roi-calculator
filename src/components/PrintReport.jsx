import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../utils/calculations';

/**
 * PrintReport — rendered off-screen and revealed only when printing.
 * window.print() triggers @media print rules in print.css, which hide
 * the normal app and show only this component.
 */
function PrintReport({
  values,
  roi,
  paybackPeriod,
  totalNetProfit,
  monthlyNetProfit,
  chartData,
  tableData,
  // comparison mode props
  comparisonMode,
  values2,
  roi2,
  paybackPeriod2,
  totalNetProfit2,
  monthlyNetProfit2,
  chartData2,
  tableData2,
  // currency
  symbol = '$',
  currencyCode = 'USD',
}) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paybackDisplay = (pp) =>
    pp === null ? 'Never' : `${pp} month${pp !== 1 ? 's' : ''}`;

  // Merge chart data for comparison mode (same shape as App.jsx)
  const mergedChartData = chartData.map((point, i) => ({
    ...point,
    cashFlow2: chartData2 ? chartData2[i]?.cashFlow : undefined,
  }));

  const chartDataToUse = comparisonMode ? mergedChartData : chartData;

  return (
    <div className="print-report">
      {/* ── Header ── */}
      <div className="pr-header">
        <div className="pr-logo">EPAM</div>
        <div>
          <h1 className="pr-title">ROI Analysis Report</h1>
          <p className="pr-date">Generated on {today}</p>
        </div>
      </div>

      {/* ── Input Parameters ── */}
      <section className="pr-section">
        <h2 className="pr-section-title">
          {comparisonMode ? 'Input Parameters — Scenario 1' : 'Input Parameters'}
        </h2>
        <table className="pr-params-table">
          <tbody>
            <tr>
              <td className="pr-param-label">Initial Investment</td>
              <td className="pr-param-value">{formatCurrency(values.initialInvestment, symbol)}</td>
            </tr>
            <tr>
              <td className="pr-param-label">Expected Monthly Revenue</td>
              <td className="pr-param-value">{formatCurrency(values.monthlyRevenue, symbol)}</td>
            </tr>
            <tr>
              <td className="pr-param-label">Monthly Operating Costs</td>
              <td className="pr-param-value">{formatCurrency(values.monthlyCosts, symbol)}</td>
            </tr>
            <tr>
              <td className="pr-param-label">Calculation Period</td>
              <td className="pr-param-value">{values.period} months</td>
            </tr>
          </tbody>
        </table>
      </section>

      {comparisonMode && values2 && (
        <section className="pr-section">
          <h2 className="pr-section-title">Input Parameters — Scenario 2</h2>
          <table className="pr-params-table">
            <tbody>
              <tr>
                <td className="pr-param-label">Initial Investment</td>
                <td className="pr-param-value">{formatCurrency(values2.initialInvestment, symbol)}</td>
              </tr>
              <tr>
                <td className="pr-param-label">Expected Monthly Revenue</td>
                <td className="pr-param-value">{formatCurrency(values2.monthlyRevenue, symbol)}</td>
              </tr>
              <tr>
                <td className="pr-param-label">Monthly Operating Costs</td>
                <td className="pr-param-value">{formatCurrency(values2.monthlyCosts, symbol)}</td>
              </tr>
              <tr>
                <td className="pr-param-label">Calculation Period</td>
                <td className="pr-param-value">{values.period} months (shared)</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* ── Key Metrics ── */}
      <section className="pr-section">
        <h2 className="pr-section-title">
          {comparisonMode ? 'Key Metrics — Scenario 1' : 'Key Metrics'}
        </h2>
        <table className="pr-metrics-table">
          <tbody>
            <tr>
              <td className="pr-metric-label">Return on Investment (ROI)</td>
              <td className="pr-metric-value pr-metric-value--highlight">{roi.toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="pr-metric-label">Payback Period</td>
              <td className="pr-metric-value">{paybackDisplay(paybackPeriod)}</td>
            </tr>
            <tr>
              <td className="pr-metric-label">Total Net Profit</td>
              <td className="pr-metric-value">{formatCurrency(totalNetProfit, symbol)}</td>
            </tr>
            <tr>
              <td className="pr-metric-label">Monthly Net Profit</td>
              <td className="pr-metric-value">{formatCurrency(monthlyNetProfit, symbol)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {comparisonMode && (
        <section className="pr-section">
          <h2 className="pr-section-title">Key Metrics — Scenario 2</h2>
          <table className="pr-metrics-table">
            <tbody>
              <tr>
                <td className="pr-metric-label">Return on Investment (ROI)</td>
                <td className="pr-metric-value pr-metric-value--highlight2">{roi2.toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="pr-metric-label">Payback Period</td>
                <td className="pr-metric-value">{paybackDisplay(paybackPeriod2)}</td>
              </tr>
              <tr>
                <td className="pr-metric-label">Total Net Profit</td>
              <td className="pr-metric-value">{formatCurrency(totalNetProfit2, symbol)}</td>
            </tr>
            <tr>
              <td className="pr-metric-label">Monthly Net Profit</td>
              <td className="pr-metric-value">{formatCurrency(monthlyNetProfit2, symbol)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* ── Chart ── */}
      <section className="pr-section pr-section--chart">
        <h2 className="pr-section-title">Cumulative Cash Flow</h2>
        {/* Fixed-size chart — ResponsiveContainer won't work in print context */}
        <LineChart
          width={680}
          height={260}
          data={chartDataToUse}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11 }}
            label={{ value: 'Month', position: 'insideBottomRight', offset: -10, fontSize: 11 }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            width={65}
            tickFormatter={(v) =>
              Math.abs(v) >= 1000 ? symbol + (v / 1000).toFixed(0) + 'k' : symbol + v
            }
          />
          <ReferenceLine
            y={0}
            stroke="#9ca3af"
            strokeDasharray="6 3"
            label={{ value: 'Break-even', position: 'insideTopLeft', fontSize: 10, fill: '#9ca3af' }}
          />
          <Line
            type="monotone"
            dataKey="cashFlow"
            stroke="#3399ff"
            strokeWidth={2}
            dot={false}
            name="Scenario 1"
          />
          {comparisonMode && (
            <Line
              type="monotone"
              dataKey="cashFlow2"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Scenario 2"
            />
          )}
        </LineChart>
        {comparisonMode && (
          <div className="pr-chart-legend">
            <span className="pr-legend-dot" style={{ background: '#3399ff' }} /> Scenario 1
            &nbsp;&nbsp;
            <span className="pr-legend-dot" style={{ background: '#f59e0b' }} /> Scenario 2
          </div>
        )}
      </section>

      {/* ── Monthly Table ── */}
      <section className="pr-section">
        <h2 className="pr-section-title">
          {comparisonMode ? 'Monthly Breakdown — Scenario 1' : 'Monthly Breakdown'}
        </h2>
        <PrintTable rows={tableData} symbol={symbol} />
      </section>

      {comparisonMode && tableData2 && (
        <section className="pr-section">
          <h2 className="pr-section-title">Monthly Breakdown — Scenario 2</h2>
          <PrintTable rows={tableData2} symbol={symbol} />
        </section>
      )}
    </div>
  );
}

function PrintTable({ rows, symbol = '$' }) {
  return (
    <table className="pr-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Monthly Revenue</th>
          <th>Monthly Costs</th>
          <th>Net Profit</th>
          <th>Cumulative Cash Flow</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.month} className={row.isBreakEven ? 'pr-row--breakeven' : ''}>
            <td className="pr-cell--center">
              {row.month}
              {row.isBreakEven ? <span className="pr-breakeven-badge">Break-even</span> : null}
            </td>
            <td>{formatCurrency(row.monthlyRevenue, symbol)}</td>
            <td>{formatCurrency(row.monthlyCosts, symbol)}</td>
            <td className={row.netProfit >= 0 ? 'pr-cell--positive' : 'pr-cell--negative'}>
              {formatCurrency(row.netProfit, symbol)}
            </td>
            <td className={row.cumulativeCashFlow >= 0 ? 'pr-cell--positive' : 'pr-cell--negative'}>
              {formatCurrency(row.cumulativeCashFlow, symbol)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PrintReport;
