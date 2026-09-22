import React from 'react';
import { 
  Compass, 
  Search, 
  LineChart, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  Building2, 
  BookOpen, 
  Layers,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import DemoBanner from '../components/DemoBanner';

export default function LandingPage({ setCurrentView, onLoadDemoData }) {
  return (
    <div className="space-y-14 pb-16">
      
      {/* ENTERPRISE HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide">
              Official TNEA 2023–2025 Cutoff Database
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Intelligent Engineering Admissions. <br className="hidden sm:inline" />
            <span className="text-blue-600">Decisions Grounded in Data.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Deterministic suitability modeling using verified TNEA cutoff trends, community reservation quotas, branch preferences, and grounded AI advisory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('form')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4" />
              <span>Start Admission Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('cutoffs')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explore Cutoff Database</span>
            </button>
          </div>

          {/* Quick KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-8 border-t border-slate-100 text-left">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-2xl font-bold text-slate-900 font-mono">100%</span>
              <span className="text-xs text-slate-500 font-medium">Deterministic Scoring Formula</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-2xl font-bold text-emerald-600 font-mono">Safe / Mod / Amb</span>
              <span className="text-xs text-slate-500 font-medium">3-Tier Strategy Matrix</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-2xl font-bold text-blue-600 font-mono">2023 – 2025</span>
              <span className="text-xs text-slate-500 font-medium">Verified Historical Cutoffs</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-2xl font-bold text-slate-900 font-mono">CounselAI</span>
              <span className="text-xs text-slate-500 font-medium">Database-Grounded Advisory</span>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* DEMO LAUNCH BANNER */}
        <DemoBanner onLoadDemoData={onLoadDemoData} />

        {/* HOW IT WORKS */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Systematic Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How SmartCounsel AI Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm font-normal">
              Eliminating subjective guesswork through transparent cutoff delta modeling and weighted suitability scoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Candidate Profile Intake', desc: 'Input 12th marks to calculate normalized cutoff (out of 200), community category (BC, OC, MBC, SC, ST), and preferred districts.', icon: BookOpen },
              { step: '02', title: 'Multi-Year Cutoff Matching', desc: 'The engine queries verified TNEA cutoffs across past cycles to establish your admission delta with statistical buffer.', icon: LineChart },
              { step: '03', title: '6-Factor Suitability Scoring', desc: 'Calculates an audited fit index (55% Cutoff, 15% Course, 10% Location, 10% Budget, 5% NIRF, 5% Placement).', icon: Layers },
              { step: '04', title: 'TNEA Choice Strategy', desc: 'Generates a balanced 3:3:2 choice filling schedule (Safe, Moderate, Ambitious) with instant PDF and CSV export.', icon: MessageSquare },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-card relative group hover:border-slate-300 transition-colors">
                  <span className="text-2xl font-bold font-mono text-slate-300 absolute top-4 right-4">
                    {st.step}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CORE PLATFORM CAPABILITIES */}
        <section className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Engine Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Core Decision Support Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Deterministic Match Engine', desc: 'No generative guesswork. Suitability is computed purely through weighted academic criteria and regression analysis.', icon: Layers },
              { title: 'Safe / Moderate / Ambitious Matrix', desc: 'Options are classified strictly by cutoff delta into Safe, Moderate, and Ambitious tiers to mitigate risk.', icon: Award },
              { title: 'Cutoff Trend Visualizer', desc: 'Multi-year interactive charts comparing student marks with official 2023–2025 opening and closing closing cutoffs.', icon: LineChart },
              { title: 'Fiscal & Regional Filters', desc: 'Match institutions by annual tuition fees, hostel facilities, and specific districts across Tamil Nadu.', icon: Building2 },
              { title: 'Side-by-Side Comparison', desc: 'Evaluate up to three institutions simultaneously across rankings, placement percentages, and fee structures.', icon: Compass },
              { title: 'CounselAI Grounded Assistant', desc: 'Advisory chatbot strictly querying database records to answer cutoff viability and college inquiries.', icon: MessageSquare },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white text-blue-600 border border-slate-200 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SAMPLE ADVISORY REPORT PREVIEW */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Evaluation Sample</span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Benchmark Admission Report (Cutoff: 187.50 • BC Category)</h3>
            </div>
            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
            >
              Assess Your Cutoff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Safe Option */}
            <div className="border border-emerald-200 bg-emerald-50/50 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider bg-emerald-100 text-emerald-800 rounded flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>SAFE TIER</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">+3.25 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Bannari Amman Inst. of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5">ECE • Sathyamangalam (Erode)</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-emerald-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Historical Cutoff:</span><strong className="text-slate-900">184.25</strong></div>
                <div className="flex justify-between text-slate-500"><span>Student Score:</span><strong className="text-emerald-700 font-bold">187.50</strong></div>
              </div>
            </div>

            {/* Moderate Option */}
            <div className="border border-amber-200 bg-amber-50/50 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider bg-amber-100 text-amber-800 rounded flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-700" />
                  <span>MODERATE TARGET</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-700">-2.00 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Kumaraguru College of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5">ECE • Coimbatore</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-amber-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Historical Cutoff:</span><strong className="text-slate-900">189.50</strong></div>
                <div className="flex justify-between text-slate-500"><span>Student Score:</span><strong className="text-amber-700 font-bold">187.50</strong></div>
              </div>
            </div>

            {/* Ambitious Option */}
            <div className="border border-rose-200 bg-rose-50/50 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider bg-rose-100 text-rose-800 rounded flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-rose-700" />
                  <span>AMBITIOUS TARGET</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">-4.00 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Government College of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5">ECE • Coimbatore</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-lg border border-rose-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Historical Cutoff:</span><strong className="text-slate-900">191.50</strong></div>
                <div className="flex justify-between text-slate-500"><span>Student Score:</span><strong className="text-rose-700 font-bold">187.50</strong></div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

