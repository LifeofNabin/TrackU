import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

const SessionControls = ({ 
  isSessionActive, 
  isPaused, 
  onStartSession, 
  onPauseSession, 
  onResumeSession, 
  onEndSession,
  cameraPermission 
}) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      {!isSessionActive ? (
        <button
          onClick={onStartSession}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all transform hover:scale-105 text-white"
        >
          <Play className="w-5 h-5" />
          Start Session
        </button>
      ) : (
        <>
          {!isPaused ? (
            <button
              onClick={onPauseSession}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold transition-all transform hover:scale-105 text-white"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          ) : (
            <button
              onClick={onResumeSession}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition-all transform hover:scale-105 text-white"
            >
              <Play className="w-5 h-5" />
              Resume
            </button>
          )}
          <button
            onClick={onEndSession}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all transform hover:scale-105 text-white"
          >
            <Square className="w-5 h-5" />
            End Session
          </button>
        </>
      )}
    </div>
  );
};

export default SessionControls;