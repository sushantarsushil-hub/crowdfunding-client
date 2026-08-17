import axiosInstance from '../api/axiosInstance';

/**
 * Submit contribution credit to campaign (Supporter role)
 * POST /contributions
 * payload: { campaignId, contributionAmount, message }
 */
export const createContribution = async (data) => {
  // Support both key naming conventions: contributionAmount or credits
  const payload = {
    campaignId: data.campaignId,
    contributionAmount: Number(data.contributionAmount ?? data.credits),
    message: data.message || '',
  };
  const response = await axiosInstance.post('/contributions', payload);
  return response.data;
};

export const contribute = createContribution;

/**
 * Get logged-in Supporter's contributions history
 * GET /contributions/my
 */
export const getMyContributions = async (params = {}) => {
  const response = await axiosInstance.get('/contributions/my', { params });
  return response.data;
};

/**
 * Creator: Get pending contributions received across campaigns
 * GET /creator/contributions/pending
 */
export const getCreatorPendingContributions = async (params = {}) => {
  const response = await axiosInstance.get('/creator/contributions/pending', { params });
  return response.data;
};

export const getContributionsToReview = getCreatorPendingContributions;

/**
 * Creator: Approve a pending contribution
 * PATCH /creator/contributions/:id/approve
 */
export const approveContribution = async (id) => {
  const response = await axiosInstance.patch(`/creator/contributions/${id}/approve`);
  return response.data;
};

/**
 * Creator: Reject a pending contribution with reason
 * PATCH /creator/contributions/:id/reject
 */
export const rejectContribution = async (id, rejectionReason) => {
  const reason = typeof rejectionReason === 'object' ? rejectionReason.reason : rejectionReason;
  const response = await axiosInstance.patch(`/creator/contributions/${id}/reject`, {
    rejectionReason: reason || 'Contribution rejected by creator',
  });
  return response.data;
};

const contributionsService = {
  createContribution,
  contribute,
  getMyContributions,
  getCreatorPendingContributions,
  getContributionsToReview,
  approveContribution,
  rejectContribution,
};

export default contributionsService;
