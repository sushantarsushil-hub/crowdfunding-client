import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api/auth.api.js';
import { usersApi } from '../lib/api/users.api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [isAuthActionLoading, setIsAuthActionLoading] = useState(false);

  // Sync token from localStorage strictly after client-side mount to prevent SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  // TanStack Query: One reliable server state source for the authenticated user
  const {
    data: user = null,
    isLoading: isUserQueryLoading,
    isError: isUserQueryError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await usersApi.getProfile();
      return res;
    },
    enabled: isMounted && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 15,
    retry: false,
  });

  // Calculate overall loading state (True while unmounted or while user query/action is running)
  const isLoading = !isMounted || (!!token && isUserQueryLoading) || isAuthActionLoading;

  // Determine explicit authentication status strictly from backend query
  const status = useMemo(() => {
    if (!isMounted || isLoading) return 'loading';
    if (token && user && !isUserQueryError) return 'authenticated';
    return 'unauthenticated';
  }, [isMounted, isLoading, token, user, isUserQueryError]);

  // Clean up session if token is invalid or expired
  useEffect(() => {
    if (token && isUserQueryError) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      setToken(null);
      queryClient.setQueryData(['currentUser'], null);
    }
  }, [token, isUserQueryError, queryClient]);

  // Listen for global 401 unauthorized session expiration events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = (event) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      setToken(null);
      queryClient.setQueryData(['currentUser'], null);
      toast.error(event.detail?.message || 'Session expired. Please log in again.');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, [queryClient]);

  // Helper to persist auth token
  const saveSession = (authToken, userData) => {
    if (authToken && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
    }
    if (userData) {
      queryClient.setQueryData(['currentUser'], userData);
    }
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  // 1. Login
  const login = async ({ email, password }) => {
    setIsAuthActionLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const data = response?.data || response;
      const authToken = data.token || data.accessToken;
      const userData = data.user;

      saveSession(authToken, userData);
      toast.success(`Welcome back, ${userData?.name || 'User'}!`);
      return userData;
    } catch (error) {
      const errMsg = error.message || 'Login failed. Please check your credentials.';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 2. Register
  const register = async ({ name, email, avatar, photoUrl, password, role }) => {
    setIsAuthActionLoading(true);
    try {
      const response = await authApi.register({
        name,
        email,
        photoUrl: photoUrl || avatar || '',
        password,
        role,
      });
      const data = response?.data || response;
      const authToken = data.token || data.accessToken;
      const userData = data.user;

      saveSession(authToken, userData);
      toast.success(`Welcome to FundFlow, ${userData?.name || name}! Account registered.`);
      return userData;
    } catch (error) {
      const errMsg = error.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 3. Google Sign-In
  const googleSignIn = async (idToken, role = 'supporter') => {
    setIsAuthActionLoading(true);
    try {
      const response = await authApi.googleSignIn({ idToken, role });
      const data = response?.data || response;
      const authToken = data.token || data.accessToken;
      const userData = data.user;

      saveSession(authToken, userData);
      toast.success('Successfully signed in with Google!');
      return userData;
    } catch (error) {
      const errMsg = error.message || 'Google Authentication failed.';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsAuthActionLoading(false);
    }
  };

  // 4. Logout
  const logout = async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      setToken(null);
      queryClient.setQueryData(['currentUser'], null);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Successfully logged out.');
    }
  };

  // Extract backend user role strictly from backend query data
  const userRole = user?.role || null;

  const value = {
    user,
    token,
    status, // 'loading' | 'unauthenticated' | 'authenticated'
    isLoading,
    isUnauthenticated: status === 'unauthenticated',
    isAuthenticated: status === 'authenticated',
    isSupporter: status === 'authenticated' && userRole === 'supporter',
    isCreator: status === 'authenticated' && userRole === 'creator',
    isAdmin: status === 'authenticated' && userRole === 'admin',
    role: userRole,
    login,
    register,
    googleSignIn,
    logout,
    refreshUser: refetchUser,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
