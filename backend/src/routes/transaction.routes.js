import { Router } from 'express';
import {
  cashReminder,
  createTransaction,
  deleteTransaction,
  listTransactions,
  parseTransactionSms,
  updateTransaction
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  idValidator,
  listTransactionsValidator,
  parseSmsValidator,
  transactionUpdateValidator,
  transactionValidator
} from '../validators/transaction.validators.js';

const router = Router();

router.use(protect);
router.get('/', listTransactionsValidator, validate, listTransactions);
router.post('/', transactionValidator, validate, createTransaction);
router.put('/:id', idValidator, transactionUpdateValidator, validate, updateTransaction);
router.delete('/:id', idValidator, validate, deleteTransaction);
router.post('/parse-sms', parseSmsValidator, validate, parseTransactionSms);
router.get('/cash-reminder', cashReminder);

export default router;
