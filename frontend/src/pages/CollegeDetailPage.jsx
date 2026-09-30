import React, { useEffect, useState } from 'react';
import { fetchCollegeById } from '../services/api';
import CutoffChart from '../components/CutoffChart';
import SuitabilityBreakdown from '../components/SuitabilityBreakdown';
import { 
  MapPin, 
  Building2, 
  Award, 
  IndianRupee, 
  Globe, 
  ArrowLeft, 
  Bot, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  ArrowRight,
  GitCompare,
  TrendingUp
} from 'lucide-react';

export default function CollegeDetailPage({ collegeId, activeProfile, onBack, setCurrentView }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentCutoff = activeProfile?.cutoff || 187.5;
  const category = activeProfile?.category || 'BC';

  useEffect(() => {
    if (!collegeId) return;
    setLoading(true);
    fetchCollegeById(collegeId, studentCutoff, category)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [collegeId, studentCutoff, category]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-xs font-mono font-medium">Retrieving verified institutional dossier records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-rose-600 text-sm font-semibold">Failed to load institutional records: {error}</p>
        <button 
          onClick={onBack} 
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const { college, courses, cutoffTrendsByCourse } = data;
  const courseCode = Object.keys(cutoffTrendsByCourse)[0] || 'ECE';
  const cutoffTrendList = cutoffTrendsByCourse[courseCode] || [];

  const primaryCourse = courses?.[0] || {};
  const currentCourseCode = courseCode || primaryCourse.course_code || 'ECE';
  const latestCutoffItem = cutoffTrendList[cutoffTrendList.length - 1] || {};
  const histCutoff = latestCutoffItem.cutoff != null ? latestCutoffItem.cutoff : 185;
  const cutoffDelta = Math.round((parseFloat(studentCutoff) - histCutoff) * 100) / 100;
  let cutoffScore = Math.max(0, Math.min(100, Math.round(85 + (cutoffDelta * 3.5))));

  const collegeForBreakdown = {
    ...college,
    college_name: college.name,
    course_name: primaryCourse.course_name || currentCourseCode,
    course_code: currentCourseCode,
    student_cutoff: parseFloat(studentCutoff),
    historical_cutoff: histCutoff,
    cutoff_delta: cutoffDelta,
    suitability_score: Math.round(
      (cutoffScore * 0.55) + (100 * 0.15) + (100 * 0.10) + (100 * 0.10) + (85 * 0.05) + (90 * 0.05)
    ),
    fit_breakdown: {
      cutoff_fit: cutoffScore,
      course_fit: 100,
      location_fit: 100,
      budget_fit: 100,
      quality_fit: 85,
      interest_fit: 90
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center space-x-2 transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView('chat')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition"
        >
          <Bot className="w-3.5 h-3.5 text-white" />
          <span>Query CounselAI</span>
        </button>
      </div>

      {/* Hero College Header Card */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-lg border border-indigo-200/60">
                TNEA Code: {college.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{college.type}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {college.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {college.city}, {college.district}
              </span>
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {college.accreditation}
              </span>
              <span className="flex items-center">
                <Award className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                NIRF Rank #{college.ranking || 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left md:text-right shrink-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Annual Tuition</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
              ₹{college.fees ? college.fees.toLocaleString('en-IN') : 'N/A'}
            </span>
            <span className="text-xs font-mono text-slate-500 block font-normal mt-0.5">
              Hostel: ₹{college.hostel_fee ? college.hostel_fee.toLocaleString('en-IN') : 'N/A'}/yr
            </span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-slate-100 text-center font-mono">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="block text-2xl font-black text-slate-900">{college.placement_rate || 92}%</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Placement Rate</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="block text-2xl font-black text-emerald-600">₹{college.avg_package || 7.5} LPA</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Average CTC</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="block text-2xl font-black text-indigo-600">{courses.length}</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Engineering Programs</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="block text-2xl font-black text-slate-900">{college.hostel_available ? 'Available' : 'N/A'}</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Hostel Facility</span>
          </div>
        </div>
      </div>

      {/* Grid: Cutoff Trend Chart & Suitability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cutoff Chart */}
        <div className="lg:col-span-2">
          <CutoffChart 
            data={cutoffTrendList} 
            studentCutoff={studentCutoff} 
            title={`Historical Admission Cutoffs • ${courseCode} (${category} Quota)`} 
          />
        </div>

        {/* Suitability Breakdown Component */}
        <div className="lg:col-span-1">
          <SuitabilityBreakdown college={collegeForBreakdown} />
        </div>

      </div>

      {/* Offered Courses & Seat Matrix */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Accredited Engineering Branches</h3>
          <p className="text-xs text-slate-500 font-normal">Programs approved by AICTE and affiliated to Anna University</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((crs, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200/60">
                  {crs.course_code}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">{crs.seats || 120} Approved Seats</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">{crs.course_name}</h4>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">{crs.description}</p>
              <div className="pt-2 text-[11px] text-slate-400 font-normal border-t border-slate-200/60">
                Academic Requirement: {crs.eligibility || '50% PCM in 12th standard'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities & Campus Overview */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Campus Infrastructure & Facilities</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {college.facilities || 'Advanced Research Laboratories, High performance computing centers, modern hostels, sports complexes, and active industry incubation hubs.'}
        </p>
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2 transition underline underline-offset-4"
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Visit Official Institution Portal ({college.website})</span>
          </a>
        )}
      </div>

    </div>
  );
}
