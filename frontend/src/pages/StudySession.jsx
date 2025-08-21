import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Direct imports
import VideoFeed from '../components/LiveMonitor/VideoFeed.jsx';
import SessionControls from '../components/LiveMonitor/SessionControls.jsx';
import StatsPanel from '../components/LiveMonitor/StatsPanel.jsx';
import AlertsPanel from '../components/LiveMonitor/AlertsPanel.jsx';
import AIInsights from '../components/LiveMonitor/AIInsights.jsx';

const StudySession = () => {
  const navigate = useNavigate();
  const videoFeedRef = useRef(null);
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [cameraPermission, setCameraPermission] = useState(null);
  
  // Study setup data from localStorage
  const [studyData] = useState(() => {
    const saved = localStorage.getItem('studySession');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        subject: parsed.subject || "Mathematics",
        subjectIcon: parsed.subjectIcon || "📐",
        targetHours: parsed.targetHours || 2,
        difficulty: parsed.difficulty || "medium",
        studyGoal: parsed.studyGoal || "",
        sessionId: parsed.sessionId || Date.now()
      };
    }
    return {
      subject: "Mathematics",
      subjectIcon: "📐",
      targetHours: 2,
      difficulty: "medium",
      studyGoal: "",
      sessionId: Date.now()
    };
  });
  
  // Real-time metrics
  const [metrics, setMetrics] = useState({
    focusScore: 85,
    distractionEvents: 0,
    postureScore: 92,
    eyeStrainLevel: 'Low',
    productivityIndex: 88,
    faceDetected: true,
    lookingAway: false,
    phoneDetected: false,
    multiplePersons: false
  });

  // Session statistics
  const [sessionStats, setSessionStats] = useState({
    totalFocusTime: 0,
    distractions: 0,
    breaks: 0,
    averageFocus: 85,
    peakFocusTime: '00:00',
    goalProgress: 0,
    streakMinutes: 0,
    todayTotal: 0
  });

  // Alerts system
  const [alerts, setAlerts] = useState([]);

  // Achievements and engagement
  const [achievements, setAchievements] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState("Ready to crush your goals? 🚀");

  // Simulate real-time analysis
  const analyzeFrame = useCallback(() => {
    if (!isSessionActive || isPaused || isOnBreak) return;

    const detectionResults = {
      faceDetected: Math.random() > 0.1,
      lookingAway: Math.random() > 0.85,
      phoneDetected: Math.random() > 0.95,
      multiplePersons: Math.random() > 0.9,
      attentionScore: Math.floor(Math.random() * 30) + 70,
      postureScore: Math.floor(Math.random() * 20) + 80
    };

    setMetrics(prev => ({
      ...prev,
      ...detectionResults,
      focusScore: detectionResults.attentionScore,
      postureScore: detectionResults.postureScore,
      eyeStrainLevel: sessionTime > 3600 ? 'High' : sessionTime > 1800 ? 'Medium' : 'Low',
      productivityIndex: Math.floor((detectionResults.attentionScore + detectionResults.postureScore) / 2)
    }));

    // Check for achievements
    if (sessionTime === 900) { // 15 minutes
      addAchievement("First Quarter Hour! 🎯", "You've completed 15 minutes of focused study");
    }
    if (sessionTime === 1500) { // 25 minutes (Pomodoro)
      addAchievement("Pomodoro Master! 🍅", "You've completed a full Pomodoro session");
    }
    if (sessionTime === 3600) { // 1 hour
      addAchievement("Hour Champion! ⏰", "One full hour of dedication!");
    }

    if (!detectionResults.faceDetected) {
      addAlert('No face detected - please stay in view', 'warning');
    }
    if (detectionResults.lookingAway) {
      addAlert('Looking away detected - stay focused!', 'warning');
    }
    if (detectionResults.phoneDetected) {
      addAlert('Phone detected - minimize distractions', 'danger');
      setMetrics(prev => ({ ...prev, distractionEvents: prev.distractionEvents + 1 }));
    }
    if (detectionResults.multiplePersons) {
      addAlert('Multiple people detected - maintain study environment', 'info');
    }
  }, [isSessionActive, isPaused, isOnBreak, sessionTime]);

  const addAlert = (message, type) => {
    const alert = { 
      id: Date.now(), 
      message, 
      type, 
      timestamp: new Date() 
    };
    setAlerts(prev => [alert, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 5000);
  };

  const addAchievement = (title, description) => {
    const achievement = {
      id: Date.now(),
      title,
      description,
      timestamp: new Date()
    };
    setAchievements(prev => [achievement, ...prev.slice(0, 2)]);
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isSessionActive && !isPaused && !isOnBreak) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          // Update streak
          setSessionStats(prevStats => ({
            ...prevStats,
            streakMinutes: Math.floor(newTime / 60)
          }));
          return newTime;
        });
      }, 1000);
    } else if (isOnBreak) {
      interval = setInterval(() => {
        setBreakTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isPaused, isOnBreak]);

  // Analysis loop
  useEffect(() => {
    let analysisInterval;
    if (isSessionActive && !isPaused && !isOnBreak) {
      analysisInterval = setInterval(analyzeFrame, 2000);
    }
    return () => clearInterval(analysisInterval);
  }, [analyzeFrame, isSessionActive, isPaused, isOnBreak]);

  // Update session stats and motivational messages
  useEffect(() => {
    if (isSessionActive) {
      setSessionStats(prev => ({
        ...prev,
        totalFocusTime: Math.floor(sessionTime * (metrics.focusScore / 100)),
        goalProgress: Math.min((sessionTime / (studyData.targetHours * 3600)) * 100, 100),
        averageFocus: metrics.focusScore,
        distractions: metrics.distractionEvents,
        todayTotal: sessionTime
      }));

      // Dynamic motivational messages
      if (sessionTime > 0 && sessionTime % 600 === 0) { // Every 10 minutes
        const messages = [
          "Amazing focus! Keep it up! 🔥",
          "You're in the zone! 🎯",
          "Crushing those study goals! 💪",
          "Your dedication is inspiring! ⭐",
          "Focus level: Expert! 🧠"
        ];
        setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
      }
    }
  }, [sessionTime, metrics.focusScore, metrics.distractionEvents, studyData.targetHours, isSessionActive]);

  // Session control handlers
  const handleStartSession = async () => {
    setIsSessionActive(true);
    setIsPaused(false);
    setIsOnBreak(false);
    setMotivationalMessage("Let's make this session count! 🚀");
    addAlert('Study session started - stay focused!', 'success');
  };

  const handlePauseSession = () => {
    setIsPaused(true);
    addAlert('Session paused', 'info');
  };

  const handleResumeSession = () => {
    setIsPaused(false);
    setMotivationalMessage("Back to crushing it! 💪");
    addAlert('Session resumed', 'success');
  };

  const handleTakeBreak = () => {
    setIsOnBreak(true);
    setBreakTime(0);
    setSessionStats(prev => ({ ...prev, breaks: prev.breaks + 1 }));
    addAlert('Break started - relax and recharge!', 'info');
  };

  const handleEndBreak = () => {
    setIsOnBreak(false);
    setMotivationalMessage("Refreshed and ready! Let's go! ⚡");
    addAlert(`Break ended after ${Math.floor(breakTime / 60)}m ${breakTime % 60}s`, 'success');
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setIsPaused(false);
    setIsOnBreak(false);
    addAlert('Session ended - great work!', 'success');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleCameraInitialized = () => {
    console.log('Camera initialized successfully');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return '🔥';
    if (score >= 70) return '👍';
    return '⚠️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Header with Motivational Message */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Live Study Monitoring
          </h1>
          <p className="text-gray-300 text-sm mb-2">
            {studyData.subjectIcon} {studyData.subject} | {studyData.targetHours}h target | {studyData.difficulty}
            {studyData.studyGoal && ` | ${studyData.studyGoal}`}
          </p>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-4 py-2 inline-block border border-purple-400/30">
            <span className="text-purple-300 font-medium">{motivationalMessage}</span>
          </div>
        </div>

        {/* Break Mode Overlay */}
        {isOnBreak && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-center max-w-md mx-4 border border-blue-400/30">
              <div className="text-6xl mb-4">☕</div>
              <h2 className="text-2xl font-bold mb-4">Break Time!</h2>
              <div className="text-4xl font-mono mb-4 bg-black/20 rounded-lg py-2">{formatTime(breakTime)}</div>
              <p className="text-blue-100 mb-6">Take a moment to rest your eyes and stretch</p>
              <button
                onClick={handleEndBreak}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                End Break & Continue
              </button>
            </div>
          </div>
        )}

        {/* Main Layout - Camera takes ~50% width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          {/* Camera Section - Left Half */}
          <div className="flex flex-col">
            <div className="flex-1 relative">
              <VideoFeed
                ref={videoFeedRef}
                cameraPermission={cameraPermission}
                setCameraPermission={setCameraPermission}
                isSessionActive={isSessionActive}
                metrics={metrics}
                onInitializeCamera={handleCameraInitialized}
              />
              
              {/* Floating Status Indicators */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  metrics.faceDetected ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                }`}>
                  {metrics.faceDetected ? '👤 Face Detected' : '❌ No Face'}
                </div>
                {metrics.phoneDetected && (
                  <div className="px-3 py-1 bg-red-500/80 text-white rounded-full text-xs font-semibold animate-pulse">
                    📱 Phone Detected!
                  </div>
                )}
              </div>

              {/* Live Focus Score Overlay */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-center">
                  <div className="text-xs text-gray-300 mb-1">LIVE FOCUS</div>
                  <div className={`text-2xl font-bold ${getScoreColor(metrics.focusScore)}`}>
                    {metrics.focusScore}% {getScoreEmoji(metrics.focusScore)}
                  </div>
                  <div className="w-16 h-2 bg-gray-600 rounded-full mt-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metrics.focusScore >= 90 ? 'bg-green-400' :
                        metrics.focusScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${metrics.focusScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex justify-center gap-3 mt-4">
              {!isSessionActive ? (
                <button
                  onClick={handleStartSession}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all transform hover:scale-105 text-white shadow-lg"
                >
                  <span className="text-xl">▶</span>
                  Start Study Session
                </button>
              ) : (
                <>
                  {!isPaused ? (
                    <>
                      <button
                        onClick={handlePauseSession}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-semibold transition-all text-white shadow-lg"
                      >
                        <span>⏸</span>
                        Pause
                      </button>
                      <button
                        onClick={handleTakeBreak}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-semibold transition-all text-white shadow-lg"
                      >
                        <span>☕</span>
                        Take Break
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleResumeSession}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all text-white shadow-lg"
                    >
                      <span>▶</span>
                      Resume Session
                    </button>
                  )}
                  <button
                    onClick={handleEndSession}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg font-semibold transition-all text-white shadow-lg"
                  >
                    <span>⏹</span>
                    End Session
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Metrics & Engagement Section - Right Half */}
          <div className="flex flex-col gap-4 max-h-full overflow-y-auto">
            {/* Session Timer & Progress - Hero Section */}
            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-6 border border-purple-400/30">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2 text-white">
                  <span className="text-2xl">⏱</span>
                  Active Session
                </h3>
                <div className="text-4xl font-mono font-bold mb-4 bg-black/20 rounded-lg py-3 text-purple-300">
                  {formatTime(sessionTime)}
                </div>
                <div className="bg-gray-700/50 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${Math.min(sessionStats.goalProgress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {sessionStats.goalProgress.toFixed(1)}% of daily goal completed
                </div>
                <div className="text-xs text-purple-300">
                  Target: {studyData.targetHours}h | Remaining: {formatTime(Math.max(0, (studyData.targetHours * 3600) - sessionTime))}
                </div>
              </div>
            </div>

            {/* Live Performance Dashboard */}
            <div className="grid grid-cols-2 gap-3">
              {/* Focus Score Card */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-green-400/30 hover:border-green-400/50 transition-all">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-xs text-gray-400 mb-1">FOCUS SCORE</div>
                  <div className={`text-xl font-bold ${getScoreColor(metrics.focusScore)}`}>
                    {metrics.focusScore}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {metrics.focusScore >= 90 ? 'Excellent!' : metrics.focusScore >= 70 ? 'Good' : 'Needs Focus'}
                  </div>
                </div>
              </div>

              {/* Posture Score Card */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/50 transition-all">
                <div className="text-center">
                  <div className="text-3xl mb-2">🪑</div>
                  <div className="text-xs text-gray-400 mb-1">POSTURE</div>
                  <div className={`text-xl font-bold ${getScoreColor(metrics.postureScore)}`}>
                    {metrics.postureScore}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {metrics.postureScore >= 90 ? 'Perfect!' : metrics.postureScore >= 70 ? 'Good' : 'Adjust'}
                  </div>
                </div>
              </div>

              {/* Streak Counter */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-xs text-gray-400 mb-1">FOCUS STREAK</div>
                  <div className="text-xl font-bold text-yellow-400">
                    {sessionStats.streakMinutes}m
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Keep it up!
                  </div>
                </div>
              </div>

              {/* Distractions Counter */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-red-400/30 hover:border-red-400/50 transition-all">
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <div className="text-xs text-gray-400 mb-1">DISTRACTIONS</div>
                  <div className="text-xl font-bold text-red-400">
                    {sessionStats.distractions}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {sessionStats.distractions === 0 ? 'Perfect!' : 'Stay focused'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            {achievements.length > 0 && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-md rounded-xl p-4 border border-yellow-400/30">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-400">
                  <span>🏆</span>
                  Recent Achievement
                </h3>
                {achievements.slice(0, 1).map((achievement) => (
                  <div key={achievement.id} className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <div className="font-semibold text-yellow-300 mb-1">{achievement.title}</div>
                    <div className="text-xs text-gray-300">{achievement.description}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Alerts Feed */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                <span className="text-yellow-400">⚡</span>
                Live Monitoring
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center text-gray-400 py-3">
                    <div className="text-green-500 text-2xl mb-2">✓</div>
                    <p className="text-sm">All systems optimal</p>
                    <p className="text-xs text-gray-500">Focus mode engaged</p>
                  </div>
                ) : (
                  alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg text-sm border-l-4 ${
                        alert.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' :
                        alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' :
                        alert.type === 'danger' ? 'bg-red-500/10 border-red-500 text-red-400' :
                        'bg-blue-500/10 border-blue-500 text-blue-400'
                      }`}
                    >
                      {alert.message}
                      <div className="text-xs opacity-60 mt-1">
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI-Powered Tips & Insights */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-xl p-4 border border-indigo-400/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-300">
                <span>🧠</span>
                AI Study Coach
              </h3>
              
              {/* Dynamic Tips */}
              <div className="space-y-2">
                {metrics.focusScore > 85 && sessionTime > 300 && (
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-400 text-sm font-medium flex items-center gap-2">
                      <span>🎯</span> Excellent Flow State!
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      You're in the zone! This is when deep learning happens.
                    </div>
                  </div>
                )}
                
                {sessionTime > 1800 && sessionStats.breaks === 0 && (
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-blue-400 text-sm font-medium flex items-center gap-2">
                      <span>💡</span> Break Reminder
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Consider a 5-minute break to maintain peak performance.
                    </div>
                  </div>
                )}

                {metrics.postureScore < 70 && (
                  <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="text-orange-400 text-sm font-medium flex items-center gap-2">
                      <span>🪑</span> Posture Check
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Sit up straight and adjust your position for better focus.
                    </div>
                  </div>
                )}

                {/* Study Technique Suggestion */}
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="font-medium text-purple-400 mb-1 flex items-center gap-2">
                    <span>💡</span> Pro Tip
                  </div>
                  <div className="text-xs text-gray-300">
                    {sessionTime < 1500 ? 
                      "Try the Pomodoro Technique: 25min focused work + 5min break" :
                      "Great stamina! Consider active recall to test your understanding"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySession;