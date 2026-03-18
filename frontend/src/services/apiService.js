import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cvpilot_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cvpilot_token');
      localStorage.removeItem('cvpilot_user');
      window.location.href = '/auth';
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
