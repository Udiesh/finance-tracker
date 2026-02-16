import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});


// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401 responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Categories
export const getCategories = () => API.get('/categories/');
export const createCategory = (data) => API.post('/categories/', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Transactions
export const getTransactions = (params) => API.get('/transactions/', { params });
export const createTransaction = (data) => API.post('/transactions/', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getSummary = (params) => API.get('/transactions/summary', { params });
export const getMonthlyBreakdown = (params) => API.get('/transactions/monthly-breakdown', { params });
export const getCategoryBreakdown = (params) => API.get('/transactions/category-breakdown', { params });
// AI
export const parseTransaction = (text) => API.post('/ai/parse-transaction', { text });

export default API;
