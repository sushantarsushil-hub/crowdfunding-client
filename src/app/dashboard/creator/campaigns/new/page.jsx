'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { PlusCircle, Calendar, Coins, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Input from '../../../../../components/forms/Input';
import Select from '../../../../../components/ui/Select';
import Button from '../../../../../components/ui/Button';
import ImageUploader from '../../../../../components/common/ImageUploader';
import campaignsService from '../../../../../services/campaigns';

export default function AddCampaignPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: 'Medical',
      minimum_contribution: 10,
      campaign_image_url: '',
    },
  });

  const imageUrl = watch('campaign_image_url') || watch('imageUrl') || '';

  const createMutation = useMutation({
    mutationFn: (payload) => campaignsService.createCampaign(payload),
    onSuccess: () => {
      toast.success('Campaign submitted successfully! Awaiting moderator review.');
      reset();
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      router.push('/dashboard/creator/campaigns');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit campaign. Please check input errors.');
    },
  });

  const onSubmit = (formData) => {
    // Security Boundary: Pure field payload. Untrusted creatorId, status, and amountRaised are excluded.
    const payload = {
      campaign_title: formData.campaign_title || formData.title,
      campaign_story: formData.campaign_story || formData.story,
      category: formData.category,
      funding_goal: Number(formData.funding_goal || formData.fundingGoal),
      minimum_contribution: Number(formData.minimum_contribution || formData.minimumContribution || 1),
      deadline: formData.deadline,
      reward_info: formData.reward_info || formData.rewards || '',
      campaign_image_url: formData.campaign_image_url || formData.imageUrl || '',
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link href="/dashboard/creator/campaigns" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Campaigns</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Campaign</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Submit your cause details for moderator review. Once approved, supporters can pledge credits.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campaign Title */}
          <Input
            label="Campaign Title"
            placeholder="e.g. Solar Powered Water Filtration Well for Rural Schools"
            required
            {...register('campaign_title', {
              required: 'Campaign title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters long' },
              maxLength: { value: 120, message: 'Title cannot exceed 120 characters' },
            })}
            error={errors.campaign_title?.message}
          />

          {/* Category Selection */}
          <Select
            label="Category"
            required
            {...register('category', { required: 'Category is required' })}
            error={errors.category?.message}
          >
            <option value="Medical">Medical & Health Relief</option>
            <option value="Education">Education & Youth</option>
            <option value="Environment">Green & Eco Energy</option>
            <option value="Tech">Technology Innovation</option>
            <option value="Creative">Creative Arts & Media</option>
            <option value="Community">Community Relief</option>
          </Select>

          {/* Funding Goal & Minimum Contribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Funding Goal (Credits)"
              type="number"
              min="1"
              placeholder="e.g. 5000"
              required
              startIcon={<Coins className="w-4 h-4" />}
              {...register('funding_goal', {
                required: 'Funding goal is required',
                min: { value: 1, message: 'Funding goal must be a positive integer greater than 0' },
              })}
              error={errors.funding_goal?.message}
            />

            <Input
              label="Minimum Contribution (Credits)"
              type="number"
              min="1"
              placeholder="e.g. 10"
              required
              startIcon={<Coins className="w-4 h-4 text-amber-500" />}
              {...register('minimum_contribution', {
                required: 'Minimum contribution is required',
                min: { value: 1, message: 'Minimum contribution must be at least 1 credit' },
              })}
              error={errors.minimum_contribution?.message}
            />
          </div>

          {/* Deadline Date (Future date validation) */}
          <Input
            label="Deadline Date"
            type="date"
            required
            startIcon={<Calendar className="w-4 h-4" />}
            {...register('deadline', {
              required: 'Deadline date is required',
              validate: (val) => {
                if (!val) return 'Deadline date is required';
                const deadlineDate = new Date(val);
                return deadlineDate > new Date() || 'Deadline date must be in the future';
              },
            })}
            error={errors.deadline?.message}
          />

          {/* ImgBB Image Uploader with Direct URL Fallback */}
          <div>
            <ImageUploader
              label="Campaign Cover Image (ImgBB Upload or URL)"
              value={imageUrl}
              required
              onChange={(url) => {
                setValue('campaign_image_url', url, { shouldValidate: true });
                setValue('imageUrl', url, { shouldValidate: true });
              }}
              error={errors.campaign_image_url?.message}
            />
            <input
              type="hidden"
              {...register('campaign_image_url', {
                required: 'Campaign cover image is required',
                validate: (val) => /^https?:\/\/.+/i.test(val) || 'Image URL must be a valid http/https URL',
              })}
            />
          </div>

          {/* Campaign Story */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Campaign Story & Impact <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Explain the background of your project, why funding is needed, and how funds will be deployed..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
              {...register('campaign_story', {
                required: 'Campaign story is required',
                minLength: { value: 20, message: 'Story must be at least 20 characters long' },
              })}
            />
            {errors.campaign_story && (
              <p className="text-xs text-rose-500 font-medium">{errors.campaign_story.message}</p>
            )}
          </div>

          {/* Reward Info */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Perks & Backer Rewards Information</label>
            <textarea
              rows={2}
              placeholder="Describe perks supporters receive when backing your cause..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors"
              {...register('reward_info')}
            />
          </div>

          {/* Action Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={createMutation.isPending}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Submit Campaign for Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
