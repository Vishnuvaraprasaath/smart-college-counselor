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
  Check,
  TrendingUp,
  Sliders,
  ChevronRight,
  MapPin,
  IndianRupee,
  Star
} from 'lucide-react';
import DemoBanner from '../components/DemoBanner';

export default function LandingPage({ setCurrentView, onLoadDemoData }) {
  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH PRODUCT PREVIEW                                      */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/50">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
                  AI-POWERED COLLEGE COUNSELLING
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Find the right college. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-800">
                  Make the right decision.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Get personalized college recommendations based on your academic profile, interests, preferences, budget and career goals.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => setCurrentView('form')}
                  className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Start My Counseling</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setCurrentView('colleges')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Explore Colleges</span>
                </button>
              </div>

              {/* Trust Indicators Strip */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified TNEA Cutoff Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Deterministic Fit Model</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Safe, Moderate & Ambitious Tiers</span>
                </div>
              </div>

            </div>

            {/* RIGHT: REALISTIC HERO PRODUCT PREVIEW */}
            <div className="lg:col-span-5 relative">
              
              {/* Product Mockup Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated p-6 space-y-5 transition-all hover:border-slate-300">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-none">Your Recommendations</h4>
                      <span className="text-[11px] text-slate-500 font-medium">Based on your verified profile</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Match
                  </span>
                </div>

                {/* College Highlight Card */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 inline-block mb-1">
                        CSE • TNEA 2006
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">
                        PSG College of Technology
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                        Coimbatore • Autonomous
                      </p>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-mono font-bold text-sm shadow-xs flex items-center space-x-1">
                        <span>92%</span>
                        <span className="text-[10px] font-sans font-normal opacity-90">Match</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mt-1 font-mono">
                        Safe Target
                      </span>
                    </div>
                  </div>

                  {/* Cutoff Row */}
                  <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-center font-mono text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-sans uppercase">2025 Cutoff</span>
                      <strong className="text-slate-800">188.50</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-sans uppercase">Your Score</span>
                      <strong className="text-slate-900 font-bold">191.00</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-sans uppercase">Buffer</span>
                      <strong className="text-emerald-600 font-bold">+2.50</strong>
                    </div>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Academic fit</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Career interest</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Budget fit</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Location preference</span>
                    </div>
                  </div>

                  {/* Mock Action */}
                  <button 
                    onClick={() => setCurrentView('form')}
                    className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold border border-slate-200 transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <span>View Assessment Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                  <span>NIRF Rank #63 • 96% Placed</span>
                  <span>Avg Package: ₹8.5 LPA</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Personalized Matches</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Cutoffs, reservation quotas, and branch aspirations evaluated together.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">AI-Assisted Guidance</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              CounselAI grounds queries against verified database cutoff records.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Student-Friendly UX</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Transparent, intuitive steps from 12th marks to TNEA choice list.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <LineChart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Data-Driven Decisions</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Deterministic 6-factor model eliminates subjective guesswork.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DEMO LAUNCH BANNER                                                     */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoBanner onLoadDemoData={onLoadDemoData} />
      </div>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-2.5">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Systematic Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm font-normal">
            Four simple steps to transform your academic scores into a risk-mitigated college admission roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { 
              step: '01', 
              title: 'Build your profile', 
              desc: 'Enter your 12th marks to calculate your TNEA cutoff (out of 200) and select your community reservation category.', 
              icon: BookOpen 
            },
            { 
              step: '02', 
              title: 'Set your preferences', 
              desc: 'Choose your preferred engineering branches, geographic district hubs, and target annual tuition fee ceiling.', 
              icon: Sliders 
            },
            { 
              step: '03', 
              title: 'Get recommendations', 
              desc: 'Our engine computes suitability and categorizes institutions into Safe, Moderate, and Ambitious tiers.', 
              icon: Layers 
            },
            { 
              step: '04', 
              title: 'Compare and decide', 
              desc: 'Compare options side-by-side, consult CounselAI advisory, and download your 3:3:2 TNEA choice list.', 
              icon: Compass 
            },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <div 
                key={i} 
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-200 group-hover:text-indigo-200 transition-colors">
                      {st.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{st.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. CORE PLATFORM CAPABILITIES                                             */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Comprehensive Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Precision Decision Making
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { 
                title: 'Deterministic Match Engine', 
                desc: 'Suitability is computed strictly using weighted academic criteria (55% Cutoff, 15% Branch, 10% Location, 10% Budget, 5% NIRF, 5% Placement).', 
                icon: Layers 
              },
              { 
                title: '3-Tier Risk Classification', 
                desc: 'Options are classified strictly by cutoff delta into Safe, Moderate, and Ambitious tiers to protect students from counselling rejection.', 
                icon: Award 
              },
              { 
                title: 'Multi-Year Cutoff Trends', 
                desc: 'Query verified 2023–2025 opening and closing cutoffs across OC, BC, MBC, SC, and ST community quotas with visual delta indicators.', 
                icon: LineChart 
              },
              { 
                title: 'Fiscal & Regional Filters', 
                desc: 'Filter institutions by annual tuition fees, hostel availability, and district hubs across Tamil Nadu.', 
                icon: Building2 
              },
              { 
                title: 'Side-by-Side Comparison', 
                desc: 'Evaluate up to three institutions simultaneously across rankings, placement rates, fees, and historical cutoffs.', 
                icon: Compass 
              },
              { 
                title: 'CounselAI Grounded Assistant', 
                desc: 'Advisory chatbot strictly querying database records to answer cutoff viability and college inquiries without hallucinations.', 
                icon: MessageSquare 
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-2.5 hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 border border-slate-200 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SAMPLE BENCHMARK ADMISSION REPORT PREVIEW                              */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Benchmark Sample
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Evaluated Strategy Dossier (Cutoff: 187.50 • BC Quota)
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition shadow-xs"
            >
              Assess Your Cutoff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Safe Option */}
            <div className="border border-emerald-200 bg-emerald-50/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>SAFE TIER</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700">+3.25 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Bannari Amman Inst. of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">ECE • Sathyamangalam (Erode)</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-emerald-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Cutoff:</span><strong className="text-slate-900">184.25</strong></div>
                <div className="flex justify-between text-slate-500"><span>Your Score:</span><strong className="text-emerald-700 font-bold">187.50</strong></div>
              </div>
            </div>

            {/* Moderate Option */}
            <div className="border border-amber-200 bg-amber-50/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-800 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-amber-700" />
                  <span>MODERATE TARGET</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-700">-2.00 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Kumaraguru College of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">ECE • Coimbatore</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-amber-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Cutoff:</span><strong className="text-slate-900">189.50</strong></div>
                <div className="flex justify-between text-slate-500"><span>Your Score:</span><strong className="text-amber-700 font-bold">187.50</strong></div>
              </div>
            </div>

            {/* Ambitious Option */}
            <div className="border border-rose-200 bg-rose-50/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-100 text-rose-800 rounded-md flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-rose-700" />
                  <span>AMBITIOUS REACH</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-700">-4.00 Delta</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">Government College of Tech</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">ECE • Coimbatore</p>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-rose-100 font-mono">
                <div className="flex justify-between text-slate-500"><span>Cutoff:</span><strong className="text-slate-900">191.50</strong></div>
                <div className="flex justify-between text-slate-500"><span>Your Score:</span><strong className="text-rose-700 font-bold">187.50</strong></div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
