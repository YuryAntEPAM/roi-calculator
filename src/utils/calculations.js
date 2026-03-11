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

export function formatCurrency(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}
