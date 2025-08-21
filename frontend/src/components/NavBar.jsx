import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg border-b border-white border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Study Guardian</h1>
                <p className="text-blue-200 text-xs hidden sm:block">AI-Powered Study Tracking</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Home Link */}
              <button
                onClick={() => handleNavigation('/')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePage('/')
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Home
              </button>

              {/* Features Link */}
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavigation('/#features');
                  }
                }}
                className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </button>

              {/* Dashboard Link (only if logged in) */}
              {isLoggedIn && (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePage('/dashboard')
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Dashboard
                </button>
              )}

              {/* About Link */}
              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavigation('/#about');
                  }
                }}
                className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </button>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActivePage('/login')
                      ? 'bg-white text-purple-600'
                      : 'text-white border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActivePage('/register')
                      ? 'bg-white text-purple-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* User Avatar/Info */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    Welcome, {user?.fullName || user?.email || 'User'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white bg-opacity-5 rounded-lg mt-2">
              <button
                onClick={() => handleNavigation('/')}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  isActivePage('/')
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavigation('/#features');
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Features
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                    isActivePage('/dashboard')
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    handleNavigation('/#about');
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium w-full text-left text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                About
              </button>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-white border-opacity-20">
                {!isLoggedIn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation('/login')}
                      className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePage('/login')
                          ? 'bg-white text-purple-600'
                          : 'text-white border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleNavigation('/register')}
                      className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActivePage('/register')
                          ? 'bg-white text-purple-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-white text-sm font-medium">
                        {user?.fullName || user?.email || 'User'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 rounded-md text-base font-medium text-left text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;