import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

// EPAM brand blue
const ACCENT = '#39f';

function formatYAxis(value) {
  if (Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(0) + 'k';
  }
  return '$' + value;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formatted =
      '$' + Math.round(value).toLocaleString('en-US');
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-month">Month {label}</p>
        <p className="chart-tooltip-value">{formatted}</p>
      </div>
    );
  }
  return null;
}

function CashFlowChart({ data }) {
  return (
    <div className="card">
      <h2 className="card-title">Cumulative Cash Flow</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e4e9" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottomRight', offset: -10, fontSize: 12 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="6 3" label={{ value: 'Break-even', position: 'insideTopLeft', fontSize: 11, fill: '#9ca3af' }} />
          <Line
            type="monotone"
            dataKey="cashFlow"
            stroke={ACCENT}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: ACCENT }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CashFlowChart;
