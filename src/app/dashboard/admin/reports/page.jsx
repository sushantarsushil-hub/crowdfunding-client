'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ShieldAlert, CheckCircle, Trash2 } from 'lucide-react';
import reportsService from '../../../../services/reports';
import campaignsService from '../../../../services/campaigns';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/modals/Modal';
import TableSkeleton from '../../../../components/common/TableSkeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function AdminReportsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState(null); // 'suspend' | 'resolve' | 'delete'

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminReports', page],
    queryFn: () => reportsService.getAdminReports({ page, limit: 10 }),
  });

  const reports =
    response?.data?.reports ||
    response?.reports ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total ?? reports.length;

  const resolveMutation = useMutation({
    mutationFn: (id) => reportsService.resolveReport(id),
    onSuccess: () => {
      toast.success('Report marked as resolved.');
      setSelectedReport(null);
      setActionType(null);
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
    onError: (err) => toast.error(err.message || 'Resolve failed.'),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => reportsService.suspendCampaign(id),
    onSuccess: () => {
      toast.success('Campaign suspended.');
      setSelectedReport(null);
      setActionType(null);
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
    onError: (err) => toast.error(err.message || 'Suspend failed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (campaignId) => campaignsService.deleteCampaign(campaignId),
    onSuccess: () => {
      toast.success('Campaign permanently deleted.');
      setSelectedReport(null);
      setActionType(null);
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
    onError: (err) => toast.error(err.message || 'Delete failed.'),
  });

  const handleExecuteAction = () => {
    if (!selectedReport) return;
    const reportId = selectedReport._id || selectedReport.id;
    const campaignId = selectedReport.campaignId?._id || selectedReport.campaignId;

    if (actionType === 'resolve') {
      resolveMutation.mutate(reportId);
    } else if (actionType === 'suspend') {
      suspendMutation.mutate(reportId);
    } else if (actionType === 'delete' && campaignId) {
      deleteMutation.mutate(campaignId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Community Flagged Reports</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review community reports, suspend violating campaigns, or resolve clean flags.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <ErrorState
          title="Unable to Load Moderation Reports"
          message="Could not retrieve community flagged reports from backend database."
          onRetry={refetch}
        />
      ) : reports.length === 0 ? (
        <EmptyState title="No flagged reports" description="There are no community reports awaiting moderation." />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Target Campaign</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {reports.map((r, idx) => {
                  const rid = r._id || r.id || idx;
                  const reporterName = r.reporterName || r.userId?.name || 'Community Member';
                  const campaignTitle = r.campaignTitle || r.campaignId?.title || 'Reported Cause';
                  const status = (r.status || 'pending').toLowerCase();

                  return (
                    <tr key={rid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{reporterName}</td>
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{campaignTitle}</td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{r.reason || 'Flagged for moderation'}</td>
                      <td className="p-4 text-slate-500">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge variant={status === 'resolved' ? 'success' : status === 'suspended' ? 'error' : 'warning'}>
                          {status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => { setSelectedReport(r); setActionType('resolve'); }}
                          icon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Resolve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => { setSelectedReport(r); setActionType('suspend'); }}
                          icon={<ShieldAlert className="w-3.5 h-3.5" />}
                        >
                          Suspend
                        </Button>
                        <button
                          onClick={() => { setSelectedReport(r); setActionType('delete'); }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
                          title="Delete Campaign"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="md:hidden space-y-3">
            {reports.map((r, idx) => {
              const rid = r._id || r.id || idx;
              const reporterName = r.reporterName || r.userId?.name || 'Community Member';
              const campaignTitle = r.campaignTitle || r.campaignId?.title || 'Reported Cause';
              const status = (r.status || 'pending').toLowerCase();

              return (
                <div key={rid} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900 text-sm line-clamp-1">{campaignTitle}</span>
                    <Badge variant={status === 'resolved' ? 'success' : status === 'suspended' ? 'error' : 'warning'}>
                      {status}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="text-slate-400 block text-[10px]">Reason</span>
                    <p className="text-slate-700 font-medium">{r.reason || 'Flagged for moderation'}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Reporter: <strong>{reporterName}</strong></span>
                    <span>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => { setSelectedReport(r); setActionType('resolve'); }}
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                      className="min-h-[44px]"
                    >
                      Resolve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => { setSelectedReport(r); setActionType('suspend'); }}
                      icon={<ShieldAlert className="w-3.5 h-3.5" />}
                      className="min-h-[44px]"
                    >
                      Suspend
                    </Button>
                    <button
                      onClick={() => { setSelectedReport(r); setActionType('delete'); }}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Confirmation Action Modal */}
      <Modal
        isOpen={!!selectedReport && !!actionType}
        onClose={() => { setSelectedReport(null); setActionType(null); }}
        title={`Confirm ${actionType?.toUpperCase()} Action`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Are you sure you want to <strong>{actionType}</strong> this campaign report?
          </p>

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedReport(null); setActionType(null); }}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'resolve' ? 'success' : 'danger'}
              size="sm"
              isLoading={resolveMutation.isPending || suspendMutation.isPending || deleteMutation.isPending}
              onClick={handleExecuteAction}
            >
              Confirm {actionType}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
