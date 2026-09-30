import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  MapPin, 
  IndianRupee, 
  Heart, 
  User, 
  Award, 
  Calculator,
  Cpu,
  Laptop,
  Brain,
  Binary,
  Radio,
  Wrench,
  Compass,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import DemoBanner from '../components/DemoBanner';

export default function CounselingFormWizard({ onSubmitForm, formData, setFormData, onLoadDemoData }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const totalSteps = 6;

  // Auto calculate TNEA Cutoff (Math + Physics/2 + Chemistry/2)
  const calculateCutoffFromMarks = () => {
    const m = parseFloat(formData.math) || 0;
    const p = parseFloat(formData.physics) || 0;
    const c = parseFloat(formData.chemistry) || 0;

    if (m > 0 && p > 0 && c > 0) {
      const calcCutoff = (m + (p / 2) + (c / 2)).toFixed(2);
      const calcPct = (((m + p + c) / 300) * 100).toFixed(1);
      setFormData(prev => ({
        ...prev,
        cutoff: parseFloat(calcCutoff),
        percentage: parseFloat(calcPct)
      }));
    }
  };

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!formData.name || !formData.name.trim()) errs.name = 'Please enter candidate full name';
      if (formData.cutoff === '' || formData.cutoff === null || isNaN(parseFloat(formData.cutoff))) {
        errs.cutoff = 'Please enter a valid 12th cutoff mark (e.g., 187.50)';
      } else if (parseFloat(formData.cutoff) < 0 || parseFloat(formData.cutoff) > 200) {
        errs.cutoff = 'Cutoff mark must be between 0 and 200';
      }
    }
    if (currentStep === 3) {
      if (!formData.courses || formData.courses.length === 0) {
        errs.courses = 'Please select at least one preferred engineering discipline';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        onSubmitForm(formData);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCourseSelect = (code) => {
    let current = [...(formData.courses || [])];
    if (current.includes(code)) {
      current = current.filter(c => c !== code);
    } else {
      current.push(code);
    }
    setFormData({ ...formData, courses: current });
    if (errors.courses) {
      setErrors(prev => ({ ...prev, courses: null }));
    }
  };

  const toggleInterestSelect = (interest) => {
    let current = [...(formData.interests || [])];
    if (current.includes(interest)) {
      current = current.filter(i => i !== interest);
    } else {
      current.push(interest);
    }
    setFormData({ ...formData, interests: current });
  };

  const availableCourses = [
    { code: 'CSE', name: 'Computer Science & Engineering', icon: Laptop, desc: 'Software, algorithms, and systems' },
    { code: 'ECE', name: 'Electronics & Communication', icon: Radio, desc: 'Embedded systems, VLSI & IoT' },
    { code: 'AIDS', name: 'AI & Data Science', icon: Brain, desc: 'Machine learning, big data & neural nets' },
    { code: 'AIML', name: 'AI & Machine Learning', icon: Binary, desc: 'Deep learning & autonomous systems' },
    { code: 'IT', name: 'Information Technology', icon: Cpu, desc: 'Cloud, infrastructure & networks' },
    { code: 'EEE', name: 'Electrical & Electronics', icon: Sparkles, desc: 'Power systems, EVs & automation' },
    { code: 'MECH', name: 'Mechanical Engineering', icon: Wrench, desc: 'Design, thermal & robotics' },
    { code: 'CIVIL', name: 'Civil Engineering', icon: Compass, desc: 'Structural engineering & infrastructure' },
  ];

  const availableCategories = [
    { code: 'OC', label: 'Open Competition', sub: 'General merit quota open to all candidates' },
    { code: 'BC', label: 'Backward Class', sub: 'Non-creamy layer backward community quota' },
    { code: 'MBC', label: 'Most Backward Class', sub: 'MBC & DNC community reservation' },
    { code: 'SC', label: 'Scheduled Caste', sub: 'Scheduled caste community reservation quota' },
    { code: 'ST', label: 'Scheduled Tribe', sub: 'Scheduled tribe reservation quota' },
  ];

  const availableLocations = [
    'Coimbatore', 'Chennai', 'Erode', 'Tiruppur', 'Salem', 
    'Madurai', 'Trichy', 'Namakkal', 'Hosur', 'Vellore', 'Thanjavur', 'Tirunelveli', 'Any location'
  ];

  const budgetOptions = [
    { value: 50000, label: 'Below ₹50,000 / year', tag: 'Govt / Aided Rates' },
    { value: 100000, label: '₹50,000 – ₹1,00,000 / year', tag: 'Standard Tier' },
    { value: 200000, label: '₹1,00,000 – ₹2,00,000 / year', tag: 'Private Autonomous' },
    { value: 300000, label: '₹2,00,000 – ₹3,00,000 / year', tag: 'Premium Institutions' },
    { value: 500000, label: 'Above ₹3,00,000 / year', tag: 'High Cap' },
    { value: 0, label: 'No specific budget constraint', tag: 'Open Fit' }
  ];

  const interestOptions = [
    'Programming', 'Artificial Intelligence', 'Data Science', 'Electronics',
    'Robotics', 'Cyber Security', 'Web Development', 'Mobile Development',
    'IoT', 'Core Engineering', 'Design', 'Research', 'Entrepreneurship'
  ];

  const stepTitles = [
    { num: '01', title: 'Profile & Cutoff', desc: 'Candidate marks and normalized score' },
    { num: '02', title: 'Reservation Quota', desc: 'TNEA community category' },
    { num: '03', title: 'Branch Preferences', desc: 'Target engineering disciplines' },
    { num: '04', title: 'Location Preferences', desc: 'Geographic districts in Tamil Nadu' },
    { num: '05', title: 'Tuition Ceiling', desc: 'Annual fiscal feasibility range' },
    { num: '06', title: 'Domain Interests', desc: 'Curriculum & career alignment' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Demo Banner */}
      <DemoBanner onLoadDemoData={() => {
        onLoadDemoData();
        setStep(1);
      }} />

      {/* ========================================================================= */}
      {/* WIZARD JOURNEY HEADER                                                     */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        
        {/* Title & Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 inline-block mb-1.5">
              Your Counseling Journey
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stepTitles[step - 1].title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              {stepTitles[step - 1].desc}
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block">Step {step} of {totalSteps}</span>
              <span className="text-lg font-mono font-bold text-indigo-600">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
              <div 
                className="absolute inset-0 rounded-full border-4 border-indigo-600 transition-all duration-300"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${(step / totalSteps) * 100}%, 0 ${(step / totalSteps) * 100}%)`
                }}
              />
              <span className="text-xs font-mono font-bold text-slate-700">{step}/{totalSteps}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full shadow-xs"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Numbers Nav Strip */}
        <div className="grid grid-cols-6 gap-2 pt-1 text-center">
          {stepTitles.map((st, idx) => {
            const isDone = step > idx + 1;
            const isCurrent = step === idx + 1;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => isDone && setStep(idx + 1)}
                disabled={!isDone && !isCurrent}
                className={`py-2 px-1 rounded-xl text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs ring-2 ring-indigo-600/20'
                    : isDone
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer border border-indigo-200/60'
                    : 'bg-slate-50 text-slate-400 cursor-default'
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  ) : (
                    <span className="font-mono font-bold">{st.num}</span>
                  )}
                  <span className="hidden md:inline truncate">{st.title.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* WIZARD CARD CONTENT                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white p-6 sm:p-9 rounded-3xl border border-slate-200/90 shadow-card space-y-7">
        
        {/* STEP 1: ACADEMICS & 12TH CUTOFF */}
        {step === 1 && (
          <div className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Candidate Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vishnu Kumar"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition shadow-inner"
              />
              {errors.name && (
                <p className="text-xs text-rose-600 font-semibold mt-1.5 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Cutoff Input Highlight Box */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  12th Engineering Cutoff Mark (Out of 200) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60 self-start sm:self-auto">
                  Formula: Maths + (Physics / 2) + (Chemistry / 2)
                </span>
              </div>
              <input
                type="number"
                step="0.25"
                min="0"
                max="200"
                value={formData.cutoff ?? ''}
                onChange={(e) => setFormData({ ...formData, cutoff: e.target.value })}
                placeholder="187.50"
                className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-white text-3xl sm:text-4xl font-black text-slate-900 font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/15 focus:outline-none transition"
              />
              {errors.cutoff && (
                <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.cutoff}</span>
                </p>
              )}
              <span className="text-xs text-slate-500 block">
                Standard normalized cutoff used across all rounds of TNEA engineering counselling.
              </span>
            </div>

            {/* Optional Subject Marks Breakdown Calculator */}
            <div className="border border-slate-200 p-5 rounded-2xl space-y-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Calculate from 12th Board Marks (Optional)
                    </h4>
                    <span className="text-[11px] text-slate-500">Auto-fill cutoff by entering subject marks</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={calculateCutoffFromMarks}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition border border-indigo-200/60"
                >
                  Compute Cutoff
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mathematics (100)
                  </label>
                  <input
                    type="number"
                    max="100"
                    value={formData.math || ''}
                    onChange={(e) => setFormData({ ...formData, math: e.target.value })}
                    placeholder="95"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Physics (100)
                  </label>
                  <input
                    type="number"
                    max="100"
                    value={formData.physics || ''}
                    onChange={(e) => setFormData({ ...formData, physics: e.target.value })}
                    placeholder="92.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Chemistry (100)
                  </label>
                  <input
                    type="number"
                    max="100"
                    value={formData.chemistry || ''}
                    onChange={(e) => setFormData({ ...formData, chemistry: e.target.value })}
                    placeholder="92.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: RESERVATION CATEGORY */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Select your Community Reservation Category</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                TNEA allocates seats strictly according to Tamil Nadu state reservation quotas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableCategories.map((cat) => {
                const selected = formData.category === cat.code;
                return (
                  <div
                    key={cat.code}
                    onClick={() => setFormData({ ...formData, category: cat.code })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                      selected 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-xs' 
                        : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-slate-900 font-mono">{cat.code}</span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                          {cat.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-1">{cat.sub}</p>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                      selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: COURSE PREFERENCES */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">What are you interested in studying?</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Select one or more engineering disciplines. Priorities are weighted in the order selected.
                </p>
              </div>
              {errors.courses && (
                <span className="text-xs font-semibold text-rose-600 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.courses}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableCourses.map((crs) => {
                const Icon = crs.icon;
                const isSelected = (formData.courses || []).includes(crs.code);
                const orderIndex = (formData.courses || []).indexOf(crs.code);

                return (
                  <div
                    key={crs.code}
                    onClick={() => toggleCourseSelect(crs.code)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-xs' 
                        : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{crs.code}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-mono font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                              Choice #{orderIndex + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{crs.name}</p>
                        <p className="text-[11px] text-slate-400 font-normal">{crs.desc}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION PREFERENCE */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Choose your Preferred Geographic District</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Select your preferred educational district in Tamil Nadu, or choose "Any location".
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {availableLocations.map((loc) => {
                const selected = formData.location === loc;
                return (
                  <div
                    key={loc}
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all duration-150 ${
                      selected 
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20' 
                        : 'border-slate-200/90 hover:border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className={`w-4 h-4 mx-auto mb-1 ${selected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-xs">{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: BUDGET PREFERENCE */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Annual Tuition Fee Target</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Specify your estimated annual college tuition ceiling to calculate fiscal feasibility scores.
              </p>
            </div>

            <div className="space-y-2.5">
              {budgetOptions.map((b) => {
                const selected = formData.budget === b.value;
                return (
                  <div
                    key={b.value}
                    onClick={() => setFormData({ ...formData, budget: b.value })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-150 flex items-center justify-between ${
                      selected 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20 shadow-xs' 
                        : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <IndianRupee className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{b.label}</span>
                        <span className="text-xs text-slate-400 block">{b.tag}</span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                      selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: INTERESTS & DOMAINS */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic & Career Domain Interests</h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Select your focus areas to personalize CounselAI advisory notes and career match weights.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {interestOptions.map((interest) => {
                const selected = (formData.interests || []).includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterestSelect(interest)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-2 ${
                      selected 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{interest}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* NAVIGATION CONTROLS                                                       */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all ${
              step === 1 
                ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
          >
            <span>{step === totalSteps ? 'Generate Recommendation Dossier' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
