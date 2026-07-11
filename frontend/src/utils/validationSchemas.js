// Centralized react-hook-form rule sets, reused across auth/transaction/budget forms
export const emailRule = { required: 'Email is required' };
export const passwordRule = {
  required: 'Password is required',
  minLength: { value: 8, message: 'Password must be at least 8 characters' }
};
export const requiredRule = (label) => ({ required: `${label} is required` });
export const positiveAmountRule = {
  required: 'Amount is required',
  min: { value: 0.01, message: 'Must be greater than 0' }
};