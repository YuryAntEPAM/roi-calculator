import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import MonthlyTable from './components/MonthlyTable';
import PrintReport from './components/PrintReport';
import EmbedModal from './components/EmbedModal';
import {
  calcMonthlyNetProfit,
  calcPaybackPeriod,
  calcTotalNetProfit,
  calcROI,
  buildChartData,
  buildTableData,
} from './utils/calculations';
import { validateValues, isValid } from './utils/validation';
import { readParamsFromURL, isEmbedMode } from './utils/embedUrl';
import './App.css';
import './print.css';

const DEFAULT_VALUES = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

const DEFAULT_SCENARIO2 = {
  initialInvestment: 80000,
  monthlyRevenue: 12000,
  monthlyCosts: 4000,
};

// Read URL params once at module load — before first render
const urlParams = readParamsFromURL();
const embedMode = isEmbedMode();

function App() {
  const [values, setValues] = useState(urlParams?.values ?? DEFAULT_VALUES);
  const [comparisonMode, setComparisonMode] = useState(urlParams?.comparisonMode ?? false);
  const [values2, setValues2] = useState(urlParams?.values2 ?? DEFAULT_SCENARIO2);
  const [isDark, toggleTheme] = useTheme();
  const [embedModalOpen, setEmbedModalOpen] = useState(false);

  // Validity checks
  const errors1 = validateValues(values);
  const valid1 = isValid(errors1);

  const errors2 = validateValues(values2);
  const valid2 = isValid(errors2);

  // Results should only be shown when the relevant scenario(s) are valid
  const resultsDisabled = !valid1 || (comparisonMode && !valid2);

  // Scenario 1 calculations
  const monthlyNetProfit = calcMonthlyNetProfit(values.monthlyRevenue, values.monthlyCosts);
  const paybackPeriod = calcPaybackPeriod(values.initialInvestment, monthlyNetProfit);
  const totalNetProfit = calcTotalNetProfit(monthlyNetProfit, values.period, values.initialInvestment);
  const roi = calcROI(totalNetProfit, values.initialInvestment);
  const chartData = buildChartData(monthlyNetProfit, values.initialInvestment, values.period);
  const tableData = buildTableData(values.monthlyRevenue, values.monthlyCosts, values.initialInvestment, values.period);

  // Scenario 2 calculations (shares the same period as Scenario 1)
  const monthlyNetProfit2 = calcMonthlyNetProfit(values2.monthlyRevenue, values2.monthlyCosts);
  const paybackPeriod2 = calcPaybackPeriod(values2.initialInvestment, monthlyNetProfit2);
  const totalNetProfit2 = calcTotalNetProfit(monthlyNetProfit2, values.period, values2.initialInvestment);
  const roi2 = calcROI(totalNetProfit2, values2.initialInvestment);
  const chartData2 = buildChartData(monthlyNetProfit2, values2.initialInvestment, values.period);
  const tableData2 = buildTableData(values2.monthlyRevenue, values2.monthlyCosts, values2.initialInvestment, values.period);

  function handleAddScenario() {
    setComparisonMode(true);
  }

  function handleRemoveScenario() {
    setComparisonMode(false);
    setValues2(DEFAULT_SCENARIO2);
  }

  // Merge chart data so both lines share the same x-axis entries
  const mergedChartData = chartData.map((point, i) => ({
    ...point,
    cashFlow2: chartData2[i]?.cashFlow,
  }));

  return (
    <div className="app">
      {/* Header is hidden in embed mode so the iframe looks clean */}
      {!embedMode && (
        <header className="app-header">
          <div className="epam-logo-box">EPAM</div>
          <div className="header-divider" />
          <div className="header-text">
            <h1 className="app-title">ROI Calculator</h1>
            <p className="app-subtitle">Enter your numbers to see your return on investment instantly</p>
          </div>
          <button
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            className="btn-export-pdf"
            onClick={() => window.print()}
            disabled={resultsDisabled}
            title={resultsDisabled ? 'Fix form errors before exporting' : 'Save as PDF'}
          >
            Export PDF
          </button>
          <button
            className="btn-embed"
            onClick={() => setEmbedModalOpen(true)}
            title="Get embed code"
          >
            Embed
          </button>
        </header>
      )}

      <div className="app-content">
        <main className={`app-layout${comparisonMode ? ' app-layout--comparison' : ''}`}>
          <aside className={`app-sidebar${comparisonMode ? ' app-sidebar--comparison' : ''}`}>
            <InputForm
              values={values}
              onChange={setValues}
              label={comparisonMode ? 'Scenario 1' : null}
            />
            {comparisonMode ? (
              <InputForm
                values={{ ...values2, period: values.period }}
                onChange={(newVals) => setValues2({ initialInvestment: newVals.initialInvestment, monthlyRevenue: newVals.monthlyRevenue, monthlyCosts: newVals.monthlyCosts })}
                label="Scenario 2"
                hidePeriod
              />
            ) : null}

            <div className="scenario-controls">
              {!comparisonMode ? (
                <button className="btn-add-scenario" onClick={handleAddScenario}>
                  + Add Scenario
                </button>
              ) : (
                <button className="btn-remove-scenario" onClick={handleRemoveScenario}>
                  Remove Scenario
                </button>
              )}
            </div>
          </aside>

          <section className="app-main">
            <Results
              roi={roi}
              paybackPeriod={paybackPeriod}
              totalNetProfit={totalNetProfit}
              monthlyNetProfit={monthlyNetProfit}
              comparisonMode={comparisonMode}
              roi2={roi2}
              paybackPeriod2={paybackPeriod2}
              totalNetProfit2={totalNetProfit2}
              monthlyNetProfit2={monthlyNetProfit2}
              disabled={resultsDisabled}
            />
            <CashFlowChart
              data={comparisonMode ? mergedChartData : chartData}
              comparisonMode={comparisonMode}
              disabled={resultsDisabled}
            />
            <MonthlyTable
              rows={tableData}
              rows2={tableData2}
              comparisonMode={comparisonMode}
              disabled={resultsDisabled}
            />
          </section>
        </main>
      </div>

      <PrintReport
        values={values}
        roi={roi}
        paybackPeriod={paybackPeriod}
        totalNetProfit={totalNetProfit}
        monthlyNetProfit={monthlyNetProfit}
        chartData={chartData}
        tableData={tableData}
        comparisonMode={comparisonMode}
        values2={{ ...values2, period: values.period }}
        roi2={roi2}
        paybackPeriod2={paybackPeriod2}
        totalNetProfit2={totalNetProfit2}
        monthlyNetProfit2={monthlyNetProfit2}
        chartData2={chartData2}
        tableData2={tableData2}
      />

      {embedModalOpen && (
        <EmbedModal
          values={values}
          comparisonMode={comparisonMode}
          values2={values2}
          isDark={isDark}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
