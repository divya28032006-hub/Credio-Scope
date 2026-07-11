import { Router } from 'express';
import { deleteBudget, listBudgets, upsertBudget } from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { budgetIdValidator, budgetListValidator, budgetValidator } from '../validators/budget.validators.js';

const router = Router();

router.use(protect);
router.get('/', budgetListValidator, validate, listBudgets);
router.post('/', budgetValidator, validate, upsertBudget);
router.delete('/:id', budgetIdValidator, validate, deleteBudget);

export default router;
