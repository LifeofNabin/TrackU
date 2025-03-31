import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const Dashboard = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 100 ? prev + 10 : 100));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Study Dashboard</h2>

            <div className="w-full max-w-md bg-gray-200 rounded-full">
                <div className="bg-blue-500 text-xs font-medium text-white text-center p-1 leading-none rounded-full" style={{ width: `${progress}%` }}>
                    {progress}%
                </div>
            </div>

            <Webcam className="w-64 h-48 mt-4"/>
        </div>
    );
};

export default Dashboard;
