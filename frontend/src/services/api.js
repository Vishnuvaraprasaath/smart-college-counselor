const API_BASE = '/api';

export const analyzeProfile = async (formData) => {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze profile');
  }
  return await response.json();
};

export const fetchColleges = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE}/colleges?${params}`);
  if (!response.ok) throw new Error('Failed to fetch colleges');
  return await response.json();
};

export const fetchCollegeById = async (id, cutoff = 187.5, category = 'BC') => {
  const response = await fetch(`${API_BASE}/colleges/${id}?cutoff=${cutoff}&category=${category}`);
  if (!response.ok) throw new Error('Failed to fetch college details');
  return await response.json();
};

export const compareColleges = async (ids = [], course = 'ECE', category = 'BC', cutoff = 187.5) => {
  const idStr = ids.join(',');
  const response = await fetch(`${API_BASE}/compare?ids=${idStr}&course=${course}&category=${category}&cutoff=${cutoff}`);
  if (!response.ok) throw new Error('Failed to compare colleges');
  return await response.json();
};

export const fetchCutoffs = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE}/cutoffs?${params}`);
  if (!response.ok) throw new Error('Failed to fetch cutoff trends');
  return await response.json();
};

export const fetchCourses = async () => {
  const response = await fetch(`${API_BASE}/courses`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  return await response.json();
};

export const fetchCourseById = async (id) => {
  const response = await fetch(`${API_BASE}/courses/${id}`);
  if (!response.ok) throw new Error('Failed to fetch course details');
  return await response.json();
};

export const sendAIChatMessage = async (message, context = {}) => {
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  });
  if (!response.ok) throw new Error('Failed to reach AI Counsellor');
  return await response.json();
};

export const fetchAnalysisHistory = async () => {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error('Failed to fetch analysis history');
  return await response.json();
};

export const fetchHistoricalAnalysisById = async (id) => {
  const response = await fetch(`${API_BASE}/history/${id}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch historical analysis');
  }
  return await response.json();
};

