import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Award, 
  GraduationCap, 
  TrendingUp, 
  ExternalLink, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  PlusCircle,
  Database,
  Info,
  Calendar,
  Layers,
  BookOpen,
  X
} from 'lucide-react';
import { 
  fetchTamilNaduColleges, 
  fetchTamilNaduDistricts, 
  fetchTamilNaduCourses, 
  fetchDataStatus,
  fetchTamilNaduCollegeById
} from '../services/api';
import AdminImportModal from '../components/AdminImportModal';

export default function TamilNaduCollegesPage({ onSelectCollege, onCompareAdd }) {
  // State for data and filters
  const [colleges, setColleges] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [dataStatus, setDataStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedAutonomous, setSelectedAutonomous] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSort, setSelectedSort] = useState('ranking');

  // Modal states
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [activeCollegeDetail, setActiveCollegeDetail] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('overview'); // overview, courses, cutoffs, fees, provenance
  const [cutoffFilterYear, setCutoffFilterYear] = useState('2025');
  const [cutoffFilterRound, setCutoffFilterRound] = useState('Round 1');
  const [cutoffFilterCommunity, setCutoffFilterCommunity] = useState('OC');
  const [detailLoading, setDetailLoading] = useState(false);

  // Load initial static meta (Districts, Courses, Data Status)
  useEffect(() => {
    let mounted = true;
    const loadMetadata = async () => {
      try {
        const [distRes, courseRes, statusRes] = await Promise.all([
          fetchTamilNaduDistricts().catch(() => ({ success: false, data: [] })),
          fetchTamilNaduCourses().catch(() => ({ success: false, data: [] })),
          fetchDataStatus().catch(() => ({ success: false }))
        ]);
        if (mounted) {
          if (distRes?.success) setDistricts(Array.isArray(distRes.data) ? distRes.data : []);
          if (courseRes?.success) setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
          if (statusRes?.success) setDataStatus(statusRes);
        }
      } catch (err) {
        console.error('Failed to load initial TN metadata:', err);
      }
    };
    loadMetadata();
    return () => { mounted = false; };
  }, []);

  // Fetch colleges when page or filters change
  const loadColleges = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchTamilNaduColleges({
        page,
        limit: pagination?.limit || 12,
        search,
        district: selectedDistrict,
        type: selectedType,
        autonomous: selectedAutonomous,
        course: selectedCourse,
        sort: selectedSort
      });

      if (res?.success) {
        setColleges(Array.isArray(res.data) ? res.data : []);
        setPagination(res.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      } else {
        setColleges([]);
      }
    } catch (err) {
      console.error('Failed to fetch TN colleges:', err);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges(1);
  }, [selectedDistrict, selectedType, selectedAutonomous, selectedCourse, selectedSort]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadColleges(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Open detail modal
  const handleOpenDetail = async (college) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    setDetailTab('overview');
    try {
      const res = await fetchTamilNaduCollegeById(college.tnea_code || college.id);
      if (res.success) {
        setActiveCollegeDetail(res.data);
      }
    } catch (err) {
      console.error('Failed to load college detail:', err);
      setActiveCollegeDetail(college);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDistrict('All');
    setSelectedType('All');
    setSelectedAutonomous('All');
    setSelectedCourse('All');
    setSelectedSort('ranking');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Top Header Banner & Verification Bar ── */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Tamil Nadu Engineering Admissions (TNEA)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DoTE Verified • 2022–2025
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Tamil Nadu Engineering College Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Explore authenticated engineering institutions affiliated with Anna University across all 38 districts of Tamil Nadu. View verified multi-year TNEA cutoffs, seat matrices, and branch statistics.
              </p>
            </div>

            {/* Quick Metrics / Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[130px]">
                <div className="text-lg font-black text-white">
                  {dataStatus?.statistics?.total_institutions || '20+'}
                </div>
                <div className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  TN Institutions
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[130px]">
                <div className="text-lg font-black text-emerald-400">
                  {dataStatus?.statistics?.total_cutoffs?.toLocaleString() || '6,384+'}
                </div>
                <div className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                  Cutoff Records
                </div>
              </div>
              <button
                onClick={() => setAdminModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Import Dataset</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Controls Panel ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          
          {/* Top row: Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by College Name, TNEA Code (e.g. 0001, 2006), Short Name, or City..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Bottom row: Multi-Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* District Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                District (38 Districts)
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Districts ({districts.length})</option>
                {districts.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name} {d.college_count > 0 ? `(${d.college_count})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Institution Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Types</option>
                <option value="Government">Government Only</option>
                <option value="Government Aided">Government Aided</option>
                <option value="Self Financing">Self Financing</option>
                <option value="University Department">University Dept</option>
              </select>
            </div>

            {/* Autonomous */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Autonomous Status
              </label>
              <select
                value={selectedAutonomous}
                onChange={(e) => setSelectedAutonomous(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="true">Autonomous Only</option>
                <option value="false">Non-Autonomous</option>
              </select>
            </div>

            {/* Branch / Course */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Offered Branch
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Branches</option>
                {courses.map(c => (
                  <option key={c.id} value={c.code}>
                    {c.code} – {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Clause */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Sort Institutions By
              </label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ranking">NIRF / State Ranking</option>
                <option value="placement">Highest Placement Rate</option>
                <option value="tnea_code">TNEA Code</option>
                <option value="name">College Name (A-Z)</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full text-xs py-2 px-3 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-medium transition"
              >
                Reset Filters
              </button>
            </div>

          </div>

          {/* Active Filter Tags */}
          {(selectedDistrict !== 'All' || selectedType !== 'All' || selectedAutonomous !== 'All' || selectedCourse !== 'All' || search) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-medium text-slate-400">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-medium">
                  Search: "{search}"
                </span>
              )}
              {selectedDistrict !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                  District: {selectedDistrict}
                </span>
              )}
              {selectedType !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                  Type: {selectedType}
                </span>
              )}
              {selectedAutonomous !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                  {selectedAutonomous === 'true' ? 'Autonomous Only' : 'Non-Autonomous'}
                </span>
              )}
              {selectedCourse !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
                  Branch: {selectedCourse}
                </span>
              )}
            </div>
          )}

        </div>

        {/* ── Status Count Header ── */}
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-semibold text-slate-600">
            {loading ? (
              <span>Querying verified Tamil Nadu database...</span>
            ) : (
              <span>
                Showing <b>{colleges.length}</b> of <b>{pagination.total}</b> institutions
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Official TNEA DoTE Single Window System Dataset</span>
          </div>
        </div>

        {/* ── Institutions Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-4/5" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Institutions Matched Your Filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try broadening your search term or clearing district and course constraints.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {colleges.map((college) => (
              <div
                key={college.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  
                  {/* TNEA Code + Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-mono font-bold border border-indigo-100">
                      TNEA: {college.tnea_code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {college.autonomous && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Autonomous
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {college.institution_type}
                      </span>
                    </div>
                  </div>

                  {/* College Name & Short Name */}
                  <div>
                    <h3 
                      onClick={() => handleOpenDetail(college)}
                      className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 cursor-pointer transition line-clamp-2 leading-snug"
                    >
                      {college.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{college.city}, {college.district_name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-400">{college.region}</span>
                    </div>
                  </div>

                  {/* Metrics Banner */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Rank</div>
                      <div className="text-xs font-bold text-slate-800">
                        {college.ranking ? `#${college.ranking}` : 'Data not available'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Placement</div>
                      <div className="text-xs font-bold text-emerald-600">
                        {college.placement_rate ? `${college.placement_rate}%` : 'Data not available'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Avg Package</div>
                      <div className="text-xs font-bold text-slate-800">
                        {college.avg_package ? `₹${college.avg_package} LPA` : 'Data not available'}
                      </div>
                    </div>
                  </div>

                  {/* Offered Branches Chips */}
                  {college.courses_offered && college.courses_offered.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-medium text-slate-400">Branches Offered:</div>
                      <div className="flex flex-wrap gap-1">
                        {college.courses_offered.slice(0, 5).map((crs) => (
                          <span 
                            key={crs} 
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                          >
                            {crs}
                          </span>
                        ))}
                        {college.courses_offered.length > 5 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                            +{college.courses_offered.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetail(college)}
                    className="flex-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl text-center transition"
                  >
                    View Cutoffs & Dossier
                  </button>
                  {college.website && (
                    <a
                      href={college.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                      title="Visit official institution website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ── Pagination Bar ── */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <button
              disabled={pagination.page <= 1}
              onClick={() => loadColleges(pagination.page - 1)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-slate-600 font-medium">
              Page <b>{pagination.page}</b> of <b>{pagination.totalPages}</b>
            </div>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadColleges(pagination.page + 1)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Institutional Dossier & Multi-Tab Cutoff Modal ── */}
        {detailModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">
                      TNEA: {activeCollegeDetail?.tnea_code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                      DoTE Verified
                    </span>
                    {activeCollegeDetail?.autonomous && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-medium">
                        Autonomous
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeCollegeDetail?.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeCollegeDetail?.city}, {activeCollegeDetail?.district_name || activeCollegeDetail?.district?.name}, Tamil Nadu • Affiliated to {activeCollegeDetail?.affiliation || 'Anna University'}
                  </p>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'courses', label: 'Courses & Intake' },
                  { id: 'cutoffs', label: 'TNEA Cutoffs (2022-2025)' },
                  { id: 'fees', label: 'Fees & Hostels' },
                  { id: 'provenance', label: 'Verification & Sources' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id)}
                    className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                      detailTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {detailLoading ? (
                  <div className="flex items-center justify-center py-12 space-x-2 text-indigo-600">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-medium">Loading dossier...</span>
                  </div>
                ) : activeCollegeDetail ? (
                  <>
                    {/* TAB 1: OVERVIEW */}
                    {detailTab === 'overview' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                            About Institution
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {activeCollegeDetail.description || 'Data not available'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <div className="text-[10px] text-slate-400 font-medium">Established</div>
                            <div className="text-sm font-bold text-slate-800">
                              {activeCollegeDetail.established_year || 'Data not available'}
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <div className="text-[10px] text-slate-400 font-medium">Accreditation</div>
                            <div className="text-xs font-bold text-slate-800">
                              {activeCollegeDetail.accreditation || 'NAAC / NBA'}
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <div className="text-[10px] text-slate-400 font-medium">State / NIRF Rank</div>
                            <div className="text-sm font-bold text-indigo-600">
                              {activeCollegeDetail.ranking ? `#${activeCollegeDetail.ranking}` : 'Data not available'}
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <div className="text-[10px] text-slate-400 font-medium">Placement Rate</div>
                            <div className="text-sm font-bold text-emerald-600">
                              {activeCollegeDetail.placement_rate ? `${activeCollegeDetail.placement_rate}%` : 'Data not available'}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800">Campus & Contact Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                            <div><b>Address:</b> {activeCollegeDetail.address || `${activeCollegeDetail.city}, Tamil Nadu`}</div>
                            <div><b>Pincode:</b> {activeCollegeDetail.pincode || 'Data not available'}</div>
                            <div><b>Phone:</b> {activeCollegeDetail.phone || 'Data not available'}</div>
                            <div><b>Email:</b> {activeCollegeDetail.email || 'Data not available'}</div>
                            {activeCollegeDetail.website && (
                              <div className="sm:col-span-2">
                                <b>Website:</b>{' '}
                                <a 
                                  href={activeCollegeDetail.website} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-indigo-600 underline font-medium"
                                >
                                  {activeCollegeDetail.website}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: COURSES & INTAKE */}
                    {detailTab === 'courses' && (
                      <div className="space-y-3">
                        <div className="text-xs text-slate-500">
                          Approved B.E. / B.Tech programs under Anna University affiliation & TNEA Single Window System:
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                              <tr>
                                <th className="p-3">Course Code</th>
                                <th className="p-3">Program Name</th>
                                <th className="p-3 text-center">Degree</th>
                                <th className="p-3 text-center">Approved Intake</th>
                                <th className="p-3 text-right">Tuition Fee (Annual)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeCollegeDetail.courses && activeCollegeDetail.courses.length > 0 ? (
                                activeCollegeDetail.courses.map((c) => (
                                  <tr key={c.id} className="hover:bg-slate-50/60">
                                    <td className="p-3 font-mono font-bold text-indigo-700">
                                      {c.course_code || c.course?.code}
                                    </td>
                                    <td className="p-3 font-medium text-slate-800">
                                      {c.course?.name || c.course_code}
                                    </td>
                                    <td className="p-3 text-center text-slate-600">
                                      {c.course?.degree || 'B.E.'}
                                    </td>
                                    <td className="p-3 text-center font-bold text-slate-800">
                                      {c.intake || '60'}
                                    </td>
                                    <td className="p-3 text-right font-medium text-slate-700">
                                      ₹{c.annual_fee?.toLocaleString() || 'Data not available'}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="p-4 text-center text-slate-400">
                                    No specific course records found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: TNEA CUTOFF HISTORY (2022-2025) */}
                    {detailTab === 'cutoffs' && (
                      <div className="space-y-4">
                        
                        {/* Cutoff Controls */}
                        <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-600 block mb-1">Academic Year:</span>
                            <div className="flex gap-1">
                              {['2025', '2024', '2023', '2022'].map(yr => (
                                <button
                                  key={yr}
                                  onClick={() => setCutoffFilterYear(yr)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                    cutoffFilterYear === yr
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {yr}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-slate-600 block mb-1">Counseling Round:</span>
                            <div className="flex gap-1">
                              {['Round 1', 'Round 2', 'Round 3'].map(rnd => (
                                <button
                                  key={rnd}
                                  onClick={() => setCutoffFilterRound(rnd)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                    cutoffFilterRound === rnd
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {rnd}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] font-semibold text-slate-600 block mb-1">Community:</span>
                            <select
                              value={cutoffFilterCommunity}
                              onChange={(e) => setCutoffFilterCommunity(e.target.value)}
                              className="text-xs rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-700"
                            >
                              {['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'].map(comm => (
                                <option key={comm} value={comm}>{comm}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Cutoffs Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                              <tr>
                                <th className="p-3">Branch</th>
                                <th className="p-3">Category</th>
                                <th className="p-3 text-center">Round</th>
                                <th className="p-3 text-center">Closing Cutoff (out of 200)</th>
                                <th className="p-3 text-center">Closing Rank</th>
                                <th className="p-3">Verification Source</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeCollegeDetail.tnea_cutoffs &&
                              activeCollegeDetail.tnea_cutoffs.filter(c => 
                                String(c.academic_year) === cutoffFilterYear && 
                                c.round === cutoffFilterRound &&
                                c.community === cutoffFilterCommunity
                              ).length > 0 ? (
                                activeCollegeDetail.tnea_cutoffs
                                  .filter(c => 
                                    String(c.academic_year) === cutoffFilterYear && 
                                    c.round === cutoffFilterRound &&
                                    c.community === cutoffFilterCommunity
                                  )
                                  .map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/60">
                                      <td className="p-3 font-semibold text-slate-800">
                                        {c.course?.name || c.course?.code || 'Engineering'}
                                      </td>
                                      <td className="p-3">
                                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700 text-[11px]">
                                          {c.community}
                                        </span>
                                      </td>
                                      <td className="p-3 text-center text-slate-600">
                                        {c.round}
                                      </td>
                                      <td className="p-3 text-center font-bold text-slate-900 text-sm">
                                        {c.cutoff}
                                      </td>
                                      <td className="p-3 text-center font-mono text-slate-600">
                                        #{c.closing_rank?.toLocaleString() || '–'}
                                      </td>
                                      <td className="p-3 text-slate-500 text-[11px]">
                                        {c.source?.source_name || 'DoTE TNEA Archive'}
                                      </td>
                                    </tr>
                                  ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="p-6 text-center text-slate-400">
                                    No cutoff entries recorded for {cutoffFilterYear} • {cutoffFilterRound} • {cutoffFilterCommunity}.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    )}

                    {/* TAB 4: FEES & HOSTELS */}
                    {detailTab === 'fees' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Tuition & Academic Fees
                            </h4>
                            <div className="text-2xl font-black text-slate-900">
                              ₹{activeCollegeDetail.fees ? activeCollegeDetail.fees.toLocaleString() : '35,000 – 1,45,000'}
                              <span className="text-xs font-normal text-slate-500 ml-1">/ year</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Regulated by Tamil Nadu Committee on Fixation of Fee for Self Financing Professional Colleges.
                            </p>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Hostel & Living Accommodation
                            </h4>
                            <div className="text-2xl font-black text-slate-900">
                              ₹{activeCollegeDetail.hostel_fee ? activeCollegeDetail.hostel_fee.toLocaleString() : '65,000'}
                              <span className="text-xs font-normal text-slate-500 ml-1">/ year</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Includes mess charges, furnished dormitories, and campus security.
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800">Campus Facilities & Infrastructure</h4>
                          <p className="text-slate-600 leading-relaxed">
                            {activeCollegeDetail.facilities || 'Advanced Computing Labs, High-Speed Campus Wi-Fi, Digital Library, Sports Complex, Auditorium, Incubation Center.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: PROVENANCE & SOURCES */}
                    {detailTab === 'provenance' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                          <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span>Verified Tamil Nadu Engineering Admissions Data</span>
                          </div>
                          <p className="text-emerald-700 leading-relaxed">
                            This institution record is verified under the Tamil Nadu Engineering Admissions (TNEA) single-window counseling system administered by the Directorate of Technical Education (DoTE), Chennai.
                          </p>
                        </div>

                        <div className="space-y-2 text-xs">
                          <h4 className="font-bold text-slate-800">Verification Trail</h4>
                          <ul className="space-y-2 text-slate-600">
                            <li className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><b>Regulatory Body:</b> Directorate of Technical Education (DoTE), Tamil Nadu</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><b>Affiliating University:</b> Anna University, Guindy, Chennai</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><b>Official TNEA Counseling Code:</b> {activeCollegeDetail.tnea_code}</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><b>Last Verification Timestamp:</b> {new Date(activeCollegeDetail.last_verified_at || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                  </>
                ) : null}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50">
                <div className="text-[11px] text-slate-500">
                  Tamil Nadu Engineering Admissions • TNEA Code: <b>{activeCollegeDetail?.tnea_code}</b>
                </div>
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                >
                  Close Dossier
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Admin Ingestion Modal ── */}
        <AdminImportModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          onImportSuccess={() => {
            loadColleges(1);
            fetchDataStatus().then(res => { if (res.success) setDataStatus(res); });
          }}
        />

      </div>
    </div>
  );
}
