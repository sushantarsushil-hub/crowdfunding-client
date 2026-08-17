'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { 
  Heart, 
  Tag, 
  Coins, 
  ShieldCheck, 
  ArrowLeft, 
  Gift, 
  Clock, 
  AlertCircle,
  Lock
} from 'lucide-react';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Progress from '../../../components/ui/Progress';
import PageLoader from '../../../components/common/PageLoader';
import ErrorState from '../../../components/common/ErrorState';
import NotFoundState from '../../../components/common/NotFoundState';
import useAuth from '../../../hooks/use-auth';
import campaignsService from '../../../services/campaigns';
import contributionsService from '../../../services/contributions';

export default function CampaignDetailsPage({ params }) {
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, isAuthenticated, refreshUser } = useAuth();

  // React Hook Form for Supporter Contribution
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contribution_amount: '',
      message: '',
    },
  });

  // Fetch campaign details via TanStack Query
  const { data: campaignData, isLoading, isError, refetch } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignsService.getCampaignById(campaignId),
    enabled: !!campaignId,
  });

  const campaign = campaignData?.data?.campaign || campaignData?.campaign || campaignData?.data || campaignData;

  // Contribute mutation
  const contributeMutation = useMutation({
    mutationFn: (payload) => contributionsService.contribute(payload),
    onSuccess: async () => {
      toast.success('Thank you! Your credit pledge was submitted successfully.');
      reset();
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['myContributions'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.push('/dashboard/supporter/contributions');
    },
    onError: (err) => {
      toast.error(err.message || 'Contribution failed. Please check your credit balance.');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <PageLoader message="Loading campaign details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto p-8 w-full flex items-center justify-center">
          <ErrorState
            title="Unable to Load Campaign Details"
            message="Could not retrieve campaign details from the network. Please verify your connection."
            onRetry={refetch}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto p-8 w-full flex items-center justify-center">
          <NotFoundState
            title="Campaign Not Found"
            description="The requested campaign ID does not exist or may have been removed."
            actionText="Explore All Campaigns"
            actionHref="/campaigns"
          />
        </div>
        <Footer />
      </div>
    );
  }

  const raised = campaign.amountRaised ?? campaign.raisedAmount ?? campaign.raised ?? 0;
  const goal = campaign.fundingGoal ?? campaign.goalAmount ?? campaign.goal ?? 1;
  const minContribution = campaign.minimumContribution || 1;
  const remaining = Math.max(0, goal - raised);
  
  const deadlineDate = campaign.deadline ? new Date(campaign.deadline) : null;
  const daysLeft = deadlineDate ? Math.max(0, Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))) : 'Active';
  const isExpired = deadlineDate && deadlineDate < new Date();
  const creatorName = campaign.creatorName || campaign.creatorId?.name || campaign.organizer || 'Verified Creator';

  const userCredits = user?.credits ?? 0;

  const handlePledgeSubmit = (formData) => {
    if (!isAuthenticated) {
      router.push(`/login?from=/campaigns/${campaignId}`);
      return;
    }

    // Security & Data Payload Boundary: Sends ONLY campaignId, contribution_amount, and message.
    contributeMutation.mutate({
      campaignId,
      contribution_amount: Number(formData.contribution_amount || formData.contributionAmount),
      contributionAmount: Number(formData.contribution_amount || formData.contributionAmount),
      message: formData.message || '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Back Link */}
        <Link href="/campaigns" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Campaigns</span>
        </Link>

        {/* Campaign Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cover Image & Story */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cover Image & Badges */}
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200 bg-white">
              <img
                src={campaign?.imageUrl || campaign?.image || campaign?.campaign_image_url || campaign?.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'}
                alt={campaign?.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';
                }}
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 border border-white/60 shadow-xs flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{campaign.category || 'General'}</span>
                </span>
                <Badge variant={campaign.status === 'approved' ? 'success' : 'warning'}>
                  {campaign.status || 'Active'}
                </Badge>
              </div>
            </div>

            {/* Campaign Header Info */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {campaign.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                      {creatorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-slate-900 font-bold block">{creatorName}</span>
                      <span className="text-[11px] text-emerald-600">Campaign Organizer</span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-slate-200" />
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{typeof daysLeft === 'number' ? `${daysLeft} days remaining` : daysLeft}</span>
                  </div>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <h3 className="font-extrabold text-slate-900 text-base">About This Cause</h3>
                <p className="whitespace-pre-line font-medium">
                  {campaign.story || campaign.description || 'This campaign was created to bring direct relief and sustainable impact to community initiatives.'}
                </p>
              </div>

              {/* Reward Information */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>Backer Perks & Rewards</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {campaign.rewards || campaign.rewardInfo || 'Supporters pledging minimum required credits receive direct progress updates and certificate badges.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Funding Progress & Contribution Form */}
          <div className="space-y-6">
            
            {/* Progress Metrics Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
              
              <div className="space-y-2">
                <div className="text-3xl font-extrabold text-slate-900">
                  {raised.toLocaleString()} <span className="text-xs font-bold text-slate-400 uppercase">credits raised</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Target Goal: <strong className="text-slate-800">{goal.toLocaleString()} Credits</strong>
                </div>

                <Progress value={raised} max={goal} showValue={true} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Remaining Target</span>
                  <span className="font-extrabold text-slate-800">{remaining.toLocaleString()} Cr</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Min Contribution</span>
                  <span className="font-extrabold text-emerald-600">{minContribution} Cr</span>
                </div>
              </div>

              {/* Security & Audit Note */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-medium pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pledges held in secure platform escrow until verified.</span>
              </div>
            </div>

            {/* Contribution Form Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
              
              {!isAuthenticated ? (
                /* Unauthenticated State */
                <div className="text-center space-y-4 py-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">Sign In to Back This Cause</h4>
                    <p className="text-xs text-slate-500 font-medium">You need an active account to pledge credits to campaigns.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => router.push(`/login?from=/campaigns/${campaignId}`)}
                  >
                    Log In to Contribute
                  </Button>
                </div>
              ) : user?.role === 'creator' ? (
                /* Creator Role State */
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Creator Account Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
                    Creator accounts manage campaign submissions and payouts. Pledges can be made using a Supporter account.
                  </p>
                </div>
              ) : user?.role === 'admin' ? (
                /* Admin Role State */
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Administrator Moderation Mode</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-700 font-medium">
                    Admin accounts moderate causes and approve withdrawal payouts.
                  </p>
                </div>
              ) : (
                /* Authenticated Supporter Form State (React Hook Form) */
                <form onSubmit={handleSubmit(handlePledgeSubmit)} className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Pledge Contribution</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      {userCredits} Available Cr
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Amount (Credits) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={minContribution}
                        placeholder={`Min ${minContribution} Cr`}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                        {...register('contribution_amount', {
                          required: 'Contribution amount is required',
                          min: { value: minContribution, message: `Minimum pledge amount is ${minContribution} credits` },
                          validate: (val) => Number(val) <= userCredits || `Insufficient credits balance (${userCredits} Cr available)`,
                        })}
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                        CR
                      </span>
                    </div>
                    {errors.contribution_amount && (
                      <p className="text-xs text-rose-500 font-medium">{errors.contribution_amount.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Support Message (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Leave an encouraging message for the organizer..."
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 resize-none"
                      {...register('message')}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={contributeMutation.isPending}
                    isDisabled={isExpired}
                    icon={<Heart className="w-4 h-4 fill-white" />}
                  >
                    {isExpired ? 'Campaign Expired' : 'Pledge Credits Now'}
                  </Button>
                </form>
              )}

            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
