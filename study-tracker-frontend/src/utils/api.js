// api.js
const API_URL = "http://localhost:5000"; // Change this based on your backend URL

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: userData,
    });
    return response.json();
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, message: "Failed to register user." };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    return response.json();
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, message: "Failed to login." };
  }
};
