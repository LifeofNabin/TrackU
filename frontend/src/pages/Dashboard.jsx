import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import PerformanceChart from "../components/Dashboard/PerformanceChart";
import ActivityLog from "../components/Dashboard/ActivityLog";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Welcome, {user ? user.name : "Student"}!
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Track your progress, analyze your activities, and boost your learning efficiency.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Performance Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <PerformanceChart />
          </div>

          {/* Activity Log Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition duration-300">
            <ActivityLog />
          </div>
        </div>

        {/* Extra Features / Quick Stats */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 text-blue-700 rounded-xl p-6 shadow-lg hover:bg-blue-200 transition duration-300">
            <h3 className="text-lg font-semibold">Total Quizzes</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>
          <div className="bg-green-100 text-green-700 rounded-xl p-6 shadow-lg hover:bg-green-200 transition duration-300">
            <h3 className="text-lg font-semibold">Completed Lessons</h3>
            <p className="text-2xl font-bold mt-2">34</p>
          </div>
          <div className="bg-yellow-100 text-yellow-700 rounded-xl p-6 shadow-lg hover:bg-yellow-200 transition duration-300">
            <h3 className="text-lg font-semibold">Hours Studied</h3>
            <p className="text-2xl font-bold mt-2">56</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
