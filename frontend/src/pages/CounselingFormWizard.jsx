import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, BookOpen, Layers, MapPin, IndianRupee, Heart, User, Award, Calculator } from 'lucide-react';
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
      if (!formData.name || !formData.name.trim()) errs.name = 'Please enter student full name';
      if (formData.cutoff === '' || isNaN(parseFloat(formData.cutoff))) {
        errs.cutoff = 'Please enter a valid 12th cutoff mark (e.g., 187.50)';
      } else if (parseFloat(formData.cutoff) < 0 || parseFloat(formData.cutoff) > 200) {
        errs.cutoff = 'Cutoff mark must be between 0 and 200';
      }
    }
    if (currentStep === 3) {
      if (!formData.courses || formData.courses.length === 0) {
        errs.courses = 'Please select at least one preferred engineering branch';
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
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
    { code: 'AIML', name: 'AI & Machine Learning' },
    { code: 'IT', name: 'Information Technology' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering' },
    { code: 'MECH', name: 'Mechanical Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' },
    { code: 'CYBER', name: 'Cyber Security Engineering' },
  ];

  const availableLocations = [
    'Coimbatore', 'Chennai', 'Erode', 'Tiruppur', 'Salem', 
    'Madurai', 'Trichy', 'Namakkal', 'Hosur', 'Vellore', 'Thanjavur', 'Tirunelveli', 'Any location'
  ];

  const budgetOptions = [
    { value: 50000, label: 'Below ₹50,000 / year' },
    { value: 100000, label: '₹50,000 – ₹1,00,000 / year' },
    { value: 200000, label: '₹1,00,000 – ₹2,00,000 / year' },
    { value: 300000, label: '₹2,00,000 – ₹3,00,000 / year' },
    { value: 500000, label: 'Above ₹3,00,000 / year' },
    { value: 0, label: 'No specific budget constraint' }
  ];

  const interestOptions = [
    'Programming', 'Artificial Intelligence', 'Data Science', 'Electronics',
    'Robotics', 'Cyber Security', 'Web Development', 'Mobile Development',
    'IoT', 'Core Engineering', 'Design', 'Research', 'Entrepreneurship'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Quick Demo Trigger Banner */}
      <DemoBanner onLoadDemoData={() => {
        onLoadDemoData();
        setStep(1);
      }} />

      {/* Wizard Header & Progress */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Step {step} of {totalSteps}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              {step === 1 && 'Academic Profile & 12th Cutoff'}
              {step === 2 && 'Community Reservation Category'}
              {step === 3 && 'Preferred Engineering Branches'}
              {step === 4 && 'Geographic District Preferences'}
              {step === 5 && 'Annual Tuition Fee Ceiling'}
              {step === 6 && 'Candidate Domain Focus'}
            </h2>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 font-medium block">Progress</span>
            <span className="text-lg font-bold text-slate-900 font-mono">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Numbers Pill row */}
        <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
          {['Academic', 'Category', 'Courses', 'Location', 'Budget', 'Interests'].map((label, idx) => {
            const isDone = step > idx + 1;
            const isCurrent = step === idx + 1;
            return (
              <div 
                key={idx}
                onClick={() => isDone && setStep(idx + 1)}
                className={`py-2 px-1 rounded-lg transition-colors ${
                  isCurrent 
                    ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                    : isDone 
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium cursor-pointer border border-blue-200' 
                    : 'bg-slate-50 text-slate-400 font-medium'
                }`}
              >
                <span className="hidden sm:inline text-xs">{label}</span>
                <span className="sm:hidden font-mono font-semibold">{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM STEPS CONTENT */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-card space-y-6">
        
        {/* STEP 1: ACADEMIC INFO */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vishnu Kumar"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-slate-900 font-medium text-sm transition"
                />
                {errors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Cutoff Input Box */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900">
                    12th Engineering Cutoff Mark (Out of 200) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Formula: Maths + (Physics/2) + (Chemistry/2)
                  </span>
                </div>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="200"
                  value={formData.cutoff || ''}
                  onChange={(e) => setFormData({ ...formData, cutoff: e.target.value })}
                  placeholder="e.g. 187.50"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-3xl font-bold text-slate-900 font-mono bg-white"
                />
                {errors.cutoff && <p className="text-xs text-rose-600 font-medium">{errors.cutoff}</p>}
              </div>

              {/* Subject Marks Optional Calculator */}
              <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-semibold text-slate-800">
                      Calculate from 12th Subject Marks (Optional)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={calculateCutoffFromMarks}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    Compute Cutoff
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Mathematics (Max 100)</label>
                    <input
                      type="number"
                      max="100"
                      value={formData.math || ''}
                      onChange={(e) => setFormData({ ...formData, math: e.target.value })}
                      placeholder="e.g. 95"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Physics (Max 100)</label>
                    <input
                      type="number"
                      max="100"
                      value={formData.physics || ''}
                      onChange={(e) => setFormData({ ...formData, physics: e.target.value })}
                      placeholder="e.g. 92.5"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Chemistry (Max 100)</label>
                    <input
                      type="number"
                      max="100"
                      value={formData.chemistry || ''}
                      onChange={(e) => setFormData({ ...formData, chemistry: e.target.value })}
                      placeholder="e.g. 92.5"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-mono font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CATEGORY */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-500 font-normal">
              Community reservation categories directly determine historical cutoff thresholds in official TNEA counselling rounds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'OC', label: 'Open Competition (OC)' },
                { code: 'BC', label: 'Backward Class (BC)' },
                { code: 'MBC', label: 'Most Backward Class (MBC / DNC)' },
                { code: 'SC', label: 'Scheduled Caste (SC)' },
                { code: 'ST', label: 'Scheduled Tribe (ST)' },
              ].map((cat) => {
                const selected = formData.category === cat.code;
                return (
                  <div
                    key={cat.code}
                    onClick={() => setFormData({ ...formData, category: cat.code })}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-lg font-bold text-slate-900 font-mono">{cat.code}</span>
                      <span className="block text-xs font-medium text-slate-500 mt-0.5">{cat.label}</span>
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: COURSE PREFERENCES */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-normal">
                Select one or more engineering disciplines. Choices are evaluated in order of preference.
              </p>
              {errors.courses && <p className="text-xs text-rose-600 font-semibold">{errors.courses}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableCourses.map((crs) => {
                const selected = (formData.courses || []).includes(crs.code);
                const orderIndex = (formData.courses || []).indexOf(crs.code);
                return (
                  <div
                    key={crs.code}
                    onClick={() => toggleCourseSelect(crs.code)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selected ? `#${orderIndex + 1}` : crs.code}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{crs.code}</h4>
                        <p className="text-[11px] text-slate-500 font-normal">{crs.name}</p>
                      </div>
                    </div>
                    {selected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION PREFERENCE */}
        {step === 4 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-500 font-normal">
              Choose your preferred educational hub or district in Tamil Nadu, or select "Any location".
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableLocations.map((loc) => {
                const selected = formData.location === loc;
                return (
                  <div
                    key={loc}
                    onClick={() => setFormData({ ...formData, location: loc })}
                    className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                      selected 
                        ? 'border-blue-600 bg-blue-600 text-white font-semibold shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 mx-auto mb-1 ${selected ? 'text-white' : 'text-slate-400'}`} />
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
            <p className="text-xs text-slate-500 font-normal">
              Specify your target annual college tuition fee range to evaluate fiscal compatibility.
            </p>
            <div className="space-y-2">
              {budgetOptions.map((b) => {
                const selected = formData.budget === b.value;
                return (
                  <div
                    key={b.value}
                    onClick={() => setFormData({ ...formData, budget: b.value })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      selected 
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <IndianRupee className={`w-4 h-4 ${selected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="font-medium text-slate-900 text-xs sm:text-sm">{b.label}</span>
                    </div>
                    {selected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: INTERESTS */}
        {step === 6 && (
          <div className="space-y-5">
            <p className="text-xs text-slate-500 font-normal">
              Select specific academic interest keywords to personalize AI career advisory insights.
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const selected = (formData.interests || []).includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterestSelect(interest)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
                      selected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{interest}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* NAVIGATION CONTROL BUTTONS */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${
              step === 1 ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <span>{step === totalSteps ? 'Generate Recommendation Dossier' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}


