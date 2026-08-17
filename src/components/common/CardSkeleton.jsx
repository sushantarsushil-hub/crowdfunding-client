'use client';

import React from 'react';
import Skeleton from './Skeleton';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-44 rounded-2xl" />

      {/* Organizer & Title Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-24 h-3 rounded-full" />
        <Skeleton className="w-full h-5 rounded-xl" />
        <Skeleton className="w-3/4 h-4 rounded-xl" />
      </div>

      {/* Progress Bar & Goal Skeletons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <Skeleton className="w-full h-2 rounded-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-4 rounded-lg" />
          <Skeleton className="w-20 h-4 rounded-lg" />
        </div>
      </div>

      {/* Button Skeleton */}
      <Skeleton className="w-full h-9 rounded-2xl" />
    </div>
  );
};

export const CardSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default CardSkeleton;
