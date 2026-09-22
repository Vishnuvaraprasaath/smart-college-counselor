import React, { useEffect, useState } from 'react';
import { fetchCollegeById } from '../services/api';
import CutoffChart from '../components/CutoffChart';
import SuitabilityBreakdown from '../components/SuitabilityBreakdown';
import { MapPin, Building2, Award, IndianRupee, Globe, ArrowLeft, Bot, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#111318] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="text-neutral-500 text-xs font-mono font-medium">Retrieving institutional dossier records...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-[#A82B2B] text-sm font-semibold">Failed to load institutional records: {error}</p>
        <button 
          onClick={onBack} 
          className="px-5 py-2.5 bg-[#111318] hover:bg-[#202534] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-[#DCD7CB] text-neutral-700 text-xs font-semibold hover:bg-[#FAF8F5] flex items-center space-x-2 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView('chat')}
          className="px-4 py-2 rounded-xl bg-[#111318] hover:bg-[#202534] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-sm transition"
        >
          <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Query CounselAI</span>
        </button>
      </div>

      {/* Hero College Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#111318] text-[#D4AF37] font-mono font-bold text-xs rounded-md">
                TNEA Code: {college.code}
              </span>
              <span className="text-xs text-neutral-500 font-normal">{college.type}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight leading-tight">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 font-normal">
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-neutral-400" />{college.city}, {college.district}</span>
              <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#1E7245]" />{college.accreditation}</span>
              <span className="flex items-center"><Award className="w-3.5 h-3.5 mr-1 text-[#8A7139]" />NIRF Rank #{college.ranking || 'N/A'}</span>
            </div>
          </div>

          <div className="p-5 bg-[#FAF9F5] rounded-2xl border border-[#EAE6DD] text-right shrink-0">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">Annual Tuition</span>
            <span className="text-2xl font-black font-mono text-[#111318]">₹{college.fees ? college.fees.toLocaleString('en-IN') : 'N/A'}</span>
            <span className="text-[11px] font-mono text-neutral-500 block font-normal mt-0.5">Hostel: ₹{college.hostel_fee ? college.hostel_fee.toLocaleString('en-IN') : 'N/A'}/yr</span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#F0ECE1] text-center font-mono">
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
            <span className="block text-xl font-black text-[#111318]">{college.placement_rate || 92}%</span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Placement Rate</span>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
            <span className="block text-xl font-black text-[#1E7245]">₹{college.avg_package || 7.5} LPA</span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Average Package</span>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
            <span className="block text-xl font-black text-[#111318]">{courses.length}</span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Engineering Programs</span>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
            <span className="block text-xl font-black text-[#8A7139]">{college.hostel_available ? 'Available' : 'N/A'}</span>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Hostel Facility</span>
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-5">
        <h3 className="text-xl font-extrabold text-[#111318] tracking-tight">Accredited Engineering Branches</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((crs, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-[#EAE6DD] bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#111318] text-[#D4AF37] rounded">
                  {crs.course_code}
                </span>
                <span className="text-xs font-mono font-semibold text-neutral-600">{crs.seats || 120} Approved Seats</span>
              </div>
              <h4 className="font-bold text-[#111318] text-base">{crs.course_name}</h4>
              <p className="text-xs text-neutral-500 font-normal line-clamp-2">{crs.description}</p>
              <div className="pt-1.5 text-[11px] text-neutral-400 font-normal">
                Academic Requirement: {crs.eligibility || '50% PCM in 12th standard'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities & Campus Overview */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-xl font-extrabold text-[#111318] tracking-tight">Campus Infrastructure & Facilities</h3>
        <p className="text-xs text-neutral-600 leading-relaxed font-normal">
          {college.facilities || 'Advanced Research Laboratories, High performance computing centers, modern hostels, sports complexes, and active industry incubation hubs.'}
        </p>
        {college.website && (
          <a
            href={college.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8A7139] hover:text-[#111318] pt-2 transition underline underline-offset-2"
          >
            <Globe className="w-4 h-4 text-[#8A7139]" />
            <span>Visit Official Institution Portal ({college.website})</span>
          </a>
        )}
      </div>

    </div>
  );
}

