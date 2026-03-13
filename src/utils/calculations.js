/**
 * ROI Calculator — pure math functions
 * All money values are in dollars, periods in months.
 */

export function calcMonthlyNetProfit(monthlyRevenue, monthlyCosts) {
  return monthlyRevenue - monthlyCosts;
}

export function calcCumulativeCashFlow(monthlyNetProfit, initialInvestment, month) {
  return monthlyNetProfit * month - initialInvestment;
}

export function calcPaybackPeriod(initialInvestment, monthlyNetProfit) {
  if (monthlyNetProfit <= 0) return null; // "Never"
  return Math.ceil(initialInvestment / monthlyNetProfit);
}

export function calcTotalNetProfit(monthlyNetProfit, period, initialInvestment) {
  return monthlyNetProfit * period - initialInvestment;
}

export function calcROI(totalNetProfit, initialInvestment) {
  if (initialInvestment === 0) return 0;
  return (totalNetProfit / initialInvestment) * 100;
}

export function buildChartData(monthlyNetProfit, initialInvestment, period) {
  const data = [];
  for (let month = 1; month <= period; month++) {
    data.push({
      month,
      cashFlow: calcCumulativeCashFlow(monthlyNetProfit, initialInvestment, month),
    });
  }
  return data;
}

export function formatCurrency(value, symbol = '$') {
  return symbol + Math.round(value).toLocaleString('en-US');
}

/**
 * Builds row data for the monthly breakdown table.
 * Each row has raw numbers so the component can format and highlight independently.
 * isBreakEven is true for the first month where cumulative cash flow crosses $0.
 */
export function buildTableData(monthlyRevenue, monthlyCosts, initialInvestment, period) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;
  const rows = [];
  for (let month = 1; month <= period; month++) {
    const cumulativeCashFlow = calcCumulativeCashFlow(monthlyNetProfit, initialInvestment, month);
    const prevCashFlow = calcCumulativeCashFlow(monthlyNetProfit, initialInvestment, month - 1);
    rows.push({
      month,
      monthlyRevenue,
      monthlyCosts,
      netProfit: monthlyNetProfit,
      cumulativeCashFlow,
      isBreakEven: cumulativeCashFlow >= 0 && prevCashFlow < 0,
    });
  }
  return rows;
}
