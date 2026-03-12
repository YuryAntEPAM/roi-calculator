/**
 * Validates a single scenario's input values.
 * Returns an object where each key is a field name and the value is
 * an error message string, or null if that field is valid.
 */
export function validateValues(values) {
  const errors = {
    initialInvestment: null,
    monthlyRevenue: null,
    monthlyCosts: null,
  };

  // Initial Investment: must be a positive number and at least $1,000
  if (values.initialInvestment === '' || values.initialInvestment === null || isNaN(values.initialInvestment)) {
    errors.initialInvestment = 'Please enter a valid number.';
  } else if (values.initialInvestment <= 0) {
    errors.initialInvestment = 'Initial investment must be greater than $0.';
  } else if (values.initialInvestment < 1000) {
    errors.initialInvestment = 'Initial investment must be at least $1,000.';
  }

  // Monthly Revenue: must be greater than zero
  if (values.monthlyRevenue === '' || values.monthlyRevenue === null || isNaN(values.monthlyRevenue)) {
    errors.monthlyRevenue = 'Please enter a valid number.';
  } else if (values.monthlyRevenue <= 0) {
    errors.monthlyRevenue = 'Monthly revenue must be greater than $0.';
  }

  // Monthly Costs: must be zero or a positive number (zero is allowed — no costs is valid)
  if (values.monthlyCosts === '' || values.monthlyCosts === null || isNaN(values.monthlyCosts)) {
    errors.monthlyCosts = 'Please enter a valid number.';
  } else if (values.monthlyCosts < 0) {
    errors.monthlyCosts = 'Monthly costs cannot be negative.';
  }

  return errors;
}

/**
 * Returns true if all fields in the errors object are null (i.e. no errors).
 */
export function isValid(errors) {
  return Object.values(errors).every((e) => e === null);
}
