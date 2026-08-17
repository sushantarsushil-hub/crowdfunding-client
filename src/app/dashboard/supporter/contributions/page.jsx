'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Heart, Coins, Filter } from 'lucide-react';
import contributionsService from '../../../../services/contributions';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Skeleton from '../../../../components/ui/Skeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function MyContributionsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 10;

  const queryParams = {
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data: response, isLoading, isError, refetch } = useQuery({
    queryKey: ['myContributions', queryParams],
    queryFn: () => contributionsService.getMyContributions(queryParams),
    staleTime: 1000 * 60 * 2,
  });

  const contributions =
    response?.data?.contributions ||
    response?.contributions ||
    (Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);

  const meta = response?.meta || response?.data?.meta || response?.pagination || {};
  const totalPages = meta.totalPages || (contributions.length > 0 ? Math.ceil(contributions.length / limit) : 1);
  const totalItems = meta.total ?? contributions.length;

  const getStatusBadge = (status = 'pending') => {
    const s = status.toLowerCase();
    if (s === 'approved') return <Badge variant="success">approved</Badge>;
    if (s === 'rejected') return <Badge variant="error">rejected</Badge>;
    return <Badge variant="warning">pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Contributions</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Detailed server-paginated log of your credit pledges and campaign backing activity.
          </p>
        </div>
        <Link href="/campaigns">
          <Button variant="primary" size="sm" icon={<Heart className="w-4 h-4 fill-white" />}>
            Back More Causes
          </Button>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        {[
          { key: 'all', label: 'All Pledges' },
          { key: 'pending', label: 'Pending Review' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected / Refunded' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setStatusFilter(tab.key); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load contributions"
          message="Failed to connect to contributions database."
          onRetry={refetch}
        />
      ) : contributions.length === 0 ? (
        <EmptyState
          title="No contributions found"
          description={statusFilter !== 'all' ? `No ${statusFilter} contributions match your selected filter.` : "You haven't backed any campaigns yet. Explore active causes and make your first pledge!"}
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Amount (Credits)</th>
                  <th className="p-4">Creator</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {contributions.map((c, idx) => {
                  const campaignTitle = c.campaignTitle || c.campaignId?.title || 'Relief Cause';
                  const creatorName = c.creatorName || c.campaignId?.creatorName || 'Verified Organizer';
                  const amount = c.contributionAmount ?? c.credits ?? c.amount ?? 0;
                  const dateStr = new Date(c.createdAt || Date.now()).toLocaleDateString();
                  const targetId = c.campaignId?._id || c.campaignId || c.campaign_id;

                  return (
                    <tr key={c._id || c.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {targetId ? (
                          <Link href={`/campaigns/${targetId}`} className="hover:text-emerald-600">
                            {campaignTitle}
                          </Link>
                        ) : (
                          campaignTitle
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-emerald-700">{amount} Cr</td>
                      <td className="p-4 text-slate-600">{creatorName}</td>
                      <td className="p-4 text-slate-500">{dateStr}</td>
                      <td className="p-4 text-right">{getStatusBadge(c.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List Fallback */}
          <div className="md:hidden space-y-3">
            {contributions.map((c, idx) => {
              const amount = c.contributionAmount ?? c.credits ?? c.amount ?? 0;
              return (
                <div key={c._id || c.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 line-clamp-1">{c.campaignTitle || c.campaignId?.title || 'Relief Cause'}</span>
                    {getStatusBadge(c.status)}
                  </div>
                  <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-100">
                    <span>Pledge: <strong className="text-emerald-700">{amount} Cr</strong></span>
                    <span>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reusable Server-Side Pagination Controls */}
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
