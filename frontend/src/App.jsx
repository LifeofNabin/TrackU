import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import StudySetupPage from './pages/StudySetupPage'; // Add this import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-setup" element={<StudySetupPage />} /> {/* Add this route */}
          <Route path="/study-session" element={<StudySession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;