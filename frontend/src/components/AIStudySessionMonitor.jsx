import React, { useState, useRef, useEffect } from 'react';

const AIStudySessionMonitor = ({ sessionData, onClose }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [concentratedTime, setConcentratedTime] = useState(0);
  
  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('focused');
  const [attentionScore, setAttentionScore] = useState(85);
  const [isConcentrated, setIsConcentrated] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Get session data
  const sessionName = sessionData?.name || 'Study Session';
  const courseName = sessionData?.course || 'General Study';
  const studyPeriod = sessionData?.period || 60;

  console.log('Monitor received session data:', sessionData);

  // Simulate AI analysis
  useEffect(() => {
    if (cameraActive) {
      const analysisInterval = setInterval(() => {
        const emotions = ['focused', 'tired', 'distracted', 'happy', 'neutral'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(randomEmotion);
        
        const newAttentionScore = Math.floor(Math.random() * 30) + 70;
        setAttentionScore(newAttentionScore);
        
        const concentrated = newAttentionScore > 75;
        setIsConcentrated(concentrated);
        
        if (newAttentionScore < 60 && Math.random() > 0.8) {
          addNotification('Low attention detected!', 'warning');
        }
      }, 3000);
      
      return () => clearInterval(analysisInterval);
    }
  }, [cameraActive]);

  // Track concentrated time
  useEffect(() => {
    const concentrationInterval = setInterval(() => {
      if (isConcentrated) {
        setConcentratedTime(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(concentrationInterval);
  }, [isConcentrated]);

  // Add notification
  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, timestamp: new Date() }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Initialize camera
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setFaceDetected(true);
        return true;
      }
    } catch (error) {
      console.error('Camera failed:', error);
      alert('Camera access required for monitoring.');
      return false;
    }
  };

  // Start session automatically
  useEffect(() => {
    const startSession = async () => {
      const cameraOk = await initializeCamera();
      if (!cameraOk) return;
      
      setElapsedTime(0);
      setConcentratedTime(0);
      
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      addNotification('Study session started!', 'success');
    };

    startSession();
  }, []);

  // End session
  const endStudySession = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    const concentrationRate = ((concentratedTime / elapsedTime) * 100).toFixed(1);
    
    setCameraActive(false);
    setFaceDetected(false);
    
    alert(`Session Completed!\nDuration: ${formatTime(elapsedTime)}\nFocused Time: ${formatTime(concentratedTime)}\nConcentration: ${concentrationRate}%`);
    
    if (onClose) onClose();
  };

  // Format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get progress
  const getProgress = () => {
    const totalSeconds = studyPeriod * 60;
    return Math.min((elapsedTime / totalSeconds) * 100, 100);
  };

  const getConcentrationRate = () => {
    if (elapsedTime === 0) return 0;
    return ((concentratedTime / elapsedTime) * 100).toFixed(1);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* NOTIFICATIONS */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <p className="font-medium">{notification.message}</p>
          </div>
        ))}
      </div>

      <div className="p-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Study Monitor</h1>
            <p className="text-lg text-blue-600 font-medium">📚 {courseName}</p>
          </div>
          <button
            onClick={endStudySession}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
          >
            End Session
          </button>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: TIMER & VIDEO */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* TIMER SECTION */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{sessionName}</h2>
                
                {/* BIG TIMER */}
                <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
                  {formatTime(elapsedTime)}
                </div>
                
                {/* STATUS */}
                <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium mb-4 ${
                  isConcentrated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConcentrated ? '🎯 Focused' : '😴 Distracted'}
                </div>
                
                {/* STATS */}
                <div className="text-lg text-gray-600 mb-6">
                  Target: {Math.floor(studyPeriod / 60)}h {studyPeriod % 60}m | 
                  Focused: {formatTime(concentratedTime)} ({getConcentrationRate()}%)
                </div>
                
                {/* PROGRESS BAR */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Session Progress</span>
                    <span>{getProgress().toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${getProgress()}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* CONCENTRATION BAR */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Concentration Rate</span>
                    <span>{getConcentrationRate()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${getConcentrationRate()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIDEO SECTION */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">📹 Live Camera Feed</h3>
                  <div className={`flex items-center ${faceDetected ? 'text-green-500' : 'text-red-500'}`}>
                    <div className={`w-3 h-3 rounded-full ${faceDetected ? 'bg-green-500' : 'bg-red-500'} mr-2 animate-pulse`}></div>
                    {faceDetected ? 'Face Detected' : 'No Face'}
                  </div>
                </div>
              </div>
              
              <div className="relative bg-gray-900">
                <video
                  ref={videoRef}
                  className="w-full h-96 object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {/* OVERLAY */}
                {faceDetected && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-300">Emotion:</span>
                        <span className="font-semibold ml-2 text-blue-300 capitalize">{currentEmotion}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Focus:</span>
                        <span className="font-semibold ml-2 text-green-300">{attentionScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: METRICS PANEL */}
          <div className="space-y-6">
            
            {/* LIVE METRICS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Live Metrics</h3>
              <div className="space-y-4">
                
                {/* ATTENTION */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Attention</span>
                    <span className="font-bold">{attentionScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        attentionScore >= 80 ? 'bg-green-500' :
                        attentionScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${attentionScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* EMOTION */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Emotion</span>
                  <div className="flex items-center">
                    <span className="mr-2">
                      {currentEmotion === 'focused' ? '🎯' :
                       currentEmotion === 'tired' ? '😴' :
                       currentEmotion === 'happy' ? '😊' :
                       currentEmotion === 'distracted' ? '😕' : '😐'}
                    </span>
                    <span className="font-semibold capitalize">{currentEmotion}</span>
                  </div>
                </div>

                {/* FACE STATUS */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Face Detection</span>
                  <span className={`font-semibold ${faceDetected ? 'text-green-600' : 'text-red-600'}`}>
                    {faceDetected ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* SESSION STATS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Session Stats</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 block">Total Time</span>
                  <span className="font-semibold text-lg">{formatTime(elapsedTime)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Focused Time</span>
                  <span className="font-semibold text-lg text-green-600">{formatTime(concentratedTime)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Concentration</span>
                  <span className="font-semibold text-2xl text-purple-600">{getConcentrationRate()}%</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🎮 Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={endStudySession}
                  className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold"
                >
                  End Session
                </button>
                <button className="w-full py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-semibold">
                  Take Break (5min)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudySessionMonitor;