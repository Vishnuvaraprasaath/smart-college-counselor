import React, { useEffect, useState } from 'react';
import { fetchCutoffs } from '../services/api';
import { LineChart, Search, Filter, Layers, Database, Sparkles } from 'lucide-react';

export default function CutoffTrendsPage() {
  const [cutoffs, setCutoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('BC');
  const [year, setYear] = useState('2025');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCutoffs({ category, year, course: search })
      .then(res => {
        setCutoffs(res.cutoffs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category, year, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header Card */}
      <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
              Benchmark Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            TNEA Cutoff Trends Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Query official multi-year admission cutoff benchmarks across reservation quotas and academic programs.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="OC">OC - Open Competition</option>
            <option value="BC">BC - Backward Class</option>
            <option value="MBC">MBC - Most Backward Class</option>
            <option value="SC">SC - Scheduled Caste</option>
            <option value="ST">ST - Scheduled Tribe</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="2025">2025 Admissions</option>
            <option value="2024">2024 Admissions</option>
            <option value="2023">2023 Admissions</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by engineering branch code or institution name (e.g. ECE, CSE, PSG, BIT, CIT)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none shadow-xs transition"
        />
      </div>

      {/* Cutoffs Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-mono">Querying historical admission benchmarks...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4">Institution Name</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Quota</th>
                  <th className="p-4">Cycle</th>
                  <th className="p-4 text-right">Cutoff Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal text-slate-700">
                {cutoffs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-14 text-center text-slate-400 font-mono text-xs">
                      No cutoff benchmarks found matching the specified query parameters.
                    </td>
                  </tr>
                ) : (
                  cutoffs.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-bold text-slate-900">{item.college_name}</td>
                      <td className="p-4 text-slate-500 font-normal">{item.city}</td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 mr-1.5">
                          {item.course_code}
                        </span>
                        <span className="text-slate-500 font-normal text-xs">{item.course_name}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">{item.category}</td>
                      <td className="p-4 font-mono text-slate-500">{item.year}</td>
                      <td className="p-4 text-right font-mono font-black text-sm text-slate-900">
                        {item.cutoff.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
