import {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from './users';
import { getAdminReports, resolveReport, suspendReportedCampaign } from './reports';

export const adminService = {
  getDashboardStats: async () => {
    const res = await getAdminDashboardStats();
    return res?.data || res;
  },
  getUsers: async (params) => {
    const res = await getAdminUsers(params);
    return res?.data || res;
  },
  updateUserRole: async (userId, role) => {
    const res = await updateUserRole(userId, role);
    return res?.data || res;
  },
  updateUserStatus: async (userId, status) => {
    const res = await updateUserRole(userId, status);
    return res?.data || res;
  },
  getReports: async (params) => {
    const res = await getAdminReports(params);
    return res?.data || res;
  },
  handleReport: async (reportId, action) => {
    if (action === 'suspend') {
      const res = await suspendReportedCampaign(reportId);
      return res?.data || res;
    }
    const res = await resolveReport(reportId);
    return res?.data || res;
  },
};

export default adminService;
