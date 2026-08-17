'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import paymentsService from '../../../../services/payments';
import Badge from '../../../../components/ui/Badge';
import Skeleton from '../../../../components/ui/Skeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function SupporterPaymentHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['paymentHistory', page],
    queryFn: () => paymentsService.getMyPayments({ page, limit }),
  });

  const payments =
    response?.data?.payments ||
    response?.payments ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || {};
  const totalPages = meta.totalPages || (payments.length > 0 ? Math.ceil(payments.length / limit) : 1);
  const totalItems = meta.total ?? payments.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment History</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Record of all your Stripe credit purchase transactions and checkout receipts.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load payment history"
          message="Could not connect to payment transaction records."
          onRetry={refetch}
        />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payment records found"
          description="You have not purchased any credit packages yet."
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Package / Credits</th>
                  <th className="p-4">Amount ($ USD)</th>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {payments.map((p, idx) => (
                  <tr key={p._id || p.id || idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {p.packageName || `${p.credits || 0} Credits`}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-700">
                      ${p.amountUSD || p.amount || 0} USD
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {p.transactionId || p.paymentIntentId || 'tx_stripe_mock'}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={(p.status || 'completed').toLowerCase() === 'completed' ? 'success' : 'warning'}>
                        {p.status || 'completed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
