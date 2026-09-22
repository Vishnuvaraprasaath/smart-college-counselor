import React, { useEffect, useState } from 'react';
import { compareColleges, fetchColleges } from '../services/api';
import { GitCompare, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft, Trash2, Plus } from 'lucide-react';

export default function CollegeComparisonPage({ comparedColleges, setComparedColleges, activeProfile, setCurrentView }) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A7139] uppercase bg-[#FAF8F2] px-2.5 py-0.5 rounded border border-[#EBE4D5]">
              Comparative Evaluation Matrix
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight mt-1.5">
            Side-by-Side College Analysis
          </h1>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Evaluating up to 3 institutions for {selectedCourse} ({category} Category • Candidate Cutoff: <span className="font-mono font-bold text-[#111318]">{studentCutoff}</span>)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#DCD7CB] text-xs font-semibold text-[#111318] bg-white shadow-sm focus:border-[#111318] focus:outline-none"
          >
            <option value="ECE">ECE - Electronics & Comm</option>
            <option value="CSE">CSE - Computer Science</option>
            <option value="AIDS">AIDS - AI & Data Science</option>
            <option value="IT">IT - Information Tech</option>
            <option value="MECH">MECH - Mechanical</option>
          </select>

          <button
            onClick={() => setCurrentView('results')}
            className="px-4 py-2.5 rounded-xl border border-[#DCD7CB] hover:bg-[#FAF8F5] text-xs font-semibold text-neutral-700 flex items-center space-x-1.5 transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* College Add Selector Bar */}
      {comparedColleges.length < 3 && (
        <div className="bg-[#FAF9F5] p-4 sm:p-5 rounded-2xl border border-[#EAE6DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#111318]">
            Add institution to comparison queue ({comparedColleges.length}/3 selected):
          </span>
          <select
            onChange={(e) => {
              if (e.target.value) addCollegeToCompare(e.target.value);
            }}
            defaultValue=""
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#DCD7CB] text-xs font-medium bg-white text-[#111318] focus:border-[#111318] focus:outline-none shadow-sm"
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
        <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E5DD] space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F3] border border-[#E8E2D5] text-[#8A7139] flex items-center justify-center mx-auto">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#111318]">No Institutions in Comparison Queue</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Select colleges from your recommendations dashboard or use the selector above to build a comparative matrix.
          </p>
          <button
            onClick={() => setCurrentView('results')}
            className="px-5 py-2.5 rounded-xl bg-[#111318] hover:bg-[#202534] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition"
          >
            Browse Recommendations
          </button>
        </div>
      ) : loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#111318] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-xs font-mono">Synthesizing comparative parameters...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E5DD] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#EAE6DD]">
                  <th className="p-4 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500 w-1/4">Evaluation Metric</th>
                  {comparisonData.map((col, idx) => (
                    <th key={idx} className="p-4 text-[#111318] border-l border-[#EAE6DD] w-1/4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-[#111318] text-[#D4AF37] px-2 py-0.5 rounded">
                            {col.code}
                          </span>
                          <h4 className="font-bold text-sm text-[#111318] mt-1.5 leading-snug">{col.name}</h4>
                          <span className="text-[11px] text-neutral-500 font-normal">{col.city}</span>
                        </div>
                        <button
                          onClick={() => removeCollege(col.id)}
                          className="text-neutral-400 hover:text-[#A82B2B] p-1 transition"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1] text-xs font-normal text-neutral-700">
                
                {/* Course */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Engineering Program</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono font-bold text-[#111318]">{col.compared_course}</td>
                  ))}
                </tr>

                {/* Admission Category */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Admission Chance Tier</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1]">
                      <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[10px] border ${
                        col.chance_category === 'SAFE' ? 'bg-[#F4F9F6] text-[#195634] border-[#CBE5D5]' :
                        col.chance_category === 'MODERATE' ? 'bg-[#FDFBF5] text-[#7A5613] border-[#EFE0BA]' : 'bg-[#FDF7F7] text-[#7C1E1E] border-[#F3D5D5]'
                      }`}>
                        {col.chance_category}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Historical Cutoff */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">2025 Historical Cutoff</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono font-bold text-[#111318]">
                      {col.historical_cutoff_2025 || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Cutoff Delta */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Cutoff Gap (You: {studentCutoff})</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono font-bold">
                      <span className={col.cutoff_delta >= 0 ? 'text-[#1E7245]' : 'text-[#996D19]'}>
                        {col.cutoff_delta >= 0 ? `+${col.cutoff_delta}` : col.cutoff_delta}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Fees */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Annual Tuition Fee</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono font-bold text-[#111318]">
                      ₹{col.fees ? col.fees.toLocaleString('en-IN') : 'N/A'} / yr
                    </td>
                  ))}
                </tr>

                {/* Hostel */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Hostel Facility & Fee</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono">
                      {col.hostel_available ? `Available (₹${col.hostel_fee?.toLocaleString('en-IN')}/yr)` : 'Not Available'}
                    </td>
                  ))}
                </tr>

                {/* Type & Accreditation */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Type & Accreditation</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1]">{col.type} • {col.accreditation}</td>
                  ))}
                </tr>

                {/* Placements */}
                <tr>
                  <td className="p-4 font-bold text-[#111318] bg-[#FAF9F5]/60 font-mono text-[11px] uppercase tracking-wider">Placement Record & Avg CTC</td>
                  {comparisonData.map((col, idx) => (
                    <td key={idx} className="p-4 border-l border-[#F0ECE1] font-mono font-semibold text-[#1E7245]">
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

