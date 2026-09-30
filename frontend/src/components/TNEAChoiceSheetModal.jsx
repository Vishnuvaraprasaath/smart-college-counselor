import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Info, 
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';

export default function TNEAChoiceSheetModal({ analysisData, onClose, onSelectDetail }) {
  if (!analysisData) return null;

  const { studentProfile, summary, categorized, recommendations } = analysisData;

  const cutoff = studentProfile?.cutoff || 187.5;
  const category = studentProfile?.category || 'BC';
  const studentName = studentProfile?.name || 'Student';
  const preferredLocation = studentProfile?.location || 'Tamil Nadu';
  const preferredCourses = studentProfile?.courses?.join(', ') || 'Engineering';

  // Extract recommendations by category (sorted descending by suitability score)
  const ambitiousPool = (categorized?.ambitious && categorized.ambitious.length > 0)
    ? categorized.ambitious
    : (recommendations || []).filter(r => r.chance_category === 'AMBITIOUS');

  const moderatePool = (categorized?.moderate && categorized.moderate.length > 0)
    ? categorized.moderate
    : (recommendations || []).filter(r => r.chance_category === 'MODERATE');

  const safePool = (categorized?.safe && categorized.safe.length > 0)
    ? categorized.safe
    : (recommendations || []).filter(r => r.chance_category === 'SAFE');

  // Select 3 Ambitious, 3 Moderate, 2 Safe (3:3:2 Strategy)
  const ambitiousChoices = ambitiousPool.slice(0, 3);
  const moderateChoices = moderatePool.slice(0, 3);
  const safeChoices = safePool.slice(0, 2);

  // Combine into an ordered list with continuous choice numbering (1 to 8)
  const orderedChoices = [
    ...ambitiousChoices.map((item, idx) => ({ ...item, choiceNumber: idx + 1, tier: 'AMBITIOUS' })),
    ...moderateChoices.map((item, idx) => ({ ...item, choiceNumber: ambitiousChoices.length + idx + 1, tier: 'MODERATE' })),
    ...safeChoices.map((item, idx) => ({ ...item, choiceNumber: ambitiousChoices.length + moderateChoices.length + idx + 1, tier: 'SAFE' }))
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Choice Number',
      'TNEA College Code',
      'College Name',
      'City / District',
      'Branch Code',
      'Branch Name',
      'Category Tier',
      '2025 Historical Cutoff',
      'Student Cutoff',
      'Cutoff Delta',
      'Suitability Score',
      'Annual Fee (INR)'
    ];

    const rows = orderedChoices.map(c => [
      c.choiceNumber,
      `"${c.college_code || ''}"`,
      `"${(c.college_name || '').replace(/"/g, '""')}"`,
      `"${c.city || ''}"`,
      `"${c.course_code || ''}"`,
      `"${(c.course_name || '').replace(/"/g, '""')}"`,
      `"${c.tier}"`,
      c.historical_cutoff != null ? c.historical_cutoff : '',
      c.student_cutoff != null ? c.student_cutoff : '',
      c.cutoff_delta != null ? (c.cutoff_delta >= 0 ? `+${c.cutoff_delta}` : `${c.cutoff_delta}`) : '',
      c.suitability_score != null ? c.suitability_score : '',
      c.fees || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TNEA_Choice_Filling_Sheet_${studentName.replace(/\s+/g, '_')}_${cutoff}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print-container">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-modal border border-slate-200 relative flex flex-col print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
        
        {/* TOP BAR / MODAL HEADER (hidden on print) */}
        <div className="no-print p-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Official TNEA Protocol
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Generated on {today}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              TNEA Choice Filling Worksheet <span className="text-indigo-600 font-mono text-lg font-semibold">(3:3:2 Strategy)</span>
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Risk-balanced choice priority sequence engineered for TNEA engineering admission rounds.
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-xs transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition border border-slate-300 shadow-xs"
              title="Export as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                title="Close sheet"
                aria-label="Close worksheet"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 flex-1">
          
          {/* OFFICIAL WORKSHEET HEADER (Always visible, formal styling) */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4 print:border-slate-800 print:bg-white print:p-4">
            <div className="text-center border-b border-slate-200 pb-3 print:border-slate-800">
              <div className="inline-flex items-center space-x-2 text-blue-700 font-mono font-bold text-xs uppercase tracking-wider print:text-black">
                <GraduationCap className="w-4 h-4" />
                <span>Tamil Nadu Engineering Admissions (TNEA) Counselling</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 print:text-black">
                CANDIDATE CHOICE FILLING WORKSHEET
              </h1>
              <p className="text-xs text-slate-500 font-medium print:text-slate-700">
                Recommended 3:3:2 Balanced Architecture (3 Ambitious, 3 Moderate, 2 Safe Backstops)
              </p>
            </div>

            {/* Candidate Info Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-400 block print:text-slate-600">Candidate</span>
                <strong className="text-slate-900 font-bold truncate block mt-0.5">{studentName}</strong>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-400 block print:text-slate-600">Cutoff Score</span>
                <strong className="text-blue-600 font-black text-sm block mt-0.5 print:text-black">{cutoff} / 200</strong>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-400 block print:text-slate-600">Category</span>
                <strong className="text-slate-900 font-bold block mt-0.5">{category}</strong>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 print:border-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-400 block print:text-slate-600">Location Focus</span>
                <strong className="text-slate-900 font-bold block mt-0.5">{preferredLocation}</strong>
              </div>
            </div>
          </div>

          {/* 3:3:2 STRATEGY EXPLANATION BANNER (no-print) */}
          <div className="no-print bg-blue-50/70 p-4 sm:p-5 rounded-xl border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-mono flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                3:3:2
              </div>
              <div>
                <strong className="text-slate-900 font-bold block">Why the 3:3:2 Choice Allocation Strategy?</strong>
                <p className="text-slate-600 text-xs leading-relaxed font-normal mt-0.5">
                  Submit <strong>3 Ambitious</strong> targets (positioning for higher-round vacancies), <strong>3 Moderate</strong> choices (realistic competitive range), and <strong>2 Safe</strong> choices (guaranteed backstops).
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 font-mono text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">3 Ambitious</span>
              <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">3 Moderate</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">2 Safe</span>
            </div>
          </div>

          {/* EDGE CASE: NO RECOMMENDATIONS */}
          {orderedChoices.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Choices Available</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No colleges in the database currently match the entered criteria. Try adjusting your course or location preferences in the counselling form.
              </p>
            </div>
          ) : (
            <>
              {/* PRIMARY ORDERED CHOICES TABLE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-800 print:shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-semibold uppercase tracking-wider text-[11px] print:bg-slate-100 print:text-black">
                        <th className="p-3 w-12 text-center">Choice #</th>
                        <th className="p-3 w-20">Code</th>
                        <th className="p-3">Institution & Location</th>
                        <th className="p-3 w-32">Branch</th>
                        <th className="p-3 w-28 text-center">Category Tier</th>
                        <th className="p-3 w-20 text-right">Hist. Cutoff</th>
                        <th className="p-3 w-20 text-right">Cutoff Gap</th>
                        <th className="p-3 w-16 text-center">Fit Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium print:divide-slate-300">
                      {orderedChoices.map((c) => {
                        const isSafe = c.tier === 'SAFE';
                        const isModerate = c.tier === 'MODERATE';
                        const isAmbitious = c.tier === 'AMBITIOUS';

                        const tierBadge = isSafe ? (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 print:border-black print:bg-white print:text-black">
                            Safe Backstop
                          </span>
                        ) : isModerate ? (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200 print:border-black print:bg-white print:text-black">
                            Moderate
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200 print:border-black print:bg-white print:text-black">
                            Ambitious
                          </span>
                        );

                        return (
                          <tr 
                            key={c.choiceNumber} 
                            className="hover:bg-slate-50/80 transition print:bg-white"
                          >
                            <td className="p-3 text-center font-bold font-mono text-sm text-slate-900 print:text-black">
                              <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold mx-auto border border-slate-200 print:border-none print:bg-transparent">
                                {c.choiceNumber}
                              </span>
                            </td>

                            <td className="p-3 font-mono font-bold text-blue-600 print:text-black">
                              {c.college_code}
                            </td>

                            <td className="p-3">
                              <div 
                                className={onSelectDetail ? "cursor-pointer group" : ""}
                                onClick={() => onSelectDetail && onSelectDetail(c.college_id)}
                              >
                                <strong className="font-bold text-slate-900 block leading-snug group-hover:text-blue-600 transition print:text-black">
                                  {c.college_name}
                                </strong>
                                <span className="text-[11px] text-slate-500 font-normal print:text-slate-600">
                                  {c.city}, {c.district} • {c.type || 'Autonomous'}
                                </span>
                              </div>
                            </td>

                            <td className="p-3">
                              <span className="font-mono font-bold text-slate-900 block print:text-black">{c.course_code}</span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-[130px] font-normal print:text-slate-600">
                                {c.course_name}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              {tierBadge}
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-slate-900 print:text-black">
                              {c.historical_cutoff != null ? c.historical_cutoff.toFixed(2) : 'N/A'}
                            </td>

                            <td className="p-3 text-right font-mono font-bold">
                              {c.cutoff_delta != null ? (
                                <span className={c.cutoff_delta >= 0 ? 'text-emerald-600 print:text-black' : 'text-amber-600 print:text-black'}>
                                  {c.cutoff_delta >= 0 ? `+${c.cutoff_delta.toFixed(2)}` : c.cutoff_delta.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </td>

                            <td className="p-3 text-center font-mono font-bold text-slate-900 print:text-black">
                              {c.suitability_score || 85}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TIER COMPLETENESS NOTICES (For edge cases with fewer choices) */}
              <div className="no-print space-y-1.5 text-xs font-normal">
                {ambitiousChoices.length < 3 && (
                  <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center space-x-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Notice: Only {ambitiousChoices.length} ambitious match(es) qualified for your active cutoff and community category.</span>
                  </p>
                )}
                {moderateChoices.length < 3 && (
                  <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center space-x-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Notice: Only {moderateChoices.length} moderate match(es) qualified for your active cutoff and community category.</span>
                  </p>
                )}
                {safeChoices.length < 2 && (
                  <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center space-x-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>Notice: Only {safeChoices.length} safe match(es) were identified. Consider broadening your branch or district preferences.</span>
                  </p>
                )}
              </div>

              {/* TNEA COUNSELLING CHECKLIST (Both Screen & Print) */}
              <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 space-y-2 text-xs print:bg-white print:border-slate-800">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 print:text-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 print:text-black" />
                  <span>Important Candidate Instructions for TNEA Choice Filling</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 text-[11px] leading-relaxed font-normal print:text-black">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-slate-900 font-mono print:text-black">1.</span>
                    <span>Enter choices in strict descending order of priority on the official TNEA portal.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-slate-900 font-mono print:text-black">2.</span>
                    <span>Keep ambitious institutions at the top (Choices 1–3) to qualify for vacancy allocations.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-slate-900 font-mono print:text-black">3.</span>
                    <span>Verify tuition fees and hostel requirements before finalizing choice order.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-slate-900 font-mono print:text-black">4.</span>
                    <span>Lock your choices prior to the counselling round deadline. Unlocked choices are auto-locked.</span>
                  </div>
                </div>
              </div>

              {/* CANDIDATE SIGNATURE & VERIFICATION BOX (Print-Only) */}
              <div className="hidden print:block pt-6 border-t border-slate-400 text-xs">
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-6">
                    <p className="font-semibold text-slate-700">Parent / Guardian Signature: _________________________</p>
                    <p className="text-[10px] text-slate-500">Date: ____ / ____ / ________</p>
                  </div>
                  <div className="space-y-6 text-right">
                    <p className="font-semibold text-slate-700">Candidate Signature: _________________________</p>
                    <p className="text-[10px] text-slate-500">TNEA Reg No: _________________________</p>
                  </div>
                </div>
              </div>

              {/* MANDATORY DISCLAIMER */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed font-normal print:bg-white print:border-slate-800 print:text-slate-800">
                <strong className="text-slate-900 block mb-0.5 font-bold print:text-black">Official Advisory Disclaimer:</strong>
                This choice list is an advisory recommendation generated from verified historical cutoff datasets and candidate inputs. Final allotment depends upon actual counselling round competition and official Anna University / DoTE quota guidelines.
              </div>
            </>
          )}

        </div>

        {/* BOTTOM ACTION FOOTER (no-print) */}
        <div className="no-print p-4 sm:p-5 border-t border-slate-200 bg-slate-50 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-normal">
            Displaying {orderedChoices.length} choices sequenced under the recommended 3:3:2 risk distribution.
          </span>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

