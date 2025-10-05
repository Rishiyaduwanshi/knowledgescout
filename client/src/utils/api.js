import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  },
};

// Documents APIs
export const docsAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/docs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getAll: async (limit = 10, offset = 0) => {
    const response = await api.get(`/docs?limit=${limit}&offset=${offset}`);
    return response.data;
  },
  
  getById: async (docId) => {
    const response = await api.get(`/docs/${docId}`);
    return response.data;
  },
  
  delete: async (docId) => {
    const response = await api.delete(`/docs/${docId}`);
    return response.data;
  },
  
  deleteAll: async () => {
    const response = await api.delete('/docs');
    return response.data;
  },
};

// Query APIs
export const queryAPI = {
  ask: async (query, k = 5) => {
    const response = await api.post('/ask', { query, k });
    return response.data;
  },
};

// Ask API (alias for compatibility)
export const askAPI = {
  ask: async (data) => {
    const response = await api.post('/ask', data);
    return response.data;
  },
};

// Index APIs
export const indexAPI = {
  rebuild: async () => {
    const response = await api.post('/index/rebuild');
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/index/stats');
    return response.data;
  },
};

// System APIs
export const systemAPI = {
  health: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  
  meta: async () => {
    const response = await api.get('/_meta');
    return response.data;
  },
};

export default api;