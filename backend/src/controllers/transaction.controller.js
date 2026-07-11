import Transaction from '../models/Transaction.js';
import { parseSms } from '../services/smsParser.service.js';
import { updateLoggingStreak } from '../services/streak.service.js';

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

export const listTransactions = async (req, res, next) => {
  try {
    const { type, category, search, limit = 50 } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.merchant = { $regex: search, $options: 'i' };

    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(Math.min(Number(limit), 100));

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({ ...req.body, user: req.user._id });
    const streak = await updateLoggingStreak(req.user, transaction.date);
    res.status(201).json({ transaction, streak });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

export const parseTransactionSms = (req, res) => {
  res.json({ parsed: parseSms(req.body.message) });
};

export const cashReminder = async (req, res, next) => {
  try {
    const { start, end } = todayRange();
    const count = await Transaction.countDocuments({
      user: req.user._id,
      type: 'expense',
      date: { $gte: start, $lt: end }
    });

    res.json({
      shouldRemind: count === 0,
      message: count === 0 ? 'Did you spend any cash today?' : null,
      streak: req.user.streak
    });
  } catch (error) {
    next(error);
  }
};