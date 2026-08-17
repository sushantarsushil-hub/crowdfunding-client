import {
  registerUser,
  loginUser,
  googleSignIn,
  getUserProfile,
  logoutUser,
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from './users';

export const authService = {
  login: loginUser,
  register: registerUser,
  googleAuth: googleSignIn,
  getMe: getUserProfile,
  logout: logoutUser,
  getAllUsers: getAdminUsers,
  updateUserRole,
  deleteUser,
};

export {
  loginUser as login,
  registerUser as register,
  googleSignIn as googleAuth,
  getUserProfile as getMe,
  logoutUser as logout,
  getAdminUsers as getAllUsers,
  updateUserRole,
  deleteUser,
};

export default authService;
