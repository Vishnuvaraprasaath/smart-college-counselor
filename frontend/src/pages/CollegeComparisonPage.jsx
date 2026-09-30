import React, { useEffect, useState } from 'react';
import { compareColleges, fetchColleges } from '../services/api';
import { 
  GitCompare, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowLeft, 
  Trash2, 
  Plus,
  Sparkles,
  Building2,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function CollegeComparisonPage({ 
  comparedColleges, 
  setComparedColleges, 
  activeProfile, 
  setCurrentView 
}) {
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCollegesList, setAllCollegesList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('ECE');

  const studentCutoff = activeProfile?.cutoff || 187.5;
  const category = activeProfile?.category || 'BC';

  useEffect(() => {
    fetchColleges().then(res => setAllCollegesList(res.colleges || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!comparedColleges || comparedColleges.length === 0) {
      setComparisonData([]);
      return;
    }
    const ids = comparedColleges.map(c => c.id || c.college_id);
    setLoading(true);
    compareColleges(ids, selectedCourse, category, studentCutoff)
      .then(res => {
        setComparisonData(res.comparison || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [comparedColleges, selectedCourse, category, studentCutoff]);

  const removeCollege = (id) => {
    setComparedColleges(comparedColleges.filter(c => (c.id || c.college_id) !== id));
  };

  const addCollegeToCompare = (id) => {
    if (comparedColleges.length >= 3) return;
    const col = allCollegesList.find(c => c.id == id);
    if (col) {
      setComparedColleges([...comparedColleges, { id: col.id, name: col.name, code: col.code }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-9">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
              Comparative Analysis Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Side-by-Side College Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Evaluating up to 3 institutions for {selectedCourse} ({category} Quota • Candidate Cutoff: <strong className="font-mono font-bold text-slate-900">{studentCutoff}</strong>)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="ECE">ECE - Electronics & Comm</option>
            <option value="CSE">CSE - Computer Science</option>
            <option value="AIDS">AIDS - AI & Data Science</option>
            <option value="IT">IT - Information Tech</option>
            <option value="MECH">MECH - Mechanical</option>
          </select>

          <button
            onClick={() => setCurrentView('results')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* College Add Selector Bar */}
      {comparedColleges.length < 3 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold text-slate-800">
              Add institution to comparison queue ({comparedColleges.length}/3 selected):
            </span>
          </div>
          <select
            onChange={(e) => {
              if (e.target.value) addCollegeToCompare(e.target.value);
            }}
            defaultValue=""
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none shadow-xs transition"
          >
            <option value="" disabled>Select Institution to Add...</option>
            {allCollegesList.filter(c => !comparedColleges.some(cc => (cc.id || cc.college_id) === c.id)).map(col => (
              <option key={col.id} value={col.id}>{col.name} ({col.city})</option>
            ))}
          </select>
        </div>
      )}

      {/* COMPARISON TABLE MATRIX */}
      {comparedColleges.length === 0 ? (
        <div className="bg-white p-14 text-center rounded-3xl border border-slate-200/90 space-y-4 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <GitCompare className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Institutions in Comparison Queue</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Select colleges from your personalized recommendations dashboard or use the dropdown selector above to assemble a side-by-side comparative matrix.
          </p>
          <button
            onClick={() => setCurrentView('results')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            Browse Recommendations
          </button>
        </div>
      ) : loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-mono">Synthesizing comparative parameters...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 w-1/4">Evaluation Metric</th>
                  {comparisonData.map((col, idx) => (
                    <th key={idx} className="p-4 text-slate-900 border-l border-slate-200 w-1/4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                            Code: {col.code}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-2 leading-snug">{col.name}</h4>
                          <span className="text-xs text-slate-500 font-normal">{col.city}</span>
                        </div>
                        <button
                          onClick={() => removeCollege(col.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
                
                {/* Course */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Engineering Program</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono font-bold text-slate-900">{col.compared_course}</td>
                  ))}
                </tr>

                {/* Admission Category */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Admission Chance Tier</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100">
                      <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-[10px] uppercase border ${
                        col.chance_category === 'SAFE' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        col.chance_category === 'MODERATE' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {col.chance_category}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Historical Cutoff */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">2025 Historical Cutoff</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono font-bold text-slate-900">
                      {col.historical_cutoff_2025 ? col.historical_cutoff_2025.toFixed(2) : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Cutoff Delta */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Cutoff Gap (You: {studentCutoff})</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono font-bold">
                      <span className={col.cutoff_delta >= 0 ? 'text-emerald-600' : 'text-amber-600'}>
                        {col.cutoff_delta >= 0 ? `+${col.cutoff_delta.toFixed(2)}` : col.cutoff_delta.toFixed(2)}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Fees */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Annual Tuition Fee</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono font-bold text-slate-900">
                      ₹{col.fees ? col.fees.toLocaleString('en-IN') : 'N/A'} / yr
                    </td>
                  ))}
                </tr>

                {/* Hostel */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Hostel Facility & Fee</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono">
                      {col.hostel_available ? `Available (₹${col.hostel_fee?.toLocaleString('en-IN')}/yr)` : 'Not Available'}
                    </td>
                  ))}
                </tr>

                {/* Type & Accreditation */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Type & Accreditation</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100">{col.type} • {col.accreditation}</td>
                  ))}
                </tr>

                {/* Placements */}
                <tr>
                  <td className="p-4 font-bold text-slate-900 bg-slate-50/50 font-mono text-xs uppercase tracking-wider">Placement Record & Avg CTC</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-slate-100 font-mono font-bold text-emerald-700">
                      {col.placement_rate}% Placed (Avg ₹{col.avg_package} LPA)
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
