import React, { useEffect, useState } from 'react';
import { fetchCourses, fetchCourseById } from '../services/api';
import { BookOpen, Award, Briefcase, Cpu, CheckCircle2, ChevronRight, Building2, Sparkles } from 'lucide-react';

export default function CourseExplorerPage({ onSelectDetail }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses().then(res => {
      setCourses(res.courses || []);
      if (res.courses && res.courses.length > 0) {
        setSelectedCourse(res.courses[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    fetchCourseById(selectedCourse).then(res => {
      setCourseDetail(res);
    });
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#111318] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        <p className="text-neutral-500 text-xs font-mono">Loading engineering branch intelligence...</p>
      </div>
    );
  }

  const activeCourse = courseDetail?.course || {};
  const offeringColleges = courseDetail?.offeringColleges || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A7139] uppercase bg-[#FAF8F2] px-2.5 py-0.5 rounded border border-[#EBE4D5]">
            Curriculum & Career Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight mt-1.5">
          Engineering Disciplines & Industry Trajectories
        </h1>
        <p className="text-xs text-neutral-500 font-normal mt-0.5">
          Explore branch specializations, essential technical competencies, hiring industries, and higher education paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Course List Sidebar */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-1.5 h-fit">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 px-3 py-2">
            Engineering Branches
          </h3>
          {courses.map((crs) => {
            const isSelected = selectedCourse === crs.id;
            return (
              <button
                key={crs.id}
                onClick={() => setSelectedCourse(crs.id)}
                className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs transition-all duration-200 flex items-center justify-between ${
                  isSelected 
                    ? 'bg-[#111318] text-white font-bold shadow-sm' 
                    : 'text-neutral-700 hover:bg-[#FAF8F5] font-medium'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-[#D4AF37]' : 'text-neutral-500'}`}>
                    {crs.code}
                  </span>
                  <span className="truncate">{crs.name}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-neutral-300'}`} />
              </button>
            );
          })}
        </div>

        {/* Course Detail Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeCourse.name && (
            <>
              {/* Main Course Header Card */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-[#111318] text-[#D4AF37] text-xs font-mono font-bold rounded-lg">
                    {activeCourse.code}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111318] tracking-tight">{activeCourse.name}</h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">{activeCourse.overview || activeCourse.description}</p>
              </div>

              {/* Skills & Careers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Core Skills Required */}
                <div className="bg-white p-6 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#8A7139]">
                    <Cpu className="w-4 h-4" />
                    <h3 className="font-bold text-[#111318] text-sm">Essential Competencies & Skills</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">{activeCourse.skills}</p>
                </div>

                {/* Typical Job Roles & Careers */}
                <div className="bg-white p-6 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#1E7245]">
                    <Briefcase className="w-4 h-4" />
                    <h3 className="font-bold text-[#111318] text-sm">Target Roles & Career Paths</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">{activeCourse.careers}</p>
                </div>

              </div>

              {/* Relevant Industries */}
              <div className="bg-[#111318] text-white p-6 sm:p-7 rounded-3xl shadow-sm space-y-2 border border-[#232734]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Market Sectors</span>
                <h4 className="font-bold text-base text-white">Primary Employing Industry Segments</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-normal">{activeCourse.industries}</p>
              </div>

              {/* Colleges Offering This Program */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
                <h3 className="text-lg font-extrabold text-[#111318] tracking-tight">Accredited Colleges Offering {activeCourse.code}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {offeringColleges.map((col, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => onSelectDetail && onSelectDetail(col.id)}
                      className={`p-4 rounded-2xl border border-[#EAE6DD] bg-[#FAF9F5] flex items-center justify-between transition-all duration-200 ${
                        onSelectDetail ? 'cursor-pointer hover:border-[#C5A25D] hover:bg-[#FAF8F2] group' : ''
                      }`}
                      title="View college details"
                    >
                      <div>
                        <h4 className="font-bold text-[#111318] text-sm group-hover:text-[#8A7139] transition-colors">{col.name}</h4>
                        <span className="text-[11px] text-neutral-500 font-normal">{col.city} • NIRF #{col.ranking || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-[#111318] bg-white px-2.5 py-1 rounded-lg border border-[#E8E5DD]">
                          {col.seats || 120} Seats
                        </span>
                        {onSelectDetail && (
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#111318] group-hover:translate-x-0.5 transition-all" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
}

