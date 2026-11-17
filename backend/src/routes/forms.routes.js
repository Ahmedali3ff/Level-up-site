import { Router } from 'express';
import { submitContact, submitPartnership, search } from '../controllers/forms.controller.js';
import { formLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/contact', formLimiter, submitContact);
router.post('/partnerships', formLimiter, submitPartnership);
router.get('/search', search);

export default router;
