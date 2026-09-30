import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function DemoBanner({ onLoadDemoData }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-300">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
          <Sparkles className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/70">
              Demo Candidate
            </span>
            <span className="text-xs font-bold text-slate-900">Pre-Configured Benchmark Dossier</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Test the pipeline with one click: 187.50 Cutoff, BC Quota, ECE/CSE Preferences, Coimbatore Hub, ₹1.5L Budget.
          </p>
        </div>
      </div>

      <button
        onClick={onLoadDemoData}
        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-xs shrink-0 active:scale-[0.99]"
      >
        <Play className="w-3.5 h-3.5 fill-white text-white" />
        <span>Load Sample Profile</span>
      </button>
    </div>
  );
}
