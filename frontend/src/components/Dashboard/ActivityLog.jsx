import React from "react";

const ActivityLog = () => {
  const logs = [
    { task: "Completed Math Quiz", time: "Aug 15, 10:30 AM" },
    { task: "Watched Science Video", time: "Aug 15, 09:00 AM" },
    { task: "Submitted English Assignment", time: "Aug 14, 05:45 PM" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent Activities</h2>
      <ul className="space-y-4">
        {logs.map((log, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300"
          >
            <span className="text-gray-700 font-medium">{log.task}</span>
            <span className="text-gray-500 text-sm">{log.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
