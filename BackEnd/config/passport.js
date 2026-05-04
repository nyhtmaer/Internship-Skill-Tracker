/**
 * config/passport.js
 * 
 * Call initPassport(passport) AFTER dotenv.config() has already run.
 * This avoids the ESM module-cache timing issue where env vars
 * aren't available at import time.
 */
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export function initPassport(passport) {
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

  // ─── Google Strategy ───────────────────────────────────────────────────────
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use('google', new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email returned from Google'), null);
          let user = await User.findOne({ email: email.toLowerCase() });
          const isNew = !user;
          if (!user) {
            user = await User.create({
              email: email.toLowerCase(),
              name: profile.displayName || email.split('@')[0],
              password_hash: `oauth_google_${profile.id}`,
              role: 'student',
            });
          }
          return done(null, { user, isNew });
        } catch (err) {
          return done(err, null);
        }
      }
    ));
    console.log('✅ Google OAuth strategy registered');
  } else {
    console.log('⚠️  Google OAuth not configured (GOOGLE_CLIENT_ID/SECRET missing)');
  }

  // ─── GitHub Strategy ───────────────────────────────────────────────────────
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use('github', new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/github/callback',
        scope: ['user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          let user = await User.findOne({ email: email.toLowerCase() });
          const isNew = !user;
          if (!user) {
            user = await User.create({
              email: email.toLowerCase(),
              name: profile.displayName || profile.username || email.split('@')[0],
              password_hash: `oauth_github_${profile.id}`,
              role: 'student',
            });
          }
          return done(null, { user, isNew });
        } catch (err) {
          return done(err, null);
        }
      }
    ));
    console.log('✅ GitHub OAuth strategy registered');
  } else {
    console.log('⚠️  GitHub OAuth not configured (GITHUB_CLIENT_ID/SECRET missing)');
  }

  passport.serializeUser((data, done) => done(null, data?.user?._id || data));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-password_hash');
      done(null, { user, isNew: false });
    } catch (err) {
      done(err, null);
    }
  });
}

// Helper: issue JWT and redirect to frontend callback page
export function finishOAuth(res, data) {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
  const JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

  const { user, isNew } = data;
  const token = jwt.sign(
    { user_id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  const userData = { id: user._id, name: user.name, email: user.email, role: user.role };
  const params = new URLSearchParams({ token, user: JSON.stringify(userData), isNew: isNew ? '1' : '0' });
  res.redirect(`${CLIENT_URL}/oauth/callback?${params.toString()}`);
}
