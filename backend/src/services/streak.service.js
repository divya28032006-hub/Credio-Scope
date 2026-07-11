const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const yesterdayKey = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return toDateKey(yesterday);
};

export const updateLoggingStreak = async (user, date = new Date()) => {
  const today = toDateKey(date);

  if (user.streak.lastLoggedDate === today) return user.streak;

  if (user.streak.lastLoggedDate === yesterdayKey()) {
    user.streak.current += 1;
  } else {
    user.streak.current = 1;
  }

  user.streak.longest = Math.max(user.streak.longest, user.streak.current);
  user.streak.lastLoggedDate = today;
  await user.save();
  return user.streak;
};
