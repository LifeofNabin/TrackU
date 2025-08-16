import React from "react";

const PerformanceChart = () => {
  const progressData = [
    { subject: "Math", score: 85 },
    { subject: "Science", score: 75 },
    { subject: "English", score: 90 },
    { subject: "History", score: 70 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Performance Overview</h2>
      <div className="space-y-5">
        {progressData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-gray-700 font-medium">{item.subject}</span>
              <span className="text-gray-500">{item.score}%</span>
            </div>
            <div className="w-full bg-gray-200 h-5 rounded-full">
              <div
                className="bg-blue-500 h-5 rounded-full"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
