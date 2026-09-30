import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Brain, Check } from 'lucide-react';

export default function AnalysisLoadingPage({ onComplete }) {
  const [stage, setStage] = useState(0);

  const stages = [
    'Normalizing 12th cutoff scores & academic parameters',
    'Querying official TNEA historical cutoff records (2023–2025)',
    'Matching community reservation quotas & branch priorities',
    'Auditing geographic location & campus proximity fit',
    'Evaluating annual tuition & hostel fee constraints',
    'Computing 6-factor deterministic suitability matrix',
    'Classifying institutions into Safe, Moderate & Ambitious tiers',
    'Synthesizing personalized CounselAI strategic guidance'
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
    }, 420);

    return () => clearInterval(timer);
  }, [onComplete, stages.length]);

  const progressPct = Math.round(((stage + 1) / stages.length) * 100);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-white p-8 sm:p-9 rounded-3xl border border-slate-200/90 shadow-elevated text-center space-y-7 relative overflow-hidden">
        
        {/* Top Progress Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 shadow-xs"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Central Pulsing Icon */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-indigo-100/60 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center shadow-xs">
            <Brain className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 inline-block">
            Synthesizing Model
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analyzing Your Profile...
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Matching historical TNEA cutoffs and executing deterministic suitability scoring
          </p>
        </div>

        {/* Animated Checklist Steps */}
        <div className="space-y-2.5 text-left bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
          {stages.map((st, idx) => {
            const isFinished = stage > idx;
            const isCurrent = stage === idx;

            return (
              <div key={idx} className="flex items-center space-x-2.5 text-xs">
                {isFinished ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`text-xs transition-colors duration-150 ${
                  isFinished 
                    ? 'text-slate-800 font-medium' 
                    : isCurrent 
                    ? 'text-indigo-700 font-bold' 
                    : 'text-slate-400 font-normal'
                }`}>
                  {st}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Progress & Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1 pt-1">
          <span>Processing 6-factor weight matrix</span>
          <span className="font-bold text-indigo-600">{progressPct}% Complete</span>
        </div>

      </div>
    </div>
  );
}
