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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* ========================================================================= */}
      {/* SECTION 1: ACTIVE PROFILE OR NO-ACTIVE-PROFILE BANNER                     */}
      {/* ========================================================================= */}
      {activeProfile ? (
        <div className="space-y-6">
          {/* Top Dossier Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {activeProfile.name || 'Candidate Dossier'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Active Session
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 tracking-wide">
                  TNEA Engineering Admission Dossier
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {analysisData && (
                <button
                  onClick={() => setCurrentView('results')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition"
                >
                  <span>Return to Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setCurrentView('form')}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Recalibrate / New</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-card">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">12th Standard Cutoff</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-mono font-black text-slate-900">{activeProfile.cutoff}</span>
                <span className="text-sm font-mono text-slate-400">/ 200</span>
              </div>
              <span className="text-xs text-slate-500 block">Normalized TNEA Score Formula</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-card">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Reservation Quota</span>
              <span className="text-3xl font-mono font-black text-slate-900 block">{activeProfile.category}</span>
              <span className="text-xs text-slate-500 block">Community Reservation Quota</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-1 shadow-card">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Preferred District</span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 block truncate">{activeProfile.location || 'Coimbatore'}</span>
              <span className="text-xs text-slate-500 block">Geographic Preference Baseline</span>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Preferences & Parameters</h3>
              {analysisData && (
                <button
                  onClick={() => setCurrentView('results')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 transition"
                >
                  <span>Open Evaluated Results</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <BookOpen className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">
                    Target Engineering Branches
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{activeProfile.courses?.join(', ') || 'ECE'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <IndianRupee className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">
                    Annual Fee Ceiling
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeProfile.budget ? `₹${activeProfile.budget.toLocaleString('en-IN')}` : 'Unconstrained'}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <Heart className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 block mb-1 font-bold">
                    Candidate Domain Focus
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{activeProfile.interests?.join(', ') || 'General Engineering'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Informational banner when no active session */
        <div className="bg-white border border-slate-200/90 p-7 sm:p-9 rounded-3xl shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-[10px] font-mono font-bold uppercase tracking-wider">
                Candidate Admission Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No Active Assessment in Current Session</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              You can reopen any previously calculated admission evaluation from your archive below, or initiate a new assessment using the intake wizard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('form')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Initiate New Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ADMISSION ANALYSIS HISTORY ARCHIVE                             */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4 border-t border-slate-200/80">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center font-bold">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admission Evaluation Archive</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                {history.length} Saved Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Access and reload previously calculated counselling evaluations stored in your database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadHistory}
              disabled={loadingHistory}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition disabled:opacity-50"
              title="Refresh history"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loadingHistory ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Intake</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loadingHistory && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 animate-pulse space-y-4">
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
          <div className="bg-slate-50 border border-slate-200 p-7 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Failed to Retrieve Archive</h4>
            <p className="text-xs text-slate-500">{historyError}</p>
            <button
              onClick={loadHistory}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingHistory && !historyError && history.length === 0 && (
          <div className="bg-white p-14 text-center rounded-3xl border border-slate-200/90 shadow-card space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-900">No Previous Analyses Found</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You haven't generated any counselling evaluations yet. Complete your first candidate intake to establish your admissions history ledger.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('form')}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              Start First Analysis
            </button>
          </div>
        )}

        {/* History Records List */}
        {!loadingHistory && !historyError && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => {
              const isCurrentActive = studentId && item.id === studentId;
              const isReopening = reopeningId === item.id;
              const hasRecs = item.recommendation_count > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-card hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isCurrentActive 
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-indigo-50/20' 
                      : 'border-slate-200/90'
                  }`}
                >
                  {/* Left Column: Student Details & Metrics */}
                  <div className="space-y-3 flex-1 min-w-0">
                    
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200/60">
                        {item.name ? item.name.charAt(0).toUpperCase() : 'S'}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {item.name || 'Candidate Dossier'}
                      </h3>

                      <span className="text-xs font-mono text-slate-400">
                        • ID #{item.id}
                      </span>

                      {isCurrentActive && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold flex items-center space-x-1 shadow-xs">
                          <Sparkles className="w-3 h-3 text-white" />
                          <span>Currently Active</span>
                        </span>
                      )}

                      <span className="text-xs font-mono text-slate-400 flex items-center ml-auto sm:ml-0">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {/* Criteria Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Cutoff */}
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200/60 flex items-center space-x-1">
                        <span>Cutoff:</span>
                        <span className="text-slate-900 font-black">{item.cutoff}</span>
                        <span className="text-indigo-400 font-normal">/200</span>
                      </span>

                      {/* Category */}
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-mono font-semibold border border-slate-200">
                        Quota: {item.category || 'General'}
                      </span>

                      {/* Location */}
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.preferred_location || item.location || 'Coimbatore'}</span>
                      </span>

                      {/* Courses */}
                      <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-medium border border-slate-200 flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[200px]">
                          {Array.isArray(item.preferred_courses) && item.preferred_courses.length > 0
                            ? item.preferred_courses.join(', ')
                            : 'ECE'}
                        </span>
                      </span>

                      {/* Budget */}
                      {item.budget && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-mono font-medium border border-slate-200 flex items-center space-x-1">
                          <IndianRupee className="w-3 h-3 text-slate-400" />
                          <span>₹{item.budget.toLocaleString('en-IN')}/yr</span>
                        </span>
                      )}
                    </div>

                    {/* Recommendation Tier Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Matched:
                      </span>

                      {hasRecs ? (
                        <>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-mono font-bold border border-slate-200">
                            {item.recommendation_count} Total
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.safe_count} Safe</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{item.moderate_count} Moderate</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-mono font-semibold flex items-center space-x-1">
                            <HelpCircle className="w-3 h-3" />
                            <span>{item.ambitious_count} Ambitious</span>
                          </span>
                        </>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[11px] font-mono border border-slate-200">
                          Profile logged without saved recommendations
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {isCurrentActive ? (
                      <button
                        onClick={() => setCurrentView('results')}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition"
                      >
                        <span>Return to Results</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(item.id)}
                        disabled={isReopening}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-xs transition ${
                          hasRecs
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isReopening ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                            <span className="font-mono">Loading Dossier...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{hasRecs ? 'Reopen Analysis' : 'Load Profile'}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
