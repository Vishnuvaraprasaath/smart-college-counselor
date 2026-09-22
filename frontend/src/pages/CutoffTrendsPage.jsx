import React, { useEffect, useState } from 'react';
import { fetchCutoffs } from '../services/api';
import { LineChart, Search, Filter, Layers, Database } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E5DD] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A7139] uppercase bg-[#FAF8F2] px-2.5 py-0.5 rounded border border-[#EBE4D5]">
              Historical Benchmark Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111318] tracking-tight mt-1.5">
            TNEA Cutoff Trends Explorer
          </h1>
          <p className="text-xs text-neutral-500 font-normal mt-0.5">
            Query official multi-year admission cutoff benchmarks across reservation categories and academic programs.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-[#DCD7CB] text-xs font-semibold text-[#111318] bg-white shadow-sm focus:border-[#111318] focus:outline-none"
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
            className="px-3.5 py-2.5 rounded-xl border border-[#DCD7CB] text-xs font-semibold text-[#111318] bg-white shadow-sm focus:border-[#111318] focus:outline-none"
          >
            <option value="2025">2025 Admissions</option>
            <option value="2024">2024 Admissions</option>
            <option value="2023">2023 Admissions</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by engineering branch code or institution name (e.g. ECE, CSE, PSG, BIT)..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#DCD7CB] bg-white text-xs font-medium text-[#111318] focus:border-[#111318] focus:ring-1 focus:ring-[#111318] focus:outline-none shadow-sm transition"
        />
      </div>

      {/* Cutoffs Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#111318] border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
          <p className="text-neutral-500 text-xs font-mono">Querying historical admission benchmarks...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E5DD] shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#EAE6DD] text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-4">Institution Name</th>
                  <th className="p-4">District</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Quota</th>
                  <th className="p-4">Cycle</th>
                  <th className="p-4 text-right">Cutoff Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1] text-xs font-normal text-neutral-700">
                {cutoffs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-neutral-400 font-mono text-xs">
                      No cutoff benchmarks found matching the specified query parameters.
                    </td>
                  </tr>
                ) : (
                  cutoffs.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition">
                      <td className="p-4 font-bold text-[#111318]">{item.college_name}</td>
                      <td className="p-4 text-neutral-500 font-normal">{item.city}</td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#111318]">{item.course_code}</span>
                        <span className="text-neutral-500 font-normal text-[11px] ml-1.5">- {item.course_name}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#8A7139]">{item.category}</td>
                      <td className="p-4 font-mono text-neutral-500">{item.year}</td>
                      <td className="p-4 text-right font-mono font-black text-sm text-[#111318]">
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

