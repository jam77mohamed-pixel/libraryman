import React from 'react';

const SkeletonLoader = ({ type = 'table', count = 5, className = '' }) => {
  if (type === 'stat') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-7 w-28 bg-slate-200 rounded" />
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
            <div className="h-52 bg-slate-200 w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default table row skeleton
  return (
    <div className={`w-full divide-y divide-slate-100 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="py-4 px-6 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 w-1/3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-200 rounded w-4/5" />
              <div className="h-2.5 bg-slate-200 rounded w-2/5" />
            </div>
          </div>
          <div className="h-3 bg-slate-200 rounded w-1/6 hidden sm:block" />
          <div className="h-5 bg-slate-200 rounded-full w-20 hidden md:block" />
          <div className="h-3 bg-slate-200 rounded w-16" />
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-slate-200 rounded-lg" />
            <div className="w-7 h-7 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
