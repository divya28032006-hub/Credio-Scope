import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('reminderTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Reminder time must be in HH:MM 24-hour format')
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email')
];

export const resetPasswordValidator = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

export const reminderValidator = [
  body('reminderTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Reminder time must be in HH:MM 24-hour format'),
  body('reminderEnabled').optional().isBoolean().withMessage('reminderEnabled must be true or false')
];