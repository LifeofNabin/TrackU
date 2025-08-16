// src/components/Hero.jsx
import React from "react";

const Hero = () => (
  <section className="bg-blue-50 py-20">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Study Guardian AI</h1>
        <p className="text-lg text-gray-600 mb-6">
          Track your learning, stay focused, and improve your study sessions with AI-powered insights.
        </p>
        <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </a>
      </div>
      <div className="md:w-1/2">
        <img src="/images/hero.jpg" alt="Hero" className="w-full rounded-xl shadow-lg" />
      </div>
    </div>
  </section>
);

export default Hero;
