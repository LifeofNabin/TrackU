import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
  const getAlertColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        Live Alerts
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-sm">All systems normal</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg ${getAlertColor(alert.type)}/20 border border-current animate-in slide-in-from-top-2 duration-300`}
            >
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 ${alert.type === 'success' ? 'text-green-400' : 
                  alert.type === 'warning' ? 'text-yellow-400' : 
                  alert.type === 'danger' ? 'text-red-400' : 'text-blue-400'}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{alert.message}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;