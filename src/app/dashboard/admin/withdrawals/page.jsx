'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import withdrawalsService from '../../../../services/withdrawals';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/modals/Modal';
import TableSkeleton from '../../../../components/common/TableSkeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';
import { WITHDRAWAL_RULES } from '../../../../constants/credit-rules';

export default function AdminWithdrawalRequestsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingWithdrawalId, setRejectingWithdrawalId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminWithdrawals', page],
    queryFn: () => withdrawalsService.getAdminWithdrawals({ page, limit: 10 }),
  });

  const withdrawals =
    response?.data?.withdrawals ||
    response?.withdrawals ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.total ?? withdrawals.length;

  const approveMutation = useMutation({
    mutationFn: (id) => withdrawalsService.approveWithdrawal(id),
    onSuccess: () => {
      toast.success('Withdrawal payout approved and processed!');
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
    },
    onError: (err) => toast.error(err.message || 'Payout approval failed.'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => withdrawalsService.rejectWithdrawal(id, reason),
    onSuccess: () => {
      toast.success('Withdrawal request rejected.');
      setRejectModalOpen(false);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
    },
    onError: (err) => toast.error(err.message || 'Payout rejection failed.'),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Withdrawal Payout Requests</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review creator cashout requests and approve USD payout wire transfers.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : isError ? (
        <ErrorState
          title="Unable to Load Withdrawal Requests"
          message="Could not connect to the payout ledger database."
          onRetry={refetch}
        />
      ) : withdrawals.length === 0 ? (
        <EmptyState title="No pending withdrawal requests" description="There are no creator cashout requests awaiting admin approval." />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Creator</th>
                  <th className="p-4">Withdrawal Credits</th>
                  <th className="p-4">Payout ($ USD)</th>
                  <th className="p-4">Payment System</th>
                  <th className="p-4">Account Number</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {withdrawals.map((w, idx) => {
                  const wid = w._id || w.id || idx;
                  const creatorName = w.creatorName || w.creatorId?.name || w.creatorEmail || 'Creator';
                  const cr = w.withdrawalCredits || w.credits || 0;
                  const usd = w.amountUSD || (cr / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);
                  const status = (w.status || 'pending').toLowerCase();

                  return (
                    <tr key={wid} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{creatorName}</td>
                      <td className="p-4 font-extrabold text-amber-700">{cr} Cr</td>
                      <td className="p-4 font-extrabold text-emerald-700">${usd} USD</td>
                      <td className="p-4 text-slate-600">{w.paymentSystem}</td>
                      <td className="p-4 text-slate-500 font-mono text-[11px] max-w-xs truncate">{w.accountNumber}</td>
                      <td className="p-4 text-slate-500">{new Date(w.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                          {status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              isLoading={approveMutation.isPending && approveMutation.variables === wid}
                              onClick={() => approveMutation.mutate(wid)}
                              icon={<CheckCircle className="w-3.5 h-3.5" />}
                            >
                              Approve Payout
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => { setRejectingWithdrawalId(wid); setRejectModalOpen(true); }}
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

          {/* Mobile Card Grid View */}
          <div className="md:hidden space-y-3">
            {withdrawals.map((w, idx) => {
              const wid = w._id || w.id || idx;
              const creatorName = w.creatorName || w.creatorId?.name || w.creatorEmail || 'Creator';
              const cr = w.withdrawalCredits || w.credits || 0;
              const usd = w.amountUSD || (cr / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);
              const status = (w.status || 'pending').toLowerCase();

              return (
                <div key={wid} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{creatorName}</span>
                    <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                      {status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 font-semibold">
                    <div className="p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                      <span className="text-slate-400 block text-[10px]">Credits</span>
                      <span className="text-amber-700 font-extrabold">{cr} Cr</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-slate-400 block text-[10px]">USD Value</span>
                      <span className="text-emerald-700 font-extrabold">${usd} USD</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div>System: <strong className="text-slate-800">{w.paymentSystem}</strong></div>
                    <div className="font-mono text-[11px] truncate">Account: {w.accountNumber}</div>
                  </div>

                  {status === 'pending' && (
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="success"
                        size="sm"
                        isLoading={approveMutation.isPending && approveMutation.variables === wid}
                        onClick={() => approveMutation.mutate(wid)}
                        icon={<CheckCircle className="w-3.5 h-3.5" />}
                        className="min-h-[44px]"
                      >
                        Approve Payout
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => { setRejectingWithdrawalId(wid); setRejectModalOpen(true); }}
                        icon={<XCircle className="w-3.5 h-3.5" />}
                        className="min-h-[44px]"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
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

      {/* Reject Withdrawal Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Payout Request">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Rejection Reason</label>
            <textarea
              rows={3}
              placeholder="Enter reason for rejecting payout request..."
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
              onClick={() => rejectMutation.mutate({ id: rejectingWithdrawalId, reason: rejectReason })}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
