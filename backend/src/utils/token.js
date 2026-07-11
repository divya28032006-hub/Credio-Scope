import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m'
  });

export const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId, jti: crypto.randomUUID() }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d'
  });

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000
});