import React from 'react';
import { Brain, Target, Eye, Zap, Coffee, AlertCircle } from 'lucide-react';

const AIInsights = ({ metrics, sessionTime }) => {
  const generateInsights = () => {
    const insights = [];

    // Focus insights
    if (metrics.focusScore > 90) {
      insights.push({
        id: 'excellent-focus',
        type: 'success',
        icon: <Target className="w-5 h-5" />,
        title: 'Excellent Focus!',
        message: "You're in the zone! This is peak performance time.",
        action: "Keep up the great work!"
      });
    } else if (metrics.focusScore > 85) {
      insights.push({
        id: 'good-focus',
        type: 'success',
        icon: <Zap className="w-5 h-5" />,
        title: 'Great Focus',
        message: "You're maintaining good concentration levels.",
        action: "Stay consistent!"
      });
    } else if (metrics.focusScore < 60) {
      insights.push({
        id: 'low-focus',
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Focus Dip Detected',
        message: "Your attention seems to be wandering.",
        action: "Take a 2-minute break or change your environment."
      });
    }

    // Eye strain insights
    if (sessionTime > 3600 && metrics.eyeStrainLevel === 'High') {
      insights.push({
        id: 'eye-strain',
        type: 'warning',
        icon: <Eye className="w-5 h-5" />,
        title: 'Eye Strain Alert',
        message: "You've been studying for over an hour.",
        action: "Follow the 20-20-20 rule: look at something 20 feet away for 20 seconds."
      });
    } else if (sessionTime > 1800 && metrics.eyeStrainLevel !== 'Low') {
      insights.push({
        id: 'eye-rest',
        type: 'info',
        icon: <Eye className="w-5 h-5" />,
        title: 'Consider Eye Rest',
        message: "Regular breaks help maintain eye health.",
        action: "Blink more frequently and adjust screen brightness."
      });
    }

    // Posture insights
    if (metrics.postureScore < 70) {
      insights.push({
        id: 'posture-alert',
        type: 'warning',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Posture Check',
        message: "Your posture could use some adjustment.",
        action: "Sit up straight, feet flat on floor, shoulders relaxed."
      });
    }

    // Distraction insights
    if (metrics.distractionEvents > 5) {
      insights.push({
        id: 'distractions',
        type: 'danger',
        icon: <AlertCircle className="w-5 h-5" />,
        title: 'Too Many Distractions',
        message: "Multiple interruptions detected this session.",
        action: "Find a quieter space or use noise-canceling headphones."
      });
    }

    // Long session insights
    if (sessionTime > 5400) { // 1.5 hours
      insights.push({
        id: 'break-time',
        type: 'info',
        icon: <Coffee className="w-5 h-5" />,
        title: 'Break Recommended',
        message: "You've been studying for a while!",
        action: "Take a 15-minute break to recharge."
      });
    }

    // Productivity insights
    if (metrics.productivityIndex > 85) {
      insights.push({
        id: 'high-productivity',
        type: 'success',
        icon: <Zap className="w-5 h-5" />,
        title: 'Peak Productivity',
        message: "You're in your optimal learning state!",
        action: "This is the perfect time for challenging topics."
      });
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const insights = generateInsights();

  const getInsightColors = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'danger': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'info': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        <Brain className="w-5 h-5 text-blue-400" />
        AI Insights
      </h3>
      
      {insights.length === 0 ? (
        <div className="text-center py-6">
          <Brain className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
          <p className="text-gray-400 text-sm">Analyzing your study patterns...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getInsightColors(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm opacity-90 mb-2">{insight.message}</p>
                  <div className="text-xs font-medium opacity-75 bg-white/10 rounded px-2 py-1 inline-block">
                    💡 {insight.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Study Tips */}
      <div className="mt-6 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <h4 className="text-sm font-semibold text-purple-400 mb-2">💡 Study Tip</h4>
        <p className="text-xs text-gray-300">
          The Pomodoro Technique: 25 minutes focused work + 5 minute break = improved concentration and retention.
        </p>
      </div>
    </div>
  );
};

export default AIInsights;