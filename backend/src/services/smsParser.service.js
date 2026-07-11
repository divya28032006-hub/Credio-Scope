const sourcePatterns = [
  { source: 'GPay', regex: /\b(?:gpay|google\s*pay)\b/i },
  { source: 'PhonePe', regex: /\bphonepe\b/i },
  { source: 'Paytm', regex: /\bpaytm\b/i },
  { source: 'BHIM', regex: /\bbhim\b/i }
];

const merchantRegexes = [
  /(?:paid|debited|sent|transferred)\s+(?:to|at)\s+([a-z0-9 .&'-]+)/i,
  /(?:to|at)\s+([a-z0-9 .&'-]+?)\s+(?:via|on|using|from|upi|ref|txn|transaction|for|$)/i,
  /(?:merchant|payee)\s*[:\-]\s*([a-z0-9 .&'-]+)/i
];

const dateRegexes = [
  /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/,
  /\b(\d{4}-\d{2}-\d{2})\b/,
  /\bon\s+([a-z]{3,9}\s+\d{1,2},?\s+\d{4})\b/i
];

const cleanupMerchant = (value = '') =>
  value
    .replace(/\b(?:via|on|using|from|upi|ref|txn|transaction|debited|credited|a\/c|account).*$/i, '')
    .replace(/[.]+$/, '')
    .trim();

export const parseSms = (message) => {
  const amountMatch = message.match(/(?:₹|rs\.?|inr)\s*([0-9,]+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : null;

  const source = sourcePatterns.find((pattern) => pattern.regex.test(message))?.source || 'Bank Alert';

  let merchant = '';
  for (const regex of merchantRegexes) {
    const match = message.match(regex);
    if (match?.[1]) {
      merchant = cleanupMerchant(match[1]);
      break;
    }
  }

  const dateText = dateRegexes.map((regex) => message.match(regex)?.[1]).find(Boolean);
  const parsedDate = dateText ? new Date(dateText) : new Date();
  const date = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  return {
    amount,
    merchant: merchant || 'Unknown Merchant',
    source,
    date,
    category: 'Other',
    type: 'expense'
  };
};
