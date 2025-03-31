import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const webcamRef = React.useRef(null);

    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, password }),
        });

        if (response.ok) {
            navigate("/dashboard");
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} className="p-2 border rounded w-80 mb-2"/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded w-80 mb-2"/>
            
            <button onClick={handleLogin} className="px-6 py-2 bg-blue-500 text-white rounded">Login</button>
        </div>
    );
};

export default Login;
