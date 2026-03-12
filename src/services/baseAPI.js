import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../config/api.js';

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    try {
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    return headers;
  },
});

export default baseQuery;

