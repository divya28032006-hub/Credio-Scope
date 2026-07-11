import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateResetToken, hashToken, refreshCookieOptions, signAccessToken, signRefreshToken } from '../utils/token.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  streak: user.streak,
  reminderTime: user.reminderTime,
  reminderEnabled: user.reminderEnabled
});

const issueTokens = async (res, user) => {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());
  return accessToken;
};

export const register = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ message: 'Email is already registered' });

    const { name, email, password, reminderTime } = req.body;
    const user = await User.create({ name, email, password, reminderTime });
    const accessToken = await issueTokens(res, user);
    res.status(201).json({ user: publicUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password +refreshTokenHash');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = await issueTokens(res, user);
    res.json({ user: publicUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub).select('+refreshTokenHash');

    if (!user || user.refreshTokenHash !== hashToken(token)) {
      return res.status(401).json({ message: 'Refresh token invalid' });
    }

    const accessToken = await issueTokens(res, user);
    res.json({ user: publicUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = generateResetToken();
    user.resetPasswordTokenHash = hashToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRES_MIN || 30) * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(user, resetToken);

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const tokenHash = hashToken(req.params.token);
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+resetPasswordTokenHash +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = req.body.password;
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokenHash = undefined;
    await user.save();

    res.json({ message: 'Password updated. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    if (req.body.reminderTime !== undefined) req.user.reminderTime = req.body.reminderTime;
    if (req.body.reminderEnabled !== undefined) req.user.reminderEnabled = req.body.reminderEnabled;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(payload.sub, { $unset: { refreshTokenHash: 1 } });
      } catch (_error) {
        // Clearing the cookie is enough when the token is already invalid.
      }
    }

    res.clearCookie('refreshToken', refreshCookieOptions());
    res.json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};