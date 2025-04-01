import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import { registerUser } from "../utils/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !capturedImage) {
      alert("Please fill in all fields and capture your face.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      faceData: capturedImage,
    };

    try {
      const response = await registerUser(userData);
      if (response.success) {
        alert("Registration successful! Your user ID is " + response.userId);
        navigate("/login");
      } else {
        alert("Registration failed: " + response.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-2 p-2 border" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-2 p-2 border" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 border" />

      <WebcamCapture setCapturedImage={setCapturedImage} />
      
      <button onClick={handleRegister} className="bg-blue-500 text-white p-2 mt-4">Register</button>
    </div>
  );
};

export default Register;
