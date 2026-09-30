import React from 'react';
import { GraduationCap, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3.5 md:col-span-1">
            <div 
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                SmartCounsel AI
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Precision algorithmic college counseling platform analyzing multi-year TNEA cutoffs, community reservation quotas, and deterministic candidate fit.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tamil Nadu Engineering Admissions Database</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3.5">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button 
                  onClick={() => setCurrentView('landing')} 
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Overview & Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('form')} 
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Assessment Wizard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('compare')} 
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  College Comparison Matrix
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('cutoffs')} 
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Historical Cutoffs Repository
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('courses')} 
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Engineering Branches
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligence Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3.5">Intelligence</h4>
            <ul className="space-y-2.5 text-xs text-slate-500 font-normal">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>6-Factor Weighted Fit Model</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Safe / Moderate / Ambitious Tiers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Cutoff Delta & Statistical Safety Buffer</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>CounselAI Grounded Advisor</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>TNEA Choice Sheet (PDF & CSV)</span>
              </li>
            </ul>
          </div>

          {/* Trust Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Advisory Notice</span>
            </h4>
            <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              Evaluations are computed deterministically using verified historical cutoff records and student constraints. Formal counseling & seat allocation are conducted under official TNEA authority by DoTE Tamil Nadu.
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SmartCounsel AI. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
