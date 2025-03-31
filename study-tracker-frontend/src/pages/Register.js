import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const webcamRef = React.useRef(null);

    // Capture Face Image
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    };

    // Handle Registration
    const handleRegister = async () => {
        const userId = uuidv4();
        const userData = { userId, name, email, password, image };

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert("Registration Successful!");
                navigate("/dashboard");
            } else {
                alert("Registration Failed!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} className="p-2 border rounded w-80 mb-2"/>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded w-80 mb-2"/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded w-80 mb-2"/>
            
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-64 h-48 mb-2"/>
            <button onClick={capture} className="px-4 py-2 bg-gray-500 text-white rounded mb-2">Capture Face</button>

            <button onClick={handleRegister} className="px-6 py-2 bg-green-500 text-white rounded">Register</button>
        </div>
    );
};

export default Register;
