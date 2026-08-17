import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import withdrawalsService from '../services/withdrawals';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch Creator's submitted withdrawal requests
 */
export const useMyWithdrawals = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.withdrawals.my(params),
    queryFn: () => withdrawalsService.getMyWithdrawals(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Admin: Fetch all withdrawal requests
 */
export const useAdminWithdrawals = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.withdrawals.adminAll(params),
    queryFn: () => withdrawalsService.getAdminWithdrawals(params),
  });
};

/**
 * Admin: Fetch pending withdrawal requests queue
 */
export const usePendingWithdrawals = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.withdrawals.pending(params),
    queryFn: () => withdrawalsService.getPendingWithdrawals(params),
  });
};

/**
 * Creator Mutation: Submit credit withdrawal request
 */
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => withdrawalsService.createWithdrawal(data),
    onSuccess: () => {
      toast.success('Withdrawal request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.withdrawals.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to submit withdrawal request.');
    },
  });
};

export const useRequestWithdrawal = useCreateWithdrawal;

/**
 * Admin Mutation: Approve withdrawal request
 */
export const useApproveWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => withdrawalsService.approveWithdrawal(id),
    onSuccess: () => {
      toast.success('Withdrawal request approved successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.withdrawals.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to approve withdrawal.');
    },
  });
};

/**
 * Admin Mutation: Reject withdrawal request
 */
export const useRejectWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => withdrawalsService.rejectWithdrawal(id, reason),
    onSuccess: () => {
      toast.success('Withdrawal request rejected and held credits refunded.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.withdrawals.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to reject withdrawal.');
    },
  });
};

export default {
  useMyWithdrawals,
  useAdminWithdrawals,
  usePendingWithdrawals,
  useCreateWithdrawal,
  useRequestWithdrawal,
  useApproveWithdrawal,
  useRejectWithdrawal,
};
