import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import {
  calcMonthlyNetProfit,
  calcPaybackPeriod,
  calcTotalNetProfit,
  calcROI,
  buildChartData,
} from './utils/calculations';
import './App.css';

const DEFAULT_VALUES = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

function App() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const monthlyNetProfit = calcMonthlyNetProfit(values.monthlyRevenue, values.monthlyCosts);
  const paybackPeriod = calcPaybackPeriod(values.initialInvestment, monthlyNetProfit);
  const totalNetProfit = calcTotalNetProfit(monthlyNetProfit, values.period, values.initialInvestment);
  const roi = calcROI(totalNetProfit, values.initialInvestment);
  const chartData = buildChartData(monthlyNetProfit, values.initialInvestment, values.period);

  return (
    <div className="app">
      <header className="app-header">
        <div className="epam-logo-box">EPAM</div>
        <div className="header-divider" />
        <div>
          <h1 className="app-title">ROI Calculator</h1>
          <p className="app-subtitle">Enter your numbers to see your return on investment instantly</p>
        </div>
      </header>

      <div className="app-content">
        <main className="app-layout">
          <aside className="app-sidebar">
            <InputForm values={values} onChange={setValues} />
          </aside>

          <section className="app-main">
            <Results
              roi={roi}
              paybackPeriod={paybackPeriod}
              totalNetProfit={totalNetProfit}
              monthlyNetProfit={monthlyNetProfit}
            />
            <CashFlowChart data={chartData} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
