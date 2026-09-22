import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function AnalysisLoadingPage({ onComplete }) {
  const [stage, setStage] = useState(0);

  const stages = [
    'Processing academic profile & normalized 12th cutoff',
    'Querying verified TNEA admission cutoffs (2023–2025)',
    'Evaluating preferred engineering branch priorities',
    'Scoring regional district & campus location preferences',
    'Auditing annual tuition & hostel fee constraints',
    'Executing 6-factor deterministic suitability algorithm',
    'Classifying Safe, Moderate, and Ambitious institutions',
    'Synthesizing personalized AI advisory commentary'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-7 sm:p-8 rounded-xl border border-slate-200 shadow-card text-center space-y-6 relative overflow-hidden">
        
        {/* Top Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.round(((stage + 1) / stages.length) * 100)}%` }}
          />
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Evaluating Profile
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-2">Computing Admissions Model</h2>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Matching historical TNEA cutoffs against candidate criteria
          </p>
        </div>

        {/* Animated Checklist Steps */}
        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
          {stages.map((st, idx) => {
            const isFinished = stage > idx;
            const isCurrent = stage === idx;
            return (
              <div key={idx} className="flex items-center space-x-2 text-xs">
                {isFinished ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className={`text-xs ${
                  isFinished 
                    ? 'text-slate-800 font-medium' 
                    : isCurrent 
                    ? 'text-blue-700 font-semibold' 
                    : 'text-slate-400 font-normal'
                }`}>
                  {st}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-slate-400 font-normal">
          Calculating 6-factor suitability vectors...
        </div>

      </div>
    </div>
  );
}


