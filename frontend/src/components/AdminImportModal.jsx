import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  ShieldCheck, 
  RefreshCw,
  Copy,
  FileType
} from 'lucide-react';
import { importAdminData } from '../services/api';

export default function AdminImportModal({ isOpen, onClose, onImportSuccess }) {
  const [importType, setImportType] = useState('colleges');
  const [formatType, setFormatType] = useState('json'); // 'json' or 'csv'
  const [academicYear, setAcademicYear] = useState('2025');
  const [payloadText, setPayloadText] = useState('');
  const [fileName, setFileName] = useState('manual_tnea_import');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  const sampleCollegeJSON = `[
  {
    "tnea_code": "1113",
    "name": "R.M.K. Engineering College",
    "short_name": "RMKEC",
    "institution_type": "Self Financing",
    "ownership": "Private Autonomous",
    "district": "Tiruvallur",
    "city": "Kavaraipettai",
    "autonomous": true,
    "established_year": 1995,
    "accreditation": "NAAC A+, NBA Accredited",
    "ranking": 145,
    "placement_rate": 91.5,
    "avg_package": 5.9,
    "website": "https://www.rmkec.ac.in"
  }
]`;

  const sampleCutoffJSON = `[
  {
    "tnea_code": "2006",
    "course_code": "CSE",
    "academic_year": 2025,
    "round": "Round 1",
    "community": "OC",
    "cutoff": 198.50,
    "opening_rank": 210,
    "closing_rank": 430
  }
]`;

  const sampleCollegeCSV = `tnea_code,name,short_name,institution_type,district,city,autonomous,ranking,placement_rate,avg_package,website
1113,R.M.K. Engineering College,RMKEC,Self Financing,Tiruvallur,Kavaraipettai,true,145,91.5,5.9,https://www.rmkec.ac.in
1399,Chennai Institute of Technology,CIT Chennai,Self Financing,Chennai,Kundrathur,true,110,96.5,8.5,https://citchennai.edu.in`;

  const sampleCutoffCSV = `tnea_code,course_code,academic_year,round,community,cutoff,opening_rank,closing_rank
2006,CSE,2025,Round 1,OC,198.50,210,430
2006,CSE,2025,Round 1,BC,197.25,431,650
1315,CSE,2025,Round 1,OC,197.50,310,580`;

  const handleLoadSample = () => {
    if (formatType === 'json') {
      setPayloadText(importType === 'colleges' ? sampleCollegeJSON : sampleCutoffJSON);
    } else {
      setPayloadText(importType === 'colleges' ? sampleCollegeCSV : sampleCutoffCSV);
    }
    setError(null);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessResult(null);

    let parsedRecords = null;
    let csvString = null;

    if (formatType === 'json') {
      try {
        parsedRecords = JSON.parse(payloadText);
        if (!Array.isArray(parsedRecords)) {
          throw new Error('Data must be a JSON array of objects.');
        }
      } catch (err) {
        setError(`Invalid JSON: ${err.message}`);
        return;
      }
    } else {
      csvString = payloadText.trim();
      if (!csvString.includes(',')) {
        setError('Invalid CSV: Missing commas or comma-separated header row.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await importAdminData({
        type: importType,
        academic_year: parseInt(academicYear, 10),
        file_name: `${fileName}.${formatType}`,
        records: parsedRecords,
        csv_content: csvString
      });

      setSuccessResult(res.summary);
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setError(err.message || 'Import operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tamil Nadu Dataset Ingestion & Validation Pipeline</h2>
              <p className="text-xs text-slate-500">Import verified DoTE / TNEA institutional & cutoff records (JSON / CSV)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleImport} className="p-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dataset Classification
              </label>
              <select
                value={importType}
                onChange={(e) => {
                  setImportType(e.target.value);
                  setPayloadText('');
                  setError(null);
                  setSuccessResult(null);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="colleges">Colleges (TNEA Code)</option>
                <option value="cutoffs">TNEA Cutoffs Matrix</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payload Format
              </label>
              <select
                value={formatType}
                onChange={(e) => {
                  setFormatType(e.target.value);
                  setPayloadText('');
                  setError(null);
                  setSuccessResult(null);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="json">JSON Array</option>
                <option value="csv">CSV (Comma Separated)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2025">2025 – 2026 (Current)</option>
                <option value="2024">2024 – 2025</option>
                <option value="2023">2023 – 2024</option>
                <option value="2022">2022 – 2023</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <FileType className="w-3.5 h-3.5 text-indigo-500" />
                <span>{formatType.toUpperCase()} Ingestion Content</span>
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Load Sample {formatType.toUpperCase()}</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              placeholder={formatType === 'json' ? '[{ "tnea_code": "1113", "name": "..." }]' : 'tnea_code,name,district...'}
              className="w-full font-mono text-xs rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Enhanced Success / Summary Report */}
          {successResult && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-2.5">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                <span>Dataset Ingestion & Validation Summary</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Records Received</span>
                  <span className="font-bold text-slate-900">{successResult.records_received || successResult.total_processed || 0}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Records Inserted</span>
                  <span className="font-bold text-emerald-700">{successResult.records_inserted || successResult.added || 0}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Records Updated</span>
                  <span className="font-bold text-indigo-700">{successResult.records_updated || successResult.updated || 0}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Duplicates Skipped</span>
                  <span className="font-bold text-amber-700">{successResult.duplicates_skipped || 0}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Invalid Records</span>
                  <span className="font-bold text-rose-700">{successResult.invalid_records || 0}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Unmatched Institutions</span>
                  <span className="font-bold text-rose-700">{successResult.unmatched_institutions || 0}</span>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Unmatched Courses</span>
                  <span className="font-bold text-rose-700">{successResult.unmatched_courses || 0}</span>
                </div>
              </div>
              {Array.isArray(successResult.errors) && successResult.errors.length > 0 && (
                <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100 max-h-24 overflow-y-auto font-mono">
                  {successResult.errors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footnote */}
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict deduplication & validation: TNEA codes, cutoff range [77.50, 200.00], and communities (OC, BC, BCM, MBC, SC, SCA, ST) are checked.</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading || !payloadText.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-500/20 disabled:opacity-50 flex items-center space-x-1.5 transition"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating & Ingesting...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Execute Ingestion</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
