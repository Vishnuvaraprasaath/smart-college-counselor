import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

export default function CutoffChart({ data = [], studentCutoff = 187.5, title = "Historical Cutoff Trends (2023 - 2025)" }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 bg-[#FAF9F5] border border-[#E8E5DD] rounded-2xl flex items-center justify-center text-neutral-400 text-xs font-mono">
        No historical cutoff chart data available.
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
    <div className="bg-white p-6 rounded-3xl border border-[#E8E5DD] shadow-[0_2px_16px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[#111318] tracking-tight">{title}</h4>
        <span className="text-xs font-mono font-bold bg-[#FAF8F2] text-[#8A7139] border border-[#EAE3D2] px-2.5 py-0.5 rounded-md self-start sm:self-auto">
          Candidate Cutoff: {studentCutoff}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE1" />
            <XAxis dataKey="year" stroke="#8E8B82" fontSize={11} fontFamily="monospace" />
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} stroke="#8E8B82" fontSize={11} fontFamily="monospace" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#111318', 
                borderRadius: '12px', 
                borderColor: '#262C3D', 
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#E2DFD8' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
            <Line 
              type="monotone" 
              dataKey="Historical Cutoff" 
              stroke="#111318" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: "#D4AF37", stroke: "#111318", strokeWidth: 1 }} 
              activeDot={{ r: 6, fill: "#D4AF37" }} 
            />
            <ReferenceLine 
              y={parseFloat(studentCutoff)} 
              label={{ value: `Candidate (${studentCutoff})`, fill: '#1E7245', fontSize: 10, position: 'top', fontFamily: 'monospace' }} 
              stroke="#1E7245" 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

