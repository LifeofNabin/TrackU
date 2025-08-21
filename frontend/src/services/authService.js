// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // adjust as per your backend

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

const authService = {
  login,
  register,
};

export default authService;
