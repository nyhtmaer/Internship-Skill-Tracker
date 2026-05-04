import express from 'express';
import authRouter from './auth.js';
import oauthRouter from './oauth.js';
import usersRouter from './users.js';
import recordsRouter from './records.js';
import skillsRouter from './skills.js';
import evidenceRouter from './evidence.js';
import analyticsRouter from './analytics.js';
import portfolioRouter from './portfolio.js';
import onboardingRouter from './onboarding.js';
import githubRouter from './github.js';
import cvRouter from './cv.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes (no authentication required)
router.use('/auth', authRouter);
router.use('/auth', oauthRouter);

// Protected routes (require JWT authentication)
router.use('/users', requireAuth, usersRouter);
router.use('/records', requireAuth, recordsRouter);
router.use('/skills', requireAuth, skillsRouter);
router.use('/evidence', requireAuth, evidenceRouter);
router.use('/analytics', requireAuth, analyticsRouter);
router.use('/portfolio', requireAuth, portfolioRouter);
router.use('/onboarding', requireAuth, onboardingRouter);
router.use('/github', requireAuth, githubRouter);
router.use('/cv', requireAuth, cvRouter);

export default router;
