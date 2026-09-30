import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Compass, 
  GitCompare, 
  LineChart, 
  BookOpen, 
  Bot, 
  User, 
  Menu, 
  X, 
  RotateCcw,
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, activeProfile, onClearSession }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Home', icon: GraduationCap },
    { id: 'colleges', label: 'TN Colleges', icon: Building2, badge: 'TN Only' },
    { id: 'form', label: 'Counseling', icon: Compass },
    { id: 'results', label: 'Recommendations', icon: Sparkles, badge: activeProfile ? 'Active' : null },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'cutoffs', label: 'Cutoffs', icon: LineChart },
    { id: 'courses', label: 'Branches', icon: BookOpen },
    { id: 'chat', label: 'CounselAI', icon: Bot },
    { id: 'profile', label: 'Dossier', icon: User },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-subtle py-2.5' 
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Identity / Logo */}
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-[1.02] transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  SmartCounsel
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                  AI
                </span>
              </div>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 tracking-normal">
                Engineering Admission Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Compact Desktop Navigation (for md and lg screens) */}
          <nav className="hidden md:flex xl:hidden items-center space-x-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'profile' 
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              More...
            </button>
          </nav>

          {/* Right Action CTA & Reset Controls */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {activeProfile && onClearSession && (
              <button
                onClick={onClearSession}
                title="Reset active session and start fresh"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span className="text-[11px]">Reset</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 shadow-sm shadow-indigo-500/20 hover:shadow-md hover:shadow-indigo-500/30"
            >
              <span>Start Counseling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {activeProfile && onClearSession && (
              <button
                onClick={() => {
                  onClearSession();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium flex items-center justify-center space-x-1.5 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Current Session</span>
              </button>
            )}
            <button
              onClick={() => {
                setCurrentView('form');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm shadow-indigo-500/20"
            >
              <span>Start Counseling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
