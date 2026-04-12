// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // আপনার বেস ইউআরএল শুধু এখানে থাকবে
  headers: {
    'Content-Type': 'application/json',
  }
});

// ইন্টারসেপ্টর (Interceptor) যোগ করলে প্রতিবার টোকেন পাঠাতে হবে না
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;