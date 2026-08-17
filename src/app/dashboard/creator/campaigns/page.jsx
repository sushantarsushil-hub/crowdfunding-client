'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Eye
} from 'lucide-react';
import campaignsService from '../../../../services/campaigns';
import contributionsService from '../../../../services/contributions';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/modals/Modal';
import Skeleton from '../../../../components/ui/Skeleton';
import EmptyState from '../../../../components/common/EmptyState';
import ErrorState from '../../../../components/common/ErrorState';
import Pagination from '../../../../components/common/Pagination';

export default function MyCampaignsPage() {
  const queryClient = useQueryClient();

  // Active tab state: 'campaigns' or 'contributions'
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaignsPage, setCampaignsPage] = useState(1);
  const [contributionsPage, setContributionsPage] = useState(1);
  const limit = 10;

  // Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingContrib, setViewingContrib] = useState(null);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editRewards, setEditRewards] = useState('');

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCampaignId, setDeletingCampaignId] = useState(null);

  // Reject Contribution Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingContribId, setRejectingContribId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fetch Creator Campaigns with pagination
  const { data: campaignResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ['myCampaigns', campaignsPage],
    queryFn: () => campaignsService.getMyCampaigns({ page: campaignsPage, limit }),
  });

  const campaigns =
    campaignResponse?.data?.campaigns ||
    campaignResponse?.campaigns ||
    (Array.isArray(campaignResponse?.data) ? campaignResponse.data : Array.isArray(campaignResponse) ? campaignResponse : []);

  const campaignMeta = campaignResponse?.meta || campaignResponse?.data?.meta || {};
  const totalCampaignPages = campaignMeta.totalPages || 1;
  const totalCampaignItems = campaignMeta.total ?? campaigns.length;

  // Fetch Contributions To Review with pagination
  const { data: contribResponse, isLoading: isReviewLoading } = useQuery({
    queryKey: ['contributionsToReview', contributionsPage],
    queryFn: () => contributionsService.getCreatorPendingContributions({ page: contributionsPage, limit }),
    enabled: activeTab === 'contributions',
  });

  const pendingContributions =
    contribResponse?.data?.contributions ||
    contribResponse?.contributions ||
    (Array.isArray(contribResponse?.data) ? contribResponse.data : Array.isArray(contribResponse) ? contribResponse : []);

  const contribMeta = contribResponse?.meta || contribResponse?.data?.meta || {};
  const totalContribPages = contribMeta.totalPages || 1;
  const totalContribItems = contribMeta.total ?? pendingContributions.length;

  // Update Mutation (Modifies ONLY title, campaign_story, reward_info)
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => campaignsService.updateCampaign(id, payload),
    onSuccess: () => {
      toast.success('Campaign updated successfully!');
      setEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to update campaign.'),
  });

  // Delete Mutation (Sends ONLY campaign ID to backend; backend handles supporter refunds and financial integrity)
  const deleteMutation = useMutation({
    mutationFn: (id) => campaignsService.deleteCampaign(id),
    onSuccess: () => {
      toast.success('Campaign deleted successfully and backer credits refunded.');
      setDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['contributionsToReview'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to delete campaign.'),
  });

  // Approve Contribution Mutation
  const approveContribMutation = useMutation({
    mutationFn: (id) => contributionsService.approveContribution(id),
    onSuccess: () => {
      toast.success('Contribution approved! Credits released.');
      queryClient.invalidateQueries({ queryKey: ['contributionsToReview'] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      if (detailModalOpen) setDetailModalOpen(false);
    },
    onError: (err) => toast.error(err.message || 'Approval failed.'),
  });

  // Reject Contribution Mutation
  const rejectContribMutation = useMutation({
    mutationFn: ({ id, reason }) => contributionsService.rejectContribution(id, reason),
    onSuccess: () => {
      toast.success('Contribution rejected and backer credits refunded.');
      setRejectModalOpen(false);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['contributionsToReview'] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      if (detailModalOpen) setDetailModalOpen(false);
    },
    onError: (err) => toast.error(err.message || 'Rejection failed.'),
  });

  const handleOpenEdit = (c) => {
    setEditingCampaign(c);
    setEditTitle(c.title || '');
    setEditStory(c.story || c.description || '');
    setEditRewards(c.rewards || '');
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCampaign) return;
    updateMutation.mutate({
      id: editingCampaign._id || editingCampaign.id,
      payload: {
        title: editTitle,
        story: editStory,
        rewards: editRewards,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Campaigns & Pledges</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage active initiatives, update campaign stories, and approve backer pledges.
          </p>
        </div>

        <Link href="/dashboard/creator/campaigns/new">
          <Button variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
            Add New Campaign
          </Button>
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'campaigns'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Campaigns ({totalCampaignItems})
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'contributions'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Contributions To Review</span>
          {totalContribItems > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-extrabold">
              {totalContribItems}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: My Campaigns List */}
      {activeTab === 'campaigns' && (
        <>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>
          ) : isError ? (
            <ErrorState title="Failed to load campaigns" message="Could not fetch campaign list." onRetry={refetch} />
          ) : campaigns.length === 0 ? (
            <EmptyState title="No campaigns created" description="You have not created any campaigns yet. Launch your first cause!" />
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Campaign Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Funding Goal</th>
                      <th className="p-4">Amount Raised</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {[...campaigns]
                      .sort((a, b) => new Date(b.deadline || 0) - new Date(a.deadline || 0))
                      .map((c, idx) => {
                        const raised = c.amountRaised ?? c.raisedAmount ?? 0;
                        const goal = c.fundingGoal ?? c.goalAmount ?? 1;
                        const status = (c.status || 'pending').toLowerCase();
                        const campaignId = c._id || c.id || idx;

                        return (
                          <tr key={campaignId} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-4 font-bold text-slate-900">
                              <Link href={`/campaigns/${campaignId}`} className="hover:text-emerald-600">
                                {c.title}
                              </Link>
                            </td>
                            <td className="p-4 text-slate-600">{c.category || 'General'}</td>
                            <td className="p-4 text-slate-600">{goal} Cr</td>
                            <td className="p-4 font-extrabold text-emerald-700">{raised} Cr</td>
                            <td className="p-4 text-slate-500">{c.deadline ? new Date(c.deadline).toLocaleDateString() : 'Active'}</td>
                            <td className="p-4">
                              <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
                                {status}
                              </Badge>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEdit(c)}
                                className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                                title="Edit Campaign"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setDeletingCampaignId(campaignId); setDeleteModalOpen(true); }}
                                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
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

              {/* Reusable Pagination */}
              <Pagination
                currentPage={campaignsPage}
                totalPages={totalCampaignPages}
                totalItems={totalCampaignItems}
                limit={limit}
                onPageChange={(p) => setCampaignsPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* TAB 2: Contributions To Review */}
      {activeTab === 'contributions' && (
        <>
          {isReviewLoading ? (
            <Skeleton className="h-24 w-full rounded-2xl" />
          ) : pendingContributions.length === 0 ? (
            <EmptyState title="No pending contributions" description="There are no backer pledges awaiting your review right now." />
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Campaign</th>
                      <th className="p-4">Supporter</th>
                      <th className="p-4">Pledge (Credits)</th>
                      <th className="p-4">Message</th>
                      <th className="p-4 text-right">Review Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {pendingContributions.map((contrib, idx) => {
                      const contribId = contrib._id || contrib.id || idx;
                      const amount = contrib.contributionAmount ?? contrib.credits ?? contrib.amount ?? 0;
                      const supporter = contrib.supporterName || contrib.supporterId?.name || 'Backer';
                      const campaign = contrib.campaignTitle || contrib.campaignId?.title || 'Cause';

                      return (
                        <tr key={contribId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4 font-bold text-slate-900">{campaign}</td>
                          <td className="p-4 text-slate-600">{supporter}</td>
                          <td className="p-4 font-extrabold text-emerald-700">{amount} Cr</td>
                          <td className="p-4 text-slate-500 italic max-w-xs truncate">{contrib.message || 'No note attached'}</td>
                          <td className="p-4 text-right space-x-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => { setViewingContrib(contrib); setDetailModalOpen(true); }}
                              icon={<Eye className="w-3.5 h-3.5 text-slate-600" />}
                              title="View Details"
                            >
                              Details
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              isLoading={approveContribMutation.isPending && approveContribMutation.variables === contribId}
                              isDisabled={approveContribMutation.isPending || rejectContribMutation.isPending}
                              onClick={() => approveContribMutation.mutate(contribId)}
                              icon={<CheckCircle className="w-3.5 h-3.5" />}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              isDisabled={approveContribMutation.isPending || rejectContribMutation.isPending}
                              onClick={() => { setRejectingContribId(contribId); setRejectModalOpen(true); }}
                              icon={<XCircle className="w-3.5 h-3.5" />}
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Reusable Pagination */}
              <Pagination
                currentPage={contributionsPage}
                totalPages={totalContribPages}
                totalItems={totalContribItems}
                limit={limit}
                onPageChange={(p) => setContributionsPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* Edit Campaign Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Update Campaign Information">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Campaign Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-bold text-slate-900"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Campaign Story</label>
            <textarea
              rows={4}
              value={editStory}
              onChange={(e) => setEditStory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-900 resize-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Perks & Rewards Information</label>
            <textarea
              rows={2}
              value={editRewards}
              onChange={(e) => setEditRewards(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-900 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" isLoading={updateMutation.isPending}>
              Save Updates
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Campaign Confirmation">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Are you sure you want to delete this campaign? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" isDisabled={deleteMutation.isPending} onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleteMutation.isPending}
              isDisabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deletingCampaignId)}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Contribution Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Backer Contribution">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Rejection Reason</label>
            <textarea
              rows={3}
              placeholder="Provide a brief explanation for rejecting this pledge..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-medium text-slate-900 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={rejectContribMutation.isPending}
              onClick={() => rejectContribMutation.mutate({ id: rejectingContribId, reason: rejectReason })}
            >
              Reject Pledge
            </Button>
          </div>
        </div>
      </Modal>
      {/* Contribution Detail View Modal */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Pledge Contribution Details">
        {viewingContrib && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-bold">
                <span className="text-slate-500">Target Campaign</span>
                <span className="text-slate-900">{viewingContrib.campaignTitle || viewingContrib.campaignId?.title}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-500">Backer Name</span>
                <span className="text-slate-800">{viewingContrib.supporterName || viewingContrib.supporterId?.name || 'Backer'}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-500">Backer Email</span>
                <span className="text-slate-600">{viewingContrib.supporterEmail || viewingContrib.supporterId?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-500">Pledge Amount</span>
                <span className="text-emerald-700 font-extrabold">{viewingContrib.contributionAmount ?? viewingContrib.credits ?? 0} Cr</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-500">Date Submitted</span>
                <span className="text-slate-600">{new Date(viewingContrib.createdAt || Date.now()).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Support Message</label>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 font-medium italic">
                "{viewingContrib.message || 'No support note included with this pledge.'}"
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setDetailModalOpen(false)}>Close</Button>
              <Button
                variant="success"
                size="sm"
                isLoading={approveContribMutation.isPending}
                isDisabled={approveContribMutation.isPending || rejectContribMutation.isPending}
                onClick={() => approveContribMutation.mutate(viewingContrib._id || viewingContrib.id)}
                icon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Approve Pledge
              </Button>
              <Button
                variant="danger"
                size="sm"
                isDisabled={approveContribMutation.isPending || rejectContribMutation.isPending}
                onClick={() => {
                  setDetailModalOpen(false);
                  setRejectingContribId(viewingContrib._id || viewingContrib.id);
                  setRejectModalOpen(true);
                }}
                icon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject Pledge
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
