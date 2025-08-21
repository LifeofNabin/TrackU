import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';

const StatsPanel = ({ 
  sessionTime, 
  targetHours, 
  sessionStats, 
  subject 
}) => {
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          <Clock className="w-5 h-5 text-purple-400" />
          Session Timer
        </h3>
        <div className="text-center">
          <div className="text-4xl font-mono font-bold mb-2 text-purple-400">
            {formatTime(sessionTime)}
          </div>
          <div className="text-sm text-gray-400 mb-2">
            Subject: {subject}
          </div>
          <div className="text-sm text-gray-400 mb-4">
            Target: {formatTime(targetHours * 3600)}
          </div>
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(sessionStats.goalProgress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {sessionStats.goalProgress.toFixed(1)}% Complete
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Live Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Focus Time</span>
            <span className="font-semibold text-green-400">
              {formatTime(sessionStats.totalFocusTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Distractions</span>
            <span className="font-semibold text-red-400">{sessionStats.distractions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Avg Focus</span>
            <span className={`font-semibold ${getScoreColor(sessionStats.averageFocus)}`}>
              {sessionStats.averageFocus}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Breaks Taken</span>
            <span className="font-semibold text-blue-400">{sessionStats.breaks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Peak Focus</span>
            <span className="font-semibold text-purple-400">{sessionStats.peakFocusTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;