import Transaction from '../models/Transaction.js';

const startOfMonth = (offset = 0) => {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date;
};

// Turns [{ _id: { month: '2026-11', type: 'income' }, total: 100000 }, ...]
// into    [{ month: '2026-11', income: 100000, expense: 0, savings: 100000 }, ...]
// This is the exact shape the frontend charts expect.
export const pivotMonthly = (rows) => {
  const byMonth = new Map();
  for (const { _id, total } of rows) {
    if (!byMonth.has(_id.month)) byMonth.set(_id.month, { month: _id.month, income: 0, expense: 0 });
    byMonth.get(_id.month)[_id.type] = total;
  }
  return [...byMonth.values()]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => ({ ...m, savings: m.income - m.expense }));
};

export const getDashboard = async (req, res, next) => {
  try {
    const currentStart = startOfMonth();
    const nextStart = startOfMonth(1);
    const previousStart = startOfMonth(-1);
    const trendStart = startOfMonth(-11); // last 12 months incl. current

    const [totals, recentTransactions, monthlyRows, categoryTotals, topMerchants, previousTotals] =
      await Promise.all([
        Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: currentStart, $lt: nextStart } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]),
        Transaction.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(6),
        Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: trendStart, $lt: nextStart } } },
          {
            $group: {
              _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
              total: { $sum: '$amount' }
            }
          }
        ]),
        Transaction.aggregate([
          { $match: { user: req.user._id, type: 'expense', date: { $gte: currentStart, $lt: nextStart } } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } }
        ]),
        Transaction.aggregate([
          { $match: { user: req.user._id, type: 'expense' } },
          { $group: { _id: '$merchant', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 5 }
        ]),
        Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: previousStart, $lt: currentStart } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ])
      ]);

    const income = totals.find((t) => t._id === 'income')?.total || 0;
    const expense = totals.find((t) => t._id === 'expense')?.total || 0;
    const previousExpense = previousTotals.find((t) => t._id === 'expense')?.total || 0;
    const savings = income - expense;
    const savingsRate = income ? Math.round((savings / income) * 100) : 0;
    const monthly = pivotMonthly(monthlyRows);

    // Keys below match what Dashboard.jsx and Analytics.jsx read.
    res.json({
      summary: { income, expense, savings, savingsRate },
      recentTransactions,
      monthlyTotals: monthly.map(({ month, income: i, expense: e }) => ({ month, income: i, expense: e })),
      savingsTrend: monthly.map(({ month, savings: s }) => ({ month, savings: s })),
      categoryBreakdown: categoryTotals.map((c) => ({ category: c._id, amount: c.total })),
      topMerchants: topMerchants.map((m) => ({ merchant: m._id, total: m.total, count: m.count })),
      insights: {
        highestSpendingCategory: categoryTotals[0]?._id || 'None',
        spendingIncreaseComparedToPreviousMonth:
          previousExpense > 0 ? Math.round(((expense - previousExpense) / previousExpense) * 100) : null,
        savingsRate
      }
    });
  } catch (error) {
    next(error);
  }
};
