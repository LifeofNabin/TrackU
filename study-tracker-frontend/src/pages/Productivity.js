import React from "react";
import ProgressBar from "../components/ProgressBar"; 


const students = [
  { id: 1, name: "John Doe", progress: 80 },
  { id: 2, name: "Jane Smith", progress: 60 },
  { id: 3, name: "Alice Johnson", progress: 90 }
];

const Productivity = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {students.map((student) => (
        <div key={student.id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{student.name}</h3>
          <ProgressBar progress={student.progress} />
        </div>
      ))}
    </div>
  );
};

export default Productivity;
