import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/Auth/RegisterForm";
import NavBar from "../components/NavBar";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="flex flex-col md:flex-row items-center justify-center mt-10 md:mt-20 px-6">
        {/* Left - Motivational Content */}
        <div className="md:w-1/2 flex flex-col justify-center mb-6 md:mb-0 text-center md:text-left px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Join the Study Revolution!
          </h1>
          <p className="text-gray-600 text-lg">
            Register now and get personalized tracking, insights, and tips to improve your learning. 
            Start today and never miss a study session!
          </p>
        </div>

        {/* Right - Form */}
        <div className="md:w-1/2 w-full flex justify-center">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
