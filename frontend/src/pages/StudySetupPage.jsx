import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Target, BookOpen, Play, Settings } from 'lucide-react';

const StudySetup = () => {
  const navigate = useNavigate();
  const [customSubject, setCustomSubject] = useState('');
  const [targetHours, setTargetHours] = useState(1);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [studyGoal, setStudyGoal] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');

  const handleStartSession = () => {
    // Validate form
    if (!customSubject.trim()) {
      alert('Please enter a subject name');
      return;
    }

    if (targetHours === 0 && targetMinutes === 0) {
      alert('Please set a target study duration');
      return;
    }

    // Prepare session data for the new LiveMonitor system
    const sessionData = {
      subject: customSubject.trim(),
      subjectIcon: '📚', // Default icon for custom subjects
      targetHours: targetHours + (targetMinutes / 60), // Convert to decimal hours for compatibility
      targetDuration: {
        hours: targetHours,
        minutes: targetMinutes,
        totalMinutes: (targetHours * 60) + targetMinutes
      },
      studyGoal: studyGoal,
      difficulty: difficultyLevel,
      startTime: new Date().toISOString(),
      sessionId: Date.now()
    };

    console.log('Starting session with data:', sessionData);

    // Save to localStorage for the LiveMonitor components
    localStorage.setItem('studySession', JSON.stringify(sessionData));

    // Navigate to the new study session page with LiveMonitor components
    navigate('/study-session');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Study Session Setup</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="ml-2 text-sm font-medium text-blue-600">Setup</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Live Monitor</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Subject Input */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Enter Your Subject</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What subject are you studying today?
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g., Advanced Calculus, Spanish Literature, Data Structures, History of Art..."
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Subject Examples */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Examples:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
                  <button 
                    onClick={() => setCustomSubject('Mathematics')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Mathematics
                  </button>
                  <button 
                    onClick={() => setCustomSubject('Physics')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Physics
                  </button>
                  <button 
                    onClick={() => setCustomSubject('Programming')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Programming
                  </button>
                  <button 
                    onClick={() => setCustomSubject('Biology')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Biology
                  </button>
                  <button 
                    onClick={() => setCustomSubject('Literature')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Literature
                  </button>
                  <button 
                    onClick={() => setCustomSubject('Chemistry')}
                    className="text-left hover:text-blue-900 hover:underline"
                  >
                    • Chemistry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Duration Target */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Set Target Duration</h2>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Hours:</label>
                <select
                  value={targetHours}
                  onChange={(e) => setTargetHours(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(13)].map((_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Minutes:</label>
                <select
                  value={targetMinutes}
                  onChange={(e) => setTargetMinutes(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>

              <div className="ml-4 px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-700">
                  Total: {targetHours > 0 && `${targetHours}h `}{targetMinutes > 0 && `${targetMinutes}m`}
                  {targetHours === 0 && targetMinutes === 0 && 'Not set'}
                </span>
              </div>
            </div>
          </div>

          {/* Study Goal (Optional) */}
          
         

          {/* Start Session Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleStartSession}
              disabled={!customSubject.trim() || (targetHours === 0 && targetMinutes === 0)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold flex items-center space-x-3 shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              <Play className="h-5 w-5" />
              <span>Start Live Study Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySetup;