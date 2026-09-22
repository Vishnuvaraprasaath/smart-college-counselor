import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, GitCompare, MessageSquareCode, Award, IndianRupee, PieChart, ShieldCheck, ShieldAlert } from 'lucide-react';
import SuitabilityBreakdown from './SuitabilityBreakdown';

export default function CollegeCard({ college, onSelectDetail, onAddToCompare, isCompared, onAskAI }) {
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const isSafe = college.chance_category === 'SAFE';
  const isModerate = college.chance_category === 'MODERATE';
  const isAmbitious = college.chance_category === 'AMBITIOUS';

  const badgeStyles = isSafe 
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    : isModerate 
    ? 'bg-amber-50 text-amber-800 border-amber-200' 
    : 'bg-rose-50 text-rose-800 border-rose-200';

  const BadgeIcon = isSafe ? CheckCircle2 : isModerate ? AlertCircle : HelpCircle;

  const feeVal = college.fees ? parseFloat(college.fees) : null;
  const maxBudget = college.breakdown?.budget?.maxBudget || null;
  const isWithinBudget = feeVal && maxBudget ? feeVal <= maxBudget : null;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all duration-150 flex flex-col justify-between group">
        <div>
          {/* Top Header Row with Suitability Score & Chance Category */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-slate-100 text-slate-800 rounded border border-slate-200">
                  {college.course_code || 'ENGG'}
                </span>
                <span className="text-xs text-slate-500 font-normal flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                  {college.city || 'Tamil Nadu'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
                {college.college_name}
              </h3>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                {college.type || 'Engineering Institution'} • {college.accreditation || 'NAAC Accredited'}
              </p>
            </div>

            {/* Suitability Score & Admission Chance Badge Stack */}
            <div className="flex flex-col items-end space-y-1.5 shrink-0">
              <div className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold font-mono border border-blue-200 shadow-xs flex items-center space-x-1">
                <span>{college.suitability_score || 85}</span>
                <span className="text-[10px] text-blue-500 font-sans">Fit</span>
              </div>
              <div className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 ${badgeStyles}`}>
                <BadgeIcon className="w-3 h-3" />
                <span>{college.chance_category || 'MODERATE'}</span>
              </div>
            </div>
          </div>

          {/* Cutoff Stats & Gap Indicator Grid */}
          <div className="my-3.5 p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="border-r border-slate-200 pr-1">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hist. Cutoff</span>
              <span className="text-sm font-bold text-slate-900">
                {college.historical_cutoff != null ? college.historical_cutoff : 'N/A'}
              </span>
            </div>
            <div className="border-r border-slate-200 px-1">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Your Cutoff</span>
              <span className="text-sm font-bold text-slate-900">
                {college.student_cutoff != null ? college.student_cutoff : 'N/A'}
              </span>
            </div>
            <div className="pl-1">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Delta Buffer</span>
              {college.cutoff_delta != null ? (
                <span className={`text-sm font-bold ${college.cutoff_delta >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {college.cutoff_delta >= 0 ? `+${college.cutoff_delta.toFixed(2)}` : college.cutoff_delta.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm font-bold text-slate-400">N/A</span>
              )}
            </div>
          </div>

          {/* Budget & Quality Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {isWithinBudget !== null && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center space-x-1 ${
                isWithinBudget ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isWithinBudget ? <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" /> : <ShieldAlert className="w-3 h-3 text-amber-600 mr-0.5" />}
                <span>{isWithinBudget ? 'Within Budget' : 'Exceeds Budget'}</span>
              </span>
            )}

            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200 flex items-center space-x-1">
              <Award className="w-3 h-3 text-slate-500" />
              <span>NIRF #{college.ranking || 'N/A'}</span>
            </span>

            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
              {college.placement_rate != null ? `${college.placement_rate}% Placed` : 'Placement N/A'}
            </span>
          </div>

          {/* Why Recommended Section */}
          <div className="space-y-1.5 mb-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Assessment Rationale</span>
              <button
                onClick={() => setShowBreakdownModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition"
              >
                <PieChart className="w-3 h-3" />
                <span>Audit Weights</span>
              </button>
            </div>
            {college.reasons?.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {/* Fee & Specs Summary Row */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-normal">
            <div className="flex items-center space-x-1 font-mono">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
              <span>₹{college.fees ? college.fees.toLocaleString('en-IN') : 'N/A'} / yr</span>
            </div>
            <div className="font-mono text-[11px]">
              <span>Avg: ₹{college.avg_package ? `${college.avg_package} LPA` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onAddToCompare(college)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition ${
              isCompared 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Queued' : 'Compare'}</span>
          </button>

          <button
            onClick={() => onAskAI(college)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5 transition"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => onSelectDetail(college.college_id)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center space-x-1 transition shadow-sm"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Math Breakdown Modal */}
      {showBreakdownModal && (
        <SuitabilityBreakdown 
          college={college} 
          onClose={() => setShowBreakdownModal(false)} 
        />
      )}
    </>
  );
}


