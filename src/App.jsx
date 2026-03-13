import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useExchangeRates } from './hooks/useExchangeRates';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import MonthlyTable from './components/MonthlyTable';
import PrintReport from './components/PrintReport';
import EmbedModal from './components/EmbedModal';
import CurrencySwitcher from './components/CurrencySwitcher';
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
import { getSymbol, convertFromUSD, convertToUSD } from './utils/currencies';
import './App.css';
import './print.css';

// Internal values are always stored in USD
const DEFAULT_VALUES_USD = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

const DEFAULT_SCENARIO2_USD = {
  initialInvestment: 80000,
  monthlyRevenue: 12000,
  monthlyCosts: 4000,
};

// Read URL params once at module load — before first render
const urlParams = readParamsFromURL();
const embedMode = isEmbedMode();

function App() {
  // USD base values — source of truth
  const [valuesUSD, setValuesUSD] = useState(urlParams?.values ?? DEFAULT_VALUES_USD);
  const [values2USD, setValues2USD] = useState(urlParams?.values2 ?? DEFAULT_SCENARIO2_USD);
  const [comparisonMode, setComparisonMode] = useState(urlParams?.comparisonMode ?? false);

  const [isDark, toggleTheme] = useTheme();
  const [embedModalOpen, setEmbedModalOpen] = useState(false);

  // Currency
  const [currencyCode, setCurrencyCode] = useState('USD');
  const { rates, loading: ratesLoading, error: ratesError } = useExchangeRates();
  const symbol = getSymbol(currencyCode);

  // Convert USD base values to the selected currency for display / input
  function toDisplay(usdVal) {
    return convertFromUSD(usdVal, currencyCode, rates);
  }

  // The "display" values shown in the form inputs
  const values = {
    initialInvestment: toDisplay(valuesUSD.initialInvestment),
    monthlyRevenue: toDisplay(valuesUSD.monthlyRevenue),
    monthlyCosts: toDisplay(valuesUSD.monthlyCosts),
    period: valuesUSD.period,
  };

  const values2 = {
    initialInvestment: toDisplay(values2USD.initialInvestment),
    monthlyRevenue: toDisplay(values2USD.monthlyRevenue),
    monthlyCosts: toDisplay(values2USD.monthlyCosts),
  };

  // When the user edits, convert back to USD for storage
  function handleValuesChange(newDisplayVals) {
    setValuesUSD({
      initialInvestment: convertToUSD(newDisplayVals.initialInvestment, currencyCode, rates),
      monthlyRevenue: convertToUSD(newDisplayVals.monthlyRevenue, currencyCode, rates),
      monthlyCosts: convertToUSD(newDisplayVals.monthlyCosts, currencyCode, rates),
      period: newDisplayVals.period,
    });
  }

  function handleValues2Change(newDisplayVals) {
    setValues2USD({
      initialInvestment: convertToUSD(newDisplayVals.initialInvestment, currencyCode, rates),
      monthlyRevenue: convertToUSD(newDisplayVals.monthlyRevenue, currencyCode, rates),
      monthlyCosts: convertToUSD(newDisplayVals.monthlyCosts, currencyCode, rates),
    });
  }

  // Validity checks (run against displayed values)
  const errors1 = validateValues(values);
  const valid1 = isValid(errors1);
  const errors2 = validateValues(values2);
  const valid2 = isValid(errors2);
  const resultsDisabled = !valid1 || (comparisonMode && !valid2);

  // Scenario 1 calculations (in display currency)
  const monthlyNetProfit = calcMonthlyNetProfit(values.monthlyRevenue, values.monthlyCosts);
  const paybackPeriod = calcPaybackPeriod(values.initialInvestment, monthlyNetProfit);
  const totalNetProfit = calcTotalNetProfit(monthlyNetProfit, values.period, values.initialInvestment);
  const roi = calcROI(totalNetProfit, values.initialInvestment);
  const chartData = buildChartData(monthlyNetProfit, values.initialInvestment, values.period);
  const tableData = buildTableData(values.monthlyRevenue, values.monthlyCosts, values.initialInvestment, values.period);

  // Scenario 2 calculations
  const monthlyNetProfit2 = calcMonthlyNetProfit(values2.monthlyRevenue, values2.monthlyCosts);
  const paybackPeriod2 = calcPaybackPeriod(values2.initialInvestment, monthlyNetProfit2);
  const totalNetProfit2 = calcTotalNetProfit(monthlyNetProfit2, values.period, values2.initialInvestment);
  const roi2 = calcROI(totalNetProfit2, values2.initialInvestment);
  const chartData2 = buildChartData(monthlyNetProfit2, values2.initialInvestment, values.period);
  const tableData2 = buildTableData(values2.monthlyRevenue, values2.monthlyCosts, values2.initialInvestment, values.period);

  function handleAddScenario() { setComparisonMode(true); }
  function handleRemoveScenario() {
    setComparisonMode(false);
    setValues2USD(DEFAULT_SCENARIO2_USD);
  }

  const mergedChartData = chartData.map((point, i) => ({
    ...point,
    cashFlow2: chartData2[i]?.cashFlow,
  }));

  return (
    <div className="app">
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
              onChange={handleValuesChange}
              label={comparisonMode ? 'Scenario 1' : null}
              currencyCode={currencyCode}
              symbol={symbol}
            >
              {/* Currency switcher lives inside the first form card */}
              <CurrencySwitcher
                selectedCode={currencyCode}
                onChange={setCurrencyCode}
                loading={ratesLoading}
                error={ratesError}
              />
            </InputForm>

            {comparisonMode ? (
              <InputForm
                values={{ ...values2, period: values.period }}
                onChange={(newVals) => handleValues2Change({
                  initialInvestment: newVals.initialInvestment,
                  monthlyRevenue: newVals.monthlyRevenue,
                  monthlyCosts: newVals.monthlyCosts,
                })}
                label="Scenario 2"
                hidePeriod
                currencyCode={currencyCode}
                symbol={symbol}
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
              symbol={symbol}
            />
            <CashFlowChart
              data={comparisonMode ? mergedChartData : chartData}
              comparisonMode={comparisonMode}
              disabled={resultsDisabled}
              symbol={symbol}
            />
            <MonthlyTable
              rows={tableData}
              rows2={tableData2}
              comparisonMode={comparisonMode}
              disabled={resultsDisabled}
              symbol={symbol}
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
        symbol={symbol}
        currencyCode={currencyCode}
      />

      {embedModalOpen && (
        <EmbedModal
          values={valuesUSD}
          comparisonMode={comparisonMode}
          values2={values2USD}
          isDark={isDark}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
