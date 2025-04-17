import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance for authenticated requests
const authAxios = axios.create({
  baseURL: API_URL
});

// Add request interceptor to include token in requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Public API calls
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;  // Now includes token, user_id, name if successful
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Authenticated API calls
export const getNotes = async () => {
  try {
    const response = await authAxios.get('/notes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNote = async (noteData) => {
  try {
    const response = await authAxios.post('/notes', noteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNote = async (id) => {
  try {
    const response = await authAxios.get(`/notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNote = async (id, noteData) => {
  try {
    const response = await authAxios.put(`/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await authAxios.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
