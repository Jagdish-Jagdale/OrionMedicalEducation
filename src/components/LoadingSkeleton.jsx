import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 animate-pulse">
    <div className="h-44 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
      <div className="flex gap-1.5">
        <div className="h-5 w-10 bg-slate-200 rounded-full" />
        <div className="h-5 w-10 bg-slate-200 rounded-full" />
      </div>
      <div className="h-10 bg-slate-200 rounded-xl mt-2" />
    </div>
  </div>
);

export const TeamCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sm:p-8 animate-pulse">
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      {/* Left Side Skeleton */}
      <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
        <div className="w-40 h-52 bg-slate-200 rounded-2xl mb-6 shadow-sm" />
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-8 bg-slate-50 rounded-full w-1/2" />
      </div>

      {/* Right Side Skeleton */}
      <div className="w-full sm:w-2/3 pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
          <div className="h-3 bg-slate-200 rounded w-24" />
        </div>
        <div className="space-y-3 mb-8">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
          <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
        </div>
      </div>
    </div>
  </div>
);

export const TeamPageSkeleton = () => (
  <div className="min-h-screen bg-[#e0f2fe] pt-20 animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="py-16 sm:py-24 bg-slate-200/50 flex flex-col items-center gap-6 relative overflow-hidden">
      <div className="h-6 bg-slate-300 rounded-full w-32" />
      <div className="h-12 bg-slate-300 rounded w-2/3 max-w-lg" />
      <div className="h-4 bg-slate-300 rounded w-1/2 max-w-md" />
    </div>

    {/* Stats Bar Skeleton */}
    <div className="bg-white border-b border-slate-100 shadow-sm py-6">
      <div className="max-w-3xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="text-center space-y-2">
            <div className="h-6 bg-slate-200 rounded w-12 mx-auto" />
            <div className="h-3 bg-slate-100 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center mb-10 space-y-2">
        <div className="h-8 bg-slate-200 rounded w-48 mx-auto" />
        <div className="w-16 h-1 bg-amber-200 mx-auto rounded-full" />
      </div>
      <TeamCardSkeleton />
      <TeamCardSkeleton />
    </div>
  </div>
);

export const ReviewCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
    <div className="flex gap-1 mb-3">
      {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 bg-slate-200 rounded" />)}
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-slate-100 rounded" />
      <div className="h-3 bg-slate-100 rounded" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'teampage') return <TeamPageSkeleton />;

  const SkeletonComponent = {
    card: CardSkeleton,
    team: TeamCardSkeleton,
    review: ReviewCardSkeleton,
  }[type] || CardSkeleton;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
};

export default LoadingSkeleton;
