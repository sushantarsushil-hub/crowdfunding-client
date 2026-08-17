import React from 'react';

const ShimmerBlock = ({ className }) => (
  <div className={`bg-slate-200/80 rounded-md relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>
);

export const CampaignSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        {/* Image placeholder */}
        <div className="w-full h-48 bg-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        {/* Content placeholder */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <ShimmerBlock className="w-20 h-5 rounded-full" />
            <ShimmerBlock className="w-16 h-4 rounded-full" />
          </div>

          <div className="space-y-2.5">
            <ShimmerBlock className="w-full h-5" />
            <ShimmerBlock className="w-3/4 h-5" />
          </div>

          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <ShimmerBlock className="w-full h-2.5 rounded-full" />
            <div className="flex justify-between items-center">
              <ShimmerBlock className="w-28 h-4" />
              <ShimmerBlock className="w-16 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Button placeholder */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100">
        <ShimmerBlock className="w-full h-10 rounded-xl" />
      </div>
    </div>
  );
};

export const CampaignSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CampaignSkeleton key={idx} />
      ))}
    </div>
  );
};

export default CampaignSkeleton;

