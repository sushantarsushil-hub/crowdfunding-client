import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import campaignsService from '../services/campaigns';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Fetch top funded active campaigns for Homepage display
 * GET /api/v1/campaigns?sort=-amountRaised&limit=6
 */
export const useTopFundedCampaigns = (limit = 6) => {
  return useQuery({
    queryKey: ['campaigns', 'topFunded', limit],
    queryFn: () => campaignsService.getCampaigns({ sort: '-amountRaised', limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh data to prevent unnecessary refetching
  });
};

/**
 * Fetch public live campaigns with pagination/search/filtering
 */
export const useCampaigns = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.list(filters),
    queryFn: () => campaignsService.getCampaigns(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh data
  });
};

/**
 * Fetch campaign details by ObjectId
 */
export const useCampaignDetails = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.detail(id),
    queryFn: () => campaignsService.getCampaignById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Named alias for single campaign details
 */
export const useCampaign = useCampaignDetails;

/**
 * Fetch current creator's created campaigns
 */
export const useMyCampaigns = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.my(params),
    queryFn: () => campaignsService.getMyCampaigns(params),
    staleTime: 1000 * 60 * 3,
  });
};

/**
 * Admin: Fetch all campaigns queue
 */
export const useAdminCampaigns = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.adminAll(params),
    queryFn: () => campaignsService.getAdminCampaigns(params),
  });
};

/**
 * Admin: Fetch pending campaigns queue
 */
export const usePendingCampaigns = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.campaigns.pending(params),
    queryFn: () => campaignsService.getPendingCampaigns(params),
  });
};

/**
 * Mutation: Create a new campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => campaignsService.createCampaign(data),
    onSuccess: () => {
      toast.success('Campaign submitted successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create campaign.');
    },
  });
};

/**
 * Mutation: Update existing campaign
 */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => campaignsService.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      toast.success('Campaign updated successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.detail(variables.id) });
      }
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update campaign.');
    },
  });
};

/**
 * Mutation: Delete campaign
 */
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignsService.deleteCampaign(id),
    onSuccess: () => {
      toast.success('Campaign deleted and pending credits refunded!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete campaign.');
    },
  });
};

/**
 * Admin Mutation: Approve pending campaign
 */
export const useApproveCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignsService.approveCampaign(id),
    onSuccess: () => {
      toast.success('Campaign approved successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to approve campaign.');
    },
  });
};

/**
 * Admin Mutation: Reject pending campaign
 */
export const useRejectCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => campaignsService.rejectCampaign(id, reason),
    onSuccess: () => {
      toast.success('Campaign rejected.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to reject campaign.');
    },
  });
};

/**
 * Admin Mutation: Suspend active campaign
 */
export const useSuspendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignsService.suspendCampaign(id),
    onSuccess: () => {
      toast.success('Campaign suspended successfully.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to suspend campaign.');
    },
  });
};

/**
 * Admin Mutation: Delete campaign and refund supporters
 */
export const useAdminDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignsService.deleteCampaignByAdmin(id),
    onSuccess: () => {
      toast.success('Campaign deleted by Admin and supporters refunded!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete campaign.');
    },
  });
};

export default {
  useTopFundedCampaigns,
  useCampaigns,
  useCampaign,
  useCampaignDetails,
  useMyCampaigns,
  useAdminCampaigns,
  usePendingCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useApproveCampaign,
  useRejectCampaign,
  useSuspendCampaign,
  useAdminDeleteCampaign,
};
