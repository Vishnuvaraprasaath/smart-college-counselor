import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">SmartCounsel AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic engineering admission counseling platform analyzing multi-year TNEA cutoffs, community reservation quotas, and candidate suitability.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>TNEA Counseling Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => setCurrentView('landing')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('form')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  Counseling Assessment
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('compare')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  College Comparison
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('cutoffs')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  Cutoff Trend Database
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('courses')} className="text-slate-600 hover:text-blue-600 transition-colors">
                  Branch Explorer
                </button>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Analytical Features</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                <span>6-Factor Weighted Suitability Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                <span>3-Tier Classification (Safe / Mod / Amb)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                <span>Cutoff Delta & Statistical Safety Buffer</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                <span>CounselAI Grounded Q&A Assistant</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                <span>Official TNEA Choice List (PDF & CSV)</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Trust */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Advisory Notice</span>
            </h4>
            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Evaluations are estimated using historical cutoff benchmarks and candidate preference parameters. Official seat allocations are governed by the Directorate of Technical Education (DoTE) Tamil Nadu.
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartCounsel AI. Engineering Admission Decision Platform.</p>
          <div className="flex items-center space-x-3 mt-2 sm:mt-0 font-mono text-[11px] text-slate-400">
            <span>React</span>
            <span>•</span>
            <span>Express</span>
            <span>•</span>
            <span>MySQL</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


