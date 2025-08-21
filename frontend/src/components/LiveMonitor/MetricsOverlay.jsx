import React from 'react';
import { Focus, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const MetricsOverlay = ({ metrics }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Focus Score Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-purple-500/50">
        <div className="flex items-center gap-2">
          <Focus className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-white">Focus Score</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(metrics.focusScore)}`}>
          {metrics.focusScore}%
        </div>
      </div>

      {/* Detection Status */}
      <div className="absolute top-4 right-4 space-y-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
          metrics.faceDetected 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <Eye className="w-4 h-4" />
          {metrics.faceDetected ? 'Face Detected' : 'No Face'}
        </div>
        
        {metrics.lookingAway && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <EyeOff className="w-4 h-4" />
            Looking Away
          </div>
        )}
        
        {metrics.phoneDetected && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-4 h-4" />
            Phone Detected
          </div>
        )}
        
        {metrics.multiplePersons && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <AlertTriangle className="w-4 h-4" />
            Multiple People
          </div>
        )}
      </div>

      {/* Bottom Metrics Bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-400">Posture</div>
            <div className={`text-lg font-semibold ${getScoreColor(metrics.postureScore)}`}>
              {metrics.postureScore}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Eye Strain</div>
            <div className="text-lg font-semibold text-blue-400">{metrics.eyeStrainLevel}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Productivity</div>
            <div className={`text-lg font-semibold ${getScoreColor(metrics.productivityIndex)}`}>
              {metrics.productivityIndex}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Distractions</div>
            <div className="text-lg font-semibold text-red-400">{metrics.distractionEvents}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsOverlay;