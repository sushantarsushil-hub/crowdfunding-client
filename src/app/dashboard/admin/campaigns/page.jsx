'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Trash2, AlertOctagon } from 'lucide-react';
import campaignsService from '../../../../services/campaigns';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/modals/Modal';
import TableSkeleton from '../../../../components/common/TableSkeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function AdminManageCampaignsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingCampaignId, setRejectingCampaignId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAllCampaigns', page],
    queryFn: () => campaignsService.getAdminCampaigns({ page, limit: 10 }),
  });

  const campaigns =
    response?.data?.campaigns ||
    response?.campaigns ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total ?? campaigns.length;

  const approveMutation = useMutation({
    mutationFn: (id) => campaignsService.approveCampaign(id),
    onSuccess: () => {
      toast.success('Campaign approved! Now live in the public catalog.');
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (err) => toast.error(err.message || 'Approval failed.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => campaignsService.rejectCampaign(id, reason),
    onSuccess: () => {
      toast.success('Campaign rejected.');
      setRejectModalOpen(false);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (err) => toast.error(err.message || 'Rejection failed.'),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => campaignsService.suspendCampaign(id),
    onSuccess: () => {
      toast.success('Campaign suspended.');
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (err) => toast.error(err.message || 'Suspension failed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => campaignsService.deleteCampaignByAdmin(id),
    onSuccess: () => {
      toast.success('Campaign deleted and backer credits refunded.');
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (err) => toast.error(err.message || 'Delete failed.'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Campaigns & Moderation</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review submitted initiatives, approve public catalog entries, or reject inappropriate requests.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : isError ? (
        <ErrorState
          title="Unable to Load Campaigns"
          message="Could not fetch campaign moderation list from the server."
          onRetry={refetch}
        />
      ) : campaigns.length === 0 ? (
        <EmptyState title="No campaigns found" description="There are no campaigns registered in the platform database." />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Creator</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Goal</th>
                  <th className="p-4">Raised</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {campaigns.map((c, idx) => {
                  const campaignId = c._id || c.id || idx;
                  const raised = c.amountRaised ?? c.raisedAmount ?? 0;
                  const goal = c.fundingGoal ?? c.goalAmount ?? 1;
                  const status = (c.status || 'pending').toLowerCase();
                  const creatorName = c.creatorName || c.creatorId?.name || 'Verified Creator';

                  return (
                    <tr key={campaignId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <Link href={`/campaigns/${campaignId}`} className="hover:text-emerald-600">
                          {c.title}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-600">{creatorName}</td>
                      <td className="p-4 text-slate-500">{c.category}</td>
                      <td className="p-4 text-slate-600">{goal} Cr</td>
                      <td className="p-4 font-extrabold text-emerald-700">{raised} Cr</td>
                      <td className="p-4 text-slate-500">{c.deadline ? new Date(c.deadline).toLocaleDateString() : 'Active'}</td>
                      <td className="p-4">
                        <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                          {status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {status !== 'approved' && (
                          <Button
                            variant="success"
                            size="sm"
                            isLoading={approveMutation.isPending && approveMutation.variables === campaignId}
                            onClick={() => approveMutation.mutate(campaignId)}
                            icon={<CheckCircle className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                        )}
                        {status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            isLoading={suspendMutation.isPending && suspendMutation.variables === campaignId}
                            onClick={() => suspendMutation.mutate(campaignId)}
                            icon={<AlertOctagon className="w-3.5 h-3.5 text-amber-600" />}
                            className="text-amber-700 hover:bg-amber-50 border-amber-200"
                          >
                            Suspend
                          </Button>
                        )}
                        {status !== 'rejected' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => { setRejectingCampaignId(campaignId); setRejectModalOpen(true); }}
                            icon={<XCircle className="w-3.5 h-3.5" />}
                          >
                            Reject
                          </Button>
                        )}
                        <button
                          onClick={() => { setDeletingCampaignId(campaignId); setDeleteModalOpen(true); }}
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
            {campaigns.map((c, idx) => {
              const campaignId = c._id || c.id || idx;
              const raised = c.amountRaised ?? c.raisedAmount ?? 0;
              const goal = c.fundingGoal ?? c.goalAmount ?? 1;
              const status = (c.status || 'pending').toLowerCase();
              const creatorName = c.creatorName || c.creatorId?.name || 'Verified Creator';

              return (
                <div key={campaignId} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <Link href={`/campaigns/${campaignId}`} className="font-extrabold text-slate-900 text-sm hover:text-emerald-600 line-clamp-1">
                      {c.title}
                    </Link>
                    <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : status === 'suspended' ? 'warning' : 'info'}>
                      {status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-semibold">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Raised</span>
                      <span className="text-emerald-700 font-extrabold">{raised} Cr</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Goal</span>
                      <span className="text-slate-800 font-extrabold">{goal} Cr</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Creator: <strong>{creatorName}</strong></span>
                    <span>{c.category}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    {status !== 'approved' && (
                      <Button
                        variant="success"
                        size="sm"
                        isLoading={approveMutation.isPending && approveMutation.variables === campaignId}
                        onClick={() => approveMutation.mutate(campaignId)}
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                        className="min-h-[44px]"
                      >
                        Approve
                      </Button>
                    )}
                    {status === 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={suspendMutation.isPending && suspendMutation.variables === campaignId}
                        onClick={() => suspendMutation.mutate(campaignId)}
                        icon={<AlertOctagon className="w-3.5 h-3.5 text-amber-600" />}
                        className="min-h-[44px] text-amber-700 hover:bg-amber-50 border-amber-200"
                      >
                        Suspend
                      </Button>
                    )}
                    {status !== 'rejected' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => { setRejectingCampaignId(campaignId); setRejectModalOpen(true); }}
                        icon={<XCircle className="w-3.5 h-3.5" />}
                        className="min-h-[44px]"
                      >
                        Reject
                      </Button>
                    )}
                    <button
                      onClick={() => { setDeletingCampaignId(campaignId); setDeleteModalOpen(true); }}
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

      {/* Reject Campaign Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Campaign Submission">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Rejection Reason</label>
            <textarea
              rows={3}
              placeholder="Enter reason for rejecting this campaign..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate({ id: rejectingCampaignId, reason: rejectReason })}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Campaign Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Campaign Confirmation">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Are you sure you want to permanently delete this campaign?
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deletingCampaignId)}
            >
              Delete Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
