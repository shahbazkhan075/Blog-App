import React from 'react';

export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-slate-200" />
      <div className="p-5">
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 bg-slate-200 rounded mb-2 w-4/5" />
        <div className="h-4 bg-slate-200 rounded mb-1 w-full" />
        <div className="h-4 bg-slate-200 rounded mb-1 w-5/6" />
        <div className="h-4 bg-slate-200 rounded mb-4 w-3/4" />
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
