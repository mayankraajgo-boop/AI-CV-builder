import axios from 'axios';

// Dev: Vite proxy handles /api → localhost:5000
// Prod: hardcoded Render backend URL
const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://cvpilot-backend.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cvpilot_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — only redirect for non-auth endpoints
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't hard-redirect for /auth/me — let Redux getMe.rejected handle it
      if (!url.includes('/auth/me') && !url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('cvpilot_token');
        localStorage.removeItem('cvpilot_user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const aiAPI = {
  generateSummary: (data) => api.post('/ai/generate-summary', data),
  improveSection: (section, content) => api.post('/ai/improve-section', { section, content }),
  makeATSFriendly: (content) => api.post('/ai/ats-friendly', { content }),
  addActionWords: (content) => api.post('/ai/action-words', { content }),
  getATSScore: (resumeText) => api.post('/ai/ats-score', { resumeText }),
  generateFullResume: (data) => api.post('/ai/generate-resume', data),
};

export default api;
