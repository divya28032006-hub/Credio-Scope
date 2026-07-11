export const formatDate = (date, options = { day: 'numeric', month: 'short' }) =>
  new Date(date).toLocaleDateString('en-IN', options);