import axios from 'axios';

// Determine which backend URL to use based on environment
const getBackendUrl = () => {
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    return process.env.REACT_APP_BACKEND_URL_LIVE;
  }
  return process.env.REACT_APP_BACKEND_URL_LOCAL;
};

const getMLServiceUrl = () => {
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    return process.env.REACT_APP_ML_SERVICE_URL_LIVE;
  }
  return process.env.REACT_APP_ML_SERVICE_URL_LOCAL;
};

export const API_BASE_URL = getBackendUrl();
export const ML_BASE_URL = getMLServiceUrl();

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ML Service API instance
export const mlApi = axios.create({
  baseURL: ML_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});