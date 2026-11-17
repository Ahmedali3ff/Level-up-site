import { Router } from 'express';
import { login, logout, me, googleStart, googleCallback } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

router.get('/google', googleStart);
router.get('/google/callback', googleCallback);

export default router;
