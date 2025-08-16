import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
          Study Guardian AI
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500 transition">Home</Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-500 transition">Login</Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-500 transition">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
