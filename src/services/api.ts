import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach admin auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.hash.includes('admin') && !window.location.hash.includes('login')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.hash = '#/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

