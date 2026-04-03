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
  <div className="bg-white rounded-3xl shadow-lg border border-slate-100 text-center py-8 px-6 animate-pulse">
    <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto mb-4" />
    <div className="h-5 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
    <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto mb-4" />
    <div className="space-y-2">
      <div className="h-3 bg-slate-100 rounded" />
      <div className="h-3 bg-slate-100 rounded w-5/6 mx-auto" />
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
