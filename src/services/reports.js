import axiosInstance from '../api/axiosInstance';

/**
 * Submit report for an approved campaign (Supporter role)
 * POST /reports
 * payload: { campaignId, reason }
 */
export const submitReport = async (data) => {
  const payload = {
    campaignId: data.campaignId,
    reason: data.reason,
  };
  const response = await axiosInstance.post('/reports', payload);
  return response.data;
};

export const createReport = submitReport;

/**
 * Admin: Get all submitted campaign reports
 * GET /admin/reports
 */
export const getAdminReports = async (params = {}) => {
  const response = await axiosInstance.get('/admin/reports', { params });
  return response.data;
};

/**
 * Admin: Resolve a pending report without taking action against campaign
 * PATCH /admin/reports/:id/resolve
 */
export const resolveReport = async (id) => {
  const response = await axiosInstance.patch(`/admin/reports/${id}/resolve`);
  return response.data;
};

/**
 * Admin: Suspend reported campaign
 * PATCH /admin/reports/:id/suspend
 */
export const suspendReportedCampaign = async (reportId) => {
  const response = await axiosInstance.patch(`/admin/reports/${reportId}/suspend`);
  return response.data;
};

export const suspendCampaign = suspendReportedCampaign;

/**
 * Admin: Permanently delete reported campaign and refund supporters
 * DELETE /admin/reports/:id/campaign
 */
export const deleteReportedCampaign = async (reportId) => {
  const response = await axiosInstance.delete(`/admin/reports/${reportId}/campaign`);
  return response.data;
};

const reportsService = {
  submitReport,
  createReport,
  getAdminReports,
  resolveReport,
  suspendReportedCampaign,
  suspendCampaign,
  deleteReportedCampaign,
};

export default reportsService;
