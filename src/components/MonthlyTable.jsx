import { useState } from 'react';
import { formatCurrency } from '../utils/calculations';

function MonthlyTable({ rows, disabled, comparisonMode, rows2 }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="card">
      <div className="table-header-row">
        <h2 className="card-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Monthly Breakdown
        </h2>
        <button
          className="btn-toggle-table"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
        >
          {visible ? 'Hide Table' : 'Show Table'}
        </button>
      </div>

      {visible && !disabled && (
        <div className="table-scroll">
          {comparisonMode ? (
            <ComparisonTable rows={rows} rows2={rows2} />
          ) : (
            <SingleTable rows={rows} />
          )}
        </div>
      )}

      {visible && disabled && (
        <p className="results-disabled-message">
          Fix the errors in the form to see the table.
        </p>
      )}
    </div>
  );
}

function SingleTable({ rows }) {
  return (
    <table className="breakdown-table">
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
          <tr
            key={row.month}
            className={
              row.isBreakEven
                ? 'table-row--breakeven'
                : row.month % 2 === 0
                ? 'table-row--even'
                : ''
            }
          >
            <td className="table-cell--center">
              {row.month}
              {row.isBreakEven ? (
                <span className="breakeven-badge">Break-even</span>
              ) : null}
            </td>
            <td>{formatCurrency(row.monthlyRevenue)}</td>
            <td>{formatCurrency(row.monthlyCosts)}</td>
            <td className={row.netProfit >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
              {formatCurrency(row.netProfit)}
            </td>
            <td className={row.cumulativeCashFlow >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
              {formatCurrency(row.cumulativeCashFlow)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ComparisonTable({ rows, rows2 }) {
  return (
    <table className="breakdown-table">
      <thead>
        <tr>
          <th rowSpan={2}>Month</th>
          <th colSpan={4} className="table-col-group table-col-group--s1">Scenario 1</th>
          <th colSpan={4} className="table-col-group table-col-group--s2">Scenario 2</th>
        </tr>
        <tr>
          <th>Revenue</th>
          <th>Costs</th>
          <th>Net Profit</th>
          <th>Cumul. Cash Flow</th>
          <th>Revenue</th>
          <th>Costs</th>
          <th>Net Profit</th>
          <th>Cumul. Cash Flow</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const row2 = rows2[i];
          const isBreakEven = row.isBreakEven || (row2 && row2.isBreakEven);
          return (
            <tr
              key={row.month}
              className={
                isBreakEven
                  ? 'table-row--breakeven'
                  : row.month % 2 === 0
                  ? 'table-row--even'
                  : ''
              }
            >
              <td className="table-cell--center">
                {row.month}
                {isBreakEven ? (
                  <span className="breakeven-badge">Break-even</span>
                ) : null}
              </td>
              <td>{formatCurrency(row.monthlyRevenue)}</td>
              <td>{formatCurrency(row.monthlyCosts)}</td>
              <td className={row.netProfit >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
                {formatCurrency(row.netProfit)}
              </td>
              <td className={row.cumulativeCashFlow >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
                {formatCurrency(row.cumulativeCashFlow)}
              </td>
              {row2 ? (
                <>
                  <td>{formatCurrency(row2.monthlyRevenue)}</td>
                  <td>{formatCurrency(row2.monthlyCosts)}</td>
                  <td className={row2.netProfit >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
                    {formatCurrency(row2.netProfit)}
                  </td>
                  <td className={row2.cumulativeCashFlow >= 0 ? 'table-cell--positive' : 'table-cell--negative'}>
                    {formatCurrency(row2.cumulativeCashFlow)}
                  </td>
                </>
              ) : (
                <td colSpan={4} />
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MonthlyTable;
