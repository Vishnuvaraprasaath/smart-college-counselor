import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function DemoBanner({ onLoadDemoData }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Demo Candidate
            </span>
            <span className="text-xs font-semibold text-slate-900">Pre-Configured Benchmark Profile</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Evaluate full pipeline: 187.50 Cutoff, BC Reservation, ECE Branch, Coimbatore District, ₹1.5L Budget Ceiling.
          </p>
        </div>
      </div>

      <button
        onClick={onLoadDemoData}
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm shrink-0"
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        <span>Load Sample Profile</span>
      </button>
    </div>
  );
}


