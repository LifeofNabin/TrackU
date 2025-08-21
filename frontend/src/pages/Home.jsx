import React from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout navbarStyle="home">
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                Study Guardian
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Be the guardian of your own commitments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start Free Trial →
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful AI Features
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Advanced technology to enhance your study experience and track your progress in real-time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-white text-2xl">📹</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Live Face Monitoring</h3>
                <p className="text-blue-100">
                  Real-time facial recognition with focus detection, posture analysis, and distraction alerts during study sessions.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-white text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">AI Smart Insights</h3>
                <p className="text-blue-100">
                  Intelligent recommendations based on your study patterns, focus levels, and productivity metrics.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Live Analytics Dashboard</h3>
                <p className="text-blue-100">
                  Real-time metrics tracking with session timers, break management, and comprehensive study reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Live Demo Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                See It In Action
              </h2>
              <p className="text-xl text-blue-100">
                Experience the power of live study monitoring
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500 bg-opacity-20 rounded-lg">
                    <span className="text-green-400 font-semibold">Focus Score</span>
                    <span className="text-green-400 text-xl font-bold">92%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                    <span className="text-blue-400 font-semibold">Session Time</span>
                    <span className="text-blue-400 text-xl font-bold">01:23:45</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                    <span className="text-purple-400 font-semibold">Productivity</span>
                    <span className="text-purple-400 text-xl font-bold">88%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                    <span className="text-yellow-400 font-semibold">Breaks Taken</span>
                    <span className="text-yellow-400 text-xl font-bold">2</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Real-Time Features:</h3>
                <ul className="space-y-4 text-blue-100">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3 text-xl">📹</span>
                    Live camera feed with overlay metrics
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-400 mr-3 text-xl">⚡</span>
                    Instant focus and attention tracking
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-3 text-xl">🎯</span>
                    Smart break recommendations
                  </li>
                  <li className="flex items-center">
                    <span className="text-pink-400 mr-3 text-xl">📱</span>
                    Distraction detection & alerts
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-3 text-xl">🧘</span>
                    Posture & eye strain monitoring
                  </li>
                </ul>
                
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Try Live Demo →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Revolutionizing Study Tracking
                </h2>
                <p className="text-lg text-blue-100 mb-6">
                  TrackU leverages cutting-edge AI technology to monitor student presence 
                  and engagement during live study sessions. Our advanced facial recognition system 
                  provides real-time feedback while maintaining the highest standards of privacy and security.
                </p>
                <ul className="space-y-3 text-blue-100">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Real-time presence & focus monitoring
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Live analytics and AI insights
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Smart break management system
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-3">✓</span>
                    Privacy-first data protection
                  </li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Boost Your Productivity</h3>
                  <p className="text-blue-100 mb-6">
                    Experience live study monitoring with AI-powered insights that help you stay focused and achieve your goals.
                  </p>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Start Live Tracking →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-12 border border-white border-opacity-20">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Study Experience?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of students who are already using AI-powered live study tracking to improve their focus and productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  Create Free Account →
                </button>
                <button
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;