import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      {/* NavBar */}
      <NavBar />

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 gap-10">
        {/* Left - Motivational Text */}
        <div className="md:w-1/2 flex flex-col justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight animate-fadeIn">
            Unlock Your Full Learning Potential
          </h1>
          <p className="text-gray-600 text-lg md:text-xl animate-fadeIn delay-200">
            Study Guardian AI helps you stay focused, track progress, and achieve your learning goals efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-center"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-center"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="md:w-1/2 flex justify-center animate-fadeIn delay-400">
          <img
            src="/images/login.jpg"
            alt="Study Illustration"
            className="w-80 md:w-96 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 animate-fadeIn">
          Why Choose Study Guardian AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 text-center animate-fadeIn delay-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Track Progress</h3>
            <p className="text-gray-500">Monitor your study hours and see how you improve over time.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 text-center animate-fadeIn delay-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Stay Focused</h3>
            <p className="text-gray-500">Get reminders and insights to maximize productivity during study sessions.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 text-center animate-fadeIn delay-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Smart Insights</h3>
            <p className="text-gray-500">Receive personalized tips to improve your study habits effectively.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
