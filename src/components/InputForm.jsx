import { useState } from 'react';
import { validateValues } from '../utils/validation';

function InputForm({ values, onChange, label, hidePeriod, symbol = '$', children }) {
  const [touched, setTouched] = useState({
    initialInvestment: false,
    monthlyRevenue: false,
    monthlyCosts: false,
  });

  const errors = validateValues(values);
  const idPrefix = label ? label.replace(/\s+/g, '-').toLowerCase() + '-' : '';

  function handleChange(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    onChange({ ...values, [name]: Number(value) });
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function fieldClass(name) {
    return `form-input${touched[name] && errors[name] ? ' form-input--error' : ''}`;
  }

  return (
    <div className={`card${label ? ' card--scenario' : ''}`}>
      {label ? <div className="scenario-label">{label}</div> : null}
      <h2 className="card-title">Investment Parameters</h2>

      {/* Currency switcher slot — only rendered for Scenario 1 */}
      {children}

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}initialInvestment`}>
          Initial Investment ({symbol})
        </label>
        <input
          className={fieldClass('initialInvestment')}
          id={`${idPrefix}initialInvestment`}
          name="initialInvestment"
          type="number"
          min="0"
          value={values.initialInvestment}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.initialInvestment && errors.initialInvestment ? (
          <p className="form-error">{errors.initialInvestment}</p>
        ) : null}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}monthlyRevenue`}>
          Expected Monthly Revenue ({symbol})
        </label>
        <input
          className={fieldClass('monthlyRevenue')}
          id={`${idPrefix}monthlyRevenue`}
          name="monthlyRevenue"
          type="number"
          min="0"
          value={values.monthlyRevenue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.monthlyRevenue && errors.monthlyRevenue ? (
          <p className="form-error">{errors.monthlyRevenue}</p>
        ) : null}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}monthlyCosts`}>
          Monthly Operating Costs ({symbol})
        </label>
        <input
          className={fieldClass('monthlyCosts')}
          id={`${idPrefix}monthlyCosts`}
          name="monthlyCosts"
          type="number"
          min="0"
          value={values.monthlyCosts}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.monthlyCosts && errors.monthlyCosts ? (
          <p className="form-error">{errors.monthlyCosts}</p>
        ) : null}
      </div>

      {!hidePeriod ? (
        <div className="form-group">
          <label className="form-label" htmlFor={`${idPrefix}period`}>
            Calculation Period (months)
          </label>
          <select
            className="form-input form-select"
            id={`${idPrefix}period`}
            name="period"
            value={values.period}
            onChange={handleChange}
          >
            <option value={12}>12 months</option>
            <option value={24}>24 months</option>
            <option value={36}>36 months</option>
          </select>
        </div>
      ) : (
        <div className="form-group form-group--period-shared">
          <span className="form-label">Calculation Period (months)</span>
          <span className="period-shared-note">Shared with Scenario 1</span>
        </div>
      )}
    </div>
  );
}

export default InputForm;
