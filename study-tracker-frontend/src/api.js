import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Adjust if backend URL differs

// Register a new user
export const registerUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/register`, userData);
};

// Login user
export const loginUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/login`, userData);
};

// Fetch user profile (Protected route)
export const getUserProfile = async (token) => {
    return await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
