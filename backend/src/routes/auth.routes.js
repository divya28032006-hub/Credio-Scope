import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword,
  updateReminder
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  reminderValidator,
  resetPasswordValidator
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh', refresh);
router.get('/me', protect, me);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.put('/reminder', protect, reminderValidator, validate, updateReminder);

export default router;