import express from 'express';
import passport from 'passport';
import { finishOAuth } from '../config/passport.js';

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Google ───────────────────────────────────────────────────────────────────
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/login?error=google_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false, failWithError: true })(req, res, next);
  },
  (req, res) => finishOAuth(res, req.user),
  (err, req, res, next) => {
    console.error('Google OAuth error:', err.message);
    res.redirect(`${CLIENT_URL}/login?error=google_failed`);
  }
);

// ─── GitHub ───────────────────────────────────────────────────────────────────
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/login?error=github_not_configured`);
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

router.get('/github/callback',
  (req, res, next) => {
    passport.authenticate('github', { session: false, failWithError: true })(req, res, next);
  },
  (req, res) => finishOAuth(res, req.user),
  (err, req, res, next) => {
    console.error('GitHub OAuth error:', err.message);
    res.redirect(`${CLIENT_URL}/login?error=github_failed`);
  }
);

export default router;
