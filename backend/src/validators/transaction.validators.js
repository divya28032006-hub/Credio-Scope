import { body, param, query } from 'express-validator';
import { categories, transactionTypes } from '../utils/categories.js';

export const transactionValidator = [
  body('type').isIn(transactionTypes).withMessage('Type must be income or expense'),
  body('merchant').trim().isLength({ min: 1, max: 120 }).withMessage('Merchant is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('category').isIn(categories).withMessage('Invalid category'),
  body('source').optional().trim().isLength({ max: 80 }).withMessage('Source is too long'),
  body('note').optional().trim().isLength({ max: 400 }).withMessage('Note is too long'),
  body('date').isISO8601().toDate().withMessage('Valid date is required')
];

export const transactionUpdateValidator = [
  body('type').optional().isIn(transactionTypes).withMessage('Type must be income or expense'),
  body('merchant').optional().trim().isLength({ min: 1, max: 120 }).withMessage('Merchant is required'),
  body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('category').optional().isIn(categories).withMessage('Invalid category'),
  body('source').optional().trim().isLength({ max: 80 }).withMessage('Source is too long'),
  body('note').optional().trim().isLength({ max: 400 }).withMessage('Note is too long'),
  body('date').optional().isISO8601().toDate().withMessage('Valid date is required')
];

export const idValidator = [param('id').isMongoId().withMessage('Invalid id')];

export const listTransactionsValidator = [
  query('type').optional().isIn(transactionTypes).withMessage('Invalid type'),
  query('category').optional().isIn(categories).withMessage('Invalid category'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
];

export const parseSmsValidator = [
  body('message').trim().isLength({ min: 5, max: 1000 }).withMessage('Paste a valid SMS message')
];
