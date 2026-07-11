import { body, param, query } from 'express-validator';
import { categories } from '../utils/categories.js';

const budgetCategories = categories.filter((category) => category !== 'Salary');

export const budgetValidator = [
  body('category').isIn(budgetCategories).withMessage('Invalid budget category'),
  body('amount').isFloat({ gt: 0 }).withMessage('Budget amount must be greater than zero'),
  body('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must use YYYY-MM')
];

export const budgetListValidator = [
  query('month').optional().matches(/^\d{4}-\d{2}$/).withMessage('Month must use YYYY-MM')
];

export const budgetIdValidator = [param('id').isMongoId().withMessage('Invalid budget id')];
