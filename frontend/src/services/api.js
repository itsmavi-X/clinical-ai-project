import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api', // 🔥 FIXED
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.errorMessage || err.message || 'Unexpected error';
    return Promise.reject(new Error(msg));
  }
);

export const analyzeSymptoms = (data) => api.post('/analyze', data).then(r => r.data);
export const getHistory = () => api.get('/history').then(r => r.data);
export const deleteRecord = (id) => api.delete(`/history/${id}`).then(r => r.data);
export const checkHealth = () => api.get('/health').then(r => r.data);

export default api;