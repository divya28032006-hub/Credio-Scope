import Transaction from '../models/Transaction.js';

const startOfMonth = (offset = 0) => {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date;
};

export const getDashboard = async (req, res, next) => {
  try {
    const currentStart = startOfMonth();
    const nextStart = startOfMonth(1);
    const previousStart = startOfMonth(-1);

    const [totals, recentTransactions, monthlyTotals, categoryTotals, topMerchants, savingsTrend, previousTotals] =
      await Promise.all([
        Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: currentStart, $lt: nextStart } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ]),
        Transaction.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(6),
        Transaction.aggregate([
          { $match: { user: req.user._id } },
          {
            $group: {
              _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { '_id.month': 1 } },
          { $limit: 24 }
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
          { $match: { user: req.user._id } },
          {
            $group: {
              _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
              total: { $sum: '$amount' }
            }
          },
          { $sort: { '_id.month': 1 } }
        ]),
        Transaction.aggregate([
          { $match: { user: req.user._id, date: { $gte: previousStart, $lt: currentStart } } },
          { $group: { _id: '$type', total: { $sum: '$amount' } } }
        ])
      ]);

    const currentIncome = totals.find((item) => item._id === 'income')?.total || 0;
    const currentExpenses = totals.find((item) => item._id === 'expense')?.total || 0;
    const previousExpenses = previousTotals.find((item) => item._id === 'expense')?.total || 0;
    const savings = currentIncome - currentExpenses;
    const savingsPercentage = currentIncome ? Math.round((savings / currentIncome) * 100) : 0;
    const highestCategory = categoryTotals[0]?._id || 'None';
    const spendingIncrease =
      previousExpenses > 0 ? Math.round(((currentExpenses - previousExpenses) / previousExpenses) * 100) : null;

    res.json({
      totals: {
        income: currentIncome,
        expenses: currentExpenses,
        savings,
        savingsPercentage
      },
      recentTransactions,
      charts: {
        monthlyTotals,
        categoryTotals,
        topMerchants,
        savingsTrend
      },
      insights: {
        highestSpendingCategory: highestCategory,
        spendingIncreaseComparedToPreviousMonth: spendingIncrease,
        savingsRate: savingsPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};
