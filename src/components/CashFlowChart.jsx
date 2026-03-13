import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SCENARIO1_COLOR = '#3399ff';
const SCENARIO2_COLOR = '#f59e0b';

/** Read a CSS custom property from :root at runtime so it follows the theme. */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function formatYAxis(value, symbol) {
  if (Math.abs(value) >= 1000) {
    return symbol + (value / 1000).toFixed(0) + 'k';
  }
  return symbol + value;
}

function CustomTooltip({ active, payload, label, comparisonMode, symbol = '$' }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-month">Month {label}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="chart-tooltip-value"
            style={{ color: entry.color }}
          >
            {comparisonMode
              ? (entry.dataKey === 'cashFlow' ? 'Scenario 1: ' : 'Scenario 2: ')
              : ''}
            {symbol + Math.round(entry.value).toLocaleString('en-US')}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function renderLegend(props) {
  const { payload } = props;
  return (
    <div className="chart-legend">
      {payload.map((entry) => (
        <span key={entry.value} className="chart-legend-item">
          <span
            className="chart-legend-dot"
            style={{ background: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

function CashFlowChart({ data, comparisonMode, disabled, symbol = '$' }) {
  const gridColor  = getCSSVar('--color-chart-grid')  || '#e2e4e9';
  const refColor   = getCSSVar('--color-text-subtle')  || '#9ca3af';

  if (disabled) {
    return (
      <div className="card results-disabled">
        <h2 className="card-title">Cumulative Cash Flow</h2>
        <div className="results-disabled-message">
          Fix the errors in the form to see the chart.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottomRight', offset: -10, fontSize: 12 }}
            tick={{ fontSize: 12, fill: refColor }}
          />
          <YAxis tickFormatter={(v) => formatYAxis(v, symbol)} tick={{ fontSize: 12, fill: refColor }} width={60} />
          <Tooltip content={<CustomTooltip comparisonMode={comparisonMode} symbol={symbol} />} />
          {comparisonMode && (
            <Legend
              content={renderLegend}
              payload={[
                { value: 'Scenario 1', color: SCENARIO1_COLOR },
                { value: 'Scenario 2', color: SCENARIO2_COLOR },
              ]}
            />
          )}
          <ReferenceLine
            y={0}
            stroke={refColor}
            strokeDasharray="6 3"
            label={{ value: 'Break-even', position: 'insideTopLeft', fontSize: 11, fill: refColor }}
          />
          <Line
            type="monotone"
            dataKey="cashFlow"
            name="Scenario 1"
            stroke={SCENARIO1_COLOR}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: SCENARIO1_COLOR }}
          />
          {comparisonMode && (
            <Line
              type="monotone"
              dataKey="cashFlow2"
              name="Scenario 2"
              stroke={SCENARIO2_COLOR}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: SCENARIO2_COLOR }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CashFlowChart;
