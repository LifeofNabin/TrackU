import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Save user to localStorage for demo purposes
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // Check if user already exists
    if (registeredUsers[formData.email]) {
      setError('User with this email already exists');
      return;
    }

    // Create new user
    const newUser = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password, // In real app, this should be hashed
      userId: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    registeredUsers[formData.email] = newUser;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    console.log('User registered successfully:', newUser);
    setSuccess(`Registration successful! You can now login with your credentials. Welcome, ${formData.fullName}!`);
    
    // Clear form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const checkRegisteredUsers = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    console.log('Currently registered users:', users);
    
    if (Object.keys(users).length === 0) {
      alert('No registered users found');
    } else {
      alert(`Found ${Object.keys(users).length} registered users. Check console for details.`);
    }
  };

  const clearRegisteredUsers = () => {
    localStorage.removeItem('registeredUsers');
    alert('All registered users cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our AI-powered study platform</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in here
            </a>
          </p>
        </div>

        {/* Debug buttons for testing */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Debug Tools (Remove in Production)</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={checkRegisteredUsers}
              className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600"
            >
              Check Users
            </button>
            <button
              type="button"
              onClick={clearRegisteredUsers}
              className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600"
            >
              Clear Users
            </button>
          </div>
        </div>

        {/* Example user for quick testing */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Quick Test</h4>
          <p className="text-xs text-blue-600">
            Try registering with: John Doe, john@test.com, password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;