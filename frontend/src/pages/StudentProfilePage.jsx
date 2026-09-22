import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  MapPin, 
  IndianRupee, 
  BookOpen, 
  Heart, 
  RotateCcw, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  Sparkles, 
  RefreshCw, 
  PlusCircle,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { fetchAnalysisHistory } from '../services/api';

export default function StudentProfilePage({ 
  activeProfile, 
  analysisData, 
  studentId, 
  setCurrentView, 
  onSelectHistoricalAnalysis,
  onClearSession 
}) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [reopeningId, setReopeningId] = useState(null);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const res = await fetchAnalysisHistory();
      if (res && res.success && Array.isArray(res.history)) {
        setHistory(res.history);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to load analysis history:', err);
      setHistoryError(err.message || 'Failed to load historical analyses');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleReopen = async (id) => {
    try {
      setReopeningId(id);
      if (onSelectHistoricalAnalysis) {
        await onSelectHistoricalAnalysis(id);
      }
    } catch (err) {
      console.error('Failed to reopen analysis:', err);
      alert('Failed to reopen analysis: ' + err.message);
    } finally {
      setReopeningId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ========================================================================= */}
      {/* SECTION 1: ACTIVE PROFILE OR NO-ACTIVE-PROFILE BANNER                     */}
      {/* ========================================================================= */}
      {activeProfile ? (
        <div className="space-y-6">
          {/* Top Dossier Header */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E3DD] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0A0B0E] text-[#C5A25D] font-serif font-bold text-2xl flex items-center justify-center border border-[#1C202C] shadow-sm shrink-0">
                {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-serif font-bold text-[#0A0B0E] tracking-tight">{activeProfile.name || 'Candidate Dossier'}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EDF7ED] text-[#1E7245] border border-[#C6E7C6] text-[10px] font-mono font-bold uppercase tracking-wider">
                    Active Session
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6B7280] tracking-wide">TNEA Engineering Admission Dossier</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {analysisData && (
                <button
                  onClick={() => setCurrentView('results')}
                  className="px-4 py-2.5 rounded-xl bg-[#0A0B0E] hover:bg-[#1C202C] text-white text-xs font-medium flex items-center space-x-2 shadow-sm transition border border-[#1C202C]"
                >
                  <span>Return to Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A25D]" />
                </button>
              )}

              <button
                onClick={() => setCurrentView('form')}
                className="px-3.5 py-2.5 rounded-xl border border-[#E5E3DD] hover:bg-[#FAF9F5] text-xs font-medium text-[#3A3F50] flex items-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Recalibrate / New</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E5E3DD] space-y-1 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block font-medium">12th Standard Cutoff</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-mono font-bold text-[#0A0B0E]">{activeProfile.cutoff}</span>
                <span className="text-sm font-mono text-[#6B7280]">/ 200</span>
              </div>
              <span className="text-xs text-[#6B7280] block">Official TNEA Mathematics + Science Formula</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E5E3DD] space-y-1 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block font-medium">Reservation Quota</span>
              <span className="text-3xl font-mono font-bold text-[#0A0B0E] block">{activeProfile.category}</span>
              <span className="text-xs text-[#6B7280] block">Community Reservation Category</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E5E3DD] space-y-1 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] block font-medium">Preferred District</span>
              <span className="text-3xl font-serif font-bold text-[#0A0B0E] block truncate">{activeProfile.location || 'Coimbatore'}</span>
              <span className="text-xs text-[#6B7280] block">Geographic Preference Baseline</span>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E3DD] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#0A0B0E]">Preferences & Parameters</h3>
              {analysisData && (
                <button
                  onClick={() => setCurrentView('results')}
                  className="text-xs font-mono font-semibold text-[#C5A25D] hover:text-[#0A0B0E] flex items-center space-x-1 transition"
                >
                  <span>Open Evaluated Results</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start space-x-3 p-4 bg-[#FAF9F5] border border-[#E5E3DD] rounded-xl">
                <BookOpen className="w-4 h-4 text-[#C5A25D] mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B7280] block mb-1">Target Engineering Branches</span>
                  <span className="font-medium text-[#0A0B0E] text-sm">{activeProfile.courses?.join(', ') || 'ECE'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[#FAF9F5] border border-[#E5E3DD] rounded-xl">
                <IndianRupee className="w-4 h-4 text-[#996D19] mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B7280] block mb-1">Annual Fee Ceiling</span>
                  <span className="font-medium text-[#0A0B0E] text-sm">
                    {activeProfile.budget ? `₹${activeProfile.budget.toLocaleString('en-IN')}` : 'Unconstrained'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-[#FAF9F5] border border-[#E5E3DD] rounded-xl">
                <Heart className="w-4 h-4 text-[#A82B2B] mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B7280] block mb-1">Candidate Domain Focus</span>
                  <span className="font-medium text-[#0A0B0E] text-sm">{activeProfile.interests?.join(', ') || 'General Engineering'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Informational banner when no profile is active in local session */
        <div className="bg-[#0A0B0E] border border-[#1C202C] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3DE]/10 text-[#C5A25D] border border-[#C5A25D]/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                Candidate Admission Portal
              </span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">No Active Assessment in Current Session</h2>
            <p className="text-xs text-[#8E95A5] max-w-xl leading-relaxed">
              You can reopen any previously calculated admission evaluation from your archive below, or initiate a new strategic assessment using the intake wizard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('form')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#0A0B0E] text-xs font-semibold shadow-sm flex items-center space-x-2 transition border border-white"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A25D]" />
              <span>Initiate New Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ADMISSION ANALYSIS HISTORY SECTION                             */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4 border-t border-[#E5E3DD]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FAF3DE] text-[#996D19] border border-[#EADBAC] flex items-center justify-center font-bold">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#0A0B0E]">Admission Evaluation Archive</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#3A3F50] text-xs font-mono font-medium border border-[#E5E3DD]">
                {history.length} Saved Records
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Access and reload previously calculated counselling evaluations stored in your MySQL database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={loadingHistory}
              className="px-3 py-2 rounded-xl border border-[#E5E3DD] hover:bg-[#FAF9F5] text-xs font-medium text-[#3A3F50] flex items-center space-x-1.5 transition disabled:opacity-50"
              title="Refresh history from MySQL database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#6B7280] ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 rounded-xl bg-[#0A0B0E] hover:bg-[#1C202C] text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition border border-[#1C202C]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C5A25D]" />
              <span>New Intake</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loadingHistory && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#E5E3DD] animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-5 bg-slate-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-8 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loadingHistory && historyError && (
          <div className="bg-[#FAF9F5] border border-[#EADBAC] p-6 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#A82B2B] mx-auto" />
            <h4 className="text-sm font-serif font-bold text-[#0A0B0E]">Failed to Retrieve Archive</h4>
            <p className="text-xs text-[#6B7280]">{historyError}</p>
            <button
              onClick={loadHistory}
              className="px-4 py-2 rounded-xl bg-[#0A0B0E] text-white text-xs font-medium hover:bg-[#1C202C] transition border border-[#1C202C]"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingHistory && !historyError && history.length === 0 && (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#E5E3DD] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DD] text-[#C5A25D] flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-serif font-bold text-[#0A0B0E]">No Previous Analyses Found</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                You haven't generated any counselling evaluations yet. Complete your first candidate intake to establish your admissions history ledger.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('form')}
              className="px-6 py-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1C202C] text-white text-xs font-medium shadow-sm transition border border-[#1C202C]"
            >
              Start First Analysis
            </button>
          </div>
        )}

        {/* History List */}
        {!loadingHistory && !historyError && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => {
              const isCurrentActive = studentId && item.id === studentId;
              const isReopening = reopeningId === item.id;
              const hasRecs = item.recommendation_count > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isCurrentActive 
                      ? 'border-[#C5A25D] ring-2 ring-[#C5A25D]/20 bg-[#FAF9F5]/40' 
                      : 'border-[#E5E3DD] hover:border-[#C5A25D]/40'
                  }`}
                >
                  {/* Left Column: Student Details & Metrics */}
                  <div className="space-y-3 flex-1 min-w-0">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0A0B0E] text-[#C5A25D] font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-[#1C202C]">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'S'}
                      </div>

                      <h3 className="font-serif font-bold text-[#0A0B0E] text-base truncate">
                        {item.name || 'Candidate Dossier'}
                      </h3>

                      <span className="text-[11px] font-mono text-[#6B7280]">
                        • ID #{item.id}
                      </span>

                      {isCurrentActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0A0B0E] text-[#C5A25D] border border-[#1C202C] text-[10px] font-mono font-bold flex items-center space-x-1 shadow-xs">
                          <Sparkles className="w-3 h-3 text-[#C5A25D]" />
                          <span>Currently Active</span>
                        </span>
                      )}

                      <span className="text-xs font-mono text-[#6B7280] flex items-center ml-auto sm:ml-0">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-[#C5A25D]" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {/* Criteria Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Cutoff */}
                      <span className="px-2.5 py-1 rounded-lg bg-[#FAF3DE] text-[#996D19] font-mono font-bold border border-[#EADBAC] flex items-center space-x-1">
                        <span>Cutoff:</span>
                        <span className="text-[#0A0B0E] font-bold">{item.cutoff}</span>
                        <span className="text-[#996D19] font-normal">/200</span>
                      </span>

                      {/* Category */}
                      <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-[#3A3F50] font-mono font-medium border border-[#E5E3DD]">
                        Category: {item.category || 'General'}
                      </span>

                      {/* Location */}
                      <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-[#3A3F50] font-medium border border-[#E5E3DD] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-[#6B7280]" />
                        <span>{item.preferred_location || item.location || 'Coimbatore'}</span>
                      </span>

                      {/* Courses */}
                      <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-[#3A3F50] font-medium border border-[#E5E3DD] flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-[#6B7280]" />
                        <span className="truncate max-w-[200px]">
                          {Array.isArray(item.preferred_courses) && item.preferred_courses.length > 0
                            ? item.preferred_courses.join(', ')
                            : 'ECE'}
                        </span>
                      </span>

                      {/* Budget */}
                      {item.budget && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] text-[#3A3F50] font-mono font-medium border border-[#E5E3DD] flex items-center space-x-1">
                          <IndianRupee className="w-3 h-3 text-[#6B7280]" />
                          <span>₹{item.budget.toLocaleString('en-IN')}/yr</span>
                        </span>
                      )}
                    </div>

                    {/* Recommendation Tier Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-mono font-semibold text-[#6B7280] uppercase tracking-wider">
                        Recommendations:
                      </span>

                      {hasRecs ? (
                        <>
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#0A0B0E] text-[11px] font-mono font-bold border border-[#E5E3DD]">
                            {item.recommendation_count} Total
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-[#EDF7ED] text-[#1E7245] border border-[#C6E7C6] text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.safe_count} Safe</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-[#FAF3DE] text-[#996D19] border border-[#EADBAC] text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{item.moderate_count} Moderate</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-[#FDF2F2] text-[#A82B2B] border border-[#F5C2C2] text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <HelpCircle className="w-3 h-3" />
                            <span>{item.ambitious_count} Ambitious</span>
                          </span>
                        </>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#6B7280] text-[11px] font-mono border border-[#E5E3DD]">
                          Profile logged without saved recommendations
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#E5E3DD]">
                    {isCurrentActive ? (
                      <button
                        onClick={() => setCurrentView('results')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0A0B0E] hover:bg-[#1C202C] text-white text-xs font-medium shadow-sm flex items-center justify-center space-x-1.5 transition border border-[#1C202C]"
                      >
                        <span>Return to Results</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A25D]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(item.id)}
                        disabled={isReopening}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 shadow-xs transition ${
                          hasRecs
                            ? 'bg-[#0A0B0E] hover:bg-[#1C202C] text-white border border-[#1C202C]'
                            : 'bg-[#FAF9F5] hover:bg-[#E5E3DD] text-[#3A3F50] border border-[#E5E3DD]'
                        }`}
                      >
                        {isReopening ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A25D]" />
                            <span className="font-mono">Loading Stored Recs...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A25D]" />
                            <span>{hasRecs ? 'Reopen Analysis' : 'Load Profile'}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8E95A5]" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}

