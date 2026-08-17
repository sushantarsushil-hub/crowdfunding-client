import axiosInstance from '../api/axiosInstance';

/**
 * Explore live approved campaigns with filters/pagination
 * GET /campaigns
 */
export const getCampaigns = async (params = {}) => {
  const response = await axiosInstance.get('/campaigns', { params });
  return response.data;
};

/**
 * Get campaign details by ID
 * GET /campaigns/:id
 */
export const getCampaignById = async (id) => {
  const response = await axiosInstance.get(`/campaigns/${id}`);
  return response.data;
};

/**
 * Create a new campaign (Creator role)
 * POST /campaigns
 */
export const createCampaign = async (data) => {
  const response = await axiosInstance.post('/campaigns', data);
  return response.data;
};

/**
 * Update campaign details (Creator owner)
 * PATCH /campaigns/:id
 */
export const updateCampaign = async (id, data) => {
  const response = await axiosInstance.patch(`/campaigns/${id}`, data);
  return response.data;
};

/**
 * Delete a campaign (Creator owner / Admin)
 * DELETE /campaigns/:id
 */
export const deleteCampaign = async (id) => {
  const response = await axiosInstance.delete(`/campaigns/${id}`);
  return response.data;
};

/**
 * Get current creator's created campaigns across all statuses
 * GET /campaigns/my
 */
export const getMyCampaigns = async (params = {}) => {
  const response = await axiosInstance.get('/campaigns/my', { params });
  return response.data;
};

/**
 * Admin: Get all campaigns across status and categories
 * GET /admin/campaigns
 */
export const getAdminCampaigns = async (params = {}) => {
  const response = await axiosInstance.get('/admin/campaigns', { params });
  return response.data;
};

/**
 * Admin: Get pending campaign queue
 * GET /admin/campaigns/pending
 */
export const getPendingCampaigns = async (params = {}) => {
  const response = await axiosInstance.get('/admin/campaigns/pending', { params });
  return response.data;
};

/**
 * Admin: Approve pending campaign
 * PATCH /admin/campaigns/:id/approve
 */
export const approveCampaign = async (id) => {
  const response = await axiosInstance.patch(`/admin/campaigns/${id}/approve`);
  return response.data;
};

/**
 * Admin: Reject pending campaign with reason
 * PATCH /admin/campaigns/:id/reject
 */
export const rejectCampaign = async (id, rejectionReason) => {
  const response = await axiosInstance.patch(`/admin/campaigns/${id}/reject`, {
    rejectionReason,
  });
  return response.data;
};

/**
 * Admin: Suspend active campaign
 * PATCH /admin/campaigns/:id/suspend
 */
export const suspendCampaign = async (id) => {
  const response = await axiosInstance.patch(`/admin/campaigns/${id}/suspend`);
  return response.data;
};

/**
 * Admin: Delete campaign and refund supporters
 * DELETE /admin/campaigns/:id
 */
export const deleteCampaignByAdmin = async (id) => {
  const response = await axiosInstance.delete(`/admin/campaigns/${id}`);
  return response.data;
};

const campaignsService = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns,
  getAdminCampaigns,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  suspendCampaign,
  deleteCampaignByAdmin,
};

export default campaignsService;
