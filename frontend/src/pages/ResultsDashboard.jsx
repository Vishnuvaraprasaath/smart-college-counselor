import React, { useState, useMemo } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, Bot, GitCompare, ArrowUpDown, RotateCcw, Building2, FileText, History, ArrowRight } from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import TNEAChoiceSheetModal from '../components/TNEAChoiceSheetModal';

export default function ResultsDashboard({ analysisData, onSelectDetail, setCurrentView, comparedColleges, setComparedColleges }) {
  const [activeTab, setActiveTab] = useState('all'); // all, safe, moderate, ambitious
  const [sortBy, setSortBy] = useState('score'); // score, delta, nirf, placement, fee
  const [showChoiceSheet, setShowChoiceSheet] = useState(false);

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Admission Evaluation Available Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please submit the academic counselling intake form to generate deterministic college matches.
        </p>
        <button
          onClick={() => setCurrentView('form')}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Begin Admission Assessment
        </button>
      </div>
    );
  }

  const { studentProfile, summary, categorized, recommendations, aiExplanation } = analysisData;

  const rawFilteredRecommendations = activeTab === 'all'
    ? recommendations
    : activeTab === 'safe'
    ? categorized.safe
    : activeTab === 'moderate'
    ? categorized.moderate
    : categorized.ambitious;

  // Pure frontend sorting without altering underlying calculations
  const sortedRecommendations = useMemo(() => {
    const list = [...rawFilteredRecommendations];
    if (sortBy === 'score') {
      return list.sort((a, b) => b.suitability_score - a.suitability_score);
    }
    if (sortBy === 'delta') {
      return list.sort((a, b) => (b.cutoff_delta || -99) - (a.cutoff_delta || -99));
    }
    if (sortBy === 'nirf') {
      return list.sort((a, b) => (a.ranking || 999) - (b.ranking || 999));
    }
    if (sortBy === 'placement') {
      return list.sort((a, b) => (b.placement_rate || 0) - (a.placement_rate || 0));
    }
    if (sortBy === 'fee') {
      return list.sort((a, b) => (a.fees || 9999999) - (b.fees || 9999999));
    }
    return list;
  }, [rawFilteredRecommendations, sortBy]);

  const handleAddToCompare = (college) => {
    const exists = comparedColleges.some(c => c.id === college.college_id);
    if (exists) {
      setComparedColleges(comparedColleges.filter(c => c.id !== college.college_id));
    } else {
      if (comparedColleges.length >= 3) {
        alert('You can compare a maximum of 3 colleges simultaneously.');
        return;
      }
      setComparedColleges([...comparedColleges, {
        id: college.college_id,
        name: college.college_name,
        code: college.college_code,
        course: college.course_code
      }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      
      {/* Dashboard Top Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Evaluation Dossier
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Admission Intelligence Report
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Evaluated for <strong className="text-slate-900 font-semibold">{studentProfile.name || 'Candidate'}</strong> • Cutoff: <strong className="text-slate-900 font-mono font-bold">{studentProfile.cutoff} / 200</strong> • Category: <strong className="text-slate-900 font-semibold">{studentProfile.category}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowChoiceSheet(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>TNEA Choice Sheet (3:3:2)</span>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center space-x-1.5 transition"
            title="View all previous analyses recorded in database"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
          </button>

          <button
            onClick={() => setCurrentView('form')}
            className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Metrics & Category Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Profile Card */}
        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3 md:col-span-1 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Candidate Benchmark</span>
          <div>
            <span className="block text-3xl font-bold font-mono text-white">{studentProfile.cutoff}</span>
            <span className="text-xs text-slate-400 font-normal">TNEA Normalized Score</span>
          </div>
          <div className="pt-3 border-t border-slate-800 space-y-1 text-xs text-slate-300">
            <div className="flex justify-between"><span>Category:</span><strong className="text-white font-mono">{studentProfile.category}</strong></div>
            <div className="flex justify-between"><span>Location:</span><strong className="text-white">{studentProfile.location}</strong></div>
            <div className="flex justify-between"><span>Branches:</span><strong className="text-white truncate max-w-[120px]">{studentProfile.courses?.join(', ') || 'ECE'}</strong></div>
          </div>
        </div>

        {/* Safe Count */}
        <div 
          onClick={() => setActiveTab('safe')}
          className={`p-5 rounded-xl border cursor-pointer transition-colors flex flex-col justify-between ${
            activeTab === 'safe' 
              ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500' 
              : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">Safe Tier</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-emerald-700">{summary.safeCount}</span>
            <span className="text-xs text-slate-500 block font-normal mt-0.5">Historical cutoff positive margin (Δ ≥ +2.0)</span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
            <span>Filter Safe Options</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Moderate Count */}
        <div 
          onClick={() => setActiveTab('moderate')}
          className={`p-5 rounded-xl border cursor-pointer transition-colors flex flex-col justify-between ${
            activeTab === 'moderate' 
              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-1 ring-amber-500' 
              : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">Moderate Tier</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-amber-700">{summary.moderateCount}</span>
            <span className="text-xs text-slate-500 block font-normal mt-0.5">Competitive realistic target (Δ: -3.0 to +2.0)</span>
          </div>
          <span className="text-xs text-amber-700 font-semibold flex items-center space-x-1">
            <span>Filter Moderate Options</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Ambitious Count */}
        <div 
          onClick={() => setActiveTab('ambitious')}
          className={`p-5 rounded-xl border cursor-pointer transition-colors flex flex-col justify-between ${
            activeTab === 'ambitious' 
              ? 'border-rose-500 bg-rose-50/70 shadow-xs ring-1 ring-rose-500' 
              : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">Ambitious Tier</span>
            <HelpCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-bold font-mono text-rose-700">{summary.ambitiousCount}</span>
            <span className="text-xs text-slate-500 block font-normal mt-0.5">Reach aspirations (Cutoff deficit Δ &lt; -3.0)</span>
          </div>
          <span className="text-xs text-rose-700 font-semibold flex items-center space-x-1">
            <span>Filter Ambitious Options</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>

      {/* AI GENERATED ADVISORY CARD */}
      {aiExplanation && (
        <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  CounselAI Advisory Assessment
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Admission Counseling Strategy Analysis</h3>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-slate-400 font-medium">Grounded in MySQL Records</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200">
            {aiExplanation}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setShowChoiceSheet(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate TNEA Choice List</span>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Discuss Strategy with CounselAI</span>
            </button>
          </div>
        </div>
      )}

      {/* RECOMMENDATIONS TAB FILTER & SORT CONTROLS */}
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Matched Institutions & Specializations</h3>
            <p className="text-xs text-slate-500 font-normal">Scored against official TNEA historical admission cutoff data</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="score">Suitability Fit Score (High → Low)</option>
                <option value="delta">Cutoff Delta (Highest Margin First)</option>
                <option value="nirf">NIRF Ranking (Top Ranked First)</option>
                <option value="placement">Placement Record (High → Low)</option>
                <option value="fee">Annual Tuition Fee (Lowest First)</option>
              </select>
            </div>

            {/* Classification Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'all', label: `All (${summary.totalMatches})` },
                { id: 'safe', label: `Safe (${summary.safeCount})` },
                { id: 'moderate', label: `Moderate (${summary.moderateCount})` },
                { id: 'ambitious', label: `Ambitious (${summary.ambitiousCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-white text-slate-900 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLLEGE CARDS GRID */}
        {sortedRecommendations.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-2">
            <Building2 className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="text-slate-900 text-sm font-semibold">No institutions found matching the selected criteria.</p>
            <p className="text-xs text-slate-500">Try switching to the "All" or "Safe" tier to review available matches.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedRecommendations.map((college, idx) => (
              <CollegeCard
                key={idx}
                college={college}
                onSelectDetail={onSelectDetail}
                onAddToCompare={handleAddToCompare}
                isCompared={comparedColleges.some(c => c.id === college.college_id)}
                onAskAI={(col) => {
                  setCurrentView('chat');
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* FLOATING COMPARISON BAR */}
      {comparedColleges.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-modal border border-slate-800 flex items-center space-x-4 max-w-lg w-full">
          <div className="flex-1">
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block">
              Comparison Queue ({comparedColleges.length}/3)
            </span>
            <div className="flex items-center space-x-1.5 text-xs truncate mt-0.5">
              {comparedColleges.map((c, i) => (
                <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[11px]">
                  {c.code}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCurrentView('compare')}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>
        </div>
      )}

      {/* TNEA CHOICE FILLING SHEET MODAL */}
      {showChoiceSheet && (
        <TNEAChoiceSheetModal
          analysisData={analysisData}
          onClose={() => setShowChoiceSheet(false)}
          onSelectDetail={onSelectDetail}
        />
      )}

    </div>
  );
}


