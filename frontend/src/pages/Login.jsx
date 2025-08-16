import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import NavBar from "./components/NavBar";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <NavBar />

      <div className="flex flex-col md:flex-row items-center justify-center mt-10 md:mt-20 px-6">
        {/* Left - Motivational Content */}
        <div className="md:w-1/2 flex flex-col justify-center mb-6 md:mb-0 text-center md:text-left px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Unlock Your Full Learning Potential!
          </h1>
          <p className="text-gray-600 text-lg">
            Study Guardian AI helps you stay focused and track your learning efficiently. 
            Log in and start your journey today!
          </p>
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 w-full flex justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
