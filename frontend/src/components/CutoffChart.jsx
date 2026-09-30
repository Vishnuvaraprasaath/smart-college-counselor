import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

export default function CutoffChart({ data = [], studentCutoff = 187.5, title = "Historical Cutoff Trends (2023 - 2025)" }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-mono">
        No historical cutoff chart data available for this branch.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => ({
    year: String(item.year),
    "Historical Cutoff": item.cutoff,
    "Your Cutoff": parseFloat(studentCutoff)
  }));

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
          <span className="text-[11px] text-slate-500 font-normal">Official round closing cutoffs vs candidate score</span>
        </div>
        <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          Candidate Cutoff: {studentCutoff}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
            <YAxis domain={['dataMin - 4', 'dataMax + 4']} stroke="#94A3B8" fontSize={11} fontFamily="monospace" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                borderRadius: '14px', 
                borderColor: '#1E293B', 
                color: '#FFFFFF',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#E2E8F0' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
            <Line 
              type="monotone" 
              dataKey="Historical Cutoff" 
              stroke="#4F46E5" 
              strokeWidth={3} 
              dot={{ r: 5, fill: "#4F46E5", stroke: "#FFFFFF", strokeWidth: 2 }} 
              activeDot={{ r: 7, fill: "#6366F1" }} 
            />
            <ReferenceLine 
              y={parseFloat(studentCutoff)} 
              label={{ value: `Candidate (${studentCutoff})`, fill: '#16A34A', fontSize: 10, position: 'top', fontFamily: 'monospace' }} 
              stroke="#16A34A" 
              strokeDasharray="4 4" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
