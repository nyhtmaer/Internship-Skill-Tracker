import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * OAuthCallback — handles the redirect from /api/v1/auth/google/callback
 * and /api/v1/auth/github/callback.
 *
 * The backend redirects here with ?token=...&user=... in the URL.
 * We extract those, store them in AuthContext, then navigate to the dashboard.
 */
export default function OAuthCallback() {
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      const messages: Record<string, string> = {
        google_not_configured: 'Google OAuth is not configured. Ask the admin to add GOOGLE_CLIENT_ID.',
        github_not_configured: 'GitHub OAuth is not configured. Ask the admin to add GITHUB_CLIENT_ID.',
        google_failed: 'Google sign-in failed. Please try again.',
        github_failed: 'GitHub sign-in failed. Please try again.',
      };
      alert(messages[error] || 'OAuth sign-in failed.');
      window.location.replace('/login');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const isNew = params.get('isNew') === '1';
        login(token, user);
        // New users → onboarding, returning users → dashboard
        window.location.replace(isNew ? '/onboarding' : '/');
      } catch (e) {
        alert('Sign-in failed: invalid session data.');
        window.location.replace('/login');
      }
    } else {
      alert('Sign-in failed: no session data returned.');
      window.location.replace('/login');
    }
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
