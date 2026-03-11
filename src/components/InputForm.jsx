function InputForm({ values, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...values, [name]: name === 'period' ? Number(value) : Number(value) });
  }

  return (
    <div className="card">
      <h2 className="card-title">Investment Parameters</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="initialInvestment">
          Initial Investment ($)
        </label>
        <input
          className="form-input"
          id="initialInvestment"
          name="initialInvestment"
          type="number"
          min="0"
          value={values.initialInvestment}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="monthlyRevenue">
          Expected Monthly Revenue ($)
        </label>
        <input
          className="form-input"
          id="monthlyRevenue"
          name="monthlyRevenue"
          type="number"
          min="0"
          value={values.monthlyRevenue}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="monthlyCosts">
          Monthly Operating Costs ($)
        </label>
        <input
          className="form-input"
          id="monthlyCosts"
          name="monthlyCosts"
          type="number"
          min="0"
          value={values.monthlyCosts}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="period">
          Calculation Period (months)
        </label>
        <select
          className="form-input form-select"
          id="period"
          name="period"
          value={values.period}
          onChange={handleChange}
        >
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
        </select>
      </div>
    </div>
  );
}

export default InputForm;
