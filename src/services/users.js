import axiosInstance from '../api/axiosInstance';

/**
 * Register user (Supporter or Creator)
 * POST /auth/register
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

/**
 * User login with credentials
 * POST /auth/login
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

/**
 * Authenticate or register with Google OAuth ID token
 * POST /auth/google
 */
export const googleSignIn = async (payload) => {
  const response = await axiosInstance.post('/auth/google', payload);
  return response.data;
};

/**
 * Get authenticated user profile & balance
 * GET /auth/me (or GET /users/profile)
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (err) {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  }
};

export const getMe = getUserProfile;
export const getProfile = getUserProfile;

/**
 * Log out user session
 * POST /auth/logout
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

/**
 * Get user credit transactions history
 * GET /users/transactions
 */
export const getUserTransactions = async (params = {}) => {
  const response = await axiosInstance.get('/users/transactions', { params });
  return response.data;
};

/**
 * Admin: Get dashboard high-level analytics & platform metrics
 * GET /admin/dashboard-stats
 */
export const getAdminDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard-stats');
    return response.data;
  } catch (err) {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  }
};

/**
 * Admin: Get paginated list of user accounts
 * GET /admin/users
 */
export const getAdminUsers = async (params = {}) => {
  const response = await axiosInstance.get('/admin/users', { params });
  return response.data;
};

/**
 * Admin: Update user role (supporter, creator, admin)
 * PATCH /admin/users/:id/role
 */
export const updateUserRole = async (userId, role) => {
  const payload = typeof role === 'object' ? role : { role };
  const response = await axiosInstance.patch(`/admin/users/${userId}/role`, payload);
  return response.data;
};

/**
 * Admin: Delete user account
 * DELETE /admin/users/:id
 */
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`);
  return response.data;
};

const usersService = {
  registerUser,
  loginUser,
  googleSignIn,
  getUserProfile,
  getMe,
  getProfile,
  logoutUser,
  getUserTransactions,
  getAdminDashboardStats,
  getAdminUsers,
  updateUserRole,
  deleteUser,
};

export default usersService;
