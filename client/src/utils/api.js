import axios from 'axios';
import { API_BASE_URL } from '../config/contracts';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add user ID to requests for authentication
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      config.headers['x-user-id'] = userData.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  checkEmail: (email) => api.get(`/auth/check-email?email=${email}`),
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Ride APIs
export const rideAPI = {
  createRide: (data) => api.post('/rides', data),
  searchRides: (params) => api.get('/rides/search', { params }),
  getRideById: (id) => api.get(`/rides/${id}`),
  getUserRides: (type) => api.get('/rides/user', { params: { type } }),
  joinRide: (id) => api.post(`/rides/${id}/join`),
  leaveRide: (id) => api.post(`/rides/${id}/leave`),
  cancelRide: (id) => api.post(`/rides/${id}/cancel`),
  completeRide: (id) => api.post(`/rides/${id}/complete`)
};

// Rating APIs
export const ratingAPI = {
  submitRating: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get(`/ratings/user/${userId}`),
  canRate: (params) => api.get('/ratings/can-rate', { params })
};

// Complaint APIs
export const complaintAPI = {
  fileComplaint: (data) => api.post('/complaints', data),
  getAllComplaints: (params) => api.get('/complaints', { params }),
  getUserComplaints: () => api.get('/complaints/user'),
  updateComplaintStatus: (id, data) => api.put(`/complaints/${id}`, data)
};

// Admin APIs
export const adminAPI = {
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getAllRides: (params) => api.get('/admin/rides', { params }),
  toggleUserBan: (userId, data) => api.put(`/admin/users/${userId}/ban`, data),
  getDashboardStats: () => api.get('/admin/stats')
};

export default api;
