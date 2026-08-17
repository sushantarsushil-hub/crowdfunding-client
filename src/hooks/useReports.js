import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import reportsService from '../services/reports';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Admin: Fetch submitted campaign reports list
 */
export const useAdminReports = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.reports.adminList(params),
    queryFn: () => reportsService.getAdminReports(params),
  });
export const useReports = useAdminReports;

/**
 * Supporter Mutation: Submit campaign report
 */
export const useSubmitReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => reportsService.submitReport(data),
    onSuccess: () => {
      toast.success('Report submitted for moderator review. Thank you!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to submit report.');
    },
  });
};

export const useCreateReport = useSubmitReport;
export const useReportCampaign = useSubmitReport;

/**
 * Admin Mutation: Resolve report without campaign penalty
 */
export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => reportsService.resolveReport(id),
    onSuccess: () => {
      toast.success('Report marked as resolved.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to resolve report.');
    },
  });
};

/**
 * Admin Mutation: Suspend reported campaign
 */
export const useSuspendReportedCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId) => reportsService.suspendReportedCampaign(reportId),
    onSuccess: () => {
      toast.success('Campaign suspended successfully.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to suspend campaign.');
    },
  });
};

export const useSuspendCampaign = useSuspendReportedCampaign;

/**
 * Admin Mutation: Delete reported campaign and refund credits
 */
export const useDeleteReportedCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId) => reportsService.deleteReportedCampaign(reportId),
    onSuccess: () => {
      toast.success('Reported campaign deleted and credits refunded!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reports.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.campaigns.all });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete reported campaign.');
    },
  });
};

export default {
  useAdminReports,
  useSubmitReport,
  useCreateReport,
  useReportCampaign,
  useResolveReport,
  useSuspendReportedCampaign,
  useSuspendCampaign,
  useDeleteReportedCampaign,
};
