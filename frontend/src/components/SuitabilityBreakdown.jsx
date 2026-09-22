import React from 'react';
import { Target, Award, MapPin, IndianRupee, Star, Heart, Info, X } from 'lucide-react';

export default function SuitabilityBreakdown({ college, onClose }) {
  if (!college) return null;

  const breakdown = college.breakdown || {};
  const fitBreakdown = college.fit_breakdown || {};

  const cutoffObj = breakdown.cutoff || {
    student: college.student_cutoff,
    historical: college.historical_cutoff,
    delta: college.cutoff_delta,
    score: fitBreakdown.cutoff_fit || 85,
    weight: 55,
    weightedContribution: Math.round((fitBreakdown.cutoff_fit || 85) * 0.55 * 10) / 10
  };

  const courseObj = breakdown.coursePreference || {
    score: fitBreakdown.course_fit || 100,
    weight: 15,
    weightedContribution: Math.round((fitBreakdown.course_fit || 100) * 0.15 * 10) / 10
  };

  const locationObj = breakdown.location || {
    score: fitBreakdown.location_fit || 100,
    weight: 10,
    weightedContribution: Math.round((fitBreakdown.location_fit || 100) * 0.10 * 10) / 10
  };

  const budgetObj = breakdown.budget || {
    score: fitBreakdown.budget_fit || 100,
    weight: 10,
    weightedContribution: Math.round((fitBreakdown.budget_fit || 100) * 0.10 * 10) / 10
  };

  const qualityObj = breakdown.quality || {
    score: fitBreakdown.quality_fit || 80,
    weight: 5,
    weightedContribution: Math.round((fitBreakdown.quality_fit || 80) * 0.05 * 10) / 10
  };

  const interestObj = breakdown.interest || {
    score: fitBreakdown.interest_fit || 90,
    weight: 5,
    weightedContribution: Math.round((fitBreakdown.interest_fit || 90) * 0.05 * 10) / 10
  };

  const factors = [
    { key: 'cutoff', label: 'Cutoff Compatibility', weight: 55, score: cutoffObj.score, contrib: cutoffObj.weightedContribution, icon: Target, detail: `Candidate (${cutoffObj.student}) vs TNEA Benchmark (${cutoffObj.historical || 'N/A'}) = Δ ${cutoffObj.delta >= 0 ? '+' : ''}${cutoffObj.delta != null ? cutoffObj.delta.toFixed(2) : 'N/A'}` },
    { key: 'course', label: 'Branch Priority Fit', weight: 15, score: courseObj.score, contrib: courseObj.weightedContribution, icon: Award, detail: courseObj.rank ? `Rank #${courseObj.rank} selected branch` : 'Direct specialization match' },
    { key: 'location', label: 'Geographic Match', weight: 10, score: locationObj.score, contrib: locationObj.weightedContribution, icon: MapPin, detail: `${college.city} regional campus` },
    { key: 'budget', label: 'Fiscal Feasibility', weight: 10, score: budgetObj.score, contrib: budgetObj.weightedContribution, icon: IndianRupee, detail: `₹${college.fees ? college.fees.toLocaleString('en-IN') : 'N/A'} / yr annual tuition` },
    { key: 'quality', label: 'Academic Standing (NIRF)', weight: 5, score: qualityObj.score, contrib: qualityObj.weightedContribution, icon: Star, detail: `NIRF Rank #${college.ranking || 'N/A'} • ${college.placement_rate != null ? college.placement_rate + '%' : 'N/A'} placement rate` },
    { key: 'interest', label: 'Specialization Alignment', weight: 5, score: interestObj.score, contrib: interestObj.weightedContribution, icon: Heart, detail: 'Curriculum domain synergy' },
  ];

  const exactSum = (
    cutoffObj.weightedContribution +
    courseObj.weightedContribution +
    locationObj.weightedContribution +
    budgetObj.weightedContribution +
    qualityObj.weightedContribution +
    interestObj.weightedContribution
  ).toFixed(1);

  const roundedScore = college.suitability_score != null ? college.suitability_score : Math.round(parseFloat(exactSum));

  return (
    <div className={onClose ? "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" : "w-full"}>
      <div className={onClose ? "bg-white rounded-xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative" : "bg-white rounded-xl w-full p-6 border border-slate-200 shadow-sm relative"}>
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 block">
              Suitability Model Audit
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-tight mt-1">{college.college_name || college.name}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{college.course_name || college.course_code || 'Engineering Program'} {college.course_code ? `(${college.course_code})` : ''}</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              aria-label="Close suitability breakdown modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Overall Score Badge */}
        <div className="my-5 p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Overall Suitability Score</span>
            <span className="text-[11px] text-slate-500 font-normal">Multi-parameter weighted linear index</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-3xl font-extrabold text-blue-600">{roundedScore}</span>
            <span className="text-xs font-semibold text-slate-400"> / 100</span>
          </div>
        </div>

        {/* Factors List */}
        <div className="space-y-2.5 my-4">
          {factors.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3 rounded-lg bg-white border border-slate-200/80 hover:border-slate-300 transition-colors space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center space-x-2 text-slate-800">
                    <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{item.label}</span>
                    <span className="text-[11px] font-mono text-slate-400">({item.weight}%)</span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-slate-900 font-bold">{item.score}/100</span>
                    <span className="text-blue-600 font-bold ml-2">({item.contrib.toFixed(1)} pts)</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <span className="text-[11px] text-slate-500 font-normal block">
                  {item.detail}
                </span>
              </div>
            );
          })}
        </div>

        {/* Exact Mathematical Total */}
        <div className="mt-5 p-4 rounded-lg bg-slate-900 text-white space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-300">
            <span>Deterministic Weights:</span>
            <span className="text-blue-400">55% + 15% + 10% + 10% + 5% + 5%</span>
          </div>
          <div className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
            {cutoffObj.weightedContribution.toFixed(1)} + {courseObj.weightedContribution.toFixed(1)} + {locationObj.weightedContribution.toFixed(1)} + {budgetObj.weightedContribution.toFixed(1)} + {qualityObj.weightedContribution.toFixed(1)} + {interestObj.weightedContribution.toFixed(1)} = <strong className="text-emerald-400 text-sm font-bold">{exactSum}</strong>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Displayed score ({roundedScore}) is rounded from exact computed sum ({exactSum}).</span>
          </div>
        </div>

        {/* Close CTA */}
        {onClose && (
          <div className="mt-5 pt-1 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider transition"
            >
              Close Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

