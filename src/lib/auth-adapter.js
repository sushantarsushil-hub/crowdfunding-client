/**
 * Better Auth & REST API Session Adapter
 * 
 * Separates Better Auth session mechanisms from Express REST API bearer tokens.
 * Handles credential exchange between Better Auth sessions and Axios API calls cleanly.
 */

import { authClient } from './auth-client';
import apiClient from './axios';

export const authAdapter = {
  /**
   * Sign up user using Better Auth client
   */
  async signUpEmail({ email, password, name, role = 'supporter', photoUrl = '' }) {
    try {
      // 1. Primary Better Auth sign up
      const betterAuthRes = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl,
      });

      // 2. Sync with REST API backend to ensure user profile & role credits are initialized
      const apiRes = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role,
        photoUrl,
      }).catch(() => null); // Fallback gracefully if backend relies purely on Better Auth cookies

      const data = apiRes?.data?.data || apiRes?.data || betterAuthRes?.data;
      const token = data?.token || data?.accessToken;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Better Auth Sign Up failed.');
    }
  },

  /**
   * Sign in user using Better Auth client
   */
  async signInEmail({ email, password }) {
    try {
      // 1. Primary Better Auth sign in
      const betterAuthRes = await authClient.signIn.email({
        email,
        password,
      });

      // 2. Sync REST API credentials
      const apiRes = await apiClient.post('/auth/login', {
        email,
        password,
      }).catch(() => null);

      const data = apiRes?.data?.data || apiRes?.data || betterAuthRes?.data;
      const token = data?.token || data?.accessToken;

      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Better Auth Sign In failed.');
    }
  },

  /**
   * Social Sign In (Google OAuth)
   */
  async signInGoogle(idToken, role = 'supporter') {
    try {
      // Better Auth social sign in trigger
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/dashboard`,
      }).catch(async () => {
        // Fallback: If idToken is provided directly, exchange via REST auth endpoint
        const response = await apiClient.post('/auth/google', { idToken, role });
        return response.data?.data || response.data;
      });

      const token = result?.token || result?.accessToken;
      if (token && typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }

      return result;
    } catch (error) {
      throw new Error(error.message || 'Google Social Sign In failed.');
    }
  },

  /**
   * Sign Out
   */
  async signOutUser() {
    try {
      await authClient.signOut().catch(() => {});
      await apiClient.post('/auth/logout').catch(() => {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  },

  /**
   * Fetch Active Session
   */
  async getCurrentSession() {
    try {
      const session = await authClient.getSession().catch(() => null);
      if (session?.data?.user) {
        return session.data.user;
      }

      // Fallback REST API check
      const response = await apiClient.get('/auth/me');
      return response.data?.data?.user || response.data?.user || response.data?.data;
    } catch (error) {
      return null;
    }
  },
};

export default authAdapter;
