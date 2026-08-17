'use client';

import { useAuth } from '../context/AuthContext';

/**
 * Reusable hook providing one reliable source of truth for the current authenticated user.
 * Features:
 * - Server state backed by TanStack Query (`GET /api/v1/users/me`).
 * - Explicit status string: 'loading' | 'unauthenticated' | 'authenticated'.
 * - Boolean helpers: isLoading, isUnauthenticated, isAuthenticated, isSupporter, isCreator, isAdmin.
 * - Strict backend role authority (never trusts local storage values).
 */
export function useCurrentUser() {
  const auth = useAuth();

  return {
    user: auth.user,
    token: auth.token,
    status: auth.status,
    role: auth.role,
    isLoading: auth.isLoading,
    isUnauthenticated: auth.isUnauthenticated,
    isAuthenticated: auth.isAuthenticated,
    isSupporter: auth.isSupporter,
    isCreator: auth.isCreator,
    isAdmin: auth.isAdmin,
    credits: auth.user?.credits ?? 0,
    raisedCredits: auth.user?.raisedCredits ?? auth.user?.raised_credits ?? 0,
    refetchUser: auth.refetchUser,
    login: auth.login,
    register: auth.register,
    googleSignIn: auth.googleSignIn,
    logout: auth.logout,
  };
}

export default useCurrentUser;
