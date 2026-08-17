'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Eye, CheckCircle, XCircle, User, Heart, MessageSquare, Calendar } from 'lucide-react';
import contributionsService from '../../services/contributions';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../modals/Modal';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../common/EmptyState';

export const ContributionReviewTable = ({ contributions = [], isLoading = false, onRefresh }) => {
  const queryClient = useQueryClient();

  // Selected contribution state for View Modal
  const [viewContrib, setViewContrib] = useState(null);

  // Approve Confirmation Modal state
  const [approveContribId, setApproveContribId] = useState(null);

  // Reject Modal state
  const [rejectContribId, setRejectContribId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Approve Mutation with double-click prevention
  const approveMutation = useMutation({
    mutationFn: (id) => contributionsService.approveContribution(id),
    onSuccess: () => {
      toast.success('Pledge approved! Credits released to creator campaign.');
      setApproveContribId(null);
      queryClient.invalidateQueries({ queryKey: ['contributionsToReview'] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['myContributions'] });
      if (onRefresh) onRefresh();
    },
    onError: (err) => toast.error(err.message || 'Approval failed.'),
  });

  // Reject Mutation with double-click prevention
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => contributionsService.rejectContribution(id, reason),
    onSuccess: () => {
      toast.success('Pledge rejected.');
      setRejectContribId(null);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['contributionsToReview'] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['myContributions'] });
      if (onRefresh) onRefresh();
    },
    onError: (err) => toast.error(err.message || 'Rejection failed.'),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    );
  }

  if (!contributions || contributions.length === 0) {
    return (
      <EmptyState
        title="No pending contributions"
        description="There are currently no supporter pledges waiting for creator review."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Supporter</th>
              <th className="p-4">Campaign</th>
              <th className="p-4">Amount (Credits)</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {contributions.map((item, idx) => {
              const itemID = item._id || item.id || idx;
              const supporterName = item.supporterName || item.supporterId?.name || item.backerName || 'Anonymous Backer';
              const campaignTitle = item.campaignTitle || item.campaignId?.title || 'Relief Initiative';
              const amount = item.credits || item.amount || 0;
              const dateStr = new Date(item.createdAt || Date.now()).toLocaleDateString();
              const status = (item.status || 'pending').toLowerCase();

              return (
                <tr key={itemID} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{supporterName}</span>
                  </td>
                  <td className="p-4 text-slate-800 font-medium max-w-xs truncate">{campaignTitle}</td>
                  <td className="p-4 font-extrabold text-emerald-700">{amount} Cr</td>
                  <td className="p-4 text-slate-500">{dateStr}</td>
                  <td className="p-4">
                    <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                      {status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-1.5">
                    {/* View Modal Trigger */}
                    <button
                      onClick={() => setViewContrib(item)}
                      className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                      title="View Contribution Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {status === 'pending' && (
                      <>
                        {/* Approve Trigger */}
                        <Button
                          variant="success"
                          size="sm"
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          onClick={() => setApproveContribId(itemID)}
                          icon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Approve
                        </Button>

                        {/* Reject Trigger */}
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                          onClick={() => setRejectContribId(itemID)}
                          icon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VIEW CONTRIBUTION DETAILS MODAL */}
      <Modal isOpen={!!viewContrib} onClose={() => setViewContrib(null)} title="Contribution Details">
        {viewContrib && (
          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Supporter Name</span>
                <span className="font-bold text-slate-900">{viewContrib.supporterName || viewContrib.supporterId?.name || 'Backer'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Campaign Target</span>
                <span className="font-bold text-slate-900">{viewContrib.campaignTitle || viewContrib.campaignId?.title || 'Cause'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pledge Amount</span>
                <span className="font-extrabold text-emerald-700">{viewContrib.credits || viewContrib.amount || 0} Cr</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Pledge Date</span>
                <span className="text-slate-600">{new Date(viewContrib.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-500 font-bold">Support Message</label>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 italic">
                {viewContrib.message || 'No note attached by supporter.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setViewContrib(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* APPROVE CONFIRMATION MODAL */}
      <Modal isOpen={!!approveContribId} onClose={() => setApproveContribId(null)} title="Approve Supporter Pledge">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Are you sure you want to approve this pledge? Credits will be credited to your campaign's raised total.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setApproveContribId(null)}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              isLoading={approveMutation.isPending}
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate(approveContribId)}
            >
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* REJECT CONFIRMATION MODAL */}
      <Modal isOpen={!!rejectContribId} onClose={() => setRejectContribId(null)} title="Reject Supporter Pledge">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Rejection Reason</label>
            <textarea
              rows={3}
              placeholder="Enter reason for rejecting this pledge..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setRejectContribId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={rejectMutation.isPending}
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate({ id: rejectContribId, reason: rejectReason })}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ContributionReviewTable;
