import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    console.log('=== DEBUG INFO ===');
    console.log('Raw userData from localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user object:', parsedUser);
        console.log('parsedUser.fullName:', parsedUser.fullName);
        console.log('parsedUser.name:', parsedUser.name);
        console.log('parsedUser.email:', parsedUser.email);
        console.log('parsedUser.userId:', parsedUser.userId);
        
        // Normalize the user data to handle different field names
        const normalizedUser = {
          id: parsedUser.userId || parsedUser.id || 'unknown',
          name: parsedUser.fullName || parsedUser.name || 'User',
          email: parsedUser.email || '',
          joinDate: parsedUser.joinDate || 'January 2024',
          phone: parsedUser.phone || '',
          avatar: parsedUser.avatar || ''
        };
        
        console.log('Normalized user data:', normalizedUser);
        console.log('Final name being used:', normalizedUser.name);
        
        setUser(normalizedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If parsing fails, redirect to login
        navigate('/login');
      }
    } else {
      console.log('No user data found in localStorage');
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  const handleStartSession = () => {
    navigate('/study-setup');
  };

  const handleViewAnalytics = () => {
    alert('Analytics feature coming soon!');
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Remove the token as well
    localStorage.removeItem('studySession'); // Clean up study session data
    navigate('/login');
  };

  // Show loading if user data is not yet loaded
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div 
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handleProfileClick}
                title="Click to view profile"
              >
                <span className="text-white text-2xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 
                  className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleProfileClick}
                  title="Click to view profile"
                >
                  Welcome back, {user.name || 'User'}!
                </h1>
                <p className="text-gray-600">Ready to track your study progress?</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="text-3xl">📚</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold text-green-600">48.5</p>
                </div>
                <div className="text-3xl">⏱️</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Focus Score</p>
                  <p className="text-2xl font-bold text-purple-600">92%</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-orange-600">7 days</p>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Start Study Session */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Start Study Session</h2>
              <p className="text-blue-100 mb-6">
                Begin a new AI-monitored study session with facial recognition tracking.
              </p>
              <button
                onClick={handleStartSession}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Session
              </button>
            </div>

            {/* View Analytics */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">View Analytics</h2>
              <p className="text-green-100 mb-6">
                Analyze your study patterns, focus trends, and productivity insights.
              </p>
              <button
                onClick={handleViewAnalytics}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">📐</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Mathematics Study Session</h4>
                    <p className="text-sm text-gray-600">2 hours 30 minutes • 95% focus score</p>
                  </div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">🧪</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Chemistry Lab Preparation</h4>
                    <p className="text-sm text-gray-600">1 hour 45 minutes • 88% focus score</p>
                  </div>
                  <div className="text-sm text-gray-500">Yesterday</div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">📚</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Literature Review</h4>
                    <p className="text-sm text-gray-600">3 hours 15 minutes • 92% focus score</p>
                  </div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{user.name || 'User'}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {user.name || 'Not provided'}</div>
                    <div><span className="font-medium">Email:</span> {user.email}</div>
                    <div><span className="font-medium">Member Since:</span> {user.joinDate || 'January 2024'}</div>
                    <div><span className="font-medium">User ID:</span> {user.id || 'N/A'}</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Study Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Total Sessions</div>
                      <div className="text-blue-600">12</div>
                    </div>
                    <div>
                      <div className="font-medium">Total Hours</div>
                      <div className="text-green-600">48.5h</div>
                    </div>
                    <div>
                      <div className="font-medium">Average Focus</div>
                      <div className="text-purple-600">92%</div>
                    </div>
                    <div>
                      <div className="font-medium">Current Streak</div>
                      <div className="text-orange-600">7 days</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleCloseModal();
                    // You can add edit profile navigation here
                    alert('Edit profile feature coming soon!');
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;