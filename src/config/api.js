import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://makeasite-backend.onrender.com';

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  DEFAULT_API_BASE_URL;

export const API_URL = `${API_BASE_URL}/api`;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed?.token;
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore JSON parse issues
  }
  return config;
});

