import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CounselingFormWizard from './pages/CounselingFormWizard';
import AnalysisLoadingPage from './pages/AnalysisLoadingPage';
import ResultsDashboard from './pages/ResultsDashboard';
import CollegeDetailPage from './pages/CollegeDetailPage';
import CollegeComparisonPage from './pages/CollegeComparisonPage';
import CutoffTrendsPage from './pages/CutoffTrendsPage';
import CourseExplorerPage from './pages/CourseExplorerPage';
import AICounselorChat from './pages/AICounselorChat';
import StudentProfilePage from './pages/StudentProfilePage';
import { analyzeProfile, fetchHistoricalAnalysisById } from './services/api';

const STORAGE_KEYS = {
  PROFILE: 'smartCounsel_activeProfile',
  STUDENT_ID: 'smartCounsel_studentId',
  ANALYSIS_DATA: 'smartCounsel_analysisData',
  CURRENT_VIEW: 'smartCounsel_currentView'
};

export default function App() {
  // Safe helper to read stored state on startup
  const getInitialState = () => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedAnalysis = localStorage.getItem(STORAGE_KEYS.ANALYSIS_DATA);
      const storedView = localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);
      const storedId = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);

      if (storedProfile && storedAnalysis) {
        const parsedProfile = JSON.parse(storedProfile);
        const parsedAnalysis = JSON.parse(storedAnalysis);

        if (parsedProfile && parsedProfile.cutoff && parsedAnalysis && Array.isArray(parsedAnalysis.recommendations)) {
          return {
            activeProfile: parsedProfile,
            analysisData: parsedAnalysis,
            studentId: storedId ? parseInt(storedId) : null,
            currentView: (storedView && ['results', 'profile', 'compare', 'cutoffs', 'courses', 'chat'].includes(storedView)) ? storedView : 'results'
          };
        }
      }
    } catch (err) {
      console.warn('Failed to restore session from localStorage, starting fresh:', err);
      // Clean invalid keys
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    }

    return {
      activeProfile: null,
      analysisData: null,
      studentId: null,
      currentView: 'landing'
    };
  };

  const initialState = getInitialState();

  const [currentView, setCurrentView] = useState(initialState.currentView);
  const [activeProfile, setActiveProfile] = useState(initialState.activeProfile);
  const [analysisData, setAnalysisData] = useState(initialState.analysisData);
  const [studentId, setStudentId] = useState(initialState.studentId);
  const [selectedCollegeId, setSelectedCollegeId] = useState(null);
  const [detailReturnView, setDetailReturnView] = useState('results');
  const [comparedColleges, setComparedColleges] = useState([]);
  const [pendingFormData, setPendingFormData] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Vishnu',
    cutoff: 187.5,
    math: 95,
    physics: 92.5,
    chemistry: 92.5,
    percentage: 93.3,
    entrance_score: null,
    category: 'BC',
    courses: ['ECE', 'CSE'],
    location: 'Coimbatore',
    budget: 150000,
    interests: ['Electronics', 'IoT', 'Programming']
  });

  // Sync state changes to localStorage safely
  useEffect(() => {
    try {
      if (activeProfile && analysisData) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(activeProfile));
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_DATA, JSON.stringify(analysisData));
        if (studentId) localStorage.setItem(STORAGE_KEYS.STUDENT_ID, String(studentId));
        localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, currentView);
      } else {
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_DATA);
        localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
        localStorage.setItem(STORAGE_KEYS.CURRENT_VIEW, currentView);
      }
    } catch (err) {
      console.warn('Failed to save session state to localStorage:', err);
    }
  }, [activeProfile, analysisData, studentId, currentView]);

  // Load standard Demo Data
  const handleLoadDemoData = () => {
    const demoPayload = {
      name: 'Demonstration Student',
      cutoff: 187.5,
      math: 95,
      physics: 92.5,
      chemistry: 92.5,
      percentage: 93.3,
      entrance_score: null,
      category: 'BC',
      courses: ['ECE', 'CSE', 'AIDS'],
      location: 'Coimbatore',
      budget: 150000,
      interests: ['Electronics', 'IoT', 'Artificial Intelligence']
    };
    setFormData(demoPayload);
  };

  // Clear Session Handler (Removes only smartCounsel_* keys)
  const handleClearSession = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (err) {
      console.warn('Error clearing localStorage keys:', err);
    }
    setActiveProfile(null);
    setAnalysisData(null);
    setStudentId(null);
    setSelectedCollegeId(null);
    setComparedColleges([]);
    setCurrentView('landing');
  };

  // Form Submission Handler
  const handleSubmitForm = async (dataToSubmit) => {
    setPendingFormData(dataToSubmit);
    setCurrentView('analyzing');
  };

  // Called when AnalysisLoadingPage finishes animation
  const handleLoadingComplete = async () => {
    const payload = pendingFormData || formData;
    try {
      const result = await analyzeProfile(payload);
      setAnalysisData(result);
      setActiveProfile(result.studentProfile);
      setStudentId(result.studentId || null);
      setCurrentView('results');
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Failed to calculate recommendations: ' + err.message);
      setCurrentView('form');
    }
  };

  const handleSelectCollegeDetail = (id, fromView = 'results') => {
    setSelectedCollegeId(id);
    setDetailReturnView(fromView);
    setCurrentView('detail');
  };

  // Historical Analysis Reopen Handler (DO NOT re-calculate, load stored database results)
  const handleSelectHistoricalAnalysis = async (id) => {
    try {
      const data = await fetchHistoricalAnalysisById(id);
      if (data && data.success) {
        setAnalysisData(data);
        setActiveProfile(data.studentProfile);
        setStudentId(data.studentId);
        // Sync formData so user can see or modify this profile in wizard if desired
        if (data.studentProfile) {
          setFormData(prev => ({
            ...prev,
            name: data.studentProfile.name || prev.name,
            cutoff: data.studentProfile.cutoff || prev.cutoff,
            category: data.studentProfile.category || prev.category,
            courses: data.studentProfile.courses || prev.courses,
            location: data.studentProfile.location || prev.location,
            budget: data.studentProfile.budget || prev.budget,
            interests: data.studentProfile.interests || prev.interests
          }));
        }
        setCurrentView('results');
      } else {
        alert('Failed to reopen stored recommendations for analysis ID #' + id);
      }
    } catch (err) {
      console.error('Failed to reopen historical analysis:', err);
      alert('Could not reopen analysis: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        activeProfile={activeProfile} 
        onClearSession={handleClearSession}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage 
            setCurrentView={setCurrentView} 
            onLoadDemoData={() => {
              handleLoadDemoData();
              setCurrentView('form');
            }} 
          />
        )}

        {currentView === 'form' && (
          <CounselingFormWizard 
            onSubmitForm={handleSubmitForm}
            formData={formData}
            setFormData={setFormData}
            onLoadDemoData={handleLoadDemoData}
          />
        )}

        {currentView === 'analyzing' && (
          <AnalysisLoadingPage onComplete={handleLoadingComplete} />
        )}

        {currentView === 'results' && (
          <ResultsDashboard 
            analysisData={analysisData}
            onSelectDetail={handleSelectCollegeDetail}
            setCurrentView={setCurrentView}
            comparedColleges={comparedColleges}
            setComparedColleges={setComparedColleges}
            onClearSession={handleClearSession}
          />
        )}

        {currentView === 'detail' && (
          <CollegeDetailPage 
            collegeId={selectedCollegeId}
            activeProfile={activeProfile}
            onBack={() => setCurrentView(detailReturnView || 'results')}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'compare' && (
          <CollegeComparisonPage 
            comparedColleges={comparedColleges}
            setComparedColleges={setComparedColleges}
            activeProfile={activeProfile}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'cutoffs' && (
          <CutoffTrendsPage />
        )}

        {currentView === 'courses' && (
          <CourseExplorerPage onSelectDetail={(id) => handleSelectCollegeDetail(id, 'courses')} />
        )}

        {currentView === 'chat' && (
          <AICounselorChat activeProfile={activeProfile} />
        )}

        {currentView === 'profile' && (
          <StudentProfilePage 
            activeProfile={activeProfile}
            analysisData={analysisData}
            studentId={studentId}
            setCurrentView={setCurrentView}
            onSelectHistoricalAnalysis={handleSelectHistoricalAnalysis}
            onClearSession={handleClearSession}
          />
        )}
      </main>

      <Footer setCurrentView={setCurrentView} />

    </div>
  );
}
