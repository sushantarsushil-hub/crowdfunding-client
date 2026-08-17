import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import usersService from '../services/users';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch authenticated user profile & balance
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users.profile,
    queryFn: () => usersService.getUserProfile(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMe = useUserProfile;

/**
 * Fetch user credit transactions history
 */
export const useUserTransactions = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.users.transactions(params),
    queryFn: () => usersService.getUserTransactions(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Admin: Fetch platform analytics and dashboard statistics
 */
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.admin.stats,
    queryFn: () => usersService.getAdminDashboardStats(),
    staleTime: 1000 * 60 * 3,
  });
};

export const useAdminStats = useAdminDashboardStats;

/**
 * Admin: Fetch paginated platform user accounts
 */
export const useAdminUsers = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.users.adminList(params),
    queryFn: () => usersService.getAdminUsers(params),
  });
};

/**
 * Admin Mutation: Update user role
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }) => usersService.updateUserRole(userId, role),
    onSuccess: () => {
      toast.success('User role updated successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update user role.');
    },
  });
};

/**
 * Admin Mutation: Delete user account
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => usersService.deleteUser(userId),
    onSuccess: () => {
      toast.success('User account deleted.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete user.');
    },
  });
};

export default {
  useUserProfile,
  useMe,
  useUserTransactions,
  useAdminDashboardStats,
  useAdminStats,
  useAdminUsers,
  useUpdateUserRole,
  useDeleteUser,
};
