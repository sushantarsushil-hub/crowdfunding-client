import axios from 'axios';

/**
 * Resolves API Base URL from NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL
 * Defaults to http://localhost:5000/api/v1
 */
const getBaseURL = () => {
  const envUrl =
    (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_API_URL || process.env?.NEXT_PUBLIC_API_BASE_URL)) ||
    (typeof window !== 'undefined' && (window.__ENV__?.NEXT_PUBLIC_API_URL || window.__ENV__?.NEXT_PUBLIC_API_BASE_URL)) ||
    'http://localhost:5000/api/v1';

  return envUrl.replace(/\/+$/, '');
};

/**
 * Centralized Axios Instance
 */
export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Matching authentication architecture for credentials/cookies
});

/**
 * Request Interceptor: Attach bearer token if present in localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Consistent API error extraction & Centralized 401/403/Network Error Handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message;

    // Standardized Friendly User Error Messages (Never expose raw backend stack traces or alert windows)
    if (!error.response) {
      // Network Error / Offline / Connection Timeout
      message = 'Unable to connect to the server. Please try again.';
    } else if (status === 401) {
      message = 'Your session has expired. Please sign in again.';
      if (typeof window !== 'undefined') {
        const existingToken =
          localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (existingToken) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token');
          localStorage.removeItem('auth_user');
          window.dispatchEvent(
            new CustomEvent('auth:unauthorized', { detail: { message, status } })
          );
        }
      }
    } else if (status === 403) {
      message = "You don't have permission to perform this action.";
    } else if (status === 404) {
      message = message || 'Requested resource not found.';
    } else if (status >= 500) {
      message = 'An unexpected server error occurred. Please try again later.';
    }

    const formattedError = {
      status: status || 500,
      message: message || 'Unable to connect to the server. Please try again.',
      errors: error.response?.data?.errors || null,
      error: error.response?.data?.error || null,
      data: error.response?.data || null,
      originalError: error,
    };

    return Promise.reject(formattedError);
  }
);

export default apiClient;
