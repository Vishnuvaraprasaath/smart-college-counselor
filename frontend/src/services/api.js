// In production (Vercel), VITE_API_URL points to the Railway/cloud backend.
// In local development, Vite proxies /api → localhost:5000 or reaches VITE_API_URL.
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const cleaned = envUrl.trim().replace(/\/+$/, '');
  return cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;
};

const API_BASE = getApiBase();

/**
 * Robust fetch wrapper that ensures:
 * 1. Network / connection errors report "Unable to connect to the counseling service. Please try again."
 * 2. Database errors report "Database connection unavailable. Please start MySQL and try again."
 * 3. Never displays raw Sequelize stack traces to users.
 */
async function safeFetch(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new Error('Unable to connect to the counseling service. Please try again.');
  }

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      try {
        errorData = { message: await response.text() };
      } catch (e2) {}
    }

    const rawMsg = (errorData.error || errorData.message || '').toString();
    const isDb = 
      rawMsg.toLowerCase().includes('database') ||
      rawMsg.toLowerCase().includes('mysql') ||
      rawMsg.toLowerCase().includes('sequelize') ||
      rawMsg.toLowerCase().includes('econnrefused') ||
      response.status === 503;

    if (isDb) {
      throw new Error('Database connection unavailable. Please start MySQL and try again.');
    }

    throw new Error(rawMsg || 'Unable to connect to the counseling service. Please try again.');
  }

  return await response.json();
}

export const analyzeProfile = async (formData) => {
  return await safeFetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
};

export const fetchColleges = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await safeFetch(`${API_BASE}/colleges?${params}`);
};

export const fetchCollegeById = async (id, cutoff = 187.5, category = 'BC') => {
  return await safeFetch(`${API_BASE}/colleges/${id}?cutoff=${cutoff}&category=${category}`);
};

export const compareColleges = async (ids = [], course = 'ECE', category = 'BC', cutoff = 187.5) => {
  const idStr = ids.join(',');
  return await safeFetch(`${API_BASE}/compare?ids=${idStr}&course=${course}&category=${category}&cutoff=${cutoff}`);
};

export const fetchCutoffs = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return await safeFetch(`${API_BASE}/cutoffs?${params}`);
};

export const fetchCourses = async () => {
  return await safeFetch(`${API_BASE}/courses`);
};

export const fetchCourseById = async (id) => {
  return await safeFetch(`${API_BASE}/courses/${id}`);
};

export const sendAIChatMessage = async (message, context = {}) => {
  return await safeFetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context })
  });
};

export const fetchAnalysisHistory = async () => {
  return await safeFetch(`${API_BASE}/history`);
};

export const fetchHistoricalAnalysisById = async (id) => {
  return await safeFetch(`${API_BASE}/history/${id}`);
};

// ── Tamil Nadu Engineering Colleges & TNEA APIs ──────────────────────────────
export const fetchTamilNaduDistricts = async () => {
  return await safeFetch(`${API_BASE}/tamilnadu/districts`);
};

export const fetchTamilNaduColleges = async (filters = {}) => {
  const cleanFilters = {};
  Object.keys(filters).forEach(k => {
    if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '' && filters[k] !== 'All') {
      cleanFilters[k] = filters[k];
    }
  });
  const params = new URLSearchParams(cleanFilters).toString();
  return await safeFetch(`${API_BASE}/tamilnadu/colleges?${params}`);
};

export const fetchTamilNaduCollegeById = async (id) => {
  return await safeFetch(`${API_BASE}/tamilnadu/colleges/${id}`);
};

export const fetchTamilNaduCollegeCourses = async (id) => {
  return await safeFetch(`${API_BASE}/tamilnadu/colleges/${id}/courses`);
};

export const fetchTamilNaduCollegeCutoffs = async (id, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return await safeFetch(`${API_BASE}/tamilnadu/colleges/${id}/cutoffs?${q}`);
};

export const fetchTamilNaduCourses = async () => {
  return await safeFetch(`${API_BASE}/tamilnadu/courses`);
};

export const fetchTamilNaduCourseColleges = async (courseId) => {
  return await safeFetch(`${API_BASE}/tamilnadu/courses/${courseId}/colleges`);
};

export const fetchTneaCutoffs = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return await safeFetch(`${API_BASE}/tnea/cutoffs?${q}`);
};

export const fetchTneaCutoffHistory = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return await safeFetch(`${API_BASE}/tnea/cutoffs/history?${q}`);
};

export const fetchTneaRounds = async () => {
  return await safeFetch(`${API_BASE}/tnea/rounds`);
};

export const fetchDataStatus = async () => {
  return await safeFetch(`${API_BASE}/data-status`);
};

export const fetchChoiceSheet = async (payload) => {
  return await safeFetch(`${API_BASE}/tamilnadu/choice-sheet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

export const importAdminData = async (payload) => {
  return await safeFetch(`${API_BASE}/admin/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

export const fetchAdminImports = async () => {
  return await safeFetch(`${API_BASE}/admin/imports`);
};
