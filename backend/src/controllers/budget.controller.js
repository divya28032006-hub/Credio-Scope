import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

const currentMonth = () => new Date().toISOString().slice(0, 7);

const monthRange = (month) => {
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start, end };
};

export const listBudgets = async (req, res, next) => {
  try {
    const month = req.query.month || currentMonth();
    const budgets = await Budget.find({ user: req.user._id, month }).sort({ category: 1 });
    const { start, end } = monthRange(month);

    const spending = await Transaction.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const spendingMap = new Map(spending.map((item) => [item._id, item.total]));
    const enriched = budgets.map((budget) => {
      const spent = spendingMap.get(budget.category) || 0;
      const percent = budget.amount ? Math.round((spent / budget.amount) * 100) : 0;
      return {
        ...budget.toObject(),
        spent,
        remaining: budget.amount - spent,
        percent,
        status: percent < 80 ? 'green' : percent <= 100 ? 'yellow' : 'red'
      };
    });

    res.json({ budgets: enriched });
  } catch (error) {
    next(error);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const month = req.body.month || currentMonth();
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category: req.body.category, month },
      { amount: req.body.amount, month },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ budget });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};
