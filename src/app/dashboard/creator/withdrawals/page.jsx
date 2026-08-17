'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Banknote, Coins, ShieldCheck, Zap, CreditCard, AlertCircle } from 'lucide-react';
import useAuth from '../../../../hooks/use-auth';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import TableSkeleton from '../../../../components/common/TableSkeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';
import withdrawalsService from '../../../../services/withdrawals';
import { WITHDRAWAL_RULES } from '../../../../constants/credit-rules';

export default function CreatorWithdrawalsPage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const raisedCredits = user?.raisedCredits ?? 0;
  const availableUSD = (raisedCredits / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);
  const isInsufficientCredit = raisedCredits < WITHDRAWAL_RULES.MIN_WITHDRAWAL_CREDITS;

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      withdrawal_credit: 200,
      payment_system: 'Bank Transfer',
      account_number: '',
    },
  });

  const watchedCredits = watch('withdrawal_credit', 200);
  const numCredits = Number(watchedCredits) || 0;
  const calculatedUSD = (numCredits / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);

  // Fetch Creator Withdrawal History with server pagination
  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['myWithdrawals', page],
    queryFn: () => withdrawalsService.getMyWithdrawals({ page, limit: 10 }),
  });

  const withdrawals =
    response?.data?.withdrawals ||
    response?.withdrawals ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || response?.pagination || {};
  const totalPages = meta.totalPages || (withdrawals.length > 0 ? Math.ceil(withdrawals.length / 10) : 1);
  const totalItems = meta.total ?? withdrawals.length;

  const requestMutation = useMutation({
    mutationFn: (formData) =>
      withdrawalsService.createWithdrawal({
        withdrawal_credit: Number(formData.withdrawal_credit),
        payment_system: formData.payment_system,
        account_number: formData.account_number,
      }),
    onSuccess: async () => {
      toast.success('Withdrawal request submitted successfully for admin review!');
      reset({
        withdrawal_credit: 200,
        payment_system: 'Bank Transfer',
        account_number: '',
      });
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['myWithdrawals'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Withdrawal request failed. Minimum 200 raised credits required.');
    },
  });

  const onSubmit = (formData) => {
    if (isInsufficientCredit) {
      toast.error(`Insufficient credit balance. Minimum requirement is ${WITHDRAWAL_RULES.MIN_WITHDRAWAL_CREDITS} raised credits.`);
      return;
    }
    requestMutation.mutate(formData);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Withdrawals & Payouts</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Request cashout of campaign raised credits into direct USD wire payouts.
        </p>
      </div>

      {/* Raised Credits & Estimated USD Payout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs">
            <Coins className="w-4 h-4" />
            <span>Current Raised Credits</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{raisedCredits.toLocaleString()} Cr</div>
          <span className="text-[11px] text-slate-400 font-medium block">Available for cashout</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
            <Banknote className="w-4 h-4" />
            <span>Estimated Withdrawal Value</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">${availableUSD} USD</div>
          <span className="text-[11px] text-slate-400 font-medium block">Based on 20 credits = $1 USD</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-2">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Minimum Requirement</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">200 Cr</div>
          <span className="text-[11px] text-slate-400 font-medium block">Minimum cashout threshold ($10 USD)</span>
        </div>
      </div>

      {/* Insufficient Credit Alert Banner */}
      {isInsufficientCredit && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-800 font-semibold shadow-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Insufficient credit: You need at least 200 raised credits to request a withdrawal.</span>
          </div>
          <Badge variant="error" size="sm">Insufficient credit</Badge>
        </div>
      )}

      {/* Withdrawal Form Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-lg">Submit Cashout Request</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            20 credits = $1.00 USD. The backend remains authoritative for actual payout amounts.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* withdrawal_credit */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Withdrawal Credits *</label>
              <input
                type="number"
                min={WITHDRAWAL_RULES.MIN_WITHDRAWAL_CREDITS}
                step="20"
                placeholder="Min 200 credits"
                disabled={isInsufficientCredit || requestMutation.isPending}
                className="w-full min-h-[44px] rounded-2xl border border-slate-200 p-3 text-base sm:text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                {...register('withdrawal_credit', {
                  required: 'Withdrawal credits are required',
                  min: { value: 200, message: 'Minimum withdrawal is 200 credits ($10 USD)' },
                  validate: (val) => Number(val) <= raisedCredits || `Cannot exceed available raised credits (${raisedCredits} Cr available)`,
                })}
              />
              {errors.withdrawal_credit && (
                <p className="text-xs text-rose-500 font-medium">{errors.withdrawal_credit.message}</p>
              )}
            </div>

            {/* withdrawal_amount (calculated display based on withdrawal_credit / 20) */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Calculated Value (withdrawal_amount)</label>
              <div className="w-full min-h-[44px] flex items-center rounded-2xl bg-slate-100 p-3 text-xs font-black text-emerald-700 border border-slate-200">
                ${calculatedUSD} USD
              </div>
              <span className="text-[10px] text-slate-400 font-medium block">Formula: withdrawal_credit / 20</span>
            </div>
          </div>

          {/* payment_system */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Payment Gateway System *</label>
            <select
              disabled={isInsufficientCredit || requestMutation.isPending}
              className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              {...register('payment_system', { required: 'Payment system is required' })}
            >
              <option value="Bank Transfer">Direct Wire Bank Transfer</option>
              <option value="bKash">bKash Mobile Financial Service</option>
              <option value="Nagad">Nagad MFS</option>
              <option value="Stripe">Stripe Connect Payout</option>
              <option value="PayPal">PayPal Express</option>
            </select>
          </div>

          {/* account_number */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Payout Account Number / IBAN / Phone *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. IBAN US12 3456 7890 or bKash 01700000000"
                disabled={isInsufficientCredit || requestMutation.isPending}
                className="w-full min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                {...register('account_number', { required: 'Payout account number is required' })}
              />
            </div>
            {errors.account_number && (
              <p className="text-xs text-rose-500 font-medium">{errors.account_number.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant={isInsufficientCredit ? 'neutral' : 'primary'}
              size="md"
              className="w-full min-h-[44px]"
              isLoading={requestMutation.isPending}
              isDisabled={isInsufficientCredit || requestMutation.isPending}
              icon={<Zap className="w-4 h-4" />}
            >
              {isInsufficientCredit ? 'Insufficient credit' : 'Submit Withdrawal Request'}
            </Button>
          </div>
        </form>
      </div>

      {/* Withdrawal History Ledger */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Withdrawal History Ledger</h3>

        {isLoading ? (
          <TableSkeleton rows={4} cols={6} />
        ) : isError ? (
          <ErrorState title="Failed to load withdrawals" message="Could not connect to payout ledger." onRetry={refetch} />
        ) : withdrawals.length === 0 ? (
          <EmptyState title="No withdrawal history" description="You have not requested any payout cashouts yet." />
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Withdrawal Credits</th>
                    <th className="p-4">Calculated Payout ($ USD)</th>
                    <th className="p-4">Payment System</th>
                    <th className="p-4">Account Number</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {withdrawals.map((w, idx) => {
                    const status = (w.status || 'pending').toLowerCase();
                    const cr = w.withdrawalCredits || w.withdrawal_credit || w.credits || 0;
                    const usd = w.withdrawalAmount || w.amountUSD || (cr / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);

                    return (
                      <tr key={w._id || w.id || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{cr} Cr</td>
                        <td className="p-4 font-extrabold text-emerald-700">${usd} USD</td>
                        <td className="p-4 text-slate-600">{w.paymentSystem || w.payment_system}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px] max-w-xs truncate">{w.accountNumber || w.account_number}</td>
                        <td className="p-4 text-slate-500">{new Date(w.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                            {status}
                          </Badge>
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
                const status = (w.status || 'pending').toLowerCase();
                const cr = w.withdrawalCredits || w.withdrawal_credit || w.credits || 0;
                const usd = w.withdrawalAmount || w.amountUSD || (cr / WITHDRAWAL_RULES.CREDITS_PER_USD).toFixed(2);

                return (
                  <div key={w._id || w.id || idx} className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-emerald-700 text-sm">${usd} USD</span>
                      <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                        {status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-400">Withdrawal Credits</span>
                      <span className="font-extrabold text-slate-800">{cr} Cr</span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div>Method: <strong className="text-slate-800">{w.paymentSystem || w.payment_system}</strong></div>
                      <div className="font-mono text-[11px] truncate">Account: {w.accountNumber || w.account_number}</div>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      Requested on {new Date(w.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reusable Server Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              limit={10}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
