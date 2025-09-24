import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api';

export const laravelApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Add interceptors for auth error handling
laravelApi.interceptors.response.use(
  response => response,
  error => {
    // Handle 401, 403, etc.
    return Promise.reject(error);
  }
);