import React, { useState } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPage.css";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null);
  const webcamRef = React.useRef(null);
  const navigate = useNavigate();

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc); // Save the captured image (base64 string)
  };

  const handleAuth = async () => {
    if (isRegister) {
      if (!email || !password || !image) {
        alert("Please fill in all fields and capture your face.");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("faceData", image.split(",")[1]); // Send base64 image string to backend

      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          alert(`Registration successful! Your user ID is: ${data.userId}`);
          navigate("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error registering user:", error);
        alert("An error occurred while registering.");
      }
    } else {
      // Login logic
      if (!userId || !password || !image) {
        alert("Please fill in all fields and capture your face.");
        return;
      }

      const loginData = {
        userId,
        password,
        faceData: image.split(",")[1], // Send face data for face recognition
      };

      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        const data = await response.json();
        if (data.success) {
          alert("Login successful!");
          navigate("/dashboard");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <div className="auth-buttons">
          <button onClick={() => setIsRegister(false)} className="auth-btn login">Login</button>
          <button onClick={() => setIsRegister(true)} className="auth-btn register">Register</button>
        </div>
        <div className="form-container">
          {isRegister ? (
            <>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          ) : (
            <>
              <input type="text" placeholder="User ID / Email" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </>
          )}
          <div className="webcam-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" />
            <button onClick={capture} className="capture-btn">Capture Face</button>
          </div>
        </div>
        <button onClick={handleAuth} className="auth-btn submit">{isRegister ? "Register" : "Login"}</button>
      </div>
    </div>
  );
};

export default AuthPage;
