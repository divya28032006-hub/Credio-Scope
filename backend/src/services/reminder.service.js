import cron from 'node-cron';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { sendCashReminderEmail } from './email.service.js';

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const currentHHMM = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const runReminderCheck = async () => {
  try {
    const hhmm = currentHHMM();
    const todayKey = toDateKey();

    const users = await User.find({
      reminderEnabled: true,
      reminderTime: hhmm,
      lastReminderSentDate: { $ne: todayKey }
    }).select('+lastReminderSentDate');

    if (!users.length) return;

    const { start, end } = todayRange();

    for (const user of users) {
      const loggedToday = await Transaction.exists({
        user: user._id,
        type: 'expense',
        date: { $gte: start, $lt: end }
      });

      if (loggedToday) {
        user.lastReminderSentDate = todayKey;
        await user.save();
        continue;
      }

      await sendCashReminderEmail(user);
      user.lastReminderSentDate = todayKey;
      await user.save();
    }
  } catch (error) {
    console.error('Reminder cron failed:', error.message);
  }
};

export const startReminderCron = () => {
  // Runs every minute; each user only gets emailed once, at their own chosen HH:MM.
  cron.schedule('* * * * *', runReminderCheck);
  console.log('⏰ Cash reminder cron started');
};