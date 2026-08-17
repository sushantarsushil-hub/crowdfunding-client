import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import contributionsService from '../services/contributions';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch Supporter's submitted contributions history
 */
export const useMyContributions = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.contributions.my(params),
    queryFn: () => contributionsService.getMyContributions(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Creator: Fetch pending contributions moderation queue
 */
export const useCreatorPendingContributions = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.contributions.creatorPending(params),
    queryFn: () => contributionsService.getCreatorPendingContributions(params),
  });
};

export const useContributionsToReview = useCreatorPendingContributions;
export const usePendingContributions = useCreatorPendingContributions;

/**
 * Supporter Mutation: Submit credit contribution to campaign
 */
export const useCreateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => contributionsService.createContribution(data),
    onSuccess: (_, variables) => {
      toast.success('Contribution submitted successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contributions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      if (variables?.campaignId) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.detail(variables.campaignId) });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to submit contribution.');
    },
  });
};

export const useContribute = useCreateContribution;

/**
 * Creator Mutation: Approve pending contribution
 */
export const useApproveContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contributionsService.approveContribution(id),
    onSuccess: () => {
      toast.success('Contribution approved!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contributions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to approve contribution.');
    },
  });
};

/**
 * Creator Mutation: Reject pending contribution
 */
export const useRejectContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => contributionsService.rejectContribution(id, reason),
    onSuccess: () => {
      toast.success('Contribution rejected and credits refunded.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.contributions.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to reject contribution.');
    },
  });
};

export default {
  useMyContributions,
  useCreatorPendingContributions,
  useContributionsToReview,
  useCreateContribution,
  useContribute,
  useApproveContribution,
  useRejectContribution,
};
