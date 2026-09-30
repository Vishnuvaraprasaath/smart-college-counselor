import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Bot, 
  GitCompare, 
  ArrowUpDown, 
  RotateCcw, 
  Building2, 
  FileText, 
  History, 
  ArrowRight,
  Sparkles,
  MapPin,
  BookOpen,
  IndianRupee,
  Layers,
  ChevronRight
} from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import TNEAChoiceSheetModal from '../components/TNEAChoiceSheetModal';

export default function ResultsDashboard({ 
  analysisData, 
  onSelectDetail, 
  setCurrentView, 
  comparedColleges, 
  setComparedColleges,
  onClearSession
}) {
  const [activeTab, setActiveTab] = useState('all'); // all, safe, moderate, ambitious
  const [sortBy, setSortBy] = useState('score'); // score, delta, nirf, placement, fee
  const [showChoiceSheet, setShowChoiceSheet] = useState(false);

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">No Admission Evaluation Available</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Please complete the candidate intake wizard to generate verified deterministic college matches and risk tiers.
        </p>
        <button
          onClick={() => setCurrentView('form')}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
        >
          Begin Admission Assessment
        </button>
      </div>
    );
  }

  const studentProfile = analysisData?.studentProfile || {};
  const summary = analysisData?.summary || {
    totalEvaluated: (analysisData?.recommendations || []).length,
    safeCount: 0,
    moderateCount: 0,
    ambitiousCount: 0
  };
  const categorized = analysisData?.categorized || {
    safe: (analysisData?.recommendations || []).filter(r => r.risk_category === 'Safe'),
    moderate: (analysisData?.recommendations || []).filter(r => r.risk_category === 'Moderate'),
    ambitious: (analysisData?.recommendations || []).filter(r => r.risk_category === 'Ambitious')
  };
  const recommendations = Array.isArray(analysisData?.recommendations) ? analysisData.recommendations : [];
  const aiExplanation = analysisData?.aiExplanation || '';

  const rawFilteredRecommendations = activeTab === 'all'
    ? recommendations
    : activeTab === 'safe'
    ? (categorized.safe || [])
    : activeTab === 'moderate'
    ? (categorized.moderate || [])
    : (categorized.ambitious || []);

  // Pure frontend sorting without altering underlying calculations
  const sortedRecommendations = useMemo(() => {
    const list = [...(rawFilteredRecommendations || [])];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & DOSSIER CONTROLS                                          */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 uppercase tracking-wider">
              Strategic Evaluation Dossier
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Your Personalized Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Based on your academic profile, interests, and preferences • Evaluated for <strong className="text-slate-900 font-semibold">{studentProfile.name || 'Candidate'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowChoiceSheet(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>TNEA Choice Sheet (3:3:2)</span>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition"
            title="View saved evaluation history"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>History</span>
          </button>

          <button
            onClick={() => setCurrentView('form')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROFILE SUMMARY & 3-TIER RISK CARDS                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Profile Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3.5 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
              Candidate Benchmark
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl sm:text-4xl font-black font-mono text-white">{studentProfile?.cutoff || '187.5'}</span>
              <span className="text-sm font-mono text-slate-400">/ 200</span>
            </div>
            <span className="text-xs text-slate-400 block mt-0.5">TNEA Normalized Score</span>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between"><span>Quota:</span><strong className="text-white font-mono">{studentProfile?.category || 'BC'}</strong></div>
            <div className="flex justify-between"><span>District:</span><strong className="text-white">{studentProfile?.location || 'Tamil Nadu'}</strong></div>
            <div className="flex justify-between"><span>Branches:</span><strong className="text-white truncate max-w-[130px]">{studentProfile?.courses?.join(', ') || 'Engineering'}</strong></div>
          </div>
        </div>

        {/* Safe Tier Count */}
        <div 
          onClick={() => setActiveTab('safe')}
          className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
            activeTab === 'safe' 
              ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20' 
              : 'border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Safe Tier</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-700">{summary?.safeCount ?? 0}</span>
            <span className="text-xs text-slate-600 block font-medium mt-1">Strong safety margin (Δ ≥ +2.0)</span>
          </div>
          <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
            <span>Filter Safe Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Moderate Tier Count */}
        <div 
          onClick={() => setActiveTab('moderate')}
          className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
            activeTab === 'moderate' 
              ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-500/20' 
              : 'border-amber-200/90 bg-amber-50/40 hover:bg-amber-50/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Moderate Tier</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black font-mono text-amber-700">{summary?.moderateCount ?? 0}</span>
            <span className="text-xs text-slate-600 block font-medium mt-1">Realistic target range (Δ: -3.0 to +2.0)</span>
          </div>
          <span className="text-xs text-amber-700 font-bold flex items-center space-x-1">
            <span>Filter Moderate Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Ambitious Tier Count */}
        <div 
          onClick={() => setActiveTab('ambitious')}
          className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
            activeTab === 'ambitious' 
              ? 'border-rose-500 bg-rose-50/80 shadow-xs ring-2 ring-rose-500/20' 
              : 'border-rose-200/90 bg-rose-50/40 hover:bg-rose-50/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Ambitious Tier</span>
            <AlertCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="my-3">
            <span className="text-3xl sm:text-4xl font-black font-mono text-rose-700">{summary?.ambitiousCount ?? 0}</span>
            <span className="text-xs text-slate-600 block font-medium mt-1">Aspirational reach (Cutoff deficit Δ &lt; -3.0)</span>
          </div>
          <span className="text-xs text-rose-700 font-bold flex items-center space-x-1">
            <span>Filter Ambitious Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. AI STRATEGY & COUNSEL ADVISORY CARD                                     */}
      {/* ========================================================================= */}
      {aiExplanation && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  CounselAI Admission Guidance
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Counselling Strategy & Optimization</h3>
              </div>
            </div>
            <span className="hidden sm:inline text-xs font-mono text-slate-400 font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Grounded in Database Benchmarks
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80">
            {aiExplanation}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              onClick={() => setShowChoiceSheet(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-2 transition"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Generate TNEA Choice List</span>
            </button>

            <button
              onClick={() => setCurrentView('chat')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-2 transition shadow-xs"
            >
              <Bot className="w-4 h-4" />
              <span>Discuss Strategy with CounselAI</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RECOMMENDATIONS TOOLBAR & CARDS GRID                                   */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recommended for You</h3>
            <p className="text-xs text-slate-500 font-normal">
              Matched institutions and specializations scored against official TNEA historical admission cutoff data
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="score">Suitability Match Score (High → Low)</option>
                <option value="delta">Cutoff Delta (Highest Buffer First)</option>
                <option value="nirf">NIRF Ranking (Top Ranked First)</option>
                <option value="placement">Placement Record (High → Low)</option>
                <option value="fee">Annual Tuition Fee (Lowest First)</option>
              </select>
            </div>

            {/* Classification Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              {[
                { id: 'all', label: `All (${summary.totalMatches})` },
                { id: 'safe', label: `Safe (${summary.safeCount})` },
                { id: 'moderate', label: `Moderate (${summary.moderateCount})` },
                { id: 'ambitious', label: `Ambitious (${summary.ambitiousCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-indigo-600 font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {sortedRecommendations.length === 0 ? (
          <div className="bg-white p-14 text-center rounded-3xl border border-slate-200/90 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-900 text-sm font-bold">No institutions found matching the selected tier.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching back to the "All" tab or the "Safe" tier to review available matches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRecommendations.map((college, idx) => (
              <CollegeCard
                key={idx}
                college={college}
                onSelectDetail={onSelectDetail}
                onAddToCompare={handleAddToCompare}
                isCompared={comparedColleges.some(c => c.id === college.college_id)}
                onAskAI={() => {
                  setCurrentView('chat');
                }}
              />
            ))}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 5. FLOATING COMPARISON DOCK                                               */}
      {/* ========================================================================= */}
      {comparedColleges.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-elevated border border-slate-800 flex items-center space-x-4 max-w-md w-full">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
              Comparison Queue ({comparedColleges.length}/3)
            </span>
            <div className="flex items-center space-x-1.5 text-xs truncate mt-0.5">
              {comparedColleges.map((c, i) => (
                <span key={i} className="bg-slate-800 px-2 py-0.5 rounded-md text-slate-300 font-mono text-[11px]">
                  {c.code}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCurrentView('compare')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Now</span>
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
